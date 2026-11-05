import { Queue } from 'bullmq';
import { redisConnection } from './redisConnection';

export const EntryQueue = new Queue('processing-entry', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 200 }, // set to large number to remove all completed
    removeOnFail: { count: 500 }, // Set to 0 or delete config to not remove failed jobs.
  },
});

export async function queueEntryForProcessing(
  entryId: string,
  userId: string,
  correlationId: string
) {
  const job = await EntryQueue.add(
    'process-entry',
    { entryId, userId, correlationId, queuedAt: Date.now() },
  );
  return job.id;
}
