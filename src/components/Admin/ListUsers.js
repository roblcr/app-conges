import React, { useEffect, useState } from 'react';
import { Table, Modal, Button } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db, deleteUser as deleteAuthUser } from '../../firebase';

function ListUsers(props) {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);


  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const utilisateursRef = collection(db, 'users');
        const snapshot = await getDocs(utilisateursRef);
        const listeUtilisateurs = [];

        snapshot.forEach((doc) => {
          const utilisateur = doc.data();
          utilisateur.id = doc.id; // Ajoutez l'ID du document Firestore comme "id"
          listeUtilisateurs.push(utilisateur);
        });

        setUtilisateurs(listeUtilisateurs);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
      }
    };

    fetchUtilisateurs();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, 'users', id));
      // Mettez à jour la liste des utilisateurs après la suppression
      setUtilisateurs((prevState) => prevState.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    }
  };

  const handleEditUser = (user) => {
    setEditedUser(user);
  };

  const handleSaveEdit = (editedUser) => {
    // Effectuez ici la logique de sauvegarde des modifications dans la base de données
    // Puis mettez à jour la liste des utilisateurs
    // Enfin, cachez le formulaire d'édition en utilisant setShowEditForm(false)
  };
  
  const handleCancelEdit = () => {
    // Annulez l'édition et cachez le formulaire d'édition
    setShowEditForm(false);
  };

  return (
    <>
    <h3>Liste des utilisateurs</h3>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>E-mail</th>
          <th>Nom</th>
          <th>Prénom</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {utilisateurs.map((utilisateur) => (
          <tr key={utilisateur.id}>
            <td>{utilisateur.email}</td>
            <td>{utilisateur.lastName}</td>
            <td>{utilisateur.firstName}</td>
            <td>{utilisateur.role}</td>
            <td>
              <Button variant="warning" onClick={() => handleEditUser(utilisateur)}>
                Modifier
              </Button>
              <Button variant="danger" onClick={() => handleDeleteUser(utilisateur.id)}>
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
  );
}

export default ListUsers;
