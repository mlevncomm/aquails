import { getServiceClient } from './db.ts';

export interface DbProductRow {
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
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  rating: number;
  review_count: number;
  badge: string | null;
  discount_percent: number | null;
  is_active: boolean;
  categories?: { slug: string; name: string } | null;
}

export function mapProductRow(row: DbProductRow) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categories?.name ?? '',
    subcategory: row.categories?.name ?? '',
    description: row.description ?? '',
    shortDescription: row.short_description ?? '',
    price: Number(row.price),
    oldPrice: row.old_price != null ? Number(row.old_price) : null,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    images: Array.isArray(row.images) ? row.images : [],
    features: Array.isArray(row.features) ? row.features : [],
    specifications: row.specifications ?? {},
    badge: row.badge ?? undefined,
    discountPercent: row.discount_percent ?? undefined,
  };
}

export async function loadCartWithItems(userId: string | null, sessionId: string | null) {
  const db = getServiceClient();
  let cartQuery = db.from('carts').select('id, coupon_id, discount_amount');
  if (userId) cartQuery = cartQuery.eq('user_id', userId);
  else if (sessionId) cartQuery = cartQuery.eq('session_id', sessionId);
  else return null;

  const { data: cart } = await cartQuery.maybeSingle();
  if (!cart) return { cart: null, items: [], subtotal: 0, itemCount: 0 };

  const { data: items } = await db
    .from('cart_items')
    .select('id, product_id, quantity, unit_price_snapshot, products(*, categories(slug, name))')
    .eq('cart_id', cart.id);

  const mapped = (items ?? []).map((item) => {
    const product = item.products as DbProductRow;
    return {
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      product: mapProductRow(product),
    };
  });

  const subtotal = mapped.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = mapped.reduce((sum, i) => sum + i.quantity, 0);
  return { cart, items: mapped, subtotal, itemCount };
}

export async function getOrCreateCart(userId: string | null, sessionId: string | null) {
  const db = getServiceClient();
  if (userId) {
    const { data: existing } = await db.from('carts').select('id').eq('user_id', userId).maybeSingle();
    if (existing) return existing.id;
    const { data: created, error } = await db.from('carts').insert({ user_id: userId }).select('id').single();
    if (error) throw error;
    return created.id;
  }
  if (!sessionId) throw new Error('session required');
  const { data: existing } = await db.from('carts').select('id').eq('session_id', sessionId).maybeSingle();
  if (existing) return existing.id;
  const { data: created, error } = await db.from('carts').insert({ session_id: sessionId }).select('id').single();
  if (error) throw error;
  return created.id;
}

export function cartResponseFromLoaded(loaded: Awaited<ReturnType<typeof loadCartWithItems>>) {
  if (!loaded) return { items: [], subtotal: 0, itemCount: 0 };
  return { items: loaded.items, subtotal: loaded.subtotal, itemCount: loaded.itemCount };
}
