import { useEffect, useState } from 'react';
import { CreditCard, Save, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import {
  getPaytrSettings,
  savePaytrSettings,
  getBankAccounts,
  saveBankAccounts,
  type PaytrSettings,
  type BankAccount,
} from '@/services/settingsService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminSelect,
  AdminLabel,
  AdminButton,
  AdminLoading,
} from '@/components/admin/admin-ui';

export default function AdminPaymentSettingsPage() {
  const addToast = useToastStore((s) => s.add);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paytr, setPaytr] = useState<PaytrSettings>({
    enabled: false,
    testMode: true,
  });
  const [banks, setBanks] = useState<BankAccount[]>([
    { bankName: '', accountName: '', iban: '' },
  ]);

  useEffect(() => {
    void Promise.all([getPaytrSettings(), getBankAccounts()]).then(([p, b]) => {
      setPaytr(p);
      if (b.length) setBanks(b);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const [paytrRes, bankRes] = await Promise.all([
      savePaytrSettings(paytr),
      saveBankAccounts(banks.filter((b) => b.bankName && b.iban)),
    ]);
    setSaving(false);

    if (!paytrRes.success || !bankRes.success) {
      addToast(paytrRes.error ?? bankRes.error ?? 'Kayıt başarısız.', 'error');
      return;
    }

    setSaved(true);
    addToast('Ödeme ayarları kaydedildi.', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <AdminPageShell>
        <AdminLoading variant="spinner" />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Ödeme Ayarları"
        description="PayTR durumunu yönetin. Gizli anahtarlar yalnızca sunucu ortam değişkenlerinde saklanır."
      />

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          <CheckCircle className="w-4 h-4" />
          Ayarlar kaydedildi.
        </div>
      )}

      <form onSubmit={(e) => void handleSave(e)} className="space-y-5">
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-aq-text flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-aq-blue" />
              PayTR Sanal POS
            </h3>
            <label className="flex items-center gap-2 text-sm text-aq-muted cursor-pointer">
              <input
                type="checkbox"
                checked={paytr.enabled}
                onChange={(e) => setPaytr({ ...paytr, enabled: e.target.checked })}
                className="w-4 h-4 accent-aq-deep"
              />
              Aktif
            </label>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Vercel üzerinde PAYTR_MERCHANT_ID, PAYTR_MERCHANT_KEY ve PAYTR_MERCHANT_SALT değişkenlerini tanımlayın.
              Bildirim URL:{' '}
              <code className="bg-white px-1 rounded">
                {typeof window !== 'undefined'
                  ? `${window.location.origin}/api/payment-webhook`
                  : 'https://aquails.vercel.app/api/payment-webhook'}
              </code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <AdminLabel>Test Modu</AdminLabel>
              <AdminSelect
                value={paytr.testMode ? '1' : '0'}
                onChange={(e) => setPaytr({ ...paytr, testMode: e.target.value === '1' })}
              >
                <option value="1">Test (Sandbox)</option>
                <option value="0">Canlı (Production)</option>
              </AdminSelect>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-aq-muted">
            <Shield className="w-3.5 h-3.5" />
            Gizli bilgiler tarayıcıya veya veritabanı ayar tablosuna aktarılmaz.
          </div>
        </AdminCard>

        <AdminCard>
          <h3 className="text-sm font-semibold text-aq-text mb-4">Havale / EFT Banka Hesapları</h3>
          {banks.map((bank, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <AdminInput
                value={bank.bankName}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], bankName: e.target.value };
                  setBanks(next);
                }}
                placeholder="Banka adı"
              />
              <AdminInput
                value={bank.accountName}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], accountName: e.target.value };
                  setBanks(next);
                }}
                placeholder="Hesap sahibi"
              />
              <AdminInput
                value={bank.iban}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], iban: e.target.value };
                  setBanks(next);
                }}
                placeholder="IBAN"
              />
            </div>
          ))}
          <AdminButton
            type="button"
            variant="ghost"
            className="text-xs min-h-0 py-1.5 px-3"
            onClick={() => setBanks([...banks, { bankName: '', accountName: '', iban: '' }])}
          >
            + Hesap ekle
          </AdminButton>
        </AdminCard>

        <AdminButton type="submit" disabled={saving}>
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </AdminButton>
      </form>
    </AdminPageShell>
  );
}
