import React, { useEffect, useState } from "react";
import CrearCategoriaModal from "../../components/CrearCategoriaModal";
import { authFetch } from "../../utils/authFetch";
import CrearItemModal from "../../components/CrearItemModal";

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
  >([]); // Estado para ítems
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
  const [mostrarModalItem, setMostrarModalItem] = useState(false); // Modal para ítem
  const [busquedaItem, setBusquedaItem] = useState(""); // Estado para el buscador de ítems

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await authFetch("http://localhost:4000/api/categories");
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    const fetchItems = async () => {
      try {
        const data = await authFetch(
          "http://localhost:4000/api/items/buscar?query="
        );
        setItems(data);
      } catch (error) {
        console.error("Error al obtener items:", error);
      }
    };

    fetchCategorias();
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const body = {
        itemId: items[0]._id,
        categoriaId: categorias[0]._id,
        monto: parseFloat(monto),
        descripcion: descripcion,
        fecha: fecha.toString(),
      };

      await authFetch("http://localhost:4000/api/expense/", {
        method: "POST",
        body: JSON.stringify(body),
      });

      alert("Gasto registrado correctamente.");

      // Limpiar campos
      setCategoria("");
      setMonto("");
      setDescripcion("");
      setFecha("");
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
    categoriaId: string;
  }) => {
    // Buscar la categoría completa por ID
    const categoriaCompleta = categorias.find(
      (cat) => cat._id === nuevoItem.categoriaId
    );

    if (!categoriaCompleta) {
      console.error("Categoría no encontrada para el nuevo ítem");
      return;
    }

    // Crear un item con categoría completa (id y nombre)
    const itemConCategoria = {
      _id: nuevoItem._id,
      nombre: nuevoItem.nombre,
      categoria: {
        _id: categoriaCompleta._id,
        nombre: categoriaCompleta.nombre,
      },
    };

    setItems((prev) => [...prev, itemConCategoria]);
    setCategoria(categoriaCompleta._id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrar nuevo gasto</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.contenedor}>
          <label style={styles.label}>
            Categoría:
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                style={styles.input}
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
                style={styles.addButton}>
                +
              </button>
            </div>
          </label>
          <label style={styles.label}>
            Ítem:
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                value={busquedaItem}
                onChange={(e) => {
                  const value = e.target.value;
                  setBusquedaItem(value);

                  // Buscar el ítem
                  const itemSeleccionado = items.find(
                    (item) => item.nombre.toLowerCase() === value.toLowerCase()
                  );
                  if (itemSeleccionado) {
                    // Asignar la categoría correctamente
                    setCategoria(itemSeleccionado.categoria._id);
                  } else {
                    // Si no se encuentra el ítem, puedes limpiar la categoría (opcional)
                    setCategoria("");
                  }
                }}
                list="lista-items"
                style={styles.input}
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
                style={styles.addButton}>
                +
              </button>
            </div>
          </label>
        </div>
        <label style={styles.label}>
          Monto:
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            style={styles.input}
            required
          />
        </label>
        <label style={styles.label}>
          Descripción:
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            style={styles.input}
          />
        </label>
        <label style={styles.label}>
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={styles.input}
            required
          />
        </label>

        <button type="submit" style={styles.button}>
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

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#f3f4f6",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#1f2937",
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
    flex: 1, 
  },
  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    width:"100%"
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  addButton: {
    padding: "8px 12px",
    fontSize: "18px",
    borderRadius: "6px",
    backgroundColor: "#10b981",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  contenedor: {
    display: "flex",
    gap: '10px',
    width: '100%'
  }
};

export default GastoForm;
