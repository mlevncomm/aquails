import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { DbReview } from '@/types/database';

export interface AdminReview {
  id: string;
  customer: string;
  product: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  approved: boolean;
}

type ReviewWithProduct = DbReview & {
  products: { name: string } | null;
  profiles: { name: string } | null;
};

function mapReview(row: ReviewWithProduct): AdminReview {
  return {
    id: row.id,
    customer: row.profiles?.name ?? 'Müşteri',
    product: row.products?.name ?? 'Ürün',
    rating: row.rating,
    title: row.title,
    content: row.content,
    date: formatDateTR(row.created_at),
    approved: row.is_published,
  };
}

export async function getReviews(): Promise<AdminReview[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*, products(name), profiles(name)')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as unknown as ReviewWithProduct[]).map(mapReview);
}

export async function toggleReviewPublished(
  id: string,
  published: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase
    .from('reviews')
    .update({ is_published: published })
    .eq('id', id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteReview(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getPendingReviewCount(): Promise<number> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return 0;

  const { count } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', false);

  return count ?? 0;
}
