import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUpRight,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { useCatalog } from '@/hooks/useCatalog';
import { categories as staticCategories } from '@/data';
import { getSiteConfig, type SiteConfig } from '@/services/settingsService';
import { cn } from '@/lib/utils';

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

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group relative inline-flex text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
    >
      <span className="absolute -left-3 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full bg-aq-aqua opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
        {children}
      </span>
    </Link>
  );
}

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
    <footer className="relative overflow-hidden bg-[#041825]">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_-10%,rgba(32,211,242,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_90%_20%,rgba(18,134,216,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_110%,rgba(6,38,61,0.9),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <svg
          className="absolute bottom-0 left-0 right-0 h-24 w-full text-aq-aqua/[0.07]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,80 C240,120 480,20 720,50 C960,80 1200,110 1440,40 L1440,120 L0,120 Z"
          />
        </svg>
      </div>

      <div className="relative page-container min-w-0 pt-16 pb-10 md:pt-20 md:pb-12">
        {/* CTA band */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <BrandLogo variant="logo" bare inverted className="text-[1.02rem] gap-[0.3em]" />
              <span className="hidden sm:inline-block h-4 w-px bg-white/15" />
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.2em] text-aq-aqua/80 font-medium">
                2008 — {year}
              </span>
            </div>

            <h2 className="font-[Poppins,ui-sans-serif,sans-serif] text-[1.65rem] sm:text-[2rem] md:text-[2.35rem] font-semibold text-white leading-[1.15] tracking-[-0.02em]">
              Doğru su arıtma sistemini{' '}
              <span className="bg-gradient-to-r from-aq-aqua to-aq-blue bg-clip-text text-transparent">
                birlikte
              </span>{' '}
              seçelim
            </h2>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/50">
              Ücretsiz keşif randevusu alın veya ürün kataloğumuzu inceleyin — ihtiyacınıza uygun çözümü netleştirelim.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 flex-shrink-0">
            <Link
              to="/urunler"
              className={cn(
                'group inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5',
                'bg-white text-aq-deep text-sm font-semibold',
                'shadow-[0_12px_40px_rgba(32,211,242,0.12)]',
                'transition-all duration-300 hover:bg-aq-sky hover:-translate-y-0.5',
              )}
            >
              Ürünleri İncele
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-aq-deep/8 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              to="/servis-randevusu"
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5',
                'border border-white/20 bg-white/[0.03] text-white text-sm font-semibold backdrop-blur-sm',
                'transition-all duration-300 hover:border-aq-aqua/50 hover:bg-aq-aqua/10 hover:text-aq-aqua',
              )}
            >
              Servis Randevusu
            </Link>
          </div>
        </div>

        {/* Soft separator */}
        <div className="relative my-12 md:my-14">
          <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-aqua/60 shadow-[0_0_12px_rgba(32,211,242,0.6)]" />
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-1 lg:col-span-2">
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Keşfet
            </h3>
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <FooterLink to={href}>{label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Kategoriler
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <FooterLink to={`/urunler?kategori=${cat.id}`}>{cat.name}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-4">
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              İletişim
            </h3>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="group mb-5 inline-flex flex-col"
            >
              <span className="text-[11px] text-white/35 mb-1">Hemen ara</span>
              <span className="inline-flex items-center gap-2 text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-aq-aqua">
                <Phone className="h-4 w-4 text-aq-aqua" />
                {phone}
              </span>
            </a>
            <ul className="space-y-3 text-[13px] text-white/50">
              <li className="flex gap-2.5">
                <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-aq-aqua/60" />
                <span className="leading-relaxed">{address}</span>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2.5 transition-colors hover:text-white break-all"
                >
                  <Mail className="h-3.5 w-3.5 flex-shrink-0 text-aq-aqua/60" />
                  {email}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3">
            <h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              Sosyal
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
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-300 hover:-translate-y-0.5 hover:border-aq-aqua/40 hover:bg-aq-aqua/10 hover:text-aq-aqua"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-[13px] leading-relaxed text-white/45 max-w-[220px]">
                Temiz su. Akıllı teknoloji. Güvenilir servis.
              </p>
            )}
            <Link
              to="/iletisim"
              className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-aq-aqua/90 transition-colors hover:text-aq-aqua"
            >
              İletişim formu
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-white/30">
            &copy; {year} Aquails. Tüm hakları saklıdır.
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-white/35">
            <Link to="/gizlilik" className="transition-colors hover:text-white/70">
              Gizlilik Politikası
            </Link>
            <Link to="/mesafeli-satis" className="transition-colors hover:text-white/70">
              Mesafeli Satış
            </Link>
            <Link to="/kvkk" className="transition-colors hover:text-white/70">
              KVKK
            </Link>
            <Link to="/uyelik-sozlesmesi" className="transition-colors hover:text-white/70">
              Üyelik Sözleşmesi
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
