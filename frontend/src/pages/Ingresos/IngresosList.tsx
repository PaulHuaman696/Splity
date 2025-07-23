// src/pages/Ingresos/IngresosList.tsx
import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./IngresosList.css";

interface Ingreso {
  _id: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export default function IngresosList() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [cargando, setCargando] = useState(true);
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const data = await authFetch(`${api_url}/api/income`);
        // Ordenamos por fecha descendente al recibir los datos
        const ingresosOrdenados = data.sort((a: Ingreso, b: Ingreso) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        setIngresos(ingresosOrdenados);
      } catch (err) {
        console.error("Error al obtener ingresos:", err);
      } finally {
        setCargando(false);
      }
    };
    fetchIngresos();
  }, []);

  const formatearFecha = (fecha: string) => {
    const f = new Date(fecha);
    f.setDate(f.getDate() + 1); // Por desfase de zona horaria
    return f.toLocaleDateString("es", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="list-container">
      <h2 className="list-title">Historial de Ingresos</h2>
      {cargando ? (
        <p className="list-message">Cargando ingresos...</p>
      ) : ingresos.length === 0 ? (
        <p className="list-message">No hay ingresos registrados.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Monto</th>
              <th>Descripción</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ingresos.map((ingreso) => (
              <tr key={ingreso._id}>
                {/* 👇 Añadimos data-label a cada celda 👇 */}
                <td data-label="Monto">S/ {ingreso.monto.toFixed(2)}</td>
                <td data-label="Descripción">{ingreso.descripcion}</td>
                <td data-label="Fecha">{formatearFecha(ingreso.fecha)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
