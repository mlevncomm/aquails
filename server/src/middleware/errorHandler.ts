import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../lib/apiResponse.js';
import { AppError } from '../lib/AppError.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    const details =
      env.NODE_ENV === 'production' ? undefined : err.details;

    return sendError(res, err.message, err.code, err.statusCode, details);
  }

  if (err instanceof ZodError) {
    const details =
      env.NODE_ENV === 'production'
        ? undefined
        : err.flatten().fieldErrors;

    return sendError(
      res,
      'Validation failed',
      'VALIDATION_ERROR',
      400,
      details,
    );
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }

  return sendError(
    res,
    env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err instanceof Error
        ? err.message
        : 'An unexpected error occurred',
    'INTERNAL_ERROR',
    500,
  );
}
