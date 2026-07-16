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

export interface PublicBlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
}

const BLOG_IMAGE_CYCLE = [
  '/images/blog-1.jpg',
  '/images/blog-2.jpg',
  '/images/blog-3.jpg',
];

function excerptFromContent(content: string, max = 140): string {
  const plain = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!plain) return 'Aquails bilgi merkezinden güncel rehberler.';
  return plain.length > max ? `${plain.slice(0, max).trim()}…` : plain;
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(words / 200));
  return `${minutes} dk`;
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

function mapPublicPost(row: DbBlogPost, index: number): PublicBlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: excerptFromContent(row.content),
    image: BLOG_IMAGE_CYCLE[index % BLOG_IMAGE_CYCLE.length],
    readTime: estimateReadTime(row.content),
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

export async function getPublishedBlogPosts(limit = 3): Promise<PublicBlogPost[]> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as DbBlogPost[]).map(mapPublicPost);
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
