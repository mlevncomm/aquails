import type { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation.js';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../lib/apiResponse.js';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.registerUser(input);
    sendSuccess(res, result, 201);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.loginUser(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await authService.getMe(req.user!.id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export function logout(_req: Request, res: Response): void {
  sendSuccess(res, { message: 'Başarıyla çıkış yapıldı' });
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = forgotPasswordSchema.parse(req.body);
    const result = await authService.forgotPassword(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = resetPasswordSchema.parse(req.body);
    const result = await authService.resetPassword(input);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}
