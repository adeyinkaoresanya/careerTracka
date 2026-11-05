import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { config } from '../config/env';
import { cacheRedis } from '../lib/cache';

const router = Router();

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Check service liveness
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   example: 123.456
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/health/live', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Check service readiness
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service dependencies are healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 checks:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *       503:
 *         description: One or more dependencies are unhealthy
 */
router.get('/health/ready', async (req, res) => {
  const checks: Record<string, any> = {};

  // Check database
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'ok' };
  } catch (error) {
    checks.database = {
      status: 'error',
      message: (error as Error).message,
    };
  }

  // Check Redis
  try {
    await cacheRedis.ping();
    checks.redis = { status: 'ok' };
  } catch (error) {
    checks.redis = {
      status: 'error',
      message: (error as Error).message,
    };
  }

  const allHealthy = Object.values(checks)
    .every(c => c.status === 'ok');

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default router;
