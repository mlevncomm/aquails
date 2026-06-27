import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { getServiceClient } from '../_shared/db.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const body = await req.json();
    const { orderId, provider = 'mock', status = 'paid', providerPaymentId } = body;
    if (!orderId) throw new AppError('orderId gerekli', 400, 'VALIDATION_ERROR');

    const db = getServiceClient();
    const paymentStatus = status === 'paid' ? 'paid' : status === 'failed' ? 'failed' : 'pending';
    const orderStatus = paymentStatus === 'paid' ? 'processing' : 'pending';

    await db.from('payments').update({
      status: paymentStatus,
      provider,
      provider_payment_id: providerPaymentId ?? null,
      raw_response: body.rawResponse ?? null,
    }).eq('order_id', orderId);

    const { data: order } = await db
      .from('orders')
      .update({ payment_status: paymentStatus, status: orderStatus })
      .eq('id', orderId)
      .select('id, order_number, payment_status, status')
      .single();

    if (!order) throw new AppError('Sipariş bulunamadı', 404, 'NOT_FOUND');
    return jsonOk(order, origin);
  } catch (error) {
    return jsonError(error, origin);
  }
});
