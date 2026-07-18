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
    return <div className="text-sm text-aq-muted">Yükleniyor...</div>;
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-aq-text mb-2">Ödeme Ayarları</h2>
      <p className="text-sm text-aq-muted mb-5">
        PayTR durumunu yönetin. Gizli anahtarlar yalnızca sunucu ortam değişkenlerinde saklanır.
      </p>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          <CheckCircle className="w-4 h-4" />
          Ayarlar kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
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
              <label className="text-xs text-aq-muted mb-1 block">Test Modu</label>
              <select
                value={paytr.testMode ? '1' : '0'}
                onChange={(e) => setPaytr({ ...paytr, testMode: e.target.value === '1' })}
                className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl bg-white"
              >
                <option value="1">Test (Sandbox)</option>
                <option value="0">Canlı (Production)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-aq-muted">
            <Shield className="w-3.5 h-3.5" />
            Gizli bilgiler tarayıcıya veya veritabanı ayar tablosuna aktarılmaz.
          </div>
        </div>

        <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-aq-text mb-4">Havale / EFT Banka Hesapları</h3>
          {banks.map((bank, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <input
                value={bank.bankName}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], bankName: e.target.value };
                  setBanks(next);
                }}
                placeholder="Banka adı"
                className="px-3 py-2 text-sm border border-aq-border/60 rounded-xl"
              />
              <input
                value={bank.accountName}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], accountName: e.target.value };
                  setBanks(next);
                }}
                placeholder="Hesap sahibi"
                className="px-3 py-2 text-sm border border-aq-border/60 rounded-xl"
              />
              <input
                value={bank.iban}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], iban: e.target.value };
                  setBanks(next);
                }}
                placeholder="IBAN"
                className="px-3 py-2 text-sm border border-aq-border/60 rounded-xl"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setBanks([...banks, { bankName: '', accountName: '', iban: '' }])}
            className="text-xs text-aq-blue font-medium hover:underline"
          >
            + Hesap ekle
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-aq-blue text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-aq-deep transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </>
  );
}
