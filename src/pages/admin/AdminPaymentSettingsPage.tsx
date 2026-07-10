import { useEffect, useState } from 'react';
import { CreditCard, Save, CheckCircle, Shield, AlertTriangle, Eye, EyeOff } from 'lucide-react';
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
  const [showSecrets, setShowSecrets] = useState(false);
  const [paytr, setPaytr] = useState<PaytrSettings>({
    enabled: false,
    merchantId: '',
    merchantKey: '',
    merchantSalt: '',
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
    return <div className="text-sm text-[#8B9DAF]">Yükleniyor...</div>;
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-2">Ödeme Ayarları</h2>
      <p className="text-sm text-[#8B9DAF] mb-5">
        PayTR sanal POS bilgilerinizi girerek online kart ödemesi alabilirsiniz.
      </p>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          <CheckCircle className="w-4 h-4" />
          Ayarlar kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#0D2137] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#1A73E8]" />
              PayTR Sanal POS
            </h3>
            <label className="flex items-center gap-2 text-sm text-[#5A6B7B] cursor-pointer">
              <input
                type="checkbox"
                checked={paytr.enabled}
                onChange={(e) => setPaytr({ ...paytr, enabled: e.target.checked })}
                className="w-4 h-4 accent-[#1A73E8]"
              />
              Aktif
            </label>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 mb-4">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              Mağaza No, Parola ve Gizli Anahtar bilgilerini PayTR Mağaza Paneli → Bilgi sayfasından alın.
              Bildirim URL: <code className="bg-white px-1 rounded">.../functions/v1/payment-webhook</code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block">Mağaza No (merchant_id)</label>
              <input
                value={paytr.merchantId}
                onChange={(e) => setPaytr({ ...paytr, merchantId: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]"
                placeholder="123456"
              />
            </div>
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block">Test Modu</label>
              <select
                value={paytr.testMode ? '1' : '0'}
                onChange={(e) => setPaytr({ ...paytr, testMode: e.target.value === '1' })}
                className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white"
              >
                <option value="1">Test (Sandbox)</option>
                <option value="0">Canlı (Production)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block flex items-center gap-1">
                Mağaza Parolası (merchant_key)
                <button type="button" onClick={() => setShowSecrets(!showSecrets)} className="text-[#8B9DAF]">
                  {showSecrets ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              </label>
              <input
                type={showSecrets ? 'text' : 'password'}
                value={paytr.merchantKey}
                onChange={(e) => setPaytr({ ...paytr, merchantKey: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block">Gizli Anahtar (merchant_salt)</label>
              <input
                type={showSecrets ? 'text' : 'password'}
                value={paytr.merchantSalt}
                onChange={(e) => setPaytr({ ...paytr, merchantSalt: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 text-xs text-[#8B9DAF]">
            <Shield className="w-3.5 h-3.5" />
            API bilgileri yalnızca admin kullanıcılar tarafından görülebilir.
          </div>
        </div>

        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[#0D2137] mb-4">Havale / EFT Banka Hesapları</h3>
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
                className="px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl"
              />
              <input
                value={bank.accountName}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], accountName: e.target.value };
                  setBanks(next);
                }}
                placeholder="Hesap sahibi"
                className="px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl"
              />
              <input
                value={bank.iban}
                onChange={(e) => {
                  const next = [...banks];
                  next[i] = { ...next[i], iban: e.target.value };
                  setBanks(next);
                }}
                placeholder="IBAN"
                className="px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setBanks([...banks, { bankName: '', accountName: '', iban: '' }])}
            className="text-xs text-[#1A73E8] font-medium hover:underline"
          >
            + Hesap ekle
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </form>
    </>
  );
}
