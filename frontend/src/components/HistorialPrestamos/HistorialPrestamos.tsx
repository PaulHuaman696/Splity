import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import { jwtDecode } from 'jwt-decode';
import './HistorialPrestamos.css'; // Crearemos este archivo

interface Prestamo {
    _id: string;
    monto: number;
    prestamista: string;
    prestatario: string;
    prestamista_nombre: string;
    prestatario_nombre: string;
    descripcion: string;
    estado: string;
    createdAt: string;
}

interface PagoTarget {
    id: string; // ID del préstamo
    a_usuario: string; // UID del prestamista
    nombre_acreedor: string; // Nombre del prestamista
}

const HistorialPrestamos: React.FC = () => {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);
    const [cargandoUsuario, setCargandoUsuario] = useState(true);
    const [cargandoPrestamos, setCargandoPrestamos] = useState(false);
    const [error, setError] = useState("");

    // Estados para el modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagoTarget, setPagoTarget] = useState<PagoTarget | null>(null);
    const [montoPago, setMontoPago] = useState('');
    const [pagoEnviando, setPagoEnviando] = useState(false);

    const api_url = import.meta.env.VITE_API_URL;

    // useEffect #1: Obtiene el ID del usuario.
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Intentamos obtener el UID del token
                const uidFromToken = (decodedToken as any).uid || (decodedToken as any).sub;
                if (uidFromToken) {
                    setCurrentUserUid(uidFromToken);
                } else {
                    setError("Error de sesión: El formato del token es incorrecto.");
                }
            } catch (error) {
                console.error("Error decodificando el token:", error);
                setError("No se pudo verificar la sesión de usuario.");
            }
        }
        // Al terminar este efecto, ya sea con éxito o no, dejamos de cargar el usuario.
        setCargandoUsuario(false);
    }, []); // Se ejecuta solo una vez.

    // useEffect #2: Busca el historial, pero solo si ya tenemos el UID.
    useEffect(() => {
        // Si no tenemos el UID, no hace nada.
        if (!currentUserUid) return;
        setCargandoPrestamos(true);
        authFetch(`${api_url}/api/prestamos/historial`)
            .then(data => {
                setPrestamos(data);
            })
            .catch(() => setError("No se pudo cargar el historial de préstamos."))
            .finally(() => {
                setCargandoPrestamos(false)
            });

    }, [currentUserUid, api_url]); // Depende de currentUserUid.



    // Funciones para manejar el modal
    const abrirModalPago = (target: PagoTarget) => {
        setPagoTarget(target);
        setIsModalOpen(true);
    };
    const cerrarModalPago = () => {
        setIsModalOpen(false);
        setPagoTarget(null);
        setMontoPago("");
    };
    const handleRegistrarPago = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pagoTarget || !montoPago || parseFloat(montoPago) <= 0) return;
        setPagoEnviando(true);

        try {
            await authFetch(`${api_url}/api/pagos`, {
                method: 'POST',
                body: JSON.stringify({
                    monto: parseFloat(montoPago),
                    a_usuario: pagoTarget.a_usuario,
                    prestamoId: pagoTarget.id, // Enviamos el ID del préstamo
                }),
            });
            alert(`Registro de pago a ${pagoTarget.nombre_acreedor} enviado.`);
            cerrarModalPago();
            // Opcional: recargar el historial para ver el estado actualizado tras la confirmación
        } catch (err) { /* ... */ }
        finally { setPagoEnviando(false); }
    };

    // --- LÓGICA DE RENDERIZADO MÁS CLARA ---
    if (cargandoUsuario) {
        return <p className="prestamos-mensaje">Verificando usuario...</p>;
    }

    if (error) {
        return <p className="prestamos-mensaje error">{error}</p>;
    }

    if (cargandoPrestamos) {
        return <p className="prestamos-mensaje">Cargando historial de préstamos...</p>;
    }

    // Si llegamos aquí, la carga ha terminado y no hay errores.
    if (prestamos.length === 0) {
        return <p className="prestamos-mensaje">No tienes préstamos registrados.</p>;
    }

    return (
        <>
            <div className="historial-prestamos-container">
                <table className="prestamos-table">
                    <thead>
                        <tr>
                            <th>DE (Prestamista)</th>
                            <th>PARA (Prestatario)</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prestamos.map(p => {
                            // Esta comparación ahora se hará cuando 'currentUserUid' ya tenga su valor.
                            const soyElPrestatario = p.prestatario === currentUserUid;
                            return (
                                <tr key={p._id}>
                                    <td data-label="DE (Prestamista)">
                                        {p.prestamista_nombre}
                                        {p.prestamista === currentUserUid && <span className="mi-tag"> (Yo)</span>}
                                    </td>
                                    <td data-label="PARA (Prestatario)">
                                        {p.prestatario_nombre}
                                        {soyElPrestatario && <span className="mi-tag"> (Yo)</span>}
                                    </td>
                                    <td data-label="Monto">S/.{p.monto.toFixed(2)}</td>
                                    <td data-label="Estado"><span className={`estado-pill estado-${p.estado}`}>{p.estado.replace('_', ' ')}</span></td>
                                    <td data-label="Fecha">{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td data-label="Acciones">
                                        {soyElPrestatario && p.estado === 'activo' && (
                                            <button
                                                className="btn-pagar-prestamo"
                                                onClick={() => abrirModalPago({ id: p._id, a_usuario: p.prestamista, nombre_acreedor: p.prestamista_nombre })}
                                            >
                                                Pagar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {isModalOpen && (
                <div className="modal-backdrop">
                    <div className="modal-content">
                        <h3>Registrar Pago a {pagoTarget?.nombre_acreedor}</h3>
                        <form onSubmit={handleRegistrarPago}>
                            <label htmlFor="monto">Monto a pagar (S/.)</label>
                            <input
                                type="number"
                                id="monto"
                                value={montoPago}
                                onChange={(e) => setMontoPago(e.target.value)}
                                placeholder="Ej: 50.00"
                                step="0.01"
                                required
                            />
                            <div className="modal-acciones">
                                <button type="button" onClick={cerrarModalPago} className="btn-cancelar">Cancelar</button>
                                <button type="submit" className="btn-confirmar" disabled={pagoEnviando}>
                                    {pagoEnviando ? 'Enviando...' : 'Registrar Pago'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default HistorialPrestamos;

