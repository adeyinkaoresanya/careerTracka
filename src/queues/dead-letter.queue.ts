import { Queue } from 'bullmq';
import { redisConnection } from './redisConnection';

export const deadLetterQueue = new Queue('dead-letter', {
  connection: redisConnection,
});
