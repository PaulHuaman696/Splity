export interface Categoria {
  _id: string;
  nombre: string;
}

export interface Item {
  _id: string;
  nombre: string;
  categoria: Categoria;
}

export interface Gasto {
  _id: string;
  itemId: Item;
  monto: number;
  descripcion: string;
  fecha: string;
  proyectoId: Proyecto;
  tipo: string;
}

export interface Proyecto {
  _id: string;
  nombre: string;
  descripcion: string;
}
