import { NotFoundError } from '../lib/errors';
import { achievementRepository, type ListAchievementsOptions } from '../repositories/achievement.repository';

export const achievementService = {
  // async listAchievements(userId: string, options: ListAchievementsOptions) {
  //   return achievementRepository.listForUser(userId, options);
  // },


  async listAchievements(userId: string, options: ListAchievementsOptions) {
  const result = await achievementRepository.listGroupedForUser(
    userId,
    options
  );

  const groups = new Map(
    result.jobRoles.map(role => [role, [] as typeof result.items])
  );

  for (const achievement of result.items) {
    const role = achievement.workEntry.jobRole;
    groups.get(role)?.push(achievement);
  }

  const data = result.jobRoles.map(jobRole => ({
    jobRole,
    achievements: groups.get(jobRole) ?? [],
  }));

  return {
    data,
    meta: {
      page: options.page,
      limit: options.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / options.limit),
    },
  };
},

  async getAchievementForUser(id: string, userId: string) {
    const achievement = await achievementRepository.findByIdForUser(id, userId);

    if (!achievement) {
      throw new NotFoundError('Achievement not found');
    }

    return achievement;
  },

  async updateAchievement(
    id: string,
    userId: string,
    data: {
      statement?: string;
      status?: 'draft' | 'approved' | 'rejected';
      skills?: string[];
    }
  ) {
    const existing = await achievementRepository.findByIdForUser(id, userId);

    if (!existing) {
      throw new NotFoundError('Achievement not found');
    }

    return achievementRepository.updateById(id, userId, data);
  },

  async archiveAchievement(id: string, userId: string) {
    const existing = await achievementRepository.findByIdForUser(id, userId);

    if (!existing) {
      throw new NotFoundError('Achievement not found');
    }

    const achievement = await achievementRepository.softDelete(id, userId);

    return {
      ...achievement,
      archived: true,
      message: 'Achievement archived successfully',
    };
  },
};
