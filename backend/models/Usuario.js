const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true, // ID de Firebase
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Usuario", usuarioSchema);
