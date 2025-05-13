// pages/gastos/GastosList.tsx
import React from "react";

const dummyGastos = [
  { id: 1, categoria: "Comida", monto: 45.5, descripcion: "Cena", fecha: "2025-05-10" },
  { id: 2, categoria: "Transporte", monto: 12, descripcion: "Taxi", fecha: "2025-05-11" },
  { id: 3, categoria: "Salud", monto: 30, descripcion: "Farmacia", fecha: "2025-05-09" },
];

const GastosList = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lista de gastos</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Categoría</th>
            <th style={styles.th}>Monto</th>
            <th style={styles.th}>Descripción</th>
            <th style={styles.th}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {dummyGastos.map((gasto) => (
            <tr key={gasto.id} style={styles.tr}>
              <td style={styles.td}>{gasto.categoria}</td>
              <td style={styles.td}>S/ {gasto.monto.toFixed(2)}</td>
              <td style={styles.td}>{gasto.descripcion}</td>
              <td style={styles.td}>{gasto.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    background: "#f9fafb",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "900px",
    margin: "0 auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    marginBottom: "20px",
    textAlign: "center",
    color: "#1f2937",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  tr: {
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px",
    color: "#374151",
  },
};

export default GastosList;
