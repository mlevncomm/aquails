import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';

export const bookSlotSchema = z.object({
  slotId: z.string().min(1),
  customerName: z.string().trim().min(2),
  customerPhone: z.string().trim().min(10),
  serviceType: z.string().trim().optional(),
  address: z.string().trim().optional(),
  orderId: z.string().optional(),
});

export const createSlotSchema = z.object({
  date: z.coerce.date(),
  time: z.string().trim().min(1),
  label: z.string().trim().min(1),
  available: z.boolean().default(true),
});

export const updateSlotSchema = createSlotSchema.partial().extend({
  status: z.enum(['AVAILABLE', 'BOOKED', 'COMPLETED']).optional(),
  customerName: z.string().nullable().optional(),
  customerPhone: z.string().nullable().optional(),
  serviceType: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

function serializeSlot(slot: {
  id: string;
  date: Date;
  time: string;
  label: string;
  available: boolean;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  serviceType: string | null;
  address: string | null;
  orderId: string | null;
}) {
  return {
    id: slot.id,
    date: slot.date.toISOString().slice(0, 10),
    time: slot.time,
    label: slot.label,
    available: slot.available,
    status: slot.status.toLowerCase(),
    customerName: slot.customerName,
    customerPhone: slot.customerPhone,
    serviceType: slot.serviceType,
    address: slot.address,
    orderId: slot.orderId,
  };
}

export async function listSlots(date?: string) {
  const where: { date?: Date; status?: 'AVAILABLE' } = { status: 'AVAILABLE' };
  if (date) {
    where.date = new Date(date);
  }

  const slots = await prisma.serviceSlot.findMany({
    where,
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });

  return slots.map(serializeSlot);
}

export async function bookSlot(input: z.infer<typeof bookSlotSchema>) {
  const updated = await prisma.serviceSlot.updateMany({
    where: { id: input.slotId, status: 'AVAILABLE' },
    data: {
      status: 'BOOKED',
      available: false,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      serviceType: input.serviceType,
      address: input.address,
      orderId: input.orderId,
    },
  });

  if (updated.count === 0) {
    throw new AppError('Slot not available', 400, 'SLOT_NOT_AVAILABLE');
  }

  const slot = await prisma.serviceSlot.findUnique({ where: { id: input.slotId } });
  if (!slot) {
    throw new AppError('Slot not available', 400, 'SLOT_NOT_AVAILABLE');
  }

  return serializeSlot(slot);
}

export async function bookSlotInTransaction(
  tx: Prisma.TransactionClient,
  slotId: string,
  data: {
    customerName: string;
    customerPhone: string;
    address?: string;
    orderId: string;
  },
) {
  const updated = await tx.serviceSlot.updateMany({
    where: { id: slotId, status: 'AVAILABLE' },
    data: {
      status: 'BOOKED',
      available: false,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      address: data.address,
      orderId: data.orderId,
    },
  });

  if (updated.count === 0) {
    throw new AppError('Slot not available', 400, 'SLOT_NOT_AVAILABLE');
  }
}

export async function adminListSlots() {
  const slots = await prisma.serviceSlot.findMany({
    orderBy: [{ date: 'desc' }, { time: 'asc' }],
  });
  return slots.map(serializeSlot);
}

export async function adminCreateSlot(input: z.infer<typeof createSlotSchema>) {
  const existing = await prisma.serviceSlot.findUnique({
    where: { date_time: { date: input.date, time: input.time } },
  });
  if (existing) {
    throw new AppError('Slot already exists', 409, 'SLOT_ALREADY_EXISTS');
  }

  const slot = await prisma.serviceSlot.create({
    data: {
      date: input.date,
      time: input.time,
      label: input.label,
      available: input.available,
      status: input.available ? 'AVAILABLE' : 'BOOKED',
    },
  });

  return serializeSlot(slot);
}

export async function adminUpdateSlot(id: string, input: z.infer<typeof updateSlotSchema>) {
  const slot = await prisma.serviceSlot.update({ where: { id }, data: input });
  return serializeSlot(slot);
}

export async function adminDeleteSlot(id: string) {
  await prisma.serviceSlot.delete({ where: { id } });
  return { deleted: true };
}
