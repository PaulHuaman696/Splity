import React, { useState } from "react";
import "./CrearItemModal.css";

interface CrearItemModalProps {
  onClose: () => void;
  onItemCreado: (nuevoItem: {
    _id: string;
    nombre: string;
    categoria: { _id: string; nombre: string };
  }) => void;
}

const CrearItemModal: React.FC<CrearItemModalProps> = ({
  onClose,
  onItemCreado,
}) => {
  const [nombre, setNombre] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [categorias, setCategorias] = useState<
    { _id: string; nombre: string }[]
  >([]);
  const api_url = import.meta.env.VITE_API_URL;
  // Obtener las categorías disponibles
  React.useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${api_url}/api/categories`, {
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
      alert(
        "Por favor, ingrese el nombre del ítem y seleccione una categoría."
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${api_url}/api/items`, {
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
    <div className="modal-overlay">
      <div className="modal-container">
        <h3 className="modal-title">Crear Nuevo Ítem</h3>
        <form onSubmit={handleSubmit} className="form">
          <label className="label">
            Nombre del ítem:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
              required
            />
          </label>

          <label className="label">
            Categoría:
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="input"
              required>
              <option value="">-- Selecciona una categoría --</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="buttons-container">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button">
              Crear Ítem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearItemModal;
