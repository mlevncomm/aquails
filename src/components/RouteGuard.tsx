import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';

const CUSTOMER_ROUTES = ['/hesabim', '/hesabim/siparisler', '/hesabim/siparisler/', '/hesabim/adresler', '/hesabim/profil', '/hesabim/favoriler', '/hesabim/filtre-takibi', '/hesabim/servis-talepleri', '/hesabim/sifre-degistir'];
const ADMIN_ROUTES = ['/admin'];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    const path = location.pathname;

    const isCustomerRoute = CUSTOMER_ROUTES.some(r => path === r || (r.endsWith('/') && path.startsWith(r)));
    const isAdminRoute = ADMIN_ROUTES.some(r => path.startsWith(r));

    if (isCustomerRoute && !isAuthenticated) {
      navigate(`/giris?redirect=${encodeURIComponent(path)}`, { replace: true });
    } else if (isAdminRoute && !isAdmin) {
      navigate(`/giris?redirect=${encodeURIComponent(path)}`, { replace: true });
    }
  }, [location.pathname, isAuthenticated, isAdmin, hasHydrated, navigate]);

  return <>{children}</>;
}
