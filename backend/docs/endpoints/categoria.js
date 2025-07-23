/**
 * @swagger
 * tags:
 *   name: Categorías
 *   description: Endpoints para gestionar categorías del usuario
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categorías]
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Alimentación
 *     responses:
 *       201:
 *         description: Categoría creada exitosamente
 *       400:
 *         description: Error de validación o datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener las categorías del usuario autenticado
 *     tags: [Categorías]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "64a12345b123456c7890def1"
 *                   nombre:
 *                     type: string
 *                     example: Alimentación
 *                   usuarioId:
 *                     type: string
 *                     example: "user123"
 *       401:
 *         description: No autorizado
 */
