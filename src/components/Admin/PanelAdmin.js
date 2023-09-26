import React, { useEffect, useState } from 'react';
import { Badge, Button, Container, Modal, Offcanvas, Table } from 'react-bootstrap';
import FormUsers from './FormUsers';
import ListUsers from './ListUsers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';
import { RotatingLines } from 'react-loader-spinner';
import { Calendar, List, PersonPlus } from 'react-bootstrap-icons';
import PendingLeavesModal from './PendingLeavesModal';
import { Tooltip } from 'react-tooltip';


const PanelAdmin = () => {
  const [showListeModal, setShowListeModal] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [userListKey, setUserListKey] = useState(0);
  const [userToEdit, setUserToEdit] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState([]); // État pour stocker les congés en attente
  const navigate = useNavigate();
  const numPendingLeaves = pendingLeaves.length;

  useEffect(() => {
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

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Chargez les congés en attente depuis Firestore ici
    const loadPendingLeaves = async () => {
      try {
        const q = query(collection(db, 'conges'), where('status', '==', 'En attente'));
        const querySnapshot = await getDocs(q);
        const leaves = [];

        for (const doc of querySnapshot.docs) {
          const leaveData = doc.data();

          // Récupérez l'utilisateur associé à cette demande de congé
          const userQuery = query(collection(db, 'users'), where('uid', '==', leaveData.uid));
          const userQuerySnapshot = await getDocs(userQuery);

          if (!userQuerySnapshot.empty) {
            const userData = userQuerySnapshot.docs[0].data();
            // Ajoutez le nom et le prénom de l'utilisateur à la demande de congé
            leaveData.userName = `${userData.firstName} ${userData.lastName}`;
          }

          leaves.push(leaveData);
        }

        setPendingLeaves(leaves);
      } catch (error) {
        console.error('Erreur lors du chargement des congés en attente :', error);
      }
    };


    if (isAdmin) {
      loadPendingLeaves();
    }
  }, [isAdmin]);

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

  if (!isAdmin) {
    // Si l'utilisateur n'est pas administrateur, redirigez-le vers une autre page
    navigate('/');
  }

  const handleShowListeModal = () => {
    setShowListeModal(true);
  };

  const handleCloseListeModal = () => {
    setShowListeModal(false);
  };

  const handleShowOffCanvas = () => {
    setShowOffCanvas(true);
  };

  const handleCloseOffCanvas = () => {
    setShowOffCanvas(false);
  };

  const refreshUserList = () => {
    setUserListKey((prevKey) => prevKey + 1);
  };

  // Fonction pour valider un congé
  const handleApproveLeave = async (id) => {
    try {
      // Créez une requête pour trouver le document de la demande de congé correspondante
      const q = query(collection(db, 'conges'), where('id', '==', id));
      const querySnapshot = await getDocs(q);

      // Assurez-vous qu'il y a un seul document correspondant
      if (!querySnapshot.empty) {
        const leaveDocRef = querySnapshot.docs[0].ref;

        // Mettez à jour le statut du congé à "Validé"
        await updateDoc(leaveDocRef, { status: 'Validé' });

        console.log('Demande de congé approuvée avec succès.');

        // Mettez à jour l'état local pour supprimer la demande de congé approuvée
        setPendingLeaves((prevLeaves) =>
          prevLeaves.filter((leave) => leave.id !== id)
        );
      } else {
        console.error('Demande de congé non trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande de congé :', error);
    }
  };



  // Fonction pour refuser un congé
  const handleRejectLeave = async (id) => {
    try {
      // Créez une requête pour trouver le document de la demande de congé correspondante
      const q = query(collection(db, 'conges'), where('id', '==', id));
      const querySnapshot = await getDocs(q);

      // Assurez-vous qu'il y a un seul document correspondant
      if (!querySnapshot.empty) {
        const leaveDocRef = querySnapshot.docs[0].ref;

        // Mettez à jour le statut du congé à "Validé"
        await updateDoc(leaveDocRef, { status: 'Refusé' });

        console.log('Demande de congé refusée avec succès.');

        // Mettez à jour l'état local pour supprimer la demande de congé approuvée
        setPendingLeaves((prevLeaves) =>
          prevLeaves.filter((leave) => leave.id !== id)
        );
      } else {
        console.error('Demande de congé non trouvée.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation de la demande de congé :', error);
    }
  };

  const iconStyle = {
    fontSize: '24px', // Ajustez la taille de l'icône selon vos préférences
    marginBottom: '1px'
  };

  const returnButtonStyle = {
    fontSize: '18px',     // Taille de la police
    borderRadius: '50px', // Bord arrondi pour un aspect élégant
    padding: '10px 20px', // Espacement interne
    background: 'green',  // Couleur de fond du bouton de retour
    color: 'white',       // Couleur du texte
    transition: 'background-color 0.2s', // Transition de couleur de fond
  };

  const addButtonStyle = {
    ...returnButtonStyle,
    background: '#007bff', // Couleur de fond du bouton d'ajout
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <Button
            variant="info"
            onClick={() => navigate('/')}
            className='btn-lg calendar'
            style={returnButtonStyle}
          >
            <Calendar style={iconStyle} />
          </Button>
          <Tooltip
            anchorSelect=".calendar"
            content="Retour au calendrier"
          />
        </div>
        <h1 className="m-0">Panel Admin</h1>
        <div className="d-flex align-items-center">
          <Button
            variant="primary"
            onClick={handleShowListeModal}
            className='btn-lg pending-leaves'
            style={returnButtonStyle}
          >
            <Tooltip
              anchorSelect=".pending-leaves"
              content="Congés en attente"
            />
            <List style={iconStyle} />
            {numPendingLeaves > 0 && (
              <Badge bg="danger" className="ml-2" style={{ position: 'absolute', top: '20px' }}>
                {numPendingLeaves}
              </Badge>
            )}
          </Button>

          {/* Ajoutez de la marge à droite entre les deux boutons */}
          <div style={{ marginLeft: "0.2em" }}>
            <Button
              variant="primary"
              onClick={handleShowOffCanvas}
              className='btn-lg add-user'
              style={addButtonStyle}
            >
              <Tooltip
                anchorSelect=".add-user"
                content="Ajouter un utilisateur"
              />
              <PersonPlus className="mr-2" style={iconStyle} />
            </Button>
          </div>
        </div>
      </div>


      {/* Modal pour afficher la liste des congés en attente */}
      <PendingLeavesModal
        show={showListeModal}
        onHide={handleCloseListeModal}
        pendingLeaves={pendingLeaves}
        handleApproveLeave={handleApproveLeave}
        handleRejectLeave={handleRejectLeave}
      />



      <ListUsers key={userListKey} />

      <Offcanvas show={showOffCanvas} onHide={handleCloseOffCanvas} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Ajouter un utilisateur</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <FormUsers user={userToEdit} closeModal={handleCloseOffCanvas} refreshList={refreshUserList} />
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
  );
};

export default PanelAdmin;
