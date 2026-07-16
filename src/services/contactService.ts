import { getSupabaseOrNull } from '@/lib/supabase';

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export async function submitContactMessage(
  input: ContactMessageInput,
): Promise<{ success: boolean; error?: string }> {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const phone = (input.phone ?? '').trim();
  const subject = (input.subject ?? 'Genel Bilgi').trim() || 'Genel Bilgi';

  if (name.length < 2 || email.length < 5 || message.length < 5) {
    return { success: false, error: 'Lütfen tüm zorunlu alanları doğru doldurun.' };
  }

  const supabase = getSupabaseOrNull();
  if (!supabase) {
    return { success: false, error: 'İletişim servisi yapılandırılmamış. Lütfen daha sonra tekrar deneyin.' };
  }

  // Do not .select() after insert — SELECT is admin-only under RLS.
  const { error } = await supabase.from('contact_messages').insert({
    name,
    email,
    phone,
    subject,
    message,
    status: 'new',
  });

  if (error) {
    return { success: false, error: error.message || 'Mesaj gönderilemedi.' };
  }

  return { success: true };
}
