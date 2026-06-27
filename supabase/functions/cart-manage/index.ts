import { handleOptions, corsHeaders } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { getAuthUserId, getServiceClient } from '../_shared/db.ts';
import {
  cartResponseFromLoaded,
  getOrCreateCart,
  loadCartWithItems,
} from '../_shared/cart.ts';

type CartAction = 'get' | 'add' | 'update' | 'remove' | 'clear' | 'merge';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const authHeader = req.headers.get('Authorization');
    const sessionHeader = req.headers.get('X-Cart-Session-Id');
    const userId = await getAuthUserId(authHeader);
    const body = req.method === 'GET' ? {} : await req.json();
    const sessionId = sessionHeader ?? body.sessionId ?? null;
    const action = (body.action ?? 'get') as CartAction;
    const db = getServiceClient();

    if (action === 'get') {
      const loaded = await loadCartWithItems(userId, sessionId ?? null);
      return jsonOk(cartResponseFromLoaded(loaded), origin);
    }

    if (action === 'merge' && userId && sessionId) {
      const { data: guestCart } = await db.from('carts').select('id').eq('session_id', sessionId).maybeSingle();
      const { data: userCart } = await db.from('carts').select('id').eq('user_id', userId).maybeSingle();
      if (guestCart && userCart && guestCart.id !== userCart.id) {
        const { data: guestItems } = await db.from('cart_items').select('*').eq('cart_id', guestCart.id);
        for (const item of guestItems ?? []) {
          const { data: existing } = await db
            .from('cart_items')
            .select('id, quantity')
            .eq('cart_id', userCart.id)
            .eq('product_id', item.product_id)
            .maybeSingle();
          if (existing) {
            await db.from('cart_items').update({ quantity: existing.quantity + item.quantity }).eq('id', existing.id);
          } else {
            await db.from('cart_items').insert({
              cart_id: userCart.id,
              product_id: item.product_id,
              quantity: item.quantity,
              unit_price_snapshot: item.unit_price_snapshot,
            });
          }
        }
        await db.from('cart_items').delete().eq('cart_id', guestCart.id);
        await db.from('carts').delete().eq('id', guestCart.id);
      } else if (guestCart && !userCart) {
        await db.from('carts').update({ user_id: userId, session_id: null }).eq('id', guestCart.id);
      }
      const loaded = await loadCartWithItems(userId, null);
      return jsonOk(cartResponseFromLoaded(loaded), origin);
    }

    if (!userId && !sessionId) throw new AppError('Sepet oturumu gerekli', 400, 'CART_SESSION_REQUIRED');

    if (action === 'add') {
      const { productId, quantity = 1 } = body;
      if (!productId) throw new AppError('Ürün gerekli', 400, 'VALIDATION_ERROR');
      const { data: product } = await db.from('products').select('*').eq('id', productId).eq('is_active', true).single();
      if (!product) throw new AppError('Ürün bulunamadı', 404, 'PRODUCT_NOT_FOUND');
      if (product.stock < quantity) throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');

      const cartId = await getOrCreateCart(userId, sessionId ?? null);
      const { data: existing } = await db
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const newQty = existing.quantity + quantity;
        if (product.stock < newQty) throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');
        await db.from('cart_items').update({ quantity: newQty, unit_price_snapshot: product.price }).eq('id', existing.id);
      } else {
        await db.from('cart_items').insert({
          cart_id: cartId,
          product_id: productId,
          quantity,
          unit_price_snapshot: product.price,
        });
      }
    } else if (action === 'update') {
      const { itemId, quantity } = body;
      if (!itemId || quantity == null) throw new AppError('Geçersiz istek', 400, 'VALIDATION_ERROR');
      const { data: item } = await db.from('cart_items').select('*, products(stock)').eq('id', itemId).single();
      if (!item) throw new AppError('Sepet kalemi bulunamadı', 404, 'NOT_FOUND');
      const stock = (item.products as { stock: number }).stock;
      if (quantity > stock) throw new AppError('Yetersiz stok', 400, 'INSUFFICIENT_STOCK');
      if (quantity <= 0) await db.from('cart_items').delete().eq('id', itemId);
      else await db.from('cart_items').update({ quantity }).eq('id', itemId);
    } else if (action === 'remove') {
      const { itemId } = body;
      if (!itemId) throw new AppError('Geçersiz istek', 400, 'VALIDATION_ERROR');
      await db.from('cart_items').delete().eq('id', itemId);
    } else if (action === 'clear') {
      const cartId = await getOrCreateCart(userId, sessionId ?? null);
      await db.from('cart_items').delete().eq('cart_id', cartId);
    }

    const loaded = await loadCartWithItems(userId, sessionId ?? null);
    return jsonOk(cartResponseFromLoaded(loaded), origin);
  } catch (error) {
    return jsonError(error, origin);
  }
});
