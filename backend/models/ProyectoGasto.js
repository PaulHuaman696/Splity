// models/ProyectoGasto.js
const mongoose = require("mongoose");

const participanteSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  aceptado: {
    type: Boolean,
    default: false,
  },
});

const proyectoGastoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
    },
    creadoPor: {
      uid: {
        type: String,
        required: true,
      },
      nombre: {
        type: String,
      },
    },
    participantes: [participanteSchema],
    codigoUnico: {
      type: String,
      required: true,
      unique: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProyectoGasto", proyectoGastoSchema);
