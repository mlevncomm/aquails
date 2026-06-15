import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { AppError } from '../lib/AppError.js';
import { getUserById } from '../modules/auth/auth.service.js';

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
