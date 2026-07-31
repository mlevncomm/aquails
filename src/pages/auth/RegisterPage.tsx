import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowUpRight } from 'lucide-react';
import { register } from '@/services/authService';
import { trackReferralSignup } from '@/services/referralService';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import { AuthBrand } from '@/layouts/AuthLayout';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-2xl border bg-white/80 pl-11 pr-4 py-3 text-sm text-aq-text placeholder:text-aq-muted/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all focus:outline-none focus:border-aq-blue/50 focus:ring-4 focus:ring-aq-aqua/15';

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

  const renderInput = ({ label, icon: Icon, type = 'text', field, placeholder }: { label: string; icon: React.ElementType; type?: string; field: string; placeholder: string }) => (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-aq-muted">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
        <input
          type={type}
          value={(form as Record<string, string>)[field]}
          onChange={(e) => {
            setForm({ ...form, [field]: e.target.value });
            setErrors({ ...errors, [field]: '' });
          }}
          placeholder={placeholder}
          className={cn(fieldBase, errors[field] ? 'border-red-300' : 'border-aq-border/70')}
        />
      </div>
      {errors[field] && <p className="mt-1 text-[11px] text-red-500">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="w-full">
      <AuthBrand />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/75 p-7 sm:p-8 shadow-[0_30px_80px_-40px_rgba(6,38,61,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-aq-aqua/15 blur-3xl" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aq-blue/70">Hesap</p>
          <h1 className="mt-2 font-[Poppins,ui-sans-serif,sans-serif] text-2xl font-semibold tracking-tight text-aq-deep">
            Kayıt Ol
          </h1>
          <p className="mt-2 text-sm text-aq-muted leading-relaxed">
            Yeni bir Aquails hesabı oluşturun.
            {refCode ? <span className="mt-1 block text-aq-blue">Davet kodu: {refCode}</span> : null}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
            {renderInput({ label: 'Ad Soyad', icon: User, field: 'name', placeholder: 'Adınız Soyadınız' })}
            {renderInput({ label: 'E-posta', icon: Mail, type: 'email', field: 'email', placeholder: 'ornek@email.com' })}
            {renderInput({ label: 'Telefon', icon: Phone, type: 'tel', field: 'phone', placeholder: '05XX XXX XX XX' })}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-aq-muted">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({ ...errors, password: '' });
                  }}
                  placeholder="En az 6 karakter"
                  className={cn(fieldBase, 'pr-11', errors.password ? 'border-red-300' : 'border-aq-border/70')}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aq-muted"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-[11px] text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-aq-muted">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={(e) => {
                    setForm({ ...form, confirm: e.target.value });
                    setErrors({ ...errors, confirm: '' });
                  }}
                  placeholder="Şifrenizi tekrar girin"
                  className={cn(fieldBase, errors.confirm ? 'border-red-300' : 'border-aq-border/70')}
                />
              </div>
              {errors.confirm && <p className="mt-1 text-[11px] text-red-500">{errors.confirm}</p>}
            </div>

            <label className="flex cursor-pointer items-start gap-2 pt-1 text-xs text-aq-muted">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);
                  setErrors({ ...errors, agree: '' });
                }}
                className="mt-0.5 h-4 w-4 rounded accent-aq-deep"
              />
              <span>KVKK ve üyelik sözleşmesini okudum, kabul ediyorum.</span>
            </label>
            {errors.agree && <p className="-mt-2 text-[11px] text-red-500">{errors.agree}</p>}

            <button
              type="submit"
              disabled={loading}
              className="group mt-1 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(18,134,216,0.75)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              {!loading && <ArrowUpRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-aq-muted">
            Zaten hesabınız var mı?{' '}
            <Link to="/giris" className="font-semibold text-aq-blue hover:text-aq-deep">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
