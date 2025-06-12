import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // Importa useSearchParams
import ResumenMensual from "../../components/ResumenMensual/ResumenMensual";
import GastosPorProyecto from "../../components/GastosPorProyecto/GastosPorProyecto";
import BalanceCompartido from "../../components/BalanceCompartido/BalanceCompartido";
import { authFetch } from "../../utils/authFetch";
import "./Reportes.css";

interface Proyecto {
  _id: string;
  nombre: string;
}

const Reportes: React.FC = () => {
  const [proyectoId, setProyectoId] = useState<string>(""); // Aquí decides cómo seleccionar proyecto
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState<string>("");

  const [searchParams] = useSearchParams();
  const api_url = import.meta.env.VITE_API_URL;

  // Cargar proyectos al inicio
  useEffect(() => {
    authFetch(`${api_url}/api/projects`)
      .then((proyectosData: Proyecto[]) => {
        setProyectos(proyectosData);
        // 3. Lógica para decidir qué proyecto seleccionar
        const proyectoIdFromUrl = searchParams.get("proyectoId");

        // Si hay un ID de proyecto en la URL, se le da prioridad
        if (proyectoIdFromUrl && proyectosData.some(p => p._id === proyectoIdFromUrl)) {
          setProyectoId(proyectoIdFromUrl);
        } else {
          // Si no, se selecciona el proyecto "Individual" por defecto
          const proyectoIndividual = proyectosData.find(
            (p) => p.nombre.toLowerCase() === "individual"
          );
          if (proyectoIndividual) {
            setProyectoId(proyectoIndividual._id);
          }
        }
      })
      .catch(() => setError("Error al cargar proyectos"));
  }, []);

  return (
    <div >
      <h1 className="reportes-title">Reportes</h1>

      <section className="reportes-seccion">
        <ResumenMensual />
      </section>

      <section className="reportes-seccion proyecto-select-container">
        <label htmlFor="proyecto-select">Selecciona Proyecto:</label>
        <select
          id="proyecto-select"
          value={proyectoId}
          onChange={(e) => setProyectoId(e.target.value)}
          className="input"
          required>
          <option value="">-- Selecciona --</option>
          {proyectos.map((proy) => (
            <option key={proy._id} value={proy._id}>
              {proy.nombre}
            </option>
          ))}
        </select>
        {error && <p className="error-text">{error}</p>}
      </section>

      {proyectoId && (
        <>
          <section className="reportes-seccion">
            <GastosPorProyecto proyectoId={proyectoId} />
          </section>

          <section className="reportes-seccion">
            <BalanceCompartido proyectoId={proyectoId} />
          </section>
        </>
      )}
    </div>
  );
};

export default Reportes;
