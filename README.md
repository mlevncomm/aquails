# Aquails

Aquails, su arıtma cihazları ve yedek parçaları için geliştirilmiş bir e-ticaret platformudur. Proje React 19, TypeScript, Vite ve Tailwind CSS ile oluşturulmuştur.

## Özellikler

- Ürün kataloğu, sepet, ödeme akışı ve müşteri paneli
- Admin paneli (ürünler, siparişler, kuponlar, blog, raporlar)
- Favoriler, karşılaştırma, filtre takibi, abonelik ve sadakat modülleri
- SEO, Schema.org ve PWA manifest desteği

## Mevcut Mimari (Mock / localStorage)

Backend henüz yoktur. Veriler geçici olarak şu kaynaklardan gelir:

| Katman | Kaynak |
|--------|--------|
| Ürünler | `src/data/products.ts` (statik) |
| Sepet | Zustand + `localStorage` (`aquails_cart`) |
| Siparişler | `localStorage` (`aquails_orders`) |
| Kimlik doğrulama | Mock kullanıcılar (`authService.ts`) |
| Terk edilmiş sepet | `localStorage` (`abandoned-carts`) |
| Ürün soruları | `localStorage` (`product-questions`) |

Backend entegrasyonu için yol haritası: `docs/backend-roadmap.md`

### Demo Giriş Bilgileri

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Müşteri | `ahmet@email.com` | `123456` |
| Admin | `admin@aquails.com` | `admin123` |

## Kurulum

```bash
npm install
npm run dev
```

Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

## Scriptler

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run preview` | Build önizleme |
| `npm run lint` | ESLint kontrolü |

## Proje Yapısı

```
src/
  components/   # UI bileşenleri
  data/         # Statik ürün ve mock veriler
  layouts/      # Sayfa düzenleri
  pages/        # Rota sayfaları
  services/     # İş mantığı (mock/localStorage)
  stores/       # Zustand state yönetimi
  types/        # TypeScript tipleri
docs/
  backend-roadmap.md
```

## Teknolojiler

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 3 + shadcn/ui
- Zustand, React Router 7, Framer Motion
