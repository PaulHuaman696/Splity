const mongoose = require("mongoose");

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  userId: { type: String, required: true }, // para que cada usuario tenga sus categorías
});

CategoriaSchema.index({ nombre: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Categoria", CategoriaSchema);
