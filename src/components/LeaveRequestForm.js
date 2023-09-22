import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';


const LeaveRequestForm = ({ show, onHide, onSubmit, initialStartDate, initialEndDate }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [error, setError] = useState('');

  // Utilisez useEffect pour mettre à jour les états lorsque initialStartDate et initialEndDate changent
  useEffect(() => {
    setStartDate(initialStartDate || '');
    setEndDate(initialEndDate || '');
  }, [initialStartDate, initialEndDate]);

  useEffect(() => {
    // Convertissez initialEndDate en une date JavaScript
    const endDate = new Date(initialEndDate);
  
    // Soustrayez un jour
    endDate.setDate(endDate.getDate() - 1);
  
    // Mettez à jour initialEndDate avec la nouvelle valeur
    setEndDate(endDate.toISOString().split('T')[0]);
  }, [initialEndDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Réinitialisez l'erreur à chaque soumission
    setError('');

    // Validez les données
    if (!startDate) {
      setError('Veuillez sélectionner une date de début.');
      return;
    }

    if (!endDate) {
      setError('Veuillez sélectionner une date de fin.');
      return;
    }

    if (startDate > endDate) {
      setError('La date de début ne peut pas être postérieure à la date de fin.');
      return;
    }

    if (!leaveType) {
      setError('Veuillez sélectionner un type de congé.');
      return;
    }

    // Générez un nouvel ID unique à l'aide de uuidv4()
    const leaveRequestId = uuidv4();

    // Si tout est valide, envoyez la demande de congé à l'aide de la fonction onSubmit
    const leaveRequest = {
      id: leaveRequestId, // Utilisez le nouvel ID unique
      startDate,
      endDate,
      leaveType,
      status: 'En attente',
    };
    onSubmit(leaveRequest);

    // Réinitialisez les champs et l'erreur après soumission
    setStartDate('');
    setEndDate('');
    setLeaveType('');
    setError('');
  };

  const handleModalHide = () => {
    // Réinitialisez les valeurs lorsque la modal est fermée
    setStartDate('');
    setEndDate('');
    setLeaveType('');

    onHide(); // Appelez onHide pour fermer la modal
  };

  return (
    <Modal show={show} onHide={handleModalHide}>
      <Modal.Header closeButton>
        <Modal.Title>Demande de congé</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="startDate">
            <Form.Label>Date de début</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label>Date de fin</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="leaveType">
            <Form.Label>Type de congé</Form.Label>
            <Form.Control
              as="select"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="">Sélectionnez le type de congé</option>
              <option value="RTT">RTT</option>
              <option value="Vacances">Vacances</option>
              <option value="Maladie">Maladie</option>
              <option value="Rendez-vous">Rendez-vous</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="error">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </Form.Group>
          <Button variant="primary" type="submit">
            Soumettre
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default LeaveRequestForm;
