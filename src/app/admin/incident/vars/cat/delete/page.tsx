import { Button, Modal } from "react-bootstrap";

interface DeleteModalProps {
    id: number;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, onCancel, onConfirm }) => {
    return (
        <Modal show onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Estás seguro de que deseas eliminar la Categoría con ID: {id}?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    onClick={() => {
                        onConfirm();
                        onCancel();
                    }}
                >
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
