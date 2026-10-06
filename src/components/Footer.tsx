import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { getSiteConfig, type SiteConfig } from '@/services/settingsService';
import { CONTACT_PHONE_DISPLAY, telHref } from '@/lib/contact';

const quickLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Kampanyalar', href: '/kampanyalar' },
  { label: 'Blog', href: '/blog' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
];

const helpLinks = [
  { label: 'SSS', href: '/sss' },
  { label: 'Kargo & Kurulum', href: '/kargo-kurulum' },
  { label: 'İade Koşulları', href: '/iade' },
  { label: 'Sipariş Takip', href: '/siparis-takip' },
  { label: 'İletişim', href: '/iletisim' },
];

const legalLinks = [
  { label: 'Gizlilik Politikası', href: '/gizlilik' },
  { label: 'Mesafeli Satış', href: '/mesafeli-satis' },
  { label: 'KVKK', href: '/kvkk' },
  { label: 'İletişim', href: '/iletisim' },
];

const socialIcons = [
  { key: 'instagram' as const, Icon: Instagram, label: 'Instagram' },
  { key: 'facebook' as const, Icon: Facebook, label: 'Facebook' },
  { key: 'youtube' as const, Icon: Youtube, label: 'YouTube' },
  { key: 'twitter' as const, Icon: Twitter, label: 'X' },
];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="text-[13px] font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link to={l.href} className="text-[13px] text-white/60 transition-colors hover:text-white">{l.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [site, setSite] = useState<SiteConfig | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSiteConfig().then((cfg) => { if (!cancelled) setSite(cfg); });
    return () => { cancelled = true; };
  }, []);

  const phone = site?.phone || CONTACT_PHONE_DISPLAY;
  const email = site?.email || 'info@aquails.com.tr';
  const address = site?.address || 'Teknopark İstanbul, Pendik/İstanbul';
  const socials = socialIcons.filter(({ key }) => site?.[key]);

  return (
    <footer className="bg-aq-ink text-white">
      <div className="page-container pt-14 pb-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <BrandLogo variant="logo" bare inverted className="text-[1.05rem] gap-[0.32em]" />
            <p className="mt-4 text-[13px] leading-relaxed text-white/60">Daha temiz su. Daha sağlıklı yaşam.</p>
            {socials.length > 0 && (
              <div className="mt-5 flex items-center gap-4">
                {socials.map(({ key, Icon, label }) => (
                  <a key={key} href={site![key]!} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-white/70 transition-colors hover:text-white">
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <Column title="Hızlı Linkler" links={quickLinks} />
          <Column title="Yardım" links={helpLinks} />

          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-[13px] font-semibold text-white">Bize Ulaşın</h3>
            <p className="mt-4 text-[13px] leading-relaxed text-white/60">
              Ücretsiz keşif ve ürün danışmanlığı için hemen arayın.
            </p>
            <a
              href={telHref(phone)}
              className="group mt-4 flex items-center justify-between gap-3 rounded-full bg-white/10 py-1.5 pl-5 pr-1.5 ring-1 ring-white/10 transition-colors hover:bg-white/15"
            >
              <span className="truncate text-[13px] font-medium tabular-nums text-white">{phone}</span>
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-aq-mist text-aq-ink transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <ul className="mt-4 space-y-2 text-[12px] text-white/55">
              <li>
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 break-all hover:text-white">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" /> {email}
                </a>
              </li>
              <li className="flex gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" /> {address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/45">© {new Date().getFullYear()} Aquails. Tüm hakları saklıdır.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Yasal">
            {legalLinks.map((l) => (
              <Link key={l.label} to={l.href} className="text-[12px] text-white/55 transition-colors hover:text-white">{l.label}</Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
