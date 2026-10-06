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

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export async function getContactMessages(): Promise<AdminContactMessage[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    subject: m.subject,
    message: m.message,
    status: m.status,
    createdAt: m.created_at,
  }));
}

export async function getNewContactMessageCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;
  const { count } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'new');
  return count ?? 0;
}

export async function updateContactMessageStatus(
  id: string,
  status: ContactMessageStatus,
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('contact_messages').update({ status }).eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Mesaj güncellenemedi veya yetkiniz yok.' };
  return { success: true };
}

export async function deleteContactMessage(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('contact_messages').delete().eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Mesaj silinemedi veya yetkiniz yok.' };
  return { success: true };
}
