import { isSupabaseMode } from '@/lib/dataProvider';
import { requireSupabase } from '@/lib/supabase';

export async function uploadProductImage(file: File, path: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data: publicUrl } = supabase.storage.from('product-images').getPublicUrl(data.path);
  return publicUrl.publicUrl;
}

export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const supabase = requireSupabase();
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(data.path);
  await supabase.from('profiles').update({ avatar_url: publicUrl.publicUrl }).eq('id', userId);
  return publicUrl.publicUrl;
}

export async function uploadBlogImage(file: File, path: string): Promise<string> {
  if (!isSupabaseMode) throw new Error('Storage yalnızca Supabase modunda kullanılabilir');
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage.from('blog-images').upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data: publicUrl } = supabase.storage.from('blog-images').getPublicUrl(data.path);
  return publicUrl.publicUrl;
}
