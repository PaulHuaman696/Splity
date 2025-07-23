import React, { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { useNavigate } from "react-router-dom";
import "./ProyectoGastoForm.css";

const ProyectoGastoForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");

    if (!nombre.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      setCargando(false);
      return;
    }

    try {
      const data = await authFetch(`${api_url}/api/projects`, {
        method: "POST",
        body: JSON.stringify({ nombre, descripcion }),
      });
      alert("Proyecto creado con éxito. Código: " + data.codigoUnico);
      // Opcional: navegar a la lista de proyectos o al nuevo proyecto
      navigate("/proyectos-gastos/lista");
    } catch (err: any) {
      console.error("Error al crear proyecto:", err);
      setError(err.message || "Error inesperado al crear el proyecto");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h2 className="form-title">Nuevo Proyecto Compartido</h2>
        
        <div className="form-group">
          <label htmlFor="nombre-proyecto">Nombre del Proyecto</label>
          <input
            id="nombre-proyecto"
            type="text"
            className="form-input"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: Viaje de fin de semana"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion-proyecto">Descripción (opcional)</label>
          <textarea
            id="descripcion-proyecto"
            className="form-input"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Gastos para el viaje a la playa"
            rows={4}
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        
        <button type="submit" className="btn-primary" disabled={cargando}>
          {cargando ? "Creando..." : "Crear Proyecto"}
        </button>
      </form>
    </div>
  );
};

export default ProyectoGastoForm;
