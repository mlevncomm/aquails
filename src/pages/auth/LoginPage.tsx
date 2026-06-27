import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Droplets, Mail, Eye, EyeOff } from 'lucide-react';
import { login } from '@/services/authService';
import { useToastStore } from '@/components/Toast';


export default function LoginPage() {
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.add);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { addToast('Lütfen tüm alanları doldurun.', 'error'); return; }
    setLoading(true);
    const res = await login({ email, password });
    setLoading(false);
    if (res.success && res.user) {
      addToast(`Hoş geldiniz, ${res.user.name}!`, 'success');
      navigate(res.user.role === 'admin' ? '/admin' : '/hesabim', { replace: true });
    } else {
      addToast(res.error || 'Giriş başarısız.', 'error');
    }
  };

  return (
    <div className="w-full max-w-[400px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Droplets className="w-8 h-8 text-[#1A73E8]" />
          <span className="text-2xl font-bold text-[#0D2137]">aquails</span>
        </Link>

        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-7 shadow-sm">
          <h1 className="text-xl font-bold text-[#0D2137] mb-1">Giriş Yap</h1>
          <p className="text-sm text-[#8B9DAF] mb-6">Hesabınıza giriş yaparak devam edin.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF]" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Şifre</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" className="w-full pl-4 pr-10 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B9DAF] hover:text-[#0D2137] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-[#5A6B7B] cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-[#1A73E8] rounded" /> Beni hatırla
              </label>
              <Link to="/sifremi-unuttum" className="text-xs text-[#1A73E8] hover:underline font-medium">Şifremi unuttum</Link>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>

            <button type="button" onClick={() => { setEmail('admin@aquails.com'); setPassword('admin123'); }} className="w-full border border-[#E8F0FE] text-[#5A6B7B] py-2 rounded-full text-xs font-medium hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">
              Google ile Giriş Yap (Deneme)
            </button>
          </form>

          <p className="text-center text-xs text-[#8B9DAF] mt-5">
            Hesabınız yok mu? <Link to="/kayit-ol" className="text-[#1A73E8] font-semibold hover:underline">Kayıt Ol</Link>
          </p>

          <div className="mt-4 pt-4 border-t border-[#F0F6FF] space-y-1 text-[10px] text-[#8B9DAF]">
            <p>Demo: <strong>ahmet@email.com</strong> / <strong>123456</strong> (Müşteri)</p>
            <p>Demo: <strong>admin@aquails.com</strong> / <strong>admin123</strong> (Admin)</p>
          </div>
        </div>
      </div>
  );
}
