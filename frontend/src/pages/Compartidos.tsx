// src/pages/Compartidos.tsx
import React, { useState } from 'react';

const Compartidos = () => {
  const [gasto, setGasto] = useState("");
  const [monto, setMonto] = useState("");
  const [gastosCompartidos, setGastosCompartidos] = useState<{ gasto: string, monto: number }[]>([]);

  const handleAddGastoCompartido = () => {
    setGastosCompartidos([...gastosCompartidos, { gasto, monto: parseFloat(monto) }]);
    setGasto("");
    setMonto("");
  };

  return (
    <div>
      <h2>Gastos Compartidos</h2>
      <div>
        <input
          type="text"
          value={gasto}
          onChange={(e) => setGasto(e.target.value)}
          placeholder="Gasto compartido"
        />
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
        />
        <button onClick={handleAddGastoCompartido}>Añadir Gasto Compartido</button>
      </div>
      <div>
        <h3>Lista de Gastos Compartidos</h3>
        <ul>
          {gastosCompartidos.map((g, index) => (
            <li key={index}>{g.gasto}: ${g.monto}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Compartidos;
