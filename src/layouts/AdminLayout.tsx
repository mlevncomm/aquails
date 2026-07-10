import { Link, useLocation, Outlet, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Wrench, Filter,
  Tag, Settings, LogOut, Menu, X, ChevronDown,
  BookOpen, Star, HelpCircle, RefreshCw, FileText,
  Link2, Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { logout } from '@/services/authService';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
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
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Ürün Yönetimi', 'Siparişler', 'Servis']);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const isActive = (href: string, children?: MenuItem['children']) =>
    location.pathname === href || children?.some((c) => location.pathname === c.href);

  const sidebarWidth = collapsed ? 'w-[72px]' : 'w-[260px]';

  return (
    <div className="min-h-[100dvh] flex bg-slate-50">
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-slate-200 flex flex-col transition-all duration-300',
          sidebarWidth,
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden absolute top-3 right-3 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="px-4 py-5 border-b border-slate-100">
          <Link to="/admin" className="flex items-center gap-3 px-1" onClick={() => setMobileOpen(false)}>
            <img src="/images/brand/aquails-icon.png" alt="Aquails" className="w-9 h-9 rounded-xl flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <img src="/images/brand/aquails-logo-dark.png" alt="Aquails" className="h-5 w-auto" />
                <p className="text-[11px] text-slate-400 mt-0.5">Yönetim Paneli</p>
              </div>
            )}
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.href, item.children);
            return (
              <div key={item.label}>
                {item.children ? (
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]',
                      active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      'justify-between',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', active && 'text-sky-600')} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0',
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
                      'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors min-h-[44px]',
                      active ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    <item.icon className={cn('w-[18px] h-[18px] flex-shrink-0', active && 'text-sky-600')} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )}

                {item.children && expandedMenus.includes(item.label) && !collapsed && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-100 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'block px-3 py-2 text-[12px] rounded-lg transition-colors min-h-[36px] flex items-center',
                          location.pathname === child.href
                            ? 'text-sky-700 bg-sky-50 font-medium'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50',
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

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-sky-700">{(user?.name ?? 'A')[0]}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-slate-800 truncate">{user?.name ?? 'Admin'}</p>
                <p className="text-[11px] text-slate-400">
                  {user?.role === 'super_admin' ? 'Süper Admin' : 'Admin'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => { logout(); navigate('/giris'); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 mt-1 rounded-xl text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
            {!collapsed && 'Çıkış Yap'}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center z-10 shadow-sm"
        >
          <ChevronDown className={cn('w-3 h-3 text-slate-500 transition-transform', collapsed ? '-rotate-90' : 'rotate-90')} />
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600"
              aria-label="Menüyü aç"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-sm sm:text-base font-semibold text-slate-800">Yönetim Paneli</h2>
          </div>
          <div className="w-9 h-9 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
            <span className="text-sm font-semibold text-sky-700">{(user?.name ?? 'A')[0]}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
