import React from 'react';
import './ConfirmacionModal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  title: string;
  children: React.ReactNode; // Para pasar los detalles específicos
  isActionLoading?: boolean;
}

const ConfirmacionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  onReject,
  title,
  children,
  isActionLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="universal-modal-backdrop" onClick={onClose}>
      <div className="universal-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="universal-modal-title">{title}</h3>
        <div className="universal-modal-body">
          {children}
        </div>
        <div className="universal-modal-actions">
          <button onClick={onReject} className="btn-accion-modal rechazar" disabled={isActionLoading}>
            Rechazar
          </button>
          <button onClick={onConfirm} className="btn-accion-modal confirmar" disabled={isActionLoading}>
            {isActionLoading ? 'Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmacionModal;