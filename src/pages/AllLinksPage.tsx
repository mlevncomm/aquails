import { useState, useEffect, useMemo, type ElementType } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Filter, Gift, RefreshCw, Wrench, Truck, MessageCircle, Phone, Mail,
  Instagram, Globe, ShieldCheck, Award, CreditCard, Headphones, Copy, Check,
  ArrowRight, ShoppingBag, ExternalLink, Sparkles, Calculator, FlaskConical,
  Droplet, Zap, Coffee, Building2, Settings, ChevronRight,
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { useCatalog } from '@/hooks/useCatalog';
import { openWhatsApp, getWhatsAppUrl } from '@/services/whatsappService';
import { getNavLinks } from '@/services/settingsService';
import { cn } from '@/lib/utils';

const categoryIconMap: Record<string, ElementType> = {
  Droplet, Zap, Coffee, Building2, Filter, Settings, Wrench,
};

const FEATURED_SLUGS = [
  'aquails-eonaqua-pro-dijital-su-aritma-cihazi',
  'aquails-blue-drop-su-aritma-cihazi',
  'aquails-h2o-tesla-su-aritma-sistemi',
];

const primaryLinks = [
  { label: 'Ürünleri İncele', href: '/urunler', icon: ShoppingBag, featured: true },
  { label: 'WhatsApp Destek', href: '__whatsapp__', icon: MessageCircle, featured: true },
  { label: 'Ürün Seçim Sihirbazı', href: '/urun-secim-sihirbazi', icon: Sparkles },
  { label: 'Servis Randevusu', href: '/servis-randevusu', icon: Wrench },
  { label: 'Kampanyalar', href: '/kampanyalar', icon: Gift },
  { label: 'Filtre Aboneliği', href: '/filtre-aboneligi', icon: RefreshCw },
  { label: 'Sipariş Takip', href: '/siparis-takip', icon: Truck },
  { label: 'Filtre Hesaplayıcı', href: '/filtre-hesaplayici', icon: Calculator },
  { label: 'Su Kalitesi Testi', href: '/su-kalitesi-testi', icon: FlaskConical },
  { label: 'İletişim', href: '/iletisim', icon: Phone },
];

const trustItems = [
  { icon: Award, value: '10.000+', label: 'Mutlu Müşteri' },
  { icon: ShieldCheck, value: '2 Yıl', label: 'Garanti' },
  { icon: CreditCard, value: 'Güvenli', label: 'Ödeme' },
  { icon: Headphones, value: 'Yetkili', label: 'Servis' },
];

function LinkRow({
  label,
  href,
  icon: Icon,
  external,
  featured,
  delay = 0,
  onAction,
}: {
  label: string;
  href: string;
  icon: ElementType;
  external?: boolean;
  featured?: boolean;
  delay?: number;
  onAction?: () => void;
}) {
  const className = cn(
    'w-full flex items-center gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-all duration-200 group',
    featured
      ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-500/20 hover:shadow-xl hover:shadow-sky-500/25 hover:-translate-y-0.5'
      : 'bg-white/90 backdrop-blur-sm border border-white/80 hover:border-sky-200 shadow-sm hover:shadow-md hover:-translate-y-0.5',
  );

  const inner = (
    <>
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
          featured ? 'bg-white/20' : 'bg-sky-50 group-hover:bg-sky-600',
        )}
      >
        <Icon className={cn('w-[18px] h-[18px]', featured ? 'text-white' : 'text-sky-600 group-hover:text-white')} />
      </div>
      <span className={cn('text-sm font-semibold flex-1', featured ? 'text-white' : 'text-slate-800')}>{label}</span>
      {external ? (
        <ExternalLink className={cn('w-4 h-4 flex-shrink-0', featured ? 'text-white/70' : 'text-slate-300 group-hover:text-sky-500')} />
      ) : (
        <ChevronRight className={cn('w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5', featured ? 'text-white/70' : 'text-slate-300 group-hover:text-sky-500')} />
      )}
    </>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}>
      {onAction ? (
        <button type="button" onClick={onAction} className={className}>{inner}</button>
      ) : external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{inner}</a>
      ) : (
        <Link to={href} className={className}>{inner}</Link>
      )}
    </motion.div>
  );
}

export default function AllLinksPage() {
  const addToast = useToastStore((s) => s.add);
  const { products, categories, loading } = useCatalog();
  const [copied, setCopied] = useState(false);
  const [customLinks, setCustomLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    document.title = 'Aquails | Bağlantılar';
    window.scrollTo(0, 0);
    void getNavLinks().then((links) => {
      if (links.length) setCustomLinks(links.map((l) => ({ label: l.label, url: l.url })));
    });
  }, []);

  const featuredProducts = useMemo(() => {
    const picked = FEATURED_SLUGS.map((slug) => products.find((p) => p.slug === slug)).filter(Boolean);
    if (picked.length >= 2) return picked.slice(0, 3);
    return products.slice(0, 3);
  }, [products]);

  const displayLinks = useMemo(() => {
    if (customLinks.length) {
      return customLinks.map((l) => ({
        label: l.label,
        href: l.url,
        icon: l.url.startsWith('http') ? ExternalLink : ShoppingBag,
        external: l.url.startsWith('http'),
      }));
    }
    return primaryLinks.map((l) => ({
      ...l,
      external: l.href.startsWith('http'),
      href: l.href,
    }));
  }, [customLinks]);

  const handleCopyCoupon = () => {
    void navigator.clipboard?.writeText('AQUAILS10');
    setCopied(true);
    addToast('Kupon kodu kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <SEO
        title="Aquails | Bağlantılar"
        description="Aquails bağlantı sayfası — ürünler, servis, kampanyalar ve WhatsApp destek."
        noindex
      />

      <div className="min-h-[100dvh] bg-[#f0f7ff] relative overflow-x-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-sky-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-cyan-400/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #bae6fd 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-md mx-auto px-4 py-8 sm:py-12 pb-16">
          {/* Profile */}
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="relative w-[88px] h-[88px] mx-auto mb-4">
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-400 p-[3px] shadow-lg shadow-sky-500/20">
                <div className="w-full h-full bg-white rounded-[25px] flex items-center justify-center overflow-hidden">
                  <img src="/images/brand/aquails-icon.png" alt="Aquails" className="w-14 h-14 object-contain" />
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Aquails</h1>
            <p className="text-sm font-medium text-sky-600 mt-1">Daha Temiz Su, Daha Akıllı Teknoloji</p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[280px] mx-auto">
              Su arıtma cihazları, filtre aboneliği ve servis desteği — tek tıkla ulaşın.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {['Güvenli Alışveriş', 'Ücretsiz Kurulum Desteği', 'Filtre Hatırlatma'].map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1 bg-white/80 text-[10px] font-medium text-slate-500 px-2.5 py-1 rounded-full border border-sky-100 shadow-sm"
                >
                  <ShieldCheck className="w-3 h-3 text-sky-500" />
                  {label}
                </span>
              ))}
            </div>
          </motion.header>

          {/* WhatsApp hero CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08 }}
            className="mb-5"
          >
            <a
              href={getWhatsAppUrl('Merhaba, Aquails hakkında bilgi almak istiyorum.')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp ile Hemen Yazın
            </a>
          </motion.div>

          {/* Main links */}
          <div className="space-y-2.5 mb-8">
            {displayLinks.map((link, i) => {
              if (link.href === '__whatsapp__') return null;
              const isWa = link.label.toLowerCase().includes('whatsapp');
              return (
                <LinkRow
                  key={`${link.label}-${i}`}
                  label={link.label}
                  href={isWa ? getWhatsAppUrl() : link.href}
                  icon={link.icon}
                  external={link.external || isWa}
                  featured={'featured' in link && Boolean(link.featured)}
                  delay={0.1 + i * 0.04}
                  onAction={
                    isWa
                      ? () => openWhatsApp('Merhaba, destek almak istiyorum.')
                      : undefined
                  }
                />
              );
            })}
          </div>

          {/* Categories */}
          {!loading && categories.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-8"
            >
              <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mb-3 px-1">Kategoriler</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const Icon = categoryIconMap[cat.icon] ?? Droplet;
                  return (
                    <Link
                      key={cat.id}
                      to={`/urunler?kategori=${cat.id}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-sky-100 text-xs font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 shadow-sm transition-all"
                    >
                      <Icon className="w-3.5 h-3.5 text-sky-500" />
                      {cat.name}
                      <span className="text-slate-400 font-normal">({cat.productCount})</span>
                    </Link>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Featured products */}
          {featuredProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Öne Çıkanlar</p>
                <Link to="/urunler" className="text-[11px] font-medium text-sky-600 hover:underline flex items-center gap-0.5">
                  Tümü <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x scrollbar-hide">
                {featuredProducts.map((p) => (
                  <Link
                    key={p!.id}
                    to={`/urun/${p!.slug}`}
                    className="flex-shrink-0 w-[148px] snap-start bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="aspect-square bg-slate-50 overflow-hidden">
                      <img
                        src={p!.images[0] || '/images/products/placeholder.jpg'}
                        alt={p!.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] font-semibold text-slate-800 line-clamp-2 leading-snug min-h-[2.5rem]">{p!.name}</p>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-sm font-bold text-sky-600">{p!.price.toLocaleString('tr-TR')} ₺</span>
                        {p!.oldPrice != null && (
                          <span className="text-[10px] text-slate-400 line-through">{p!.oldPrice.toLocaleString('tr-TR')} ₺</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Coupon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 p-5 text-white shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-2xl" />
            <div className="relative">
              <p className="text-[10px] font-bold text-sky-300/80 tracking-[0.15em] uppercase">Instagram&apos;a Özel</p>
              <h2 className="text-xl font-bold mt-1">%10 İndirim</h2>
              <p className="text-xs text-slate-300 mt-1">AQUAILS10 kodu ile seçili ürünlerde geçerli.</p>
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                >
                  {copied ? <><Check className="w-3.5 h-3.5" /> Kopyalandı</> : <><Copy className="w-3.5 h-3.5" /> AQUAILS10</>}
                </button>
                <Link
                  to="/kampanyalar"
                  className="inline-flex items-center gap-1 bg-white text-slate-900 text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-sky-50 transition-colors"
                >
                  Kampanyalar <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Trust */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="grid grid-cols-4 gap-2 mb-8"
          >
            {trustItems.map((t) => (
              <div key={t.label} className="text-center p-2 rounded-xl bg-white/60 border border-white/80">
                <t.icon className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                <p className="text-[10px] font-bold text-slate-800">{t.value}</p>
                <p className="text-[9px] text-slate-400 leading-tight">{t.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Social footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {[
                { icon: Instagram, href: 'https://instagram.com/aquails', label: 'Instagram', external: true },
                { icon: MessageCircle, href: getWhatsAppUrl(), label: 'WhatsApp', external: true },
                { icon: Phone, href: 'tel:08501234567', label: 'Telefon', external: true },
                { icon: Mail, href: 'mailto:info@aquails.com.tr', label: 'E-posta', external: true },
                { icon: Globe, href: '/', label: 'Web Sitesi', external: false },
              ].map((s) =>
                s.external ? (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.label}
                    className="w-10 h-10 bg-white border border-sky-100 rounded-full flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <s.icon className="w-4 h-4 text-slate-400 hover:text-sky-600" />
                  </a>
                ) : (
                  <Link
                    key={s.label}
                    to={s.href}
                    title={s.label}
                    className="w-10 h-10 bg-white border border-sky-100 rounded-full flex items-center justify-center hover:border-sky-300 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <s.icon className="w-4 h-4 text-slate-400" />
                  </Link>
                ),
              )}
            </div>
            <Link to="/" className="text-xs font-medium text-sky-600 hover:underline">
              aquails.com.tr ana sayfa
            </Link>
            <p className="text-[10px] text-slate-400 mt-3">© 2026 Aquails. Tüm hakları saklıdır.</p>
          </motion.footer>
        </div>
      </div>
    </>
  );
}
