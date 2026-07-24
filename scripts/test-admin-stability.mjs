#!/usr/bin/env node
/**
 * Static regression checks for routing/build stability and admin mutation hygiene.
 * Fail-closed against production DB mutations.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const PRODUCTION_REF = 'lumwisbjvlggtdjcahtj';
let failed = 0;

function ok(name) {
  console.log(`✓ ${name}`);
}
function bad(name, detail = '') {
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`);
  failed += 1;
}

// --- Fail-closed: never mutate production from test scripts ---
const envText = [
  process.env.SUPABASE_URL ?? '',
  process.env.VITE_SUPABASE_URL ?? '',
  process.env.DIRECT_URL ?? '',
  process.env.DATABASE_URL ?? '',
].join('\n');
if (envText.includes(PRODUCTION_REF) && process.env.E2E_ALLOW_MUTATION === 'true') {
  bad('fail-closed production mutation guard', 'E2E_ALLOW_MUTATION cannot target production ref');
} else {
  ok('fail-closed production mutation guard');
}

// --- Vite base ---
const viteConfig = readFileSync('vite.config.ts', 'utf8');
if (/base:\s*['"]\/['"]/.test(viteConfig)) ok('vite base is root-relative "/"');
else bad('vite base is root-relative "/"');

if (!/return\s+['"]charts-vendor['"]/.test(viteConfig)) ok('no recharts charts-vendor split');
else bad('no recharts charts-vendor split');

// --- dist/index.html asset paths (after build) ---
if (existsSync('dist/index.html')) {
  const html = readFileSync('dist/index.html', 'utf8');
  const scripts = [...html.matchAll(/src="([^"]+)"/g)].map((m) => m[1]);
  const styles = [...html.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
  const assets = [...scripts, ...styles].filter((u) => u.includes('assets/'));
  if (assets.length && assets.every((u) => u.startsWith('/assets/'))) ok('dist assets are /assets/...');
  else bad('dist assets are /assets/...', assets.slice(0, 3).join(', ') || 'none');
} else {
  bad('dist/index.html exists (run build first)');
}

// --- vercel rewrite safety ---
const vercel = readFileSync('vercel.json', 'utf8');
if (/api\/\|assets\//.test(vercel) || /\(\?!api\/\|assets\/\)/.test(vercel)) ok('vercel rewrite excludes api and assets');
else bad('vercel rewrite excludes api and assets');
if (/no-cache/.test(vercel) && /immutable/.test(vercel)) ok('vercel cache headers for html/assets');
else bad('vercel cache headers for html/assets');

// --- App stability wiring ---
const main = readFileSync('src/main.tsx', 'utf8');
if (/AppErrorBoundary/.test(main) && /installChunkLoadRecovery/.test(main)) ok('main wires error boundary + chunk recovery');
else bad('main wires error boundary + chunk recovery');
if (/getElementById\('root'\)!/.test(main)) bad('main avoids non-null root assertion');
else ok('main avoids non-null root assertion');

const routeGuard = readFileSync('src/components/RouteGuard.tsx', 'utf8');
if (/isProtected \|\| isAuthRoute/.test(routeGuard)) ok('RouteGuard waits only on protected/auth routes');
else bad('RouteGuard waits only on protected/auth routes');

const auth = readFileSync('src/services/authService.ts', 'utf8');
if (/try\s*\{[\s\S]*finally\s*\{[\s\S]*setHydrated/.test(auth)) ok('initAuth always hydrates in finally');
else bad('initAuth always hydrates in finally');

const app = readFileSync('src/App.tsx', 'utf8');
if (/NotFoundPage/.test(app) && !/Navigate to="\/"/.test(app)) ok('unknown routes use NotFoundPage');
else bad('unknown routes use NotFoundPage');

// --- Admin catalog ---
const productsPage = readFileSync('src/pages/admin/AdminProductsPage.tsx', 'utf8');
if (/useAdminCatalog/.test(productsPage) && !/useCatalog/.test(productsPage)) ok('AdminProductsPage uses useAdminCatalog');
else bad('AdminProductsPage uses useAdminCatalog');

const productService = readFileSync('src/services/productService.ts', 'utf8');
if (/getAdminProducts/.test(productService) && /isActive:\s*row\.is_active/.test(productService)) {
  ok('admin products map isActive');
} else bad('admin products map isActive');
if (/admin_update_product/.test(productService)) ok('updateProduct uses admin_update_product RPC');
else bad('updateProduct uses admin_update_product RPC');
if (/loadPublicProducts/.test(productService) && /source: 'local'/.test(productService)) {
  ok('public catalog local fallback only when unconfigured');
} else bad('public catalog local fallback only when unconfigured');

// --- Migration security ---
const migration = readFileSync('supabase/migrations/20260724000100_admin_catalog_reliability.sql', 'utf8');
const rpcChecks = [
  ['admin_update_product', /admin_update_product/],
  ['admin_add_product_image', /admin_add_product_image/],
  ['admin_set_product_primary_image', /admin_set_product_primary_image/],
  ['admin_reorder_product_images', /admin_reorder_product_images/],
  ['admin_delete_product_image_record', /admin_delete_product_image_record/],
  ['is_admin gate', /IF NOT public\.is_admin\(\)/],
  ['unique sort index', /product_images_product_id_sort_order_uidx/],
  ['no service role key', (src) => !/SERVICE_ROLE|eyJ[A-Za-z0-9_-]+\./.test(src)],
  ['revoke anon', /REVOKE ALL ON FUNCTION[\s\S]*FROM PUBLIC, anon/],
];
for (const [name, pattern] of rpcChecks) {
  const pass = typeof pattern === 'function' ? pattern(migration) : pattern.test(migration);
  if (pass) ok(`migration: ${name}`);
  else bad(`migration: ${name}`);
}

// --- Admin pages: no local/demo fallback ---
const adminDir = 'src/pages/admin';
for (const file of readdirSync(adminDir).filter((f) => f.endsWith('.tsx'))) {
  const text = readFileSync(join(adminDir, file), 'utf8');
  if (/from ['"]@\/data['"]|staticProducts|localProducts|demoProducts|mockProducts/.test(text)) {
    bad(`admin page has no local/mock fallback (${file})`);
  }
}
ok('admin pages have no local/mock product fallbacks');

// --- Ignored mutation smoke (high-risk services must select/return) ---
const orderService = readFileSync('src/services/orderService.ts', 'utf8');
if (/update\(\{ status \}\)[\s\S]*\.select\('id'\)/.test(orderService)) ok('order status update checks rows');
else bad('order status update checks rows');

const storage = readFileSync('src/services/storageService.ts', 'utf8');
if (/MAX_BYTES|5 \* 1024 \* 1024/.test(storage) && /image\/jpeg/.test(storage)) ok('image MIME/size validation present');
else bad('image MIME/size validation present');
if (/bestEffortDeleteUploadedObject/.test(storage)) ok('upload cleanup helper present');
else bad('upload cleanup helper present');

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nAll stability/admin regression checks passed');
