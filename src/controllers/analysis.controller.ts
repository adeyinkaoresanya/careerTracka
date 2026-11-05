import type { Request, Response, NextFunction } from 'express';
import { analysisService } from '../services/analysis.service';   

export async function analyseEntry(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
     const params = (res.locals.validatedParams ?? req.params) as {
      id: string;
    };
    // still work on this
    const result = await analysisService.analyseEntry(
      params.id,
      req.user!.id
    );

    const analysisResult = (result.session.analysisResult ?? {}) as Record<string, unknown>;

    res.status(201).json({
      success: true,
      message: 'Entry analysed successfully',
      data: {
        workEntryId: result.session.workEntryId,
        analysisSessionId: result.session.id,
        status: result.session.status,
        model: result.session.model,
        createdAt: result.session.createdAt,
        completedAt: result.session.completedAt,
        analysis: {
          ...analysisResult,
          provider: analysisResult.provider ?? 'ollama',
          usage: analysisResult.usage ?? null,
        },
        achievement: {
          id: result.achievement.id,
          statement: result.achievement.statement,
          status: result.achievement.status,
          skills: result.achievement.skills,
          createdAt: result.achievement.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}