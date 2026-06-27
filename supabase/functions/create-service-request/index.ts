import { handleOptions } from '../_shared/cors.ts';
import { jsonError, jsonOk, AppError } from '../_shared/errors.ts';
import { getAuthUserId, getServiceClient } from '../_shared/db.ts';

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const options = handleOptions(req);
  if (options) return options;

  try {
    const userId = await getAuthUserId(req.headers.get('Authorization'));
    const body = await req.json();
    const db = getServiceClient();

    const { data: request, error } = await db
      .from('service_requests')
      .insert({
        user_id: userId,
        type: body.type ?? 'installation',
        status: 'pending',
        address: body.address ?? null,
        preferred_date: body.preferredDate ?? null,
        description: body.description ?? null,
        notes: body.notes ?? null,
      })
      .select('*')
      .single();

    if (error || !request) throw new AppError('Servis talebi oluşturulamadı', 500, 'CREATE_FAILED');

    if (body.slotId) {
      const { data: slot } = await db.from('service_slots').select('id, status').eq('id', body.slotId).single();
      if (!slot || slot.status !== 'available') throw new AppError('Slot müsait değil', 400, 'SLOT_UNAVAILABLE');
      await db
        .from('service_slots')
        .update({ status: 'booked', service_request_id: request.id })
        .eq('id', body.slotId)
        .eq('status', 'available');
    }

    return jsonOk(request, origin, 201);
  } catch (error) {
    return jsonError(error, origin);
  }
});
