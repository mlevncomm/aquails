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
          <Droplets className="w-8 h-8 text-[#1A73E8]" />
          <span className="text-2xl font-bold text-[#0D2137]">aquails</span>
        </Link>

        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-7 shadow-sm">
          {!sent ? (
            <>
              <h1 className="text-xl font-bold text-[#0D2137] mb-1">Şifremi Unuttum</h1>
              <p className="text-sm text-[#8B9DAF] mb-6">E-posta adresinize şifre sıfırlama bağlantısı gönderelim.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF]" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-60">
                  {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-[#0D2137] mb-2">Bağlantı Gönderildi</h2>
              <p className="text-sm text-[#5A6B7B] mb-6">{email} adresine şifre sıfırlama bağlantısı gönderildi. Lütfen e-postanızı kontrol edin.</p>
            </div>
          )}

          <Link to="/giris" className="flex items-center justify-center gap-1.5 text-xs text-[#1A73E8] font-medium hover:underline mt-5 pt-5 border-t border-[#F0F6FF]">
            <ArrowLeft className="w-3.5 h-3.5" /> Giriş sayfasına dön
          </Link>
        </div>
      </div>
  );
}
