/**
 * @swagger
 * tags:
 *   name: Préstamos
 *   description: Gestión de préstamos y confirmaciones
 */

/**
 * @swagger
 * /prestamos:
 *   post:
 *     summary: Registrar un nuevo préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - monto
 *               - destinatarioUid
 *             properties:
 *               monto:
 *                 type: number
 *                 example: 500.00
 *               destinatarioUid:
 *                 type: string
 *                 example: u7890
 *               descripcion:
 *                 type: string
 *                 example: Préstamo para gastos médicos
 *     responses:
 *       201:
 *         description: Préstamo registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /prestamos/pendientes:
 *   get:
 *     summary: Obtener préstamos pendientes de confirmación
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de préstamos pendientes
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /prestamos/historial:
 *   get:
 *     summary: Obtener historial de préstamos dados y recibidos
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial de préstamos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /prestamos/{prestamoId}/responder:
 *   put:
 *     summary: Confirmar o rechazar un préstamo
 *     tags: [Préstamos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: prestamoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo a responder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - respuesta
 *             properties:
 *               respuesta:
 *                 type: string
 *                 enum: [aceptar, rechazar]
 *                 example: aceptar
 *     responses:
 *       200:
 *         description: Respuesta registrada
 *       400:
 *         description: Respuesta inválida
 *       401:
 *         description: No autorizado
 */
