import { Link, useNavigate } from 'react-router';
import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Play, Droplets, ShieldCheck, Wrench, BellRing,
  Layers, VolumeX, Gauge, PackageCheck, Truck, RotateCcw, Lock, Star, Plus,
  Home as HomeIcon, Briefcase, UtensilsCrossed, Building2, CircleCheck,
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { getOrganizationSchema, getWebsiteSchema } from '@/components/SchemaOrg';
import { ProductPrice } from '@/components/ProductPrice';
import { QuantitySelector } from '@/components/QuantitySelector';
import { RatingStars } from '@/components/RatingStars';
import { useToastStore } from '@/components/Toast';
import { useCatalog } from '@/hooks/useCatalog';
import { useCartStore } from '@/stores/cartStore';
import { testimonials, faqItems } from '@/data/testimonials';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

const heroFeatures = [
  { icon: Droplets, label: '7 Aşamalı\nFiltrasyon' },
  { icon: ShieldCheck, label: '5 Yıl\nGaranti' },
  { icon: Wrench, label: 'Ücretsiz\nKurulum' },
  { icon: BellRing, label: 'Filtre\nHatırlatma' },
];

const trustedStats = [
  { value: '10.000+', label: 'Mutlu Müşteri' },
  { value: '500+', label: 'Servis Noktası' },
  { value: '17 Yıl', label: 'Deneyim' },
  { value: '%99', label: 'Memnuniyet' },
];

const specIcons = [
  { icon: Layers, label: '7 Aşamalı', sub: 'Filtrasyon' },
  { icon: VolumeX, label: 'Sessiz', sub: '35 dB altı' },
  { icon: Gauge, label: 'TDS', sub: 'Göstergeli' },
  { icon: PackageCheck, label: '10+ Yıl', sub: 'Yedek Parça' },
];

const premiumFeatures = [
  { image: '/images/products/filtreler.jpg', title: 'Çok Aşamalı Filtre', desc: 'Sediment, karbon, membran.' },
  { image: '/images/products/musluklar.jpg', title: 'Paslanmaz Musluk', desc: '304 çelik gövde.' },
  { image: '/images/products/membran-filtreler.jpg', title: 'RO Membran', desc: 'Yüksek arıtma oranı.' },
  { image: '/images/products/sebiller.jpg', title: 'Sebil Seçenekleri', desc: 'Ofis ve ev için.' },
];

/** Systems shown in "Size Uygun Sistemi Seçin": clean renders, each tied to its category's best seller. */
const systemTiles = [
  { slug: 'klasik-ro-sistemleri', label: 'Klasik RO', image: '/images/products/su-aritma-cihazlari.jpg' },
  { slug: 'direkt-akis-ro', label: 'Direkt Akış', image: '/images/products/direkt-akis-su-aritma.jpg' },
  { slug: 'soft-kompakt', label: 'Kompakt', image: '/images/products/dijital-su-aritma.jpg' },
  { slug: 'sebiller', label: 'Sebil', image: '/images/products/sebiller.jpg' },
  { slug: 'bina-giris-filtrasyon', label: 'Bina Girişi', image: '/images/products/bina-girisi-filtrasyon.jpg' },
];

const useCases = [
  { icon: HomeIcon, label: 'Ev', to: '/kategori/klasik-ro-sistemleri' },
  { icon: Briefcase, label: 'Ofis', to: '/kategori/sebiller' },
  { icon: UtensilsCrossed, label: 'İşletme', to: '/kategori/direkt-akis-ro' },
  { icon: Building2, label: 'Bina', to: '/kategori/bina-giris-filtrasyon' },
];

function rankByPopularity(list: Product[]): Product[] {
  return [...list].sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount));
}

/** Small uppercase eyebrow above section titles (gray on light, sky on dark — as in the reference). */
function Eyebrow({ children, tone = 'dark', className }: { children: React.ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  return (
    <p
      className={cn(
        'text-[11px] font-semibold uppercase tracking-[0.18em]',
        tone === 'dark' ? 'text-aq-muted' : 'text-aq-mist',
        className,
      )}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children, className, light }: { children: React.ReactNode; className?: string; light?: boolean }) {
  return (
    <h2 className={cn('text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[2.1rem] lg:text-[2.35rem]', light ? 'text-white' : 'text-aq-ink', className)}>
      {children}
    </h2>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-aq-ink">
      <img
        src="/images/lifestyle/hero-lake.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
        fetchPriority="high"
      />
      {/* Legibility veil: deep on the left where the copy sits, clear on the right */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,30,52,0.86)_0%,rgba(8,30,52,0.62)_38%,rgba(8,30,52,0.12)_70%,rgba(8,30,52,0.05)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-aq-ink/80 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-aq-ink/50 to-transparent" />

      <div className="page-container flex min-h-[640px] flex-col pt-[132px] pb-8 sm:min-h-[720px] lg:min-h-[min(860px,100svh)] lg:pt-[160px]">
        <div className="relative flex-1">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-[560px]"
          >
            <Eyebrow tone="light">Sağlıklı yaşam için saf su</Eyebrow>
            <h1 className="mt-4 text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl lg:text-[4.6rem]">
              Doğanın <span className="text-aq-mist">Saflığı</span>
              <br />
              Musluğunuzda
            </h1>
            <p className="mt-5 max-w-[440px] text-[15px] leading-relaxed text-white/80 sm:text-base">
              Aquails su arıtma sistemleri, dağ kaynağı kadar berrak suyu evinize ve işletmenize getirir. Her yudumda güven, her gün sağlık.
            </p>

            <ul className="mt-8 grid max-w-[480px] grid-cols-4 divide-x divide-white/15">
              {heroFeatures.map(({ icon: Icon, label }) => (
                <li key={label} className="flex flex-col items-center gap-2 px-1 text-center first:pl-0">
                  <Icon className="h-6 w-6 text-white" strokeWidth={1.6} />
                  <span className="whitespace-pre-line text-[11px] font-medium leading-tight text-white/85 sm:text-xs">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/urunler"
                className="group inline-flex items-center gap-2 rounded-full bg-aq-mist px-7 py-3.5 text-sm font-semibold text-aq-ink shadow-[0_12px_30px_-12px_rgba(159,216,255,0.8)] transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Ürünleri İncele
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#nasil-calisir"
                className="group inline-flex items-center gap-3 text-sm font-medium text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/50 transition-colors group-hover:border-white group-hover:bg-white/10">
                  <Play className="ml-0.5 h-4 w-4 fill-white" />
                </span>
                Nasıl Çalışır?
              </a>
            </div>
          </motion.div>

          {/* Handwritten accent */}
          <motion.div
            initial={{ opacity: 0, rotate: -12 }}
            animate={{ opacity: 1, rotate: -8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pointer-events-none absolute right-0 top-2 hidden select-none text-right lg:block"
            aria-hidden
          >
            <p className="font-script text-[2.6rem] leading-[0.95] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.25)]">
              Sudan Çok
              <br />
              Daha Fazlası
            </p>
            <svg viewBox="0 0 140 18" className="ml-auto mt-1 h-4 w-32 text-white" fill="none">
              <path d="M2 12C30 4 70 2 138 8M60 16c20-3 45-4 70-2" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </motion.div>
        </div>

        {/* Trusted-by strip */}
        <div className="mt-12 border-t border-white/15 pt-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">Rakamlarla Aquails</p>
          <dl className="mt-3 grid grid-cols-2 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-12">
            {trustedStats.map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <dt className="text-lg font-bold text-white tabular-nums">{s.value}</dt>
                <dd className="text-xs text-white/65">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------------------------------------------ */
/* 2. Designed for real life                                           */
/* ------------------------------------------------------------------ */

function DesignedForLife() {
  return (
    <section id="nasil-calisir" className="scroll-mt-20 bg-[#F4F8FB] py-20 lg:py-24">
      <div className="page-container grid items-center gap-12 lg:grid-cols-[1fr_1.1fr_1fr] lg:gap-10">
        <ScrollReveal>
          <Eyebrow>Aquails su arıtma</Eyebrow>
          <SectionTitle className="mt-3">
            Gerçek Hayat
            <br />
            İçin Tasarlandı
          </SectionTitle>
          <p className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-aq-muted">
            Mutfakta, ofiste ya da işletmenizde; Aquails sessizce çalışır, az yer kaplar ve her gün aynı kalitede su verir.
          </p>
          <ul className="mt-10 grid max-w-[360px] grid-cols-4 gap-2">
            {specIcons.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex flex-col items-center gap-2.5 text-center">
                <Icon className="h-6 w-6 text-aq-ink" strokeWidth={1.4} />
                <span className="text-[11px] font-medium leading-tight text-aq-ink">
                  {label}
                  <span className="block text-aq-muted">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <img
            src="/images/products/su-aritma-cihazlari.jpg"
            alt="Aquails tezgah altı su arıtma cihazı ve musluğu"
            className="mx-auto aspect-square sm:aspect-[4/5] w-full max-w-[420px] rounded-2xl object-cover object-[45%_center] shadow-soft-lg"
            loading="lazy"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h3 className="mb-4 text-[15px] font-semibold text-aq-ink">Öne Çıkan Özellikler</h3>
          <div className="grid grid-cols-2 gap-3">
            {premiumFeatures.map((f) => (
              <div key={f.title} className="overflow-hidden rounded-xl bg-white shadow-soft">
                <div className="aspect-[4/3] overflow-hidden bg-white">
                  <img src={f.image} alt="" className="h-full w-full object-cover mix-blend-multiply" loading="lazy" />
                </div>
                <div className="px-3 pb-3 pt-2">
                  <p className="text-[12px] font-semibold text-aq-ink">{f.title}</p>
                  <p className="mt-0.5 text-[11px] text-aq-muted">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Choose your system                                               */
/* ------------------------------------------------------------------ */

interface SystemOption {
  slug: string;
  label: string;
  image: string;
  product: Product;
}

function ChooseYourSystem({ options }: { options: SystemOption[] }) {
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCartStore();
  const addToast = useToastStore((s) => s.add);

  if (options.length === 0) return null;
  const current = options[Math.min(selected, options.length - 1)];
  const p = current.product;
  const inStock = p.stock > 0;

  const addToCart = () => {
    addItem(p, quantity);
    addToast(`${p.name} sepete eklendi.`, 'success');
    openDrawer();
  };

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="page-container grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:items-start lg:gap-14">
        <div className="min-w-0">
          <ScrollReveal>
            <h2 className="text-[1.6rem] font-bold tracking-[-0.02em] text-aq-ink sm:text-[1.9rem]">Size Uygun Sistemi Seçin</h2>
            <p className="mt-2 text-sm text-aq-muted">Aynı güvenilir arıtma kalitesi. İhtiyacınıza göre farklı çözümler.</p>
          </ScrollReveal>

          <div className="responsive-scroll-x mt-10">
            <div className="flex min-w-max gap-6 pb-2 sm:grid sm:min-w-0 sm:grid-cols-5 sm:gap-4">
              {options.map((o, i) => {
                const active = i === selected;
                return (
                  <button
                    key={o.slug}
                    type="button"
                    onClick={() => { setSelected(i); setQuantity(1); }}
                    aria-pressed={active}
                    className="group flex w-[120px] flex-col items-center text-center sm:w-auto"
                  >
                    <div className={cn('aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F3F6F9] ring-1 transition-all', active ? 'ring-aq-blue/50 shadow-soft' : 'ring-transparent group-hover:shadow-soft')}>
                      <img src={o.image} alt={o.label} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.04]" loading="lazy" />
                    </div>
                    <span className={cn('mt-3 text-[13px] font-semibold', active ? 'text-aq-blue' : 'text-aq-ink/55')}>{o.label}</span>
                    <ProductPrice product={o.product} size="sm" className="mt-0.5 [&_span:first-child]:text-[12px] [&_span:first-child]:font-medium [&_span:first-child]:text-aq-muted [&_span:last-child:not(:first-child)]:hidden" />
                    <span className={cn('mt-2 h-1.5 w-1.5 rounded-full', active ? 'bg-aq-blue' : 'bg-transparent')} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <ScrollReveal delay={0.1}>
          <div className="rounded-xl bg-white p-6 shadow-soft sm:p-7 shadow-soft">
            {selected === 0 && (
              <span className="mb-3 inline-flex rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white">En Popüler</span>
            )}
            <h3 className="text-xl font-bold leading-snug text-aq-ink">{p.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={p.rating} size="sm" />
              <span className="text-[12px] text-aq-muted">{p.rating.toFixed(1)}/5 ({p.reviewCount} değerlendirme)</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <ProductPrice product={p} size="lg" className="[&_span:first-child]:text-[1.75rem] [&_span:first-child]:text-aq-ink" />
              {p.discountPercent ? (
                <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white">%{p.discountPercent} İNDİRİM</span>
              ) : null}
            </div>
            <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-aq-muted">{p.shortDescription || p.description}</p>
            <div className="mt-5 flex items-center justify-between gap-3">
              <QuantitySelector
                quantity={quantity}
                onIncrease={() => setQuantity((q) => Math.min(q + 1, Math.max(p.stock, 1)))}
                onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                size="sm"
              />
              <Link to={`/urun/${p.slug}`} className="text-[12px] font-semibold text-aq-ink underline-offset-4 hover:underline">Ürün detayı</Link>
            </div>
            <button
              type="button"
              onClick={addToCart}
              disabled={!inStock}
              className="mt-5 w-full rounded-full bg-aq-ink py-3.5 text-sm font-semibold text-white transition-colors hover:bg-aq-ink-soft disabled:cursor-not-allowed disabled:bg-aq-muted/40"
            >
              {inStock ? 'Sepete Ekle' : 'Tükendi'}
            </button>
            <ul className="mt-5 grid grid-cols-3 gap-2 border-t border-aq-border/70 pt-4">
              {[
                { icon: Truck, title: 'Ücretsiz Kargo', sub: 'Uygun siparişlerde' },
                { icon: RotateCcw, title: '14 Gün İade', sub: 'Koşulsuz' },
                { icon: Lock, title: 'Güvenli Ödeme', sub: '256-bit SSL' },
              ].map(({ icon: Icon, title, sub }) => (
                <li key={title} className="min-w-0">
                  <p className="flex items-center gap-1.5 text-[11px] font-semibold text-aq-ink">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.8} />
                    <span className="leading-tight">{title}</span>
                  </p>
                  <p className="mt-0.5 text-[10px] text-aq-muted">{sub}</p>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Lifestyle                                                        */
/* ------------------------------------------------------------------ */

function Lifestyle() {
  return (
    <section className="grid bg-[#F4F8FB] lg:grid-cols-2">
      <div className="relative min-h-[320px] overflow-hidden sm:min-h-[440px]">
        <img src="/images/lifestyle/drinking-water.jpg" alt="Bir bardak arıtılmış su içen kadın" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex items-center px-5 py-16 sm:px-12 lg:px-16 xl:px-24">
        <ScrollReveal className="max-w-[440px]">
          <Eyebrow>Her anınızda yanınızda</Eyebrow>
          <SectionTitle className="mt-3">Temiz Su, Hayatın Her Anında</SectionTitle>
          <p className="mt-4 text-[15px] leading-relaxed text-aq-muted">
            Sabah kahvesinden ofis sebiline, restoran mutfağından apartman girişine kadar Aquails güvenilir su ortağınızdır.
          </p>
          <Link to="/urunler" className="group mt-7 inline-flex items-center gap-2 rounded-full bg-aq-ink px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-aq-ink-soft">
            Keşfedin <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <ul className="mt-10 grid grid-cols-4 gap-4">
            {useCases.map(({ icon: Icon, label, to }) => (
              <li key={label}>
                <Link to={to} className="group flex flex-col items-center gap-2">
                  <Icon className="h-6 w-6 text-aq-ink transition-colors group-hover:text-aq-ink" strokeWidth={1.4} />
                  <span className="text-[12px] font-medium text-aq-ink">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Testimonials                                                     */
/* ------------------------------------------------------------------ */

function Testimonials({ products }: { products: Product[] }) {
  const { avg, total } = useMemo(() => {
    const rated = products.filter((p) => p.reviewCount > 0);
    const reviews = rated.reduce((sum, p) => sum + p.reviewCount, 0);
    const weighted = rated.reduce((sum, p) => sum + p.rating * p.reviewCount, 0);
    return { avg: reviews > 0 ? weighted / reviews : 0, total: reviews };
  }, [products]);

  return (
    <section className="relative isolate overflow-hidden bg-aq-ink py-20 lg:py-24">
      <img src="/images/lifestyle/dusk-lake.jpg" alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,37,64,0.92),rgba(11,37,64,0.82))]" />
      <div className="page-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Gerçek insanlar, gerçek deneyimler</p>
            <SectionTitle light className="mt-3">Binlerce Ailenin Tercihi</SectionTitle>
          </ScrollReveal>
          {avg > 0 && (
            <div className="sm:text-right">
              <p className="flex items-center gap-2 sm:justify-end">
                <span className="flex gap-0.5" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                </span>
                <span className="text-lg font-bold text-white">{avg.toFixed(1)}/5</span>
              </p>
              <p className="mt-1 text-[12px] text-white/60">{total.toLocaleString('tr-TR')} ürün değerlendirmesi</p>
            </div>
          )}
        </div>

        <div className={cn('mt-10 grid gap-4 sm:grid-cols-2', testimonials.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {testimonials.slice(0, 4).map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.06}>
              <figure className="flex h-full flex-col rounded-xl bg-white p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-aq-cloud text-sm font-bold text-aq-ink">{t.name.charAt(0)}</span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-aq-ink">{t.name}</p>
                    <RatingStars rating={t.rating} size="sm" />
                  </div>
                </div>
                <blockquote className="mt-4 flex-1 text-[13px] leading-relaxed text-aq-muted">“{t.content}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-aq-ink/70">
                  <CircleCheck className="h-3.5 w-3.5 text-emerald-600" />
                  {t.product}
                </figcaption>
              </figure>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Story + free discovery                                           */
/* ------------------------------------------------------------------ */

function StoryAndOffer() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/servis-randevusu', { state: { phone: phone.trim() } });
  };

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="page-container grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <ScrollReveal className="relative min-h-[300px] overflow-hidden rounded-xl sm:min-h-[340px]">
          <img src="/images/lifestyle/story-lake.jpg" alt="Turkuaz bir dağ gölü" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-l from-black/35 via-black/5 to-transparent" />
          <div className="absolute inset-y-0 right-6 flex flex-col items-end justify-center text-right sm:right-10">
            <p className="font-script text-[2.4rem] leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] sm:text-5xl">
              Saf Su,
              <br />
              Sağlıklı Yarınlar
            </p>
            <Link to="/hakkimizda" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[12px] font-semibold text-aq-ink transition-colors hover:bg-aq-cloud">
              <Play className="h-3 w-3 fill-aq-ink" /> Hikayemizi Okuyun
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="flex flex-col justify-center rounded-xl bg-[#EEF4FA] p-7 sm:p-10">
          <Eyebrow>Ücretsiz keşif</Eyebrow>
          <h2 className="mt-3 text-[1.6rem] font-bold leading-[1.2] tracking-[-0.02em] text-aq-ink sm:text-[1.9rem]">
            Suyunuzu Ücretsiz
            <br />
            Analiz Edelim
          </h2>
          <p className="mt-3 text-[13px] leading-relaxed text-aq-muted">
            Uzman ekibimiz evinizdeki suyu ölçsün, size en uygun sistemi önersin.
          </p>
          <form onSubmit={submit} className="mt-6 flex gap-2">
            <input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefon numaranız"
              aria-label="Telefon numaranız"
              className="min-w-0 flex-1 rounded-full bg-white px-5 py-3 text-[13px] text-aq-ink placeholder:text-aq-muted focus:outline-none focus:ring-2 focus:ring-aq-ink/15"
            />
            <button type="submit" className="flex-shrink-0 rounded-full bg-aq-ink px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-aq-ink-soft sm:px-6">
              Randevu Al
            </button>
          </form>
          <p className="mt-3 text-[11px] text-aq-muted">Ücret ve satın alma zorunluluğu yok.</p>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. FAQ                                                              */
/* ------------------------------------------------------------------ */

function FAQ() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="bg-white pb-24">
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <ScrollReveal>
          <h2 className="text-[1.6rem] font-bold tracking-[-0.02em] text-aq-ink sm:text-[1.9rem]">Sıkça Sorulan Sorular</h2>
          <p className="mt-2 text-sm text-aq-muted">Aquails hakkında bilmeniz gereken her şey.</p>
          <Link to="/sss" className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-aq-ink underline-offset-4 hover:underline">
            Tüm sorular <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <ul className="space-y-2.5">
            {faqItems.slice(0, 5).map((f) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id} className="rounded-lg border border-aq-border">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-[13px] font-semibold text-aq-ink"
                  >
                    {f.question}
                    <Plus className={cn('h-4 w-4 flex-shrink-0 transition-transform', isOpen && 'rotate-45')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-[13px] leading-relaxed text-aq-muted">{f.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function Home() {
  const { products } = useCatalog();

  const systems = useMemo<SystemOption[]>(() => {
    const ranked = rankByPopularity(products);
    return systemTiles.flatMap((tile) => {
      const product = ranked.find((p) => p.categorySlug === tile.slug);
      return product ? [{ ...tile, product }] : [];
    });
  }, [products]);

  return (
    <>
      <SEO
        title="Aquails | Yeni Nesil Su Arıtma Teknolojisi"
        description="Aquails, eviniz ve işletmeniz için sağlıklı, güvenilir ve ölçülebilir su kalitesi sunar. Su arıtma cihazları, filtre setleri ve servis çözümleri."
        canonical="/"
        schema={[getOrganizationSchema(), getWebsiteSchema()]}
      />
      <PageLayout>
        <Hero />
        <DesignedForLife />
        <ChooseYourSystem options={systems} />
        <Lifestyle />
        <Testimonials products={products} />
        <StoryAndOffer />
        <FAQ />
      </PageLayout>
    </>
  );
}
