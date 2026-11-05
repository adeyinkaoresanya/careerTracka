import { openaiBreaker } from './openai.breaker';
import type { LLMProvider, LLMRequest, LLMResponse } from '../../llm.types';

export const openaiProvider: LLMProvider = {
  async generate(request: LLMRequest): Promise<LLMResponse> {
    const response = await openaiBreaker.fire({
      model: request.model,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      max_completion_tokens: request.maxTokens ?? 1500,
      ...(request.format === 'json' && {
        response_format: { type: 'json_object' },
      }),
    });

    const result = response.data;

    return {
      content: result.choices[0]?.message?.content ?? '',
      provider: 'openai',
      model: result.model,
      usage: {
        inputTokens: result.usage?.prompt_tokens ?? 0,
        outputTokens: result.usage?.completion_tokens ?? 0,
        totalTokens: result.usage?.total_tokens ?? 0,
      },
    };
  },
};