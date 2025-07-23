import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import ConfirmacionModal from '../Modal/ConfirmacionModal/ConfirmacionModal';
import './Notificaciones.css'; // Crearemos este archivo

// Tipos de datos que esperamos
interface PagoPendiente {
    _id: string;
    monto: number;
    de_usuario_nombre: string; 
    proyecto?: { nombre: string }; // Opcional
    prestamo?: { descripcion: string }; // Opcional
}

type ItemSeleccionado = {
    id: string;
    type: 'pago' | 'prestamo';
    details: any;
};

interface PrestamoPendiente {
    _id: string;
    monto: number;
    prestamista_nombre: string; // UID de quien presta
    descripcion: string;
}

const Notificaciones: React.FC = () => {
    const [pagos, setPagos] = useState<PagoPendiente[]>([]);
    const [prestamos, setPrestamos] = useState<PrestamoPendiente[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');
    const api_url = import .meta.env.VITE_API_URL;

    // --- Estados para manejar el modal ---
    const [itemSeleccionado, setItemSeleccionado] = useState<ItemSeleccionado | null>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchData = () => {
        setCargando(true);
        Promise.all([
            authFetch(`${api_url}/api/pagos/pendientes`),
            authFetch(`${api_url}/api/prestamos/pendientes`)
        ])
            .then(([pagosData, prestamosData]) => {
                setPagos(pagosData);
                setPrestamos(prestamosData);
            })
            .catch(() => setError('No se pudieron cargar las notificaciones.'))
            .finally(() => setCargando(false));
    };

    useEffect(fetchData, [api_url]);

    const handleAccion = async (accion: 'confirmar' | 'rechazar') => {
        if (!itemSeleccionado) return;
        setIsActionLoading(true);

        const { id, type } = itemSeleccionado;
        let url = '';
        let body: any = null;

        if (type === 'pago') {
            url = `${api_url}/api/pagos/${id}/${accion}`;
        } else { // es 'prestamo'
            url = `${api_url}/api/prestamos/${id}/responder`;
            body = JSON.stringify({ accion });
        }

        try {
            await authFetch(url, { method: 'PUT', body });
            fetchData(); // Recargamos los datos
            setItemSeleccionado(null); // Cerramos el modal
        } catch (err) {
            alert(`Error al procesar la acción.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const renderModalContent = () => {
        if (!itemSeleccionado) return null;

        if (itemSeleccionado.type === 'pago') {
            const pago = itemSeleccionado.details as PagoPendiente;
            // Determinamos el contexto del pago
            const contextoDelPago = pago.proyecto
                ? `para el proyecto "${pago.proyecto.nombre}"`
                : `como devolución de un préstamo.`;
            return (
                <p>
                    El usuario <strong>{pago.de_usuario_nombre}</strong> ha registrado un pago de <strong>S/.{pago.monto.toFixed(2)}</strong> {contextoDelPago}. ¿Confirmas que recibiste este dinero?
                </p>
            );
        }

        if (itemSeleccionado.type === 'prestamo') {
            const prestamo = itemSeleccionado.details as PrestamoPendiente;
            return (
                <div>
                    <p>El usuario <strong>{prestamo.prestamista_nombre.substring(0, 8)}...</strong> ha registrado un préstamo para ti de <strong>S/.{prestamo.monto.toFixed(2)}</strong>.</p>
                    <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Motivo: "{prestamo.descripcion || 'No especificado'}"</p>
                    <p><strong>¿Confirmas que has recibido este dinero?</strong></p>
                </div>
            );
        }
        return null;
    };

    if (cargando) return <p className="notificacion-mensaje">Cargando notificaciones...</p>;
    if (error) return <p className="notificacion-mensaje error">{error}</p>;
    if (pagos.length === 0 && prestamos.length === 0) {
        return <p className="notificacion-mensaje">No tienes acciones pendientes. ¡Todo al día!</p>;
    }

    return (
        <>
            <ul className="notificaciones-list">
                {/* Mapeo de Pagos Pendientes (ahora más simple) */}
                {pagos.map(pago => (
                    <li key={pago._id} className="notificacion-item pago" onClick={() => setItemSeleccionado({ id: pago._id, type: 'pago', details: pago })}>
                        <div className="notificacion-info">
                             {/* 3. El texto del resumen ahora también es más claro */}
                            <span>Pago de <strong>{pago.de_usuario_nombre}</strong></span>
                            <span className="monto">S/.{pago.monto.toFixed(2)}</span>
                        </div>
                        <button className="btn-detalles">Revisar</button>
                    </li>
                ))}

                {/* Mapeo de Préstamos Pendientes (ahora más simple) */}
                {prestamos.map(prestamo => (
                    <li key={prestamo._id} className="notificacion-item prestamo" onClick={() => setItemSeleccionado({ id: prestamo._id, type: 'prestamo', details: prestamo })}>
                        <div className="notificacion-info">
                            <span>Préstamo de <strong>{prestamo.prestamista_nombre}</strong></span>
                            <span className="monto">S/.{prestamo.monto.toFixed(2)}</span>
                        </div>
                        <button className="btn-detalles">Revisar</button>
                    </li>
                ))}
            </ul>
            <ConfirmacionModal
                isOpen={!!itemSeleccionado}
                onClose={() => setItemSeleccionado(null)}
                onConfirm={() => handleAccion('confirmar')}
                onReject={() => handleAccion('rechazar')}
                title={`Confirmar ${itemSeleccionado?.type === 'pago' ? 'Pago' : 'Préstamo'}`}
                isActionLoading={isActionLoading}
            >
                {renderModalContent()}
            </ConfirmacionModal>
        </>
    );
};

export default Notificaciones;