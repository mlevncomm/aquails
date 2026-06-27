# Aquails — Su Arıtma E-Ticaret Platformu

Aquails, Vite + React + TypeScript ile geliştirilmiş bir su arıtma e-ticaret uygulamasıdır. Production mimarisi **Vercel (frontend)** + **Supabase (Postgres, Auth, RLS, Edge Functions, Storage)** üzerine kuruludur.

Geçiş sürecinde Express backend paralel modda (`VITE_DATA_PROVIDER=express`) çalıştırılabilir.

## Gereksinimler

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- (Opsiyonel) Docker — yerel Supabase için

## Kurulum

```bash
npm install
cp .env.example .env
```

### Frontend env (Vercel + local `.env`)

Yalnızca şu public değişkenler frontend bundle'a girer:

| Variable | Açıklama |
|----------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_APP_URL` | Production site URL (auth redirect, referral link) |
| `VITE_DATA_PROVIDER` | `supabase` (default) veya `express` |

```env
VITE_APP_URL=http://localhost:3000
VITE_DATA_PROVIDER=supabase
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<local-anon-key>
```

> **Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` **asla** Vercel'e, frontend `.env` dosyasına veya client bundle'a eklenmemelidir. Yalnızca Supabase Edge Function secrets üzerinden kullanılır.

Legacy Express modu için (opsiyonel): `VITE_API_URL=http://localhost:4000`

## Yerel Supabase

```bash
npm run supabase:start
npm run supabase:reset    # migrations + seed
npm run supabase:seed     # ürün seed SQL üret (004_seed_products.sql)
```

### Admin kullanıcı (production öncesi zorunlu)

1. Auth kullanıcısı oluştur (`auth.users` insert → `profiles` otomatik oluşur):

```bash
supabase auth admin create-user \
  --email admin@aquails.com \
  --password 'Admin123!' \
  --email-confirm
```

2. Admin rolünü **`profiles.role`** üzerinden ata (Auth metadata değil — güvenilir kaynak `profiles` tablosudur):

```sql
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'admin@aquails.com';
```

3. Admin girişi sonrası `RouteGuard` ve Edge Functions `profiles.role IN ('admin','super_admin')` kontrolü yapar.

Edge Functions (yerel):

```bash
supabase functions serve
```

## Geliştirme

```bash
# Supabase modu (varsayılan)
npm run dev

# Express legacy modu
VITE_DATA_PROVIDER=express npm run dev
npm run dev:server   # ayrı terminal
```

## Scripts

| Script | Açıklama |
|--------|----------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript kontrol |
| `npm run test` | Vitest unit testler |
| `npm run supabase:start` | Yerel Supabase başlat |
| `npm run supabase:reset` | DB sıfırla + migrate + seed |
| `npm run supabase:seed` | products.ts → SQL seed üret |
| `npm run supabase:types` | DB tiplerini üret |

## Mimari

```
Frontend (Vercel SPA)
  └── VITE_DATA_PROVIDER
        ├── supabase → Supabase Auth + RLS reads + Edge Functions (writes)
        └── express  → server/ Express API (legacy)
```

**Kritik yazma işlemleri** (checkout, sepet, kupon, admin sipariş durumu) Edge Functions üzerinden yapılır.

- Checkout: atomik Postgres RPC (`checkout_order`) — stok, kupon, sipariş, ödeme tek transaction
- Guest/user sepet: `cart-manage` Edge Function (client doğrudan `carts`/`cart_items` yazamaz)
- Service role: yalnızca Edge Function içinde `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')`

## Vercel Deploy

1. Repo'yu Vercel'e bağlayın
2. **Build command:** `npm run build` ( `vercel.json` içinde tanımlı)
3. **Output directory:** `dist`
4. **Environment variables** (yalnızca bunlar):

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (ör. `https://aquails.vercel.app`)
   - `VITE_DATA_PROVIDER=supabase`

5. **SPA fallback:** `vercel.json` → `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`

> **Vercel'e eklenmemesi gerekenler:** `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL` (service), database password, Iyzico/PayTR secret'ları. Bunlar Supabase secrets'ta kalır.

## Supabase Production Deploy

```bash
supabase link --project-ref <ref>
supabase db push
supabase functions deploy
supabase secrets set \
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key> \
  APP_URL=https://your-production-domain.com
```

Storage bucket'ları ve storage policy'leri migration ile gelir:

- `001_initial_schema.sql` — bucket tanımları (`product-images`, `blog-images`, `campaign-images`, `avatars`)
- `002_rls_policies.sql` — storage.objects RLS policy'leri

## Güvenlik checklist

- [x] RLS tüm tablolarda etkin (`002_rls_policies.sql`)
- [x] Kullanıcı yalnızca kendi `orders`, `addresses`, `profiles`, `subscriptions`, `loyalty_transactions`, `notifications` kayıtlarını okur
- [x] Admin/super_admin admin policy'leri ile tüm admin CRUD
- [x] Public yalnızca aktif ürün/kategori + published blog + aktif kampanya okur
- [x] Guest cart: `carts`/`cart_items` için INSERT/UPDATE/DELETE policy yok → yalnızca Edge Function (service role)
- [x] Checkout fiyat/stok DB'den; atomik transaction
- [x] Admin rolü `profiles.role` üzerinden (JWT metadata değil)

## Production smoke test listesi

Deploy sonrası manuel doğrulama:

- [ ] Ürün listeleme (Shop / Home)
- [ ] Ürün detay (slug)
- [ ] Register (yeni müşteri)
- [ ] Login (müşteri)
- [ ] Customer profile görüntüleme/güncelleme
- [ ] Sepete ürün ekleme (guest + login)
- [ ] Kupon uygulama (`validate-coupon` EF)
- [ ] Checkout ile sipariş oluşturma
- [ ] Stok düşme (sipariş sonrası `products.stock`)
- [ ] Admin login (`profiles.role = super_admin`)
- [ ] Admin order status update (`admin-order-status` EF)
- [ ] Servis slot booking (checkout veya `create-service-request`)
- [ ] RLS: başka kullanıcının order kaydına erişememe (anon/authenticated farklı user)

## Legacy Express

`server/` klasörü parallel/legacy mod için korunmuştur. Detaylar: [server/DEPLOY.md](server/DEPLOY.md)
