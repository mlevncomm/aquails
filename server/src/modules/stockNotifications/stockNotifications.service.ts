import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';

export const createStockNotificationSchema = z.object({
  productId: z.string().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().max(20).optional(),
});

function serializeNotification(notification: {
  id: string;
  productId: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: Date;
  notifiedAt: Date | null;
  product?: { id: string; name: string; slug: string; stock: number };
}) {
  return {
    id: notification.id,
    productId: notification.productId,
    email: notification.email,
    phone: notification.phone,
    status: notification.status.toLowerCase(),
    createdAt: notification.createdAt.toISOString(),
    notifiedAt: notification.notifiedAt?.toISOString() ?? null,
    product: notification.product,
  };
}

export async function createStockNotification(input: z.infer<typeof createStockNotificationSchema>) {
  const product = await prisma.product.findUnique({ where: { id: input.productId } });
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }

  const existing = await prisma.stockNotification.findFirst({
    where: {
      productId: input.productId,
      email: input.email.toLowerCase(),
      status: 'PENDING',
    },
  });

  if (existing) {
    throw new AppError('Notification already requested', 409, 'NOTIFICATION_ALREADY_EXISTS');
  }

  const notification = await prisma.stockNotification.create({
    data: {
      productId: input.productId,
      email: input.email.toLowerCase(),
      phone: input.phone,
    },
    include: { product: { select: { id: true, name: true, slug: true, stock: true } } },
  });

  return serializeNotification(notification);
}

export async function adminListStockNotifications() {
  const notifications = await prisma.stockNotification.findMany({
    include: { product: { select: { id: true, name: true, slug: true, stock: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return notifications.map(serializeNotification);
}

export async function markStockNotificationNotified(id: string) {
  const notification = await prisma.stockNotification.update({
    where: { id },
    data: { status: 'NOTIFIED', notifiedAt: new Date() },
    include: { product: { select: { id: true, name: true, slug: true, stock: true } } },
  });
  return serializeNotification(notification);
}
