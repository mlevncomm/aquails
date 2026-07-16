import { useState, useEffect } from 'react';
import { Award, Gift, TrendingUp, History, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { EARN_RULES, getLoyaltyData, redeemPoints, getLoyaltyHistory } from '@/services/loyaltyService';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';

export default function CustomerLoyaltyPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [data, setData] = useState({ totalPoints: 0, availablePoints: 0, totalRedeemed: 0 });
  const [history, setHistory] = useState<{ id: string; amount: number; type: string; description: string; date: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [convertAmount, setConvertAmount] = useState(500);

  const loadData = async () => {
    if (!user) return;
    const [loyalty, hist] = await Promise.all([
      getLoyaltyData(user.id),
      getLoyaltyHistory(user.id),
    ]);
    setData(loyalty);
    setHistory(hist);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, [user]);

  const handleConvert = async () => {
    if (!user) return;
    if (convertAmount < 100) {
      addToast('Minimum 100 puan gereklidir.', 'error');
      return;
    }
    if (convertAmount > data.availablePoints) {
      addToast('Yetersiz puan.', 'error');
      return;
    }
    setRedeeming(true);
    const res = await redeemPoints(user.id, convertAmount);
    setRedeeming(false);
    if (res.success && res.code) {
      addToast(`${res.discount}₺ değerinde kupon oluşturuldu: ${res.code}`, 'success');
      void loadData();
    } else {
      addToast(res.error ?? 'Yetersiz puan veya geçersiz miktar.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-aq-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-aq-text mb-1">Puanlarım</h1>
      <p className="text-sm text-aq-muted mb-6">Aquails sadakat programına katılın, alışverişlerinizden puan kazanın.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-6 text-white">
          <Award className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">{data.availablePoints}</p>
          <p className="text-xs text-white/70 mt-1">Kullanılabilir Puan</p>
        </div>
        <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
          <TrendingUp className="w-8 h-8 text-aq-blue mb-3" />
          <p className="text-3xl font-bold text-aq-text">{data.totalPoints}</p>
          <p className="text-xs text-aq-muted mt-1">Toplam Kazanılan</p>
        </div>
        <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
          <Gift className="w-8 h-8 text-[#1286D8] mb-3" />
          <p className="text-3xl font-bold text-aq-text">{data.totalRedeemed}</p>
          <p className="text-xs text-aq-muted mt-1">Kullanılan</p>
        </div>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puanı Kupona Çevir</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(Number(e.target.value))}
            min={100}
            step={100}
            className="w-28 px-3 py-2 text-sm border border-aq-border/60 rounded-lg bg-aq-ice focus:outline-none focus:border-aq-blue"
          />
          <span className="text-sm text-aq-muted">puan = {Math.floor(convertAmount / 10)}₺</span>
          <button
            onClick={() => void handleConvert()}
            disabled={redeeming}
            className="ml-auto bg-aq-blue text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60"
          >
            {redeeming ? 'Çevriliyor...' : 'Çevir'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puan Kazanma Yolları</h3>
        <div className="space-y-2">
          {EARN_RULES.map((rule) => (
            <div key={rule.action} className="flex items-center justify-between p-3 bg-aq-ice rounded-xl">
              <span className="text-sm text-aq-muted">{rule.action}</span>
              <span className="text-sm font-semibold text-aq-blue">{rule.points}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puan Geçmişi</h3>
        {history.length === 0 ? (
          <EmptyState
            icon={<History className="w-8 h-8" />}
            title="Henüz İşlem Yok"
            description="Puan kazanma ve harcama işlemleriniz burada görünecek."
            variant="default"
          />
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-aq-ice rounded-xl">
                <div>
                  <p className="text-sm text-aq-text">{h.description}</p>
                  <p className="text-xs text-aq-muted">{h.date}</p>
                </div>
                <span className={`text-sm font-semibold ${h.type === 'redeem' ? 'text-red-500' : 'text-aq-blue'}`}>
                  {h.type === 'redeem' ? '-' : '+'}{Math.abs(h.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
