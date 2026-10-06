import { useState, useEffect } from 'react';
import { User, Mail, Phone, Save, CheckCircle, UserX } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { updateProfile } from '@/services/authService';
import { useToastStore } from '@/components/Toast';
import { submitContactMessage } from '@/services/contactService';
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
  const [closing, setClosing] = useState(false);
  const [closeReason, setCloseReason] = useState('');
  const [closeSent, setCloseSent] = useState(false);

  const requestClosure = async () => {
    if (!user) return;
    if (!window.confirm('Hesabınızın kapatılmasını talep etmek istediğinize emin misiniz? Ekibimiz sizinle iletişime geçerek işlemi tamamlayacak.')) return;
    setClosing(true);
    const res = await submitContactMessage({
      name: user.name || form.name || 'Müşteri',
      email: user.email,
      phone: form.phone,
      subject: 'Hesap Kapatma Talebi',
      message: `Hesap kapatma talebi.
Kullanıcı ID: ${user.id}
Gerekçe: ${closeReason.trim() || 'Belirtilmedi'}`,
    });
    setClosing(false);
    if (!res.success) {
      addToast(res.error ?? 'Talep gönderilemedi.', 'error');
      return;
    }
    setCloseSent(true);
    addToast('Hesap kapatma talebiniz alındı.', 'success');
  };

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

      <CustomerCard className="mt-6 max-w-2xl">
        <h2 className="flex items-center gap-2 text-base font-semibold text-aq-ink">
          <UserX className="h-4 w-4" /> Hesabı kapat
        </h2>
        {closeSent ? (
          <p className="mt-2 text-sm text-aq-muted">
            Talebiniz alındı. KVKK kapsamında en geç 30 gün içinde sonuçlandırılır ve size e-posta ile bilgi verilir.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-aq-muted">
              Hesabınız kapatıldığında kişisel verileriniz silinir veya anonimleştirilir; kullanılmamış puanlarınız geçersiz olur. Mevzuat gereği saklanması gereken fatura kayıtları yasal süre boyunca korunur.
            </p>
            <div className="mt-4">
              <CustomerLabel>Gerekçe (isteğe bağlı)</CustomerLabel>
              <CustomerInput value={closeReason} onChange={(e) => setCloseReason(e.target.value)} placeholder="Bizi geliştirmemize yardımcı olun" />
            </div>
            <CustomerButton type="button" variant="danger" className="mt-4" disabled={closing} onClick={() => void requestClosure()}>
              {closing ? 'Gönderiliyor...' : 'Hesap kapatma talebi gönder'}
            </CustomerButton>
          </>
        )}
      </CustomerCard>
    </CustomerPageShell>
  );
}
