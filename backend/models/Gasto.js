// models/Gasto.js
const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema(
  {
    usuarioUid: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    tipo: {
      type: String,
      enum: ["individual", "compartido"],
      default: "individual",
    },
    proyectoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProyectoGasto",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gasto", gastoSchema);
