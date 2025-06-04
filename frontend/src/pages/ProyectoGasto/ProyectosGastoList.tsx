import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import UnirseProyectoModal from "../../components/UnirseProyectoModal";
import ModalAgregarParticipantes from "../../components/ModalAgregarParticipantes";
import ModalInvitaciones from "../../components/ModalInvitaciones";
import AdministrarProyectoModal from "../../components/AdministrarProyectoModal/AdministrarProyectoModal";
import type { ProyectoGasto, Invitacion } from "./types";
import "./ProyectosGastoList.css";

const ProyectosGastoList = () => {
  const [proyectos, setProyectos] = useState<ProyectoGasto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
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

  return (
    <div className="proyectos-container">
      <h2 className="proyectos-title">Proyectos de Gasto</h2>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={abrirModalInvitaciones} style={{ marginRight: 10 }}>
          Ver Invitaciones
        </button>
        <button onClick={abrirModalUnirse}>Unirse a Proyecto</button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : proyectos.length === 0 ? (
        <p>No tienes proyectos creados aún.</p>
      ) : (
        <table className="proyectos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Código de invitación</th>
              <th>Fecha de creación</th>
              <th>Participantes</th>
            </tr>
          </thead>
          <tbody>
            {proyectos.map((proyecto) => (
              <tr key={proyecto._id}>
                <td>{proyecto.nombre}</td>
                <td>{proyecto.codigoUnico}</td>
                <td>{new Date(proyecto.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  {proyecto.participantes.map((p, index) => (
                    <div key={index}>
                      {p.nombre} {p.aceptado ? "✅" : "⏳"}
                    </div>
                  ))}
                </td>
                <td>
                  <button
                    onClick={() => abrirModalAdministrarProyecto(proyecto)}>
                    Administrar Proyecto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
