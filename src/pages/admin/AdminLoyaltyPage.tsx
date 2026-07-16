import { Award, Gift, TrendingUp, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToastStore } from '@/components/Toast';
import { getLoyaltyData, EARN_RULES, type LoyaltyData } from '@/services/loyaltyService';

export default function AdminLoyaltyPage() {
  const addToast = useToastStore((s) => s.add);
  const [data, setData] = useState<LoyaltyData>({ totalPoints: 0, availablePoints: 0, totalRedeemed: 0 });
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    void getLoyaltyData().then(setData);
  }, []);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-aq-text mb-1">Sadakat Yönetimi</h1>
      <p className="text-sm text-aq-muted mb-6">Müşteri puanlarını görüntüleyin ve kuralları yönetin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Toplam Puan', value: data.totalPoints, icon: Award },
          { label: 'Kullanılabilir', value: data.availablePoints, icon: Gift },
          { label: 'Kullanılan', value: data.totalRedeemed, icon: TrendingUp },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-aq-border/60 rounded-xl p-4">
            <s.icon className="w-5 h-5 text-aq-blue mb-2" />
            <p className="text-lg font-semibold text-aq-text">{s.value}</p>
            <p className="text-xs text-aq-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Manuel Puan İşlemi</h3>
        <p className="text-sm text-aq-muted mb-3">
          Müşteri bazlı puan işlemleri için müşteri profilinden yönetim yapılabilir.
        </p>
        <div className="flex gap-3 opacity-50 pointer-events-none">
          <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-24 px-3 py-2 text-sm border border-aq-border/60 rounded-lg bg-aq-ice" />
          <button className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-2 rounded-lg text-sm">
            <Plus className="w-4 h-4" /> Ekle
          </button>
          <button onClick={() => addToast('Müşteri seçimi gerekli.', 'info')} className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm">
            <Minus className="w-4 h-4" /> Çıkar
          </button>
        </div>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-aq-text mb-3">Puan Kazanma Kuralları</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b border-aq-border/60">
              <th className="text-left px-3 py-2 text-xs font-semibold text-aq-muted">İşlem</th>
              <th className="text-right px-3 py-2 text-xs font-semibold text-aq-muted">Puan</th>
            </tr>
          </thead>
          <tbody>
            {EARN_RULES.map((r) => (
              <tr key={r.action} className="border-b border-aq-border/60 last:border-0">
                <td className="px-3 py-2.5 text-sm text-aq-muted">{r.action}</td>
                <td className="px-3 py-2.5 text-sm font-semibold text-aq-blue text-right">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
