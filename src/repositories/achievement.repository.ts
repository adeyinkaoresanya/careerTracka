import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface ListAchievementsOptions {
  page: number;
  limit: number;
  status?: 'draft' | 'approved' | 'rejected';
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export const achievementRepository = {
  async listForUser(userId: string, options: ListAchievementsOptions) {
    const {
      page,
      limit,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = options;

    const where: Prisma.AchievementWhereInput = {
      userId,
      deletedAt: null,
    };

    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.achievement.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          workEntry: {
            select: {
              id: true,
              jobRole: true,
            },
          },
          analysisSession: {
            select: {
              id: true,
              status: true,
              model: true,
            },
          },
        },
      }),
      prisma.achievement.count({ where }),
    ]);

    return {
      data: items,
      meta: { page, limit, total },
    };
  },

  async findByIdForUser(id: string, userId: string) {
    return prisma.achievement.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      include: {
        workEntry: {
          select: {
            id: true,
            jobRole: true,
          },
        },
        analysisSession: {
          select: {
            id: true,
            status: true,
            model: true,
          },
        },
      },
    });
  },

  async updateById(id: string, userId: string, data: {
    statement?: string;
    status?: 'draft' | 'approved' | 'rejected';
    skills?: string[];
  }) {
    return prisma.achievement.update({
      where: {
        id,
      },
      data: {
        ...(data.statement !== undefined && { statement: data.statement }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.skills !== undefined && { skills: data.skills }),
      },
      include: {
        workEntry: {
          select: {
            id: true,
            jobRole: true,
          },
        },
        analysisSession: {
          select: {
            id: true,
            status: true,
            model: true,
          },
        },
      },
    });
  },

  async softDelete(id: string, userId: string) {
    return prisma.achievement.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  },
};
