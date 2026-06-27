import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { assertAdmin, getServiceClient } from '../_shared/db.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const body = await req.json();
    const db = getServiceClient();

    if (body.action === 'notify-pending') {
      await assertAdmin(req.headers.get('Authorization'));
      const { productId } = body;
      const { data: product } = await db.from('products').select('id, name, stock').eq('id', productId).single();
      if (!product || product.stock <= 0) throw new AppError('Stok yok', 400, 'NO_STOCK');

      const { data: pending } = await db
        .from('stock_notifications')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'pending');

      for (const row of pending ?? []) {
        await db.from('notifications').insert({
          user_id: null,
          channel: 'email',
          type: 'stock_back',
          title: `${product.name} stokta`,
          body: `${product.name} tekrar stokta.`,
          status: 'pending',
          metadata: { email: row.email, phone: row.phone, productId },
        });
        await db.from('stock_notifications').update({ status: 'notified', notified_at: new Date().toISOString() }).eq('id', row.id);
      }

      return jsonOk({ notified: pending?.length ?? 0 }, origin);
    }

    const { productId, email, phone } = body;
    if (!productId || !email) throw new AppError('Ürün ve e-posta gerekli', 400, 'VALIDATION_ERROR');
    await db.from('stock_notifications').insert({ product_id: productId, email, phone: phone ?? null });
    return jsonOk({ success: true }, origin, 201);
  } catch (error) {
    return jsonError(error, origin);
  }
});
