import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR, formatDateTimeTR } from '@/lib/format';
import { orderStatusToTr } from '@/lib/orderStatus';
import type { DbOrder, DbOrderItem } from '@/types/database';

export interface OrderItem {
  id: string;
  productId: string | null;
  name: string;
  qty: number;
  price: number;
}

export interface CustomerOrder {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
  paymentMethod: string;
  shippingAddress: string;
}

export interface AdminOrderListItem {
  id: string;
  orderNo: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: string;
  date: string;
}

export interface OrderDetail {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  customer: { name: string; email: string; phone: string };
  products: { name: string; qty: number; price: number; sku?: string }[];
  shipping: { title: string; address: string };
  billing: { title: string; address: string };
  payment: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  note?: string;
}

type OrderWithProfile = DbOrder & {
  profiles: { name: string; email: string; phone: string | null } | null;
  order_items: DbOrderItem[];
};

function formatAddress(addr: Record<string, unknown> | null | undefined): string {
  if (!addr || typeof addr !== 'object') return '';
  const parts = [
    addr.full_address ?? addr.address,
    addr.district,
    addr.city,
  ].filter(Boolean);
  return parts.join(', ') || '—';
}

function mapCustomerOrder(row: OrderWithProfile): CustomerOrder {
  const items = row.order_items ?? [];
  return {
    id: row.id,
    orderNo: row.order_number,
    date: formatDateTR(row.created_at, { day: 'numeric', month: 'long', year: 'numeric' }),
    status: row.status,
    total: Number(row.total),
    items: items.map((i) => ({
      name: i.product_name,
      qty: i.quantity,
      price: Number(i.unit_price),
    })),
    paymentMethod: row.payment_method ?? '—',
    shippingAddress: formatAddress(row.shipping_address as Record<string, unknown>),
  };
}

function mapAdminListItem(row: OrderWithProfile): AdminOrderListItem {
  const firstItem = row.order_items?.[0];
  return {
    id: row.id,
    orderNo: row.order_number,
    customer: row.profiles?.name ?? 'Müşteri',
    email: row.profiles?.email ?? '',
    product: firstItem?.product_name ?? '—',
    amount: Number(row.total),
    status: orderStatusToTr(row.status),
    date: formatDateTR(row.created_at),
  };
}

function mapOrderDetail(row: OrderWithProfile): OrderDetail {
  const shipping = row.shipping_address as Record<string, unknown>;
  const billing = row.billing_address as Record<string, unknown>;
  return {
    id: row.id,
    orderNo: row.order_number,
    date: formatDateTimeTR(row.created_at),
    status: row.status,
    customer: {
      name: row.profiles?.name ?? 'Müşteri',
      email: row.profiles?.email ?? '',
      phone: row.profiles?.phone ?? '',
    },
    products: (row.order_items ?? []).map((i) => ({
      name: i.product_name,
      qty: i.quantity,
      price: Number(i.unit_price),
    })),
    shipping: {
      title: String(shipping?.title ?? 'Teslimat'),
      address: formatAddress(shipping),
    },
    billing: {
      title: String(billing?.title ?? 'Fatura'),
      address: formatAddress(billing),
    },
    payment: row.payment_method ?? '—',
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    discount: Number(row.discount),
    total: Number(row.total),
    note: row.notes ?? undefined,
  };
}

const ORDER_SELECT = `
  *,
  profiles (name, email, phone),
  order_items (*)
`;

export function generateOrderNo(): string {
  return `AQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function getCustomerOrders(userId: string): Promise<CustomerOrder[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as OrderWithProfile[]).map(mapCustomerOrder);
}

export async function getAllOrders(): Promise<AdminOrderListItem[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as OrderWithProfile[]).map(mapAdminListItem);
}

export async function getReturnedOrders(): Promise<AdminOrderListItem[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('status', 'returned')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as OrderWithProfile[]).map(mapAdminListItem);
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return mapOrderDetail(data as unknown as OrderWithProfile);
}

export async function getOrderByNumber(orderNo: string): Promise<OrderDetail | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('orders')
    .select(ORDER_SELECT)
    .eq('order_number', orderNo)
    .maybeSingle();

  if (error || !data) return null;
  return mapOrderDetail(data as unknown as OrderWithProfile);
}

export interface CreateOrderInput {
  userId: string;
  items: { productId: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
  installationSlot?: string;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<{ success: boolean; order?: CustomerOrder; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Sipariş servisi yapılandırılmamış.' };

  const orderNumber = generateOrderNo();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      order_number: orderNumber,
      status: 'pending',
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      discount: input.discount,
      total: input.total,
      payment_method: input.paymentMethod,
      payment_status: 'paid',
      shipping_address: input.shippingAddress,
      billing_address: input.billingAddress ?? input.shippingAddress,
      notes: input.notes,
      installation_slot: input.installationSlot ?? null,
    })
    .select('id')
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message ?? 'Sipariş oluşturulamadı.' };
  }

  const orderItems = input.items.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    return { success: false, error: itemsError.message };
  }

  for (const item of input.items) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.productId)
      .maybeSingle();
    if (product) {
      await supabase
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.qty) })
        .eq('id', item.productId);
    }
  }

  const loyaltyPoints = Math.floor(input.total / 10);
  if (loyaltyPoints > 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('loyalty_points')
      .eq('id', input.userId)
      .maybeSingle();
    if (profile) {
      await supabase
        .from('profiles')
        .update({ loyalty_points: (profile.loyalty_points ?? 0) + loyaltyPoints })
        .eq('id', input.userId);
    }
  }

  const full = await getOrderById(order.id);
  if (!full) return { success: true };

  return {
    success: true,
    order: {
      id: full.id,
      orderNo: full.orderNo,
      date: formatDateTR(new Date().toISOString(), { day: 'numeric', month: 'long', year: 'numeric' }),
      status: full.status,
      total: full.total,
      items: full.products.map((p) => ({ name: p.name, qty: p.qty, price: p.price })),
      paymentMethod: full.payment,
      shippingAddress: full.shipping.address,
    },
  };
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

/** @deprecated Use createOrder instead */
export function saveOrder(_order: CustomerOrder): void {
  console.warn('saveOrder is deprecated — use createOrder with Supabase');
}
