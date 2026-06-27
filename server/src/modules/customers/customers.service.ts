import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { toPublicUser } from '../auth/auth.types.js';

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  phone: z.string().trim().max(20).nullable().optional(),
});

export const createAddressSchema = z.object({
  title: z.string().trim().min(1).max(100),
  city: z.string().trim().min(1).max(100),
  district: z.string().trim().max(100).optional(),
  fullAddress: z.string().trim().min(5),
  postalCode: z.string().trim().max(20).optional(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

function serializeAddress(address: {
  id: string;
  title: string;
  city: string;
  district: string | null;
  fullAddress: string;
  postalCode: string | null;
  isDefault: boolean;
}) {
  return {
    id: address.id,
    title: address.title,
    city: address.city,
    district: address.district ?? '',
    fullAddress: address.fullAddress,
    postalCode: address.postalCode ?? '',
    isDefault: address.isDefault,
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('Kullanıcı bulunamadı', 404, 'USER_NOT_FOUND');
  }
  return { user: toPublicUser(user) };
}

export async function updateProfile(userId: string, input: z.infer<typeof updateProfileSchema>) {
  const user = await prisma.user.update({ where: { id: userId }, data: input });
  return { user: toPublicUser(user) };
}

export async function listAddresses(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return addresses.map(serializeAddress);
}

export async function createAddress(userId: string, input: z.infer<typeof createAddressSchema>) {
  if (input.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { ...input, userId },
  });

  return serializeAddress(address);
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: z.infer<typeof updateAddressSchema>,
) {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new AppError('Adres bulunamadı', 404, 'ADDRESS_NOT_FOUND');
  }

  if (input.isDefault) {
    await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.update({ where: { id: addressId }, data: input });
  return serializeAddress(address);
}

export async function deleteAddress(userId: string, addressId: string) {
  const existing = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!existing) {
    throw new AppError('Adres bulunamadı', 404, 'ADDRESS_NOT_FOUND');
  }

  await prisma.address.delete({ where: { id: addressId } });
  return { deleted: true };
}
