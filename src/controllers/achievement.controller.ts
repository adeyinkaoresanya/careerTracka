import type { Request, Response, NextFunction } from 'express';
import { achievementService } from '../services/achievement.service';

export async function listAchievements(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = (res.locals.validatedQuery ?? req.query) as {
      page?: number;
      limit?: number;
      status?: 'draft' | 'approved' | 'rejected';
      sortBy?: 'createdAt' | 'updatedAt' | 'status';
      sortOrder?: 'asc' | 'desc';
    };

    const result = await achievementService.listAchievements(req.user!.id, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      ...(query.status ? { status: query.status } : {}),
      ...(query.sortBy ? { sortBy: query.sortBy } : {}),
      ...(query.sortOrder ? { sortOrder: query.sortOrder } : {}),
    });

    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAchievement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = (res.locals.validatedParams ?? req.params) as { id: string };
    const achievement = await achievementService.getAchievementForUser(
      params.id,
      req.user!.id
    );

    res.json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
}

export async function updateAchievement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = (res.locals.validatedParams ?? req.params) as { id: string };
    const payload = (req.body ?? {}) as {
      statement?: string;
      status?: 'draft' | 'approved' | 'rejected';
      skills?: string[];
    };

    const achievement = await achievementService.updateAchievement(
      params.id,
      req.user!.id,
      payload
    );

    res.json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
}

export async function archiveAchievement(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const params = (res.locals.validatedParams ?? req.params) as { id: string };
    const achievement = await achievementService.archiveAchievement(
      params.id,
      req.user!.id
    );

    res.json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
}
