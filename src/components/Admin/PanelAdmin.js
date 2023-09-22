import React, { useEffect, useState } from 'react';
import { Button, Container, Modal, Offcanvas } from 'react-bootstrap';
import FormUsers from './FormUsers';
import ListUsers from './ListUsers';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom/dist';

const PanelAdmin = () => {
  const [showListeModal, setShowListeModal] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [userListKey, setUserListKey] = useState(0);
  const [userToEdit, setUserToEdit] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    // Si l'utilisateur n'est pas administrateur, redirigez-le vers une autre page
    navigate('/login')
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

  return (
    <Container>
      <div className="text-center mt-4">
        <h1>Panel Admin</h1>
        <Button variant="primary mb-3" onClick={handleShowOffCanvas}>
          Ajouter un utilisateur
        </Button>
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
