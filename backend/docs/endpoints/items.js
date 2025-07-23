/**
 * @swagger
 * tags:
 *   name: Ítems
 *   description: Gestión de ítems utilizados en gastos compartidos
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Crear un nuevo ítem
 *     tags: [Ítems]
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
 *                 example: Pizza grande
 *               precio:
 *                 type: number
 *                 example: 20.00
 *     responses:
 *       201:
 *         description: Ítem creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /items/buscar:
 *   get:
 *     summary: Buscar ítems por nombre (filtrado por usuario)
 *     tags: [Ítems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: q
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *     responses:
 *       200:
 *         description: Lista de ítems encontrados
 *       401:
 *         description: No autorizado
 */
