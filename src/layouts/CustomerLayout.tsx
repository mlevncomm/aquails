import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, MapPin, User, Heart, Filter,
  Wrench, Lock, LogOut, Bell, ExternalLink, Menu, X,
  RefreshCw, RotateCcw, GitCompare, Tag, ChevronRight, Award, Users,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutService } from '@/services/authService';
import { getUnreadCount } from '@/services/notificationService';

const menuItems = [
  { label: 'Dashboard', href: '/hesabim', icon: LayoutDashboard },
  { label: 'Siparişlerim', href: '/hesabim/siparisler', icon: ShoppingBag },
  { label: 'Adreslerim', href: '/hesabim/adresler', icon: MapPin },
  { label: 'Profilim', href: '/hesabim/profil', icon: User },
  { label: 'Favorilerim', href: '/hesabim/favoriler', icon: Heart },
  { label: 'Karşılaştırma', href: '/hesabim/karsilastirma', icon: GitCompare },
  { label: 'Filtre Takibi', href: '/hesabim/filtre-takibi', icon: Filter },
  { label: 'Aboneliklerim', href: '/hesabim/abonelikler', icon: RefreshCw },
  { label: 'Servis Taleplerim', href: '/hesabim/servis-talepleri', icon: Wrench },
  { label: 'İade/Değişim', href: '/hesabim/iade-degisim', icon: RotateCcw },
  { label: 'Kuponlarım', href: '/hesabim/kuponlarim', icon: Tag },
  { label: 'Puanlarım', href: '/hesabim/puanlarim', icon: Award },
  { label: 'Arkadaş Davet Et', href: '/hesabim/davet-et', icon: Users },
  { label: 'Bildirimlerim', href: '/hesabim/bildirimler', icon: Bell },
  { label: 'Şifre Değiştir', href: '/hesabim/sifre-degistir', icon: Lock },
];

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getUnreadCount(user.id).then(setUnreadCount);
  }, [user, location.pathname]);

  const handleLogout = () => {
    logoutService();
    clearUser();
    navigate('/', { replace: true });
  };

  // Mobil menü açıkken sayfa scroll'unu engelle
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const profileInitial = (user?.name || 'A')[0];
  const currentPageTitle = menuItems.find((m) => m.href === location.pathname)?.label || 'Dashboard';

  return (
    <div className="min-h-[100dvh] flex bg-[#F0F6FF] overflow-x-hidden">
      {/* Mobil Overlay - Sidebar arkası karartma */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-[260px] bg-white border-r border-[#E8F0FE] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 w-8 h-8 bg-[#F0F6FF] hover:bg-[#E8F0FE] rounded-lg flex items-center justify-center text-[#5A6B7B] transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-4 pb-3 border-b border-[#E8F0FE]">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <BrandLogo variant="logo" className="h-7" />
          </Link>
        </div>

        {/* User Summary */}
        <Link
          to="/hesabim/profil"
          onClick={() => setMobileOpen(false)}
          className="block p-4 mx-4 mt-4 bg-[#F8FBFF] rounded-xl hover:bg-[#F0F6FF] transition-colors"
        >
          <div className="w-12 h-12 bg-[#1A73E8] rounded-full flex items-center justify-center mx-auto">
            <span className="text-lg font-bold text-white">{profileInitial}</span>
          </div>
          <p className="text-sm font-semibold text-[#0D2137] text-center mt-3 truncate">{user?.name || 'Ahmet Yılmaz'}</p>
          <p className="text-xs text-[#8B9DAF] text-center truncate">{user?.email || 'ahmet@email.com'}</p>
        </Link>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-0.5 mt-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl text-[13px] font-medium transition-all relative min-h-[44px]',
                location.pathname === item.href
                  ? 'bg-[#F0F6FF] text-[#1A73E8]'
                  : 'text-[#5A6B7B] hover:bg-[#F8FBFF] hover:text-[#0D2137]'
              )}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.label === 'Bildirimlerim' && unreadCount > 0 && (
                <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">{unreadCount}</span>
              )}
              {location.pathname === item.href && <ChevronRight className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#E8F0FE]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 bg-red-50 hover:bg-red-100 transition-colors min-h-[44px]"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Responsive */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-[#E8F0FE] flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          {/* Left: Menu + Profile + Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F0F6FF] text-[#5A6B7B] transition-colors flex-shrink-0"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/hesabim/profil"
              className="w-9 h-9 bg-[#1A73E8] rounded-full flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-[#1A73E8]/30 transition-all"
              aria-label="Profilim"
              title="Profilim"
            >
              <span className="text-sm font-bold text-white">{profileInitial}</span>
            </Link>
            <h2 className="text-sm sm:text-base font-semibold text-[#0D2137] truncate min-w-0">
              {currentPageTitle}
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Bildirim */}
            <Link
              to="/hesabim/bildirimler"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F0F6FF] transition-colors text-[#8B9DAF]"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>

            {/* Siteye Dön - sm ve üzeri */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#1A73E8] hover:underline font-medium px-2 py-2 rounded-lg hover:bg-[#F0F6FF] transition-colors"
            >
              Siteye Dön <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto overflow-x-hidden w-full bg-[#F7FAFF] relative min-w-0">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1A73E8]/[0.02] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-[#4FC3F7]/[0.025] rounded-full blur-3xl pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
