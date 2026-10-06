import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Mail, Eye, EyeOff, ArrowUpRight, Lock } from 'lucide-react';
import { login } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import { AuthBrand } from '@/layouts/AuthLayout';
import { cn } from '@/lib/utils';

const fieldClass =
  'w-full rounded-2xl border border-aq-border/70 bg-white/80 pl-11 pr-4 py-3 text-sm text-aq-text placeholder:text-aq-muted/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all focus:outline-none focus:border-aq-blue/50 focus:ring-4 focus:ring-aq-aqua/15';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/hesabim';
  const addToast = useToastStore((s) => s.add);
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      const target = isAdmin ? '/admin' : redirectTo.startsWith('/') ? redirectTo : '/hesabim';
      navigate(target, { replace: true });
    }
  }, [hasHydrated, isAuthenticated, isAdmin, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Lütfen tüm alanları doldurun.', 'error');
      return;
    }
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success && res.user) {
      addToast(`Hoş geldiniz, ${res.user.name}!`, 'success');
      const admin = res.user.role === 'admin' || res.user.role === 'super_admin';
      const target = admin ? '/admin' : redirectTo;
      navigate(target.startsWith('/') ? target : '/hesabim', { replace: true });
    } else {
      addToast(res.error || 'Giriş başarısız.', 'error');
    }
  };

  return (
    <div className="w-full">
      <AuthBrand />

      <div className="relative">

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-aq-muted">
            Hesap
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-[-0.02em] text-aq-ink">
            Giriş Yap
          </h1>
          <p className="mt-2 text-sm text-aq-muted leading-relaxed">
            Hesabınıza giriş yaparak siparişlerinizi ve favorilerinizi yönetin.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-aq-muted">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-aq-muted">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={cn(fieldClass, 'pr-11')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted transition-colors hover:text-aq-deep"
                  aria-label={showPass ? 'Şifreyi gizle' : 'Şifreyi göster'}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-0.5">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-aq-muted">
                <input type="checkbox" className="h-4 w-4 rounded accent-aq-deep" />
                Beni hatırla
              </label>
              <Link
                to="/sifremi-unuttum"
                className="text-xs font-semibold text-aq-blue transition-colors hover:text-aq-deep"
              >
                Şifremi unuttum
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5',
                'bg-aq-ink hover:bg-aq-ink-soft text-sm font-semibold text-white',
                'transition-all hover:-translate-y-0.5',
                'disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0',
              )}
            >
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              {!loading && (
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
            </button>
          </form>

          <p className="relative mt-6 text-center text-xs text-aq-muted">
            Hesabınız yok mu?{' '}
            <Link to="/kayit-ol" className="font-semibold text-aq-blue hover:text-aq-deep">
              Kayıt Ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
