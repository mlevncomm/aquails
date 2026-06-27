import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { assertAdmin, getServiceClient } from '../_shared/db.ts';

const ALLOWED: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    await assertAdmin(req.headers.get('Authorization'));
    const { orderId, status } = await req.json();
    if (!orderId || !status) throw new AppError('Geçersiz istek', 400, 'VALIDATION_ERROR');

    const db = getServiceClient();
    const { data: order } = await db.from('orders').select('status').eq('id', orderId).single();
    if (!order) throw new AppError('Sipariş bulunamadı', 404, 'NOT_FOUND');

    const next = String(status).toLowerCase();
    const current = order.status;
    if (!ALLOWED[current]?.includes(next)) {
      throw new AppError(`Geçersiz durum geçişi: ${current} → ${next}`, 400, 'INVALID_STATUS');
    }

    const { data: updated, error } = await db
      .from('orders')
      .update({ status: next })
      .eq('id', orderId)
      .select('*')
      .single();
    if (error || !updated) throw new AppError('Güncelleme başarısız', 500, 'UPDATE_FAILED');

    return jsonOk({ id: updated.id, status: updated.status, paymentStatus: updated.payment_status }, origin);
  } catch (error) {
    return jsonError(error, origin);
  }
});
