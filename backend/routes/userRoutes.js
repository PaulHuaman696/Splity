const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/userController");

// Guardar o actualizar información adicional del usuario
router.post("/profile", verifyToken, userController.createOrUpdateUser);

// Obtener información del usuario autenticado
router.get('/me',verifyToken, userController.getMyUserData);;

module.exports = router;
