import { Copy, Check, MessageCircle, Users, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToastStore } from '@/components/Toast';
import { getReferralData, type ReferralData } from '@/services/referralService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerSectionTitle,
  CustomerLoading,
  CustomerBadge,
} from '@/components/customer/customer-ui';

export default function CustomerReferralPage() {
  const addToast = useToastStore((s) => s.add);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralData | null>(null);

  useEffect(() => {
    void getReferralData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard?.writeText(data.link);
    setCopied(true);
    addToast('Referans linki kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!data) return;
    const msg = `Aquails'ten su arıtma cihazı almak için bu linki kullan, %10 indirim kazan! ${data.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading || !data) {
    return (
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Arkadaş Davet Et"
        description="Arkadaşlarınızı davet edin, her ikiniz de kazanın."
      />

      <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold">Davet Et, Kazan</p>
            <p className="text-xs text-white/70">Arkadaşın kayıt olsun, sen 200 puan kazan.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl p-3">
          <input
            value={data.link}
            readOnly
            className="flex-1 bg-transparent text-xs text-white outline-none min-w-0"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-all flex-shrink-0"
            aria-label="Kopyala"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <CustomerCard className="text-center !p-4">
          <Users className="w-6 h-6 text-aq-blue mx-auto mb-2" />
          <p className="text-xl font-semibold text-aq-text tabular-nums">{data.invitedCount}</p>
          <p className="text-xs text-aq-muted">Davet Edilen</p>
        </CustomerCard>
        <CustomerCard className="text-center !p-4">
          <Gift className="w-6 h-6 text-aq-blue mx-auto mb-2" />
          <p className="text-xl font-semibold text-aq-text tabular-nums">
            {data.earnedCoupons.reduce((s, c) => s + c.value, 0)} puan
          </p>
          <p className="text-xs text-aq-muted">Kazanılan</p>
        </CustomerCard>
      </div>

      <CustomerCard padding={false}>
        <CustomerSectionTitle title="Davet Geçmişi" />
        <div className="divide-y divide-aq-border/60">
          {data.history.length === 0 && (
            <p className="text-sm text-aq-muted text-center py-10">Henüz davet yok.</p>
          )}
          {data.history.map((h, i) => (
            <div
              key={`${h.name}-${i}`}
              className="px-5 py-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-aq-text truncate">{h.name}</p>
                <p className="text-xs text-aq-muted">{h.date}</p>
              </div>
              <CustomerBadge tone="info">{h.status}</CustomerBadge>
            </div>
          ))}
        </div>
      </CustomerCard>
    </CustomerPageShell>
  );
}
