import CircuitBreaker from 'opossum';
import { openaiClient } from './openai.client';
import { withRetry } from '../../retry';
import { logger } from '../../../../lib/logger';

async function callOpenAI(body: any) {
  return withRetry(
    () => openaiClient.post('/chat/completions', body),
    {
      maxAttempts: 3,
      baseDelayMs: 1000,
    }
  );
}

export const openaiBreaker = new CircuitBreaker(callOpenAI, {
  timeout: 120000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  rollingCountTimeout: 60000,
  rollingCountBuckets: 10,
});

openaiBreaker.on('open', () =>
  logger.warn('OpenAI circuit breaker OPENED')
);

openaiBreaker.on('halfOpen', () =>
  logger.warn('OpenAI circuit breaker HALF-OPEN')
);

openaiBreaker.on('close', () =>
  logger.info('OpenAI circuit breaker CLOSED')
);