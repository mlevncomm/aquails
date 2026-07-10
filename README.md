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

### Ortam Değişkenleri (Frontend)

| Değişken | Açıklama | Nerede |
|----------|----------|--------|
| `VITE_SUPABASE_URL` | Supabase proje URL'i | `.env`, Vercel |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key | `.env`, Vercel |
| `DATABASE_URL` | Pooler (transaction mode, port 6543) | `.env` only — **commit etmeyin** |
| `DIRECT_URL` | Pooler (session mode, port 5432) | `.env` only — migration için |

> **Proje ref:** `lumwisbjvlggtdjcahtj` → `https://lumwisbjvlggtdjcahtj.supabase.co`

> **Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` **asla** frontend'e, `VITE_*` env'e veya Vercel **public** environment variables içine konmamalıdır.

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
| `PAYTR_MERCHANT_ID` | Supabase Edge Function secrets |
| `PAYTR_MERCHANT_KEY` | Supabase Edge Function secrets |
| `PAYTR_MERCHANT_SALT` | Supabase Edge Function secrets |

6. `vercel.json` SPA fallback rewrite'ları içerir

> Uygulama şu an `HashRouter` kullanır (`/#/urunler`). Vercel rewrite'ları BrowserRouter'a geçiş için hazırdır.

### Supabase Edge Function Secrets

Ödeme entegrasyonu için secret'lar **yalnızca** Supabase tarafında tanımlanır:

```bash
# Örnek (ileride ödeme entegrasyonu)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set IYZICO_API_KEY=your-iyzico-api-key
supabase secrets set IYZICO_SECRET_KEY=your-iyzico-secret
supabase secrets set PAYTR_MERCHANT_ID=your-merchant-id
supabase secrets set PAYTR_MERCHANT_KEY=your-merchant-key
supabase secrets set PAYTR_MERCHANT_SALT=your-merchant-salt
```

Bu secret'lar Edge Functions içinde `Deno.env.get('...')` ile okunur; frontend veya Vercel public env'e yazılmaz.

## Veri Katmanı (Geçiş Dönemi)

| Özellik | Supabase yapılandırılmışsa | Yapılandırılmamışsa (dev) |
|---------|---------------------------|---------------------------|
| Ürünler | `productService` → Supabase | `src/data/products.ts` fallback |
| Auth | Supabase Auth + `profiles` | Dev legacy mock kullanıcılar |
| Sepet / sipariş | localStorage (geçici) | localStorage |

### Dev Legacy Mock (yalnızca Supabase env yokken)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Müşteri | `ahmet@email.com` | `123456` |
| Admin | `admin@aquails.com` | `admin123` |

## Scriptler

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run preview` | Build önizleme |
| `npm run lint` | ESLint |

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
