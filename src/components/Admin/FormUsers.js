import React, { useEffect, useState } from 'react';
import { auth, db, createUserWithEmailAndPassword, collection, addDoc, getAuth } from '../../firebase'; // Assurez-vous d'importer les fonctions nécessaires depuis firebase
import { Form, FormControl, Button, Container } from 'react-bootstrap';
import { doc, updateDoc } from 'firebase/firestore';

function FormUsers(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Par défaut, définissez le rôle sur "user"
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');

  useEffect(() => {
    if (props.user) {
      setEmail(props.user.email || '');
      setFirstname(props.user.firstName || '');
      setLastname(props.user.lastName || '');
      setRole(props.user.role || 'user');
    }
  }, [props.user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (props.user) {
        // Mettez à jour l'utilisateur existant
        await updateDoc(doc(db, 'users', props.user.id), {
          email: email,
          role: role,
          firstName: firstName,
          lastName: lastName,
        });
      } else {
        // Créez un nouvel utilisateur avec email et mot de passe en utilisant createUserWithEmailAndPassword
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Ajoutez l'utilisateur à la base de données Firestore avec l'UID comme identifiant
        await addDoc(collection(db, 'users'), {
          uid: user.uid,
          email: email,
          role: role,
          firstName: firstName,
          lastName: lastName,
        });
      }

      // Réinitialisez les champs du formulaire
      setEmail('');
      setPassword('');
      setFirstname('');
      setLastname('');
      setRole('user');

      props.refreshList();
      props.closeModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    }
  };

  return (
    <Container>
      <div>
        <h2 className="mt-4">Ajouter un utilisateur</h2>
        <Form onSubmit={handleFormSubmit} className="mt-3">
          <Form.Group className="mb-3">
            <FormControl
              type="text"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormControl
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormControl
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <FormControl
              type="text"
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sélectionnez le rôle:</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </Form.Select>
          </Form.Group>
          <Button type="submit" variant="primary">Ajouter</Button>
        </Form>
      </div>
    </Container>
  );
}

export default FormUsers;
