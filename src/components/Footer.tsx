import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, ShieldCheck, Wrench, Users } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const quickLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler' },
  { label: 'Kampanyalar', href: '/kampanyalar' },
  { label: 'Blog', href: '/blog' },
  { label: 'SSS', href: '/sss' },
];

const categoryLinks = [
  { label: 'Ev Tipi Cihazlar', href: '/urunler?kategori=ev-tipi' },
  { label: 'Tezgah Altı Sistemler', href: '/urunler?kategori=tezgah-alti' },
  { label: 'Endüstriyel Arıtma', href: '/urunler?kategori=endustriyel' },
  { label: 'Filtre Setleri', href: '/urunler?kategori=filtre' },
  { label: 'Yedek Parçalar', href: '/urunler?kategori=yedek-parca' },
];

const trustItems = [
  { icon: Users, label: '10.000+ Mutlu Müşteri' },
  { icon: ShieldCheck, label: '5 Yıl Garanti' },
  { icon: Wrench, label: 'Ücretsiz Kurulum' },
  { icon: Phone, label: '7/24 Teknik Destek' },
];

export function Footer() {
  return (
    <footer>
      {/* ── Unified CTA Band ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#061628] via-[#0D2137] to-[#0B1D3A]">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-0 w-[500px] h-[500px] rounded-full bg-[#1A73E8]/12 blur-[100px]" />
          <div className="absolute -bottom-20 left-0 w-[400px] h-[400px] rounded-full bg-[#00D4C8]/8 blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full bg-[#1A73E8]/5 blur-[60px]" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — headline + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <span className="inline-block text-[#60A5FA] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Temiz Su · Sağlıklı Gelecek
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-bold text-white leading-[1.15]">
                Eviniz İçin Doğru<br />
                <span className="text-[#60A5FA]">Su Arıtma Sistemini</span><br />
                Birlikte Seçelim
              </h2>
              <p className="mt-5 text-white/65 text-sm sm:text-base leading-relaxed max-w-md">
                Uzman ekibimiz ihtiyacınıza en uygun çözümü sunmak için hazır.
                Ücretsiz keşif randevusu alın veya ürün kataloğumuzu keşfedin.
              </p>

              <div className="flex flex-wrap gap-3 mt-8">
                <Link
                  to="/urunler"
                  className="inline-flex items-center gap-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-[0_4px_24px_rgba(26,115,232,0.4)] hover:shadow-[0_4px_32px_rgba(26,115,232,0.55)] hover:-translate-y-0.5"
                >
                  Ürünleri İncele <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/servis-randevusu"
                  className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 text-white/90 hover:text-white px-7 py-3.5 rounded-full font-semibold text-sm transition-all hover:bg-white/8"
                >
                  Servis Randevusu Al
                </Link>
              </div>
            </motion.div>

            {/* Right — trust grid */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="grid grid-cols-2 gap-3 sm:gap-4"
            >
              {trustItems.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 hover:bg-white/8 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#1A73E8]/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#60A5FA]" strokeWidth={1.75} />
                  </div>
                  <span className="text-sm font-semibold text-white/90">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="bg-[#061220] pt-14 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <BrandLogo variant="logo" inverted className="h-8" />
              </div>
              <p className="text-sm text-[#5A7A9A] leading-relaxed">
                2008'den beri su arıtma teknolojilerinde güvenilir çözüm ortağınız.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full border border-[#1A3A5C] flex items-center justify-center text-[#5A7A9A] hover:text-white hover:border-[#1A73E8] transition-all duration-300"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                Hızlı Linkler
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-[#5A7A9A] hover:text-white hover:pl-1 transition-all duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                Kategoriler
              </h4>
              <ul className="space-y-2.5">
                {categoryLinks.map(({ label, href }) => (
                  <li key={label}>
                    <Link to={href} className="text-sm text-[#5A7A9A] hover:text-white hover:pl-1 transition-all duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
                İletişim
              </h4>
              <div className="space-y-3 text-sm text-[#5A7A9A]">
                <p>Merkez: Teknopark İstanbul, Pendik/İstanbul</p>
                <p>0850 123 45 67</p>
                <p>info@aquails.com.tr</p>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-12 pt-6 border-t border-[#0F2840] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#3D5A78]">
            <p>&copy; 2025 Aquails. Tüm hakları saklıdır.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Kullanım Koşulları</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
