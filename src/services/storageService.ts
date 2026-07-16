import { getSupabaseOrNull } from '@/lib/supabase';

const BUCKET = 'product-images';

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function uploadProductImage(
  file: File,
  productId?: string
): Promise<{ success: boolean; url?: string; path?: string; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Depolama servisi yapılandırılmamış.' };

  const ext = file.name.split('.').pop() || 'jpg';
  const base = sanitizeFileName(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const folder = productId || 'uploads';
  const path = `${folder}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) return { success: false, error: error.message };

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { success: true, url: data.publicUrl, path };
}

export async function deleteProductImage(
  pathOrUrl: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Depolama servisi yapılandırılmamış.' };

  let path = pathOrUrl;
  const marker = `/object/public/${BUCKET}/`;
  const idx = pathOrUrl.indexOf(marker);
  if (idx >= 0) path = pathOrUrl.slice(idx + marker.length);

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
