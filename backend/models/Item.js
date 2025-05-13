const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: "Categoria", required: true },
  usuarioId: { type: String, required: true }, // importante para multiusuario
});

module.exports = mongoose.model("Item", ItemSchema);
