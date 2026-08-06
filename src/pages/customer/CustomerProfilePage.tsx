import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerInput,
  CustomerLabel,
  CustomerButton,
} from '@/components/customer/customer-ui';

export default function CustomerProfilePage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
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
    <CustomerPageShell className="max-w-xl">
      <CustomerPageHeader
        title="Profilim"
        description="İletişim bilgilerinizi güncel tutun."
      />

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-medium mb-5 border border-emerald-100">
          <CheckCircle className="w-4 h-4 flex-shrink-0" /> Profil bilgileriniz güncellendi.
        </div>
      )}

      <CustomerCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <CustomerLabel>
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Ad Soyad
              </span>
            </CustomerLabel>
            <CustomerInput
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <CustomerLabel>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> E-posta
              </span>
            </CustomerLabel>
            <CustomerInput type="email" value={form.email} readOnly className="bg-aq-ice text-aq-muted cursor-not-allowed" />
            <p className="text-[11px] text-aq-muted mt-1.5">E-posta adresi değiştirilemez.</p>
          </div>
          <div>
            <CustomerLabel>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Telefon
              </span>
            </CustomerLabel>
            <CustomerInput
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="05xx xxx xx xx"
            />
          </div>
          <CustomerButton type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="w-4 h-4" /> {loading ? 'Kaydediliyor...' : 'Bilgilerimi Güncelle'}
          </CustomerButton>
        </form>
      </CustomerCard>
    </CustomerPageShell>
  );
}
