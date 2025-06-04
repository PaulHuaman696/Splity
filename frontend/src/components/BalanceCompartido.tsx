import React, { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";

interface Saldo {
  usuarioUid: string;
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

const BalanceCompartido: React.FC<Props> = ({ proyectoId }) => {
  const [data, setData] = useState<BalanceCompartidoData | null>(null);
  const [error, setError] = useState<string>("");
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    authFetch(`${api_url}/api/reportes/compartido/${proyectoId}`)
      .then(setData)
      .catch((err) => setError(err.message || "Error al cargar balance"));
  }, [proyectoId]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>Cargando balance compartido...</p>;

  return (
    <div className="p-4 border rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Balance Compartido</h2>
      <p>Promedio Aporte: ${data.promedio.toFixed(2)}</p>
      <p>Total Gastado: ${data.sumaTotal.toFixed(2)}</p>
      <p>Participantes: {data.participantes}</p>
      <table className="w-full text-left mt-4 border-collapse">
        <thead>
          <tr>
            <th className="border px-2 py-1">Usuario</th>
            <th className="border px-2 py-1">Aporte</th>
            <th className="border px-2 py-1">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {data.saldos.map((saldo) => (
            <tr key={saldo.usuarioUid}>
              <td className="border px-2 py-1">{saldo.usuarioUid}</td>
              <td className="border px-2 py-1">
                ${saldo.totalAporte.toFixed(2)}
              </td>
              <td
                className={`border px-2 py-1 ${
                  saldo.saldo < 0 ? "text-red-600" : "text-green-600"
                }`}>
                ${saldo.saldo.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BalanceCompartido;
