const mongoose = require("mongoose");

const GastoSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true }, // referencia al ítem
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
  monto: { type: Number, required: true },
  descripcion: { type: String }, // opcional o requerido, según tu lógica
  fecha: { type: Date, required: true },
  usuarioId: { type: String, required: true },
});

module.exports = mongoose.model("Gasto", GastoSchema);
