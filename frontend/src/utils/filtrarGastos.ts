import type { Gasto } from "../types/Gasto";

interface Filtros {
  categoriaSeleccionada: string;
  itemBuscar: string;
  fechaInicio: string;
  fechaFin: string;
  ordenFecha: "asc" | "desc";
  ordenMonto: "asc" | "desc";
  ordenAlfabetico: "categoria" | "item" | "";
}

export const filtrarYGastosOrdenados = (gastos: Gasto[], filtros: Filtros): Gasto[] => {
  let filtrados = [...gastos];

  const {
    categoriaSeleccionada,
    itemBuscar,
    fechaInicio,
    fechaFin,
    ordenFecha,
    ordenMonto,
    ordenAlfabetico,
  } = filtros;

  if (categoriaSeleccionada) {
    filtrados = filtrados.filter(g => g.itemId?.categoriaId._id === categoriaSeleccionada);
  }

  if (itemBuscar.trim()) {
    filtrados = filtrados.filter(g =>
      g.itemId?.nombre.toLowerCase().includes(itemBuscar.toLowerCase())
    );
  }

  if (fechaInicio) {
    filtrados = filtrados.filter(g => new Date(g.fecha) >= new Date(fechaInicio));
  }

  if (fechaFin) {
    filtrados = filtrados.filter(g => new Date(g.fecha) <= new Date(fechaFin));
  }

  if (ordenFecha) {
    filtrados.sort((a, b) =>
      ordenFecha === "asc"
        ? new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        : new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  }

  if (ordenMonto) {
    filtrados.sort((a, b) => (ordenMonto === "asc" ? a.monto - b.monto : b.monto - a.monto));
  }

  if (ordenAlfabetico === "categoria") {
    filtrados.sort((a, b) =>
      (a.itemId?.categoriaId.nombre || "").localeCompare(b.itemId?.categoriaId.nombre || "")
    );
  } else if (ordenAlfabetico === "item") {
    filtrados.sort((a, b) =>
      (a.itemId?.nombre || "").localeCompare(b.itemId?.nombre || "")
    );
  }

  return filtrados;
};
