const mongoose = require("mongoose");

const CategoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // para que cada usuario tenga sus categorías
});

module.exports = mongoose.model("Categoria", CategoriaSchema);
