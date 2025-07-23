import React, { useState } from 'react';
import './ConfirmDeleteProjectModal.css'; // Crearemos este CSS

interface Props {
  nombreProyecto: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const ConfirmDeleteProjectModal: React.FC<Props> = ({ nombreProyecto, onClose, onConfirm, isLoading }) => {
  const [confirmText, setConfirmText] = useState('');
  
  const isMatch = confirmText === nombreProyecto;

  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="confirm-modal" onClick={e => e.stopPropagation()}>
        <h3 className="confirm-title">¿Estás absolutamente seguro?</h3>
        <p className="confirm-message">
          Esta acción no se puede deshacer. Se eliminará permanentemente el proyecto 
          <strong> {nombreProyecto} </strong>
          y todos sus gastos y pagos asociados.
        </p>
        <p className="confirm-message">
          Por favor, escribe <strong>{nombreProyecto}</strong> para confirmar.
        </p>
        <input
          type="text"
          className="confirm-input"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />
        <div className="confirm-actions">
          <button onClick={onClose} className="confirm-button confirm-cancel">Cancelar</button>
          <button 
            onClick={onConfirm} 
            className="confirm-button confirm-delete"
            disabled={!isMatch || isLoading}
          >
            {isLoading ? 'Eliminando...' : 'Entiendo las consecuencias, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteProjectModal;