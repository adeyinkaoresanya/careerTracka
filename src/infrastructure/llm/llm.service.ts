import { models, DEFAULT_LLM_MODEL } from './config/models';
import { providerRegistry } from './llm.registry';
import type { GenerateRequest, LLMResponse } from './llm.types';

export const llmService = {
  async generate(payload: GenerateRequest): Promise<LLMResponse> {
    const modelKey = payload.providerModel ?? DEFAULT_LLM_MODEL;

    const modelConfig = models[modelKey];

    if (!modelConfig || !modelConfig.enabled) {
      throw new Error(`Model '${modelKey}' is unavailable`);
    }

    const provider = providerRegistry[modelConfig.provider];

    const response = await provider.generate({
      model: modelConfig.model,
      systemPrompt: payload.systemPrompt,
      userPrompt: payload.userPrompt,
      ...(payload.temperature !== undefined && { temperature: payload.temperature }),
      ...(payload.maxTokens !== undefined && { maxTokens: payload.maxTokens }),
      ...(payload.format !== undefined && { format: payload.format }),
    });

    const pricing = modelConfig.pricing;
    const inputTokens = response.usage?.inputTokens ?? 0;
    const outputTokens = response.usage?.outputTokens ?? 0;
    const costUsd = pricing
      ? (inputTokens * pricing.inputPerMillionTokens) / 1_000_000 +
        (outputTokens * pricing.outputPerMillionTokens) / 1_000_000
      : 0;

    return {
      ...response,
      costUsd,
    };
  },
};

// export const llmService = {
//   async generate(
//     payload: GenerateRequest
//   ): Promise<LLMResponse> {
//     const { providerModel, ...payload } = payload;

//     const modelConfig = models[providerModel];

//     if (!modelConfig || !modelConfig.enabled) {
//       throw new Error(`Model ${providerModel} is unavailable`);
//     }

//     const provider = providerRegistry[modelConfig.provider];

//     return provider.generate({
//       ...payload,
//       model: modelConfig.model,
//     });
//   },
// };