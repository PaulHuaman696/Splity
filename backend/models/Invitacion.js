const mongoose = require("mongoose");

const invitacionSchema = new mongoose.Schema({
  proyectoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProyectoGasto",
    required: true,
  },
  emailInvitado: {
    type: String,
    required: true,
  },
  invitadoUid: {
    type: String, // opcional, si el invitado ya está registrado
  },
  estado: {
    type: String,
    enum: ["pendiente", "aceptada", "rechazada"],
    default: "pendiente",
  },
  fechaInvitacion: {
    type: Date,
    default: Date.now,
  },
  enviadoPor: {
    type: String,
    required: true, // uid del creador/invitador
  },
});

module.exports = mongoose.model("Invitacion", invitacionSchema);
