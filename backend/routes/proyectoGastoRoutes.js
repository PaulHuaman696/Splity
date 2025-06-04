const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const controller = require("../controllers/proyectoGastoController");

// Crear nuevo proyecto
router.post("/", verifyToken, controller.createProyecto);

// Obtener proyectos del usuario
router.get("/", verifyToken, controller.getProyectosByUser);

// Unirse a proyecto por código
router.patch("/join", verifyToken, controller.joinProyectoByCodigo);

// Eliminar un proyecto (solo el creador)
router.delete("/:id", verifyToken, controller.deleteProyecto);

router.get("/individual", verifyToken, controller.getProyectoIndividual);
router.delete("/:id/participantes/:uid", verifyToken, controller.eliminarParticipante);

module.exports = router;

