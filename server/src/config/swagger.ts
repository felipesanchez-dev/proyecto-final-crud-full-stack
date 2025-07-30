import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Encuestas',
    version: '1.0.0',
    description: 'Documentación de la API para el sistema de creación y gestión de encuestas.',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Reemplazar con la URL de producción si es necesario
      description: 'Servidor de Desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const options = {
  swaggerDefinition,
  // Rutas a los archivos que contienen los endpoints documentados
  apis: ['./src/presentation/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
