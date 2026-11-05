export type ProviderName = 'openai' | 'ollama';

export interface LLMRequest {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  format?: 'json';
}

export interface GenerateRequest {
  providerModel: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  format?: 'json';  
}

export interface LLMResponse {
  content: string;
  provider: ProviderName;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
}