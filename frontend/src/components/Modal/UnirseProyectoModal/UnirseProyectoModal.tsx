import React, { useState } from "react";
import { authFetch } from "../../../utils/authFetch";
import "./UnirseProyectoModal.css";

interface ModalUnirseProyectoProps {
  onClose: () => void;
  onUnido: () => void; // para actualizar lista o estado en padre
}

const UnirseProyectoModal: React.FC<ModalUnirseProyectoProps> = ({ onClose, onUnido }) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!codigo.trim()) {
      setError("Ingresa un código válido");
      return;
    }
    setCargando(true);
    try {
      const data = await authFetch(`${api_url}/api/projects/join`, {
        method: "PATCH",
        body: JSON.stringify({ codigo }),
      });
      alert(data.mensaje || "¡Te has unido al proyecto correctamente!");
      onUnido();
      onClose();
    } catch (e: any) {
      setError(e.message || "Error: El código no es válido o ya participas en el proyecto.");
      console.error(e);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay-unirse" onClick={onClose}>
      <div className="modal-content-unirse" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Unirse a un Proyecto</h3>
        <p className="modal-subtitle">Ingresa el código de invitación que te compartieron.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="codigo-proyecto">Código de Proyecto</label>
            <input
              id="codigo-proyecto"
              type="text"
              className="modal-input"
              placeholder="Ej: AbC12XyZ"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.trim())}
              autoFocus
            />
          </div>
          
          {error && <p className="modal-error">{error}</p>}
          
          <div className="modal-actions-join">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={cargando}>
              {cargando ? "Uniéndote..." : "Unirse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnirseProyectoModal;
