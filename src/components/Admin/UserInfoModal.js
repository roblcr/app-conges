import { Button, Modal } from "react-bootstrap";

function UserInfoModal({ user, onClose, conges, typesConges }) {
    console.log(conges);
    
    // Fonction pour formater une date au format français (dd/mm/yyyy)
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Notez que les mois sont 0-indexés
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <Modal show={true} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Informations de l'utilisateur</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Nom : {user.lastName}</h4>
                <h4>Prénom : {user.firstName}</h4>
                {/* Affichez les informations de congé ici */}
                <h4>Congés :</h4>
                {conges && conges.length > 0 && (
                    <ul>
                        {conges.map((conge) => (
                            <li key={conge.id}>
                                Type : {conge.leaveType} - Du {formatDate(new Date(conge.startDate))} au {formatDate(new Date(conge.endDate))}
                            </li>
                        ))}
                    </ul>
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

  
  