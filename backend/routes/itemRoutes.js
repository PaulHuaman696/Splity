const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const itemController = require("../controllers/itemController");

// Crear un nuevo item
router.post("/", verifyToken, itemController.createItem);

// Buscar items por nombre y usuario
router.get("/buscar", verifyToken, itemController.searchItems);

module.exports = router;
