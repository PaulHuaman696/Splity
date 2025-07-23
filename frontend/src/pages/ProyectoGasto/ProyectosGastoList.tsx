import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import UnirseProyectoModal from "../../components/Modal/UnirseProyectoModal/UnirseProyectoModal";
import ModalAgregarParticipantes from "../../components/Modal/AgregarParticipantesModal/AgregarParticipantesModal";
import ModalInvitaciones from "../../components/Modal/InvitacionesModal/ModalInvitaciones";
import AdministrarProyectoModal from "../../components/Modal/AdministrarProyectoModal/AdministrarProyectoModal";
import type { ProyectoGasto, Invitacion } from "./types";
import "./ProyectosGastoList.css";

// Pequeña función para obtener iniciales
const getInitials = (name: string = "") => {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const ProyectosGastoList = () => {
  const [proyectos, setProyectos] = useState<ProyectoGasto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const api_url = import.meta.env.VITE_API_URL;

  // Para modal Agregar Participantes
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] =
    useState<ProyectoGasto | null>(null);
  const [emailInvitado, setEmailInvitado] = useState("");

  // Para modal Invitaciones
  const [modalInvitacionesVisible, setModalInvitacionesVisible] =
    useState(false);
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([]);

  const [modalUnirseVisible, setModalUnirseVisible] = useState(false);
  const abrirModalUnirse = () => setModalUnirseVisible(true);
  const cerrarModalUnirse = () => setModalUnirseVisible(false);

  const [modalAdministrarVisible, setModalAdministrarVisible] = useState(false);

  const abrirModalAdministrarProyecto = (proyecto: ProyectoGasto) => {
    setProyectoSeleccionado(proyecto);
    setModalAdministrarVisible(true);
  };

  const cerrarModalAdministrarProyecto = () => {
    setModalAdministrarVisible(false);
  };
  const abrirModalAgregarParticipantes = (proyecto: ProyectoGasto) => {
    setProyectoSeleccionado(proyecto);
    setEmailInvitado("");
    setModalAgregarVisible(true);
  };

  const cerrarModalAgregarParticipantes = () => {
    setModalAgregarVisible(false);
  };

  const abrirModalInvitaciones = async () => {
    setModalInvitacionesVisible(true);
    try {
      const data = await authFetch(`${api_url}/api/invitaciones`);
      setInvitaciones(data);
    } catch (error) {
      console.error("Error al cargar invitaciones:", error);
    }
  };

  const cerrarModalInvitaciones = () => {
    setModalInvitacionesVisible(false);
  };

  const enviarInvitacion = async () => {
    if (!emailInvitado || !proyectoSeleccionado)
      return alert("Completa el correo a invitar");

    try {
      await authFetch(`${api_url}/api/invitaciones`, {
        method: "POST",
        body: JSON.stringify({
          proyectoId: proyectoSeleccionado._id,
          emailInvitado: emailInvitado,
        }),
      });
      alert("Invitación enviada!");
      cerrarModalAgregarParticipantes();
    } catch (error) {
      alert("Error al enviar invitación");
      console.error(error);
    }
  };

  const responderInvitacion = async (id: string, aceptar: boolean) => {
    try {
      await authFetch(`${api_url}/api/invitaciones/responder`, {
        method: "POST",
        body: JSON.stringify({
          invitacionId: id,
          aceptar,
        }),
      });
      alert(aceptar ? "Invitación aceptada" : "Invitación rechazada");
      // Actualizar lista
      const data = await authFetch(`${api_url}/api/invitaciones`);
      setInvitaciones(data);
    } catch (error) {
      alert("Error al responder invitación");
      console.error(error);
    }
  };

  const fetchProyectos = async () => {
    try {
      const data = await authFetch(`${api_url}/api/projects`);
      setProyectos(data);
    } catch (error) {
      console.error("Error al cargar los proyectos de gasto:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleCopyCode = (codigo: string) => {
    navigator.clipboard.writeText(codigo).then(() => {
      setCopiedCode(codigo);
      setTimeout(() => setCopiedCode(null), 2000); // El mensaje de "Copiado" desaparece después de 2s
    });
  };

  return (
    <div className="page-container proyectos-page">
      <div className="page-header">
        <h2 className="page-title">Mis Proyectos</h2>
        <div className="page-actions">
          <button className="btn-secondary" onClick={abrirModalInvitaciones}>
            Ver Invitaciones
          </button>
          <button className="btn-primary" onClick={abrirModalUnirse}>
            Unirse a Proyecto
          </button>
        </div>
      </div>

      {loading ? (
        <p className="loading-message">Cargando...</p>
      ) : proyectos.length === 0 ? (
        <p className="empty-message">No tienes proyectos. ¡Crea uno para empezar!</p>
      ) : (
        <div className="proyectos-grid">
          {proyectos.map((proyecto) => (
            <div key={proyecto._id} className="proyecto-card">
              <div className="proyecto-card-header">
                <h3>{proyecto.nombre}</h3>
                <button
                  className="btn-icon"
                  onClick={() => abrirModalAdministrarProyecto(proyecto)}
                  aria-label="Administrar Proyecto"
                >
                  ⚙️
                </button>
              </div>

              <div className="proyecto-card-body">
                <p className="proyecto-descripcion">{proyecto.descripcion || "Sin descripción."}</p>
                <div className="proyecto-meta">
                  <span>Creado: {new Date(proyecto.fechaCreacion).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="proyecto-card-footer">
                <div className="participantes-avatar-stack">
                  {proyecto.participantes.slice(0, 4).map((p, index) => {
                    // Lógica de seguridad para la key:
                    // Usa el UID si existe, si no, usa el índice como último recurso.
                    const key = p.uid || `avatar-index-${index}`;

                    // Opcional: Advertencia para ayudarte a encontrar datos malos
                    if (!p.uid) {
                      console.warn('Participante sin UID encontrado en proyecto (vista de tarjeta):', proyecto.nombre);
                    }

                    return (
                      <div key={key} className="avatar-circle" title={p.nombre}>
                        {getInitials(p.nombre)}
                      </div>
                    );
                  })}
                  {proyecto.participantes.length > 4 && (
                    <div className="avatar-circle more">
                      +{proyecto.participantes.length - 4}
                    </div>
                  )}
                </div>
                <button className="btn-compartir" onClick={() => handleCopyCode(proyecto.codigoUnico)}>
                  {copiedCode === proyecto.codigoUnico ? '¡Copiado!' : 'Compartir Código'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalAdministrarVisible && proyectoSeleccionado && (
        <AdministrarProyectoModal
          proyecto={proyectoSeleccionado}
          onClose={cerrarModalAdministrarProyecto}
          onActualizarProyecto={fetchProyectos} // para refrescar la lista
          abrirModalAgregar={abrirModalAgregarParticipantes}
        />
      )}
      {modalAgregarVisible && (
        <ModalAgregarParticipantes
          proyectoSeleccionado={proyectoSeleccionado}
          emailInvitado={emailInvitado}
          setEmailInvitado={setEmailInvitado}
          onEnviarInvitacion={enviarInvitacion}
          onCerrar={cerrarModalAgregarParticipantes}
        />
      )}
      {modalInvitacionesVisible && (
        <ModalInvitaciones
          invitaciones={invitaciones}
          onResponder={responderInvitacion}
          onCerrar={cerrarModalInvitaciones}
        />
      )}

      {modalUnirseVisible && (
        <UnirseProyectoModal
          onClose={cerrarModalUnirse}
          onUnido={() => {
            cerrarModalUnirse();
            fetchProyectos(); // refrescar lista
          }}
        />
      )}
    </div>
  );
};

export default ProyectosGastoList;
