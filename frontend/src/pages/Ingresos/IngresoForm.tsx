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
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      await authFetch(`${api_url}/api/income`, {
        method: "POST",
        body: JSON.stringify({ monto: parseFloat(monto), descripcion, fecha }),
      });
      alert("Ingreso guardado correctamente");
      navigate("/ingresos/lista");
    } catch (err) {
      console.error("Error al crear ingreso:", err);
      alert("No se pudo guardar el ingreso.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="ingreso-form-card">
        <h2 className="form-title">Registrar Ingreso</h2>
        
        {/* Grupo para el Monto */}
        <div className="form-group">
          <label htmlFor="monto-ingreso">Monto (S/.)</label>
          <input
            id="monto-ingreso"
            type="number"
            className="form-input"
            placeholder="Ej: 500.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
            step="0.01"
          />
        </div>

        {/* Grupo para la Descripción */}
        <div className="form-group">
          <label htmlFor="descripcion-ingreso">Descripción</label>
          <input
            id="descripcion-ingreso"
            type="text"
            className="form-input"
            placeholder="Ej: Salario, Venta, etc."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        {/* Grupo para la Fecha */}
        <div className="form-group">
          <label htmlFor="fecha-ingreso">Fecha</label>
          <input
            id="fecha-ingreso"
            type="date"
            className="form-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="form-button-submit" disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar Ingreso"}
        </button>
      </form>
    </div>
  );
}
