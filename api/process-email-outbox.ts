import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

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
  for (const job of jobs ?? []) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [job.recipient], subject: job.subject, html: job.html_body }),
      });
      if (!response.ok) throw new Error(`Email provider HTTP ${response.status}`);
      await admin.from('email_outbox').update({ status: 'sent', sent_at: new Date().toISOString(), last_error: null }).eq('id', job.id);
      if (job.abandoned_cart_id) {
        await admin.from('abandoned_carts').update({ reminder_sent_at: new Date().toISOString() }).eq('id', job.abandoned_cart_id);
      }
      sent += 1;
    } catch (sendError) {
      await admin.from('email_outbox').update({
        status: 'failed',
        last_error: sendError instanceof Error ? sendError.message.slice(0, 500) : 'Unknown error',
      }).eq('id', job.id);
    }
  }
  return res.status(200).json({ processed: jobs?.length ?? 0, sent });
}
