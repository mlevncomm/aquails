import { getSupabaseOrNull } from '@/lib/supabase';
import { fail, mapDbError, ok, type MutationResult } from '@/lib/mutationResult';

const BUCKET = 'product-images';
const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function validateProductImageFile(file: File): string | null {
  if (!file || file.size <= 0) return 'Geçersiz dosya.';
  if (file.size > MAX_BYTES) return 'Görsel en fazla 5 MB olabilir.';
  const type = (file.type || '').toLowerCase();
  if (!type || !ALLOWED_TYPES.has(type)) {
    return 'Yalnızca JPEG, PNG, WebP veya GIF yükleyebilirsiniz.';
  }
  return null;
}

export function storagePathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx < 0) return null;
  return url.slice(idx + marker.length);
}

export async function uploadProductImage(
  file: File,
  productId?: string,
): Promise<MutationResult<{ url: string; path: string }>> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Depolama servisi yapılandırılmamış.');

  const validation = validateProductImageFile(file);
  if (validation) return fail(validation);

  const ext = file.name.split('.').pop() || 'jpg';
  const base = sanitizeFileName(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const folder = productId || 'uploads';
  const path = `${folder}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || 'image/jpeg',
  });

  if (error) return fail(mapDbError(error.message, 'Görsel yüklenemedi.'));

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return ok({ url: data.publicUrl, path });
}

export async function deleteProductImage(
  pathOrUrl: string,
): Promise<MutationResult> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fail('Depolama servisi yapılandırılmamış.');

  let path = pathOrUrl;
  const fromUrl = storagePathFromPublicUrl(pathOrUrl);
  if (fromUrl) path = fromUrl;

  // Never delete objects outside the product-images public bucket paths.
  if (!path || path.includes('..') || path.startsWith('/')) {
    return fail('Geçersiz görsel yolu.');
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) return fail(mapDbError(error.message, 'Görsel silinemedi.'));
  return ok();
}

/** Best-effort cleanup; does not fail the caller when storage remove fails. */
export async function bestEffortDeleteUploadedObject(
  pathOrUrl: string,
): Promise<{ cleaned: boolean; warning?: string }> {
  const result = await deleteProductImage(pathOrUrl);
  if (result.success) return { cleaned: true };
  return { cleaned: false, warning: result.error };
}
