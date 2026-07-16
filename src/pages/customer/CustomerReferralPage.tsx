import { Copy, Check, MessageCircle, Users, Gift, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToastStore } from '@/components/Toast';
import { getReferralData, type ReferralData } from '@/services/referralService';

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
      <div className="p-4 md:p-6 flex justify-center py-20 text-aq-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-aq-text mb-1">Arkadaş Davet Et</h1>
      <p className="text-sm text-aq-muted mb-6">Arkadaşlarınızı davet edin, her ikisinin de kazanmasını sağlayın.</p>

      <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold">Davet Et, Kazan</p>
            <p className="text-xs text-white/70">Arkadaşın kayıt olsun, sen 200 puan kazan.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl p-3">
          <input value={data.link} readOnly className="flex-1 bg-transparent text-xs text-white outline-none" />
          <button type="button" onClick={handleCopy} className="p-1.5 hover:bg-white/20 rounded-lg transition-all">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="button" onClick={handleShareWhatsApp} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-aq-border/60 rounded-2xl p-4 text-center">
          <Users className="w-6 h-6 text-aq-blue mx-auto mb-2" />
          <p className="text-xl font-semibold text-aq-text">{data.invitedCount}</p>
          <p className="text-xs text-aq-muted">Davet Edilen</p>
        </div>
        <div className="bg-white border border-aq-border/60 rounded-2xl p-4 text-center">
          <Gift className="w-6 h-6 text-[#1286D8] mx-auto mb-2" />
          <p className="text-xl font-semibold text-aq-text">{data.earnedCoupons.reduce((s, c) => s + c.value, 0)} puan</p>
          <p className="text-xs text-aq-muted">Kazanılan</p>
        </div>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-aq-border/60">
          <h2 className="text-base font-semibold text-aq-text">Davet Geçmişi</h2>
        </div>
        <div className="divide-y divide-aq-border/60">
          {data.history.length === 0 && (
            <p className="text-sm text-aq-muted text-center py-8">Henüz davet yok.</p>
          )}
          {data.history.map((h, i) => (
            <div key={`${h.name}-${i}`} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-aq-text">{h.name}</p>
                <p className="text-xs text-aq-muted">{h.date}</p>
              </div>
              <span className="text-xs font-medium text-aq-blue bg-aq-sky px-2 py-0.5 rounded-full">{h.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
