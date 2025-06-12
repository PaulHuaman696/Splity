const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const reporteController = require("../controllers/reporteController");

router.get("/mensual", verifyToken, reporteController.getIngresosGastosMensuales);
router.get("/gastos/:proyectoId", verifyToken, reporteController.getGastosPorProyecto);
router.get("/compartido/:proyectoId", verifyToken, reporteController.getBalanceCompartidoPorProyecto);
router.get("/gastos-recientes", verifyToken, reporteController.getGastosRecientes);
router.get("/saldos-globales", verifyToken, reporteController.getSaldosGlobales);
router.get("/gastos-por-categoria", verifyToken, reporteController.getGastosPorCategoria);
router.get("/historial-mensual", verifyToken, reporteController.getHistorialMensual);
router.get("/tendencia-diaria", verifyToken, reporteController.getTendenciaDiaria);
router.get("/top-gastos", verifyToken, reporteController.getTopGastos);

module.exports = router;
