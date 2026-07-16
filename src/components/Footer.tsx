import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Phone, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { AquailsButton } from '@/components/design';
import { useCatalog } from '@/hooks/useCatalog';
import { categories as staticCategories } from '@/data';
import { getSiteConfig, type SiteConfig } from '@/services/settingsService';

const quickLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Kampanyalar', href: '/kampanyalar' },
  { label: 'Blog', href: '/blog' },
  { label: 'SSS', href: '/sss' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
];

const socialIcons = [
  { key: 'facebook' as const, Icon: Facebook, label: 'Facebook' },
  { key: 'instagram' as const, Icon: Instagram, label: 'Instagram' },
  { key: 'twitter' as const, Icon: Twitter, label: 'Twitter' },
  { key: 'youtube' as const, Icon: Youtube, label: 'YouTube' },
];

export function Footer() {
  const { categories: loadedCategories } = useCatalog();
  const categories = (loadedCategories.length > 0 ? loadedCategories : staticCategories).slice(0, 5);
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSiteConfig().then((cfg) => {
      if (!cancelled) setSite(cfg);
    });
    return () => { cancelled = true; };
  }, []);

  const phone = site?.phone || '0850 123 45 67';
  const email = site?.email || 'info@aquails.com.tr';
  const address = site?.address || 'Teknopark İstanbul, Pendik/İstanbul';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-aq-deep">
      {/* Compact CTA strip */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 right-[8%] w-[360px] h-[360px] rounded-full bg-aq-aqua/10 blur-[90px]" />
          <div className="absolute -bottom-24 left-[5%] w-[320px] h-[320px] rounded-full bg-aq-blue/15 blur-[80px]" />
        </div>
        <div className="relative page-container py-12 md:py-14">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                Doğru su arıtma sistemini birlikte seçelim
              </h2>
              <p className="mt-3 text-white/55 text-sm leading-relaxed max-w-md">
                Ücretsiz keşif randevusu alın veya ürün kataloğumuzu keşfedin.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <AquailsButton to="/urunler" variant="primary" showArrow>
                Ürünleri İncele
              </AquailsButton>
              <AquailsButton to="/servis-randevusu" variant="ghost">
                Servis Randevusu
              </AquailsButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="pt-12 pb-8">
        <div className="page-container min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            <div>
              <div className="mb-4 inline-flex items-center bg-white rounded-xl px-3 py-2">
                <BrandLogo variant="logo" bare className="h-7 w-auto" />
              </div>
              <p className="text-sm text-white/45 leading-relaxed">
                2008&apos;den beri su arıtma teknolojilerinde güvenilir çözüm ortağınız.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {socialIcons.map(({ key, Icon, label }) => {
                  const href = site?.[key];
                  if (!href) return null;
                  return (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-aq-aqua hover:border-aq-aqua/50 transition-all duration-300"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                Hızlı Linkler
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-white/45 hover:text-white hover:pl-1 transition-all duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                Kategoriler
              </h4>
              <ul className="space-y-2.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/urunler?kategori=${cat.id}`}
                      className="text-sm text-white/45 hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                İletişim
              </h4>
              <div className="space-y-3 text-sm text-white/45">
                <p>Merkez: {address}</p>
                <p>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> {phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                    {email}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/35">
            <p>&copy; {year} Aquails. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link to="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link>
              <span className="text-white/15">|</span>
              <Link to="/mesafeli-satis" className="hover:text-white transition-colors">Mesafeli Satış</Link>
              <span className="text-white/15">|</span>
              <Link to="/kvkk" className="hover:text-white transition-colors">KVKK</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
