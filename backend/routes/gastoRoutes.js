const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const gastoController = require("../controllers/gastoController");

// Crear un nuevo gasto
router.post("/", verifyToken, gastoController.createGasto);

// Obtener los gastos de un usuario
router.get("/", verifyToken, gastoController.getGastosByUser);

// Editar un gasto por ID
router.put("/:id", verifyToken, gastoController.updateGasto);

// Eliminar un gasto por ID
router.delete("/:id", verifyToken, gastoController.deleteGasto);

router.get("/reportes", verifyToken, gastoController.getGastosParaReporte);

module.exports = router;
