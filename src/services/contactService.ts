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

  const { data, error } = await supabase.rpc('submit_contact_message', {
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_subject: subject,
    p_message: message,
  });

  if (error) {
    return { success: false, error: error.message || 'Mesaj gönderilemedi.' };
  }

  const result = data as { success?: boolean } | null;
  if (!result?.success) return { success: false, error: 'Mesaj gönderilemedi.' };

  return { success: true };
}
