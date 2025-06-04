// src/utils/gastosUtils.ts

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Participante, GastoDetalle } from "../types/index";

export const exportarExcel = (
  detalles: GastoDetalle[],
  participantes: Participante[],
  proyectoId: string
) => {
  const rows = mapGastosToRows(detalles, participantes);
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gastos");
  XLSX.writeFile(wb, `gastos_proyecto_${proyectoId}.xlsx`);
};

export const exportarCSV = (
  detalles: GastoDetalle[],
  participantes: Participante[],
  proyectoId: string
) => {
  const rows = mapGastosToRows(detalles, participantes);
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `gastos_proyecto_${proyectoId}.csv`;
  link.click();
};

export const exportarPDF = (
  detalles: GastoDetalle[],
  participantes: Participante[],
  proyectoId: string
) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Reporte de Gastos del Proyecto", 14, 20);

  const rows = detalles.map((gasto) => [
    participantes.find((p) => p.uid === gasto.usuarioUid)?.nombre || gasto.usuarioUid,
    gasto.item,
    gasto.categoria,
    gasto.tipo,
    gasto.monto.toFixed(2),
    new Date(new Date(gasto.fecha).setDate(new Date(gasto.fecha).getDate() + 1)).toLocaleDateString(),
  ]);

  autoTable(doc, {
    head: [["Usuario", "Item", "Categoría", "Tipo", "Monto", "Fecha"]],
    body: rows,
    startY: 30,
  });

  doc.save(`reporte_gastos_${proyectoId}_${new Date().toLocaleDateString('es-PE').slice(0,10)}.pdf`);
};

export const mapGastosToRows = (
  detalles: GastoDetalle[],
  participantes: Participante[]
) => {
  return detalles.map((gasto) => ({
    Usuario: participantes.find((p) => p.uid === gasto.usuarioUid)?.nombre || gasto.usuarioUid,
    Item: gasto.item,
    Categoría: gasto.categoria,
    Tipo: gasto.tipo,
    Monto: gasto.monto,
    Fecha: new Date(new Date(gasto.fecha).setDate(new Date(gasto.fecha).getDate() + 1)).toLocaleDateString(),
  }));
};
