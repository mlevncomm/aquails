import type { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { sendError } from '../lib/apiResponse.js';

function createRateLimitHandler(message: string) {
  return (_req: Request, res: Response): void => {
    sendError(res, message, 'RATE_LIMIT_EXCEEDED', 429);
  };
}

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'Too many login attempts. Please try again later.',
  ),
});

export const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    'Too many registration attempts. Please try again later.',
  ),
});
