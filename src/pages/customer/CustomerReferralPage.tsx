import { Copy, Check, MessageCircle, Users, Gift } from 'lucide-react';
import { useState } from 'react';
import { useToastStore } from '@/components/Toast';
import { getReferralData } from '@/services/referralService';

export default function CustomerReferralPage() {
  const addToast = useToastStore(s => s.add);
  const [copied, setCopied] = useState(false);
  const data = getReferralData();

  const handleCopy = () => {
    navigator.clipboard?.writeText(data.link);
    setCopied(true);
    addToast('Referans linki kopyalandı!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const msg = `Aquails'ten su arıtma cihazı almak için bu linki kullan, %10 indirim kazan! ${data.link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2137] mb-1">Arkadaş Davet Et</h1>
      <p className="text-sm text-[#8B9DAF] mb-6">Arkadaşlarınızı davet edin, her ikisinin de kazanmasını sağlayın.</p>

      <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Gift className="w-8 h-8" />
          <div>
            <p className="text-sm font-semibold">Davet Et, Kazan</p>
            <p className="text-xs text-white/70">Arkadaşın %10 indirim kazanır, sen 250₺ kupon.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/15 rounded-xl p-3">
          <input value={data.link} readOnly className="flex-1 bg-transparent text-xs text-white outline-none" />
          <button onClick={handleCopy} className="p-1.5 hover:bg-white/20 rounded-lg transition-all">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={handleShareWhatsApp} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
            <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 text-center">
          <Users className="w-6 h-6 text-[#1A73E8] mx-auto mb-2" />
          <p className="text-xl font-bold text-[#0D2137]">{data.invitedCount}</p>
          <p className="text-xs text-[#8B9DAF]">Davet Edilen</p>
        </div>
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 text-center">
          <Gift className="w-6 h-6 text-[#00C9A7] mx-auto mb-2" />
          <p className="text-xl font-bold text-[#0D2137]">{data.earnedCoupons.length * 250}₺</p>
          <p className="text-xs text-[#8B9DAF]">Kazanilan</p>
        </div>
      </div>

      {data.history.length > 0 && (
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Davet Geçmişi</h3>
          <div className="space-y-2">
            {data.history.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#F8FBFF] rounded-xl">
                <div>
                  <p className="text-sm text-[#0D2137]">{h.name}</p>
                  <p className="text-[11px] text-[#8B9DAF]">{new Date(h.date).toLocaleDateString('tr-TR')}</p>
                </div>
                <span className="text-xs font-medium text-[#00C9A7]">{h.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
