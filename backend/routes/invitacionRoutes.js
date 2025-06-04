const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const invitacionController = require("../controllers/invitacionController");

router.post("/", verifyToken, invitacionController.crearInvitacion);

router.get("/", verifyToken, invitacionController.listarInvitacionesUsuario);

router.post("/responder", verifyToken, invitacionController.responderInvitacion);

module.exports = router;
