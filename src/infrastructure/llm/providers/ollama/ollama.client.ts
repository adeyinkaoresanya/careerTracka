import axios, { type AxiosInstance } from 'axios';
import { config } from '../../../../config/env';
import { logger } from '../../../../lib/logger';

export const ollamaClient: AxiosInstance = axios.create({
  baseURL: config.OLLAMA_BASE_URL || 'http://localhost:11434',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'DocuChat/1.0',
  },
});

ollamaClient.interceptors.request.use((request) => {
  (request as any).metadata = {
    startTime: Date.now(),
  };

  logger.info(
    `→ Ollama ${request.method?.toUpperCase()} ${request.url}`
  );

  return request;
});

ollamaClient.interceptors.response.use(
  (response) => {
    const startTime = (response.config as any).metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    logger.info(
      `← Ollama ${response.status} ${response.config.url} (${duration}ms)`
    );

    return response;
  },
  (error) => {
    const startTime = error.config?.metadata?.startTime;
    const duration = startTime ? Date.now() - startTime : 0;

    logger.error(
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
        duration,
      },
      'Ollama request failed'
    );

    return Promise.reject(error);
  }
);