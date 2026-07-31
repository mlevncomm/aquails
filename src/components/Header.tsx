import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShoppingCart, Menu, X,
  Heart, ChevronRight, LogOut, Search, GitCompare,
  ChevronDown, Package, Droplet, Zap, Monitor, Coffee,
  Building2, Filter, CircleDot, Settings, Wrench,
  Plug, Sparkles, ChefHat, Activity, Home, ArrowUpRight, Wand2,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCompareStore } from '@/stores/compareStore';
import { logout } from '@/services/authService';
import { getSiteConfig } from '@/services/settingsService';
import { categories as staticCategories } from '@/data';
import { useCatalog } from '@/hooks/useCatalog';
import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Droplet, Zap, Monitor, Coffee, Building2, Filter, CircleDot,
  Settings, Wrench, Plug, Sparkles, ChefHat, Activity, Home,
};

const navLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Ürünler', href: '/urunler', hasMega: true },
  { label: 'Kampanyalar', href: '/kampanyalar' },
  { label: 'Sihirbaz', href: '/urun-secim-sihirbazi' },
  { label: 'Servis', href: '/servis-randevusu' },
  { label: 'Blog', href: '/blog' },
  { label: 'İletişim', href: '/iletisim' },
];

interface HeaderIconButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  label: string;
  badge?: number;
  badgeTone?: 'primary' | 'danger' | 'dark';
  className?: string;
}

function HeaderIconButton({
  children,
  onClick,
  href,
  label,
  badge,
  badgeTone = 'primary',
  className,
}: HeaderIconButtonProps) {
  const badgeColors = {
    primary: 'bg-aq-blue text-white',
    danger: 'bg-[#E85454] text-white',
    dark: 'bg-aq-text text-white',
  };

  const inner = (
    <>
      {children}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 text-[9px] font-semibold rounded-full flex items-center justify-center leading-none',
            badgeColors[badgeTone],
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  const baseClass = cn(
    'relative flex items-center justify-center rounded-full transition-all duration-200',
    'text-aq-muted hover:text-aq-blue',
    'bg-white border border-aq-border/60',
    'hover:border-aq-blue/30 hover:bg-aq-sky/40',
    'w-9 h-9 lg:w-[34px] lg:h-[34px]',
    className,
  );

  if (href) {
    return (
      <Link to={href} aria-label={label} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={baseClass}>
      {inner}
    </button>
  );
}

export function Header() {
  const { categories: loadedCategories } = useCatalog();
  const categories = loadedCategories.length > 0 ? loadedCategories : staticCategories;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [phone, setPhone] = useState('0850 123 45 67');
  const [freeShippingLimit, setFreeShippingLimit] = useState(1500);
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleDrawer, getTotalItems } = useCartStore();
  const { isAuthenticated, user, clearUser } = useAuthStore();
  const favCount = useFavoritesStore(s => s.ids.length);
  const compareCount = useCompareStore(s => s.ids.length);
  const cartCount = getTotalItems();
  const searchRef = useRef<HTMLDivElement>(null);
  const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = () => {
    if (megaCloseTimer.current) {
      clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setIsMegaOpen(true);
  };

  const closeMega = () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = setTimeout(() => setIsMegaOpen(false), 140);
  };

  useEffect(() => () => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSiteConfig().then((cfg) => {
      if (cancelled) return;
      if (cfg.phone) setPhone(cfg.phone);
      if (cfg.freeShippingLimit > 0) setFreeShippingLimit(cfg.freeShippingLimit);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsMegaOpen(false);
    setMobileCatsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => { logout(); clearUser(); navigate('/', { replace: true }); };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/arama?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const getCategoryIcon = (iconName: string) => iconMap[iconName] || Droplet;

  return (
    <>
      {/* Top Bar — minimal */}
      <div className="bg-white border-b border-aq-border/60 overflow-x-hidden">
        <div className="page-container h-9 flex items-center justify-between text-[11px] tracking-wide min-w-0 gap-4 !py-0">
          <p className="text-aq-muted/90 truncate min-w-0">
            <span className="font-medium text-aq-text/80">Ücretsiz kargo</span>
            <span className="mx-1.5 text-aq-border">·</span>
            <span>{freeShippingLimit.toLocaleString('tr-TR')}₺ ve üzeri</span>
          </p>
          <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/siparis-takip"
              className="text-aq-muted hover:text-aq-deep transition-colors"
            >
              Sipariş Takip
            </Link>
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="text-aq-muted hover:text-aq-deep transition-colors tabular-nums"
            >
              {phone}
            </a>
          </div>
        </div>
      </div>

      {/* Main Header — eski düzen, sadeleştirilmiş UI */}
      <header
        className={cn(
          'sticky top-0 z-50 relative overflow-x-visible transition-all duration-300',
          'border-b border-aq-border/70',
          'bg-white/92 backdrop-blur-xl supports-[backdrop-filter]:bg-white/85',
          isScrolled ? 'shadow-[0_4px_20px_rgba(7,24,39,0.04)]' : 'shadow-none',
        )}
      >
        <div className="page-container min-w-0 !py-0">
          {/* ——— Mobile header ——— */}
          <div className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center gap-2 h-[56px]">
            <HeaderIconButton
              label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-[18px] h-[18px]" strokeWidth={2.1} />
              ) : (
                <Menu className="w-[18px] h-[18px]" strokeWidth={2.1} />
              )}
            </HeaderIconButton>

            <Link
              to="/"
              className="flex justify-center min-w-0 px-1"
              aria-label="Aquails Ana Sayfa"
            >
              <BrandLogo variant="logo" bare className="text-[0.92rem] gap-[0.30em]" />
            </Link>

            <div className="flex items-center gap-1.5">
              <HeaderIconButton
                label="Ara"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-[17px] h-[17px]" strokeWidth={2.1} />
              </HeaderIconButton>
              <HeaderIconButton
                href="/karsilastir"
                label="Karşılaştır"
                badge={compareCount}
                badgeTone="dark"
              >
                <GitCompare className="w-[17px] h-[17px]" strokeWidth={2.1} />
              </HeaderIconButton>
              <HeaderIconButton
                label="Sepet"
                onClick={toggleDrawer}
                badge={cartCount}
                badgeTone="primary"
              >
                <ShoppingBagIcon />
              </HeaderIconButton>
            </div>
          </div>

          {/* ——— Desktop header ——— */}
          <div className="hidden lg:flex items-center justify-between gap-3 h-16">
            <Link to="/" className="flex items-center flex-shrink-0 min-w-0" aria-label="Aquails Ana Sayfa">
              <BrandLogo variant="logo" bare className="text-[1.12rem] gap-[0.36em]" />
            </Link>

            <nav className="flex items-center gap-0.5">
              {navLinks.map(link => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.hasMega && openMega()}
                  onMouseLeave={() => link.hasMega && closeMega()}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'px-3 py-1.5 text-[13px] font-medium rounded-full transition-colors flex items-center gap-1',
                      location.pathname === link.href || (link.hasMega && isMegaOpen)
                        ? 'text-aq-deep bg-aq-sky'
                        : 'text-aq-muted hover:text-aq-text hover:bg-aq-ice/80',
                    )}
                  >
                    {link.label}
                    {link.hasMega && (
                      <ChevronDown
                        className={cn('w-3 h-3 transition-transform duration-300', isMegaOpen ? 'rotate-180' : '')}
                      />
                    )}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div ref={searchRef} className="relative">
                <HeaderIconButton label="Ara" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                  <Search className="w-[16px] h-[16px]" strokeWidth={2.1} />
                </HeaderIconButton>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      onSubmit={handleSearch}
                      className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-aq-border/60 rounded-2xl shadow-sm p-2 z-50"
                    >
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                        <input
                          autoFocus
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                          placeholder="Ürün, kategori ara..."
                          className="w-full pl-9 pr-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                        />
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <HeaderIconButton href="/karsilastir" label="Karşılaştır" badge={compareCount} badgeTone="dark">
                <GitCompare className="w-[16px] h-[16px]" strokeWidth={2.1} />
              </HeaderIconButton>

              <HeaderIconButton href={isAuthenticated ? '/hesabim/favoriler' : '/giris'} label="Favoriler" badge={favCount} badgeTone="danger">
                <Heart className="w-[16px] h-[16px]" strokeWidth={2.1} />
              </HeaderIconButton>

              <HeaderIconButton label="Sepet" onClick={toggleDrawer} badge={cartCount}>
                <ShoppingBagIcon className="w-[16px] h-[16px]" />
              </HeaderIconButton>

              {isAuthenticated && user ? (
                <div className="relative ml-1">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-aq-ice transition-colors"
                  >
                    <div className="w-8 h-8 bg-aq-blue rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {user.name[0]}
                    </div>
                    <span className="hidden md:block text-[12px] font-medium text-aq-text max-w-[80px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-white border border-aq-border/60 rounded-xl shadow-sm z-50 py-1.5"
                        >
                          <div className="px-3 py-2 border-b border-aq-border/60">
                            <p className="text-sm font-semibold text-aq-text truncate">{user.name}</p>
                            <p className="text-[11px] text-aq-muted truncate">{user.email}</p>
                          </div>
                          <Link to="/hesabim" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-aq-muted hover:bg-aq-ice hover:text-aq-text"><User className="w-3.5 h-3.5" />Hesabım</Link>
                          <Link to="/hesabim/siparisler" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-aq-muted hover:bg-aq-ice hover:text-aq-text"><ShoppingCart className="w-3.5 h-3.5" />Siparişlerim</Link>
                          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#E85454] hover:bg-red-50 w-full"><LogOut className="w-3.5 h-3.5" />Çıkış Yap</button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-1.5">
                  <Link
                    to="/giris"
                    className="text-[12px] font-medium text-aq-muted hover:text-aq-text px-2.5 py-1.5 rounded-full hover:bg-aq-ice transition-all"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/iletisim"
                    className="text-[12px] font-semibold text-white bg-aq-blue px-3.5 py-1.5 rounded-full hover:bg-aq-deep transition-all"
                  >
                    İletişime Geç
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mega Menu - Desktop */}
        <AnimatePresence>
          {isMegaOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
              className="hidden lg:block absolute left-0 right-0 top-full z-40"
            >
              <div className="border-b border-aq-border/50 bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-28px_rgba(6,38,61,0.35)]">
                <div className="h-px bg-gradient-to-r from-transparent via-aq-aqua/50 to-transparent" />
                <div className="page-container py-7">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Featured rail */}
                    <div className="col-span-3 relative overflow-hidden rounded-2xl bg-[#061b2c] px-5 py-6 text-white">
                      <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-aq-aqua/20 blur-2xl" />
                      <div className="pointer-events-none absolute -bottom-10 left-0 h-28 w-28 rounded-full bg-aq-blue/25 blur-2xl" />
                      <p className="relative text-[10px] font-semibold uppercase tracking-[0.2em] text-aq-aqua/80">
                        Katalog
                      </p>
                      <h3 className="relative mt-3 text-lg font-semibold leading-snug tracking-tight">
                        İhtiyacına uygun sistemi bul
                      </h3>
                      <p className="relative mt-2 text-[12px] leading-relaxed text-white/50">
                        Kategorilerden seç veya sihirbazla 1 dakikada öneri al.
                      </p>
                      <div className="relative mt-5 flex flex-col gap-2">
                        <Link
                          to="/urunler"
                          onClick={() => setIsMegaOpen(false)}
                          className="inline-flex items-center justify-between rounded-xl bg-white px-3.5 py-2.5 text-[13px] font-semibold text-aq-deep transition-colors hover:bg-aq-sky"
                        >
                          Tüm ürünler
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <Link
                          to="/urun-secim-sihirbazi"
                          onClick={() => setIsMegaOpen(false)}
                          className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3.5 py-2.5 text-[13px] font-medium text-white/85 transition-colors hover:border-aq-aqua/40 hover:text-aq-aqua"
                        >
                          <Wand2 className="h-3.5 w-3.5" />
                          Ürün sihirbazı
                        </Link>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="col-span-9">
                      <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-aq-muted/70">
                            Kategoriler
                          </p>
                          <p className="mt-1 text-sm text-aq-muted">
                            {categories.length} kategori · hızlı filtre
                          </p>
                        </div>
                        <Link
                          to="/kampanyalar"
                          onClick={() => setIsMegaOpen(false)}
                          className="text-[12px] font-medium text-aq-blue hover:text-aq-deep transition-colors"
                        >
                          Kampanyalar →
                        </Link>
                      </div>

                      <div className="grid grid-cols-3 xl:grid-cols-4 gap-2">
                        {categories.map((cat, i) => {
                          const Icon = getCategoryIcon(cat.icon);
                          return (
                            <motion.div
                              key={cat.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: Math.min(i * 0.03, 0.2) }}
                            >
                              <Link
                                to={`/urunler?kategori=${cat.id}`}
                                onClick={() => setIsMegaOpen(false)}
                                className="group flex items-start gap-3 rounded-2xl border border-transparent px-3 py-3 transition-all duration-250 hover:border-aq-border/70 hover:bg-aq-ice/80 hover:shadow-[0_8px_24px_-16px_rgba(18,134,216,0.35)]"
                              >
                                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-aq-sky text-aq-blue transition-all duration-300 group-hover:bg-aq-blue group-hover:text-white group-hover:scale-105">
                                  <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
                                </span>
                                <span className="min-w-0 pt-0.5">
                                  <span className="block text-[13px] font-semibold text-aq-text leading-snug group-hover:text-aq-deep">
                                    {cat.name}
                                  </span>
                                  <span className="mt-0.5 block text-[11px] text-aq-muted">
                                    {cat.productCount} ürün
                                  </span>
                                </span>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-aq-deep/40 backdrop-blur-[2px] z-[60] lg:hidden"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.form
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleSearch}
              className="fixed top-[calc(36px+56px+10px)] left-3 right-3 z-[61] lg:hidden"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-sm ring-1 ring-aq-border p-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ürün veya kategori ara..."
                  className="w-full pl-10 pr-4 py-3.5 text-sm rounded-xl bg-aq-ice border border-aq-border/60 focus:outline-none focus:border-aq-blue"
                />
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-aq-deep/45 backdrop-blur-[3px] z-[70] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 left-0 bottom-0 w-[min(320px,90vw)] z-[71] lg:hidden flex flex-col overflow-hidden"
            >
              <div className="relative flex-shrink-0 px-5 pt-5 pb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-aq-ice/95 via-white/90 to-white/95 backdrop-blur-xl" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-aq-border to-transparent" />
                <div className="relative flex items-center justify-between gap-3">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-w-0 flex-1"
                  >
                    <BrandLogo variant="logo" bare className="text-[1.02rem] gap-[0.34em]" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Menüyü kapat"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-aq-border text-aq-muted hover:text-aq-text hover:bg-white transition-all active:scale-95"
                  >
                    <X className="w-5 h-5" strokeWidth={2.25} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white/95 backdrop-blur-xl">
                <div className="p-5 pt-4">
                  {isAuthenticated && user && (
                    <div className="flex items-center gap-3 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-aq-ice to-white ring-1 ring-aq-border/80">
                      <div className="w-10 h-10 bg-gradient-to-br from-aq-blue to-aq-deep rounded-full flex items-center justify-center text-white font-semibold shadow-sm">{user.name[0]}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-aq-text truncate">{user.name}</p>
                        <p className="text-[11px] text-aq-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                      <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-3 text-sm border border-aq-border/60 rounded-2xl bg-aq-ice/80 focus:outline-none focus:border-aq-blue focus:bg-white transition-colors"
                      />
                    </div>
                  </form>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Link
                      to={isAuthenticated ? '/hesabim/favoriler' : '/giris'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-aq-ice ring-1 ring-aq-border/80 hover:ring-aq-deep/20 transition-all"
                    >
                      <Heart className="w-[18px] h-[18px] text-[#E85454]" strokeWidth={2.1} />
                      <span className="text-[10px] font-semibold text-aq-muted">Favori{favCount > 0 ? ` (${favCount})` : ''}</span>
                    </Link>
                    <Link
                      to="/karsilastir"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-aq-ice ring-1 ring-aq-border/80 hover:ring-aq-deep/20 transition-all"
                    >
                      <GitCompare className="w-[18px] h-[18px] text-aq-blue" strokeWidth={2.1} />
                      <span className="text-[10px] font-semibold text-aq-muted">
                        Karşılaştır{compareCount > 0 ? ` (${compareCount})` : ''}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => { toggleDrawer(); setIsMobileMenuOpen(false); }}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-aq-ice ring-1 ring-aq-border/80 hover:ring-aq-deep/20 transition-all"
                    >
                      <ShoppingBagIcon className="w-[18px] h-[18px] text-aq-blue" />
                      <span className="text-[10px] font-semibold text-aq-muted">Sepet{cartCount > 0 ? ` (${cartCount})` : ''}</span>
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navLinks.map((link, i) => (
                      <motion.div key={link.label} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link
                          to={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-2xl transition-all',
                            location.pathname === link.href
                              ? 'bg-aq-sky text-aq-blue ring-1 ring-aq-blue/20'
                              : 'text-aq-muted hover:bg-aq-ice hover:text-aq-text',
                          )}
                        >
                          {link.label}
                          <ChevronRight className="w-4 h-4 opacity-35" strokeWidth={2.25} />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-2xl text-aq-muted hover:bg-aq-ice transition-colors ring-1 ring-transparent hover:ring-aq-border"
                    >
                      <span>Kategoriler</span>
                      <ChevronDown className={cn('w-4 h-4 transition-transform', mobileCatsOpen ? 'rotate-180' : '')} />
                    </button>
                    <AnimatePresence>
                      {mobileCatsOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 pb-1 space-y-1 px-1">
                            {categories.map(cat => {
                              const Icon = getCategoryIcon(cat.icon);
                              return (
                                <Link
                                  key={cat.id}
                                  to={`/urunler?kategori=${cat.id}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-aq-muted hover:bg-aq-ice hover:text-aq-blue rounded-2xl transition-colors"
                                >
                                  <span className="w-9 h-9 rounded-xl bg-aq-sky flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-aq-blue" />
                                  </span>
                                  <span className="flex-1 min-w-0">
                                    <span className="block truncate font-medium text-aq-text">{cat.name}</span>
                                    <span className="text-[11px] text-aq-muted">{cat.productCount} ürün</span>
                                  </span>
                                  <ChevronRight className="w-3.5 h-3.5 opacity-30" />
                                </Link>
                              );
                            })}
                            <Link
                              to="/urun-secim-sihirbazi"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-aq-blue font-medium rounded-2xl hover:bg-aq-sky/60 transition-colors"
                            >
                              <span className="w-9 h-9 rounded-xl bg-aq-blue/10 flex items-center justify-center flex-shrink-0">
                                <Wand2 className="w-4 h-4 text-aq-blue" />
                              </span>
                              Ürün seçim sihirbazı
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-3 pt-3 border-t border-aq-border/60 flex flex-col gap-1">
                    <Link to="/siparis-takip" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl text-aq-muted hover:bg-aq-ice transition-colors">
                      <span className="flex items-center gap-2.5"><Package className="w-4 h-4" />Sipariş Takip</span>
                      <ChevronRight className="w-4 h-4 opacity-35" />
                    </Link>
                    <Link to="/filtre-aboneligi" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl text-aq-muted hover:bg-aq-ice transition-colors">
                      <span className="flex items-center gap-2.5"><Filter className="w-4 h-4" />Filtre Aboneliği</span>
                      <ChevronRight className="w-4 h-4 opacity-35" />
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-aq-border/60 flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <Link to="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-aq-muted hover:bg-aq-ice rounded-2xl"><User className="w-4 h-4" />Hesabım</Link>
                        <button type="button" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-[#E85454] hover:bg-red-50 rounded-2xl text-left"><LogOut className="w-4 h-4" />Çıkış Yap</button>
                      </>
                    ) : (
                      <>
                        <Link to="/giris" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 border-2 border-aq-deep text-aq-text py-3 rounded-full text-sm font-semibold">Giriş Yap</Link>
                        <Link to="/iletisim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-aq-blue text-white py-3 rounded-xl text-sm font-semibold shadow-sm">İletişime Geç</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/** Modern outline shopping bag icon */
function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn('w-[19px] h-[19px]', className)}
      aria-hidden
    >
      <path
        d="M6 8h12l-1.2 11H7.2L6 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6.5a3 3 0 0 1 6 0V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
