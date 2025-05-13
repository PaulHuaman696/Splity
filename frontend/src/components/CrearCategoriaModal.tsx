// components/CrearCategoriaModal.tsx
import React, { useState } from "react";

interface Props {
  onClose: () => void;
  onCategoriaCreada: (nuevaCategoria: { _id: string; nombre: string }) => void;
}

const CrearCategoriaModal: React.FC<Props> = ({ onClose, onCategoriaCreada }) => {
  const [nombre, setNombre] = useState("");

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/categories", {
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
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3>Crear nueva categoría</h3>
        <form onSubmit={handleCrear}>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de categoría"
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Crear</button>
          <button type="button" onClick={onClose} style={{ marginLeft: "10px" }}>Cancelar</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  input: {
    padding: "8px",
    marginTop: "10px",
    marginBottom: "10px",
    width: "100%",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default CrearCategoriaModal;
