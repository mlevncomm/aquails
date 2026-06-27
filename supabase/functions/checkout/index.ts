import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { getAuthUserId, getServiceClient } from '../_shared/db.ts';

const SHIPPING_COST = 0;

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const body = await req.json();
    const userId = await getAuthUserId(req.headers.get('Authorization'));
    const sessionId = req.headers.get('X-Cart-Session-Id') ?? body.sessionId ?? null;
    const db = getServiceClient();

    const { data, error } = await db.rpc('checkout_order', {
      p_user_id: userId,
      p_session_id: sessionId,
      p_customer_name: body.customerName,
      p_customer_email: body.customerEmail,
      p_customer_phone: body.customerPhone,
      p_payment_method: body.paymentMethod,
      p_shipping_address: body.shippingAddress,
      p_notes: body.note ?? null,
      p_coupon_code: body.couponCode ?? null,
      p_service_slot_id: body.serviceSlotId ?? null,
      p_shipping_cost: SHIPPING_COST,
    });

    if (error) {
      throw new AppError(error.message || 'Sipariş oluşturulamadı', 400, 'CHECKOUT_FAILED');
    }

    const result = data as {
      orderId: string;
      orderNumber: string;
      total: number;
      paymentStatus: string;
    };

    return jsonOk(result, origin, 201);
  } catch (error) {
    return jsonError(error, origin);
  }
});
