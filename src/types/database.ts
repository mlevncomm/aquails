import type { Product } from '@/types';

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  parent_id?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  description: string | null;
  short_description: string | null;
  price: number;
  old_price: number | null;
  stock: number;
  images: string[] | null;
  features: string[] | null;
  specifications: Record<string, string> | null;
  rating: number;
  review_count: number;
  badge: 'discount' | 'premium' | 'new' | null;
  discount_percent: number | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  categories?: DbCategory | DbCategory[] | null;
}

export function mapDbProduct(row: DbProduct): Product {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: category?.name ?? '',
    subcategory: category?.name ?? '',
    description: row.description ?? '',
    shortDescription: row.short_description ?? '',
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    images: row.images ?? [],
    features: row.features ?? [],
    specifications: row.specifications ?? {},
    badge: row.badge ?? undefined,
    discountPercent: row.discount_percent ?? undefined,
  };
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: GenericTable;
      categories: GenericTable;
      products: GenericTable;
      coupons: GenericTable;
      carts: GenericTable;
      cart_items: GenericTable;
      orders: GenericTable;
      order_items: GenericTable;
      payments: GenericTable;
      addresses: GenericTable;
      coupon_usages: GenericTable;
      service_requests: GenericTable;
      technicians: GenericTable;
      service_slots: GenericTable;
      subscriptions: GenericTable;
      stock_notifications: GenericTable;
      product_questions: GenericTable;
      reviews: GenericTable;
      loyalty_transactions: GenericTable;
      referrals: GenericTable;
      campaigns: GenericTable;
      blog_posts: GenericTable;
      notifications: GenericTable;
      site_settings: GenericTable;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
