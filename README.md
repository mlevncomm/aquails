# Aquails

Aquails, su arıtma cihazları ve yedek parçaları için geliştirilmiş bir e-ticaret platformudur.

## Hedef Mimari

| Katman | Teknoloji |
|--------|-----------|
| Frontend deploy | **Vercel** (Vite SPA) |
| Database | **Supabase Postgres** |
| Auth | **Supabase Auth** |
| File storage | **Supabase Storage** (planlı) |
| Kritik server işlemleri | **Supabase Edge Functions** / Vercel Functions |

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│   Vercel    │────▶│  React SPA   │────▶│ Supabase (anon key) │
│  Static CDN │     │  Vite + TS   │     │  RLS-protected DB   │
└─────────────┘     └──────────────┘     └─────────────────────┘
                            │                       ▲
                            └──── Edge Functions ───┘
                                  (service role)
                                  ödeme, stok, webhook
```

### Frontend'den YAPILMAYACAK işlemler

Aşağıdaki işlemler **yalnızca server-side** (Edge Function / Vercel Function) üzerinden yapılmalıdır:

- Ödeme oturumu oluşturma (Iyzico / PayTR)
- Ödeme webhook doğrulama
- Sipariş oluşturma ve stok düşme (atomik)
- Kargo entegrasyonu ve takip numarası
- E-posta / SMS / WhatsApp bildirimleri

Placeholder fonksiyonlar: `supabase/functions/create-checkout-session`, `supabase/functions/payment-webhook`

## Kurulum

```bash
npm install
cp .env.example .env   # Supabase URL ve anon key ekleyin
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışır.

### Ortam Değişkenleri

| Değişken | Açıklama | Nerede |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Supabase proje URL'i | `.env`, Vercel |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key | `.env`, Vercel |
| `SITE_URL` | Public site origin (PayTR / auth redirects) | `.env`, Vercel |
| `DATABASE_URL` | Pooler (transaction mode, port 6543) | `.env` only — **commit etmeyin** |
| `DIRECT_URL` | Pooler (session mode, port 5432) | `.env` only — migration için |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (API / scripts) | Vercel server env, CI |
| `PAYTR_MERCHANT_ID` | PayTR mağaza numarası | Vercel server env |
| `PAYTR_MERCHANT_KEY` / `PAYTR_MERCHANT_SALT` | PayTR imza sırları | Vercel server env |
| `PAYTR_TEST_MODE` | Test için `1`, canlı için `0` | Vercel server env |
| `RESEND_API_KEY` / `EMAIL_FROM` | Transactional e-posta | Vercel server env |
| `CRON_SECRET` | E-posta outbox Bearer secret | Vercel server env + Supabase Vault |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | `npm run admin:create` | local `.env` only |
| `TEST_EMAIL` / `TEST_PASSWORD` | e2e scriptleri | local `.env` only |

> **Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` ve PayTR secret'ları **asla** frontend'e veya `VITE_*` env'e konmamalıdır.

### E-posta outbox zamanlama (Supabase pg_cron)

Vercel Hobby planı saatlik Cron Job'lara izin vermez; `vercel.json` içinde Cron tanımı yoktur.
Outbox worker (`/api/process-email-outbox`) her 10 dakikada bir Supabase `pg_cron` + `pg_net` ile tetiklenir.

1. Vercel'e `SITE_URL`, `CRON_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM` ekleyin.
2. Aynı `SITE_URL` ve `CRON_SECRET` değerlerini Supabase Vault'a yazın (**SQL migration içine yazmayın**):

```sql
select vault.create_secret('https://www.aquails.com', 'aquails_site_url');
select vault.create_secret('your-cron-secret', 'aquails_cron_secret');
```

3. Migration `20260718000200_email_outbox_pg_cron.sql` uygulandığında job `aquails-process-email-outbox` oluşturulur.
4. Vault secret'ları eksikse istek **gönderilmez** (fail-closed); secret değerleri loglanmaz.
5. Endpoint `Authorization: Bearer <CRON_SECRET>` olmadan 401 döner.

### PayTR yerel test

Kartlı ödeme Vercel Functions (`api/paytr-init.ts`, `api/payment-webhook.ts`) üzerinden çalışır.
`npm run dev` (Vite) `/api` route'larını sunmaz; yerel ödeme testi için:

```bash
npx vercel dev
```

Vercel'e `SITE_URL`, `VITE_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` ve PayTR secret'larını ekleyin.

### Supabase CLI Kurulumu

[Supabase CLI](https://supabase.com/docs/guides/cli) kurulu olmalıdır.

```bash
# 1. Supabase hesabına giriş
supabase login

# 2. Remote projeyi bağla
supabase link --project-ref lumwisbjvlggtdjcahtj

# 3. .env dosyasına DIRECT_URL ekleyin (bkz. .env.example)

# 4. Migration'ları remote veritabanına uygula
npm run db:push

# 5. Seed verisini yükle
npm run db:seed
```

**Alternatif (Supabase CLI doğrudan):**

```bash
supabase db push --db-url "$DIRECT_URL" --yes
```

#### Seed verisi

`supabase/config.toml` içinde seed tanımlıdır:

```toml
[db.seed]
enabled = true
sql_paths = ["./seed.sql"]
```

**Remote (staging / ilk kurulum):**

```bash
npm run db:seed
```

**Alternatif yöntemler:**

```bash
# Supabase Dashboard → SQL Editor → supabase/seed.sql içeriğini yapıştırıp çalıştırın

# veya doğrudan psql ile
psql "$DATABASE_URL" -f supabase/seed.sql
```

**Local geliştirme:**

```bash
# Local Supabase stack (API, DB, Studio, Edge Runtime)
supabase start

# Migration + seed ile local DB'yi sıfırla
supabase db reset

# Edge Functions local serve
supabase functions serve
```

Local servis portları (`supabase/config.toml`):

| Servis | Port |
|--------|------|
| API | 54321 |
| Database | 54322 |
| Studio | 54323 |
| Inbucket (e-posta test) | 54324 |

Migration dosyası: `supabase/migrations/20260709160000_initial_schema.sql`

**Oluşturulan tablolar (14):** `profiles`, `categories`, `products`, `product_images`, `addresses`, `carts`, `cart_items`, `orders`, `order_items`, `coupons`, `product_questions`, `reviews`, `service_requests`, `abandoned_carts` (+ RLS politikaları ve auth trigger).

> `VITE_SUPABASE_ANON_KEY` değerini Supabase Dashboard → **Project Settings → API → anon public** alanından alıp `.env` ve Vercel'e ekleyin.

## Vercel Deploy

1. GitHub reposunu Vercel'e bağlayın
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. **Environment Variables** (Vercel → Settings → Environment Variables):

| Değişken | Ortam | Public? |
|----------|-------|---------|
| `VITE_SUPABASE_URL` | Production, Preview, Development | Evet (build-time) |
| `VITE_SUPABASE_ANON_KEY` | Production, Preview, Development | Evet (build-time) |

**Vercel'e EKLENMEYECEK değişkenler:**

| Değişken | Nerede tutulmalı |
|----------|------------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Edge Function secrets |
| `IYZICO_API_KEY` | Supabase Edge Function secrets |
| `IYZICO_SECRET_KEY` | Supabase Edge Function secrets |
| `PAYTR_MERCHANT_ID` | Vercel server environment |
| `PAYTR_MERCHANT_KEY` | Vercel server environment |
| `PAYTR_MERCHANT_SALT` | Vercel server environment |

6. `vercel.json` SPA fallback rewrite'ları içerir

> Uygulama şu an `HashRouter` kullanır (`/#/urunler`). Vercel rewrite'ları BrowserRouter'a geçiş için hazırdır.

### Ödeme Sunucusu Secret'ları

Ödeme entegrasyonu için secret'lar **yalnızca** Vercel proje ayarlarında server environment olarak tanımlanır:

```bash
# Vercel dashboard > Project Settings > Environment Variables
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PAYTR_MERCHANT_ID=your-merchant-id
PAYTR_MERCHANT_KEY=your-merchant-key
PAYTR_MERCHANT_SALT=your-merchant-salt
PAYTR_TEST_MODE=1
```

Bu secret'lar yalnızca Vercel Functions tarafından okunur; frontend'e, `VITE_*` değişkenlerine veya `site_settings` tablosuna yazılmaz.

## Veri Katmanı

| Özellik | Kaynak |
|---------|--------|
| Ürünler / blog / kuponlar | Supabase (`productService`, `blogService`, `couponService`) |
| Auth | Supabase Auth + `profiles` (şifre sıfırlama: `/sifre-sifirla`) |
| Sepet | Zustand persist + girişli kullanıcıda `sync_user_cart` RPC |
| Sipariş takip (misafir) | `track_order_by_number_and_contact` RPC |
| Ödeme | Vercel `/api/paytr-*` + havale/COD için admin `admin_confirm_offline_payment` |
| Görseller | Supabase Storage bucket `product-images` |

Supabase yapılandırılmamışsa katalog servisleri statik `src/data` fallback'ine düşer; auth/ödeme çalışmaz.

## Scriptler

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run preview` | Build önizleme |
| `npm run lint` | ESLint |
| `npm run test:kdv` | Vergi ve sepet toplam testleri |
| `npm run test:security` | Kritik RLS/RPC sertleştirme kontrolleri |
| `npm run test:e2e` | İzole Supabase test projesinde checkout testi (`E2E_ALLOW_MUTATION=true`) |

## Proje Yapısı

```
src/
  lib/supabase.ts       # Supabase client
  services/             # authService, productService, ...
  stores/               # Zustand state
  types/database.ts     # Supabase row types
supabase/
  config.toml           # Supabase CLI config
  migrations/           # Postgres schema + RLS
  seed.sql              # Örnek kategori/ürün seed
  functions/            # Edge Function placeholders
vercel.json             # Vercel SPA config
docs/backend-roadmap.md # Detaylı API planı
```

## Teknolojiler

- React 19 + TypeScript + Vite 7
- Tailwind CSS 3 + shadcn/ui
- Supabase (Auth, Postgres, Edge Functions)
- Zustand, React Router 7
