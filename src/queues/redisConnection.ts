import IORedis from 'ioredis';
import { config } from '../config/env';

export const redisConnection = new IORedis({
  host: config.REDIS_HOST || 'localhost',
  port: config.REDIS_PORT ?? 6379,
  password: config.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Required by BullMQ
});