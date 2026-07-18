-- Schedule email outbox processing via Supabase pg_cron + pg_net.
-- SITE_URL / CRON_SECRET must live in Vault (never hardcoded here).
-- Vault secret names: aquails_site_url, aquails_cron_secret

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

CREATE OR REPLACE FUNCTION public.invoke_email_outbox_cron()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions, vault
AS $$
DECLARE
  site_url text;
  cron_secret text;
  endpoint text;
BEGIN
  SELECT ds.decrypted_secret
    INTO site_url
  FROM vault.decrypted_secrets AS ds
  WHERE ds.name = 'aquails_site_url'
  LIMIT 1;

  SELECT ds.decrypted_secret
    INTO cron_secret
  FROM vault.decrypted_secrets AS ds
  WHERE ds.name = 'aquails_cron_secret'
  LIMIT 1;

  -- Fail-closed: do not call the endpoint when Vault values are missing.
  IF site_url IS NULL OR btrim(site_url) = ''
     OR cron_secret IS NULL OR btrim(cron_secret) = '' THEN
    RAISE WARNING 'email outbox cron skipped: required Vault secrets missing';
    RETURN;
  END IF;

  endpoint := rtrim(site_url, '/') || '/api/process-email-outbox';

  -- Do not RAISE/NOTICE secret values. Authorization is sent only in the HTTP header.
  PERFORM net.http_post(
    url := endpoint,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || cron_secret
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 15000
  );
END;
$$;

REVOKE ALL ON FUNCTION public.invoke_email_outbox_cron() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoke_email_outbox_cron() TO postgres;

-- Idempotent schedule: drop any prior job with the same name, then create one.
SELECT cron.unschedule(j.jobid)
FROM cron.job AS j
WHERE j.jobname = 'aquails-process-email-outbox';

SELECT cron.schedule(
  'aquails-process-email-outbox',
  '*/10 * * * *',
  $cron$SELECT public.invoke_email_outbox_cron();$cron$
);
