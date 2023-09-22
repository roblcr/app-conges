import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Button, Container } from 'react-bootstrap';
import LeaveRequestForm from './LeaveRequestForm';
import { signOut } from 'firebase/auth';

function CongeCalendar() {
  const [events, setEvents] = useState([]);
  const [showLeaveRequestForm, setShowLeaveRequestForm] = useState(false);
  const today = new Date().toISOString();
  const [initialStartDate, setInitialStartDate] = useState(null); // État pour la date de début initiale
  const [initialEndDate, setInitialEndDate] = useState(null); // État pour la date de fin initiale
  const [startDate, setStartDate] = useState(''); // État pour la date de début
  const [endDate, setEndDate] = useState(''); // État pour la date de fin
  const [user, setUser] = useState(null); // État pour stocker l'utilisateur authentifié

  useEffect(() => {
    // Utilisez onAuthStateChanged pour écouter les changements d'état d'authentification
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // L'utilisateur est authentifié, mettez à jour l'état avec l'utilisateur authentifié
        setUser(authUser);
      } else {
        // L'utilisateur n'est pas authentifié, mettez à jour l'état avec null
        setUser(null);
      }
    });

    // Assurez-vous de vous désabonner lorsque le composant est démonté
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchData = async () => {
    try {
      const q = query(collection(db, 'conges'));
      const querySnapshot = await getDocs(q);
      const eventsData = [];

      querySnapshot.forEach((doc) => {
        const eventData = doc.data();

        // Convertissez les chaînes de caractères en objets Date
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);

        eventsData.push({
          title: eventData.leaveType,
          start: startDate,
          end: endDate,
        });
      });

      setEvents(eventsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de congé :', error);
    }
  };

  useEffect(() => {
    // Appelez fetchData pour charger les données initiales lorsque le composant est monté
    fetchData();
  }, [user]);
  
  

  const handleSelect = (arg) => {
    setShowLeaveRequestForm(true);
    setInitialStartDate(arg.startStr); // Mettez à jour les dates initiales
    setInitialEndDate(arg.endStr); // Mettez à jour les dates initiales
    setStartDate(arg.startStr); // Mettez à jour les dates modifiables
    setEndDate(arg.endStr); // Mettez à jour les dates modifiables
  };

  const handleLeaveRequestSubmit = (leaveRequest) => {
    // Obtenez l'UID de l'utilisateur actuellement authentifié
    const uid = auth.currentUser.uid;
  
    // Ajoutez l'UID de l'utilisateur à la demande de congé
    leaveRequest.uid = uid;
  
    // Envoyez la demande de congé à Firestore ici
    // leaveRequest contiendra les données sélectionnées par l'utilisateur
    addDoc(collection(db, 'conges'), leaveRequest)
      .then(() => {
        // La demande de congé a été ajoutée avec succès
        // Vous pouvez également mettre à jour votre calendrier ici si nécessaire
        console.log('Demande de congé ajoutée avec succès :', leaveRequest);

        fetchData()

        setShowLeaveRequestForm(false); // Fermez la popup après avoir soumis la demande
        setStartDate(''); // Réinitialisez les dates modifiables
        setEndDate(''); // Réinitialisez les dates modifiables
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

  return (
    <Container>
      <div>
        <h1>Calendrier de congé</h1>
        <Button variant="primary" onClick={handleSignOut}>
          Se déconnecter
        </Button>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={true}
          select={handleSelect}
          validRange={{
            start: today, // À partir d'aujourd'hui
          }}
        />
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
