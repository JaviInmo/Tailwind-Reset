interface DeleteModalProps {
    id: number;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, onCancel, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center border-b p-4">
                    <h2 className="text-lg font-medium">Confirmar Eliminación</h2>
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                <div className="p-4">
                    ¿Estás seguro de que deseas eliminar la incidencia con ID: {id}?
                </div>
                <div className="flex justify-end space-x-2 border-t p-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;
