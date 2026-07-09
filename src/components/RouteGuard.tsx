import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/authStore';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    const path = location.pathname;
    const isCustomerRoute = path.startsWith('/hesabim');
    const isAdminRoute = path.startsWith('/admin');

    if (isCustomerRoute && !isAuthenticated) {
      navigate('/giris', { replace: true });
    } else if (isAdminRoute && !isAdmin) {
      navigate('/', { replace: true });
    }
  }, [location.pathname, isAuthenticated, isAdmin, hasHydrated, navigate]);

  return <>{children}</>;
}
