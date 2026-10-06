import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Menu, X, ChevronDown,
  Wrench, Megaphone, Headphones, Boxes,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/services/authService';

interface MenuChild {
  label: string;
  href: string;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: MenuChild[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Katalog',
    href: '/admin/urunler',
    icon: Package,
    children: [
      { label: 'Ürün Listesi', href: '/admin/urunler' },
      { label: 'Ürün Yükleme', href: '/admin/urun-yukleme' },
      { label: 'Toplu Fiyat', href: '/admin/toplu-fiyat' },
      { label: 'Kategoriler', href: '/admin/kategoriler' },
      { label: 'Stok', href: '/admin/stok' },
      { label: 'Stok Bildirimleri', href: '/admin/stok-bildirimleri' },
    ],
  },
  {
    label: 'Sipariş & CRM',
    href: '/admin/siparisler',
    icon: ShoppingCart,
    children: [
      { label: 'Tüm Siparişler', href: '/admin/siparisler' },
      { label: 'İade/Değişim', href: '/admin/iade-degisim' },
      { label: 'Müşteriler', href: '/admin/musteriler' },
      { label: 'Terk Edilmiş Sepetler', href: '/admin/terk-edilmis-sepetler' },
    ],
  },
  {
    label: 'Pazarlama',
    href: '/admin/kampanyalar',
    icon: Megaphone,
    children: [
      { label: 'Kampanyalar', href: '/admin/kampanyalar' },
      { label: 'Kuponlar', href: '/admin/kuponlar' },
      { label: 'Blog', href: '/admin/blog' },
      { label: 'Sadakat', href: '/admin/sadakat' },
    ],
  },
  {
    label: 'İçerik & Destek',
    href: '/admin/yorumlar',
    icon: Headphones,
    children: [
      { label: 'Yorumlar', href: '/admin/yorumlar' },
      { label: 'Sorular', href: '/admin/sorular' },
      { label: 'İletişim Mesajları', href: '/admin/mesajlar' },
    ],
  },
  {
    label: 'Servis & Abonelik',
    href: '/admin/servis-talepleri',
    icon: Wrench,
    children: [
      { label: 'Servis Talepleri', href: '/admin/servis-talepleri' },
      { label: 'Servis Takvimi', href: '/admin/servis-takvimi' },
      { label: 'Filtre Takibi', href: '/admin/filtre-takibi' },
      { label: 'Abonelikler', href: '/admin/abonelikler' },
    ],
  },
  {
    label: 'Operasyon',
    href: '/admin/kargo',
    icon: Boxes,
    children: [
      { label: 'Kargo Modülü', href: '/admin/kargo' },
      { label: 'Raporlar', href: '/admin/raporlar' },
      { label: 'Link Sayfası', href: '/admin/linkler' },
    ],
  },
  {
    label: 'Sistem',
    href: '/admin/ayarlar',
    icon: Settings,
    children: [
      { label: 'Ödeme Ayarları', href: '/admin/odeme-ayarlari' },
      { label: 'Ayarlar', href: '/admin/ayarlar' },
    ],
  },
];

/** Exact and prefix matches for header title. Longer prefixes win. */
const PAGE_TITLES: { match: string | RegExp; title: string }[] = [
  { match: /^\/admin\/urunler\/ekle$/, title: 'Yeni Ürün' },
  { match: /^\/admin\/urunler\/[^/]+$/, title: 'Ürün Düzenle' },
  { match: /^\/admin\/siparisler\/[^/]+$/, title: 'Sipariş Detayı' },
  { match: '/admin/urun-yukleme', title: 'Ürün Yükleme' },
  { match: '/admin/toplu-fiyat', title: 'Toplu Fiyat' },
  { match: '/admin/kategoriler', title: 'Kategoriler' },
  { match: '/admin/stok-bildirimleri', title: 'Stok Bildirimleri' },
  { match: '/admin/stok', title: 'Stok' },
  { match: '/admin/urunler', title: 'Ürünler' },
  { match: '/admin/iade-degisim', title: 'İade / Değişim' },
  { match: '/admin/siparisler', title: 'Siparişler' },
  { match: '/admin/musteriler', title: 'Müşteriler' },
  { match: '/admin/terk-edilmis-sepetler', title: 'Terk Edilmiş Sepetler' },
  { match: '/admin/kampanyalar', title: 'Kampanyalar' },
  { match: '/admin/kuponlar', title: 'Kuponlar' },
  { match: '/admin/blog', title: 'Blog' },
  { match: '/admin/sadakat', title: 'Sadakat' },
  { match: '/admin/yorumlar', title: 'Yorumlar' },
  { match: '/admin/sorular', title: 'Sorular' },
  { match: '/admin/mesajlar', title: 'İletişim Mesajları' },
  { match: '/admin/servis-talepleri', title: 'Servis Talepleri' },
  { match: '/admin/servis-takvimi', title: 'Servis Takvimi' },
  { match: '/admin/filtre-takibi', title: 'Filtre Takibi' },
  { match: '/admin/abonelikler', title: 'Abonelikler' },
  { match: '/admin/kargo', title: 'Kargo' },
  { match: '/admin/raporlar', title: 'Raporlar' },
  { match: '/admin/linkler', title: 'Link Yönetimi' },
  { match: '/admin/odeme-ayarlari', title: 'Ödeme Ayarları' },
  { match: '/admin/ayarlar', title: 'Ayarlar' },
  { match: '/admin', title: 'Dashboard' },
];

function resolvePageTitle(pathname: string): string {
  for (const entry of PAGE_TITLES) {
    if (typeof entry.match === 'string') {
      if (
        pathname === entry.match ||
        (entry.match !== '/admin' && pathname.startsWith(`${entry.match}/`))
      ) {
        return entry.title;
      }
    } else if (entry.match.test(pathname)) {
      return entry.title;
    }
  }
  return 'Yönetim Paneli';
}

function pathMatchesChild(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === '/admin/urunler' && pathname.startsWith('/admin/urunler/')) return true;
  if (href === '/admin/siparisler' && pathname.startsWith('/admin/siparisler/')) return true;
  return false;
}

function isGroupActive(pathname: string, item: MenuItem) {
  if (!item.children) return pathname === item.href;
  return item.children.some((c) => pathMatchesChild(pathname, c.href));
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([
    'Katalog',
    'Sipariş & CRM',
  ]);

  const pageTitle = useMemo(() => resolvePageTitle(location.pathname), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    const activeGroup = menuItems.find((item) => item.children && isGroupActive(location.pathname, item));
    if (activeGroup && !collapsed) {
      setExpandedMenus((prev) =>
        prev.includes(activeGroup.label) ? prev : [...prev, activeGroup.label],
      );
    }
  }, [location.pathname, collapsed]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]';
  const profileInitial = (user?.name ?? 'A')[0];

  return (
    <div className="min-h-[100dvh] flex bg-[#F4F7FA] overflow-x-hidden">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-aq-ink/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 lg:h-[100dvh] inset-y-0 left-0 z-50 bg-aq-ink flex flex-col transition-all duration-300',
          sidebarWidth,
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/80 z-10"
          aria-label="Menüyü kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-4 py-5 border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-3 px-1" onClick={() => setMobileOpen(false)}>
            {collapsed ? (
              <BrandLogo variant="icon" inverted className="text-2xl flex-shrink-0" />
            ) : (
              <div className="min-w-0">
                <BrandLogo variant="logo" bare inverted className="text-[0.92rem] gap-[0.30em]" />
                <p className="text-[11px] text-white/50 mt-1.5">Yönetim Paneli</p>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isGroupActive(location.pathname, item);
            return (
              <div key={item.label}>
                {item.children ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed) {
                        navigate(item.href);
                        setCollapsed(false);
                        setExpandedMenus((prev) =>
                          prev.includes(item.label) ? prev : [...prev, item.label],
                        );
                        return;
                      }
                      toggleMenu(item.label);
                    }}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-full text-[13px] font-medium transition-colors min-h-[44px]',
                      active ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white',
                      'justify-between',
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', active && 'text-aq-mist')} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 text-white/40 transition-transform flex-shrink-0',
                          expandedMenus.includes(item.label) && 'rotate-180',
                        )}
                      />
                    )}
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-full text-[13px] font-medium transition-colors min-h-[44px]',
                      active ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', active && 'text-aq-mist')} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}

                {item.children && expandedMenus.includes(item.label) && !collapsed && (
                  <div className="ml-5 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'relative block px-3 py-2 text-[12.5px] rounded-lg transition-colors min-h-[38px] flex items-center',
                          pathMatchesChild(location.pathname, child.href)
                            ? 'text-white font-semibold'
                            : 'text-white/50 hover:text-white',
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/admin/ayarlar"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/5 transition-colors min-h-[44px]"
          >
            <div className="w-9 h-9 bg-aq-mist rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-aq-ink">{profileInitial}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[11px] text-white/50">
                  {user?.role === 'super_admin' ? 'Süper Admin' : 'Admin'}
                </p>
              </div>
            )}
          </Link>
          <button
            type="button"
            onClick={() => { logout(); navigate('/giris'); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-full text-[13px] font-medium text-red-300 hover:bg-red-500/10 transition-colors min-h-[44px]"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && 'Çıkış Yap'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white ring-1 ring-aq-border rounded-full items-center justify-center z-10 shadow-soft"
          aria-label={collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
        >
          <ChevronDown className={cn('w-3 h-3 text-aq-muted transition-transform', collapsed ? '-rotate-90' : 'rotate-90')} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/95 backdrop-blur border-b border-aq-border/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-aq-cloud text-aq-ink flex-shrink-0"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-aq-muted font-semibold hidden sm:block">
                Aquails Admin
              </p>
              <h2 className="text-sm sm:text-base font-semibold text-aq-ink truncate leading-tight">
                {pageTitle}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-[13px] font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30 transition-colors"
            >
              Siteyi Görüntüle
            </Link>
            <Link
              to="/admin/ayarlar"
              className="w-9 h-9 bg-aq-ink rounded-full flex items-center justify-center flex-shrink-0 hover:bg-aq-ink-soft transition-colors"
              aria-label="Profil ve Ayarlar"
              title="Profil ve Ayarlar"
            >
              <span className="text-sm font-bold text-white">{profileInitial}</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden w-full max-w-[1600px] mx-auto min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}