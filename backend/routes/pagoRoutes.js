const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const verifyToken = require('../middlewares/verifyToken'); // Tu middleware de autenticación

// Proteger todas las rutas de pagos con el middleware de autenticación
router.use(verifyToken);

// POST /api/pagos -> Para registrar un nuevo pago
router.post('/', pagoController.registrarPago);

// GET /api/pagos/pendientes -> Para ver las notificaciones de pagos por confirmar
router.get('/pendientes', pagoController.getPagosPendientes);

// PUT /api/pagos/:pagoId/confirmar -> Para aceptar un pago
router.put('/:pagoId/confirmar', pagoController.confirmarPago);

// PUT /api/pagos/:pagoId/rechazar -> Para rechazar un pago
router.put('/:pagoId/rechazar', pagoController.rechazarPago);

module.exports = router;