/**
 * @swagger
 * tags:
 *   name: Gastos
 *   description: Endpoints para la gestión de gastos del usuario
 */

/**
 * @swagger
 * /expense:
 *   post:
 *     summary: Crear un nuevo gasto
 *     tags: [Gastos]
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
 *                 example: Cena en restaurante
 *               monto:
 *                 type: number
 *                 example: 25.50
 *               categoriaId:
 *                 type: string
 *                 example: "64a12345b123456c7890def1"
 *               fecha:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-23"
 *     responses:
 *       201:
 *         description: Gasto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /expense:
 *   get:
 *     summary: Obtener los gastos del usuario autenticado
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de gastos
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
 *                   categoriaId:
 *                     type: string
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /expense/{id}:
 *   put:
 *     summary: Editar un gasto existente por ID
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del gasto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               monto:
 *                 type: number
 *               fecha:
 *                 type: string
 *                 format: date
 *               categoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gasto actualizado
 *       404:
 *         description: Gasto no encontrado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /expense/{id}:
 *   delete:
 *     summary: Eliminar un gasto por ID
 *     tags: [Gastos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del gasto
 *     responses:
 *       200:
 *         description: Gasto eliminado
 *       404:
 *         description: Gasto no encontrado
 *       401:
 *         description: No autorizado
 */