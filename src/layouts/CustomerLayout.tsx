import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router';
import {
  LayoutDashboard, ShoppingBag, MapPin, User, Heart, Filter,
  Wrench, Lock, LogOut, Bell, ExternalLink, Menu, X,
  RefreshCw, RotateCcw, GitCompare, Tag, Award, Users,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout as logoutService } from '@/services/authService';
import { getUnreadCount } from '@/services/notificationService';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: 'notifications';
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: 'Genel',
    items: [{ label: 'Özet', href: '/hesabim', icon: LayoutDashboard }],
  },
  {
    label: 'Alışveriş',
    items: [
      { label: 'Siparişlerim', href: '/hesabim/siparisler', icon: ShoppingBag },
      { label: 'Favorilerim', href: '/hesabim/favoriler', icon: Heart },
      { label: 'Karşılaştırma', href: '/hesabim/karsilastirma', icon: GitCompare },
      { label: 'Kuponlarım', href: '/hesabim/kuponlarim', icon: Tag },
    ],
  },
  {
    label: 'Servis',
    items: [
      { label: 'Filtre Takibi', href: '/hesabim/filtre-takibi', icon: Filter },
      { label: 'Aboneliklerim', href: '/hesabim/abonelikler', icon: RefreshCw },
      { label: 'Servis Taleplerim', href: '/hesabim/servis-talepleri', icon: Wrench },
      { label: 'İade / Değişim', href: '/hesabim/iade-degisim', icon: RotateCcw },
    ],
  },
  {
    label: 'Kazanç',
    items: [
      { label: 'Puanlarım', href: '/hesabim/puanlarim', icon: Award },
      { label: 'Arkadaş Davet Et', href: '/hesabim/davet-et', icon: Users },
    ],
  },
  {
    label: 'Hesap',
    items: [
      { label: 'Profilim', href: '/hesabim/profil', icon: User },
      { label: 'Adreslerim', href: '/hesabim/adresler', icon: MapPin },
      { label: 'Bildirimlerim', href: '/hesabim/bildirimler', icon: Bell, badge: 'notifications' },
      { label: 'Şifre Değiştir', href: '/hesabim/sifre-degistir', icon: Lock },
    ],
  },
];

const PAGE_TITLES: { match: string | RegExp; title: string }[] = [
  { match: /^\/hesabim\/siparisler\/[^/]+$/, title: 'Sipariş Detayı' },
  { match: '/hesabim/siparisler', title: 'Siparişlerim' },
  { match: '/hesabim/adresler', title: 'Adreslerim' },
  { match: '/hesabim/profil', title: 'Profilim' },
  { match: '/hesabim/favoriler', title: 'Favorilerim' },
  { match: '/hesabim/filtre-takibi', title: 'Filtre Takibi' },
  { match: '/hesabim/servis-talepleri', title: 'Servis Taleplerim' },
  { match: '/hesabim/sifre-degistir', title: 'Şifre Değiştir' },
  { match: '/hesabim/abonelikler', title: 'Aboneliklerim' },
  { match: '/hesabim/iade-degisim', title: 'İade / Değişim' },
  { match: '/hesabim/bildirimler', title: 'Bildirimlerim' },
  { match: '/hesabim/kuponlarim', title: 'Kuponlarım' },
  { match: '/hesabim/karsilastirma', title: 'Karşılaştırma' },
  { match: '/hesabim/puanlarim', title: 'Puanlarım' },
  { match: '/hesabim/davet-et', title: 'Arkadaş Davet Et' },
  { match: '/hesabim', title: 'Hesabım' },
];

function resolvePageTitle(pathname: string): string {
  for (const entry of PAGE_TITLES) {
    if (typeof entry.match === 'string') {
      if (
        pathname === entry.match ||
        (entry.match !== '/hesabim' && pathname.startsWith(`${entry.match}/`))
      ) {
        return entry.title;
      }
    } else if (entry.match.test(pathname)) {
      return entry.title;
    }
  }
  return 'Hesabım';
}

function isNavActive(pathname: string, href: string) {
  if (href === '/hesabim') return pathname === '/hesabim';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CustomerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(
    () => resolvePageTitle(location.pathname),
    [location.pathname],
  );

  useEffect(() => {
    if (!user) return;
    void getUnreadCount(user.id).then(setUnreadCount);
  }, [user, location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logoutService();
    clearUser();
    navigate('/', { replace: true });
  };

  const profileInitial = (user?.name || user?.email || 'A')[0].toUpperCase();
  const displayName = user?.name || 'Hesabım';
  const displayEmail = user?.email || '';

  return (
    <div className="min-h-[100dvh] flex bg-aq-ice overflow-x-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-aq-deep/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-[264px] bg-white border-r border-aq-border/60 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 w-9 h-9 bg-aq-ice hover:bg-aq-sky rounded-xl flex items-center justify-center text-aq-muted z-10"
          aria-label="Menüyü kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 pb-4 border-b border-aq-border/60">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
            <BrandLogo variant="logo" className="h-7" />
          </Link>
        </div>

        <Link
          to="/hesabim/profil"
          onClick={() => setMobileOpen(false)}
          className="mx-4 mt-4 p-3.5 rounded-2xl bg-aq-ice/80 border border-aq-border/40 hover:border-aq-blue/30 hover:bg-aq-sky/40 transition-colors"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-aq-deep rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base font-semibold text-white">{profileInitial}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-aq-text truncate">{displayName}</p>
              {displayEmail && (
                <p className="text-xs text-aq-muted truncate mt-0.5">{displayEmail}</p>
              )}
            </div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-aq-muted/80">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isNavActive(location.pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all relative min-h-[44px]',
                        active
                          ? 'bg-aq-sky/70 text-aq-blue'
                          : 'text-aq-muted hover:bg-aq-ice hover:text-aq-text',
                      )}
                    >
                      <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge === 'notifications' && unreadCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center flex-shrink-0">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-aq-border/60 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-aq-muted hover:bg-aq-ice hover:text-aq-blue transition-colors min-h-[44px]"
          >
            <ExternalLink className="w-[18px] h-[18px] flex-shrink-0" />
            Siteye Dön
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white/92 backdrop-blur-xl border-b border-aq-border/50 flex items-center justify-between px-3 sm:px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-aq-ice text-aq-muted transition-colors flex-shrink-0"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[11px] text-aq-muted hidden sm:block">Hesabım</p>
              <h2 className="text-sm sm:text-base font-semibold text-aq-text truncate leading-tight">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/hesabim/bildirimler"
              className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-aq-ice transition-colors text-aq-muted"
              aria-label="Bildirimler"
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </Link>
            <Link
              to="/hesabim/profil"
              className="w-9 h-9 bg-aq-deep rounded-full flex items-center justify-center flex-shrink-0 hover:ring-2 hover:ring-aq-aqua/30 transition-all"
              aria-label="Profilim"
            >
              <span className="text-sm font-semibold text-white">{profileInitial}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden w-full max-w-[1400px] mx-auto min-w-0 bg-aq-ice">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
