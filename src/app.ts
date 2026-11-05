  import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { config } from './config/env';
import { requestLogger } from './middleware/requestLogger';

import {healthRoutes, authRoutes, workEntryRoutes, analysisRoutes} from './routes/index';
import './events/auth.events';
import './events/workEntry.events';


import { errorHandler } from './middleware/errorHandler';
import { sanitizeInput } from './middleware/sanitize';
//import { authLimiter, apiLimiter } from './middleware/rateLimiter';
// import { metricsMiddleware } from './middleware/metrics';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

const app = express();

// === MIDDLEWARE (runs on every request) ===
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      scriptSrc: ["'none'"],
      styleSrc: ["'none'"],
      imgSrc: ["'none'"],
      connectSrc: ["'self'"],
      // Allow Swagger UI if you serve it
      // scriptSrc: ["'self'", "'unsafe-inline'"],
      // styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
})
);  


const allowedOrigins = [
  config.FRONTEND_URL || 'http://localhost:3001',
];

// Security headers
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,  // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}
)); 

app.use(express.json());        // Parse JSON request bodies
app.use(sanitizeInput);
app.use(requestLogger);
// app.use(metricsMiddleware);    // Prometheus metrics

// Serve Swagger UI
app.use('/api-docs', helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}), 
swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Also serve the raw JSON spec (useful for code generators)
app.get('/api-docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// === HEALTH CHECK ===

app.use(healthRoutes);

// Metrics endpoint (no auth — Prometheus needs to scrape it)
// app.get('/metrics', async (req, res) => {
//   res.set('Content-Type', metricsRegistry.contentType);
//   res.send(await metricsRegistry.metrics());
// });



// === ROUTES (mounted here as you build them) ===
// API v1
//app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth', authRoutes); //add authLimiter here
app.use('/api/v1/work', workEntryRoutes);
app.use('/api/v1/work', analysisRoutes);

 
// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.path} not found` },
  });
});

app.use(errorHandler);

export { app };
