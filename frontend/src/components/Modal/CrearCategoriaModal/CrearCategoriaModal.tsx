// components/CrearCategoriaModal.tsx
import React, { useState } from "react";
import "./CrearCategoriaModal.css";

interface Props {
  onClose: () => void;
  onCategoriaCreada: (nuevaCategoria: { _id: string; nombre: string }) => void;
}

const CrearCategoriaModal: React.FC<Props> = ({
  onClose,
  onCategoriaCreada,
}) => {
  const [nombre, setNombre] = useState("");
  const api_url = import.meta.env.VITE_API_URL;
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api_url}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();
      if (response.ok) {
        onCategoriaCreada(data); // notificar al padre
        onClose(); // cerrar modal
      } else {
        alert(data.message || "Error al crear categoría");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="crear-overlay">
      <div className="crear-modal">
        <h3>Crear nueva categoría</h3>
        <form onSubmit={handleCrear}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de categoría"
            required
            className="crear-input"
          />
          <button type="submit" className="crear-button">
            Crear
          </button>
          <button
            type="button"
            onClick={onClose}
            className="crear-cancel-button">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CrearCategoriaModal;
