import { Badge, Button, Modal, Table } from "react-bootstrap";

function UserInfoModal({ user, onClose, conges, typesConges }) {

    // Fonction pour formater une date au format français (dd/mm/yyyy)
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Notez que les mois sont 0-indexés
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
          case 'Validé':
            return 'success'; // Badge vert pour "Validé"
          case 'Refusé':
            return 'danger'; // Badge rouge pour "Refusé"
          case 'En attente':
            return 'warning'; // Badge jaune pour "En attente"
          default:
            return 'secondary'; // Autre statut, badge gris par défaut
        }
      };

      console.log(conges)

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Informations de {user.firstName} {user.lastName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <h4>Congés :</h4>
                {conges && conges.length > 0 && (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Date de début</th>
                        <th>Date de fin</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {conges.map((conge) => (
                        <tr key={conge.id}>
                        <td>{conge.leaveType}</td>
                        <td>{formatDate(new Date(conge.startDate))}</td>
                        <td>{formatDate(new Date(conge.endDate))}</td>
                        <td>
                            <Badge bg={getStatusBadgeVariant(conge.status)}>
                            {conge.status}
                            </Badge>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Fermer
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserInfoModal;

  
  