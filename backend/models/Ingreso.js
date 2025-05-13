const mongoose = require("mongoose");

const ingresoSchema = new mongoose.Schema({
  user: {
    type: String, // UID de Firebase
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Ingreso", ingresoSchema);
