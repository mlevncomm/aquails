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
  paymentStatus: string;
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
  paymentStatus: string;
  date: string;
}

export interface OrderDetail {
  id: string;
  orderNo: string;
  date: string;
  status: string;
  paymentStatus: string;
  customer: { name: string; email: string; phone: string };
  products: { name: string; qty: number; price: number; sku?: string }[];
  shipping: { title: string; address: string; phone?: string };
  billing: { title: string; address: string };
  payment: string;
  subtotal: number;
  shippingCost: number;
  codFee: number;
  discount: number;
  total: number;
  note?: string;
  cargoCompany?: string;
  trackingNumber?: string;
}

export interface OrderTrackingResult {
  orderNo: string;
  status: string;
  statusLabel: string;
  paymentStatus: string;
  carrier: string;
  trackingNo: string;
  address: string;
  items: { name: string; qty: number; price: number }[];
  timeline: { status: string; date: string; done: boolean }[];
}

type OrderWithProfile = DbOrder & {
  profiles: { name: string; email: string; phone: string | null } | null;
  order_items: DbOrderItem[];
};

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function formatAddress(addr: Record<string, unknown> | null | undefined): string {
  if (!addr || typeof addr !== 'object') return '';
  const parts = [
    addr.full_address ?? addr.address,
    addr.district,
    addr.city,
  ].filter(Boolean);
  return parts.join(', ') || '—';
}

function paymentMethodLabel(method: string | null): string {
  if (method === 'card') return 'Kredi Kartı (PayTR)';
  if (method === 'transfer') return 'Havale/EFT';
  if (method === 'cod') return 'Kapıda Ödeme';
  return method ?? '—';
}

function buildTimeline(status: string, paymentStatus: string, createdAt: string): OrderTrackingResult['timeline'] {
  const date = formatDateTimeTR(createdAt);
  const paid = paymentStatus === 'paid';
  const steps = [
    { status: 'Sipariş Alındı', key: 'pending', done: true },
    { status: 'Ödeme Onaylandı', key: 'paid', done: paid },
    { status: 'Hazırlanıyor', key: 'processing', done: ['processing', 'shipped', 'delivered'].includes(status) },
    { status: 'Kargoya Verildi', key: 'shipped', done: ['shipped', 'delivered'].includes(status) },
    { status: 'Teslim Edildi', key: 'delivered', done: status === 'delivered' },
  ];
  return steps.map((s, i) => ({
    status: s.status,
    date: i === 0 ? date : s.done ? date : '',
    done: s.done,
  }));
}

function mapCustomerOrder(row: OrderWithProfile): CustomerOrder {
  const items = row.order_items ?? [];
  return {
    id: row.id,
    orderNo: row.order_number,
    date: formatDateTR(row.created_at, { day: 'numeric', month: 'long', year: 'numeric' }),
    status: row.status,
    paymentStatus: row.payment_status,
    total: Number(row.total),
    items: items.map((i) => ({
      name: i.product_name,
      qty: i.quantity,
      price: Number(i.unit_price),
    })),
    paymentMethod: paymentMethodLabel(row.payment_method),
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
    paymentStatus: row.payment_status,
    date: formatDateTR(row.created_at),
  };
}

function mapOrderDetail(row: OrderWithProfile): OrderDetail {
  const shipping = row.shipping_address as Record<string, unknown>;
  const billing = row.billing_address as Record<string, unknown>;
  const orderRow = row as DbOrder & { cargo_company?: string | null; tracking_number?: string | null; cod_fee?: number | null };
  return {
    id: row.id,
    orderNo: row.order_number,
    date: formatDateTimeTR(row.created_at),
    status: row.status,
    paymentStatus: row.payment_status,
    customer: {
      name: row.profiles?.name ?? 'Müşteri',
      email: row.profiles?.email ?? '',
      phone: row.profiles?.phone ?? String(shipping?.phone ?? ''),
    },
    products: (row.order_items ?? []).map((i) => ({
      name: i.product_name,
      qty: i.quantity,
      price: Number(i.unit_price),
    })),
    shipping: {
      title: String(shipping?.title ?? 'Teslimat'),
      address: formatAddress(shipping),
      phone: String(shipping?.phone ?? row.profiles?.phone ?? ''),
    },
    billing: {
      title: String(billing?.title ?? 'Fatura'),
      address: formatAddress(billing),
    },
    payment: paymentMethodLabel(row.payment_method),
    subtotal: Number(row.subtotal),
    shippingCost: Number(row.shipping_cost),
    codFee: Number(orderRow.cod_fee ?? 0),
    discount: Number(row.discount),
    total: Number(row.total),
    note: row.notes ?? undefined,
    cargoCompany: orderRow.cargo_company ?? undefined,
    trackingNumber: orderRow.tracking_number ?? undefined,
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

export async function resolveProductId(productId: string, slug?: string): Promise<string | null> {
  if (isUuid(productId)) return productId;
  const supabase = getSupabaseOrNull();
  if (!supabase || !slug) return null;

  const { data } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
  return data?.id ?? null;
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

export async function trackOrderByNumberAndEmail(
  orderNo: string,
  emailOrPhone: string
): Promise<{ success: boolean; order?: OrderTrackingResult; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Sipariş servisi yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('track_order_by_number_and_contact', {
    p_order_number: orderNo.trim(),
    p_email_or_phone: emailOrPhone.trim(),
  });

  if (error || !data) {
    return { success: false, error: 'Sipariş bulunamadı. Numara ve e-posta/telefonu kontrol edin.' };
  }

  const row = data as {
    order_number: string;
    status: string;
    payment_status: string;
    cargo_company?: string | null;
    tracking_number?: string | null;
    shipping_address?: { address?: string; fullAddress?: string } | null;
    created_at: string;
    items?: Array<{ name: string; qty: number; price: number }>;
  };

  const address =
    row.shipping_address?.fullAddress ||
    row.shipping_address?.address ||
    '—';

  return {
    success: true,
    order: {
      orderNo: row.order_number,
      status: row.status,
      statusLabel: orderStatusToTr(row.status),
      paymentStatus: row.payment_status,
      carrier: row.cargo_company ?? '—',
      trackingNo: row.tracking_number ?? '—',
      address,
      items: (row.items ?? []).map((p) => ({ name: p.name, qty: p.qty, price: Number(p.price) })),
      timeline: buildTimeline(row.status, row.payment_status, row.created_at),
    },
  };
}

export async function adminConfirmOfflinePayment(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Sipariş servisi yapılandırılmamış.' };

  const { data, error } = await supabase.rpc('admin_confirm_offline_payment', {
    p_order_id: orderId,
  });

  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; error?: string } | null;
  if (result && result.success === false) {
    return { success: false, error: result.error ?? 'Ödeme onaylanamadı.' };
  }
  return { success: true };
}

export interface CreateOrderInput {
  userId: string;
  items: { productId: string; slug?: string; name: string; qty: number; price: number }[];
  subtotal: number;
  shippingCost: number;
  codFee?: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus?: 'pending' | 'paid';
  shippingAddress: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  notes?: string;
  installationSlot?: string;
  deferStockUntilPaid?: boolean;
  shippingMethod: string;
  couponCode?: string;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<{ success: boolean; order?: CustomerOrder; orderId?: string; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Sipariş servisi yapılandırılmamış.' };
  const { data, error } = await supabase.rpc('create_checkout_order', {
    p_items: input.items.map((item) => ({ product_id: item.productId, quantity: item.qty })),
    p_shipping_address: input.shippingAddress,
    p_billing_address: input.billingAddress ?? input.shippingAddress,
    p_payment_method: input.paymentMethod,
    p_shipping_method: input.shippingMethod,
    p_coupon_code: input.couponCode ?? null,
    p_notes: input.notes ?? null,
    p_service_slot_id: input.installationSlot ?? null,
  });

  if (error) return { success: false, error: error.message || 'Sipariş oluşturulamadı.' };
  const result = data as { success?: boolean; order_id?: string; order_number?: string } | null;
  if (!result?.success || !result.order_id) {
    return { success: false, error: 'Sipariş oluşturulamadı.' };
  }

  const full = await getOrderById(result.order_id);
  if (!full) return { success: true, orderId: result.order_id };

  return {
    success: true,
    orderId: result.order_id,
    order: {
      id: full.id,
      orderNo: full.orderNo,
      date: formatDateTR(new Date().toISOString(), { day: 'numeric', month: 'long', year: 'numeric' }),
      status: full.status,
      paymentStatus: full.paymentStatus,
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

export async function cancelMyOrder(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.rpc('cancel_my_order', { p_order_id: id });
  if (error) return { success: false, error: error.message };
  const result = data as { success?: boolean; error?: string } | null;
  return result?.success
    ? { success: true }
    : { success: false, error: result?.error === 'not_cancellable' ? 'Bu sipariş artık iptal edilemez.' : 'İptal işlemi başarısız.' };
}

export async function updateOrderShipping(
  id: string,
  cargoCompany: string,
  trackingNumber: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('orders')
    .update({
      cargo_company: cargoCompany,
      tracking_number: trackingNumber,
      status: 'shipped',
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function pollOrderPaymentStatus(
  orderId: string,
  maxAttempts = 10
): Promise<'paid' | 'failed' | 'pending'> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 'pending';

  for (let i = 0; i < maxAttempts; i++) {
    const { data } = await supabase
      .from('orders')
      .select('payment_status')
      .eq('id', orderId)
      .maybeSingle();

    if (data?.payment_status === 'paid' || data?.payment_status === 'failed') {
      return data.payment_status as 'paid' | 'failed';
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  return 'pending';
}

/** @deprecated Use createOrder instead */
export function saveOrder(_order: CustomerOrder): void {
  void _order;
  console.warn('saveOrder is deprecated — use createOrder with Supabase');
}
