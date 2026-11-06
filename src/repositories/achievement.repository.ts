import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface ListAchievementsOptions {
  page: number;
  limit: number;
  status?: 'draft' | 'approved' | 'rejected';
//   sortBy?: 'createdAt' | 'updatedAt' | 'status' | 'jobRole';
//   sortOrder?: 'asc' | 'desc';
}


export const achievementRepository = {
  // async listForUser(userId: string, options: ListAchievementsOptions) {
  //   const {
  //     page,
  //     limit,
  //     status,
  //     sortBy = 'createdAt',
  //     sortOrder = 'desc',
  //   } = options;

  //   const where: Prisma.AchievementWhereInput = {
  //     userId,
  //     deletedAt: null,
  //   };

  //   if (status) {
  //     where.status = status;
  //   }

  //   const orderBy: Prisma.AchievementOrderByWithRelationInput =
  // sortBy === 'jobRole'
  //   ? { workEntry: { jobRole: sortOrder } }
  //   : { [sortBy]: sortOrder };

  //   const [items, total] = await Promise.all([
  //     prisma.achievement.findMany({
  //       where,
  //       orderBy,
  //       skip: (page - 1) * limit,
  //       take: limit,
  //       include: {
  //         workEntry: {
  //           select: {
  //             id: true,
  //             jobRole: true,
  //           },
  //         },
  //         analysisSession: {
  //           select: {
  //             id: true,
  //             status: true,
  //             model: true,
  //           },
  //         },
  //       },
  //     }),
  //     prisma.achievement.count({ where }),
  //   ]);

  //   return {
  //     data: items,
  //     meta: { page, limit, total },
  //   };
  // },

async listGroupedForUser(userId: string, options: ListAchievementsOptions) {
  const { page, limit, status } = options;
  const offset = (page - 1) * limit;

  // Optional status filter
  const statusFilter = status
    ? Prisma.sql`AND a."status" = ${status}`
    : Prisma.empty;

  // Get the paginated job roles
  const [roleRows, countRows] = await Promise.all([
    prisma.$queryRaw<{ jobRole: string }[]>(Prisma.sql`
      SELECT w."jobRole" AS "jobRole"
      FROM "WorkEntry" w
      INNER JOIN "Achievement" a
        ON a."workEntryId" = w."id"
      WHERE a."userId" = ${userId}
        AND a."deletedAt" IS NULL
        AND w."deletedAt" IS NULL
        ${statusFilter}
      GROUP BY w."jobRole"
      ORDER BY w."jobRole" ASC
      LIMIT ${limit}
      OFFSET ${offset}
    `),

    prisma.$queryRaw<{ total: bigint }[]>(Prisma.sql`
      SELECT COUNT(DISTINCT w."jobRole") AS total
      FROM "WorkEntry" w
      INNER JOIN "Achievement" a
        ON a."workEntryId" = w."id"
      WHERE a."userId" = ${userId}
        AND a."deletedAt" IS NULL
        AND w."deletedAt" IS NULL
        ${statusFilter}
    `),
  ]);

  const jobRoles = roleRows.map(row => row.jobRole);
  const total = Number(countRows[0]?.total ?? 0);

  if (jobRoles.length === 0) {
    return { jobRoles, items: [], total };
  }

  // Fetch all achievements belonging to the selected job roles
  const items = await prisma.achievement.findMany({
    where: {
      userId,
      deletedAt: null,
      ...(status && { status }),
      workEntry: {
        is: {
          userId,
          deletedAt: null,
          jobRole: { in: jobRoles },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
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

  return { jobRoles, items, total };
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
