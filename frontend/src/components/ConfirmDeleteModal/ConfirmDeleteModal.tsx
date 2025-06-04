// src/components/ConfirmDeleteModal.tsx
import { authFetch } from "../../utils/authFetch";
import "./ConfirmDeleteModal.css";

interface Props {
  gastoId: string;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ConfirmDeleteModal({
  gastoId,
  onClose,
  onDeleted,
}: Props) {
const api_url = import.meta.env.VITE_API_URL;
  const handleDelete = async () => {
    try {
      await authFetch(`${api_url}/api/expense/${gastoId}`, {
        method: "DELETE",
      });
      onDeleted();
      onClose();
    } catch (err) {
      console.error("Error al eliminar gasto:", err);
      alert("No se pudo eliminar el gasto");
    }
  };

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <h3 className="confirm-title">Confirmar Eliminación</h3>
        <p className="confirm-message">
          ¿Está seguro que desea eliminar este gasto? No podrá deshacerlo.
        </p>
        <div className="confirm-actions">
          <button
            className="confirm-button confirm-cancel"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="confirm-button confirm-delete"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
