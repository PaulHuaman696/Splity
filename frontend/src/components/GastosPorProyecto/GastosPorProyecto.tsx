import React, { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./GastosPorProyecto.css";
import {
  exportarExcel,
  exportarCSV,
  exportarPDF,
} from "../../utils/gastosUtils";

import type { GastosPorProyectoData } from "../../types";

interface Props {
  proyectoId: string;
}

const GastosPorProyecto: React.FC<Props> = ({ proyectoId }) => {
  const [data, setData] = useState<GastosPorProyectoData | null>(null);
  const [error, setError] = useState<string>("");
  const [usuarioFiltro, setUsuarioFiltro] = useState<string>("");
  const [exportando, setExportando] = useState<"" | "excel" | "csv" | "pdf">(
    ""
  );
  const api_url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    authFetch(`${api_url}/api/reportes/gastos/${proyectoId}`)
      .then(setData)
      .catch((err) => setError(err.message || "Error al cargar gastos"));
  }, [proyectoId]);

  if (error) return <p className="error-text">{error}</p>;
  if (!data) return <p>Cargando gastos del proyecto...</p>;
  const participantes = data.participantes || [];

  const detallesFiltrados = usuarioFiltro
    ? data.detalles.filter((g) => g.usuarioUid === usuarioFiltro)
    : data.detalles;

  const detallesOrdenados = [...detallesFiltrados].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const subtotalesPorUsuario: Record<string, number> = {};

  detallesFiltrados.forEach((gasto) => {
    if (!subtotalesPorUsuario[gasto.usuarioUid]) {
      subtotalesPorUsuario[gasto.usuarioUid] = 0;
    }
    subtotalesPorUsuario[gasto.usuarioUid] += gasto.monto;
  });

  return (
    <div className="gastos-container">
      <div className="mb-4">
        <h2 className="gastos-title">Gastos del Proyecto</h2>
        <label htmlFor="usuario-select" className="block font-semibold mb-1">
          Filtrar por usuario:
        </label>
        <select
          id="usuario-select"
          value={usuarioFiltro}
          onChange={(e) => setUsuarioFiltro(e.target.value)}
          className="input w-full max-w-xs">
          <option value="">-- Todos --</option>
          {participantes.map((u) => (
            <option key={u.uid} value={u.uid}>
              {u.nombre || u.uid}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        <button
          onClick={async () => {
            setExportando("excel");
            await exportarExcel(detallesFiltrados, participantes, proyectoId);
            setExportando("");
          }}
          className="btn-export"
          disabled={exportando === "excel"}>
          {exportando === "excel" ? "Exportando..." : "Exportar a Excel"}
        </button>
        <button
          onClick={async () => {
            setExportando("csv");
            await exportarCSV(detallesFiltrados, participantes, proyectoId);
            setExportando("");
          }}
          className="btn-export"
          disabled={exportando === "csv"}>
          {exportando === "csv" ? "Exportando..." : "Exportar a CSV"}
        </button>
        <button
          onClick={async () => {
            setExportando("pdf");
            await exportarPDF(detallesFiltrados, participantes, proyectoId);
            setExportando("");
          }}
          className="btn-export"
          disabled={exportando === "pdf"}>
          {exportando === "pdf" ? "Exportando..." : "Exportar a PDF"}
        </button>
      </div>
      <p className="total-gasto">
        Total Gastado:{" "}
        <span className="total-gasto-value">
          S/.{data.totalGasto ? data.totalGasto.toFixed(2) : "0.00"}
        </span>
      </p>

      <div className="subtotales-usuarios">
        <h3 className="subtotales-title">Subtotales por usuario</h3>
        <div className="subtotales-list">
          {Object.entries(subtotalesPorUsuario).map(([uid, total]) => {
            const nombre =
              participantes.find((p) => p.uid === uid)?.nombre || uid;
            return (
              <div key={uid} className="subtotal-item">
                <span className="subtotal-nombre">{nombre}</span>
                <span className="subtotal-monto">S/.{total.toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contenedor de tarjetas */}
      <div className="gastos-grid">
        {detallesOrdenados.map((gasto, idx) => (
          <div key={idx} className="gasto-card">
            <h3 className="gasto-item">{gasto.item || "Sin item"}</h3>
            <p className="gasto-detail">
              <strong>Categoría:</strong> {gasto.categoria || "Sin categoría"}
            </p>
            <p className="gasto-detail">
              <strong>Tipo:</strong> {gasto.tipo}
            </p>
            <p className="gasto-detail">
              <strong>Monto:</strong> S/.{gasto.monto.toFixed(2)}
            </p>
            <p className="gasto-detail">
              <strong>Fecha:</strong>{" "}
              {new Date(
                new Date(gasto.fecha).setDate(
                  new Date(gasto.fecha).getDate() + 1
                )
              ).toLocaleDateString()}
            </p>
            <p className="gasto-detail">
              <strong>Usuario:</strong>{" "}
              {data.participantes.find((p) => p.uid === gasto.usuarioUid)
                ?.nombre || gasto.usuarioUid}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GastosPorProyecto;
