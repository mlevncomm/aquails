import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../lib/AppError.js';
import { serializeProduct, type ProductWithCategory } from '../../lib/serialize.js';

export interface CartItemDto {
  id: string;
  productId: string;
  quantity: number;
  product: ReturnType<typeof serializeProduct>;
}

export interface CartResponse {
  items: CartItemDto[];
  subtotal: number;
  itemCount: number;
}

function getCartOwner(userId?: string, sessionId?: string) {
  if (userId) return { userId, sessionId: undefined as string | undefined };
  if (sessionId) return { userId: undefined as string | undefined, sessionId };
  throw new AppError('Sepet oturumu gerekli', 400, 'CART_SESSION_REQUIRED');
}

async function loadCartItems(userId?: string, sessionId?: string) {
  const where = userId ? { userId } : { sessionId };
  return prisma.cartItem.findMany({
    where,
    include: {
      product: { include: { category: { select: { id: true, slug: true, name: true } } } },
    },
    orderBy: { createdAt: 'asc' },
  });
}

function buildCartResponse(
  items: Awaited<ReturnType<typeof loadCartItems>>,
): CartResponse {
  const mapped = items
    .filter((item) => item.product.isActive)
    .map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      product: serializeProduct(item.product as ProductWithCategory),
    }));

  const subtotal = mapped.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = mapped.reduce((sum, item) => sum + item.quantity, 0);

  return { items: mapped, subtotal, itemCount };
}

export async function getCart(userId?: string, sessionId?: string): Promise<CartResponse> {
  getCartOwner(userId, sessionId);
  const items = await loadCartItems(userId, sessionId);
  return buildCartResponse(items);
}

export async function addCartItem(
  productId: string,
  quantity: number,
  userId?: string,
  sessionId?: string,
): Promise<CartResponse> {
  getCartOwner(userId, sessionId);

  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true },
  });

  if (!product) {
    throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
  }

  const existing = userId
    ? await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      })
    : await prisma.cartItem.findUnique({
        where: { sessionId_productId: { sessionId: sessionId!, productId } },
      });

  const totalQuantity = (existing?.quantity ?? 0) + quantity;
  if (product.stock < totalQuantity) {
    throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');
  }

  if (userId) {
    await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: { increment: quantity } },
      create: { userId, productId, quantity },
    });
  } else {
    await prisma.cartItem.upsert({
      where: { sessionId_productId: { sessionId: sessionId!, productId } },
      update: { quantity: { increment: quantity } },
      create: { sessionId: sessionId!, productId, quantity },
    });
  }

  return getCart(userId, sessionId);
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
  userId?: string,
  sessionId?: string,
): Promise<CartResponse> {
  getCartOwner(userId, sessionId);

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!item) {
    throw new AppError('Sepet öğesi bulunamadı', 404, 'CART_ITEM_NOT_FOUND');
  }

  if (userId && item.userId !== userId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }
  if (!userId && item.sessionId !== sessionId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }

  if (quantity < 1) {
    throw new AppError('Adet en az 1 olmalıdır', 400, 'VALIDATION_ERROR');
  }

  if (item.product.stock < quantity) {
    throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  return getCart(userId, sessionId);
}

export async function removeCartItem(
  itemId: string,
  userId?: string,
  sessionId?: string,
): Promise<CartResponse> {
  getCartOwner(userId, sessionId);

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item) {
    throw new AppError('Sepet öğesi bulunamadı', 404, 'CART_ITEM_NOT_FOUND');
  }

  if (userId && item.userId !== userId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }
  if (!userId && item.sessionId !== sessionId) {
    throw new AppError('Erişim engellendi', 403, 'FORBIDDEN');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(userId, sessionId);
}

export async function clearCart(userId?: string, sessionId?: string): Promise<CartResponse> {
  getCartOwner(userId, sessionId);
  const where = userId ? { userId } : { sessionId };
  await prisma.cartItem.deleteMany({ where });
  return { items: [], subtotal: 0, itemCount: 0 };
}

export async function mergeGuestCart(userId: string, sessionId: string): Promise<CartResponse> {
  const guestItems = await prisma.cartItem.findMany({
    where: { sessionId },
    include: { product: true },
  });

  await prisma.$transaction(async (tx) => {
    for (const guestItem of guestItems) {
      const existing = await tx.cartItem.findUnique({
        where: { userId_productId: { userId, productId: guestItem.productId } },
      });

      const mergedQuantity = (existing?.quantity ?? 0) + guestItem.quantity;
      const product =
        guestItem.product ??
        (await tx.product.findUnique({ where: { id: guestItem.productId } }));

      if (!product || !product.isActive || product.stock < mergedQuantity) {
        throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');
      }

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: mergedQuantity },
        });
        await tx.cartItem.delete({ where: { id: guestItem.id } });
      } else {
        await tx.cartItem.update({
          where: { id: guestItem.id },
          data: { userId, sessionId: null },
        });
      }
    }
  });

  return getCart(userId);
}

export async function clearUserCart(userId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { userId } });
}

export async function clearSessionCart(sessionId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { sessionId } });
}
