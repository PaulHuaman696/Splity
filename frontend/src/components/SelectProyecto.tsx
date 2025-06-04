import React, { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";

interface Proyecto {
  _id: string;
  nombre: string;
}

interface Props {
  value: string; // id proyecto seleccionado
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  className?: string;
}

export default function SelectProyecto({
  value,
  onChange,
  required = false,
  label = "Proyecto",
  className = "",
}: Props) {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const data = await authFetch(`${api_url}/api/projects`);
        setProyectos(data);
      } catch (error) {
        console.error("Error cargando proyectos:", error);
      }
    };

    fetchProyectos();
  }, []);

  return (
    <div className={className}>
      <label className="label">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        required={required}>
        <option value="">-- Selecciona --</option>
        {proyectos.map((proy) => (
          <option key={proy._id} value={proy._id}>
            {proy.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
