import { ollamaBreaker } from './ollama.breaker';
import type {
  LLMProvider,
  LLMRequest,
  LLMResponse,
} from '../../llm.types';

export const ollamaProvider: LLMProvider = {
  async generate(payload: LLMRequest): Promise<LLMResponse> {
    const response = await ollamaBreaker.fire({
      model: payload.model,
      messages: [
        {
          role: 'system',
          content: payload.systemPrompt,
        },
        {
          role: 'user',
          content: payload.userPrompt,
        },
      ],
      stream: false,
      format: payload.format ?? 'json',
      options: {
        temperature: payload.temperature ?? 0.1,
        num_predict: payload.maxTokens ?? 1500,
      },
    });

    const result = response.data;

    return {
      content: result.message?.content ?? '',
      provider: 'ollama',
      model: result.model,
      usage: {
        inputTokens: result.prompt_eval_count ?? 0,
        outputTokens: result.eval_count ?? 0,
        totalTokens:
          (result.prompt_eval_count ?? 0) +
          (result.eval_count ?? 0),
      },
    };
  },
};