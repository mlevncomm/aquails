import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Droplets, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { register } from '@/services/authService';
import { trackReferralSignup } from '@/services/referralService';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  const redirectTo = searchParams.get('redirect')
    ? decodeURIComponent(searchParams.get('redirect')!)
    : '/hesabim';
  const addToast = useToastStore((s) => s.add);
  const { isAuthenticated, isAdmin, hasHydrated } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      navigate(isAdmin ? '/admin' : redirectTo.startsWith('/') ? redirectTo : '/hesabim', { replace: true });
    }
  }, [hasHydrated, isAuthenticated, isAdmin, navigate, redirectTo]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Ad soyad girin.';
    if (!form.email.includes('@')) e.email = 'Geçerli e-posta girin.';
    if (!form.phone.trim()) e.phone = 'Telefon girin.';
    if (form.password.length < 6) e.password = 'En az 6 karakter.';
    if (form.password !== form.confirm) e.confirm = 'Şifreler eşleşmiyor.';
    if (!agree) e.agree = 'Sözleşmeyi kabul edin.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
    if (res.success) {
      if (res.requiresEmailConfirmation) {
        addToast('Kayıt oluşturuldu. E-postanızdaki doğrulama bağlantısını açın.', 'success');
        navigate('/giris', { replace: true });
      } else {
        if (refCode) await trackReferralSignup(refCode);
        addToast('Kayıt başarılı! Hoş geldiniz.', 'success');
        navigate(redirectTo.startsWith('/') ? redirectTo : '/hesabim', { replace: true });
      }
    } else {
      addToast(res.error || 'Kayıt başarısız.', 'error');
    }
    setLoading(false);
  };

  // Duz fonksiyon olarak render edilir (bilesen degil); aksi halde her renderda
  // yeni bilesen tipi olusur, input DOM'dan sokulur ve odak kaybolur.
  const renderInput = ({ label, icon: Icon, type = 'text', field, placeholder }: { label: string; icon: React.ElementType; type?: string; field: string; placeholder: string }) => (
    <div>
      <label className="text-xs font-medium text-aq-muted mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
        <input type={type} value={(form as Record<string, string>)[field]} onChange={(e) => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }} placeholder={placeholder} className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice ${errors[field] ? 'border-red-300' : 'border-aq-border/60'}`} />
      </div>
      {errors[field] && <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-[400px]">
      <Link to="/" className="flex items-center justify-center gap-2 mb-8">
        <Droplets className="w-8 h-8 text-aq-blue" />
        <span className="text-2xl font-bold text-aq-text">aquails</span>
      </Link>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-8">
        <h1 className="text-xl font-semibold text-aq-text mb-1">Kayıt Ol</h1>
        <p className="text-sm text-aq-muted mb-8">
          Yeni bir hesap oluşturun.
          {refCode ? <span className="block mt-1 text-aq-blue">Davet kodu: {refCode}</span> : null}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {renderInput({ label: 'Ad Soyad', icon: User, field: 'name', placeholder: 'Adınız Soyadınız' })}
          {renderInput({ label: 'E-posta', icon: Mail, type: 'email', field: 'email', placeholder: 'ornek@email.com' })}
          {renderInput({ label: 'Telefon', icon: Phone, type: 'tel', field: 'phone', placeholder: '05XX XXX XX XX' })}

          <div>
            <label className="text-xs font-medium text-aq-muted mb-1.5 block">Şifre</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} placeholder="En az 6 karakter" className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice ${errors.password ? 'border-red-300' : 'border-aq-border/60'}`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-aq-muted mb-1.5 block">Şifre Tekrar</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
              <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={(e) => { setForm({ ...form, confirm: e.target.value }); setErrors({ ...errors, confirm: '' }); }} placeholder="Şifrenizi tekrar girin" className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/10 bg-aq-ice ${errors.confirm ? 'border-red-300' : 'border-aq-border/60'}`} />
            </div>
            {errors.confirm && <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>}
          </div>

          <label className="flex items-start gap-2 text-xs text-aq-muted cursor-pointer pt-1">
            <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setErrors({ ...errors, agree: '' }); }} className="w-4 h-4 mt-0.5 accent-aq-deep rounded" />
            <span>KVKK ve üyelik sözleşmesini okudum, kabul ediyorum.</span>
          </label>
          {errors.agree && <p className="text-[11px] text-red-500 -mt-2">{errors.agree}</p>}

          <button type="submit" disabled={loading} className="w-full bg-aq-blue text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60">
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="text-center text-xs text-aq-muted mt-5">
          Zaten hesabınız var mı? <Link to="/giris" className="text-aq-blue font-semibold hover:underline">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
