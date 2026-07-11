import { Link } from 'react-router';
import { BrandLogo } from '@/components/BrandLogo';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const quickLinks = ['Ana Sayfa', 'Ürünler', 'Kampanyalar', 'Blog', 'SSS'];
const categoryLinks = [
  'Ev Tipi Cihazlar',
  'Tezgah Altı Sistemler',
  'Endüstriyel Arıtma',
  'Filtre Setleri',
  'Yedek Parçalar',
];

export function Footer() {
  return (
    <footer>
      {/* CTA Band */}
      <div className="bg-aqua-secondary py-16 md:py-20">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Temiz Su, Sağlıklı Gelecek.
          </h2>
          <p className="mt-3 text-aqua-text-muted text-base">
            Aquails ailesine katılın, su arıtma çözümlerimizle tanışın.
          </p>
          <Link
            to="/urunler"
            className="inline-block mt-7 bg-aqua-primary text-white px-8 py-3.5 rounded-full text-[15px] font-semibold hover:shadow-primary-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            Hemen Alışverişe Başla
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#0A1929] pt-14 pb-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <BrandLogo variant="logo" inverted className="h-8" />
              </div>
              <p className="text-sm text-aqua-text-muted leading-relaxed">
                2008'den beri su arıtma teknolojilerinde güvenilir çözüm ortağınız.
              </p>
              <div className="flex items-center gap-3 mt-5">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full border border-[#1A3A5C] flex items-center justify-center text-aqua-text-muted hover:text-white hover:border-aqua-primary transition-all duration-300"
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
                {quickLinks.map((link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-sm text-aqua-text-muted hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {link}
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
                {categoryLinks.map((link) => (
                  <li key={link}>
                    <Link
                      to="/urunler"
                      className="text-sm text-aqua-text-muted hover:text-white hover:pl-1 transition-all duration-200"
                    >
                      {link}
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
              <div className="space-y-3 text-sm text-aqua-text-muted">
                <p>Merkez: Teknopark İstanbul, Pendik/İstanbul</p>
                <p>0850 123 45 67</p>
                <p>info@aquails.com.tr</p>
              </div>
            </div>
          </div>

          {/* Bottom Line */}
          <div className="mt-12 pt-6 border-t border-[#1A3A5C] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-aqua-text-muted">
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
