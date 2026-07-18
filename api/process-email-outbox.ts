import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

type OutboxJob = {
  id: string;
  abandoned_cart_id: string | null;
  recipient: string;
  subject: string;
  html_body: string;
  dedupe_key?: string | null;
};

function idempotencyKeyFor(job: OutboxJob): string {
  const raw = String(job.dedupe_key || job.id);
  return raw.slice(0, 256);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const secret = process.env.CRON_SECRET ?? '';
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });

  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  const resendKey = process.env.RESEND_API_KEY ?? '';
  const from = process.env.EMAIL_FROM ?? '';
  if (!url || !serviceKey || !resendKey || !from) return res.status(503).json({ error: 'Email worker not configured' });

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data: jobs, error } = await admin.rpc('claim_email_outbox', { p_limit: 25 });
  if (error) return res.status(500).json({ error: 'Queue unavailable' });

  let sent = 0;
  let updateFailures = 0;

  for (const job of (jobs ?? []) as OutboxJob[]) {
    let emailAccepted = false;
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKeyFor(job),
        },
        body: JSON.stringify({ from, to: [job.recipient], subject: job.subject, html: job.html_body }),
      });
      if (!response.ok) throw new Error(`Email provider HTTP ${response.status}`);
      emailAccepted = true;

      const { error: sentError } = await admin.from('email_outbox').update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        last_error: null,
        claimed_at: null,
      }).eq('id', job.id);
      if (sentError) throw new Error('Outbox sent update failed');

      if (job.abandoned_cart_id) {
        const { error: cartError } = await admin.from('abandoned_carts').update({
          reminder_sent_at: new Date().toISOString(),
        }).eq('id', job.abandoned_cart_id);
        if (cartError) throw new Error('Abandoned cart update failed');
      }
      sent += 1;
    } catch (sendError) {
      if (emailAccepted) {
        // Leave status=processing so stale recovery retries with the same Idempotency-Key.
        updateFailures += 1;
        continue;
      }
      const { error: failError } = await admin.from('email_outbox').update({
        status: 'failed',
        last_error: sendError instanceof Error ? sendError.message.slice(0, 500) : 'Unknown error',
        claimed_at: null,
      }).eq('id', job.id);
      if (failError) updateFailures += 1;
    }
  }

  if (updateFailures > 0) {
    return res.status(500).json({ processed: jobs?.length ?? 0, sent, error: 'Outbox update failed' });
  }
  return res.status(200).json({ processed: jobs?.length ?? 0, sent });
}
