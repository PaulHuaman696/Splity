import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig";
import "./ProyectoGastoForm.css";

const ProyectoGastoForm = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const api_url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = auth.currentUser;
    const token = localStorage.getItem("token");

    if (!user || !token) {
      alert("Usuario no autenticado");
      return;
    }

    try {
      const res = await fetch(`${api_url}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          creadoPor: {
            uid: user.uid,
            nombre: user.displayName || user.email || "Sin nombre",
          },
          participantes: [],
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Proyecto creado con éxito. Código: " + data.codigoUnico);
        setNombre("");
        setDescripcion("");
      } else {
        alert("Error al crear el proyecto: " + data.error);
      }
    } catch (err) {
      console.error("Error al crear proyecto:", err);
      alert("Error inesperado al crear el proyecto");
    }
  };

  return (
    <div className="proyecto-container">
      <h2 className="proyecto-title">Nuevo Proyecto de Gasto Compartido</h2>
      <form onSubmit={handleSubmit}>
        <label className="proyecto-label">
          Nombre del Proyecto:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="proyecto-input"
          />
        </label>

        <label className="proyecto-label">
          Descripción (opcional):
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="proyecto-input"
          />
        </label>

        <button type="submit" className="proyecto-submit">
          Crear Proyecto
        </button>
      </form>
    </div>
  );
};

export default ProyectoGastoForm;
