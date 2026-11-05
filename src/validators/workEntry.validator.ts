import { z } from 'zod';

export const createEntrySchema = z.object({
  body: z.object({
    jobRole: z.string().min(1, 'Job role is required').max(500),
    jobContent: z.string().min(1, 'Content is required'),
    experienceLevel: z.string().max(255).optional(),
    industry: z.string().max(255).optional(),
    tools: z.array(z.string().max(255)).optional(),

    weekStart: z.coerce.date().max(new Date(), {
      message: 'Week start cannot be in the future',
    }),

    weekEnd: z.coerce.date().max(new Date(), {
      message: 'Week end cannot be in the future',
    }),
  }).refine(
    data => data.weekStart <= data.weekEnd,
    {
      message: 'Week start cannot be after week end',
      path: ['weekEnd'],
    }
  ),
});

export const listEntriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['pending','processing','ready','failed']).optional(),
    search: z.string().max(200).optional(),
    sortBy: z.enum(['createdAt','title','chunkCount']).default('createdAt'),
    sortOrder: z.enum(['asc','desc']).default('desc'),

  }),
});

export const entryParamsSchema = z.object({
  params: z.object({
    id: z.cuid2('Invalid work entry ID'),
  }),
});
