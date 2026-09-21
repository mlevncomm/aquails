import { next, rewrite } from '@vercel/functions';
import {
  prerenderedBlogSlugs,
  prerenderedCategorySlugs,
  prerenderedProductSlugs,
} from './seo-routes.generated';

type RouteKind = 'product' | 'blog' | 'category';

const productSlugs = new Set<string>(prerenderedProductSlugs);
const blogSlugs = new Set<string>(prerenderedBlogSlugs);
const categorySlugs = new Set<string>(prerenderedCategorySlugs);

function parseRoute(pathname: string): { kind: RouteKind; slug: string } | null {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length !== 2) return null;

  if (parts[0] === 'urun') return { kind: 'product', slug: parts[1] };
  if (parts[0] === 'blog') return { kind: 'blog', slug: parts[1] };
  if (parts[0] === 'kategori') return { kind: 'category', slug: parts[1] };
  return null;
}

function wasPrerendered(kind: RouteKind, slug: string): boolean {
  if (kind === 'product') return productSlugs.has(slug);
  if (kind === 'blog') return blogSlugs.has(slug);
  return categorySlugs.has(slug);
}

async function existsInCatalog(kind: RouteKind, slug: string): Promise<boolean> {
  const supabaseUrl = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return false;

  const table =
    kind === 'product' ? 'products' :
    kind === 'blog' ? 'blog_posts' :
    'categories';

  const endpoint = new URL('/rest/v1/' + table, supabaseUrl);
  endpoint.searchParams.set('select', 'slug');
  endpoint.searchParams.set('slug', 'eq.' + slug);
  endpoint.searchParams.set('limit', '1');

  if (kind === 'product' || kind === 'category') {
    endpoint.searchParams.set('is_active', 'eq.true');
  } else {
    endpoint.searchParams.set('status', 'eq.published');
  }

  const response = await fetch(endpoint, {
    headers: {
      apikey: supabaseKey,
      Authorization: 'Bearer ' + supabaseKey,
      Accept: 'application/json',
    },
  });

  if (!response.ok) return false;
  const rows = await response.json() as Array<{ slug?: string }>;
  return rows.some((row) => row.slug === slug);
}

export const config = {
  matcher: ['/urun/:path*', '/blog/:path*', '/kategori/:path*'],
};

export default async function middleware(request: Request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();

  const url = new URL(request.url);
  const route = parseRoute(url.pathname);
  if (!route || !/^[a-z0-9-]+$/.test(route.slug)) return next();

  // Existing build-time routes keep the fast static/prerendered response.
  if (wasPrerendered(route.kind, route.slug)) return next();

  // Content created in the admin after the last deployment remains reachable.
  if (await existsInCatalog(route.kind, route.slug)) {
    return rewrite(new URL('/index.html', request.url));
  }

  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'public, max-age=0, s-maxage=60',
    },
  });
}
