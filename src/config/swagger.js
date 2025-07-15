// config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Client Management API',
      version: '1.0.0',
      description: 'API documentation for Client and Auth Management',
    },
    servers: [
      {
        url: 'http://localhost:7000/api', // ✅ Correct base URL for your current project
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // ✅ Must match location of your route files
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
