import { NotFoundError } from '../lib/errors';
import { achievementRepository, type ListAchievementsOptions } from '../repositories/achievement.repository';

export const achievementService = {
  async listAchievements(userId: string, options: ListAchievementsOptions) {
    return achievementRepository.listForUser(userId, options);
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
