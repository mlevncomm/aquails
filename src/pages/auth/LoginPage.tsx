import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Droplets, Mail, Eye, EyeOff } from 'lucide-react';
import { login } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';


export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/hesabim';
  const addToast = useToastStore(s => s.add);
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      const target = isAdmin ? '/admin' : (redirectTo.startsWith('/') ? redirectTo : '/hesabim');
      navigate(target, { replace: true });
    }
  }, [hasHydrated, isAuthenticated, isAdmin, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { addToast('Lütfen tüm alanları doldurun.', 'error'); return; }
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success && res.user) {
      addToast(`Hoş geldiniz, ${res.user.name}!`, 'success');
      const isAdmin = res.user.role === 'admin' || res.user.role === 'super_admin';
      const target = isAdmin ? '/admin' : redirectTo;
      navigate(target.startsWith('/') ? target : '/hesabim', { replace: true });
    } else {
      addToast(res.error || 'Giriş başarısız.', 'error');
    }
  };

  return (
    <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Droplets className="w-8 h-8 text-aq-blue" />
          <span className="text-2xl font-bold text-aq-text">aquails</span>
        </Link>

        <div className="bg-white border border-aq-border/60 rounded-2xl p-8">
          <h1 className="text-xl font-semibold text-aq-text mb-1">Giriş Yap</h1>
          <p className="text-sm text-aq-muted mb-8">Hesabınıza giriş yaparak devam edin.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full pl-10 pr-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className="w-full pl-4 pr-10 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted hover:text-aq-text transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-aq-muted cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-aq-deep rounded" /> Beni hatırla
              </label>
              <Link to="/sifremi-unuttum" className="text-xs text-aq-blue hover:underline font-medium">Şifremi unuttum</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-aq-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-xs text-aq-muted mt-5">
            Hesabınız yok mu? <Link to="/kayit-ol" className="text-aq-blue font-semibold hover:underline">Kayıt Ol</Link>
          </p>
        </div>
      </div>
  );
}
