// src/pages/Ingresos/IngresosList.tsx
import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";

interface Ingreso {
  _id: string;
  monto: number;
  descripcion: string;
  fecha: string;
}

export default function IngresosList() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);

  useEffect(() => {
    const fetchIngresos = async () => {
      try {
        const data = await authFetch("http://localhost:4000/api/income");
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
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}>
      <h2
        style={{ textAlign: "center", marginBottom: "20px", color: "#1f2937" }}>
        Lista de Ingresos
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={thStyle}>Monto</th>
            <th style={thStyle}>Descripción</th>
            <th style={thStyle}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso) => (
            <tr key={ingreso._id}>
              <td style={tdStyle}>S/ {ingreso.monto.toFixed(2)}</td>
              <td style={tdStyle}>{ingreso.descripcion}</td>
              <td style={tdStyle}>{formatearFecha(ingreso.fecha)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #e5e7eb",
};

const tdStyle: React.CSSProperties = {
  padding: "12px",
  borderBottom: "1px solid #e5e7eb",
};
