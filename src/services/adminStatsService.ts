import { getSupabaseOrNull } from '@/lib/supabase';

export interface DashboardStats {
  monthlyRevenue: number;
  monthlyOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  pendingService: number;
  abandonedCarts: number;
  newCustomersToday: number;
  unreadQuestions: number;
  unreadReviews: number;
  todayRevenue: number;
  pendingReturns: number;
  activeSubscriptions: number;
  todayInstallations: number;
  criticalAlerts: number;
}

export interface ChartPoint {
  month: string;
  sales: number;
  orders: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = getSupabaseOrNull();
  const empty: DashboardStats = {
    monthlyRevenue: 0,
    monthlyOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0,
    lowStockCount: 0,
    pendingService: 0,
    abandonedCarts: 0,
    newCustomersToday: 0,
    unreadQuestions: 0,
    unreadReviews: 0,
    todayRevenue: 0,
    pendingReturns: 0,
    activeSubscriptions: 0,
    todayInstallations: 0,
    criticalAlerts: 0,
  };

  if (!supabase) return empty;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    { data: monthOrders },
    { data: todayOrders },
    { count: pendingOrders },
    { count: totalCustomers },
    { count: lowStock },
    { count: pendingService },
    { count: abandonedCarts },
    { count: newToday },
    { count: unreadQuestions },
    { count: unreadReviews },
    { count: pendingReturns },
    { count: activeSubs },
    { count: todayInstallations },
    { count: stockNotifs },
  ] = await Promise.all([
    supabase.from('orders').select('total').gte('created_at', monthStart.toISOString()),
    supabase.from('orders').select('total').gte('created_at', todayStart.toISOString()),
    supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'processing']),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('products').select('*', { count: 'exact', head: true }).lte('stock', 5),
    supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('abandoned_carts').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer').gte('created_at', todayStart.toISOString()),
    supabase.from('product_questions').select('*', { count: 'exact', head: true }).is('answer', null),
    supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('is_published', false),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'returned'),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('service_requests').select('*', { count: 'exact', head: true }).eq('type', 'installation').eq('status', 'scheduled').gte('preferred_date', todayStart.toISOString()),
    supabase.from('stock_notifications').select('*', { count: 'exact', head: true }).eq('notified', false),
  ]);

  const monthlyRevenue = (monthOrders ?? []).reduce((s, o) => s + Number(o.total), 0);
  const todayRevenue = (todayOrders ?? []).reduce((s, o) => s + Number(o.total), 0);

  return {
    monthlyRevenue,
    monthlyOrders: monthOrders?.length ?? 0,
    pendingOrders: pendingOrders ?? 0,
    totalCustomers: totalCustomers ?? 0,
    lowStockCount: lowStock ?? 0,
    pendingService: pendingService ?? 0,
    abandonedCarts: abandonedCarts ?? 0,
    newCustomersToday: newToday ?? 0,
    unreadQuestions: unreadQuestions ?? 0,
    unreadReviews: unreadReviews ?? 0,
    todayRevenue,
    pendingReturns: pendingReturns ?? 0,
    activeSubscriptions: activeSubs ?? 0,
    todayInstallations: todayInstallations ?? 0,
    criticalAlerts: (lowStock ?? 0) + (stockNotifs ?? 0),
  };
}

export async function getSalesChartDataRange(mode: 'week' | 'month' | 'year' = 'month'): Promise<ChartPoint[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const now = new Date();
  const points: ChartPoint[] = [];

  if (mode === 'week') {
    for (let i = 6; i >= 0; i--) {
      const start = new Date(now);
      start.setDate(now.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      const label = start.toLocaleDateString('tr-TR', { weekday: 'short' });
      const { data } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
      const sales = (data ?? []).reduce((s, o) => s + Number(o.total), 0);
      points.push({ month: label, sales, orders: data?.length ?? 0 });
    }
    return points;
  }

  const count = mode === 'year' ? 12 : 6;
  for (let i = count - 1; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const label = start.toLocaleDateString('tr-TR', { month: mode === 'year' ? 'short' : 'short', year: mode === 'year' ? '2-digit' : undefined });
    const { data } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());
    const sales = (data ?? []).reduce((s, o) => s + Number(o.total), 0);
    points.push({ month: label, sales, orders: data?.length ?? 0 });
  }
  return points;
}

export async function getCatalogCategoryBreakdown(): Promise<CategoryBreakdown[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data: products } = await supabase.from('products').select('category_id').eq('is_active', true);
  const { data: categories } = await supabase.from('categories').select('id, name').eq('is_active', true);

  const nameById = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));
  const catCounts: Record<string, number> = {};
  for (const p of products ?? []) {
    const name = p.category_id ? nameById[p.category_id] : undefined;
    if (name) catCounts[name] = (catCounts[name] ?? 0) + 1;
  }
  const total = Object.values(catCounts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(catCounts)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count);
}

export async function getSalesChartData(): Promise<ChartPoint[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const months: ChartPoint[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
    const label = start.toLocaleDateString('tr-TR', { month: 'short' });

    const { data } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', start.toISOString())
      .lte('created_at', end.toISOString());

    const sales = (data ?? []).reduce((s, o) => s + Number(o.total), 0);
    months.push({ month: label, sales, orders: data?.length ?? 0 });
  }

  return months;
}

export async function getLowStockProducts(): Promise<{ id: string; name: string; stock: number; sku: string }[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('products')
    .select('id, name, stock, sku')
    .lte('stock', 10)
    .order('stock')
    .limit(10);

  return data ?? [];
}

export interface CategoryBreakdown {
  name: string;
  count: number;
  percent: number;
}

export async function getReportStats(range: 'day' | 'week' | 'month' | 'year' = 'month') {
  const supabase = getSupabaseOrNull();
  const empty = {
    totalSales: 0,
    orderCount: 0,
    newCustomers: 0,
    avgBasket: 0,
    categoryBreakdown: [] as CategoryBreakdown[],
    dailySales: [] as { label: string; amount: number }[],
  };
  if (!supabase) return empty;

  const now = new Date();
  const start = new Date(now);
  if (range === 'day') start.setHours(0, 0, 0, 0);
  else if (range === 'week') start.setDate(now.getDate() - 7);
  else if (range === 'month') start.setDate(1);
  else start.setMonth(0, 1);
  start.setHours(0, 0, 0, 0);

  const [{ data: orders }, { count: newCustomers }] = await Promise.all([
    supabase.from('orders').select('total, created_at').gte('created_at', start.toISOString()),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer').gte('created_at', start.toISOString()),
  ]);

  const orderList = orders ?? [];
  const totalSales = orderList.reduce((s, o) => s + Number(o.total), 0);
  const orderCount = orderList.length;
  const avgBasket = orderCount ? Math.round(totalSales / orderCount) : 0;

  const { data: products } = await supabase
    .from('products')
    .select('category_id');

  const { data: categories } = await supabase.from('categories').select('id, name');

  const nameById = Object.fromEntries((categories ?? []).map((c) => [c.id, c.name]));
  const catCounts: Record<string, number> = {};
  for (const p of products ?? []) {
    const name = p.category_id ? nameById[p.category_id] : undefined;
    if (name) catCounts[name] = (catCounts[name] ?? 0) + 1;
  }
  const totalProducts = Object.values(catCounts).reduce((a, b) => a + b, 0) || 1;
  const categoryBreakdown = Object.entries(catCounts)
    .map(([name, count]) => ({ name, count, percent: Math.round((count / totalProducts) * 100) }))
    .sort((a, b) => b.count - a.count);

  const dailyMap: Record<string, number> = {};
  for (const o of orderList) {
    const d = new Date(o.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    dailyMap[d] = (dailyMap[d] ?? 0) + Number(o.total);
  }
  const dailySales = Object.entries(dailyMap).map(([label, amount]) => ({ label, amount }));

  return { totalSales, orderCount, newCustomers: newCustomers ?? 0, avgBasket, categoryBreakdown, dailySales };
}

export async function getRecentOrders(limit = 5) {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from('orders')
    .select('id, order_number, total, status, created_at, profiles(name)')
    .order('created_at', { ascending: false })
    .limit(limit);

  return data ?? [];
}
