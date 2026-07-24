export type MutationResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export function fail(error: string): MutationResult<never> {
  return { success: false, error };
}

export function ok<T = void>(data?: T): MutationResult<T> {
  return data === undefined ? { success: true } : { success: true, data };
}

/** Map common Postgres unique-violation codes to Turkish messages. */
export function mapDbError(message: string | undefined, fallback = 'İşlem başarısız.'): string {
  const m = (message ?? '').toLowerCase();
  if (m.includes('duplicate') || m.includes('unique') || m.includes('23505')) {
    if (m.includes('slug')) return 'Bu ürün adresi (slug) zaten kullanılıyor.';
    if (m.includes('sku')) return 'Bu stok kodu (SKU) zaten kullanılıyor.';
    return 'Bu kayıt zaten mevcut (benzersiz alan çakışması).';
  }
  if (m.includes('42501') || m.includes('permission') || m.includes('row-level security') || m.includes('rls')) {
    return 'Bu işlem için yetkiniz yok.';
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Bağlantı hatası. Lütfen tekrar deneyin.';
  }
  return message?.trim() || fallback;
}

/**
 * Require at least one row from a Supabase mutation.
 * Prevents RLS/no-op updates from being reported as success.
 */
export function requireRows<T>(
  data: T[] | T | null | undefined,
  errorMessage: string,
): MutationResult<T extends unknown[] ? T : T> {
  if (Array.isArray(data)) {
    if (data.length === 0) return fail(errorMessage);
    return ok(data as never);
  }
  if (data == null) return fail(errorMessage);
  return ok(data as never);
}
