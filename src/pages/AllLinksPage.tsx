import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Filter, Gift, RefreshCw, Wrench, Truck,
  MessageCircle, Phone, Mail, Instagram, Globe, ShieldCheck,
  Award, CreditCard, Headphones, Copy, Check, ArrowRight,
  ShoppingBag, ExternalLink, Sparkles, Calculator, FlaskConical, MapPin, Droplet
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { getNavLinks, type NavLinkItem } from '@/services/settingsService';


const linkGroups = [
  {
    title: 'Hızlı Bağlantılar',
    links: [
      { label: 'WhatsApp Destek', href: 'https://wa.me/905321234567', icon: MessageCircle, external: true },
      { label: 'Ürünleri İncele', href: '/urunler', icon: ShoppingBag, external: false },
      { label: 'Ürün Seçim Sihirbazı', href: '/urun-secim-sihirbazi', icon: Sparkles, external: false },
      { label: 'Kampanyalar', href: '/kampanyalar', icon: Gift, external: false },
      { label: 'Servis Randevusu', href: '/servis-randevusu', icon: Wrench, external: false },
      { label: 'Filtre Hesaplayıcı', href: '/filtre-hesaplayici', icon: Calculator, external: false },
    ],
  },
  {
    title: 'Diğer',
    links: [
      { label: 'Su Arıtma Cihazları', href: '/urunler?kategori=su-aritma', icon: Filter, external: false },
      { label: 'Su Kalitesi Testi', href: '/su-kalitesi-testi', icon: FlaskConical, external: false },
      { label: 'Filtre Seçim Rehberi', href: '/filtre-secim-rehberi', icon: Filter, external: false },
      { label: 'Servis Ağımız', href: '/servis-agimiz', icon: MapPin, external: false },
      { label: 'Sipariş Takip', href: '/siparis-takip', icon: Truck, external: false },
      { label: 'İletişim', href: '/iletisim', icon: Phone, external: false },
      { label: 'Instagram', href: 'https://instagram.com/aquails', icon: Instagram, external: true },
    ],
  },
];

const badges = [
  { icon: ShieldCheck, label: 'Güvenli Alışveriş' },
  { icon: Headphones, label: 'Kurulum Desteği' },
  { icon: RefreshCw, label: 'Filtre Hatırlama' },
];

const trustItems = [
  { icon: Award, value: '10.000+', label: 'Mutlu Müşteri' },
  { icon: ShieldCheck, value: '2 Yıl', label: 'Garanti' },
  { icon: CreditCard, value: 'Güvenli', label: 'Ödeme' },
  { icon: Headphones, value: 'Yetkili', label: 'Servis Desteği' },
];

const featuredProducts = [
  {
    name: 'Aquails EONAQUA PRO DİJİTAL SU ARITMA CİHAZI',
    price: 85900,
    oldPrice: 69950,
    image: '/images/products/su-aritma-cihazlari.jpg',
    href: '/urunler?kategori=su-aritma',
  },
  {
    name: 'Aquails BLUEDROP DİREK AKIŞ SU ARITMA CİHAZI',
    price: 95900,
    oldPrice: null,
    image: '/images/products/direkt-akis-su-aritma.jpg',
    href: '/urunler?kategori=su-aritma',
  },
  {
    name: 'Aquails EONAQUA DİJİTAL SU ARITMA CİHAZI',
    price: 65900,
    oldPrice: null,
    image: '/images/products/dijital-su-aritma.jpg',
    href: '/urunler?kategori=su-aritma',
  },
];

const iconMap: Record<string, React.ElementType> = {
  ShoppingBag, Filter, Gift, RefreshCw, Wrench, Truck, MessageCircle, Phone, Instagram, ExternalLink, Sparkles, Calculator, FlaskConical, MapPin, Droplet,
};

function buildLinkGroups(links: NavLinkItem[]) {
  if (!links.length) return linkGroups;
  return [{
    title: 'Bağlantılar',
    links: [...links].sort((a, b) => a.order - b.order).map((l) => ({
      label: l.title,
      href: l.url,
      icon: iconMap[l.icon] ?? ExternalLink,
      external: l.url.startsWith('http'),
    })),
  }];
}

export default function AllLinksPage() {
  const addToast = useToastStore(s => s.add);
  const [copied, setCopied] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([]);

  useEffect(() => {
    document.title = 'Aquails | Tüm Bağlantılar';
    window.scrollTo(0, 0);
    void getNavLinks().then((links) => setNavLinks(links.filter((l) => l.active)));
  }, []);

  const handleCopyCoupon = () => {
    navigator.clipboard?.writeText('AQUAILS10');
    setCopied(true);
    addToast('Kupon kodu kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExternalLink = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <SEO
        title="Aquails | Tüm Bağlantılar"
        description="Aquails tüm bağlantılar. Ürünler, servis, kampanyalar ve daha fazlası."
        noindex
      />
    <div className="min-h-screen bg-gradient-to-br from-[#EBF4FF] via-[#F5FAFF] to-[#E0F0FF] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#1A73E8]/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-[-5%] left-[-10%] w-[350px] h-[350px] bg-[#4FC3F7]/[0.05] rounded-full blur-3xl" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[480px] mx-auto px-5 py-10 min-h-screen flex flex-col">
        {/* Brand Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-3xl shadow-lg mx-auto mb-4 flex items-center justify-center border border-[#E8F0FE] overflow-hidden">
            <img src="/images/brand/aquails-icon.png" alt="Aquails" className="w-14 h-14 object-contain" />
          </div>
          <h1 className="text-xl font-bold text-[#0D2137]">aquails</h1>
          <p className="text-sm font-semibold text-[#1A73E8] mt-1">
            Daha Temiz Su, Daha Akıllı Teknoloji
          </p>
          <p className="text-xs text-[#5A6B7B] mt-2 leading-relaxed max-w-xs mx-auto">
            Su arıtma cihazları, filtre aboneliği, servis randevusu ve kampanyalarımıza tek yerden ulaşın.
          </p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {badges.map(b => (
              <span key={b.label} className="inline-flex items-center gap-1 bg-white/70 backdrop-blur-sm text-[11px] font-medium text-[#5A6B7B] px-2.5 py-1 rounded-full border border-[#E8F0FE]">
                <b.icon className="w-3 h-3 text-[#1A73E8]" />{b.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main Links - Grouped */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-6 flex-1"
        >
          {buildLinkGroups(navLinks).map((group, gi) => (
            <div key={group.title}>
              <p className="text-[10px] font-semibold text-[#8B9DAF] tracking-[0.15em] uppercase mb-2 px-1">{group.title}</p>
              <div className="space-y-2">
                {group.links.map((link, i) => {
                  const Icon = link.icon;
                  const delay = 0.15 + gi * 0.05 + i * 0.03;
                  if (link.external) {
                    return (
                      <motion.button
                        key={link.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay }}
                        onClick={() => handleExternalLink(link.href)}
                        className="w-full flex items-center gap-3.5 bg-white hover:bg-[#F8FBFF] border border-[#E8F0FE] hover:border-[#1A73E8]/30 rounded-2xl px-5 py-3.5 text-left transition-all duration-200 group shadow-sm hover:shadow-md"
                      >
                        <div className="w-9 h-9 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A73E8] transition-colors">
                          <Icon className="w-[18px] h-[18px] text-[#1A73E8] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-[#0D2137] flex-1">{link.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-[#8B9DAF] group-hover:text-[#1A73E8]" />
                      </motion.button>
                    );
                  }
                  return (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay }}
                    >
                      <Link
                        to={link.href}
                        className="w-full flex items-center gap-3.5 bg-white hover:bg-[#F8FBFF] border border-[#E8F0FE] hover:border-[#1A73E8]/30 rounded-2xl px-5 py-3.5 text-left transition-all duration-200 group shadow-sm hover:shadow-md"
                      >
                        <div className="w-9 h-9 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1A73E8] transition-colors">
                          <Icon className="w-[18px] h-[18px] text-[#1A73E8] group-hover:text-white transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-[#0D2137] flex-1">{link.label}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8B9DAF] group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured Products Mini */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <h3 className="text-xs font-semibold text-[#8B9DAF] tracking-[0.15em] uppercase text-center mb-4">Öne Çıkanlar</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            {featuredProducts.map((p, i) => (
              <Link
                key={i}
                to={p.href}
                className="flex-shrink-0 w-[140px] snap-start bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden hover:shadow-md transition-all group"
              >
                <div className="aspect-square overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-semibold text-[#0D2137] line-clamp-1">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs font-bold text-[#1A73E8]">{p.price.toLocaleString('tr-TR')} ₺</span>
                    {p.oldPrice != null && (
                      <span className="text-[10px] text-[#8B9DAF] line-through">{p.oldPrice.toLocaleString('tr-TR')} ₺</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Campaign Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-gradient-to-r from-[#0D2137] to-[#1A3A5C] rounded-2xl p-5 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A73E8]/20 rounded-full blur-2xl" />
          <div className="relative">
            <p className="text-[10px] font-bold text-white/50 tracking-[0.15em] uppercase">Instagram\'a Ozel Firsat</p>
            <h3 className="text-base font-bold mt-1">%10 Indirim</h3>
            <p className="text-xs text-white/70 mt-1">AQUAILS10 kodu ile seçili ürünlerde geçerli.</p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleCopyCoupon}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-xs font-semibold px-3 py-2 rounded-full transition-all"
              >
                {copied ? <><Check className="w-3 h-3" />Kopyalandi</> : <><Copy className="w-3 h-3" />AQUAILS10</>}
              </button>
              <Link to="/kampanyalar" className="flex items-center gap-1 bg-white text-[#0D2137] text-xs font-semibold px-3 py-2 rounded-full hover:bg-white/90 transition-all">
                Kampanyalar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Trust Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 grid grid-cols-4 gap-2"
        >
          {trustItems.map(t => (
            <div key={t.label} className="text-center">
              <t.icon className="w-4 h-4 text-[#1A73E8] mx-auto mb-1" />
              <p className="text-[10px] font-bold text-[#0D2137]">{t.value}</p>
              <p className="text-[9px] text-[#8B9DAF]">{t.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Mini Social Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 mb-4"
        >
          <div className="flex items-center justify-center gap-4">
            {[
              { icon: Instagram, href: 'https://instagram.com/aquails', label: 'Instagram' },
              { icon: MessageCircle, href: 'https://wa.me/905321234567', label: 'WhatsApp' },
              { icon: Phone, href: 'tel:08501234567', label: 'Telefon' },
              { icon: Mail, href: 'mailto:info@aquails.com', label: 'E-posta' },
              { icon: Globe, href: '/', label: 'Web Sitesi' },
            ].map(s => (
              <button
                key={s.label}
                onClick={() => s.href.startsWith('http') || s.href.startsWith('mailto') || s.href.startsWith('tel') ? handleExternalLink(s.href) : undefined}
                className="w-9 h-9 bg-white border border-[#E8F0FE] rounded-full flex items-center justify-center hover:border-[#1A73E8] hover:bg-[#F0F6FF] transition-all group"
                title={s.label}
              >
                <s.icon className="w-4 h-4 text-[#8B9DAF] group-hover:text-[#1A73E8] transition-colors" />
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#8B9DAF] text-center mt-4">
            &copy; 2026 Aquails. Tüm hakları saklıdır.
          </p>
        </motion.div>
      </div>
    </div>
  </>
  );
}
