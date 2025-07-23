/**
 * @swagger
 * tags:
 *   name: Proyectos
 *   description: Gestión de proyectos de gasto compartido
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Proyectos]
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
 *                 example: Viaje a la playa
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Obtener los proyectos del usuario autenticado
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /projects/individual:
 *   get:
 *     summary: Obtener información individual de un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Proyecto individual obtenido
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /projects/join:
 *   patch:
 *     summary: Unirse a un proyecto usando un código
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *                 example: ABC123
 *     responses:
 *       200:
 *         description: Usuario unido al proyecto
 *       400:
 *         description: Código inválido
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto (solo el creador puede hacerlo)
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *       403:
 *         description: No autorizado a eliminar
 *       404:
 *         description: Proyecto no encontrado
 */

/**
 * @swagger
 * /projects/{id}/participantes/{uid}:
 *   delete:
 *     summary: Eliminar a un participante de un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del proyecto
 *         schema:
 *           type: string
 *       - name: uid
 *         in: path
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participante eliminado
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Participante o proyecto no encontrado
 */
