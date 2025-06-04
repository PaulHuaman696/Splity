import React from "react";
import type { ProyectoGasto } from "../pages/ProyectoGasto/types";

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Invitar participante a {proyectoSeleccionado.nombre}</h3>
        <input
          type="email"
          placeholder="Correo del participante"
          value={emailInvitado}
          onChange={(e) => setEmailInvitado(e.target.value)}
        />
        <button onClick={onEnviarInvitacion}>Enviar invitación</button>
        <button onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalAgregarParticipantes;
