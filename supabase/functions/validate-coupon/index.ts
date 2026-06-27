import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk } from '../_shared/errors.ts';
import { getAuthUserId } from '../_shared/db.ts';
import { validateCouponInternal } from '../_shared/coupon.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const { code, subtotal } = await req.json();
    const userId = await getAuthUserId(req.headers.get('Authorization'));
    const result = await validateCouponInternal(String(code ?? ''), Number(subtotal ?? 0), userId);
    return jsonOk(result, origin);
  } catch (error) {
    return jsonError(error, origin);
  }
});
