import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/services/authService';
import { useToastStore } from '@/components/Toast';

export default function CustomerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', tc: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        tc: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile({ name: form.name, phone: form.phone });
    setLoading(false);
    if (res.success) {
      setSaved(true);
      addToast('Profil bilgileriniz güncellendi.', 'success');
      setTimeout(() => setSaved(false), 3000);
    } else {
      addToast(res.error || 'Güncelleme başarısız.', 'error');
    }
  };

  return (
      <>      <div className="max-w-xl">
        <h2 className="text-lg font-semibold text-aq-text mb-5">Profil Bilgilerim</h2>

        {saved && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium mb-5">
            <CheckCircle className="w-4 h-4" /> Profil bilgileriniz güncellendi.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-aq-border/60 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-aq-text mb-1.5 flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-aq-muted" />Ad Soyad</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30" />
          </div>
          <div>
            <label className="text-sm font-medium text-aq-text mb-1.5 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-aq-muted" />E-posta</label>
            <input type="email" value={form.email} readOnly className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice text-aq-muted" />
          </div>
          <div>
            <label className="text-sm font-medium text-aq-text mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-aq-muted" />Telefon</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30" />
          </div>
          <div>
            <label className="text-sm font-medium text-aq-muted mb-1.5">TC Kimlik / Vergi No (Opsiyonel)</label>
            <input value={form.tc} onChange={e => setForm({ ...form, tc: e.target.value })} placeholder="12345678901" className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30" />
          </div>
          <button type="submit" disabled={loading} className="flex items-center gap-2 bg-aq-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60">
            <Save className="w-4 h-4" /> {loading ? 'Kaydediliyor...' : 'Bilgilerimi Güncelle'}
          </button>
        </form>
      </div>
      </>
  );
}
