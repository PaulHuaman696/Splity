/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: Gestión de pagos y confirmaciones
 */

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Registrar un nuevo pago
 *     tags: [Pagos]
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
 *                 example: 100.00
 *               destinatarioUid:
 *                 type: string
 *                 example: u123456
 *               descripcion:
 *                 type: string
 *                 example: Pago por cena compartida
 *     responses:
 *       201:
 *         description: Pago registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /pagos/pendientes:
 *   get:
 *     summary: Obtener pagos pendientes de confirmación
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos pendientes
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /pagos/{pagoId}/confirmar:
 *   put:
 *     summary: Confirmar un pago pendiente
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pagoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago a confirmar
 *     responses:
 *       200:
 *         description: Pago confirmado
 *       404:
 *         description: Pago no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /pagos/{pagoId}/rechazar:
 *   put:
 *     summary: Rechazar un pago pendiente
 *     tags: [Pagos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pagoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pago a rechazar
 *     responses:
 *       200:
 *         description: Pago rechazado
 *       404:
 *         description: Pago no encontrado
 *       401:
 *         description: No autorizado
 */
