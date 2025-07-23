import React from "react";
import type { Invitacion } from "../../../pages/ProyectoGasto/types";
import './ModalInvitaciones.css';

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
    <div className="invitacion-modal-overlay" onClick={onCerrar}>
      <div className="invitacion-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="invitacion-modal-header">
            <h3 className="invitacion-modal-title">Invitaciones Pendientes</h3>
            <button className="btn-close-icon" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>

        <div className="invitaciones-list">
          {invitaciones.length === 0 ? (
            <p className="no-invitaciones-msg">No tienes invitaciones pendientes.</p>
          ) : (
            invitaciones.map((inv) => (
              <div key={inv._id} className="invitacion-item">
                <div className="invitacion-info">
                  <span className="invitacion-proyecto">
                    Te han invitado al proyecto: <strong>{inv.proyectoId?.nombre || "Proyecto desconocido"}</strong>
                  </span>
                  <span className="invitacion-remitente">
                    De: {inv.enviadoPor || "Desconocido"}
                  </span>
                </div>
                <div className="invitacion-acciones">
                  <button onClick={() => onResponder(inv._id, true)} className="btn-accion aceptar">Aceptar</button>
                  <button onClick={() => onResponder(inv._id, false)} className="btn-accion rechazar">Rechazar</button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="invitacion-modal-footer">
            <button onClick={onCerrar} className="btn-cerrar-footer">Cerrar</button>
        </div>

      </div>
    </div>
  );
};

export default ModalInvitaciones;
