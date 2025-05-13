const mongoose = require("mongoose");

const gastoCompartidoSchema = new mongoose.Schema({
  descripcion: {
    type: String,
    required: true,
  },
  montoTotal: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  participantes: [
    {
      uid: {
        type: String, // UID de Firebase
        required: true,
      },
      nombre: {
        type: String,
      },
      monto: {
        type: Number,
        required: true,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("GastoCompartido", gastoCompartidoSchema);
