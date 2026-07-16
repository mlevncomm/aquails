-- Contact form messages (public insert, admin read/update)
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  subject TEXT NOT NULL DEFAULT 'Genel Bilgi',
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
  ON public.contact_messages (created_at DESC);

CREATE INDEX IF NOT EXISTS contact_messages_status_idx
  ON public.contact_messages (status);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_messages_insert_public" ON public.contact_messages
  FOR INSERT
  WITH CHECK (
    char_length(trim(name)) >= 2
    AND char_length(trim(email)) >= 5
    AND char_length(trim(message)) >= 5
  );

CREATE POLICY "contact_messages_select_admin" ON public.contact_messages
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "contact_messages_update_admin" ON public.contact_messages
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "contact_messages_delete_admin" ON public.contact_messages
  FOR DELETE
  USING (public.is_admin());
