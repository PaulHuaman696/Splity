import React, { useEffect, useState } from "react";
import CrearCategoriaModal from "../../components/CrearCategoriaModal/CrearCategoriaModal";
import { authFetch } from "../../utils/authFetch";
import CrearItemModal from "../../components/CrearItemModal/CrearItemModal";
import "./GastoForm.css";

const GastoForm = () => {
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
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(() => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalItem, setMostrarModalItem] = useState(false);
  const [busquedaItem, setBusquedaItem] = useState("");
  const [tipo, setTipo] = useState<"individual" | "compartido">("individual");
  const [proyectos, setProyectos] = useState<{ _id: string; nombre: string }[]>(
    []
  );
  const [proyectoId, setProyectoId] = useState("");
  const [proyectoIndividualId, setProyectoIndividualId] = useState("");
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await authFetch(`${api_url}/api/categories`);
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    const fetchItems = async () => {
      try {
        const data = await authFetch(`${api_url}/api/items/buscar?query=`);
        setItems(data);
      } catch (error) {
        console.error("Error al obtener items:", error);
      }
    };

    fetchCategorias();
    fetchItems();
  }, []);

  // Usar useEffect para llamar fetchProyectos solo una vez
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const proyectosData = await authFetch(`${api_url}/api/projects`);
        setProyectos(proyectosData);
      } catch (error) {
        console.error("Error al obtener proyectos:", error);
      }
    };

    const fetchProyectoIndividual = async () => {
      try {
        const individual = await authFetch(
          `${api_url}/api/projects/individual`
        );
        setProyectoIndividualId(individual._id);
        if (tipo === "individual") {
          setProyectoId(individual._id);
        }
      } catch (error) {
        console.error("Error al obtener proyecto individual:", error);
      }
    };

    fetchProyectos();
    fetchProyectoIndividual();
  }, [tipo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Buscar el item por nombre
    const itemSeleccionado = items.find(
      (item) => item.nombre.toLowerCase() === busquedaItem.toLowerCase()
    );

    if (!itemSeleccionado) {
      alert(
        "El ítem ingresado no existe. Crea uno nuevo o selecciona uno válido."
      );
      return;
    }

    if (!categoria) {
      alert("Por favor selecciona una categoría.");
      return;
    }

    if (tipo === "compartido" && !proyectoId) {
      alert("Selecciona un proyecto compartido antes de registrar el gasto.");
      return;
    }

    if (tipo === "individual" && !proyectoIndividualId) {
      alert(
        "No se encontró el proyecto individual asignado. Por favor contacta al administrador."
      );
      return;
    }

    const body = {
      itemId: itemSeleccionado._id,
      categoria, // ojo que backend espera 'categoria'
      monto: parseFloat(monto),
      descripcion,
      fecha: fecha.toString(),
      tipo,
      proyectoId: tipo === "individual" ? proyectoIndividualId : proyectoId,
    };

    try {
      await authFetch(`${api_url}/api/expense/`, {
        method: "POST",
        body: JSON.stringify(body),
      });

      alert("Gasto registrado correctamente.");

      // Limpiar campos (excepto proyecto y tipo para comodidad)
      setCategoria("");
      setBusquedaItem("");
      setMonto("");
      setDescripcion("");
      setFecha(() => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd = String(hoy.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      });
    } catch (error) {
      console.error("Error al registrar gasto:", error);
      alert("Hubo un error al registrar el gasto.");
    }
  };

  const handleCategoriaCreada = (nuevaCategoria: {
    _id: string;
    nombre: string;
  }) => {
    setCategorias((prev) => [...prev, nuevaCategoria]);
    setCategoria(nuevaCategoria._id);
  };

  const handleItemCreado = (nuevoItem: {
    _id: string;
    nombre: string;
    categoria: {
      _id: string;
      nombre: string;
    };
  }) => {
    if (!nuevoItem.categoria) {
      console.error("Categoría no encontrada para el nuevo ítem");
      return;
    }

    const itemConCategoria = {
      _id: nuevoItem._id,
      nombre: nuevoItem.nombre,
      categoria: {
        _id: nuevoItem.categoria._id,
        nombre: nuevoItem.categoria.nombre,
      },
    };

    setItems((prev) => [...prev, itemConCategoria]);
    setCategoria(nuevoItem.categoria._id);
    setBusquedaItem(nuevoItem.nombre);
  };

  return (
    <div className="gasto-container">
      <h2 className="gasto-title">Registrar nuevo gasto</h2>
      <form onSubmit={handleSubmit} className="gasto-form">
        <div className="gasto-contenedor">
          <label className="gasto-label">
            Tipo de gasto:
            <select
              value={tipo}
              onChange={(e) => {
                const valor = e.target.value as "individual" | "compartido";
                setTipo(valor);
                if (valor === "individual") {
                  setProyectoId(proyectoIndividualId);
                } else {
                  setProyectoId("");
                }
              }}
              className="gasto-input"
              required>
              <option value="individual">Individual</option>
              <option value="compartido">Compartido</option>
            </select>
          </label>

          <label className="gasto-label">
            Proyecto:
            <select
              value={proyectoId}
              onChange={(e) => setProyectoId(e.target.value)}
              className="gasto-input"
              disabled={tipo === "individual"}
              required={tipo === "compartido"}>
              <option value="">
                {tipo === "compartido"
                  ? "-- Selecciona un proyecto --"
                  : "Proyecto individual (seleccionado automáticamente)"}
              </option>
              {proyectos
                .filter((p) => p._id !== proyectoIndividualId)
                .map((proy) => (
                  <option key={proy._id} value={proy._id}>
                    {proy.nombre}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <div className="gasto-contenedor">
          <label className="gasto-label">
            Categoría:
            <div className="contenedor-busqueda">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="gasto-input"
                required>
                <option value="">-- Selecciona --</option>
                {categorias.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setMostrarModal(true)}
                className="gasto-add-button">
                +
              </button>
            </div>
          </label>
          <label className="gasto-label">
            Ítem:
            <div className="contenedor-busqueda">
              <input
                type="text"
                value={busquedaItem}
                onChange={(e) => {
                  const value = e.target.value;
                  setBusquedaItem(value);

                  const itemSeleccionado = items.find(
                    (item) => item.nombre.toLowerCase() === value.toLowerCase()
                  );
                  if (itemSeleccionado) {
                    setCategoria(itemSeleccionado.categoria._id);
                  } else {
                    setCategoria("");
                  }
                }}
                list="lista-items"
                className="gasto-input"
                placeholder="Buscar o seleccionar ítem"
              />
              <datalist id="lista-items">
                {items.map((item) => (
                  <option key={item._id} value={item.nombre} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => setMostrarModalItem(true)}
                className="gasto-add-button">
                +
              </button>
            </div>
          </label>
        </div>

        {busquedaItem &&
          !items.some(
            (item) => item.nombre.toLowerCase() === busquedaItem.toLowerCase()
          )}

        <label className="gasto-label">
          Monto:
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="gasto-input"
            required
          />
        </label>
        <label className="gasto-label">
          Descripción:
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="gasto-input"
          />
        </label>
        <label className="gasto-label">
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="gasto-input"
            required
          />
        </label>

        <button type="submit" className="gasto-button">
          Guardar Gasto
        </button>
      </form>

      {mostrarModal && (
        <CrearCategoriaModal
          onClose={() => setMostrarModal(false)}
          onCategoriaCreada={handleCategoriaCreada}
        />
      )}
      {mostrarModalItem && (
        <CrearItemModal
          onClose={() => setMostrarModalItem(false)}
          onItemCreado={handleItemCreado}
        />
      )}
    </div>
  );
};

export default GastoForm;
