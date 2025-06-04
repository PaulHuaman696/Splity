import React from "react";
import type { Invitacion } from "../pages/ProyectoGasto/types";

interface ModalInvitacionesProps {
  invitaciones: Invitacion[];
  onResponder: (id: string, aceptar: boolean) => void;
  onCerrar: () => void;
}

const ModalInvitaciones: React.FC<ModalInvitacionesProps> = ({
  invitaciones,
  onResponder,
  onCerrar,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Invitaciones pendientes</h3>
        {invitaciones.length === 0 ? (
          <p>No tienes invitaciones pendientes.</p>
        ) : (
          invitaciones.map((inv) => (
            <div key={inv._id} style={{ marginBottom: "1rem" }}>
              <p>
                Proyecto: {inv.proyectoId?.nombre || "Proyecto desconocido"} <br />
                Invitado por: {inv.enviadoPor || "Desconocido"}
              </p>
              <button onClick={() => onResponder(inv._id, true)}>Aceptar</button>
              <button onClick={() => onResponder(inv._id, false)}>Rechazar</button>
            </div>
          ))
        )}
        <button onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  );
};

export default ModalInvitaciones;
