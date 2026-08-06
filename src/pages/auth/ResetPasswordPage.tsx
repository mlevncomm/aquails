import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { getSupabaseOrNull } from '@/lib/supabase';
import { updatePassword } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import { AuthBrand } from '@/layouts/AuthLayout';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseOrNull();
    if (!supabase) {
      setInvalid(true);
      return;
    }

    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      } else {
        setInvalid(true);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (session && event === 'SIGNED_IN')) {
        setReady(true);
        setInvalid(false);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      addToast('Şifre en az 6 karakter olmalıdır.', 'error');
      return;
    }
    if (password !== confirm) {
      addToast('Şifreler eşleşmiyor.', 'error');
      return;
    }
    setLoading(true);
    const res = await updatePassword(password);
    setLoading(false);
    if (res.success) {
      addToast('Şifreniz güncellendi. Giriş yapabilirsiniz.', 'success');
      navigate('/giris', { replace: true });
    } else {
      addToast(res.error || 'Şifre güncellenemedi.', 'error');
    }
  };

  return (
    <div className="w-full">
      <AuthBrand />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 p-7 sm:p-8 shadow-[0_30px_80px_-40px_rgba(6,38,61,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aq-aqua/15 blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aq-blue/70">Hesap</p>
          <h1 className="mt-2 font-[Poppins,ui-sans-serif,sans-serif] text-2xl font-semibold tracking-tight text-aq-deep">
            Yeni Şifre Belirle
          </h1>
          <p className="mt-2 mb-7 text-sm leading-relaxed text-aq-muted">
            E-posta bağlantısından geldiniz. Yeni şifrenizi belirleyin.
          </p>

          {invalid && !ready ? (
            <div className="space-y-4">
              <p className="text-sm text-aq-muted">
                Geçersiz veya süresi dolmuş bağlantı. Lütfen yeni bir sıfırlama e-postası isteyin.
              </p>
              <Link
                to="/sifremi-unuttum"
                className="inline-flex w-full justify-center rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] py-3.5 text-sm font-semibold text-white"
              >
                Şifre Sıfırlama İste
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-aq-muted">Yeni Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full rounded-2xl border border-aq-border/70 bg-white/80 py-3 pl-11 pr-11 text-sm focus:border-aq-blue/50 focus:outline-none focus:ring-4 focus:ring-aq-aqua/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-aq-muted">Şifre Tekrar</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="w-full rounded-2xl border border-aq-border/70 bg-white/80 py-3 pl-11 pr-4 text-sm focus:border-aq-blue/50 focus:outline-none focus:ring-4 focus:ring-aq-aqua/15"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !ready}
                className="w-full rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(18,134,216,0.75)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
