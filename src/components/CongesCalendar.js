import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Button, Container } from 'react-bootstrap';
import LeaveRequestForm from './LeaveRequestForm';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom/dist';
import { RotatingLines } from 'react-loader-spinner';
import { BoxArrowRight, Calendar, Gear } from 'react-bootstrap-icons';
import { Tooltip } from 'react-tooltip';
import CalendarComponent from './Calendar';

function CongeCalendar() {
  const [events, setEvents] = useState([]);
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const today = new Date().toISOString();
  const [initialStartDate, setInitialStartDate] = useState(null); // État pour la date de début initiale
  const [initialEndDate, setInitialEndDate] = useState(null); // État pour la date de fin initiale
  const [startDate, setStartDate] = useState(''); // État pour la date de début
  const [endDate, setEndDate] = useState(''); // État pour la date de fin
  const [isLoading, setIsLoading] = useState(true); // État pour le chargement initial
  const [user, setUser] = useState(null); // État pour stocker l'utilisateur authentifié
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    // Utilisez onAuthStateChanged pour écouter les changements d'état d'authentification
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);

        try {
          const q = query(collection(db, 'users'), where('uid', '==', authUser.uid), where('role', '==', 'admin'));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    })

    // Assurez-vous de vous désabonner lorsque le composant est démonté
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      // Créez une requête pour récupérer les données de congé avec les informations de l'utilisateur correspondant
      const q = query(collection(db, 'conges'), where('status', '!=', 'Refusé'));
      const querySnapshot = await getDocs(q);
      const eventsData = [];

      // Parcourez les documents de demande de congé
      for (const doc of querySnapshot.docs) {
        const eventData = doc.data();
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);

        // Récupérez l'UID de l'utilisateur à partir de la demande de congé
        const userUid = eventData.uid;

        // Créez une requête pour récupérer les informations de l'utilisateur correspondant à cet UID
        const userQuery = query(collection(db, 'users'), where('uid', '==', userUid));
        const userQuerySnapshot = await getDocs(userQuery);

        if (userQuerySnapshot.docs.length > 0) {
          // Si un utilisateur correspondant est trouvé, utilisez ses informations pour définir le titre de l'événement
          const userData = userQuerySnapshot.docs[0].data();
          const eventTitle = `${userData.firstName} ${userData.lastName}`;

          eventsData.push({
            title: eventTitle,
            start: startDate,
            end: endDate,
            extendedProps: {
              leaveType: eventData.leaveType,
              status: eventData.status
            },
          });
        } else {
          console.error('Utilisateur non trouvé dans la collection "users".');
        }
      }

      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de congé :', error);
    }
  };


  useEffect(() => {
    // Appelez fetchData pour charger les données initiales lorsque le composant est monté
    fetchData();
  }, [user]);

  useEffect(() => {
    // Simulez un délai de chargement pour illustrer l'utilisation du loader
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Mettez la valeur appropriée pour votre cas réel
  }, []);

  // Ajoutez une condition pour rediriger si l'utilisateur n'est pas connecté
  if (!user) {
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh', // Hauteur de la vue (100% de la fenêtre)
        }}
      >
        <RotatingLines
          strokeColor="grey"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
    );
  }



  const handleSelect = (arg) => {
    setShowLeaveRequestForm(true);
    setInitialStartDate(arg.startStr); // Mettez à jour les dates initiales
    setInitialEndDate(arg.endStr); // Mettez à jour les dates initiales
    setStartDate(arg.startStr); // Mettez à jour les dates modifiables
    setEndDate(arg.endStr); // Mettez à jour les dates modifiables
  };

  const handleLeaveRequestSubmit = (leaveRequest) => {
    const uid = auth.currentUser.uid;

    // Obtenez le type de congé à partir du formulaire de demande
    const leaveType = leaveRequest.leaveType; // Assurez-vous que c'est la propriété correcte du formulaire

    leaveRequest.uid = uid;
    leaveRequest.leaveType = leaveType;
    leaveRequest.status = 'En attente';

    console.log(leaveType)

    addDoc(collection(db, 'conges'), leaveRequest)
      .then(() => {
        const userRef = query(collection(db, 'users'), where('uid', '==', uid));
        getDocs(userRef)
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // Il devrait y avoir un seul document correspondant à cet UID
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              console.log('Nom de l\'utilisateur :', userData.lastName);
              console.log('Prénom de l\'utilisateur :', userData.firstName);
            } else {
              console.error('Utilisateur non trouvé dans la collection "users".');
            }
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données de l\'utilisateur :', error);
          });

        fetchData();
        setShowLeaveRequestForm(false);
        setStartDate('');
        setEndDate('');
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout de la demande de congé :', error);
      });
  };



  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Après la déconnexion réussie, redirigez l'utilisateur vers la page de connexion ou une autre page de votre choix.
      // Vous pouvez utiliser un composant de redirection de bibliothèque de routage ou JavaScript `window.location` pour cela.
      // Par exemple, pour rediriger vers la page de connexion, vous pouvez faire :
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion :', error);
    }
  };

  const iconStyle = {
    fontSize: '24px',
    marginBottom: '1px',
  };

  const buttonStyle = {
    fontSize: '18px',
    borderRadius: '50px',
    padding: '10px 20px',
    // background: 'green',
    color: 'white',
    transition: 'background-color 0.2s',
  };

  return (
    <Container>
      <div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div>
            <Button variant="warning" className='admin' onClick={() => navigate('/admin')} style={buttonStyle}>
              <Gear style={iconStyle} className="mr-2" />
              <Tooltip
                anchorSelect='.admin'
                content="Accéder a l'administration"
              ></Tooltip>

            </Button>
          </div>
          <div>
            <Button variant="primary" className='logout' onClick={handleSignOut} style={buttonStyle}>
              <BoxArrowRight style={iconStyle} className="mr-2" />
              <Tooltip
                anchorSelect='.logout'
                content='Déconnexion'
              ></Tooltip>
            </Button>
          </div>
        </div>
        <div className='d-flex mt-2 justify-content-center'>
          <div className="legend">
            <h2>Légende</h2>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'green' }}></div>
              <div className="legend-text">RTT</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'red' }}></div>
              <div className="legend-text">Vacances</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'blue' }}></div>
              <div className="legend-text">Rendez-Vous</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'purple' }}></div>
              <div className="legend-text">Maladie</div>
            </div>
            <div className="legend-item">
              <div className="legend-color" style={{ backgroundColor: 'grey' }}></div>
              <div className="legend-text">En attente</div>
            </div>
          </div>
        </div>

        <CalendarComponent events={events} handleSelect={handleSelect} today={today} />


      </div>
      <LeaveRequestForm
        show={showLeaveRequestForm}
        onHide={() => setShowLeaveRequestForm(false)}
        initialStartDate={initialStartDate}
        initialEndDate={initialEndDate}
        startDate={startDate}
        endDate={endDate}
        onSubmit={handleLeaveRequestSubmit}
      />
    </Container>
  );
}

export default CongeCalendar;
