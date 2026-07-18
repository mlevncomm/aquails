import { useState, useEffect } from 'react';
import { Award, Gift, TrendingUp, History } from 'lucide-react';
import { EARN_RULES, getLoyaltyData, redeemPoints, getLoyaltyHistory } from '@/services/loyaltyService';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerInput,
  CustomerButton,
} from '@/components/customer/customer-ui';

export default function CustomerLoyaltyPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [data, setData] = useState({ totalPoints: 0, availablePoints: 0, totalRedeemed: 0 });
  const [history, setHistory] = useState<
    { id: string; amount: number; type: string; description: string; date: string }[]
  >([]);
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
      <CustomerPageShell>
        <CustomerLoading rows={4} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Puanlarım"
        description="Alışverişlerinizden puan kazanın, kupona çevirin."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-aq-blue to-aq-navy rounded-2xl p-6 text-white">
          <Award className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold tabular-nums">{data.availablePoints}</p>
          <p className="text-xs text-white/70 mt-1">Kullanılabilir Puan</p>
        </div>
        <CustomerCard>
          <TrendingUp className="w-8 h-8 text-aq-blue mb-3" />
          <p className="text-3xl font-bold text-aq-text tabular-nums">{data.totalPoints}</p>
          <p className="text-xs text-aq-muted mt-1">Toplam Kazanılan</p>
        </CustomerCard>
        <CustomerCard>
          <Gift className="w-8 h-8 text-aq-blue mb-3" />
          <p className="text-3xl font-bold text-aq-text tabular-nums">{data.totalRedeemed}</p>
          <p className="text-xs text-aq-muted mt-1">Kullanılan</p>
        </CustomerCard>
      </div>

      <CustomerCard className="mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puanı Kupona Çevir</h3>
        <div className="flex flex-wrap items-center gap-3">
          <CustomerInput
            type="number"
            value={convertAmount}
            onChange={(e) => setConvertAmount(Number(e.target.value))}
            min={100}
            step={100}
            className="w-28"
          />
          <span className="text-sm text-aq-muted">
            puan = {Math.floor(convertAmount / 10)}₺
          </span>
          <CustomerButton
            onClick={() => void handleConvert()}
            disabled={redeeming}
            className="sm:ml-auto"
          >
            {redeeming ? 'Çevriliyor...' : 'Çevir'}
          </CustomerButton>
        </div>
      </CustomerCard>

      <CustomerCard className="mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puan Kazanma Yolları</h3>
        <div className="space-y-2">
          {EARN_RULES.map((rule) => (
            <div
              key={rule.action}
              className="flex items-center justify-between p-3 bg-aq-ice rounded-xl gap-3"
            >
              <span className="text-sm text-aq-muted">{rule.action}</span>
              <span className="text-sm font-semibold text-aq-blue flex-shrink-0">{rule.points}</span>
            </div>
          ))}
        </div>
      </CustomerCard>

      <CustomerCard>
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puan Geçmişi</h3>
        {history.length === 0 ? (
          <CustomerEmpty
            icon={History}
            title="Henüz işlem yok"
            message="Puan kazanma ve harcama işlemleriniz burada görünecek."
          />
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between p-3 bg-aq-ice rounded-xl gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-aq-text">{h.description}</p>
                  <p className="text-xs text-aq-muted">{h.date}</p>
                </div>
                <span
                  className={`text-sm font-semibold tabular-nums flex-shrink-0 ${
                    h.type === 'redeem' ? 'text-red-500' : 'text-aq-blue'
                  }`}
                >
                  {h.type === 'redeem' ? '-' : '+'}
                  {Math.abs(h.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CustomerCard>
    </CustomerPageShell>
  );
}
