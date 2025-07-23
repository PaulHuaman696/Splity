/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Consultas y reportes financieros del usuario
 */

/**
 * @swagger
 * /reportes/mensual:
 *   get:
 *     summary: Obtener ingresos y gastos mensuales
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte mensual generado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/gastos/{proyectoId}:
 *   get:
 *     summary: Obtener gastos por proyecto
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: proyectoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Gastos por proyecto obtenidos
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/compartido/{proyectoId}:
 *   get:
 *     summary: Obtener balance compartido por proyecto
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: proyectoId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Balance compartido obtenido
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/gastos-recientes:
 *   get:
 *     summary: Obtener los gastos más recientes
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gastos recientes listados
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/saldos-globales:
 *   get:
 *     summary: Obtener los saldos generales del usuario
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Saldos globales retornados
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/gastos-por-categoria:
 *   get:
 *     summary: Obtener los gastos agrupados por categoría
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte de gastos por categoría generado
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/historial-mensual:
 *   get:
 *     summary: Obtener historial mensual de ingresos y gastos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Historial mensual obtenido
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/tendencia-diaria:
 *   get:
 *     summary: Obtener tendencia diaria de gastos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tendencia diaria obtenida
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /reportes/top-gastos:
 *   get:
 *     summary: Obtener los gastos más altos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top de gastos obtenido
 *       401:
 *         description: No autorizado
 */
