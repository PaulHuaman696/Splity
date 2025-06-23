const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/userController");

// Guardar o actualizar información adicional del usuario
router.post("/profile", verifyToken, userController.createOrUpdateUser);

// Obtener información del usuario autenticado
router.get('/me',verifyToken, userController.getMyUserData);

router.post("/change-password", verifyToken, userController.changePassword);
router.get('/all', verifyToken, userController.getAllUsers);
// Ruta para obtener los datos de un usuario por su UID
router.get("/:uid", verifyToken, userController.getUserDataByUid);


module.exports = router;
