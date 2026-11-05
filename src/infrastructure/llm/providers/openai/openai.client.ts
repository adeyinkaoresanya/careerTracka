import axios from 'axios';
import { config } from '../../../../config/env';
import { logger } from '../../../../lib/logger';

export const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  timeout: 60000,
  headers: {
    Authorization: `Bearer ${config.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

openaiClient.interceptors.request.use((request) => {
  (request as any).metadata = {
    startTime: Date.now(),
  };

  logger.info(`→ OpenAI ${request.method?.toUpperCase()} ${request.url}`);

  return request;
});

openaiClient.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any).metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    logger.info(
      `← OpenAI ${response.status} ${response.config.url} (${duration}ms)`
    );

    return response;
  },
  (error) => {
    logger.error(
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      },
      'OpenAI request failed'
    );

    return Promise.reject(error);
  }
);