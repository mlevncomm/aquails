import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();
  const addToast = useToastStore((s) => s.add);

  const path = location.pathname;
  const isCustomerRoute = path.startsWith('/hesabim');
  const isAdminRoute = path.startsWith('/admin');
  const isCheckoutRoute = path === '/odeme';
  const isAuthRoute =
    path === '/giris' || path === '/kayit-ol' || path === '/sifremi-unuttum' || path === '/sifre-sifirla';
  const isProtected = isCustomerRoute || isAdminRoute || isCheckoutRoute;

  useEffect(() => {
    // Public pages never wait on auth hydration for redirects.
    if (!isProtected && !isAuthRoute) return;
    if (!hasHydrated) return;

    if ((isCustomerRoute || isCheckoutRoute) && !isAuthenticated) {
      const redirect = encodeURIComponent(path + location.search);
      navigate(`/giris?redirect=${redirect}`, { replace: true });
      return;
    }

    if (isAdminRoute && !isAdmin) {
      if (isAuthenticated) {
        addToast('Bu sayfaya erişim yetkiniz yok.', 'error');
        navigate('/hesabim', { replace: true });
      } else {
        navigate(`/giris?redirect=${encodeURIComponent(path)}`, { replace: true });
      }
      return;
    }

    if (isAuthRoute && isAuthenticated && path !== '/sifremi-unuttum' && path !== '/sifre-sifirla') {
      navigate(isAdmin ? '/admin' : '/hesabim', { replace: true });
    }
  }, [
    path,
    location.search,
    isAuthenticated,
    isAdmin,
    hasHydrated,
    navigate,
    addToast,
    isCustomerRoute,
    isAdminRoute,
    isCheckoutRoute,
    isAuthRoute,
    isProtected,
  ]);

  // Only block UI while hydrating on routes that actually need auth state.
  if (!hasHydrated && (isProtected || isAuthRoute)) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <Loader2 className="w-7 h-7 animate-spin text-aq-blue" />
      </div>
    );
  }

  if (hasHydrated && isProtected && !isAuthenticated) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <Loader2 className="w-7 h-7 animate-spin text-aq-blue" />
      </div>
    );
  }

  if (hasHydrated && isAdminRoute && !isAdmin) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-white">
        <Loader2 className="w-7 h-7 animate-spin text-aq-blue" />
      </div>
    );
  }

  return <>{children}</>;
}
