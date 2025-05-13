const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const categoriaController = require("../controllers/categoriaController");

// Crear una nueva categoría
router.post("/", verifyToken, categoriaController.createCategoria);

// Obtener las categorías de un usuario
router.get("/", verifyToken, categoriaController.getCategoriasByUser);

module.exports = router;
