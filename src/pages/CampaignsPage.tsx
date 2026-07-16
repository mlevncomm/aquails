import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Copy, Check, Package, Truck, Wrench, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { getActiveCouponsForCustomer, type Coupon } from '@/services/couponService';
import { getProducts } from '@/services/productService';
import type { Product } from '@/types';

const IMAGES = [
  '/images/campaign-1.jpg',
  '/images/campaign-3.jpg',
  '/images/campaign-2.jpg',
  '/images/filter-subscription.jpg',
  '/images/hero-product.jpg',
];

function couponLabel(c: Coupon): string {
  if (c.type === 'percent') return `%${c.value}`;
  if (c.type === 'shipping') return 'Kargo';
  return `${c.value}₺`;
}

function couponDesc(c: Coupon): string {
  if (c.type === 'percent') return `Sepette geçerli %${c.value} indirim kuponu.`;
  if (c.type === 'shipping') return 'Ücretsiz kargo kuponu.';
  return `${c.value.toLocaleString('tr-TR')} ₺ sabit indirim kuponu.`;
}

export default function CampaignsPage() {
  const addToast = useToastStore((s) => s.add);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [kampanyaUrunleri, setKampanyaUrunleri] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([getActiveCouponsForCustomer(), getProducts()]).then(([couponList, products]) => {
      setCoupons(couponList);
      setKampanyaUrunleri(products.filter((p) => (p.discountPercent || 0) > 0).slice(0, 4));
      setLoading(false);
    });
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    addToast(`${code} kuponu kopyalandı!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <>
      <SEO
        title="Aquails Kampanyaları | Su Arıtma Fırsatları"
        description="Aquails kampanyaları ve indirim fırsatları. Su arıtma cihazlarında özel fiyatlar, ücretsiz kurulum ve kargo avantajları."
        canonical="/kampanyalar"
      />
      <PageLayout>
        <section className="relative bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-12 md:py-16 overflow-hidden">
          <div className="page-container relative">
            <div className="flex items-center gap-2 text-[13px] text-white/50 mb-3">
              <Link to="/" className="hover:text-white">Ana Sayfa</Link><span>/</span><span className="text-white/70">Kampanyalar</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Kampanyalar ve Fırsatlar</h1>
            <p className="text-sm text-white/70 mt-2 max-w-lg">Güncel indirimleri, kupon kodlarını ve özel fırsatları kaçırmayın.</p>
            <div className="flex flex-wrap gap-4 mt-6">
              {[
                { icon: Package, label: 'Aktif Kuponlar' },
                { icon: Truck, label: 'Ücretsiz Kargo' },
                { icon: Wrench, label: 'Ücretsiz Kurulum' },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-white/70 text-xs"><b.icon className="w-4 h-4" />{b.label}</div>
              ))}
            </div>
          </div>
        </section>

        <div className="page-container py-10">
          {loading ? (
            <div className="flex justify-center py-20 text-aq-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {coupons.length === 0 && (
                  <div className="col-span-full text-center py-12 text-sm text-aq-muted">
                    Şu an aktif kampanya kuponu bulunmuyor.
                  </div>
                )}
                {coupons.map((c, i) => (
                  <motion.div key={c.code} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="group relative rounded-2xl overflow-hidden h-[260px] border border-aq-border/60 bg-white">
                      <img src={IMAGES[i % IMAGES.length]} alt={c.code} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">{couponLabel(c)}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-lg font-semibold text-white leading-tight mb-1">{c.code}</h3>
                        <p className="text-sm text-white/70 mb-3 line-clamp-2">{couponDesc(c)}</p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => copyCode(c.code)}
                            className="inline-flex items-center gap-1.5 bg-white text-aq-deep text-xs font-semibold px-3 py-1.5 rounded-lg"
                          >
                            {copiedCode === c.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedCode === c.code ? 'Kopyalandı' : 'Kodu Kopyala'}
                          </button>
                          <Link to="/urunler" className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white">
                            Alışverişe Git <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {kampanyaUrunleri.length > 0 && (
                <ScrollReveal>
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-semibold text-aq-text flex items-center gap-2">
                      <Tag className="w-5 h-5 text-aq-blue" /> İndirimli Ürünler
                    </h2>
                    <Link to="/urunler" className="text-sm text-aq-blue hover:underline font-medium">Tümünü Gör</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {kampanyaUrunleri.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </>
          )}
        </div>
      </PageLayout>
    </>
  );
}
