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
  const api_url = import .meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const data = await authFetch(`${api_url}/api/income`);
        setIngresos(data);
      } catch (err) {
        console.error("Error al obtener ingresos:", err);
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
    <div className="ingresos-container">
      <h2 className="ingresos-title">Lista de Ingresos</h2>
      <table className="ingresos-table">
        <thead>
          <tr>
            <th className="ingresos-th">Monto</th>
            <th className="ingresos-th">Descripción</th>
            <th className="ingresos-th">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso._id}>
              <td className="ingresos-td">S/ {ingreso.monto.toFixed(2)}</td>
              <td className="ingresos-td">{ingreso.descripcion}</td>
              <td className="ingresos-td">{formatearFecha(ingreso.fecha)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
