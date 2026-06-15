import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/AppError.js';

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user || req.user.role !== 'admin') {
    next(new AppError('Admin access required', 403, 'FORBIDDEN'));
    return;
  }

  next();
}
