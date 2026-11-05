import { z } from "zod";

export const entryAnalysisSchema = z.object({
  summary: z.string().default(''),
  actions: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  impact: z.string().default(''),
  cvStatement: z.string().default(''),
});

export type EntryAnalysis = z.infer<typeof entryAnalysisSchema>;