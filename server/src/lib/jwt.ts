import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: 'customer' | 'admin';
}

function getJwtSecret(): string {
  if (!env.JWT_SECRET) {
    throw new AppError(
      'Kimlik doğrulama yapılandırılmamış',
      503,
      'AUTH_NOT_CONFIGURED',
    );
  }

  return env.JWT_SECRET;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.email !== 'string' ||
      (decoded.role !== 'customer' && decoded.role !== 'admin')
    ) {
      throw new AppError('Geçersiz token', 401, 'UNAUTHORIZED');
    }

    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError('Geçersiz token', 401, 'UNAUTHORIZED');
  }
}
