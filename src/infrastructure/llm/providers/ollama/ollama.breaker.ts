import CircuitBreaker from 'opossum';
import { ollamaClient } from './ollama.client';
import { withRetry } from '../../retry';
import { logger } from '../../../../lib/logger';

async function callOllama(body: unknown) {
  return withRetry(
    () => ollamaClient.post('/api/chat', body),
    {
      maxAttempts: 3,
      baseDelayMs: 1000,
    }
  );
}

export const ollamaBreaker = new CircuitBreaker(callOllama, {
  timeout: 380000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000,
  rollingCountTimeout: 60000,
  rollingCountBuckets: 10,
});

ollamaBreaker.on('open', () =>
  logger.warn('Ollama circuit breaker OPENED')
);

ollamaBreaker.on('halfOpen', () =>
  logger.warn('Ollama circuit breaker HALF-OPEN')
);

ollamaBreaker.on('close', () =>
  logger.info('Ollama circuit breaker CLOSED')
);