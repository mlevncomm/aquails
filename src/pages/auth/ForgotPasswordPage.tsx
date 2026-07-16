import { useState } from 'react';
import { Link } from 'react-router';
import { Droplets, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { forgotPassword } from '@/services/authService';
import { useToastStore } from '@/components/Toast';


export default function ForgotPasswordPage() {
  const addToast = useToastStore(s => s.add);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { addToast('E-posta adresinizi girin.', 'error'); return; }
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.success) setSent(true);
    else addToast(res.error || 'Bir hata oluştu.', 'error');
  };

  return (
    <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Droplets className="w-8 h-8 text-aq-blue" />
          <span className="text-2xl font-bold text-aq-text">aquails</span>
        </Link>

        <div className="bg-white border border-aq-border/60 rounded-2xl p-8">
          {!sent ? (
            <>
              <h1 className="text-xl font-semibold text-aq-text mb-1">Şifremi Unuttum</h1>
              <p className="text-sm text-aq-muted mb-8">E-posta adresinize şifre sıfırlama bağlantısı gönderelim.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-1.5 block">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full pl-10 pr-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-aq-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60">
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-aq-blue" />
              </div>
              <h2 className="text-lg font-semibold text-aq-text mb-2">Bağlantı Gönderildi</h2>
              <p className="text-sm text-aq-muted mb-6">{email} adresine şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.</p>
            </div>
          )}

          <Link to="/giris" className="flex items-center justify-center gap-1.5 text-xs text-aq-blue font-medium hover:underline mt-5 pt-5 border-t border-aq-border/60">
            <ArrowLeft className="w-3.5 h-3.5" /> Giriş sayfasına dön
          </Link>
        </div>
      </div>
  );
}
