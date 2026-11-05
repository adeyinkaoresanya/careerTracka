import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger';
import * as workEntryService from '../services/workEntry.service';


export async function createEntry(req: Request, res: Response, next: NextFunction) {
    try {
    logger.info({
            correlationId: req.body.correlationId,
            userId: req.user!.id,
            title: req.body.title,
    }, 'Creating work entry');
        
        const result = await workEntryService.createEntry({
            ...req.body,
            userId: req.user!.id,
            correlationId: (req as any).correlationId,
        });

        res.status(202).json({ success: true, data: result});
    } catch (error) {
       next(error)
    }
}


export async function getEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const params = (res.locals.validatedParams ?? req.params) as { id: string };
    const entry = await workEntryService.getEntryForUser(params.id, req.user!.id);
    res.json({ success: true, data: entry});
  } catch (error) {
    next(error);
  }
}

export async function listEntries(req: Request, res: Response, next: NextFunction) {
  try {
    const query = (res.locals.validatedQuery ?? req.query) as {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      sortBy?: 'createdAt' | 'jobRole';
      sortOrder?: 'asc' | 'desc';
    };

    const options: {
      page: number;
      limit: number;
      status?: string;
      search?: string;
      sortBy?: 'createdAt' | 'jobRole';
      sortOrder?: 'asc' | 'desc';
    } = {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    };

    if (query.status) options.status = query.status;
    if (query.search) options.search = query.search;
    if (query.sortBy) options.sortBy = query.sortBy;
    if (query.sortOrder) options.sortOrder = query.sortOrder;

    const result = await workEntryService.listEntries(req.user!.id, options);

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function deleteEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const params = (res.locals.validatedParams ?? req.params) as { id: string };
    const entry = await workEntryService.deleteEntry(params.id, req.user!.id);
    res.json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
}

// export async function getDocumentProcessingStatus(req: Request, res: Response, next: NextFunction) {
//   try {
//     const params = (res.locals.validatedParams ?? req.params) as { id: string };
//     const status = await documentService.getDocumentProcessingStatus(params.id, req.user!.id);
//     res.json({ success: true, data: status });
//   } catch (error) {
//     next(error);
//   }
// }
