import { Worker, type Job } from 'bullmq';
import { redisConnection } from './redisConnection';
import { logger } from '../lib/logger';
import { deadLetterQueue } from './dead-letter.queue';
import { analysisService } from '../services/analysis.service';

const worker = new Worker(
  'processing-entry',
  async (job: Job) => {
    const { entryId, userId, correlationId } = job.data as {
      entryId: string;
      userId: string;
      correlationId: string;
    };

    logger.info(
      { correlationId, entryId, userId },
      'Work entry analysis job started'
    );

    try {
      return await analysisService.analyseEntry(entryId, userId);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const maxAttempts = job.opts.attempts ?? 1;
      const isFinalAttempt = job.attemptsMade >= maxAttempts - 1;

      logger.error(
        {
          correlationId,
          entryId,
          userId,
          error: err.message,
          attempt: job.attemptsMade + 1,
          maxAttempts,
          isFinalAttempt,
        },
        'Work entry analysis failed'
      );

      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 3,
  }
);

worker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Work entry analysis job completed');
});

worker.on('failed', async (job, error) => {
  if (!job) return;

  const maxAttempts = job.opts.attempts ?? 1;
  if (job.attemptsMade < maxAttempts) return;

  logger.error(
    {
      jobId: job.id,
      entryId: job.data.entryId,
      userId: job.data.userId,
      correlationId: job.data.correlationId,
      attempts: job.attemptsMade,
      error: error.message,
    },
    'Work entry analysis exhausted all retries'
  );

  try {
    await deadLetterQueue.add(
      'failed-work-entry-analysis',
      {
        originalJobId: job.id,
        originalQueue: 'processing-entry',
        data: job.data,
        error: error.message,
        failedAt: new Date().toISOString(),
        attempts: job.attemptsMade,
      },
      {
        jobId: `work-entry-${job.id}`,
      }
    );
  } catch (dlqError) {
    logger.error(
      { jobId: job.id, error: dlqError },
      'Failed to enqueue work entry in DLQ'
    );
  }
});


