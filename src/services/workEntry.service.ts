import { NotFoundError } from '../lib/errors';
import { getUserPermissions } from './rbac.service';
import { appEvents } from '../lib/events';
import { WORKENTRY_EVENTS } from '../events/workEntry.events';
import { queueEntryForProcessing } from '../queues/workEntry.queue';
import {
  workEntryRepository,
  type ListWorkEntriesOptions,
} from '../repositories/workEntry.repository';



export async function createEntry(data: {
  jobRole: string;
  jobContent: string;
  experienceLevel: string;
  industry: string;
  tools?: string[];
  weekStart: Date;
  weekEnd: Date;
  userId: string;
  correlationId?: string;
}) {

  const entry = await workEntryRepository.create({
    userId: data.userId,
    jobRole: data.jobRole,
    jobContent: data.jobContent,
    experienceLevel: data.experienceLevel,
    industry: data.industry,
    tools: data.tools || [],
    weekStart: data.weekStart,
    weekEnd: data.weekEnd,
  });

  const correlationId = data.correlationId ?? entry.id;
  const jobId = await queueEntryForProcessing(entry.id, data.userId, correlationId);

  appEvents.emit(WORKENTRY_EVENTS.CREATED, {
    userId: data.userId,
    entryId: entry.id,
    correlationId,
    jobId,
  });

  return {
    entry,
    jobId,
    message: 'Work entry created and queued for AI analysis',
  };
}

export async function getEntryForUser(entryId: string, userId: string) {
  const entry = await workEntryRepository.findById(entryId);
 
  if (!entry || entry.userId !== userId) {
    throw new NotFoundError('Work entry not found');
  }

  return entry;
}


export async function listEntries(
  userId: string,
  options: ListWorkEntriesOptions
) {
  return workEntryRepository.listForUser(userId, options);
}


export async function deleteEntry(
  entryId: string,
  userId: string
) {
  const entry = await workEntryRepository.findById(entryId);

  if (!entry || entry.deletedAt || entry.userId !== userId) {
    throw new NotFoundError('Work entry not found');
  }

  const deletedEntry = await workEntryRepository.softDelete(entryId, userId);
  appEvents.emit(WORKENTRY_EVENTS.DELETED, {
    deletedBy: userId,
    entryId: deletedEntry.id,
    jobRole: deletedEntry.jobRole,
  });

  // return deletedEntry;
   return {
    message: 'Work entry deleted successfully',
  };
}

// export async function getDocumentProcessingStatus(
//   documentId: string,
//   userId: string
// ) {
//   const doc = await documentRepository.findStatusById(documentId);

//   if (!doc || doc.deletedAt || doc.userId !== userId) {
//     throw new NotFoundError('Document not found');
//   }

//   const jobs = await documentQueue.getJobs(['active', 'waiting']);
//   const activeJob = jobs.find((job) => job.data.documentId === documentId);

//   return {
//     status: doc.status,
//     error: doc.error,
//     progress: activeJob ? await activeJob.progress : null,
//   };
// }
