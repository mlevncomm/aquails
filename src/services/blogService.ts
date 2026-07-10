import { getSupabaseOrNull } from '@/lib/supabase';
import { formatDateTR } from '@/lib/format';
import type { DbBlogPost } from '@/types/database';

export interface BlogPostListItem {
  id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  date: string;
  views: number;
}

function mapPost(row: DbBlogPost): BlogPostListItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    status: row.status,
    date: formatDateTR(row.created_at),
    views: row.views,
  };
}

export async function getBlogPosts(): Promise<BlogPostListItem[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbBlogPost[]).map(mapPost);
}

export async function createBlogPost(input: {
  title: string;
  category: string;
  content?: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const slug = input.title
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]+/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  const { error } = await supabase.from('blog_posts').insert({
    title: input.title,
    slug: `${slug}-${Date.now()}`,
    category: input.category,
    content: input.content ?? '',
    status: 'draft',
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function toggleBlogStatus(
  id: string,
  status: 'draft' | 'published'
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('blog_posts').update({ status }).eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}
