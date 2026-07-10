import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import { updatePassword } from '@/services/authService';
import { useToastStore } from '@/components/Toast';

export default function CustomerPasswordPage() {
  const addToast = useToastStore((s) => s.add);
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.newPass) e.newPass = 'Yeni şifre girin';
    else if (form.newPass.length < 6) e.newPass = 'En az 6 karakter olmalı';
    if (form.newPass !== form.confirm) e.confirm = 'Şifreler eşleşmiyor';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await updatePassword(form.newPass);
    setLoading(false);
    if (res.success) {
      setSaved(true);
      setForm({ current: '', newPass: '', confirm: '' });
      addToast('Şifreniz güncellendi.', 'success');
      setTimeout(() => setSaved(false), 3000);
    } else {
      addToast(res.error || 'Şifre güncellenemedi.', 'error');
    }
  };

  const strength = form.newPass.length === 0 ? 0 : form.newPass.length < 8 ? 1 : !/[A-Z]/.test(form.newPass) || !/[0-9]/.test(form.newPass) ? 2 : 3;

  return (
      <>      <div className="max-w-md">
        <h2 className="text-lg font-bold text-[#0D2137] mb-5">Şifre Değiştir</h2>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium mb-5">
            <CheckCircle className="w-4 h-4" /> Şifreniz başarıyla güncellendi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="text-sm font-medium text-[#0D2137] mb-1.5 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-[#8B9DAF]" />Mevcut Şifre</label>
            <div className="relative">
              <input type={show.current ? 'text' : 'password'} value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 ${errors.current ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
              <button type="button" onClick={() => setShow({ ...show, current: !show.current })} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9DAF]">{show.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.current && <p className="text-xs text-red-500 mt-1">{errors.current}</p>}
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm font-medium text-[#0D2137] mb-1.5 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-[#8B9DAF]" />Yeni Şifre</label>
            <div className="relative">
              <input type={show.new ? 'text' : 'password'} value={form.newPass} onChange={e => setForm({ ...form, newPass: e.target.value })} className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 ${errors.newPass ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
              <button type="button" onClick={() => setShow({ ...show, new: !show.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9DAF]">{show.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.newPass && <p className="text-xs text-red-500 mt-1">{errors.newPass}</p>}
            {/* Strength indicator */}
            {form.newPass && (
              <div className="mt-2">
                <div className="flex gap-1 h-1"><div className={`flex-1 rounded-full ${strength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`} /><div className={`flex-1 rounded-full ${strength >= 2 ? 'bg-amber-400' : 'bg-gray-200'}`} /><div className={`flex-1 rounded-full ${strength >= 3 ? 'bg-emerald-400' : 'bg-gray-200'}`} /></div>
                <p className="text-[10px] text-[#8B9DAF] mt-1">{strength === 1 ? 'Zayıf' : strength === 2 ? 'Orta' : 'Güçlü'}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-[#0D2137] mb-1.5">Yeni Şifre Tekrar</label>
            <div className="relative">
              <input type={show.confirm ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className={`w-full px-4 py-2.5 pr-10 text-sm border rounded-xl focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 ${errors.confirm ? 'border-red-300' : 'border-[#D6E3F0]'}`} />
              <button type="button" onClick={() => setShow({ ...show, confirm: !show.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B9DAF]">{show.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
            {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
          </div>

          <div className="bg-[#F8FBFF] rounded-xl p-3 text-xs text-[#5A6B7B] space-y-1">
            <p className="font-medium text-[#0D2137]">Şifre gereksinimleri:</p>
            <p className={form.newPass.length >= 8 ? 'text-emerald-600' : ''}>• En az 8 karakter</p>
            <p className={/[A-Z]/.test(form.newPass) ? 'text-emerald-600' : ''}>• En az 1 büyük harf</p>
            <p className={/[0-9]/.test(form.newPass) ? 'text-emerald-600' : ''}>• En az 1 rakam</p>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-[#1A73E8] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-60">
            {loading ? 'Güncelleniyor...' : 'Şifremi Güncelle'}
          </button>
        </form>
      </div>
      </>
  );
}
