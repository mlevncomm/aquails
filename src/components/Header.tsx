import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, User, Menu, X, ChevronDown, ChevronRight, ArrowRight,
  Heart, GitCompare, Package, Filter, LogOut, ShoppingBag, Wand2, Phone,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCompareStore } from '@/stores/compareStore';
import { logout } from '@/services/authService';
import { getSiteConfig } from '@/services/settingsService';
import { CONTACT_PHONE_DISPLAY, telHref } from '@/lib/contact';
import { useCatalog } from '@/hooks/useCatalog';
import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler', hasMega: true },
  { label: 'Kampanyalar', href: '/kampanyalar' },
  { label: 'Servis', href: '/servis-randevusu' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'İletişim', href: '/iletisim' },
];

const categoryImages: Record<string, string> = {
  'direkt-akis-ro': '/images/products/direkt-akis-su-aritma.jpg',
  'klasik-ro-sistemleri': '/images/products/su-aritma-cihazlari.jpg',
  'soft-kompakt': '/images/products/dijital-su-aritma.jpg',
  sebiller: '/images/products/sebiller.jpg',
  'bina-giris-filtrasyon': '/images/products/bina-girisi-filtrasyon.jpg',
  'filtreler-membranlar': '/images/products/filtreler.jpg',
  'musluklar-aksesuarlar': '/images/products/musluklar.jpg',
};

export function Header() {
  const { categories } = useCatalog();
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleDrawer, getTotalItems } = useCartStore();
  const { isAuthenticated, user, clearUser } = useAuthStore();
  const favCount = useFavoritesStore((s) => s.ids.length);
  const compareCount = useCompareStore((s) => s.ids.length);
  const cartCount = getTotalItems();

  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [phone, setPhone] = useState(CONTACT_PHONE_DISPLAY);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHome = location.pathname === '/';
  const overlay = isHome && !isScrolled && !megaOpen && !searchOpen;

  useEffect(() => {
    let cancelled = false;
    getSiteConfig().then((cfg) => {
      if (!cancelled && cfg.phone) setPhone(cfg.phone);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => () => { if (megaTimer.current) clearTimeout(megaTimer.current); }, []);

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 140);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/arama?q=${encodeURIComponent(query.trim())}`);
    setQuery('');
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    clearUser();
    navigate('/', { replace: true });
  };

  const isActive = (href: string) => (href === '/' ? location.pathname === '/' : location.pathname.startsWith(href));
  const iconBtn = cn(
    'relative flex h-10 w-10 items-center justify-center rounded-full transition-colors',
    overlay ? 'text-white hover:bg-white/10' : 'text-aq-ink hover:bg-aq-cloud',
  );

  return (
    <>
      <header
        className={cn(
          'inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
          isHome ? 'fixed' : 'sticky',
          overlay ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md',
          !overlay && (isScrolled || !isHome) && 'shadow-[0_1px_0_rgba(11,37,64,0.08)]',
        )}
      >
        <div className="page-container flex h-[72px] items-center justify-between gap-6 !py-0">
          <Link to="/" aria-label="Aquails Ana Sayfa" className="flex-shrink-0">
            <BrandLogo variant="logo" bare inverted={overlay} className="text-[1.05rem] gap-[0.32em]" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Ana menü">
            {navLinks.map((link) => (
              <div
                key={link.href}
                onMouseEnter={() => link.hasMega && openMega()}
                onMouseLeave={() => link.hasMega && closeMega()}
              >
                <Link
                  to={link.href}
                  className={cn(
                    'flex items-center gap-1 py-6 text-[14px] font-medium transition-colors',
                    overlay
                      ? isActive(link.href) ? 'text-white' : 'text-white/80 hover:text-white'
                      : isActive(link.href) ? 'text-aq-ink' : 'text-aq-ink/60 hover:text-aq-ink',
                  )}
                >
                  {link.label}
                  {link.hasMega && <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', megaOpen && 'rotate-180')} />}
                </Link>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button type="button" aria-label="Ara" onClick={() => setSearchOpen((v) => !v)} className={iconBtn}>
              <Search className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </button>

            <div className="relative hidden sm:block">
              {isAuthenticated && user ? (
                <button type="button" aria-label="Hesabım" onClick={() => setProfileOpen((v) => !v)} className={iconBtn}>
                  <span className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold', overlay ? 'bg-white text-aq-ink' : 'bg-aq-ink text-white')}>
                    {user.name?.[0]?.toUpperCase() || 'A'}
                  </span>
                </button>
              ) : (
                <Link to="/giris" aria-label="Giriş Yap" className={iconBtn}>
                  <User className="h-[19px] w-[19px]" strokeWidth={1.8} />
                </Link>
              )}
              <AnimatePresence>
                {profileOpen && user && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl bg-white py-1.5 shadow-soft-lg ring-1 ring-aq-border/70"
                    >
                      <div className="border-b border-aq-border/60 px-4 py-3">
                        <p className="truncate text-sm font-semibold text-aq-ink">{user.name}</p>
                        <p className="truncate text-xs text-aq-muted">{user.email}</p>
                      </div>
                      {[
                        { to: '/hesabim', label: 'Hesabım', icon: User },
                        { to: '/hesabim/siparisler', label: 'Siparişlerim', icon: Package },
                        { to: '/hesabim/favoriler', label: `Favorilerim${favCount ? ` (${favCount})` : ''}`, icon: Heart },
                      ].map(({ to, label, icon: Icon }) => (
                        <Link key={to} to={to} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-aq-ink/75 hover:bg-aq-cloud hover:text-aq-ink">
                          <Icon className="h-4 w-4" /> {label}
                        </Link>
                      ))}
                      <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="h-4 w-4" /> Çıkış Yap
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button type="button" aria-label="Sepet" onClick={toggleDrawer} className={iconBtn}>
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className={cn(
                  'absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[10px] font-bold',
                  overlay ? 'bg-white text-aq-ink' : 'bg-aq-ink text-white',
                )}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            <Link
              to="/urunler"
              className={cn(
                'ml-2 hidden items-center rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors md:inline-flex',
                overlay ? 'bg-white text-aq-ink hover:bg-white/90' : 'bg-aq-ink text-white hover:bg-aq-ink-soft',
              )}
            >
              Hemen Al
            </Link>

            <button type="button" aria-label="Menüyü aç" onClick={() => setMenuOpen(true)} className={cn(iconBtn, 'lg:hidden')}>
              <Menu className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-aq-border/60 bg-white"
            >
              <form onSubmit={submitSearch} className="page-container flex items-center gap-3 py-4">
                <Search className="h-5 w-5 flex-shrink-0 text-aq-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün, kategori veya model ara…"
                  className="min-w-0 flex-1 bg-transparent text-[15px] text-aq-ink placeholder:text-aq-muted focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Aramayı kapat" className="rounded-full p-2 text-aq-muted hover:bg-aq-cloud">
                  <X className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mega menu */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="absolute inset-x-0 top-full hidden border-t border-aq-border/60 bg-white shadow-soft-lg lg:block"
            >
              <div className="page-container grid grid-cols-[1fr_280px] gap-10 py-8">
                <div>
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-aq-muted">Kategoriler</p>
                  <div className="grid grid-cols-4 gap-4">
                    {categories.slice(0, 8).map((cat) => (
                      <Link key={cat.id} to={`/kategori/${cat.id}`} className="group">
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-aq-cloud">
                          <img
                            src={categoryImages[cat.id] || '/images/products/placeholder.jpg'}
                            alt=""
                            className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-2.5 text-sm font-semibold text-aq-ink group-hover:text-aq-blue">{cat.name}</p>
                        <p className="text-xs text-aq-muted">{cat.productCount} ürün</p>
                      </Link>
                    ))}
                    {categories.length === 0 && (
                      <Link to="/urunler" className="col-span-4 text-sm text-aq-muted hover:text-aq-ink">Tüm ürünleri görüntüle →</Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-xl bg-aq-cloud p-6">
                  <div>
                    <Wand2 className="h-5 w-5 text-aq-ink" />
                    <p className="mt-4 text-lg font-semibold leading-snug text-aq-ink">Hangi cihaz size uygun?</p>
                    <p className="mt-2 text-sm leading-relaxed text-aq-muted">Birkaç soruyla 1 dakikada öneri alın.</p>
                  </div>
                  <div className="mt-6 flex flex-col gap-2">
                    <Link to="/urun-secim-sihirbazi" className="inline-flex items-center justify-center gap-2 rounded-full bg-aq-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-aq-ink-soft">
                      Sihirbazı Başlat <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link to="/urunler" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-aq-ink hover:bg-white/80">
                      Tüm Ürünler
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-white lg:hidden"
          >
            <div className="page-container flex h-[72px] flex-shrink-0 items-center justify-between !py-0">
              <Link to="/" onClick={() => setMenuOpen(false)} aria-label="Aquails Ana Sayfa">
                <BrandLogo variant="logo" bare className="text-[1.05rem] gap-[0.32em]" />
              </Link>
              <button type="button" aria-label="Menüyü kapat" onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full text-aq-ink hover:bg-aq-cloud">
                <X className="h-[22px] w-[22px]" />
              </button>
            </div>

            <div className="page-container flex-1 overflow-y-auto pb-8">
              <form onSubmit={submitSearch} className="relative mt-2">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ürün ara…"
                  className="w-full rounded-full bg-aq-cloud py-3 pl-11 pr-4 text-sm text-aq-ink placeholder:text-aq-muted focus:outline-none focus:ring-2 focus:ring-aq-mist"
                />
              </form>

              <nav className="mt-6 flex flex-col" aria-label="Mobil menü">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      'flex items-center justify-between border-b border-aq-border/60 py-4 text-[17px] font-semibold',
                      isActive(link.href) ? 'text-aq-ink' : 'text-aq-ink/70',
                    )}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 text-aq-muted" />
                  </Link>
                ))}
              </nav>

              {categories.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-aq-muted">Kategoriler</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <Link key={cat.id} to={`/kategori/${cat.id}`} className="rounded-full bg-aq-cloud px-3.5 py-2 text-[13px] font-medium text-aq-ink">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-2">
                {[
                  { to: isAuthenticated ? '/hesabim/favoriler' : '/giris', label: `Favoriler${favCount ? ` (${favCount})` : ''}`, icon: Heart },
                  { to: '/karsilastir', label: `Karşılaştır${compareCount ? ` (${compareCount})` : ''}`, icon: GitCompare },
                  { to: '/siparis-takip', label: 'Sipariş Takip', icon: Package },
                  { to: '/filtre-aboneligi', label: 'Filtre Aboneliği', icon: Filter },
                  { to: '/urun-secim-sihirbazi', label: 'Ürün Sihirbazı', icon: Wand2 },
                ].map(({ to, label, icon: Icon }) => (
                  <Link key={label} to={to} className="flex items-center gap-2.5 rounded-xl bg-aq-cloud px-3.5 py-3 text-[13px] font-medium text-aq-ink">
                    <Icon className="h-4 w-4 flex-shrink-0" /> <span className="truncate">{label}</span>
                  </Link>
                ))}
                <a href={telHref(phone)} className="flex items-center gap-2.5 rounded-xl bg-aq-cloud px-3.5 py-3 text-[13px] font-medium text-aq-ink">
                  <Phone className="h-4 w-4 flex-shrink-0" /> <span className="truncate">{phone}</span>
                </a>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                {isAuthenticated ? (
                  <>
                    <Link to="/hesabim" className="flex items-center justify-center rounded-full bg-aq-ink py-3.5 text-sm font-semibold text-white">Hesabım</Link>
                    <button type="button" onClick={() => { handleLogout(); setMenuOpen(false); }} className="flex items-center justify-center rounded-full py-3 text-sm font-semibold text-red-600">Çıkış Yap</button>
                  </>
                ) : (
                  <>
                    <Link to="/urunler" className="flex items-center justify-center rounded-full bg-aq-ink py-3.5 text-sm font-semibold text-white">Hemen Al</Link>
                    <Link to="/giris" className="flex items-center justify-center rounded-full border border-aq-ink/15 py-3.5 text-sm font-semibold text-aq-ink">Giriş Yap</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
