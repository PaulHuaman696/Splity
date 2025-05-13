// src/pages/Ingresos.tsx
import React, { useState } from 'react';

const Ingresos = () => {
  const [ingreso, setIngreso] = useState("");
  const [monto, setMonto] = useState("");
  const [ingresosList, setIngresosList] = useState<{ fuente: string, monto: number }[]>([]);

  const handleAddIngreso = () => {
    setIngresosList([...ingresosList, { fuente: ingreso, monto: parseFloat(monto) }]);
    setIngreso("");
    setMonto("");
  };

  return (
    <div>
      <h2>Gestión de Ingresos</h2>
      <div>
        <input
          type="text"
          value={ingreso}
          onChange={(e) => setIngreso(e.target.value)}
          placeholder="Fuente de ingreso"
        />
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
        />
        <button onClick={handleAddIngreso}>Añadir Ingreso</button>
      </div>
      <div>
        <h3>Lista de Ingresos</h3>
        <ul>
          {ingresosList.map((i, index) => (
            <li key={index}>{i.fuente}: ${i.monto}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Ingresos;

