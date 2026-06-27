import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Wrench, Filter,
  Tag, Settings, LogOut, Menu, X, Bell, Search, ChevronDown,
  BookOpen, Star, HelpCircle, RefreshCw, FileText,
  Link2, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notificationStore';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { label: 'Gösterge Paneli', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Ürün Yönetimi',
    href: '/admin/urunler',
    icon: Package,
    children: [
      { label: 'Ürün Listesi', href: '/admin/urunler' },
      { label: 'Kategoriler', href: '/admin/kategoriler' },
      { label: 'Stok', href: '/admin/stok' },
      { label: 'Stok Bildirimleri', href: '/admin/stok-bildirimleri' },
    ],
  },
  {
    label: 'Siparişler',
    href: '/admin/siparisler',
    icon: ShoppingCart,
    children: [
      { label: 'Tüm Siparişler', href: '/admin/siparisler' },
      { label: 'İade/Değişim', href: '/admin/iade-degisim' },
    ],
  },
  { label: 'Müşteriler', href: '/admin/musteriler', icon: Users },
  { label: 'Kampanyalar', href: '/admin/kampanyalar', icon: Tag },
  { label: 'Kuponlar', href: '/admin/kuponlar', icon: Tag },
  { label: 'Blog', href: '/admin/blog', icon: BookOpen },
  { label: 'Yorumlar', href: '/admin/yorumlar', icon: Star },
  { label: 'Sorular', href: '/admin/sorular', icon: HelpCircle },
  { label: 'Sadakat', href: '/admin/sadakat', icon: Award },
  { label: 'Terk Edilmiş Sepetler', href: '/admin/terk-edilmis-sepetler', icon: ShoppingCart },
  {
    label: 'Servis',
    href: '/admin/servis-talepleri',
    icon: Wrench,
    children: [
      { label: 'Talepler', href: '/admin/servis-talepleri' },
      { label: 'Takvim', href: '/admin/servis-takvimi' },
    ],
  },
  { label: 'Filtre Takibi', href: '/admin/filtre-takibi', icon: Filter },
  { label: 'Abonelikler', href: '/admin/abonelikler', icon: RefreshCw },
  { label: 'Raporlar', href: '/admin/raporlar', icon: FileText },
  { label: 'Link Sayfası', href: '/admin/linkler', icon: Link2 },
  { label: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Ürün Yönetimi', 'Siparişler', 'Servis']);
  const { unreadCount } = useNotificationStore();

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]';

  // Mobil menü açıkken sayfa scroll'unu engelle
  if (typeof document !== 'undefined') {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }

  return (
    <div className="min-h-[100dvh] flex bg-[#F0F6FF] relative">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1A73E8]/[0.015] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-[260px] w-[300px] h-[300px] bg-[#00D4C8]/[0.01] rounded-full blur-3xl pointer-events-none" />

      {/* Mobil Overlay - Sidebar arkası karartma */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-[#0D2137] flex flex-col transition-all duration-300 ease-in-out',
          sidebarWidth,
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile Close Button - Sidebar içinde üst köşede */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white/80 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="px-4 py-4 border-b border-[#1A3A5C]">
          <Link to="/admin" className="flex items-center gap-2 px-2" onClick={() => setMobileOpen(false)}>
            <img
              src="/images/brand/aquails-icon.png"
              alt="Aquails"
              className="w-8 h-8 rounded-lg flex-shrink-0"
            />
            {!collapsed && (
              <div className="min-w-0">
                <img
                  src="/images/brand/aquails-logo-dark.png"
                  alt="Aquails"
                  className="h-5 w-auto"
                />
                <p className="text-[10px] text-[#8B9DAF] mt-0.5">Yönetim Paneli</p>
              </div>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.label}>
              <button
                onClick={() => item.children ? toggleMenu(item.label) : undefined}
                className={cn(
                  'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-[13px] font-medium transition-all min-h-[44px]',
                  location.pathname === item.href || item.children?.some(c => location.pathname === c.href)
                    ? 'bg-[#1A73E8]/15 text-white'
                    : 'text-[#8B9DAF] hover:bg-white/5 hover:text-white',
                  item.children && 'justify-between'
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', (location.pathname === item.href || item.children?.some(c => location.pathname === c.href)) ? 'text-[#1A73E8]' : '')} />
                  {!collapsed && <span>{item.label}</span>}
                </div>
                {item.children && !collapsed && (
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform flex-shrink-0', expandedMenus.includes(item.label) && 'rotate-180')} />
                )}
                {item.badge && !collapsed && (
                  <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">{item.badge}</span>
                )}
              </button>

              {item.children && expandedMenus.includes(item.label) && !collapsed && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'block px-3 py-2.5 text-[12px] rounded-lg transition-colors min-h-[40px] flex items-center',
                        location.pathname === child.href ? 'text-white bg-[#1A73E8]/10' : 'text-[#8B9DAF] hover:text-white'
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[#1A3A5C]">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-9 h-9 bg-[#1A73E8] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-white">A</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-white truncate">Admin</p>
                <p className="text-[11px] text-[#8B9DAF]">Süper Admin</p>
              </div>
            )}
          </div>
          <button className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-xl text-[13px] font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors min-h-[44px]">
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && 'Çıkış Yap'}
          </button>
        </div>

        {/* Collapse Toggle - Desktop only */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E8F0FE] rounded-full items-center justify-center z-10 shadow-sm"
        >
          <ChevronDown className={cn('w-3 h-3 text-[#5A6B7B] transition-transform', collapsed ? '-rotate-90' : 'rotate-90')} />
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Responsive */}
        <header className="h-14 bg-white border-b border-[#E8F0FE] flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30">
          {/* Left: Menu Button + Title */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F0F6FF] text-[#5A6B7B] transition-colors"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-semibold text-[#0D2137] truncate">
              Yönetim Paneli
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search - hidden on very small screens */}
            <div className="relative hidden xs:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
              <input
                type="text"
                placeholder="Ara..."
                className="pl-9 pr-4 py-2 text-sm bg-[#F8FBFF] border border-[#E8F0FE] rounded-lg focus:outline-none focus:border-[#1A73E8] w-36 sm:w-48 transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#F0F6FF] transition-colors text-[#8B9DAF]">
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount() > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
              )}
            </button>

            {/* Avatar */}
            <div className="w-9 h-10 bg-[#1A73E8]/10 rounded-full flex items-center justify-center border-2 border-[#E8F0FE]">
              <span className="text-sm font-semibold text-[#1A73E8]">A</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}