// src/pages/Ingresos/IngresoForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/authFetch";
import "./IngresoForm.css";

export default function IngresoForm() {
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // formato YYYY-MM-DD
  });
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authFetch(`${api_url}/api/income`, {
        method: "POST",
        body: JSON.stringify({ monto: parseFloat(monto), descripcion, fecha }),
      });
      navigate("/ingresos");
    } catch (err) {
      console.error("Error al crear ingreso:", err);
      alert("No se pudo guardar el ingreso.");
    }
  };

  return (
    <div className="ingreso-container">
      <h2 className="ingreso-title">Registrar Ingreso</h2>
      <form onSubmit={handleSubmit} className="ingreso-form">
        <input
          type="number"
          placeholder="Monto"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          required
          className="ingreso-input"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="ingreso-input"
        />
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="ingreso-input"
        />
        <button type="submit" className="ingreso-button">
          Guardar Ingreso
        </button>
      </form>
    </div>
  );
}
