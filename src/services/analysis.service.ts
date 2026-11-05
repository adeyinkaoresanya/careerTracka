import { aiService } from '../lib/ai';
import { NotFoundError } from '../lib/errors';
import { analysisRepository } from '../repositories/analysis.repository';

export const analysisService = {
  async listAnalysesForEntry(entryId: string, userId: string) {
    const entry = await analysisRepository.findWorkEntry(entryId, userId);

    if (!entry) {
      throw new NotFoundError('Work entry not found');
    }

    const sessions = await analysisRepository.listSessionsForWorkEntry(entry.id, userId);

    return sessions;
  },

  async analyseEntry(entryId: string, userId: string) {
    const entry = await analysisRepository.findWorkEntry(entryId, userId);

    if (!entry) {
      throw new NotFoundError('Work entry not found');
    }

    const session = await analysisRepository.createSession(entry.id);

    try {
      const analysis = await aiService.analyzeWorkEntry({
        jobRole: entry.jobRole,
        jobContent: entry.jobContent,
        tools: entry.tools,
      });

      const achievement = await analysisRepository.createAchievement({
        userId,
        workEntryId: entry.id,
        analysisSessionId: session.id,
        statement: analysis.statement,
        skills: [],
      });

      const sessionPayload = {
        summary: analysis.summary,
        actions: analysis.actions,
        skills: analysis.skills,
        tools: analysis.tools,
        impact: analysis.impact,
        cvStatement: analysis.cvStatement,
        provider: analysis.provider,
        usage: analysis.usage,
      };

      const completedSession = await analysisRepository.completeSession(
        session.id,
        sessionPayload,
        analysis.model
      );

      return {
        session: completedSession,
        achievement,
      };

    } catch (error) {
      await analysisRepository.failSession(
        session.id,
        error instanceof Error ? error.message : 'Analysis failed'
      );

      throw error;
    }
  },
};