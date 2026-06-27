import type { UserRole } from '@prisma/client';

export type PublicRole = 'customer' | 'admin';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: PublicRole;
}

export interface AuthResponse {
  user: PublicUser;
  token: string;
}

export interface MeResponse {
  user: PublicUser;
}

export function toPublicRole(role: UserRole): PublicRole {
  return role === 'ADMIN' ? 'admin' : 'customer';
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: toPublicRole(user.role),
  };
}
