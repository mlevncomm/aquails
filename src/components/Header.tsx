import { useState, useEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShoppingCart, Menu, X, Phone,
  Heart, ChevronRight, LogOut, Search, GitCompare,
  ChevronDown, Package, Droplet, Zap, Monitor, Coffee,
  Building2, Filter, CircleDot, Settings, Wrench,
  Plug, Sparkles, ChefHat, Activity, Home
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCompareStore } from '@/stores/compareStore';
import { logout } from '@/services/authService';
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
    primary: 'bg-[#1A73E8] text-white shadow-[0_2px_8px_rgba(26,115,232,0.35)]',
    danger: 'bg-[#E85454] text-white shadow-[0_2px_8px_rgba(232,84,84,0.35)]',
    dark: 'bg-[#0D2137] text-white',
  };

  const inner = (
    <>
      {children}
      {badge != null && badge > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center leading-none',
            badgeColors[badgeTone],
          )}
        >
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </>
  );

  const baseClass = cn(
    'relative flex items-center justify-center rounded-2xl transition-all duration-200',
    'text-[#3D5166] hover:text-[#1A73E8]',
    'bg-[#F4F8FF]/90 ring-1 ring-[#E8F0FE]/90',
    'hover:bg-white hover:ring-[#1A73E8]/20 hover:shadow-sm',
    'active:scale-[0.94]',
    'w-10 h-10 lg:w-9 lg:h-9 lg:rounded-xl',
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
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleDrawer, getTotalItems } = useCartStore();
  const { isAuthenticated, user, clearUser } = useAuthStore();
  const favCount = useFavoritesStore(s => s.ids.length);
  const compareCount = useCompareStore(s => s.ids.length);
  const cartCount = getTotalItems();
  const searchRef = useRef<HTMLDivElement>(null);

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
      {/* Top Bar */}
      <div className="bg-[#0D2137] text-white overflow-x-hidden">
        <div className="max-w-[1280px] mx-auto px-4 h-8 flex items-center justify-between text-[11px] min-w-0 gap-2">
          <p className="text-[#8B9DAF] truncate min-w-0">Ücretsiz Kargo — 1.500₺ ve üzeri siparişlerde</p>
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/siparis-takip" className="text-[#8B9DAF] hover:text-white transition-colors">Sipariş Takip</Link>
            <span className="text-[#1A3A5C]">|</span>
            <p className="text-[#8B9DAF] flex items-center gap-1.5"><Phone className="w-3 h-3" /> 0850 123 45 67</p>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          'sticky top-0 z-50 overflow-x-hidden transition-all duration-300',
          'border-b border-[#E8F0FE]/70',
          'bg-white/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/65',
          isScrolled
            ? 'shadow-[0_8px_30px_rgba(13,33,55,0.06)] border-[#E8F0FE]'
            : 'shadow-none',
        )}
      >
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 min-w-0">
          {/* ——— Mobile header ——— */}
          <div className="lg:hidden grid grid-cols-[auto_1fr_auto] items-center gap-2 h-[58px]">
            <HeaderIconButton
              label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-[20px] h-[20px]" strokeWidth={2.25} />
              ) : (
                <Menu className="w-[20px] h-[20px]" strokeWidth={2.25} />
              )}
            </HeaderIconButton>

            <Link
              to="/"
              className="flex justify-center min-w-0 px-1"
              aria-label="Aquails Ana Sayfa"
            >
              <BrandLogo variant="logo" bare className="h-[26px] w-auto max-w-[140px]" />
            </Link>

            <div className="flex items-center gap-1.5">
              <HeaderIconButton
                label="Ara"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-[19px] h-[19px]" strokeWidth={2.1} />
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
          <div className="hidden lg:flex items-center justify-between gap-2 h-16">
            <Link to="/" className="flex items-center flex-shrink-0 min-w-0 mr-2">
              <BrandLogo variant="logo" bare className="h-8" />
            </Link>

            <nav className="flex items-center gap-0.5">
              {navLinks.map(link => (
                <div key={link.label} className="relative" onMouseEnter={() => link.hasMega && setIsMegaOpen(true)} onMouseLeave={() => link.hasMega && setIsMegaOpen(false)}>
                  <Link to={link.href} className={cn('relative px-3 py-2 text-[13px] font-medium rounded-lg transition-colors flex items-center gap-1', location.pathname === link.href ? 'text-[#1A73E8] bg-[#F0F6FF]' : 'text-[#5A6B7B] hover:text-[#0D2137] hover:bg-[#F8FBFF]')}>
                    {link.label}
                    {link.hasMega && <ChevronDown className={cn('w-3 h-3 transition-transform', isMegaOpen ? 'rotate-180' : '')} />}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-1 flex-shrink-0">
              <div ref={searchRef} className="relative">
                <HeaderIconButton label="Ara" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                  <Search className="w-[18px] h-[18px]" strokeWidth={2.1} />
                </HeaderIconButton>
                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.form initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} onSubmit={handleSearch} className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-[#E8F0FE] rounded-2xl shadow-xl p-2 z-50">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                        <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün, kategori ara..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <HeaderIconButton href="/karsilastir" label="Karşılaştır" badge={compareCount} badgeTone="dark">
                <GitCompare className="w-[18px] h-[18px]" strokeWidth={2.1} />
              </HeaderIconButton>

              <HeaderIconButton href={isAuthenticated ? '/hesabim/favoriler' : '/giris'} label="Favoriler" badge={favCount} badgeTone="danger">
                <Heart className="w-[18px] h-[18px]" strokeWidth={2.1} />
              </HeaderIconButton>

              <HeaderIconButton label="Sepet" onClick={toggleDrawer} badge={cartCount}>
                <ShoppingBagIcon className="w-[18px] h-[18px]" />
              </HeaderIconButton>

              {isAuthenticated && user ? (
                <div className="relative ml-1">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#F0F6FF] transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">{user.name[0]}</div>
                    <span className="hidden md:block text-[12px] font-medium text-[#0D2137] max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8F0FE] rounded-xl shadow-xl z-50 py-1.5">
                          <div className="px-3 py-2 border-b border-[#F0F6FF]">
                            <p className="text-sm font-semibold text-[#0D2137] truncate">{user.name}</p>
                            <p className="text-[11px] text-[#8B9DAF] truncate">{user.email}</p>
                          </div>
                          <Link to="/hesabim" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#0D2137]"><User className="w-3.5 h-3.5" />Hesabım</Link>
                          <Link to="/hesabim/siparisler" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#0D2137]"><ShoppingCart className="w-3.5 h-3.5" />Siparişlerim</Link>
                          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-[13px] text-[#E85454] hover:bg-red-50 w-full"><LogOut className="w-3.5 h-3.5" />Çıkış Yap</button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-1 ml-1">
                  <Link to="/giris" className="text-[12px] font-medium text-[#5A6B7B] hover:text-[#1A73E8] px-3 py-1.5 rounded-lg hover:bg-[#F0F6FF] transition-all">Giriş</Link>
                  <Link to="/kayit-ol" className="text-[12px] font-semibold text-white bg-[#1A73E8] px-3.5 py-1.5 rounded-full hover:bg-[#1557B0] transition-all shadow-sm">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0D2137]/40 backdrop-blur-[2px] z-[60] lg:hidden"
              onClick={() => setIsSearchOpen(false)}
            />
            <motion.form
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleSearch}
              className="fixed top-[calc(32px+58px+8px)] left-3 right-3 z-[61] lg:hidden"
            >
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl ring-1 ring-[#E8F0FE] p-2">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Ürün veya kategori ara..."
                  className="w-full pl-10 pr-4 py-3.5 text-sm rounded-xl bg-[#F8FBFF] border border-[#E8F0FE] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>
            </motion.form>
          </>
        )}
      </AnimatePresence>

      {/* Mega Menu - Desktop */}
      <AnimatePresence>
        {isMegaOpen && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} onMouseEnter={() => setIsMegaOpen(true)} onMouseLeave={() => setIsMegaOpen(false)} className="hidden lg:block fixed left-0 right-0 top-[64px] z-40 bg-white border-b border-[#E8F0FE] shadow-lg">
            <div className="max-w-[1280px] mx-auto px-4 py-6">
              <div className="grid grid-cols-7 gap-3">
                {categories.map(cat => {
                  const Icon = getCategoryIcon(cat.icon);
                  return (
                    <Link
                      key={cat.id}
                      to={`/urunler?kategori=${cat.id}`}
                      onClick={() => setIsMegaOpen(false)}
                      className="group p-4 rounded-xl hover:bg-[#F8FBFF] transition-all"
                    >
                      <div className="w-10 h-10 bg-[#F0F6FF] rounded-xl flex items-center justify-center mb-3 group-hover:bg-[#1A73E8] transition-colors">
                        <Icon className="w-5 h-5 text-[#1A73E8] group-hover:text-white transition-colors" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#0D2137] mb-1">{cat.name}</h4>
                      <p className="text-xs text-[#8B9DAF]">{cat.productCount} ürün</p>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-[#F0F6FF] flex items-center justify-between">
                <p className="text-xs text-[#8B9DAF]">Tüm ürünleri keşfedin: <Link to="/urunler" onClick={() => setIsMegaOpen(false)} className="text-[#1A73E8] font-medium hover:underline">Tüm Ürünler</Link></p>
                <Link to="/kampanyalar" onClick={() => setIsMegaOpen(false)} className="text-xs font-medium text-[#1A73E8] hover:underline">Tüm Kampanyalar →</Link>
              </div>
            </div>
          </motion.div>
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
              className="fixed inset-0 bg-[#0D2137]/45 backdrop-blur-[3px] z-[70] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 left-0 bottom-0 w-[min(320px,90vw)] z-[71] lg:hidden flex flex-col overflow-hidden"
            >
              {/* Drawer header — şeffaf logo alanı */}
              <div className="relative flex-shrink-0 px-5 pt-5 pb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-[#EBF4FF]/95 via-white/90 to-[#F0F8FF]/95 backdrop-blur-xl" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E8F0FE] to-transparent" />
                <div className="relative flex items-center justify-between gap-3">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="min-w-0 flex-1"
                  >
                    <BrandLogo variant="logo" bare className="h-9 w-auto max-w-[180px] bg-transparent" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Menüyü kapat"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 ring-1 ring-[#E8F0FE] text-[#5A6B7B] hover:text-[#0D2137] hover:bg-white transition-all active:scale-95"
                  >
                    <X className="w-5 h-5" strokeWidth={2.25} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white/95 backdrop-blur-xl">
                <div className="p-5 pt-4">
                  {isAuthenticated && user && (
                    <div className="flex items-center gap-3 mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-[#F0F6FF] to-[#F8FBFF] ring-1 ring-[#E8F0FE]/80">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-full flex items-center justify-center text-white font-semibold shadow-sm">{user.name[0]}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#0D2137] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#8B9DAF] truncate">{user.email}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSearch} className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                      <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Ara..."
                        className="w-full pl-10 pr-4 py-3 text-sm border border-[#E8F0FE] rounded-2xl bg-[#F8FBFF]/80 focus:outline-none focus:border-[#1A73E8] focus:bg-white transition-colors"
                      />
                    </div>
                  </form>

                  {/* Hızlı aksiyonlar */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Link
                      to={isAuthenticated ? '/hesabim/favoriler' : '/giris'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#F8FBFF] ring-1 ring-[#E8F0FE]/80 hover:ring-[#1A73E8]/20 transition-all"
                    >
                      <Heart className="w-[18px] h-[18px] text-[#E85454]" strokeWidth={2.1} />
                      <span className="text-[10px] font-semibold text-[#5A6B7B]">Favori{favCount > 0 ? ` (${favCount})` : ''}</span>
                    </Link>
                    <Link
                      to="/karsilastir"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#F8FBFF] ring-1 ring-[#E8F0FE]/80 hover:ring-[#1A73E8]/20 transition-all"
                    >
                      <GitCompare className="w-[18px] h-[18px] text-[#1A73E8]" strokeWidth={2.1} />
                      <span className="text-[10px] font-semibold text-[#5A6B7B]">Karşılaştır</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => { toggleDrawer(); setIsMobileMenuOpen(false); }}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-[#F8FBFF] ring-1 ring-[#E8F0FE]/80 hover:ring-[#1A73E8]/20 transition-all"
                    >
                      <ShoppingBagIcon className="w-[18px] h-[18px] text-[#1A73E8]" />
                      <span className="text-[10px] font-semibold text-[#5A6B7B]">Sepet{cartCount > 0 ? ` (${cartCount})` : ''}</span>
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
                              ? 'bg-[#1A73E8]/10 text-[#1A73E8] ring-1 ring-[#1A73E8]/15'
                              : 'text-[#5A6B7B] hover:bg-[#F8FBFF] hover:text-[#0D2137]',
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
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-2xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors ring-1 ring-transparent hover:ring-[#E8F0FE]"
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
                          <div className="pt-1 pb-1 space-y-0.5">
                            {categories.map(cat => {
                              const Icon = getCategoryIcon(cat.icon);
                              return (
                                <Link
                                  key={cat.id}
                                  to={`/urunler?kategori=${cat.id}`}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] hover:text-[#1A73E8] rounded-xl transition-colors"
                                >
                                  <span className="w-8 h-8 rounded-xl bg-[#F0F6FF] flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-4 h-4 text-[#1A73E8]" />
                                  </span>
                                  <span className="flex-1 truncate">{cat.name}</span>
                                  <span className="text-[11px] text-[#8B9DAF]">{cat.productCount}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#F0F6FF] flex flex-col gap-1">
                    <Link to="/siparis-takip" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors">
                      <span className="flex items-center gap-2.5"><Package className="w-4 h-4" />Sipariş Takip</span>
                      <ChevronRight className="w-4 h-4 opacity-35" />
                    </Link>
                    <Link to="/filtre-aboneligi" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-2xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors">
                      <span className="flex items-center gap-2.5"><Filter className="w-4 h-4" />Filtre Aboneliği</span>
                      <ChevronRight className="w-4 h-4 opacity-35" />
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#F0F6FF] flex flex-col gap-2">
                    {isAuthenticated ? (
                      <>
                        <Link to="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] rounded-2xl"><User className="w-4 h-4" />Hesabım</Link>
                        <button type="button" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-sm text-[#E85454] hover:bg-red-50 rounded-2xl text-left"><LogOut className="w-4 h-4" />Çıkış Yap</button>
                      </>
                    ) : (
                      <>
                        <Link to="/giris" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 border-2 border-[#1A73E8] text-[#1A73E8] py-3 rounded-full text-sm font-semibold">Giriş Yap</Link>
                        <Link to="/kayit-ol" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3 rounded-full text-sm font-semibold shadow-sm">Kayıt Ol</Link>
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
