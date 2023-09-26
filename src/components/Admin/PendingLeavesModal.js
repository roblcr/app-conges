import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const formatDateToFrench = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const PendingLeavesModal = ({ show, onHide, pendingLeaves, handleApproveLeave, handleRejectLeave }) => {
  return (
    <Modal show={show} onHide={onHide} centered size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Congés en attente de validation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th className="text-center">Nom</th>
              <th className="text-center">Date de début</th>
              <th className="text-center">Date de fin</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.map((leave) => (
              <tr key={leave.id}>
                <td className="text-center">{leave.userName}</td>
                <td className="text-center">{formatDateToFrench(leave.startDate)}</td>
                <td className="text-center">{formatDateToFrench(leave.endDate)}</td>
                <td className='d-flex justify-content-evenly'>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PendingLeavesModal;
