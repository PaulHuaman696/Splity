import React, { useState, useEffect } from "react";
import { authFetch } from "../../../utils/authFetch";
import "./AdministrarProyectoModal.css"; // Puedes crear un CSS propio o usar estilos globales
import { jwtDecode } from 'jwt-decode';
import ConfirmDeleteProjectModal from "../ConfirmDeleteModal/ConfirmDeleteProjectModal";

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
  descripcion: string;
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
  const [isDeletingProject, setIsDeletingProject] = useState(false);
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const api_url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        // Intentamos obtener el UID del token
        const uidFromToken = (decodedToken as any).uid || (decodedToken as any).sub;
        if (uidFromToken) {
          setCurrentUserUid(uidFromToken);
        } else {
          console.error("Error de sesión: El formato del token es incorrecto.");
        }
      } catch (e) { console.error("Token inválido:", e); }
    }
  }, []);

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

  const handleCopyCode = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    alert(`Código "${codigo}" copiado al portapapeles.`);
  };

  const handleEliminarProyecto = async () => {
    setIsDeletingProject(true);
    try {
      await authFetch(`${api_url}/api/projects/${proyecto._id}`, {
        method: "DELETE",
      });
      alert("Proyecto eliminado exitosamente.");
      onActualizarProyecto(); // Refresca la lista de proyectos en la página anterior
      onClose(); // Cierra el modal
    } catch (error) {
      alert("Error al eliminar el proyecto.");
      console.error(error);
    } finally {
      setIsDeletingProject(false);
    }
  };

  // Verificamos si el usuario actual es el dueño del proyecto
  const isOwner = currentUserUid === proyecto.creadoPor.uid;

  return (
    <>
      <div className="admin-modal-overlay" onClick={onClose}>
        <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>

          <div className="admin-modal-header">
            <h2 className="admin-modal-title">Administrar Proyecto</h2>
            <button className="btn-close-icon" onClick={onClose} aria-label="Cerrar">×</button>
          </div>

          <div className="admin-modal-body">
            <section className="modal-section">
              <h3>{proyecto.nombre}</h3>
              <p className="proyecto-descripcion">{proyecto.descripcion || "Sin descripción."}</p>
              <div className="details-grid">
                <div>
                  <span>Creado por</span>
                  <strong>{proyecto.creadoPor.nombre}</strong>
                </div>
                <div>
                  <span>Fecha de creación</span>
                  <strong>{new Date(proyecto.fechaCreacion).toLocaleDateString()}</strong>
                </div>
                <div>
                  <span>Código para compartir</span>
                  <div className="codigo-container">
                    <strong>{proyecto.codigoUnico}</strong>
                    <button onClick={() => handleCopyCode(proyecto.codigoUnico)} title="Copiar código">📋</button>
                  </div>
                </div>
              </div>
            </section>

            <section className="modal-section">
              <div className="participantes-header">
                <h4>Participantes ({proyecto.participantes.length})</h4>
                <button className="btn-primary-small" onClick={() => abrirModalAgregar(proyecto)}>+ Invitar</button>
              </div>

              {proyecto.participantes.length === 0 ? (
                <p className="empty-state-msg">Aún no hay participantes. ¡Invita a alguien!</p>
              ) : (
                <div className="table-wrapper">
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
                          <td data-label="Nombre">{p.nombre}</td>
                          <td data-label="Estado">{p.aceptado ? "✅ Aceptado" : "⏳ Pendiente"}</td>
                          <td data-label="Acción">
                            <button
                              className="btn-danger-small"
                              disabled={eliminando === p.uid}
                              onClick={() => eliminarParticipante(p.uid)}
                            >
                              {eliminando === p.uid ? "..." : "Eliminar"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* --- NUEVA SECCIÓN: ZONA DE PELIGRO --- */}
            {/* Solo se muestra si el usuario es el creador del proyecto */}
            {isOwner && (
              <section className="modal-section danger-zone">
                <h4>Zona de Peligro</h4>
                <div className="danger-action">
                  <p>Eliminar este proyecto es una acción permanente y no se puede deshacer.</p>
                  <button className="btn-danger" onClick={() => setShowConfirmDelete(true)}>
                    Eliminar Proyecto
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
      {/* --- NUEVO MODAL DE CONFIRMACIÓN EXPLÍCITA --- */}
      {showConfirmDelete && (
        <ConfirmDeleteProjectModal
          nombreProyecto={proyecto.nombre}
          onConfirm={handleEliminarProyecto}
          onClose={() => setShowConfirmDelete(false)}
          isLoading={isDeletingProject}
        />
      )}
    </>
  );
};

export default AdministrarProyectoModal;
