import type { ProviderName, LLMProvider } from './llm.types';

import { openaiProvider } from './providers/openai/openai.provider';
import { ollamaProvider } from './providers/ollama/ollama.provider';

export const providerRegistry: Record<ProviderName, LLMProvider> = {
  openai: openaiProvider,
  ollama: ollamaProvider,
};