/**
 * @swagger
 * tags:
 *   name: Ingresos
 *   description: Endpoints para la gestión de ingresos del usuario
 */

/**
 * @swagger
 * /income:
 *   post:
 *     summary: Registrar un nuevo ingreso
 *     tags: [Ingresos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - monto
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Sueldo mensual
 *               monto:
 *                 type: number
 *                 example: 1500.00
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *     responses:
 *       201:
 *         description: Ingreso registrado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /income:
 *   get:
 *     summary: Obtener los ingresos del usuario autenticado
 *     tags: [Ingresos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ingresos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   monto:
 *                     type: number
 *                   fecha:
 *                     type: string
 *                     format: date
 *       401:
 *         description: No autorizado
 */
