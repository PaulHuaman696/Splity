import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./BalanceCompartido.css";
import { jwtDecode } from 'jwt-decode';

// --- (Interfaces no cambian) ---
interface Saldo {
  usuarioUid: string;
  nombre: string;
  totalAporte: number;
  saldo: number;
}
interface BalanceCompartidoData {
  promedio: number;
  sumaTotal: number;
  participantes: number;
  saldos: Saldo[];
}
interface Props {
  proyectoId: string;
}
interface PagoTarget {
  uid: string;
  nombre: string;
}

const api_url = import.meta.env.VITE_API_URL;

const BalanceCompartido: React.FC<Props> = ({ proyectoId }) => {
  const [data, setData] = useState<BalanceCompartidoData | null>(null);
  const [error, setError] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagoTarget, setPagoTarget] = useState<PagoTarget | null>(null);
  const [montoPago, setMontoPago] = useState("");
  const [pagoEnviando, setPagoEnviando] = useState(false);

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
      } catch (e) {
        setError("Error de sesión: El token es inválido o ha expirado.");
      }
    } else {
      setError("Error de sesión: No se encontró token.");
    }

  }, []);

  useEffect(() => {
    if (!proyectoId) {

      return;
    }

    authFetch(`${api_url}/api/reportes/compartido/${proyectoId}`)
      .then(apiResponse => {


        // Verificamos si la respuesta es válida antes de establecerla
        if (apiResponse && apiResponse.saldos) {
          setData(apiResponse);
        } else {

          setError("No se pudieron obtener los datos del balance para este proyecto.");
        }
      })
      .catch((err) => {

        setError(err.message || "Error al cargar balance")
      });

  }, [proyectoId]);

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
    if (!pagoTarget || !montoPago || parseFloat(montoPago) <= 0) {
      alert("Por favor, introduce un monto válido.");
      return;
    }
    setPagoEnviando(true);
    try {
      await authFetch(`${api_url}/api/pagos`, {
        method: 'POST',
        body: JSON.stringify({
          monto: parseFloat(montoPago),
          a_usuario: pagoTarget.uid,
          proyectoId: proyectoId,
        }),
      });
      alert(`Registro de pago a ${pagoTarget.nombre} enviado para confirmación.`);
      cerrarModalPago();
    } catch (err) {
      alert("Error al registrar el pago. Inténtalo de nuevo.");
    } finally {
      setPagoEnviando(false);
    }
  };

  if (error) return <p className="balance-error-text">{error}</p>;
  if (!data || !currentUserUid) return <p className="balance-info-text">Cargando datos de balance...</p>;



  // --- LÓGICA DE NEGOCIO MEJORADA ---
  // 1. Encontrar el saldo del usuario actual.
  const miSaldo = data.saldos.find(s => s.usuarioUid === currentUserUid);


  // 2. Determinar si el usuario actual es un deudor.
  const soyDeudor = miSaldo ? miSaldo.saldo < 0 : false;


  return (
    <>
      <div className="balance-container">
        <h2 className="balance-title">Balance de Proyecto</h2>
        {/* ... (JSX de resumen) ... */}

        <table className="balance-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Aporte Total</th>
              <th>Saldo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.saldos.map((saldo) => (
              // Estructura limpia para evitar el error de whitespace
              <tr key={saldo.usuarioUid}>
                <td data-label="Usuario" className="user-cell">{saldo.nombre}</td>
                <td data-label="Aporte Total">S/.{saldo.totalAporte.toFixed(2)}</td>
                <td data-label="Saldo">
                  <span className={`saldo-pill ${saldo.saldo < 0 ? "saldo-negativo" : "saldo-positivo"}`}>
                    {saldo.saldo >= 0 ? '+' : ''}S/.{saldo.saldo.toFixed(2)}
                  </span>
                </td>
                <td data-label="Acciones" className="acciones-cell">
                  {/* --- LÓGICA DEL BOTÓN CORREGIDA ---
                      El botón solo aparece si:
                      1. Yo soy deudor (mi saldo es negativo).
                      2. La fila actual es de un acreedor (su saldo es positivo).
                  */}
                  {soyDeudor && saldo.saldo > 0 && (
                    <button
                      onClick={() => abrirModalPago({ uid: saldo.usuarioUid, nombre: saldo.nombre })}
                      className="btn-pagar"
                    >
                      Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- El Modal (sin cambios) --- */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>Registrar Pago a {pagoTarget?.nombre}</h3>
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

export default BalanceCompartido;