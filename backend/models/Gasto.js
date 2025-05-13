const mongoose = require("mongoose");

const GastoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria" },
  usuarioId: { type: String, required: true },
});

module.exports = mongoose.model("Gasto", GastoSchema);
