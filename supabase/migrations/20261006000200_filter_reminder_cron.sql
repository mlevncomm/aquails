-- Daily filter-change reminders.
--   * "upcoming": change is due within 7 days
--   * "overdue":  change is 3+ days late
-- Each stage fires once per due date (the due date moves when the customer marks a change),
-- creating an in-app notification and queueing an email through email_outbox
-- (sent by the existing aquails-process-email-outbox job).

ALTER TABLE public.filter_tracking
  ADD COLUMN IF NOT EXISTS reminded_upcoming_for DATE,
  ADD COLUMN IF NOT EXISTS reminded_overdue_for DATE;

CREATE OR REPLACE FUNCTION public._queue_filter_change_reminders()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  v_upcoming INT := 0;
  v_overdue INT := 0;
  v_name TEXT;
  v_device TEXT;
  v_filter TEXT;
  v_due_label TEXT;
BEGIN
  FOR r IN
    SELECT
      f.id,
      f.user_id,
      f.device_name,
      f.filter_name,
      (coalesce(f.last_changed_at, f.installed_at) + f.change_interval_days)::date AS due_date,
      f.reminded_upcoming_for,
      f.reminded_overdue_for,
      p.email,
      p.name
    FROM public.filter_tracking f
    JOIN public.profiles p ON p.id = f.user_id
    WHERE f.reminder_enabled
    FOR UPDATE OF f SKIP LOCKED
  LOOP
    v_name := replace(replace(coalesce(nullif(trim(r.name), ''), 'Değerli müşterimiz'), '<', '&lt;'), '>', '&gt;');
    v_device := replace(replace(coalesce(nullif(trim(r.device_name), ''), 'cihazınız'), '<', '&lt;'), '>', '&gt;');
    v_filter := replace(replace(r.filter_name, '<', '&lt;'), '>', '&gt;');
    v_due_label := to_char(r.due_date, 'DD.MM.YYYY');

    -- Stage 2: overdue by 3+ days (checked first so a late signup doesn't get both mails at once)
    IF r.due_date <= current_date - 3 AND r.reminded_overdue_for IS DISTINCT FROM r.due_date THEN
      PERFORM public.create_user_notification(
        r.user_id,
        'Filtre değişim zamanı geçti',
        r.filter_name || ' (' || coalesce(nullif(trim(r.device_name), ''), 'cihazınız') || ') için değişim tarihi ' || v_due_label || ' idi. Temiz su için filtrenizi yenileyin.',
        'service',
        '/hesabim/filtre-takibi'
      );
      IF r.email IS NOT NULL AND btrim(r.email) <> '' THEN
        INSERT INTO public.email_outbox (recipient, subject, html_body, dedupe_key)
        VALUES (
          lower(r.email),
          'Filtre değişim zamanınız geçti',
          '<h2>Merhaba ' || v_name || ',</h2>'
            || '<p><strong>' || v_device || '</strong> cihazınızdaki <strong>' || v_filter || '</strong> için önerilen değişim tarihi <strong>' || v_due_label || '</strong> idi.</p>'
            || '<p>Süresi geçmiş filtreler suyun arıtma kalitesini düşürür. Yeni filtrenizi sipariş edebilir veya ücretsiz servis randevusu oluşturabilirsiniz.</p>'
            || '<p>Filtreyi zaten değiştirdiyseniz Hesabım &gt; Filtre Takibi ekranında "Değiştirdim" demeniz yeterli.</p>',
          'filter-overdue:' || r.id::text || ':' || r.due_date::text
        )
        ON CONFLICT (dedupe_key) DO NOTHING;
      END IF;
      UPDATE public.filter_tracking
      SET reminded_overdue_for = r.due_date, reminded_upcoming_for = r.due_date
      WHERE id = r.id;
      v_overdue := v_overdue + 1;

    -- Stage 1: due within the next 7 days (or just passed)
    ELSIF r.due_date <= current_date + 7 AND r.reminded_upcoming_for IS DISTINCT FROM r.due_date THEN
      PERFORM public.create_user_notification(
        r.user_id,
        'Filtre değişim zamanı yaklaşıyor',
        r.filter_name || ' (' || coalesce(nullif(trim(r.device_name), ''), 'cihazınız') || ') için önerilen değişim tarihi: ' || v_due_label || '.',
        'service',
        '/hesabim/filtre-takibi'
      );
      IF r.email IS NOT NULL AND btrim(r.email) <> '' THEN
        INSERT INTO public.email_outbox (recipient, subject, html_body, dedupe_key)
        VALUES (
          lower(r.email),
          'Filtre değişim zamanınız yaklaşıyor',
          '<h2>Merhaba ' || v_name || ',</h2>'
            || '<p><strong>' || v_device || '</strong> cihazınızdaki <strong>' || v_filter || '</strong> için önerilen değişim tarihi <strong>' || v_due_label || '</strong>.</p>'
            || '<p>Yedek filtrenizi şimdiden sipariş ederek kesintisiz temiz suyun keyfini çıkarın. Dilerseniz servis ekibimiz değişimi sizin için yapabilir.</p>',
          'filter-upcoming:' || r.id::text || ':' || r.due_date::text
        )
        ON CONFLICT (dedupe_key) DO NOTHING;
      END IF;
      UPDATE public.filter_tracking SET reminded_upcoming_for = r.due_date WHERE id = r.id;
      v_upcoming := v_upcoming + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'upcoming', v_upcoming, 'overdue', v_overdue);
END;
$$;

-- Internal worker: only the scheduler (postgres) may call it directly.
REVOKE ALL ON FUNCTION public._queue_filter_change_reminders() FROM PUBLIC, anon, authenticated;

-- Admin-facing trigger for the "send now" button.
CREATE OR REPLACE FUNCTION public.admin_run_filter_reminders()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.is_admin() THEN
    RAISE EXCEPTION 'Yetkisiz.' USING ERRCODE = '42501';
  END IF;
  RETURN public._queue_filter_change_reminders();
END;
$$;

REVOKE ALL ON FUNCTION public.admin_run_filter_reminders() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_run_filter_reminders() TO authenticated;

-- Daily at 06:00 UTC (09:00 Türkiye). Idempotent re-schedule.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

SELECT cron.unschedule(j.jobid)
FROM cron.job AS j
WHERE j.jobname = 'aquails-filter-change-reminders';

SELECT cron.schedule(
  'aquails-filter-change-reminders',
  '0 6 * * *',
  $cron$SELECT public._queue_filter_change_reminders();$cron$
);
