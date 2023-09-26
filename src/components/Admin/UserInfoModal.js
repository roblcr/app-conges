import { Badge, Button, Modal, Table } from "react-bootstrap";

function UserInfoModal({ user, onClose, conges, typesConges }) {

    // Fonction pour formater une date au format français (dd/mm/yyyy)
    const formatDateToFrench = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
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
                                    <td>{formatDateToFrench(conge.startDate)}</td>
                                    <td>{formatDateToFrench(conge.endDate)}</td>
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


