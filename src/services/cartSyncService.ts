import { getSupabaseOrNull } from '@/lib/supabase';
import type { CartItem } from '@/types';

export async function syncUserCartToServer(items: CartItem[]): Promise<void> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;

  const payload = items.map((item) => ({
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  await supabase.rpc('sync_user_cart', { p_items: payload });
}
