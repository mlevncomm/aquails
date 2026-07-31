import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
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
    return () => {
      cancelled = true;
    };
  }, []);

  const phone = site?.phone || '0850 123 45 67';
  const email = site?.email || 'info@aquails.com.tr';
  const address = site?.address || 'Teknopark İstanbul, Pendik/İstanbul';
  const year = new Date().getFullYear();
  const socials = socialIcons.filter(({ key }) => site?.[key]);

  return (
    <footer className="relative overflow-hidden bg-aq-deep">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-5%] h-[420px] w-[420px] rounded-full bg-aq-aqua/[0.07] blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[380px] w-[380px] rounded-full bg-aq-blue/[0.12] blur-[90px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative page-container min-w-0 pt-14 pb-10 md:pt-16 md:pb-12">
        {/* Brand + CTA — tek üst bant */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <BrandLogo variant="logo" bare inverted className="text-[1.05rem] gap-[0.32em]" />
            <h2 className="mt-7 text-[1.35rem] md:text-2xl font-semibold text-white leading-snug tracking-tight">
              Doğru su arıtma sistemini birlikte seçelim
            </h2>
            <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-md">
              2008&apos;den beri güvenilir çözüm ortağınız. Ücretsiz keşif randevusu alın veya kataloğu keşfedin.
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

        <div className="my-11 md:my-12 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />

        {/* Link sütunları */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-4">
              Kategoriler
            </h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/urunler?kategori=${cat.id}`}
                    className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-4">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm text-white/55">
              <li className="flex gap-2.5">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-aq-aqua/70" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li>
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0 text-aq-aqua/70" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2.5 hover:text-white transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 flex-shrink-0 text-aq-aqua/70" />
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/40 mb-4">
              Takip Edin
            </h3>
            {socials.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {socials.map(({ key, Icon, label }) => (
                  <a
                    key={key}
                    href={site![key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-aq-aqua hover:border-aq-aqua/40 hover:bg-white/[0.04] transition-all duration-300"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40 leading-relaxed">
                Temiz su, akıllı teknoloji.
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/35">
          <p>&copy; {year} Aquails. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link to="/gizlilik" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </Link>
            <Link to="/mesafeli-satis" className="hover:text-white transition-colors">
              Mesafeli Satış
            </Link>
            <Link to="/kvkk" className="hover:text-white transition-colors">
              KVKK
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
