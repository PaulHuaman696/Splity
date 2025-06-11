// src/types/index.ts
export interface Participante {
  uid: string;
  nombre: string;
  email: string;
}

export interface GastoDetalle {
  itemId: string;
  categoria: string;
  item: string;
  monto: number;
  fecha: string;
  tipo: string;
  usuarioUid: string;
}

export interface GastosPorProyectoData {
  _id: string;
  totalGasto: number;
  detalles: GastoDetalle[];
  participantes: Participante[];
}
