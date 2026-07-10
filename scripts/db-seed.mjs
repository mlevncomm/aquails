import fs from 'node:fs';
import pg from 'pg';

const directUrl = process.env.DIRECT_URL;
if (!directUrl) {
  console.error('DIRECT_URL is not set. Add it to your .env file.');
  process.exit(1);
}

const sql = fs.readFileSync(new URL('../supabase/seed.sql', import.meta.url), 'utf8');
const client = new pg.Client({ connectionString: directUrl });

try {
  await client.connect();
  await client.query(sql);
  const [categories, products, coupons] = await Promise.all([
    client.query('SELECT count(*)::int AS count FROM public.categories'),
    client.query('SELECT count(*)::int AS count FROM public.products'),
    client.query('SELECT count(*)::int AS count FROM public.coupons'),
  ]);
  console.log('Seed completed:', {
    categories: categories.rows[0].count,
    products: products.rows[0].count,
    coupons: coupons.rows[0].count,
  });
} finally {
  await client.end();
}
