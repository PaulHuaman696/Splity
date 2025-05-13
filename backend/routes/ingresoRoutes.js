const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const ingresoController = require("../controllers/ingresoController");

router.post("/", verifyToken, ingresoController.createIngreso);
router.get("/", verifyToken, ingresoController.getIngresosByUser);

module.exports = router;
