/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios y perfil
 */

/**
 * @swagger
 * /user/profile:
 *   post:
 *     summary: Crear o actualizar información adicional del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *                 example: Juan Pérez
 *               telefono:
 *                 type: string
 *                 example: "+521234567890"
 *               direccion:
 *                 type: string
 *                 example: Calle Falsa 123
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /user/change-password:
 *   post:
 *     summary: Cambiar contraseña del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: oldPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: newPass456
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 *       400:
 *         description: Datos inválidos o contraseña incorrecta
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /user/all:
 *   get:
 *     summary: Obtener lista de todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /user/{uid}:
 *   get:
 *     summary: Obtener datos de un usuario por UID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: uid
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: UID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 */
