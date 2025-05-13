import React, { useState } from "react";

interface CrearItemModalProps {
  onClose: () => void;
  onItemCreado: (nuevoItem: { _id: string; nombre: string; categoriaId: string }) => void;
}

const CrearItemModal: React.FC<CrearItemModalProps> = ({ onClose, onItemCreado }) => {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<{ _id: string; nombre: string }[]>([]);

  // Obtener las categorías disponibles
  React.useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/categories", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !categoriaId) {
      alert("Por favor, ingrese el nombre del ítem y seleccione una categoría.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          categoriaId,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear el ítem");
      }

      const nuevoItem = await response.json();
      onItemCreado(nuevoItem); // Notificar que se creó el ítem
      onClose(); // Cerrar el modal
    } catch (error) {
      console.error("Error al crear el ítem:", error);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContainer}>
        <h3 style={styles.modalTitle}>Crear Nuevo Ítem</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nombre del ítem:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Categoría:
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <div style={styles.buttonsContainer}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" style={styles.submitButton}>
              Crear Ítem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: "20px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontWeight: "bold",
    color: "#374151",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4f46e5",
    color: "#fff",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};

export default CrearItemModal;
