// // src/middleware/metricsMiddleware.ts
// import type { Request, Response, NextFunction } from 'express';
// import { httpRequestsTotal, httpRequestDuration } from '../lib/metrics';

// export function metricsMiddleware(
//   req: Request, res: Response, next: NextFunction
// ) {
//   const end = httpRequestDuration.startTimer({
//     method: req.method,
//     path: normalizePath(req.route?.path || req.path),
//   });

//   res.on('finish', () => {
//     httpRequestsTotal.inc({
//       method: req.method,
//       path: normalizePath(req.route?.path || req.path),
//       status_code: res.statusCode.toString(),
//     });
//     end();
//   });

//   next();
// }

// // Normalize paths so /documents/abc-123 becomes /documents/:id
// // Without this, each unique document ID creates a separate metric series
// function normalizePath(path: string): string {
//   return path
//     .replace(
//       /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g,
//       ':id'
//     )
//     .replace(/\/\d+/g, '/:num');
// }




import type { Request, Response, NextFunction } from 'express';
import {
  httpRequestsTotal,
  httpRequestDuration,
} from '../lib/metrics';

export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const path = getMetricPath(req);

  const end = httpRequestDuration.startTimer({
    method: req.method,
    path,
  });

  res.on('finish', () => {
    httpRequestsTotal.inc({
      method: req.method,
      path,
      status_code: String(res.statusCode),
    });

    end();
  });

  next();
}

function getMetricPath(req: Request): string {
  const routePath = req.route?.path;

  // Prefer Express's matched route template.
  // Route paths can be strings or arrays.
  if (typeof routePath === 'string') {
    return normalizePath(`${req.baseUrl}${routePath}`);
  }

  // Fallback for mounted routers and unmatched routes.
  return normalizePath(`${req.baseUrl}${req.path}`);
}

// Normalize dynamic IDs to avoid creating a metric series per document.
function normalizePath(path: string): string {
  return path
    .replace(
      /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      ':id',
    )
    .replace(/\/\d+/g, '/:num');
}
