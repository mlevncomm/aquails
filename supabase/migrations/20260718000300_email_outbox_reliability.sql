-- Email outbox reliability: stale processing recovery + claimed_at tracking.
-- Does not embed secrets or service-role keys.

ALTER TABLE public.email_outbox
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION public.claim_email_outbox(p_limit INT DEFAULT 25)
RETURNS SETOF public.email_outbox
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH picked AS (
    SELECT e.id
    FROM public.email_outbox AS e
    WHERE e.attempts < 5
      AND (
        e.status IN ('pending', 'failed')
        OR (
          e.status = 'processing'
          AND (
            e.claimed_at IS NULL
            OR e.claimed_at < now() - interval '15 minutes'
          )
        )
      )
    ORDER BY e.created_at
    FOR UPDATE SKIP LOCKED
    LIMIT least(greatest(COALESCE(p_limit, 25), 1), 50)
  )
  UPDATE public.email_outbox AS e
  SET
    status = 'processing',
    claimed_at = now(),
    attempts = e.attempts + 1
  FROM picked
  WHERE e.id = picked.id
  RETURNING e.*;
$$;

REVOKE ALL ON FUNCTION public.claim_email_outbox(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_email_outbox(INT) TO service_role;
