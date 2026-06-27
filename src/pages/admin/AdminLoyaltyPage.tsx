import { Award, Gift, TrendingUp, Plus, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToastStore } from '@/components/Toast';
import { getLoyaltyData, earnPoints, redeemPoints, EARN_RULES, type LoyaltyData } from '@/services/loyaltyService';

const emptyData: LoyaltyData = {
  points: 0,
  transactions: [],
  totalPoints: 0,
  availablePoints: 0,
  totalRedeemed: 0,
  totalEarned: 0,
};

export default function AdminLoyaltyPage() {
  const addToast = useToastStore(s => s.add);
  const [data, setData] = useState<LoyaltyData>(emptyData);
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState('');

  useEffect(() => {
    void getLoyaltyData().then(setData);
  }, []);

  const handleAdd = async () => {
    await earnPoints(amount, reason || 'Manuel ekleme');
    setData(await getLoyaltyData());
    addToast(`${amount} puan eklendi.`, 'success');
  };

  const handleRemove = async () => {
    const ok = await redeemPoints(amount, reason || 'Manuel cikarma');
    setData(await getLoyaltyData());
    if (ok) addToast(`${amount} puan cikarildi.`, 'success');
    else addToast('Yetersiz puan.', 'error');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2137] mb-1">Sadakat Yonetimi</h1>
      <p className="text-sm text-[#8B9DAF] mb-6">Müşteri puanlarını yönetin, kuralları düzenleyin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Toplam Puan', value: data.totalPoints, icon: Award },
          { label: 'Kullanilabilir', value: data.availablePoints, icon: Gift },
          { label: 'Kullanilan', value: data.totalRedeemed, icon: TrendingUp },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E8F0FE] rounded-xl p-4">
            <s.icon className="w-5 h-5 text-[#1A73E8] mb-2" />
            <p className="text-lg font-bold text-[#0D2137]">{s.value}</p>
            <p className="text-xs text-[#8B9DAF]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Manuel Puan İşlemi</h3>
        <div className="flex gap-3">
          <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-24 px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF]" />
          <input value={reason} onChange={e => setReason(e.target.value)} placeholder="Açıklama" className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF]" />
          <button onClick={() => void handleAdd()} className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-all">
            <Plus className="w-4 h-4" /> Ekle
          </button>
          <button onClick={() => void handleRemove()} className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition-all">
            <Minus className="w-4 h-4" /> Cikar
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Puan Kazanma Kurallari</h3>
        <table className="w-full">
          <thead><tr className="border-b border-[#E8F0FE]"><th className="text-left px-3 py-2 text-xs font-semibold text-[#8B9DAF]">İşlem</th><th className="text-right px-3 py-2 text-xs font-semibold text-[#8B9DAF]">Puan</th></tr></thead>
          <tbody>
            {EARN_RULES.map((r, i) => (
              <tr key={i} className="border-b border-[#F0F6FF] last:border-0">
                <td className="px-3 py-2.5 text-sm text-[#5A6B7B]">{r.action}</td>
                <td className="px-3 py-2.5 text-sm font-semibold text-[#1A73E8] text-right">+{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
