import { appEvents } from '../lib/events';
import { usageLogRepository } from '../repositories/usageLog.repository';

export const ANALYSIS_EVENTS = {
  COMPLETED: 'analysis:completed',
} as const;

appEvents.on(ANALYSIS_EVENTS.COMPLETED, async (data: any) => {
  try {
    const userId = data?.userId;

    if (!userId) {
      return;
    }

    const tokens = Number(data?.tokens ?? 0);
    const costUsd = Number(data?.costUsd ?? 0);

    await usageLogRepository.create({
      userId: String(userId),
      action: 'analysis_completed',
      tokens: Number.isFinite(tokens) ? tokens : 0,
      costUsd: Number.isFinite(costUsd) ? costUsd : 0,
      metadata: JSON.stringify({
        analysisSessionId: data?.analysisSessionId ?? null,
        workEntryId: data?.workEntryId ?? null,
        provider: data?.provider ?? null,
        model: data?.model ?? null,
        completedAt: new Date().toISOString(),
        ...(data?.metadata ?? {}),
      }),
    });
  } catch (error) {
    console.error('Failed to log analysis usage:', error);
  }
});
