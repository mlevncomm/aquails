import { useState, useEffect, useRef } from 'react';
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

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
    setIsMegaOpen(false);
    setMobileCatsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
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
      <header className={cn('sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E8F0FE]/60 transition-shadow duration-300 overflow-x-hidden', isScrolled ? 'shadow-sm' : '')}>
        <div className="max-w-[1280px] mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 -ml-1 hover:bg-[#F0F6FF] rounded-lg transition-colors flex-shrink-0" aria-label="Menü">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <BrandLogo variant="logo" className="h-8 hidden sm:block" />
            <BrandLogo variant="icon" className="h-8 w-8 sm:hidden" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map(link => (
              <div key={link.label} className="relative" onMouseEnter={() => link.hasMega && setIsMegaOpen(true)} onMouseLeave={() => link.hasMega && setIsMegaOpen(false)}>
                <Link to={link.href} className={cn('relative px-3 py-2 text-[13px] font-medium rounded-lg transition-colors flex items-center gap-1', location.pathname === link.href ? 'text-[#1A73E8] bg-[#F0F6FF]' : 'text-[#5A6B7B] hover:text-[#0D2137] hover:bg-[#F8FBFF]')}>
                  {link.label}
                  {link.hasMega && <ChevronDown className={cn('w-3 h-3 transition-transform', isMegaOpen ? 'rotate-180' : '')} />}
                </Link>
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#1A73E8] transition-all">
                <Search className="w-[18px] h-[18px]" />
              </button>
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.form initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} onSubmit={handleSearch} className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E8F0FE] rounded-xl shadow-xl p-2 z-50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                      <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ürün, kategori ara..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Compare */}
            <Link to="/karsilastir" className="relative w-9 h-9 hidden sm:flex items-center justify-center rounded-lg text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#1A73E8] transition-all">
              <GitCompare className="w-[18px] h-[18px]" />
              {compareCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#0D2137] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{compareCount}</span>}
            </Link>

            {/* Favorites */}
            <Link to={isAuthenticated ? '/hesabim/favoriler' : '/giris'} className="relative w-9 h-9 hidden sm:flex items-center justify-center rounded-lg text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#E85454] transition-all">
              <Heart className="w-[18px] h-[18px]" />
              {favCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E85454] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{favCount}</span>}
            </Link>

            {/* Cart */}
            <button onClick={toggleDrawer} className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#1A73E8] transition-all">
              <ShoppingCart className="w-[18px] h-[18px]" />
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#1A73E8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative ml-1">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#F0F6FF] transition-colors">
                  <div className="w-7 h-7 bg-[#1A73E8] rounded-full flex items-center justify-center text-white text-xs font-semibold">{user.name[0]}</div>
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
              <div className="hidden sm:flex items-center gap-1 ml-1">
                <Link to="/giris" className="text-[12px] font-medium text-[#5A6B7B] hover:text-[#1A73E8] px-3 py-1.5 rounded-lg hover:bg-[#F0F6FF] transition-all">Giriş</Link>
                <Link to="/kayit-ol" className="text-[12px] font-semibold text-white bg-[#1A73E8] px-3.5 py-1.5 rounded-full hover:bg-[#1557B0] transition-all">Kayıt Ol</Link>
              </div>
            )}
          </div>
        </div>
      </header>

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed top-0 left-0 bottom-0 w-[min(300px,88vw)] bg-white z-50 lg:hidden shadow-xl overflow-y-auto overflow-x-hidden">
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <BrandLogo variant="logo" className="h-8" />
                  </Link>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-[#F0F6FF] rounded-lg"><X className="w-5 h-5" /></button>
                </div>

                {isAuthenticated && user && (
                  <div className="flex items-center gap-3 mb-4 p-3 bg-[#F8FBFF] rounded-xl">
                    <div className="w-10 h-10 bg-[#1A73E8] rounded-full flex items-center justify-center text-white font-semibold">{user.name[0]}</div>
                    <div><p className="text-sm font-semibold text-[#0D2137]">{user.name}</p><p className="text-[11px] text-[#8B9DAF]">{user.email}</p></div>
                  </div>
                )}

                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ara..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                  </div>
                </form>

                {/* Main Nav Links */}
                <nav className="flex flex-col gap-0.5">
                  {navLinks.map((link, i) => (
                    <motion.div key={link.label} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)} className={cn('flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors', location.pathname === link.href ? 'bg-[#F0F6FF] text-[#1A73E8]' : 'text-[#5A6B7B] hover:bg-[#F8FBFF]')}>
                        {link.label}
                        <ChevronRight className="w-4 h-4 opacity-40" />
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Categories Accordion */}
                <div className="mt-3">
                  <button
                    onClick={() => setMobileCatsOpen(!mobileCatsOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors"
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
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-3 py-1 space-y-0.5">
                          {categories.map(cat => {
                            const Icon = getCategoryIcon(cat.icon);
                            return (
                              <Link
                                key={cat.id}
                                to={`/urunler?kategori=${cat.id}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] hover:text-[#1A73E8] rounded-xl transition-colors"
                              >
                                <Icon className="w-4 h-4 text-[#8B9DAF]" />
                                <span>{cat.name}</span>
                                <span className="text-[11px] text-[#8B9DAF] ml-auto">({cat.productCount})</span>
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Quick Links */}
                <div className="mt-3 pt-3 border-t border-[#F0F6FF] flex flex-col gap-0.5">
                  <Link to="/siparis-takip" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors">
                    <span className="flex items-center gap-2.5"><Package className="w-4 h-4" />Sipariş Takip</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                  <Link to="/filtre-aboneligi" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl text-[#5A6B7B] hover:bg-[#F8FBFF] transition-colors">
                    <span className="flex items-center gap-2.5"><Filter className="w-4 h-4" />Filtre Aboneliği</span>
                    <ChevronRight className="w-4 h-4 opacity-40" />
                  </Link>
                </div>

                {/* Auth Section */}
                <div className="mt-4 pt-4 border-t border-[#F0F6FF] flex flex-col gap-1.5">
                  {isAuthenticated ? (
                    <>
                      <Link to="/hesabim" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] rounded-xl"><User className="w-4 h-4" />Hesabım</Link>
                      <Link to="/hesabim/favoriler" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] rounded-xl"><Heart className="w-4 h-4" />Favorilerim ({favCount})</Link>
                      <Link to="/karsilastir" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#5A6B7B] hover:bg-[#F8FBFF] rounded-xl"><GitCompare className="w-4 h-4" />Karşılaştırma ({compareCount})</Link>
                      <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#E85454] hover:bg-red-50 rounded-xl text-left"><LogOut className="w-4 h-4" />Çıkış Yap</button>
                    </>
                  ) : (
                    <>
                      <Link to="/giris" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 border-2 border-[#1A73E8] text-[#1A73E8] py-2.5 rounded-full text-sm font-semibold">Giriş Yap</Link>
                      <Link to="/kayit-ol" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold">Kayıt Ol</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
