import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

function EditUserForm({ user, onSave, onCancel }) {
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = () => {
    // Effectuez ici la logique de sauvegarde des modifications
    onSave(editedUser);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h3>Modifier l'utilisateur</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="E-mail"
            value={editedUser.email}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Prénom"
            value={editedUser.firstName}
            onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nom"
            value={editedUser.lastName}
            onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Rôle</Form.Label>
          <Form.Select
            value={editedUser.role}
            onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" onClick={handleSave}>Enregistrer</Button>
        <Button variant="danger" onClick={handleCancel}>Annuler</Button>
      </Form>
    </div>
  );
}

export default EditUserForm;
