import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import './PrestamoForm.css';

interface User {
  uid: string;
  name: string;
  email: string;
}

const PrestamoForm: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [prestatarioUid, setPrestatarioUid] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const api_url = import .meta.env.VITE_API_URL;

  // Cargar la lista de usuarios al montar el componente
  useEffect(() => {
    authFetch(`${api_url}/api/user/all`)
      .then(setUsuarios)
      .catch(() => setError('No se pudo cargar la lista de usuarios.'));
  }, [api_url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestatarioUid || !monto || parseFloat(monto) <= 0) {
      setError('Por favor, selecciona un usuario y un monto válido.');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      await authFetch(`${api_url}/api/prestamos`, {
        method: 'POST',
        body: JSON.stringify({
          monto: parseFloat(monto),
          prestatario_uid: prestatarioUid,
          descripcion,
        }),
      });
      
      alert('¡Préstamo registrado! El otro usuario recibirá una notificación para confirmarlo.');
      // navigate('/dashboard');

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al registrar el préstamo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <form onSubmit={handleSubmit} className="form-card">
        <h1 className="form-title">Registrar un Nuevo Préstamo</h1>
        <p className="form-subtitle">Registra el dinero que le has prestado a otro usuario.</p>
        
        <div className="form-group">
          <label htmlFor="prestatario" className='form-label'>¿A quién le prestaste?</label>
          <select
            id="prestatario"
            className="form-input"
            value={prestatarioUid}
            onChange={(e) => setPrestatarioUid(e.target.value)}
            required
          >
            <option value="" disabled>-- Selecciona un usuario --</option>
            {usuarios.map(user => (
              <option key={user.uid} value={user.uid}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="monto" className='form-label'>Monto del Préstamo (S/.)</label>
          <input
            type="number"
            id="monto"
            className="form-input"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            placeholder="Ej: 100.00"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion" className='form-label'>Descripción (Opcional)</label>
          <textarea
            id="descripcion"
            className="form-input"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ej: Préstamo para el almuerzo"
            rows={3}
          ></textarea>
        </div>

        {error && <p className="form-error">{error}</p>}
        
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Registrando...' : 'Registrar Préstamo'}
        </button>
      </form>
    </div>
  );
};

export default PrestamoForm;