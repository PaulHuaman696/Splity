import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import EditGastoModal from "../../components/Modal/EditGastoModal/EditGastoModal";
import ConfirmDeleteModal from "../../components/Modal/ConfirmDeleteModal/ConfirmDeleteModal";
import "./GastosList.css";
import { filtrarYGastosOrdenados } from "../../utils/filtrarGastos";
import type { Categoria, Gasto } from "../../types/Gasto";

const GastosList = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [itemBuscar, setItemBuscar] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [ordenFecha, setOrdenFecha] = useState<"asc" | "desc">("desc");
  const [ordenMonto, setOrdenMonto] = useState<"asc" | "desc">("desc");
  const [ordenAlfabetico, setOrdenAlfabetico] = useState<
    "categoria" | "item" | ""
  >("");

  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
  const [deletingGastoId, setDeletingGastoId] = useState<string | null>(null);
  const capitalizeFirstLetter = (str: string) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  
  const api_url = import .meta.env.VITE_API_URL;

  const fetchGastos = async () => {
    try {
      const data = await authFetch(`${api_url}/api/expense`);
      setGastos(data);
    } catch (error) {
      console.error("Error al cargar los gastos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, []);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await authFetch(`${api_url}/api/categories`);
        setCategorias(data);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  return (
    <div className="gastos-container">
      <h2 className="gastos-title">Lista de gastos</h2>

      <div className="filtros-container">
        <label className="filtro-label">
          Categoría:{" "}
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="filtro-select">
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="filtro-label">
          Item:{" "}
          <input
            type="text"
            placeholder="Buscar item..."
            value={itemBuscar}
            onChange={(e) => setItemBuscar(e.target.value)}
            className="filtro-input"
          />
        </label>

        <label className="filtro-label">
          Desde:{" "}
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="filtro-input"
          />
        </label>

        <label className="filtro-label">
          Hasta:{" "}
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="filtro-input"
          />
        </label>

        <label className="filtro-label">
          Orden Fecha:{" "}
          <select
            value={ordenFecha}
            onChange={(e) => setOrdenFecha(e.target.value as "asc" | "desc")}
            className="filtro-select">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>

        <label className="filtro-label">
          Orden Monto:{" "}
          <select
            value={ordenMonto}
            onChange={(e) => setOrdenMonto(e.target.value as "asc" | "desc")}
            className="filtro-select">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </label>

        <label className="filtro-label">
          Orden Alfabético:{" "}
          <select
            value={ordenAlfabetico}
            onChange={(e) =>
              setOrdenAlfabetico(e.target.value as "categoria" | "item" | "")
            }
            className="filtro-select">
            <option value="">Sin orden</option>
            <option value="categoria">Por categoría</option>
            <option value="item">Por item</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p>Cargando gastos...</p>
      ) : gastos.length === 0 ? (
        <p>No hay gastos registrados.</p>
      ) : (
        <table className="gastos-table">
          <thead>
            <tr>
              <th className="gastos-th">Proyecto</th>
              <th className="gastos-th">Tipo</th>
              <th className="gastos-th">Categoría</th>
              <th className="gastos-th">Item</th>
              <th className="gastos-th">Monto</th>
              <th className="gastos-th">Descripción</th>
              <th className="gastos-th">Fecha</th>
              <th className="gastos-th">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrarYGastosOrdenados(gastos, {
              categoriaSeleccionada,
              itemBuscar,
              fechaInicio,
              fechaFin,
              ordenFecha,
              ordenMonto,
              ordenAlfabetico,
            }).map((gasto) => (
              <tr key={gasto._id} className="gastos-tr">
                <td data-label="Proyecto" className="gastos-td">
                  {gasto.proyectoId?.nombre || "Sin proyecto"}
                </td>
                <td data-label="Tipo" className="gastos-td">
                  {capitalizeFirstLetter(gasto.tipo) || "N/A"}
                </td>
                <td data-label="Categoría" className="gastos-td">
                  {gasto.itemId?.categoria.nombre || "Sin categoría"}
                </td>
                <td data-label="Item" className="gastos-td">
                  {gasto.itemId?.nombre || "Sin item"}
                </td>
                <td data-label="Monto" className="gastos-td">S/ {gasto.monto.toFixed(2)}</td>
                <td data-label="Descripción" className="gastos-td">{gasto.descripcion}</td>
                <td data-label="Fecha" className="gastos-td">
                  {(() => {
                    const fecha = new Date(gasto.fecha);
                    fecha.setDate(fecha.getDate() + 1); // Sumar un día

                    return fecha.toLocaleDateString("es", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    });
                  })()}
                </td>
                <td data-label="Acciones" className="gastos-td">
                  <div className="gastos-acciones">
                    <button
                      className="gastos-boton"
                      onClick={() => setEditingGasto(gasto)}>
                      ✏️
                    </button>
                    <button
                      className="gastos-boton"
                      onClick={() => setDeletingGastoId(gasto._id)}>
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Editar Gasto */}
      {editingGasto && (
        <EditGastoModal
          gasto={editingGasto}
          onClose={() => setEditingGasto(null)}
          onSaved={fetchGastos}
        />
      )}

      {/* Confirmar Eliminar */}
      {deletingGastoId && (
        <ConfirmDeleteModal
          gastoId={deletingGastoId}
          onClose={() => setDeletingGastoId(null)}
          onDeleted={fetchGastos}
        />
      )}
    </div>
  );
};

export default GastosList;
