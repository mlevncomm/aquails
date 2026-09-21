import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://aquails.com';

const STATIC_PATHS = [
  '/',
  '/urunler',
  '/kampanyalar',
  '/blog',
  '/filtre-aboneligi',
  '/servis-randevusu',
  '/urun-secim-sihirbazi',
  '/filtre-hesaplayici',
  '/su-kalitesi-testi',
  '/servis-agimiz',
  '/filtre-secim-rehberi',
  '/hakkimizda',
  '/iletisim',
  '/sss',
  '/kargo-kurulum',
  '/iade',
  '/mesafeli-satis',
  '/gizlilik',
  '/kvkk',
  '/uyelik-sozlesmesi',
] as const;

type SitemapRow = {
  slug: string;
  updated_at: string | null;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function entry(path: string, lastModified?: string | null): string {
  const loc = escapeXml(`${SITE_URL}${path}`);
  const lastmod = lastModified
    ? `\n    <lastmod>${escapeXml(new Date(lastModified).toISOString())}</lastmod>`
    : '';

  return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
}

async function loadCatalogUrls(): Promise<string[]> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_ANON_KEY ??
    '';

  if (!supabaseUrl || !supabaseKey) return [];

  const client = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const [productsResult, blogResult] = await Promise.all([
    client
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false }),
    client
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false }),
  ]);

  const urls: string[] = [];

  if (!productsResult.error) {
    for (const row of (productsResult.data ?? []) as SitemapRow[]) {
      if (row.slug) urls.push(entry(`/urun/${encodeURIComponent(row.slug)}`, row.updated_at));
    }
  }

  if (!blogResult.error) {
    for (const row of (blogResult.data ?? []) as SitemapRow[]) {
      if (row.slug) urls.push(entry(`/blog/${encodeURIComponent(row.slug)}`, row.updated_at));
    }
  }

  return urls;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).send('Method Not Allowed');
  }

  const staticEntries = STATIC_PATHS.map((path) => entry(path));
  const dynamicEntries = await loadCatalogUrls();

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticEntries,
    ...dynamicEntries,
    '</urlset>',
    '',
  ].join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400');
  return res.status(200).send(xml);
}
