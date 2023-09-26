import React, { useEffect, useState } from 'react';
import { Table, Button, Offcanvas } from 'react-bootstrap';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import EditUserForm from './EditUserForm'; // Importez votre composant de formulaire de modification
import UserInfoModal from './UserInfoModal';
import { deleteUser } from 'firebase/auth';

function ListUsers(props) {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [editedUser, setEditedUser] = useState(null);
  const [showEditOffCanvas, setShowEditOffCanvas] = useState(false); // Ajoutez cet état
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [congesUtilisateur, setCongesUtilisateur] = useState([]); // Ajoutez cet état



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
      // Supprimez l'utilisateur de l'authentification Firebase en utilisant son UID
      // await deleteUser(auth, id);
  
      // Ensuite, supprimez l'utilisateur de la collection "users" dans Firestore
      await deleteDoc(doc(db, 'users', id));
  
      // Mettez à jour la liste des utilisateurs après la suppression
      setUtilisateurs((prevState) => prevState.filter((user) => user.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    }
  };

  const handleEditUser = (user) => {
    setEditedUser(user);
    setShowEditOffCanvas(true); // Affichez le Offcanvas de modification
  };

  const handleSaveEdit = async (editedUser) => {
    try {
      // Effectuez ici la logique de sauvegarde des modifications dans la base de données
      await updateDoc(doc(db, 'users', editedUser.id), {
        email: editedUser.email,
        role: editedUser.role,
        firstName: editedUser.firstName,
        lastName: editedUser.lastName,
      });

      // Mettez à jour la liste des utilisateurs
      const updatedUsers = utilisateurs.map((user) =>
        user.id === editedUser.id ? editedUser : user
      );
      setUtilisateurs(updatedUsers);

      // Cachez le Offcanvas de modification
      setShowEditOffCanvas(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    }
  };

  const handleCancelEdit = () => {
    // Annulez l'édition et cachez le Offcanvas de modification
    setShowEditOffCanvas(false);
  };

  const handleShowUserInfo = async (user) => {
    setSelectedUser(user);
    setShowUserInfoModal(true);

    // Récupérer les données de congé de l'utilisateur
    try {
      const congesQuery = query(collection(db, 'conges'), where('uid', '==', user.uid));
      const congesSnapshot = await getDocs(congesQuery);
      const congesData = [];
      congesSnapshot.forEach((doc) => {
        const conge = doc.data();
        conge.id = doc.id;
        congesData.push(conge);
      });
      setCongesUtilisateur(congesData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données de congé :', error);
    }
  };

  return (
    <>
      {/* <h3>Liste des utilisateurs</h3> */}
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
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
              <td className='d-flex justify-content-evenly'>
                <Button variant="warning" onClick={() => handleEditUser(utilisateur)}>
                  Modifier
                </Button>
                <Button variant="danger" onClick={() => handleDeleteUser(utilisateur.id)}>
                  Supprimer
                </Button>
                <Button variant="info" onClick={() => handleShowUserInfo(utilisateur)}>
                  Voir Infos
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
      {showEditOffCanvas && (
        <Offcanvas show={showEditOffCanvas} onHide={handleCancelEdit} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Modifier l'utilisateur</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <EditUserForm user={editedUser} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
          </Offcanvas.Body>
        </Offcanvas>
      )}
      {showUserInfoModal && (
        <UserInfoModal user={selectedUser} conges={congesUtilisateur} onClose={() => setShowUserInfoModal(false)} />
      )}
    </>
  );
}

export default ListUsers;
