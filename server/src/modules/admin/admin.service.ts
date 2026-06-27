import { prisma } from '../../lib/prisma.js';
import { decimalToNumber, serializeProduct, type ProductWithCategory } from '../../lib/serialize.js';
import { toPublicUser } from '../auth/auth.types.js';

export async function getDashboardMetrics() {
  const [
    totalOrders,
    pendingOrders,
    revenueAgg,
    newCustomers,
    lowStockCount,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: 'CANCELLED' } },
    }),
    prisma.user.count({
      where: {
        role: 'CUSTOMER',
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 10 } } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              include: { category: { select: { id: true, slug: true, name: true } } },
            },
          },
        },
      },
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 10 } },
      include: { category: { select: { id: true, slug: true, name: true } } },
      orderBy: { stock: 'asc' },
      take: 10,
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalRevenue: decimalToNumber(revenueAgg._sum.total) ?? 0,
    newCustomers,
    lowStockCount,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      total: decimalToNumber(order.total) ?? 0,
      status: order.status.toLowerCase(),
      createdAt: order.createdAt.toISOString(),
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    })),
    lowStockProducts: lowStockProducts.map((p) => serializeProduct(p as ProductWithCategory)),
  };
}

export async function listCustomers() {
  const users = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return users.map((user) => ({
    ...toPublicUser(user),
    registeredAt: user.createdAt.toISOString(),
    orderCount: user._count.orders,
  }));
}
