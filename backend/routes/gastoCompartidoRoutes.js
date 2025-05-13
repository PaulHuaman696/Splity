const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const controller = require("../controllers/gastoCompartidoController");

router.post("/", verifyToken, controller.createGastoCompartido);
router.get("/", verifyToken, controller.getGastosCompartidosByUser);

module.exports = router;
