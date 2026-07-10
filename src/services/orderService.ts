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
    payment: row.payment_method ?? '—',
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

  const query = emailOrPhone.trim().toLowerCase();
  const { data, error } = await supabase
    .from('orders')
    .select(`${ORDER_SELECT}`)
    .eq('order_number', orderNo.trim())
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: 'Sipariş bulunamadı. Numara ve e-posta/telefonu kontrol edin.' };
  }

  const row = data as unknown as OrderWithProfile;
  const profileEmail = row.profiles?.email?.toLowerCase() ?? '';
  const profilePhone = (row.profiles?.phone ?? '').replace(/\s/g, '');
  const queryPhone = query.replace(/\s/g, '');

  if (profileEmail !== query && profilePhone !== queryPhone && !profilePhone.endsWith(queryPhone.slice(-10))) {
    return { success: false, error: 'Sipariş bilgileri eşleşmedi.' };
  }

  const detail = mapOrderDetail(row);
  return {
    success: true,
    order: {
      orderNo: detail.orderNo,
      status: detail.status,
      statusLabel: orderStatusToTr(detail.status),
      paymentStatus: detail.paymentStatus,
      carrier: detail.cargoCompany ?? '—',
      trackingNo: detail.trackingNumber ?? '—',
      address: detail.shipping.address,
      items: detail.products.map((p) => ({ name: p.name, qty: p.qty, price: p.price })),
      timeline: buildTimeline(detail.status, detail.paymentStatus, row.created_at),
    },
  };
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
}

export async function createOrder(
  input: CreateOrderInput
): Promise<{ success: boolean; order?: CustomerOrder; orderId?: string; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Sipariş servisi yapılandırılmamış.' };

  const resolvedItems: { productId: string | null; name: string; qty: number; price: number }[] = [];
  for (const item of input.items) {
    const productId = await resolveProductId(item.productId, item.slug);
    if (!productId) {
      return { success: false, error: `"${item.name}" ürünü veritabanında bulunamadı. Sepeti güncelleyip tekrar deneyin.` };
    }
    resolvedItems.push({ productId, name: item.name, qty: item.qty, price: item.price });
  }

  const orderNumber = generateOrderNo();
  const paymentStatus = input.paymentStatus ?? (input.deferStockUntilPaid ? 'pending' : 'paid');

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: input.userId,
      order_number: orderNumber,
      status: 'pending',
      subtotal: input.subtotal,
      shipping_cost: input.shippingCost,
      cod_fee: input.codFee ?? 0,
      discount: input.discount,
      total: input.total,
      payment_method: input.paymentMethod,
      payment_status: paymentStatus,
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

  const orderItems = resolvedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    product_name: item.name,
    quantity: item.qty,
    unit_price: item.price,
    total_price: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return { success: false, error: itemsError.message };
  }

  if (!input.deferStockUntilPaid) {
    const { error: fulfillError } = await supabase.rpc('confirm_order_fulfillment', {
      p_order_id: order.id,
    });
    if (fulfillError) {
      console.warn('confirm_order_fulfillment:', fulfillError.message);
    }
  }

  const full = await getOrderById(order.id);
  if (!full) return { success: true, orderId: order.id };

  return {
    success: true,
    orderId: order.id,
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
  console.warn('saveOrder is deprecated — use createOrder with Supabase');
}
