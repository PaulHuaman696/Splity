import React, { useState, useEffect } from "react";
import { authFetch } from "../../../utils/authFetch";
import "./EditGastoModal.css"; // Importamos el archivo CSS

interface Props {
  gasto: {
    _id: string;
    itemId: {
      _id: string;
      nombre: string;
      categoria: { _id: string; nombre: string };
    };
    monto: number;
    descripcion: string;
    fecha: string;
    proyectoId: {
      _id: string;
      nombre: string;
      descripcion: string;
    };
    tipo: string;
  };
  onClose: () => void;
  onSaved: () => void;
}

export default function EditGastoModal({ gasto, onClose, onSaved }: Props) {
  const [monto, setMonto] = useState(gasto.monto.toString());
  const [descripcion, setDescripcion] = useState(gasto.descripcion);
  const [fecha, setFecha] = useState(gasto.fecha.slice(0, 10));
  const [categorias, setCategorias] = useState<
    { _id: string; nombre: string }[]
  >([]);
  const [items, setItems] = useState<
    {
      _id: string;
      nombre: string;
      categoria: { _id: string; nombre: string };
    }[]
  >([]);
  const [categoria, setCategoria] = useState(gasto.itemId.categoria._id);
  const [itemNombre, setItemNombre] = useState(gasto.itemId.nombre);
  const [proyectos, setProyectos] = useState<{ _id: string; nombre: string }[]>(
    []
  );
  const [proyectoId, setProyectoId] = useState(gasto.proyectoId?._id || "");
  const [tipo, setTipo] = useState(gasto.tipo || "");
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchCategorias = async () => {
      const data = await authFetch(`${api_url}/api/categories`);
      setCategorias(data);
    };

    const fetchItems = async () => {
      const data = await authFetch(`${api_url}/api/items/buscar?query=`);
      setItems(data);
    };

    const fetchProyectos = async () => {
      const data = await authFetch(`${api_url}/api/projects`);
      setProyectos(data);
    };

    fetchProyectos();
    fetchCategorias();
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const itemSeleccionado = items.find(
        (item) => item.nombre.toLowerCase() === itemNombre.toLowerCase()
      );

      if (!itemSeleccionado) {
        alert("El ítem ingresado no existe.");
        return;
      }
      const proyectoSeleccionado = proyectos.find(
        (proy) => proy._id === proyectoId
      );
      if (!proyectoSeleccionado) {
        alert("Debes seleccionar un proyecto.");
        return;
      }
      await authFetch(`${api_url}/api/expense/${gasto._id}`, {
        method: "PUT",
        body: JSON.stringify({
          itemId: itemSeleccionado._id,
          categoriaId: itemSeleccionado.categoria._id,
          monto: parseFloat(monto),
          descripcion,
          fecha,
          proyectoId: proyectoSeleccionado._id,
          tipo,
        }),
      });
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error al editar gasto:", err);
      alert("Error al guardar los cambios");
    }
  };

  return (
    <div className="backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3 className="title">Editar Gasto</h3>
          <button type="button" className="close-icon" onClick={onClose} aria-label="Cerrar modal">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group-row">
              <div className="form-group">
                <label className="label">Proyecto</label>
                <select
                  value={proyectoId}
                  onChange={(e) => setProyectoId(e.target.value)}
                  className="input"
                  required>
                  <option value="">-- Selecciona --</option>
                  {proyectos.map((proy) => (
                    <option key={proy._id} value={proy._id}>
                      {proy.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Tipo</label>
                <input
                  type="text"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="input"
                  placeholder="Ingrese tipo"
                  required
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-group">
                <label className="label">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="input"
                  required>
                  <option value="">-- Selecciona --</option>
                  {categorias.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="label">Ítem</label>
                <input
                  type="text"
                  value={itemNombre}
                  onChange={(e) => {
                    const value = e.target.value;
                    setItemNombre(value);

                    const itemSeleccionado = items.find(
                      (item) =>
                        item.nombre.toLowerCase() === value.toLowerCase()
                    );

                    if (itemSeleccionado) {
                      setCategoria(itemSeleccionado.categoria._id);
                    }
                  }}
                  list="lista-items"
                  className="input"
                  placeholder="Buscar o seleccionar ítem"
                  required
                />
                <datalist id="lista-items">
                  {items.map((item) => (
                    <option key={item._id} value={item.nombre} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Monto</label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="input"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="button-group">
              <button
                type="button"
                onClick={onClose}
                className="button cancel-button">
                Cancelar
              </button>
              <button type="submit" className="button save-button">
                Guardar
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
