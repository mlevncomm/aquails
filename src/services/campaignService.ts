import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import { mapDbError } from '@/lib/mutationResult';
import type { DbCampaign } from '@/types/database';

export interface Campaign {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  discountLabel: string;
  couponCode: string | null;
  startDate: string | null;
  endDate: string | null;
  /** Human readable end date ("Süresiz" when open-ended). */
  endLabel: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CampaignInput {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  discountLabel: string;
  couponCode: string;
  /** yyyy-mm-dd or '' */
  startDate: string;
  endDate: string;
  isActive: boolean;
  sortOrder: number;
}

function mapCampaign(row: DbCampaign): Campaign {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    discountLabel: row.discount_label,
    couponCode: row.coupon_code,
    startDate: row.start_date,
    endDate: row.end_date,
    endLabel: row.end_date ? formatDateTR(row.end_date) : 'Süresiz',
    isActive: row.is_active,
    sortOrder: row.sort_order,
  };
}

/** Turkish-aware slug helper shared by the admin form. */
export function slugifyCampaign(input: string): string {
  const map: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', i: 'i', ö: 'o', ş: 's', ü: 'u' };
  return input
    .toLocaleLowerCase('tr-TR')
    .replace(/[çğıiöşü]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toRow(input: CampaignInput) {
  const code = input.couponCode.trim().toUpperCase();
  return {
    title: input.title.trim(),
    slug: slugifyCampaign(input.slug || input.title),
    description: input.description.trim(),
    image_url: input.imageUrl.trim() || null,
    discount_label: input.discountLabel.trim(),
    coupon_code: code || null,
    start_date: input.startDate ? new Date(`${input.startDate}T00:00:00`).toISOString() : null,
    end_date: input.endDate ? new Date(`${input.endDate}T23:59:59`).toISOString() : null,
    is_active: input.isActive,
    sort_order: Number.isFinite(input.sortOrder) ? input.sortOrder : 0,
  };
}

function validate(input: CampaignInput): string | null {
  if (!input.title.trim()) return 'Kampanya başlığı zorunludur.';
  if (!slugifyCampaign(input.slug || input.title)) return 'Geçerli bir bağlantı (slug) girin.';
  if (input.startDate && input.endDate && input.endDate < input.startDate) return 'Bitiş tarihi başlangıçtan önce olamaz.';
  return null;
}

/** Public: live campaigns only (RLS filters inactive / out-of-window rows). */
export async function getLiveCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  const now = Date.now();
  return (data as DbCampaign[])
    .filter((c) => (!c.start_date || Date.parse(c.start_date) <= now) && (!c.end_date || Date.parse(c.end_date) >= now))
    .map(mapCampaign);
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const supabase = getSupabaseOrNull();
  if (!supabase || !slug) return null;
  const { data, error } = await supabase.from('campaigns').select('*').eq('slug', slug).maybeSingle();
  if (error || !data) return null;
  return mapCampaign(data as DbCampaign);
}

/** Admin: every campaign, including drafts and expired ones. */
export async function getAdminCampaigns(): Promise<Campaign[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as DbCampaign[]).map(mapCampaign);
}

export async function createCampaign(input: CampaignInput): Promise<{ success: boolean; error?: string }> {
  const invalid = validate(input);
  if (invalid) return { success: false, error: invalid };
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('campaigns').insert(toRow(input));
  if (error) return { success: false, error: mapDbError(error.message, 'Kampanya oluşturulamadı.').replace('ürün adresi', 'kampanya adresi') };
  return { success: true };
}

export async function updateCampaign(id: string, input: CampaignInput): Promise<{ success: boolean; error?: string }> {
  const invalid = validate(input);
  if (invalid) return { success: false, error: invalid };
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('campaigns').update(toRow(input)).eq('id', id).select('id');
  if (error) return { success: false, error: mapDbError(error.message, 'Kampanya güncellenemedi.').replace('ürün adresi', 'kampanya adresi') };
  if (!data?.length) return { success: false, error: 'Kampanya güncellenemedi veya yetkiniz yok.' };
  return { success: true };
}

export async function setCampaignActive(id: string, active: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('campaigns').update({ is_active: active }).eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Kampanya güncellenemedi veya yetkiniz yok.' };
  return { success: true };
}

export async function deleteCampaign(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { data, error } = await supabase.from('campaigns').delete().eq('id', id).select('id');
  if (error) return { success: false, error: error.message };
  if (!data?.length) return { success: false, error: 'Kampanya silinemedi veya yetkiniz yok.' };
  return { success: true };
}
