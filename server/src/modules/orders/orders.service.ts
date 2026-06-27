import type { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { decimalToNumber, serializeProduct, type ProductWithCategory } from '../../lib/serialize.js';
import { assertCouponValid, incrementCouponUsage } from '../coupons/coupons.service.js';
import { bookSlotInTransaction } from '../serviceSlots/serviceSlots.service.js';
import { clearSessionCart, clearUserCart } from '../cart/cart.service.js';

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerEmail: z.string().trim().email(),
  customerPhone: z.string().trim().min(10).max(20),
  paymentMethod: z.enum(['card', 'transfer', 'cod']),
  shippingAddress: z.object({
    title: z.string().trim().min(1),
    city: z.string().trim().min(1),
    district: z.string().trim().optional(),
    fullAddress: z.string().trim().min(5),
    postalCode: z.string().trim().optional(),
  }),
  note: z.string().trim().max(500).optional(),
  couponCode: z.string().trim().optional(),
  serviceSlotId: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .optional(),
  useCart: z.boolean().default(true),
  sessionId: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
});

const SHIPPING_COST = 0;

function mapOrderStatus(status: OrderStatus): string {
  return status.toLowerCase();
}

function mapPaymentStatus(status: PaymentStatus): string {
  return status.toLowerCase();
}

async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `AQ-${year}-${suffix}`;
    const existing = await prisma.order.findUnique({ where: { orderNumber } });
    if (!existing) return orderNumber;
  }
  throw new AppError('Sipariş numarası oluşturulamadı', 500, 'INTERNAL_ERROR');
}

function serializeOrderItem(item: {
  id: string;
  productId: string;
  productName: string;
  unitPrice: Prisma.Decimal;
  quantity: number;
  total: Prisma.Decimal;
  product?: ProductWithCategory | null;
}) {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    unitPrice: decimalToNumber(item.unitPrice) ?? 0,
    quantity: item.quantity,
    total: decimalToNumber(item.total) ?? 0,
    product: item.product ? serializeProduct(item.product) : undefined,
  };
}

function serializeOrder(order: {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  subtotal: Prisma.Decimal;
  shippingCost: Prisma.Decimal;
  discount: Prisma.Decimal;
  total: Prisma.Decimal;
  shippingAddress: unknown;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unitPrice: Prisma.Decimal;
    quantity: number;
    total: Prisma.Decimal;
    product?: ProductWithCategory | null;
  }>;
}) {
  const shippingAddress =
    order.shippingAddress && typeof order.shippingAddress === 'object'
      ? (order.shippingAddress as Record<string, string>)
      : {};

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    customer: {
      id: order.userId ?? order.id,
      name: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone,
    },
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    status: mapOrderStatus(order.status),
    paymentMethod: order.paymentMethod,
    paymentStatus: mapPaymentStatus(order.paymentStatus),
    subtotal: decimalToNumber(order.subtotal) ?? 0,
    shippingCost: decimalToNumber(order.shippingCost) ?? 0,
    discount: decimalToNumber(order.discount) ?? 0,
    total: decimalToNumber(order.total) ?? 0,
    shippingAddress,
    note: order.note,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    items: order.items.map(serializeOrderItem),
  };
}

const orderInclude = {
  items: {
    include: {
      product: { include: { category: { select: { id: true, slug: true, name: true } } } },
    },
  },
} as const;

async function resolveOrderItems(
  userId: string | undefined,
  sessionId: string | undefined,
  inputItems: z.infer<typeof createOrderSchema>['items'],
  useCart: boolean,
) {
  if (useCart) {
    if (!userId && !sessionId?.trim()) {
      throw new AppError('Sepet oturumu gerekli', 400, 'CART_SESSION_REQUIRED');
    }

    const cartItems = await prisma.cartItem.findMany({
      where: userId ? { userId } : { sessionId: sessionId!.trim() },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new AppError('Sepet boş', 400, 'CART_EMPTY');
    }

    return cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      product: item.product,
    }));
  }

  if (!inputItems?.length) {
    throw new AppError('Sipariş kalemleri gerekli', 400, 'VALIDATION_ERROR');
  }

  const products = await Promise.all(
    inputItems.map(async (item) => {
      const product = await prisma.product.findFirst({
        where: { id: item.productId, isActive: true },
      });
      if (!product) {
        throw new AppError(`Ürün bulunamadı: ${item.productId}`, 404, 'PRODUCT_NOT_FOUND');
      }
      return { productId: item.productId, quantity: item.quantity, product };
    }),
  );

  return products;
}

export async function createOrder(
  input: z.infer<typeof createOrderSchema>,
  userId?: string,
) {
  const lineItems = await resolveOrderItems(
    userId,
    input.sessionId,
    input.items,
    input.useCart,
  );

  for (const item of lineItems) {
    if (item.product.stock < item.quantity) {
      throw new AppError(`Yetersiz stok: ${item.product.name}`, 400, 'INSUFFICIENT_STOCK');
    }
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  let discount = 0;
  let couponCodeForUsage: string | undefined;
  if (input.couponCode) {
    const couponResult = await assertCouponValid(
      input.couponCode,
      subtotal,
      SHIPPING_COST,
    );
    discount = couponResult.discount;
    couponCodeForUsage = couponResult.coupon.code;
  }

  const total = Math.max(subtotal + SHIPPING_COST - discount, 0);
  const orderNumber = await generateOrderNumber();

  let paymentStatus: PaymentStatus = 'PENDING';
  if (input.paymentMethod === 'card' && process.env.AUTO_PAY_CARD === 'true') {
    paymentStatus = 'PAID';
  }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of lineItems) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count === 0) {
        throw new AppError(`Yetersiz stok: ${item.product.name}`, 400, 'INSUFFICIENT_STOCK');
      }
    }

    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: userId ?? null,
        customerName: input.customerName,
        customerEmail: input.customerEmail.toLowerCase(),
        customerPhone: input.customerPhone,
        status: 'PENDING',
        paymentMethod: input.paymentMethod,
        paymentStatus,
        subtotal,
        shippingCost: SHIPPING_COST,
        discount,
        total,
        shippingAddress: input.shippingAddress,
        note: input.note,
        items: {
          create: lineItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            unitPrice: item.product.price,
            quantity: item.quantity,
            total: Number(item.product.price) * item.quantity,
          })),
        },
      },
      include: orderInclude,
    });

    if (couponCodeForUsage) {
      await incrementCouponUsage(couponCodeForUsage, tx);
    }

    if (input.serviceSlotId) {
      await bookSlotInTransaction(tx, input.serviceSlotId, {
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        address: input.shippingAddress.fullAddress,
        orderId: created.id,
      });
    }

    return created;
  });

  if (userId) {
    await clearUserCart(userId);
  } else if (input.sessionId) {
    await clearSessionCart(input.sessionId);
  }

  return serializeOrder(order as Parameters<typeof serializeOrder>[0]);
}

export async function listUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });
  return orders.map((o) => serializeOrder(o as Parameters<typeof serializeOrder>[0]));
}

export async function getOrderById(id: string, userId?: string, isAdmin = false) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    throw new AppError('Sipariş bulunamadı', 404, 'ORDER_NOT_FOUND');
  }

  if (!isAdmin && userId && order.userId !== userId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }

  if (!isAdmin && !userId) {
    throw new AppError('Kimlik doğrulama gerekli', 401, 'UNAUTHORIZED');
  }

  return serializeOrder(order as Parameters<typeof serializeOrder>[0]);
}

export async function cancelOrder(id: string, userId?: string, isAdmin = false) {
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) {
    throw new AppError('Sipariş bulunamadı', 404, 'ORDER_NOT_FOUND');
  }

  if (!isAdmin && order.userId !== userId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }

  if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
    throw new AppError('Sipariş iptal edilemez', 400, 'ORDER_NOT_CANCELLABLE');
  }

  const updated = await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: orderInclude,
    });
  });

  return serializeOrder(updated as Parameters<typeof serializeOrder>[0]);
}

export async function listAdminOrders(query: {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const where: Prisma.OrderWhereInput = {};
  if (query.status) where.status = query.status;

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return {
    items: orders.map((o) => serializeOrder(o as Parameters<typeof serializeOrder>[0])),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
  return serializeOrder(order as Parameters<typeof serializeOrder>[0]);
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { paymentStatus },
    include: orderInclude,
  });
  return serializeOrder(order as Parameters<typeof serializeOrder>[0]);
}
