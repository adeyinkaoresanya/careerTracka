import { z } from "zod";

export const entryAnalysisSchema = z.object({
  summary: z.string(),
  actions: z.array(z.string()),
  skills: z.array(z.string()),
  tools: z.array(z.string()),
  impact: z.string(),
  cvStatement: z.string(),
});

export type EntryAnalysis = z.infer<typeof entryAnalysisSchema>;