import React from "react";
import type { ProyectoGasto } from "../../../pages/ProyectoGasto/types";
import './ModalAgregarParticipantes.css';

interface ModalAgregarParticipantesProps {
  proyectoSeleccionado: ProyectoGasto | null;
  emailInvitado: string;
  setEmailInvitado: React.Dispatch<React.SetStateAction<string>>;
  onEnviarInvitacion: () => void;
  onCerrar: () => void;
}

const ModalAgregarParticipantes: React.FC<ModalAgregarParticipantesProps> = ({
  proyectoSeleccionado,
  emailInvitado,
  setEmailInvitado,
  onEnviarInvitacion,
  onCerrar,
}) => {
  if (!proyectoSeleccionado) return null;
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnviarInvitacion();
  };
  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-content-invite" onClick={(e) => e.stopPropagation()}>

        <h3 className="modal-title">
          Invitar a "<span className="modal-title-project">{proyectoSeleccionado.nombre}</span>"
        </h3>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email-invitado" className="modal-label">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span>Correo del participante</span>
            </label>
            <input
              id="email-invitado"
              type="email"
              className="modal-input"
              placeholder="ejemplo@correo.com"
              value={emailInvitado}
              onChange={(e) => setEmailInvitado(e.target.value)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Enviar invitación
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ModalAgregarParticipantes;
