import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors';
import { logger } from '../lib/logger';
import { scrubSensitiveData, scrubSensitiveString } from '../lib/scrub';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    const scrubbedMessage = scrubSensitiveString(err.message);
    const scrubbedDetails = err.details
      ? scrubSensitiveData(err.details)
      : undefined;
    const scrubbedStack = err.stack
      ? scrubSensitiveString(err.stack)
      : undefined;

    logger.warn(
      {
        code: err.code,
        statusCode: err.statusCode,
        method: req.method,
        path: req.path,
        details: scrubbedDetails,
        stack: scrubbedStack,
      },
      `[${err.code}] ${scrubbedMessage}`
    );

    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: scrubbedMessage,
        ...(scrubbedDetails ? { details: scrubbedDetails } : {}),
      },
    });
  }

 // Handle malformed JSON from Express body parser
if (
  err instanceof SyntaxError &&
  'status' in err &&
  err.status === 400 &&
  'type' in err &&
  err.type === 'entity.parse.failed'
) {
  logger.warn(
    {
      code: 'INVALID_JSON',
      statusCode: 400,
      method: req.method,
      path: req.path,
    },
    'Malformed JSON request body'
  );

  return res.status(400).json({
    success: false,
    error: {
      code: 'INVALID_JSON',
      message: 'Invalid JSON request body. Please check your JSON syntax.',
    },
  });
}

  if (err instanceof Error) {
    logger.error(
      {
        name: err.name,
        method: req.method,
        path: req.path,
        message: scrubSensitiveString(err.message),
        stack: err.stack ? scrubSensitiveString(err.stack) : undefined,
      },
      'Unhandled error'
    );
  } else {
    logger.error(
      {
        error: scrubSensitiveData(err),
        method: req.method,
        path: req.path,
      },
      'Unhandled non-Error thrown'
    );
  }

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}