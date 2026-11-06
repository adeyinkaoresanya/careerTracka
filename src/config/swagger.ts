import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocuChat API',
      version: '1.0.0',
      description: 'AI-Powered Document Q&A System',
    },
    servers: [
      { url: '/api/v1', description: 'Version 1' }, // This can point to another environment for testing out so developers dont touch the production database
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
    tags: [
      { name: 'Health', description: 'API health checks' },
      { name: 'Authentication', description: 'User authentication' },
      { name: 'Work Entries', description: 'Manage weekly work entries' },
      { name: 'Analysis', description: 'AI-powered work analysis' },
      { name: 'Achievements', description: 'Manage career achievements' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

