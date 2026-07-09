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

| Değişken | Açıklama |
|----------|----------|
| `VITE_SUPABASE_URL` | Supabase proje URL'i |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

> **Güvenlik:** `SUPABASE_SERVICE_ROLE_KEY` asla frontend'e veya `VITE_*` env'e konmamalıdır. Yalnızca Edge Functions / CI ortamında kullanın.

### Supabase veritabanı

```bash
# Supabase CLI ile (önerilen)
supabase link --project-ref <your-ref>
supabase db push          # migrations uygula
psql $DATABASE_URL -f supabase/seed.sql   # örnek seed
```

Migration dosyası: `supabase/migrations/20260709160000_initial_schema.sql`

## Vercel Deploy

1. GitHub reposunu Vercel'e bağlayın
2. Framework: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
6. `vercel.json` SPA fallback rewrite'ları içerir

> Uygulama şu an `HashRouter` kullanır (`/#/urunler`). Vercel rewrite'ları BrowserRouter'a geçiş için hazırdır.

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
