const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const reporteController = require("../controllers/reporteController");

router.get("/mensual", verifyToken, reporteController.getIngresosGastosMensuales);
router.get("/gastos/:proyectoId", verifyToken, reporteController.getGastosPorProyecto);
router.get("/compartido/:proyectoId", verifyToken, reporteController.getBalanceCompartidoPorProyecto);

module.exports = router;
