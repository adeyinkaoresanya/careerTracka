import type { ProviderName } from '../llm.types';

export interface ModelConfig {
  provider: ProviderName;
  model: string;
  enabled: boolean;
  pricing?: {
    inputPerMillionTokens: number;
    outputPerMillionTokens: number;
  };
}

const defaultOllamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2:3b';

export const models: Record<string, ModelConfig> = {
  'openai-gpt-4o-mini': {
    provider: 'openai',
    model: 'gpt-4o-mini',
    enabled: true,
    pricing: {
      inputPerMillionTokens: 0.15,
      outputPerMillionTokens: 0.6,
    },
  },

  'openai-gpt-4.1-mini': {
    provider: 'openai',
    model: 'gpt-4.1-mini',
    enabled: true,
    pricing: {
      inputPerMillionTokens: 0.4,
      outputPerMillionTokens: 1.6,
    },
  },

  'openai-gpt-5-mini': {
    provider: 'openai',
    model: 'gpt-5-mini',
    enabled: true,
    pricing: {
      inputPerMillionTokens: 0.25,
      outputPerMillionTokens: 2.0,
    },
  },

  'openai-gpt-6.1-terra': {
    provider: 'openai',
    model: 'gpt-6.1-terra',
    enabled: true,
    pricing: {
      inputPerMillionTokens: 1,
      outputPerMillionTokens: 5,
    },
  },

  'ollama-llama': {
    provider: 'ollama',
    model: defaultOllamaModel,
    enabled: true,
    pricing: {
      inputPerMillionTokens: 0,
      outputPerMillionTokens: 0,
    },
  },
};

export const DEFAULT_LLM_MODEL = 'openai-gpt-4o-mini';
// export const DEFAULT_LLM_MODEL = 'ollama-llama';