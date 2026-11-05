import { z } from 'zod';

export const analysisEntryParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Work entry id is required'),
  }),
});
