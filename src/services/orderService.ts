import { apiClient } from '@/lib/apiClient';
import type { Order, Address } from '@/types';

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'card' | 'transfer' | 'cod';
  shippingAddress: {
    title: string;
    city: string;
    district?: string;
    fullAddress: string;
    postalCode?: string;
  };
  note?: string;
  couponCode?: string;
  serviceSlotId?: string;
  useCart?: boolean;
  sessionId?: string;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  customer: { id: string; name: string; email: string; phone: string };
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingAddress: Record<string, string>;
  note?: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    total: number;
    product?: unknown;
  }>;
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  return apiClient.post<ApiOrder>('/api/orders', payload);
}

export async function getCustomerOrders(): Promise<ApiOrder[]> {
  return apiClient.get<ApiOrder[]>('/api/orders');
}

export async function getOrderById(id: string): Promise<ApiOrder> {
  return apiClient.get<ApiOrder>(`/api/orders/${id}`);
}

export async function cancelOrder(id: string): Promise<ApiOrder> {
  return apiClient.post<ApiOrder>(`/api/orders/${id}/cancel`);
}

export async function adminGetOrders(params?: { page?: number; limit?: number; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.status) query.set('status', params.status);
  const qs = query.toString();
  return apiClient.get<{ items: ApiOrder[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
    `/api/admin/orders${qs ? `?${qs}` : ''}`,
  );
}

export async function adminGetOrder(id: string): Promise<ApiOrder> {
  return apiClient.get<ApiOrder>(`/api/admin/orders/${id}`);
}

export async function adminUpdateOrderStatus(id: string, status: string) {
  return apiClient.patch<ApiOrder>(`/api/admin/orders/${id}/status`, { status: status.toUpperCase() });
}

export async function adminUpdatePaymentStatus(id: string, paymentStatus: string) {
  return apiClient.patch<ApiOrder>(`/api/admin/orders/${id}/payment-status`, {
    paymentStatus: paymentStatus.toUpperCase(),
  });
}

export function mapApiOrderToOrder(apiOrder: ApiOrder): Order {
  return {
    id: apiOrder.id,
    orderNumber: apiOrder.orderNumber,
    customer: {
      id: apiOrder.customer.id,
      name: apiOrder.customer.name,
      email: apiOrder.customer.email,
      phone: apiOrder.customer.phone,
      registeredAt: apiOrder.createdAt,
    },
    items: apiOrder.items.map((item) => ({
      product: {
        id: item.productId,
        slug: '',
        name: item.productName,
        category: '',
        subcategory: '',
        description: '',
        shortDescription: '',
        price: item.unitPrice,
        oldPrice: null,
        rating: 0,
        reviewCount: 0,
        stock: 0,
        images: [],
        features: [],
        specifications: {},
      },
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })),
    status: apiOrder.status as Order['status'],
    total: apiOrder.total,
    shippingCost: apiOrder.shippingCost,
    discount: apiOrder.discount,
    createdAt: apiOrder.createdAt,
    shippingAddress: {
      id: apiOrder.id,
      title: apiOrder.shippingAddress.title ?? 'Teslimat',
      city: apiOrder.shippingAddress.city ?? '',
      district: apiOrder.shippingAddress.district ?? '',
      fullAddress: apiOrder.shippingAddress.fullAddress ?? '',
      postalCode: apiOrder.shippingAddress.postalCode ?? '',
      isDefault: true,
    } as Address,
    paymentMethod: apiOrder.paymentMethod,
  };
}
