const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');
const verifyToken = require('../middlewares/verifyToken');

// Todas las rutas de préstamos requieren autenticación
router.use(verifyToken);

// POST /api/prestamos -> Registrar un nuevo préstamo
router.post('/', prestamoController.registrarPrestamo);

// GET /api/prestamos/pendientes -> Ver préstamos que necesitan mi confirmación
router.get('/pendientes', prestamoController.getPrestamosPendientes);

// GET /api/prestamos/historial -> Ver mi historial de préstamos dados y recibidos
router.get('/historial', prestamoController.getMisPrestamos);

// PUT /api/prestamos/:prestamoId/responder -> Confirmar o rechazar un préstamo
router.put('/:prestamoId/responder', prestamoController.responderAPrestamo);

module.exports = router;