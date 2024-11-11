interface DeleteModalProps {
    id: number;
    show: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ id, show, onCancel, onConfirm }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            {" "}
            <div className="w-96 rounded-lg border-2 border-slate-500 bg-slate-100 shadow-lg">
                {" "}
                <div className="flex items-center justify-between border-b-2 p-4">
                    {" "}
                    <h2 className="text-lg font-medium">Confirmar Eliminación</h2>{" "}
                    <button onClick={onCancel} className="text-xl text-black focus:outline-none">
                        {" "}
                        &times;{" "}
                    </button>{" "}
                </div>{" "}
                <div className="border-b-2 p-4">
                    {" "}
                    ¿Estás seguro de que deseas eliminar la incidencia con ID: {id}?{" "}
                </div>{" "}
                <div className="flex justify-end space-x-2 border-t p-4">
                    {" "}
                    <button
                        onClick={onCancel}
                        className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-gray-400"
                    >
                        {" "}
                        Cancelar{" "}
                    </button>{" "}
                    <button
                        onClick={onConfirm}
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        {" "}
                        Eliminar{" "}
                    </button>{" "}
                </div>{" "}
            </div>{" "}
        </div>
    );
};
export default DeleteModal;
