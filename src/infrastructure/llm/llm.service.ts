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

    return provider.generate({
      model: modelConfig.model,
      systemPrompt: payload.systemPrompt,
      userPrompt: payload.userPrompt,
      ...(payload.temperature !== undefined && { temperature: payload.temperature }),
  ...(payload.maxTokens !== undefined && { maxTokens: payload.maxTokens }),
      ...(payload.format !== undefined && { format: payload.format }),
    });
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