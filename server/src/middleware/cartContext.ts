import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';
import { getUserById } from '../modules/auth/auth.service.js';

export async function optionalAuthenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      next();
      return;
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.sub);
    req.user = user;
    next();
  } catch {
    next();
  }
}

export function getCartSessionId(req: Request): string | undefined {
  const header = req.headers['x-cart-session-id'];
  if (typeof header === 'string' && header.trim()) {
    return header.trim();
  }
  return undefined;
}
