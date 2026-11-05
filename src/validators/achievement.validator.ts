import { z } from 'zod';

export const achievementIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Achievement id is required'),
  }),
});

export const achievementListSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['draft', 'approved', 'rejected']).optional(),
    sortBy: z.enum(['createdAt', 'updatedAt', 'status']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  }),
});

export const achievementUpdateSchema = z.object({
  body: z.object({
    statement: z.string().min(1).optional(),
    status: z.enum(['draft', 'approved', 'rejected']).optional(),
    skills: z.array(z.string()).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});
