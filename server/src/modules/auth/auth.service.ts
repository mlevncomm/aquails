import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { hashPassword, comparePasswordSafe } from '../../lib/password.js';
import { signToken } from '../../lib/jwt.js';
import type { RegisterInput, LoginInput } from './auth.validation.js';
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
    throw new AppError('User not found', 401, 'UNAUTHORIZED');
  }

  return toPublicUser(user);
}

export async function getMe(userId: string): Promise<MeResponse> {
  const user = await getUserById(userId);
  return { user };
}
