import { useState, useEffect } from 'react';
import { Award, Gift, TrendingUp, History } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { useLoyaltyStore } from '@/stores/loyaltyStore';
import { EARN_RULES } from '@/services/loyaltyService';
import { useToastStore } from '@/components/Toast';

export default function CustomerLoyaltyPage() {
  const { data, refresh, convert } = useLoyaltyStore();
  const addToast = useToastStore((s) => s.add);
  const [convertAmount, setConvertAmount] = useState(500);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleConvert = async () => {
    const coupon = await convert(convertAmount);
    if (coupon) {
      addToast(`${coupon.discount}₺ değerinde kupon oluşturuldu: ${coupon.code}`, 'success');
    } else {
      addToast('Yetersiz puan veya geçersiz miktar.', 'error');
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2137] mb-1">Puanlarım</h1>
      <p className="text-sm text-[#8B9DAF] mb-6">Aquails sadakat programına katılın, alışverişlerinizden puan kazanın.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-2xl p-6 text-white">
          <Award className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">{data.availablePoints}</p>
          <p className="text-xs text-white/70 mt-1">Kullanılabilir Puan</p>
        </div>
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <TrendingUp className="w-8 h-8 text-[#1A73E8] mb-3" />
          <p className="text-3xl font-bold text-[#0D2137]">{data.totalPoints}</p>
          <p className="text-xs text-[#8B9DAF] mt-1">Toplam Kazanılan</p>
        </div>
        <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
          <Gift className="w-8 h-8 text-[#00C9A7] mb-3" />
          <p className="text-3xl font-bold text-[#0D2137]">{data.totalRedeemed}</p>
          <p className="text-xs text-[#8B9DAF] mt-1">Kullanılan</p>
        </div>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Puanı Kupona Çevir</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(Number(e.target.value))}
            min={100}
            step={100}
            className="w-28 px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
          />
          <span className="text-sm text-[#8B9DAF]">puan = {Math.floor(convertAmount / 10)}₺</span>
          <button
            onClick={() => void handleConvert()}
            className="ml-auto bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1557B0] transition-all"
          >
            Çevir
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Puan Kazanma Yolları</h3>
        <div className="space-y-2">
          {EARN_RULES.map((rule) => (
            <div key={rule.action} className="flex items-center justify-between p-3 bg-[#F8FBFF] rounded-xl">
              <span className="text-sm text-[#5A6B7B]">{rule.action}</span>
              <span className="text-sm font-semibold text-[#1A73E8]">{rule.points}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Puan Geçmişi</h3>
        <EmptyState
          icon={<History className="w-8 h-8" />}
          title="Henüz İşlem Yok"
          description="Puan kazanma ve harcama işlemleriniz burada görünecek."
          variant="default"
        />
      </div>
    </div>
  );
}
