// docs/swagger.js
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi API de Finanzas',
      version: '1.0.0',
      description: 'API para gestionar gastos, ingresos, préstamos, etc.',
    },
    servers: [
      {
        url: 'https://api-movigo.space/api', // Ajusta al entorno de despliegue
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./docs/endpoints/*.js'], // Usaremos esta carpeta para definir endpoints
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
