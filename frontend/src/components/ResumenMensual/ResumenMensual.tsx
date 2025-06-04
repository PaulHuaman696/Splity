import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./ResumenMensual.css";

interface ResumenMensualData {
  totalGastos: number;
  totalIngresos: number;
}

const ResumenMensual: React.FC = () => {
  const [data, setData] = useState<ResumenMensualData | null>(null);
  const [error, setError] = useState<string>("");
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    authFetch(`${api_url}/api/reportes/mensual`)
      .then(setData)
      .catch((err) => setError(err.message || "Error al cargar datos"));
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Cargando resumen mensual...</p>;

  const balance = data.totalIngresos - data.totalGastos;

  return (
    <div className="resumen-mensual-container">
      <h2 className="resumen-mensual-title">Resumen Mensual</h2>
      <p className="resumen-mensual-item">
        <span>Total Gastos:</span> <span>S/.{data.totalGastos.toFixed(2)}</span>
      </p>
      <p className="resumen-mensual-item">
        <span>Total Ingresos:</span>{" "}
        <span>S/.{data.totalIngresos.toFixed(2)}</span>
      </p>
      <p
        className={`resumen-mensual-item balance ${
          balance < 0 ? "negative" : ""
        }`}>
        <span>Balance:</span> <span>S/.{balance.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default ResumenMensual;
