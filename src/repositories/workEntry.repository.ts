import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface ListWorkEntriesOptions {
	page: number;
	limit: number;
	search?: string;
	sortBy?: 'createdAt' | 'jobRole';
	sortOrder?: 'asc' | 'desc';
}

export const workEntryRepository = {
	async create(data: {
  userId: string;
  jobRole: string;
  jobContent: string;
  experienceLevel: string;
  industry: string;
  tools: string[];
  weekStart: Date;
  weekEnd: Date;
}) {
  return prisma.workEntry.create({
    data: {
      userId: data.userId,
      jobRole: data.jobRole,
      jobContent: data.jobContent,
      experienceLevel: data.experienceLevel,
      industry: data.industry,
      tools: data.tools,
      weekStart: data.weekStart,
      weekEnd: data.weekEnd,
    },
  });
},

	async findById(id: string) {
  return prisma.workEntry.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
},


	async listForUser(userId: string, options: ListWorkEntriesOptions) {
		const {
			page,
			limit,
			search,
			sortBy = 'createdAt',
			sortOrder = 'desc',
		} = options;

		const where: Prisma.WorkEntryWhereInput = {
			userId,
			deletedAt: null,
		};

		

		if (search) {
			where.jobRole = { contains: search, mode: 'insensitive' };
			where.jobContent = { contains: search, mode: 'insensitive' };
		}

		const [entries, total] = await Promise.all([
			prisma.workEntry.findMany({
				where,
				orderBy: { [sortBy]: sortOrder },
				skip: (page - 1) * limit,
				take: limit,
				select: {
					id: true,
					jobRole: true,
					jobContent: true,
					experienceLevel: true,
					industry: true,
					tools: true,
					weekStart: true,
					weekEnd: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			prisma.workEntry.count({ where }),
		]);

		return {
			data: entries,
			meta: { page, limit, total },
		};
	},

	async softDelete(id: string, deletedBy: string) {
		return prisma.workEntry.update({
			where: { id },
			data: {
				deletedAt: new Date(),
				// deletedBy,
			},
		});
	},
};
