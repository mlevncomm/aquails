export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  shortDescription: string;
  price: number;
  oldPrice: number | null;
  /** Ürün bazlı KDV oranı (%); yoksa site varsayılanı kullanılır */
  taxRate?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  badge?: 'discount' | 'premium' | 'new';
  discountPercent?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingCost: number;
  discount: number;
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  registeredAt: string;
}

export interface Address {
  id: string;
  title: string;
  city: string;
  district: string;
  fullAddress: string;
  postalCode: string;
  isDefault: boolean;
}

export interface ServiceRequest {
  id: string;
  type: 'installation' | 'filter_change' | 'maintenance' | 'repair';
  customer: Customer;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  customer: Customer;
  product: Product;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
}

export interface Package {
  id: string;
  name: string;
  price: string;
  priceNote: string;
  isPopular: boolean;
  features: { text: string; included: boolean }[];
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  product: string;
  rating: number;
  content: string;
  date: string;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FilterStatus {
  id: string;
  deviceName: string;
  filterName: string;
  percentRemaining: number;
  daysRemaining: number;
}

export interface AdminStats {
  totalSales: string;
  totalSalesTrend: string;
  totalOrders: number;
  totalOrdersTrend: string;
  pendingOrders: number;
  pendingOrdersTrend: string;
  activeCustomers: string;
  activeCustomersTrend: string;
  lowStock: number;
  lowStockTrend: string;
  todayServices: number;
  todayServicesTrend: string;
}

export interface ServiceEvent {
  id: string;
  time: string;
  customer: string;
  type: string;
  status: 'active' | 'pending' | 'completed';
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavItem[];
}
