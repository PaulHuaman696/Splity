import React, { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./AdministrarProyectoModal.css"; // Puedes crear un CSS propio o usar estilos globales

interface Participante {
  uid: string;
  nombre: string;
  aceptado: boolean;
}

interface ProyectoGasto {
  _id: string;
  nombre: string;
  codigoUnico: string;
  fechaCreacion: string;
  participantes: Participante[];
  creadoPor: {
    uid: string;
    nombre: string;
  };
}

interface Props {
  proyecto: ProyectoGasto;
  onClose: () => void;
  onActualizarProyecto: () => void; // callback para recargar la info en el padre
  abrirModalAgregar: (proyecto: ProyectoGasto) => void; // para abrir modal agregar participante reutilizado
}

const AdministrarProyectoModal: React.FC<Props> = ({
  proyecto,
  onClose,
  onActualizarProyecto,
  abrirModalAgregar,
}) => {
  const [eliminando, setEliminando] = useState<string | null>(null); // uid que se está eliminando
  const api_url = import .meta.env.VITE_API_URL;
  const eliminarParticipante = async (uid: string) => {
    if (!window.confirm("¿Estás seguro que deseas eliminar este participante?"))
      return;
    setEliminando(uid);
    try {
      await authFetch(
        `${api_url}/api/projects/${proyecto._id}/participantes/${uid}`,
        {
          method: "DELETE",
        }
      );
      alert("Participante eliminado");
      onActualizarProyecto(); // refrescar datos en el padre
    } catch (error) {
      alert("Error al eliminar participante");
      console.error(error);
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content administrar-modal">
        <div className="modal-header">
          <h2>Administrar Proyecto</h2>
          <span onClick={onClose} className="close-icon">
            <i className="fas fa-times"></i> {/* Icono de X de Font Awesome */}
          </span>
        </div>
        <h3>{proyecto.nombre}</h3>
        <p>
          <strong>Código único:</strong> {proyecto.codigoUnico}
        </p>
        <p>
          <strong>Fecha de creación:</strong>{" "}
          {new Date(proyecto.fechaCreacion).toLocaleDateString()}
        </p>
        <p>
          <strong>Creado por:</strong> {proyecto.creadoPor.nombre}
        </p>

        <h4>Participantes</h4>
        {proyecto.participantes.length === 0 ? (
          <p>No hay participantes aún.</p>
        ) : (
          <table className="participantes-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {proyecto.participantes.map((p) => (
                <tr key={p.uid}>
                  <td>{p.nombre}</td>
                  <td>{p.aceptado ? "✅ Aceptado" : "⏳ Pendiente"}</td>
                  <td>
                    <button
                      disabled={eliminando === p.uid}
                      onClick={() => eliminarParticipante(p.uid)}>
                      {eliminando === p.uid ? "Eliminando..." : "Eliminar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="action-buttons">
          <button onClick={() => abrirModalAgregar(proyecto)}>Agregar participante</button>
        </div>
      </div>
    </div>
  );
};

export default AdministrarProyectoModal;
