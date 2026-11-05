import type { ProviderName } from '../llm.types';

export interface ModelConfig {
  provider: ProviderName;
  model: string;
  enabled: boolean;
}

const defaultOllamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2:3b';

export const models: Record<string, ModelConfig> = {
  'openai-gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    enabled: true,
  },

  'openai-gpt-4.1-mini': {
    provider: 'openai',
    model: 'gpt-4.1-mini',
    enabled: true,
  },

  'openai-gpt-5-mini': {
    provider: 'openai',
    model: 'gpt-5-mini',
    enabled: true,
  },

  'ollama-llama': {
    provider: 'ollama',
    model: defaultOllamaModel,
    enabled: true,
  },
};

// export const DEFAULT_LLM_MODEL = 'openai-gpt-4o-mini';
export const DEFAULT_LLM_MODEL = 'ollama-llama';