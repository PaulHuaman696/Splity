/**
 * @swagger
 * tags:
 *   name: Invitaciones
 *   description: Gestión de invitaciones para proyectos compartidos
 */

/**
 * @swagger
 * /invitaciones:
 *   post:
 *     summary: Enviar una invitación a otro usuario
 *     tags: [Invitaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - destinatarioUid
 *               - proyectoId
 *             properties:
 *               destinatarioUid:
 *                 type: string
 *                 example: u123456
 *               proyectoId:
 *                 type: string
 *                 example: p7890
 *     responses:
 *       201:
 *         description: Invitación enviada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /invitaciones:
 *   get:
 *     summary: Obtener invitaciones recibidas por el usuario
 *     tags: [Invitaciones]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de invitaciones recibidas
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /invitaciones/responder:
 *   post:
 *     summary: Responder a una invitación (aceptar o rechazar)
 *     tags: [Invitaciones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - invitacionId
 *               - respuesta
 *             properties:
 *               invitacionId:
 *                 type: string
 *                 example: inv123
 *               respuesta:
 *                 type: string
 *                 enum: [aceptar, rechazar]
 *                 example: aceptar
 *     responses:
 *       200:
 *         description: Invitación respondida correctamente
 *       400:
 *         description: Respuesta inválida
 *       401:
 *         description: No autorizado
 */
