import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Droplets, Lock, Eye, EyeOff } from 'lucide-react';
import { getSupabaseOrNull } from '@/lib/supabase';
import { updatePassword } from '@/services/authService';
import { useToastStore } from '@/components/Toast';

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
    <div className="w-full max-w-[400px]">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <Droplets className="w-8 h-8 text-aq-blue" />
        <span className="text-2xl font-bold text-aq-text">aquails</span>
      </Link>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-8">
        <h1 className="text-xl font-semibold text-aq-text mb-1">Yeni Şifre Belirle</h1>
        <p className="text-sm text-aq-muted mb-8">
          E-posta bağlantısından geldiniz. Yeni şifrenizi belirleyin.
        </p>

        {invalid && !ready ? (
          <div className="space-y-4">
            <p className="text-sm text-aq-muted">
              Geçersiz veya süresi dolmuş bağlantı. Lütfen yeni bir sıfırlama e-postası isteyin.
            </p>
            <Link
              to="/sifremi-unuttum"
              className="inline-flex w-full justify-center bg-aq-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all"
            >
              Şifre Sıfırlama İste
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Yeni Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-aq-muted mb-1.5 block">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Şifrenizi tekrar girin"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !ready}
              className="w-full bg-aq-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
