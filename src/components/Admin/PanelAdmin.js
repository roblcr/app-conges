import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, Offcanvas, Table } from 'react-bootstrap';
import FormUsers from './FormUsers';
import ListUsers from './ListUsers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';
import { RotatingLines } from 'react-loader-spinner';

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
    return <RotatingLines
    strokeColor="grey"
    strokeWidth="5"
    animationDuration="0.75"
    width="96"
    visible={true}
  />
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

  console.log(pendingLeaves)

  return (
    <Container>
      <div className="text-center mt-4">
        <h1>Panel Admin</h1>
        <Button variant="primary mb-3" onClick={handleShowOffCanvas}>
          Ajouter un utilisateur
        </Button>
        <Button variant="info mb-3" onClick={() => navigate('/')}>
          Revenir au calendrier
        </Button>
      </div>

      {/* Afficher les congés en attente ici */}
      <div>
  <h2>Congés en attente de validation</h2>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Nom</th>
        <th>Date de début</th>
        <th>Date de fin</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {pendingLeaves.map((leave) => (
        <tr key={leave.id}>
          <td>{leave.userName}</td>
          <td>{leave.startDate}</td>
          <td>{leave.endDate}</td>
          <td>
            <Button
              variant="success"
              onClick={() => handleApproveLeave(leave.id)}
            >
              Valider
            </Button>
            <Button
              variant="danger"
              onClick={() => handleRejectLeave(leave.id)}
            >
              Refuser
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>


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
