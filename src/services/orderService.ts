import { apiClient } from '@/lib/apiClient';
import { isSupabaseMode } from '@/lib/dataProvider';
import { invokeFunction } from '@/lib/api';
import { checkout } from '@/services/checkoutService';
import { requireSupabase } from '@/lib/supabase';
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

function mapSupabaseOrder(row: Record<string, unknown>, items: ApiOrder['items'] = []): ApiOrder {
  const shippingAddress = (row.shipping_address as Record<string, string>) ?? {};
  return {
    id: String(row.id),
    orderNumber: String(row.order_number),
    customer: {
      id: String(row.user_id ?? row.id),
      name: String(row.customer_name),
      email: String(row.customer_email),
      phone: String(row.customer_phone),
    },
    status: String(row.status),
    paymentMethod: String(row.payment_method ?? ''),
    paymentStatus: String(row.payment_status),
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    discount: Number(row.discount),
    total: Number(row.total),
    shippingAddress,
    note: row.notes ? String(row.notes) : null,
    createdAt: String(row.created_at),
    items,
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  if (isSupabaseMode) {
    const result = await checkout(payload);
    return {
      id: result.orderId,
      orderNumber: result.orderNumber,
      customer: {
        id: result.orderId,
        name: payload.customerName,
        email: payload.customerEmail,
        phone: payload.customerPhone,
      },
      status: 'pending',
      paymentMethod: payload.paymentMethod,
      paymentStatus: result.paymentStatus,
      subtotal: 0,
      shippingCost: 0,
      discount: 0,
      total: result.total,
      shippingAddress: payload.shippingAddress as Record<string, string>,
      note: payload.note ?? null,
      createdAt: new Date().toISOString(),
      items: [],
    };
  }
  return apiClient.post<ApiOrder>('/api/orders', payload);
}

export async function getCustomerOrders(): Promise<ApiOrder[]> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => {
      const items = ((row.order_items as Array<Record<string, unknown>>) ?? []).map((item) => ({
        id: String(item.id),
        productId: String(item.product_id ?? ''),
        productName: String(item.product_name_snapshot),
        unitPrice: Number(item.unit_price),
        quantity: Number(item.quantity),
        total: Number(item.total_price),
      }));
      return mapSupabaseOrder(row as Record<string, unknown>, items);
    });
  }
  return apiClient.get<ApiOrder[]>('/api/orders');
}

export async function getOrderById(id: string): Promise<ApiOrder> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).single();
    if (error || !data) throw new Error('Sipariş bulunamadı');
    const items = ((data.order_items as Array<Record<string, unknown>>) ?? []).map((item) => ({
      id: String(item.id),
      productId: String(item.product_id ?? ''),
      productName: String(item.product_name_snapshot),
      unitPrice: Number(item.unit_price),
      quantity: Number(item.quantity),
      total: Number(item.total_price),
    }));
    return mapSupabaseOrder(data as Record<string, unknown>, items);
  }
  return apiClient.get<ApiOrder>(`/api/orders/${id}`);
}

export async function getOrderByNumber(orderNumber: string): Promise<ApiOrder | null> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data } = await supabase.from('orders').select('*, order_items(*)').eq('order_number', orderNumber).maybeSingle();
    if (!data) return null;
    const items = ((data.order_items as Array<Record<string, unknown>>) ?? []).map((item) => ({
      id: String(item.id),
      productId: String(item.product_id ?? ''),
      productName: String(item.product_name_snapshot),
      unitPrice: Number(item.unit_price),
      quantity: Number(item.quantity),
      total: Number(item.total_price),
    }));
    return mapSupabaseOrder(data as Record<string, unknown>, items);
  }
  return null;
}

export async function cancelOrder(id: string): Promise<ApiOrder> {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id).select('*, order_items(*)').single();
    if (error || !data) throw new Error('İptal başarısız');
    return mapSupabaseOrder(data as Record<string, unknown>);
  }
  return apiClient.post<ApiOrder>(`/api/orders/${id}/cancel`);
}

export async function adminGetOrders(params?: { page?: number; limit?: number; status?: string }) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    let query = supabase.from('orders').select('*, order_items(*)', { count: 'exact' });
    if (params?.status) query = query.eq('status', params.status.toLowerCase());
    const from = (page - 1) * limit;
    const { data, count, error } = await query.range(from, from + limit - 1).order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const total = count ?? 0;
    return {
      items: (data ?? []).map((row) => mapSupabaseOrder(row as Record<string, unknown>)),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 },
    };
  }
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
  if (isSupabaseMode) return getOrderById(id);
  return apiClient.get<ApiOrder>(`/api/admin/orders/${id}`);
}

export async function adminUpdateOrderStatus(id: string, status: string): Promise<ApiOrder> {
  if (isSupabaseMode) {
    await invokeFunction('admin-order-status', {
      orderId: id,
      status: status.toLowerCase(),
    });
    return getOrderById(id);
  }
  return apiClient.patch<ApiOrder>(`/api/admin/orders/${id}/status`, { status: status.toUpperCase() });
}

export async function adminUpdatePaymentStatus(id: string, paymentStatus: string) {
  if (isSupabaseMode) {
    const supabase = requireSupabase();
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus.toLowerCase() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapSupabaseOrder(data as Record<string, unknown>);
  }
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
