import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import { AuthBrand } from '@/layouts/AuthLayout';

export default function ForgotPasswordPage() {
  const addToast = useToastStore((s) => s.add);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('E-posta adresinizi girin.', 'error');
      return;
    }
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) setSent(true);
    else addToast(res.error || 'Bir hata oluştu.', 'error');
  };

  return (
    <div className="w-full">
      <AuthBrand />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 p-7 sm:p-8 shadow-[0_30px_80px_-40px_rgba(6,38,61,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aq-aqua/15 blur-3xl" />
        <div className="relative">
          {!sent ? (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aq-blue/70">Hesap</p>
              <h1 className="mt-2 font-[Poppins,ui-sans-serif,sans-serif] text-2xl font-semibold tracking-tight text-aq-deep">
                Şifremi Unuttum
              </h1>
              <p className="mt-2 mb-7 text-sm leading-relaxed text-aq-muted">
                E-posta adresinize şifre sıfırlama bağlantısı gönderelim.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-aq-muted">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      className="w-full rounded-2xl border border-aq-border/70 bg-white/80 py-3 pl-11 pr-4 text-sm focus:border-aq-blue/50 focus:outline-none focus:ring-4 focus:ring-aq-aqua/15"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(18,134,216,0.75)] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>
            </>
          ) : (
            <div className="py-2 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-aq-sky">
                <CheckCircle className="h-7 w-7 text-aq-blue" />
              </div>
              <h2 className="mb-2 text-lg font-semibold text-aq-deep">Bağlantı Gönderildi</h2>
              <p className="mb-2 text-sm text-aq-muted">
                <span className="font-medium text-aq-text">{email}</span> adresine şifre sıfırlama
                bağlantısı gönderildi.
              </p>
            </div>
          )}

          <Link
            to="/giris"
            className="mt-6 flex items-center justify-center gap-1.5 border-t border-aq-border/50 pt-5 text-xs font-semibold text-aq-blue hover:text-aq-deep"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  );
}
