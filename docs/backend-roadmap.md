# Aquails Backend Roadmap (Güncel)

Bu belge canlı mimariyi özetler. Klasik REST `/api/v1` katmanı yerine proje **Supabase (Postgres + Auth + RLS + RPC)** ve kritik sunucu işleri için **Vercel Functions** kullanır.

## Üretim mimarisi

```
Vercel (Vite SPA) ──anon key──▶ Supabase Postgres (RLS)
        │
        └── /api/paytr-init + /api/payment-webhook ──service role / RPC──▶ Supabase
```

## Kritik akışlar

| Akış | Uygulama |
|------|----------|
| Auth / şifre sıfırlama | Supabase Auth → `/sifre-sifirla` |
| Sipariş oluşturma | `orderService.createOrder` + `confirm_order_fulfillment` |
| Kart ödeme | `api/paytr-init.ts` → `paytr_prepare_payment` / webhook `paytr_handle_webhook` |
| Havale / COD onay | Admin `admin_confirm_offline_payment` |
| Misafir sipariş takip | `track_order_by_number_and_contact` |
| Referral | `ensure_referral_code` + `track_referral_signup` |
| Servis slotları | `service_slots` + `ensure_service_slots` / `book_service_slot` |
| Sepet senkron | `sync_user_cart` |
| Ürün görselleri | Storage `product-images` |

## Migration'lar

`supabase/migrations/` altında sıralı SQL dosyaları. Yeni değişiklikler için:

```bash
npx supabase migration new <isim>
npm run db:push
```

Son audit migration: `20260717000100_audit_completion_rpcs.sql`

## Bilinçli sınırlar / sonraki adımlar

- Edge Function stub'ları (`create-checkout-session`) production path değildir; deploy etmeyin.
- Kargo taşıyıcı API entegrasyonu henüz yok (manuel takip no).
- Bildirim kanalları (SMS/e-posta sağlayıcı) opsiyonel genişletme.
- Kampanya vitrini aktif kuponlar üzerinden beslenir; ayrı `campaigns` tablosu yok.

## Güvenlik

- RLS tüm public tablolarda açık olmalı.
- Service role ve PayTR secret'ları yalnızca sunucu ortamında.
- Guest order tracking RPC sınırlı alan döndürür; e-posta/telefon eşleşmesi zorunludur.
