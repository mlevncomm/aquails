import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { hashPassword, comparePasswordSafe } from '../../lib/password.js';
import { signToken } from '../../lib/jwt.js';
import { env } from '../../config/env.js';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from './auth.validation.js';
import {
  toPublicUser,
  type AuthResponse,
  type MeResponse,
  type PublicUser,
} from './auth.types.js';

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError(
      'Bu e-posta adresi zaten kayıtlı.',
      409,
      'EMAIL_ALREADY_EXISTS',
    );
  }

  const passwordHash = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      passwordHash,
      role: 'CUSTOMER',
    },
  });

  const publicUser = toPublicUser(user);
  const token = signToken({
    sub: user.id,
    email: user.email,
    role: publicUser.role,
  });

  return { user: publicUser, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  const isValid = await comparePasswordSafe(
    input.password,
    user?.passwordHash ?? null,
  );

  if (!user || !isValid) {
    throw new AppError(
      'E-posta veya şifre hatalı.',
      401,
      'INVALID_CREDENTIALS',
    );
  }

  const publicUser = toPublicUser(user);
  const token = signToken({
    sub: user.id,
    email: user.email,
    role: publicUser.role,
  });

  return { user: publicUser, token };
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('Kullanıcı bulunamadı', 401, 'UNAUTHORIZED');
  }

  return toPublicUser(user);
}

export async function getMe(userId: string): Promise<MeResponse> {
  const user = await getUserById(userId);
  return { user };
}

export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (user) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 12);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    if (env.NODE_ENV === 'development') {
      return {
        message: 'E-posta kayıtlıysa sıfırlama talimatları gönderildi.',
        devResetToken: rawToken,
      };
    }
  }

  return {
    message: 'E-posta kayıtlıysa sıfırlama talimatları gönderildi.',
  };
}

export async function resetPassword(input: ResetPasswordInput) {
  const tokens = await prisma.passwordResetToken.findMany({
    where: { expiresAt: { gt: new Date() } },
    include: { user: true },
  });

  let matchedToken: (typeof tokens)[number] | undefined;
  for (const token of tokens) {
    const isMatch = await bcrypt.compare(input.token, token.tokenHash);
    if (isMatch) {
      matchedToken = token;
      break;
    }
  }

  if (!matchedToken) {
    throw new AppError('Geçersiz veya süresi dolmuş sıfırlama bağlantısı', 400, 'INVALID_RESET_TOKEN');
  }

  const passwordHash = await hashPassword(input.password);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: matchedToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { userId: matchedToken.userId } }),
  ]);

  return { message: 'Şifre başarıyla güncellendi' };
}
