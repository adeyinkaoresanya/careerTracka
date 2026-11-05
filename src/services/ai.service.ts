import { DEFAULT_LLM_MODEL } from '../infrastructure/llm/config/models';
import { entryAnalysisSchema } from '../validators/entryAnalysis.validator';
import { SYSTEM_PROMPT } from '../infrastructure/llm/prompts/systemPrompt';
import { OUTPUT_PROMPT } from '../infrastructure/llm/prompts/outputPrompt';
import { llmService } from '../infrastructure/llm/llm.service';

interface AnalyzeWorkEntryInput {
  jobRole: string;
  jobContent: string;
  tools: string[];
  providerModel?: string;
}

export const aiService = {
  async analyzeWorkEntry(input: AnalyzeWorkEntryInput) {
    const systemPrompt = SYSTEM_PROMPT;
    const userPrompt = `
      Job Role: ${input.jobRole}

      Work Description:
      ${input.jobContent}

      Tools Used:
      ${input.tools.join(', ')}

      `
    const outputPrompt = OUTPUT_PROMPT;

    const response = await llmService.generate({
      providerModel: input.providerModel ?? DEFAULT_LLM_MODEL,
      systemPrompt,
      userPrompt,
      temperature: 0.2,
      maxTokens: 1500,
      format: 'json',
    });

    let parsedPayload: unknown;
    const rawContent = response.content.trim();

    try {
      parsedPayload = JSON.parse(rawContent);
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('LLM returned invalid JSON for work-entry analysis');
      }
      parsedPayload = JSON.parse(jsonMatch[0]);
    }

    const parsed = entryAnalysisSchema.parse(parsedPayload);

    return {
      ...parsed,
      statement: parsed.cvStatement,
      provider: response.provider,
      model: response.model,
      usage: response.usage,
    };
  },
};

