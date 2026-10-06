-- Customer notifications for status changes (in-app + email via email_outbox).
-- Previously customers were never told when an order shipped, a service visit
-- was scheduled, a return was decided or a product question was answered.

CREATE OR REPLACE FUNCTION public._html_escape(p TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT replace(replace(replace(replace(coalesce(p, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
$$;

-- One place that writes both channels. Email is optional (subject NULL = in-app only).
CREATE OR REPLACE FUNCTION public._notify_customer(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT,
  p_link TEXT,
  p_email_subject TEXT,
  p_email_html TEXT,
  p_dedupe_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
  v_name TEXT;
BEGIN
  IF p_user_id IS NULL THEN RETURN; END IF;

  -- Same event must never notify twice (e.g. status flipped back and forth).
  IF p_dedupe_key IS NOT NULL AND EXISTS (SELECT 1 FROM public.email_outbox WHERE dedupe_key = p_dedupe_key) THEN
    RETURN;
  END IF;

  PERFORM public.create_user_notification(p_user_id, p_title, p_message, p_type, p_link);

  IF p_email_subject IS NULL OR p_dedupe_key IS NULL THEN RETURN; END IF;
  SELECT email, name INTO v_email, v_name FROM public.profiles WHERE id = p_user_id;
  IF v_email IS NULL OR btrim(v_email) = '' THEN RETURN; END IF;

  INSERT INTO public.email_outbox (recipient, subject, html_body, dedupe_key)
  VALUES (
    lower(v_email),
    p_email_subject,
    '<h2>Merhaba ' || public._html_escape(coalesce(nullif(trim(v_name), ''), 'Değerli müşterimiz')) || ',</h2>' || p_email_html
      || '<p style="color:#5F7186;font-size:13px">Ayrıntıları Hesabım sayfanızdan takip edebilirsiniz. — Aquails</p>',
    p_dedupe_key
  )
  ON CONFLICT (dedupe_key) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public._notify_customer(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._orders_notify_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_no TEXT := public._html_escape(NEW.order_number);
  v_link TEXT := '/hesabim/siparisler/' || NEW.id::text;
  v_total TEXT := translate(to_char(NEW.total, 'FM999,999,990.00'), ',.', '.,') || ' ₺';
  v_cargo TEXT;
BEGIN
  -- Confirmed: COD orders are born 'processing'; card orders move pending → processing when paid.
  IF NEW.status = 'processing' AND (TG_OP = 'INSERT' OR OLD.status = 'pending') THEN
    PERFORM public._notify_customer(
      NEW.user_id, 'Siparişiniz alındı',
      NEW.order_number || ' numaralı siparişiniz onaylandı ve hazırlanıyor.', 'order', v_link,
      'Siparişiniz alındı — ' || NEW.order_number,
      '<p><strong>' || v_no || '</strong> numaralı siparişiniz onaylandı ve hazırlanmaya başladı.</p><p>Toplam: <strong>' || v_total || '</strong></p>',
      'order-confirmed:' || NEW.id::text
    );
  END IF;

  IF TG_OP = 'INSERT' THEN RETURN NEW; END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'shipped' THEN
      v_cargo := CASE
        WHEN nullif(trim(NEW.tracking_number), '') IS NOT NULL
          THEN coalesce(nullif(trim(NEW.cargo_company), ''), 'Kargo') || ' — takip no: ' || NEW.tracking_number
        ELSE NULL END;
      PERFORM public._notify_customer(
        NEW.user_id, 'Siparişiniz kargoya verildi',
        NEW.order_number || ' kargoya verildi.' || coalesce(' ' || v_cargo, ''), 'order', v_link,
        'Siparişiniz kargoda — ' || NEW.order_number,
        '<p><strong>' || v_no || '</strong> numaralı siparişiniz kargoya verildi.</p>'
          || coalesce('<p>' || public._html_escape(v_cargo) || '</p>', ''),
        'order-shipped:' || NEW.id::text
      );
    ELSIF NEW.status = 'delivered' THEN
      PERFORM public._notify_customer(
        NEW.user_id, 'Siparişiniz teslim edildi',
        NEW.order_number || ' teslim edildi. Ürününüzü değerlendirmeyi unutmayın!', 'order', v_link,
        'Siparişiniz teslim edildi — ' || NEW.order_number,
        '<p><strong>' || v_no || '</strong> numaralı siparişiniz teslim edildi. Bizi tercih ettiğiniz için teşekkür ederiz.</p><p>Deneyiminizi ürün sayfasında değerlendirerek puan kazanabilirsiniz.</p>',
        'order-delivered:' || NEW.id::text
      );
    ELSIF NEW.status = 'cancelled' THEN
      PERFORM public._notify_customer(
        NEW.user_id, 'Siparişiniz iptal edildi',
        NEW.order_number || ' iptal edildi.', 'order', v_link,
        'Siparişiniz iptal edildi — ' || NEW.order_number,
        '<p><strong>' || v_no || '</strong> numaralı siparişiniz iptal edildi.</p>'
          || CASE WHEN NEW.payment_status = 'paid' THEN '<p>Ödemeniz kullandığınız ödeme yöntemine iade edilecektir.</p>' ELSE '' END,
        'order-cancelled:' || NEW.id::text
      );
    ELSIF NEW.status = 'returned' THEN
      PERFORM public._notify_customer(
        NEW.user_id, 'İadeniz tamamlandı',
        NEW.order_number || ' için iade işlemi tamamlandı.', 'order', v_link,
        'İade işleminiz tamamlandı — ' || NEW.order_number,
        '<p><strong>' || v_no || '</strong> numaralı siparişinizin iade işlemi tamamlandı.</p>',
        'order-returned:' || NEW.id::text
      );
    END IF;
  ELSIF NEW.status = 'shipped'
        AND nullif(trim(NEW.tracking_number), '') IS NOT NULL
        AND NEW.tracking_number IS DISTINCT FROM OLD.tracking_number THEN
    -- Tracking number added/changed after the order was already shipped.
    v_cargo := coalesce(nullif(trim(NEW.cargo_company), ''), 'Kargo') || ' — takip no: ' || NEW.tracking_number;
    PERFORM public._notify_customer(
      NEW.user_id, 'Kargo takip numaranız', NEW.order_number || ': ' || v_cargo, 'order', v_link,
      'Kargo takip numaranız — ' || NEW.order_number,
      '<p><strong>' || v_no || '</strong> numaralı siparişinizin kargo bilgisi: ' || public._html_escape(v_cargo) || '</p>',
      'order-tracking:' || NEW.id::text || ':' || NEW.tracking_number
    );
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_orders_notify_status ON public.orders;
CREATE TRIGGER trg_orders_notify_status
  AFTER INSERT OR UPDATE OF status, tracking_number ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public._orders_notify_status();

-- ---------------------------------------------------------------------------
-- Service requests
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._service_requests_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_when TEXT := CASE WHEN NEW.preferred_date IS NULL THEN NULL
                      ELSE to_char(NEW.preferred_date AT TIME ZONE 'Europe/Istanbul', 'DD.MM.YYYY HH24:MI') END;
  v_tech TEXT := nullif(trim(NEW.assigned_to), '');
  v_link TEXT := '/hesabim/servis-talepleri';
BEGIN
  IF NEW.status = 'scheduled' AND v_when IS NOT NULL
     AND (OLD.status IS DISTINCT FROM 'scheduled' OR NEW.preferred_date IS DISTINCT FROM OLD.preferred_date) THEN
    PERFORM public._notify_customer(
      NEW.user_id,
      CASE WHEN OLD.status = 'scheduled' THEN 'Servis randevunuz güncellendi' ELSE 'Servis randevunuz planlandı' END,
      'Randevu: ' || v_when || coalesce(' · Teknisyen: ' || v_tech, ''), 'service', v_link,
      CASE WHEN OLD.status = 'scheduled' THEN 'Servis randevunuz güncellendi' ELSE 'Servis randevunuz planlandı' END,
      '<p>Servis randevunuz <strong>' || v_when || '</strong> için planlandı.</p>'
        || coalesce('<p>Teknisyen: ' || public._html_escape(v_tech) || '</p>', '')
        || '<p>Adres: ' || public._html_escape(NEW.address) || '</p>',
      'service-scheduled:' || NEW.id::text || ':' || NEW.preferred_date::text
    );
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'in_progress' THEN
      PERFORM public._notify_customer(
        NEW.user_id, 'Servis ekibimiz yolda', 'Teknisyenimiz servis için yola çıktı.' || coalesce(' (' || v_tech || ')', ''),
        'service', v_link, NULL, NULL, 'service-in-progress:' || NEW.id::text
      );
    ELSIF NEW.status = 'completed' THEN
      PERFORM public._notify_customer(
        NEW.user_id, 'Servis tamamlandı', 'Servis işleminiz tamamlandı. Bizi tercih ettiğiniz için teşekkürler.', 'service', v_link,
        'Servis işleminiz tamamlandı',
        '<p>Servis işleminiz tamamlandı. Filtre değişimi yaptıysanız Hesabım &gt; Filtre Takibi ekranından kaydınızı güncelleyebilirsiniz.</p>',
        'service-completed:' || NEW.id::text
      );
    ELSIF NEW.status = 'cancelled' AND auth.uid() IS DISTINCT FROM NEW.user_id THEN
      -- Customers cancelling their own request don't need to be told about it.
      PERFORM public._notify_customer(
        NEW.user_id, 'Servis talebiniz iptal edildi', 'Servis talebiniz iptal edildi. Sorularınız için bize ulaşabilirsiniz.', 'service', v_link,
        'Servis talebiniz iptal edildi',
        '<p>Servis talebiniz iptal edildi. Yeni bir randevu oluşturabilir veya bizimle iletişime geçebilirsiniz.</p>',
        'service-cancelled:' || NEW.id::text
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_service_requests_notify ON public.service_requests;
CREATE TRIGGER trg_service_requests_notify
  AFTER UPDATE OF status, preferred_date ON public.service_requests
  FOR EACH ROW EXECUTE FUNCTION public._service_requests_notify();

-- ---------------------------------------------------------------------------
-- Return requests
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._return_requests_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_kind TEXT := CASE WHEN NEW.type = 'exchange' THEN 'Değişim' ELSE 'İade' END;
  v_note TEXT := nullif(trim(NEW.admin_note), '');
  v_title TEXT;
BEGIN
  IF NEW.status IS NOT DISTINCT FROM OLD.status OR NEW.status = 'pending' THEN RETURN NEW; END IF;
  v_title := v_kind || ' talebiniz ' || CASE NEW.status WHEN 'approved' THEN 'onaylandı' WHEN 'rejected' THEN 'reddedildi' ELSE 'tamamlandı' END;
  PERFORM public._notify_customer(
    NEW.user_id, v_title,
    NEW.order_number || ' · ' || NEW.product_name || coalesce(' — ' || v_note, ''), 'order', '/hesabim/iade-degisim',
    v_title || ' — ' || NEW.order_number,
    '<p><strong>' || public._html_escape(NEW.order_number) || '</strong> siparişindeki <strong>' || public._html_escape(NEW.product_name) || '</strong> için '
      || lower(v_kind) || ' talebiniz ' || CASE NEW.status WHEN 'approved' THEN 'onaylandı.' WHEN 'rejected' THEN 'reddedildi.' ELSE 'tamamlandı.' END || '</p>'
      || coalesce('<p>Not: ' || public._html_escape(v_note) || '</p>', ''),
    'return-' || NEW.status || ':' || NEW.id::text
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_return_requests_notify ON public.return_requests;
CREATE TRIGGER trg_return_requests_notify
  AFTER UPDATE OF status ON public.return_requests
  FOR EACH ROW EXECUTE FUNCTION public._return_requests_notify();

-- ---------------------------------------------------------------------------
-- Product questions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._product_questions_notify()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_slug TEXT;
  v_name TEXT;
BEGIN
  IF NEW.user_id IS NULL OR nullif(trim(NEW.answer), '') IS NULL OR nullif(trim(OLD.answer), '') IS NOT NULL THEN
    RETURN NEW;
  END IF;
  SELECT slug, name INTO v_slug, v_name FROM public.products WHERE id = NEW.product_id;
  PERFORM public._notify_customer(
    NEW.user_id, 'Sorunuz yanıtlandı', coalesce(v_name, 'Ürün') || ' hakkındaki sorunuza yanıt verildi.', 'info',
    CASE WHEN v_slug IS NOT NULL THEN '/urun/' || v_slug ELSE NULL END,
    'Sorunuz yanıtlandı',
    '<p><strong>' || public._html_escape(coalesce(v_name, 'Ürün')) || '</strong> hakkındaki sorunuz:</p><blockquote>' || public._html_escape(NEW.question)
      || '</blockquote><p><strong>Yanıtımız:</strong> ' || public._html_escape(NEW.answer) || '</p>',
    'question-answered:' || NEW.id::text
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_product_questions_notify ON public.product_questions;
CREATE TRIGGER trg_product_questions_notify
  AFTER UPDATE OF answer ON public.product_questions
  FOR EACH ROW EXECUTE FUNCTION public._product_questions_notify();
