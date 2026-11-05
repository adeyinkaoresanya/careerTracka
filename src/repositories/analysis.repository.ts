import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';


export const analysisRepository = {
  async findWorkEntry(id: string, userId: string) {
    return prisma.workEntry.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });
  },

  async createSession(workEntryId: string) {
    return prisma.analysisSession.create({
      data: {
        workEntryId,
        status: 'processing',
      },
    });
  },

  async completeSession(
    sessionId: string,
    analysisResult: object,
    model: string
  ) {
    return prisma.analysisSession.update({
      where: { id: sessionId },
      data: {
        status: 'completed',
        analysisResult,
        model,
        completedAt: new Date(),
      },
    });
  },

  async failSession(sessionId: string, error: string) {
    return prisma.analysisSession.update({
      where: { id: sessionId },
      data: {
        status: 'failed',
        errorMessage: error,
      },
    });
  },

  async createAchievement(data: {
    userId: string;
    workEntryId: string;
    analysisSessionId: string;
    statement: string;
    skills: string[];
  }) {
    return prisma.achievement.create({
      data,
    });
  },
};