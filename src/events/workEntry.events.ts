import { appEvents } from '../lib/events';
import { usageLogRepository } from '../repositories/usageLog.repository';

export const WORKENTRY_EVENTS = {
  CREATED: 'entry:created',
  PROCESSED: 'entry:processed',
  DELETED: 'entry:deleted',
} as const;

appEvents.on(WORKENTRY_EVENTS.CREATED, async (data) => {
  try {
    await usageLogRepository.create({
      userId: data.userId,
      action: 'entry_created',
      tokens: 0,
      costUsd: 0,
      metadata: JSON.stringify({
        entryId: data.entryId,
        title: data.jobContent,
        createdAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log entry creation:', error);
  }
});

appEvents.on(WORKENTRY_EVENTS.DELETED, async (data) => {
  try {
    await usageLogRepository.create({
      userId: data.deletedBy,
      action: 'entry_deleted',
      tokens: 0,
      costUsd: 0,
      metadata: JSON.stringify({
        entryId: data.entryId,
        title: data.jobContent,
        deletedAt: new Date().toISOString(),
      }),
    });
  } catch (error) {
    console.error('Failed to log entry deletion:', error);
  }
});
