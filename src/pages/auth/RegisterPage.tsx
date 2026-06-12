import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Droplets, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { register } from '@/services/authService';
import { useToastStore } from '@/components/Toast';


export default function RegisterPage() {
  const navigate = useNavigate();
  const addToast = useToastStore(s => s.add);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setLoading(false);
    if (res.success) {
      addToast('Kayıt başarılı! Hoş geldiniz.', 'success');
      navigate('/hesabim', { replace: true });
    } else {
      addToast(res.error || 'Kayıt başarısız.', 'error');
    }
  };

  const Input = ({ label, icon: Icon, type = 'text', field, placeholder }: { label: string; icon: React.ElementType; type?: string; field: string; placeholder: string }) => (
    <div>
      <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
        <input type={type} value={(form as Record<string, string>)[field]} onChange={e => { setForm({ ...form, [field]: e.target.value }); setErrors({ ...errors, [field]: '' }); }} placeholder={placeholder} className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF] ${errors[field] ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
      </div>
      {errors[field] && <p className="text-[11px] text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="w-full max-w-[400px]">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <Droplets className="w-8 h-8 text-[#1A73E8]" />
          <span className="text-2xl font-bold text-[#0D2137]">aquails</span>
        </Link>

        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-7 shadow-sm">
          <h1 className="text-xl font-bold text-[#0D2137] mb-1">Kayıt Ol</h1>
          <p className="text-sm text-[#8B9DAF] mb-6">Yeni bir hesap oluşturun.</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Input label="Ad Soyad" icon={User} field="name" placeholder="Adınız Soyadınız" />
            <Input label="E-posta" icon={Mail} type="email" field="email" placeholder="ornek@email.com" />
            <Input label="Telefon" icon={Phone} type="tel" field="phone" placeholder="05XX XXX XX XX" />

            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} placeholder="En az 6 karakter" className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF] ${errors.password ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B9DAF]">{showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Şifre Tekrar</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
                <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={e => { setForm({ ...form, confirm: e.target.value }); setErrors({ ...errors, confirm: '' }); }} placeholder="Şifrenizi tekrar girin" className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 bg-[#F8FBFF] ${errors.confirm ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
              </div>
              {errors.confirm && <p className="text-[11px] text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <label className="flex items-start gap-2 text-xs text-[#5A6B7B] cursor-pointer pt-1">
              <input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors({ ...errors, agree: '' }); }} className="w-4 h-4 mt-0.5 accent-[#1A73E8] rounded" />
              <span>KVKK ve üyelik sözleşmesini okudum, kabul ediyorum.</span>
            </label>
            {errors.agree && <p className="text-[11px] text-red-500 -mt-2">{errors.agree}</p>}

            <button type="submit" disabled={loading} className="w-full bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] hover:shadow-md transition-all disabled:opacity-60">
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-xs text-[#8B9DAF] mt-5">
            Zaten hesabınız var mı? <Link to="/giris" className="text-[#1A73E8] font-semibold hover:underline">Giriş Yap</Link>
          </p>
        </div>
      </div>
  );
}
