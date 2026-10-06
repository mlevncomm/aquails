import { Link } from 'react-router';
import { ArrowRight, Copy, Check, Loader2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { getActiveCouponsForCustomer, type Coupon } from '@/services/couponService';
import { getLiveCampaigns, type Campaign } from '@/services/campaignService';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';

const FALLBACK_IMAGES = ['/images/lifestyle/story-lake.jpg', '/images/lifestyle/pour-glass.jpg', '/images/filter-subscription.jpg'];

function couponLabel(c: Coupon): string {
  if (c.type === 'percent') return `%${c.value} indirim`;
  if (c.type === 'shipping') return 'Ücretsiz kargo';
  return `${c.value.toLocaleString('tr-TR')} ₺ indirim`;
}

export default function CampaignsPage() {
  const addToast = useToastStore((s) => s.add);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [discounted, setDiscounted] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([getLiveCampaigns(), getActiveCouponsForCustomer(), getProducts()]).then(([campaignList, couponList, products]) => {
      setCampaigns(campaignList);
      // Point-redemption coupons are personal one-offs; never advertise them publicly.
      setCoupons(couponList.filter((c) => !/^PUAN/i.test(c.code)));
      setDiscounted(products.filter((p) => (p.discountPercent || 0) > 0).slice(0, 4));
      setLoading(false);
    });
  }, []);

  const copyCode = (code: string) => {
    void navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    addToast(`${code} kuponu kopyalandı!`, 'success');
    window.setTimeout(() => setCopiedCode(null), 2000);
  };

  const nothing = campaigns.length === 0 && coupons.length === 0 && discounted.length === 0;

  return (
    <>
      <SEO
        title="Aquails Kampanyaları | Su Arıtma Fırsatları"
        description="Aquails kampanyaları ve indirim fırsatları. Su arıtma cihazlarında özel fiyatlar, kupon kodları ve kampanyalı ürünler."
        canonical="/kampanyalar"
      />
      <PageLayout>
        <PageHero
          eyebrow="Fırsatlar"
          title="Kampanyalar ve Fırsatlar"
          description="Güncel kampanyaları, kupon kodlarını ve indirimli ürünleri tek yerde görün."
          breadcrumbs={[{ label: 'Kampanyalar' }]}
        />

        <div className="page-container py-12 lg:py-16">
          {loading ? (
            <div className="flex justify-center py-20 text-aq-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : nothing ? (
            <div className="rounded-xl bg-aq-cloud px-6 py-16 text-center">
              <p className="text-lg font-semibold text-aq-ink">Şu an aktif bir kampanya bulunmuyor</p>
              <p className="mt-2 text-sm text-aq-muted">Yeni fırsatlar için yakında tekrar göz atın.</p>
              <Link to="/urunler" className="mt-6 inline-flex items-center gap-2 rounded-full bg-aq-ink px-6 py-3 text-sm font-semibold text-white hover:bg-aq-ink-soft">
                Ürünleri İncele <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {campaigns.length > 0 && (
                <section>
                  <h2 className="text-[1.6rem] font-bold tracking-[-0.02em] text-aq-ink">Güncel Kampanyalar</h2>
                  <div className="mt-7 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {campaigns.map((c, i) => (
                      <ScrollReveal key={c.id} delay={i * 0.05}>
                        <Link to={`/kampanya/${c.slug}`} className="group block">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-aq-cloud">
                            <img
                              src={c.imageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                              alt={c.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                            {c.discountLabel && (
                              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold text-aq-ink shadow-soft">{c.discountLabel}</span>
                            )}
                          </div>
                          <h3 className="mt-4 text-[17px] font-semibold leading-snug text-aq-ink group-hover:text-aq-blue">{c.title}</h3>
                          {c.description && <p className="mt-1.5 line-clamp-2 text-sm text-aq-muted">{c.description}</p>}
                          <p className="mt-3 flex items-center gap-1.5 text-xs text-aq-muted">
                            <Clock className="h-3.5 w-3.5" /> {c.endLabel === 'Süresiz' ? 'Süresiz' : `${c.endLabel} tarihine kadar`}
                          </p>
                        </Link>
                      </ScrollReveal>
                    ))}
                  </div>
                </section>
              )}

              {coupons.length > 0 && (
                <section>
                  <h2 className="text-[1.6rem] font-bold tracking-[-0.02em] text-aq-ink">Kupon Kodları</h2>
                  <p className="mt-2 text-sm text-aq-muted">Kodu kopyalayın, sepette "Kupon Kodu" alanına yapıştırın.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {coupons.map((c) => (
                      <div key={c.code} className="flex items-center justify-between gap-3 rounded-xl bg-[#EEF4FA] px-5 py-4">
                        <div className="min-w-0">
                          <p className="font-mono text-lg font-bold tracking-wider text-aq-ink">{c.code}</p>
                          <p className="text-[13px] text-aq-muted">
                            {couponLabel(c)}{c.minOrder ? ` · ${c.minOrder.toLocaleString('tr-TR')} ₺ üzeri` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyCode(c.code)}
                          className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-aq-ink px-4 py-2 text-xs font-semibold text-white hover:bg-aq-ink-soft"
                        >
                          {copiedCode === c.code ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                          {copiedCode === c.code ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {discounted.length > 0 && (
                <section>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="text-[1.6rem] font-bold tracking-[-0.02em] text-aq-ink">İndirimli Ürünler</h2>
                    <Link to="/urunler" className="text-sm font-semibold text-aq-ink underline-offset-4 hover:underline">Tümünü Gör</Link>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4">
                    {discounted.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
