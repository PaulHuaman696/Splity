const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const gastoController = require("../controllers/gastoController");

// Crear un nuevo gasto
router.post("/", verifyToken, gastoController.createGasto);

// Obtener los gastos de un usuario
router.get("/", verifyToken, gastoController.getGastosByUser);

module.exports = router;
