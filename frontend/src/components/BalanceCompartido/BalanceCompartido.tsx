import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./BalanceCompartido.css";

// (CORRECCIÓN) Actualiza la interfaz para incluir el nombre
interface Saldo {
  usuarioUid: string;
  nombre: string; // <-- Añadido
  totalAporte: number;
  saldo: number;
}

interface BalanceCompartidoData {
  promedio: number;
  sumaTotal: number;
  participantes: number;
  saldos: Saldo[];
}

interface Props {
  proyectoId: string;
}

const api_url = import.meta.env.VITE_API_URL;

// Pequeña función para obtener iniciales para los avatares
const getInitials = (name: string) => {
  if (!name) return "?";
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

const BalanceCompartido: React.FC<Props> = ({ proyectoId }) => {
  const [data, setData] = useState<BalanceCompartidoData | null>(null);
  const [error, setError] = useState<string>("");



  useEffect(() => {
    if (!proyectoId) return;

    authFetch(`${api_url}/api/reportes/compartido/${proyectoId}`)
      .then((response) => {
        // Si la respuesta tiene 'mensaje', es un error controlado por el backend
        if (response.mensaje) {
          setError(response.mensaje);
        } else {
          setData(response);
          setError(""); // Limpiar errores previos si la llamada es exitosa
        }
      })
      .catch((err) => {
        setError(err.message || "Error al cargar el balance");
      });
  }, [proyectoId, api_url]);

  // 2. USA LAS NUEVAS CLASES PARA LOS MENSAJES
  if (error) return <p className="balance-error-text">{error}</p>;
  if (!data) return <p className="balance-info-text">Cargando balance compartido...</p>;

  return (
    <div className="balance-container">
      <h2 className="balance-title">
        {/* Icono para el título */}
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m10 8 4 4-4 4"></path></svg>
        Balance Compartido
      </h2>

      {/* --- Tarjetas de Resumen --- */}
      <div className="balance-summary">
        <div className="summary-card">
          <span className="summary-card-label">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            Participantes
          </span>
          <span className="summary-card-value">{data.participantes}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            Total Gastado
          </span>
          <span className="summary-card-value">S/.{data.sumaTotal.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-card-label">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" x2="19" y1="8"></line><line x1="19" x2="19" y1="14"></line><line x1="16" x2="22" y1="11"></line></svg>
            Promedio
          </span>
          <span className="summary-card-value">S/.{data.promedio.toFixed(2)}</span>
        </div>
      </div>

      {/* --- Tabla de Saldos --- */}
      <table className="balance-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Aporte Total</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {data.saldos.map((saldo) => (
            <tr key={saldo.usuarioUid}>
              {/* 👇 AÑADE ESTE data-label */}
              <td data-label="Usuario" className="user-cell">
                <span className="user-avatar">{getInitials(saldo.nombre)}</span>
                {saldo.nombre}
              </td>
              {/* 👇 AÑADE ESTE data-label */}
              <td data-label="Aporte Total">S/.{saldo.totalAporte.toFixed(2)}</td>
              {/* 👇 AÑADE ESTE data-label */}
              <td data-label="Saldo">
                <span className={`saldo-pill ${saldo.saldo < 0 ? "saldo-negativo" : "saldo-positivo"}`}>
                  {saldo.saldo >= 0 ? '+' : ''}S/.{saldo.saldo.toFixed(2)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceCompartido;