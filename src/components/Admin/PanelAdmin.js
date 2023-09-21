import React, { useState } from 'react';
import { Button, Container, Modal, Offcanvas } from 'react-bootstrap';
import FormUsers from './FormUsers';
import ListUsers from './ListUsers';

const PanelAdmin = () => {
  const [showListeModal, setShowListeModal] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [userListKey, setUserListKey] = useState(0);
  const [userToEdit, setUserToEdit] = useState(null); // Initialisez userToEdit à null

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