import React, { useState } from "react";
import { authFetch } from "../utils/authFetch";

interface ModalUnirseProyectoProps {
  onClose: () => void;
  onUnido: () => void; // para actualizar lista o estado en padre
}

const UnirseProyectoModal: React.FC<ModalUnirseProyectoProps> = ({ onClose, onUnido }) => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const api_url = import.meta.env.VITE_API_URL;

  const handleUnirse = async () => {
    setError("");
    if (!codigo.trim()) {
      setError("Ingresa un código válido");
      return;
    }
    try {
      const data = await authFetch(`${api_url}/api/projects/join`, {
        method: "PATCH",
        body: JSON.stringify({ codigo }),
      });
      alert(data.mensaje || "Unido correctamente");
      alert("¡Te has unido al proyecto correctamente!");
      onUnido();
      onClose();
    } catch (e) {
      setError("Error en la solicitud");
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Unirse a Proyecto por Código</h3>
        <input
          type="text"
          placeholder="Ingresa código de proyecto"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button onClick={handleUnirse}>Unirse</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default UnirseProyectoModal;
