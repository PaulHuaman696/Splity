export interface Participante {
  uid: string;
  nombre: string;
  aceptado: boolean;
}

export interface ProyectoGasto {
  _id: string;
  nombre: string;
  codigoUnico: string;
  fechaCreacion: string;
  descripcion: string;
  participantes: Participante[];
  creadoPor: {
    uid: string;
    nombre: string;
  };
}

export interface Invitacion {
  _id: string;
  proyectoId: ProyectoGasto;
  emailInvitado: string;
  estado: string;
  enviadoPor: string;
}
