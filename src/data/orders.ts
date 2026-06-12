import type { Order, Customer, ServiceEvent } from '@/types';

export const mockCustomer: Customer = {
  id: '1',
  name: 'Ahmet Yılmaz',
  email: 'ahmet@email.com',
  phone: '0532 123 45 67',
  registeredAt: '2024-01-15',
};

export const orders: Order[] = [
  {
    id: '1',
    orderNumber: 'AQ-2025-1847',
    customer: mockCustomer,
    items: [],
    status: 'shipped',
    total: 12900,
    shippingCost: 0,
    discount: 2000,
    createdAt: '10 Haziran 2025',
    shippingAddress: {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Pendik',
      fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12',
      postalCode: '34912',
      isDefault: true,
    },
    paymentMethod: 'Kredi Kartı',
  },
  {
    id: '2',
    orderNumber: 'AQ-2025-1840',
    customer: mockCustomer,
    items: [],
    status: 'pending',
    total: 10240,
    shippingCost: 0,
    discount: 1000,
    createdAt: '7 Haziran 2025',
    shippingAddress: {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Pendik',
      fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12',
      postalCode: '34912',
      isDefault: true,
    },
    paymentMethod: 'Havale/EFT',
  },
  {
    id: '3',
    orderNumber: 'AQ-2025-1838',
    customer: mockCustomer,
    items: [],
    status: 'delivered',
    total: 13400,
    shippingCost: 0,
    discount: 500,
    createdAt: '6 Haziran 2025',
    shippingAddress: {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Pendik',
      fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12',
      postalCode: '34912',
      isDefault: true,
    },
    paymentMethod: 'Kredi Kartı',
  },
  {
    id: '4',
    orderNumber: 'AQ-2025-1829',
    customer: mockCustomer,
    items: [],
    status: 'delivered',
    total: 1490,
    shippingCost: 0,
    discount: 400,
    createdAt: '1 Haziran 2025',
    shippingAddress: {
      id: '1',
      title: 'Ev',
      city: 'İstanbul',
      district: 'Pendik',
      fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12',
      postalCode: '34912',
      isDefault: true,
    },
    paymentMethod: 'Kapıda Ödeme',
  },
  {
    id: '5',
    orderNumber: 'AQ-2025-1815',
    customer: mockCustomer,
    items: [],
    status: 'delivered',
    total: 39900,
    shippingCost: 0,
    discount: 8100,
    createdAt: '25 Mayıs 2025',
    shippingAddress: {
      id: '2',
      title: 'İş',
      city: 'İstanbul',
      district: 'Kadıköy',
      fullAddress: 'Caferağa Mah. Moda Cad. No:12',
      postalCode: '34710',
      isDefault: false,
    },
    paymentMethod: 'Havale/EFT',
  },
];

export const adminOrders = [
  { orderNo: 'AQ-2025-1847', customer: 'Ahmet Yılmaz', product: 'PurePro 7 Aşamalı', amount: '12.900₺', status: 'Tamamlandı', date: '10 Haz 2025' },
  { orderNo: 'AQ-2025-1846', customer: 'Selin Koç', product: 'Compact Tezgah Altı', amount: '8.750₺', status: 'Kargoda', date: '10 Haz 2025' },
  { orderNo: 'AQ-2025-1845', customer: 'Mehmet Demir', product: 'Mineral Plus Filtre Seti', amount: '1.490₺', status: 'Tamamlandı', date: '9 Haz 2025' },
  { orderNo: 'AQ-2025-1844', customer: 'Ayşe Kaya', product: 'Aile Paketi', amount: '14.900₺', status: 'Bekliyor', date: '9 Haz 2025' },
  { orderNo: 'AQ-2025-1843', customer: 'Can Özkan', product: 'Business Pro', amount: '39.900₺', status: 'Kargoda', date: '8 Haz 2025' },
  { orderNo: 'AQ-2025-1842', customer: 'Zeynep Şahin', product: 'PurePro 7 Aşamalı', amount: '12.900₺', status: 'Tamamlandı', date: '8 Haz 2025' },
  { orderNo: 'AQ-2025-1841', customer: 'Burak Aydın', product: 'Filtre Seti x2', amount: '2.980₺', status: 'Tamamlandı', date: '7 Haz 2025' },
  { orderNo: 'AQ-2025-1840', customer: 'Elif Yıldız', product: 'Compact + Filtre', amount: '10.240₺', status: 'Bekliyor', date: '7 Haz 2025' },
  { orderNo: 'AQ-2025-1839', customer: 'Kemal Arslan', product: 'Başlangıç Paketi', amount: '9.900₺', status: 'İptal', date: '6 Haz 2025' },
  { orderNo: 'AQ-2025-1838', customer: 'Deniz Çelik', product: 'PurePro + Kurulum', amount: '13.400₺', status: 'Tamamlandı', date: '6 Haz 2025' },
];

export const lowStockProducts = [
  { name: 'Aquails PurePro Filtre Kartuşu', stock: 3 },
  { name: 'Mineral Plus Karbon Filtre', stock: 5 },
  { name: 'Sediment Filtre 5 Mikron', stock: 4 },
  { name: 'RO Membran Filtre 100GPD', stock: 2 },
];

export const todayServices: ServiceEvent[] = [
  { id: '1', time: '09:00', customer: 'Ahmet Yılmaz', type: 'Kurulum', status: 'active' },
  { id: '2', time: '10:30', customer: 'Selin Koç', type: 'Filtre Değişimi', status: 'active' },
  { id: '3', time: '11:30', customer: 'Mehmet Demir', type: 'Bakım', status: 'pending' },
  { id: '4', time: '14:00', customer: 'Ayşe Kaya', type: 'Kurulum', status: 'active' },
];

export const recentCustomers = [
  { name: 'Özlem Yıldız', email: 'ozlem@email.com', time: '2 saat önce', initial: 'Ö' },
  { name: 'Emre Can', email: 'emre@email.com', time: '5 saat önce', initial: 'E' },
  { name: 'Merve Kaya', email: 'merve@email.com', time: '1 gün önce', initial: 'M' },
  { name: 'Serkan Aydın', email: 'serkan@email.com', time: '1 gün önce', initial: 'S' },
];

export const filterStatuses = [
  { deviceName: 'Aquails PurePro (Mutfak)', filterName: 'Sediment Filtre', percentRemaining: 85, daysRemaining: 45 },
  { deviceName: 'Aquails PurePro (Mutfak)', filterName: 'Karbon Filtre', percentRemaining: 72, daysRemaining: 32 },
  { deviceName: 'Aquails PurePro (Mutfak)', filterName: 'RO Membran', percentRemaining: 94, daysRemaining: 280 },
  { deviceName: 'Aquails Compact (Ofis)', filterName: 'Sediment Filtre', percentRemaining: 15, daysRemaining: 12 },
  { deviceName: 'Aquails Compact (Ofis)', filterName: 'Karbon Filtre', percentRemaining: 22, daysRemaining: 18 },
];

export const adminChartData = [
  { month: 'Oca', sales: 820000 },
  { month: 'Şub', sales: 950000 },
  { month: 'Mar', sales: 1100000 },
  { month: 'Nis', sales: 1050000 },
  { month: 'May', sales: 1180000 },
  { month: 'Haz', sales: 1247850 },
];

export const categoryPieData = [
  { name: 'Ev Tipi', value: 45, color: '#1A73E8' },
  { name: 'Tezgah Altı', value: 25, color: '#00C9A7' },
  { name: 'Endüstriyel', value: 10, color: '#F5A623' },
  { name: 'Filtre Seti', value: 12, color: '#8B5CF6' },
  { name: 'Yedek Parça', value: 8, color: '#E85454' },
];

export const operationMetrics = {
  todayInstallations: 8,
  pendingServiceRequests: 12,
  lowStockCount: 18,
  abandonedCarts: 7,
  newCustomersToday: 5,
  pendingOrders: 9,
  unreadQuestions: 4,
  unreadReviews: 6,
  todayRevenue: 48750,
  criticalAlerts: 3,
  pendingReturns: 2,
  activeSubscriptions: 34,
};

export const pendingTasks = [
  { id: '1', title: '3 adet stok bildirimi yanıtla', priority: 'high' as const, time: '2 saat önce', type: 'stock' },
  { id: '2', title: '2 yeni yorum onayla', priority: 'medium' as const, time: '3 saat önce', type: 'review' },
  { id: '3', title: 'Servis takvimi güncelle', priority: 'high' as const, time: '5 saat önce', type: 'service' },
  { id: '4', title: 'Kargo takip numaraları gir', priority: 'medium' as const, time: '1 gün önce', type: 'order' },
  { id: '5', title: 'Fiyat güncellemesi yap', priority: 'low' as const, time: '1 gün önce', type: 'product' },
];

export const criticalStockAlerts = [
  { name: 'RO Membran Filtre 100GPD', stock: 2, sku: 'AQL-RO-100' },
  { name: 'Aquails PurePro Filtre Kartuşu', stock: 3, sku: 'AQL-FP-001' },
  { name: 'Sediment Filtre 5 Mikron', stock: 4, sku: 'AQL-SD-005' },
];
