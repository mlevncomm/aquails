import { Award, Gift, TrendingUp, Plus, Minus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToastStore } from '@/components/Toast';
import { getLoyaltyData, EARN_RULES, type LoyaltyData } from '@/services/loyaltyService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminInput,
  AdminButton,
  AdminTableWrap,
  AdminStatCard,
} from '@/components/admin/admin-ui';

export default function AdminLoyaltyPage() {
  const addToast = useToastStore((s) => s.add);
  const [data, setData] = useState<LoyaltyData>({ totalPoints: 0, availablePoints: 0, totalRedeemed: 0 });
  const [amount, setAmount] = useState(100);

  useEffect(() => {
    void getLoyaltyData().then(setData);
  }, []);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Sadakat Yönetimi"
        description="Müşteri puanlarını görüntüleyin ve kuralları yönetin."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <AdminStatCard label="Toplam Puan" value={data.totalPoints} icon={<Award className="w-5 h-5" />} />
        <AdminStatCard label="Kullanılabilir" value={data.availablePoints} icon={<Gift className="w-5 h-5" />} />
        <AdminStatCard label="Kullanılan" value={data.totalRedeemed} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <AdminCard className="mb-6">
        <p className="text-sm font-semibold text-aq-text mb-3">Manuel Puan İşlemi</p>
        <p className="text-sm text-aq-muted mb-3">
          Müşteri bazlı puan işlemleri için müşteri profilinden yönetim yapılabilir.
        </p>
        <div className="flex gap-3 opacity-50 pointer-events-none">
          <AdminInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-24 bg-aq-ice"
          />
          <AdminButton className="!bg-emerald-500 hover:!bg-emerald-600">
            <Plus className="w-4 h-4" /> Ekle
          </AdminButton>
          <AdminButton
            variant="danger"
            onClick={() => addToast('Müşteri seçimi gerekli.', 'info')}
          >
            <Minus className="w-4 h-4" /> Çıkar
          </AdminButton>
        </div>
      </AdminCard>

      <AdminTableWrap>
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm font-semibold text-aq-text">Puan Kazanma Kuralları</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-aq-ice border-b border-aq-border/60">
              <th className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase">
                İşlem
              </th>
              <th className="text-right px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase">
                Puan
              </th>
            </tr>
          </thead>
          <tbody>
            {EARN_RULES.map((r) => (
              <tr key={r.action} className="border-b border-aq-border/60 last:border-0">
                <td className="px-4 py-2.5 text-sm text-aq-muted">{r.action}</td>
                <td className="px-4 py-2.5 text-sm font-semibold text-aq-blue text-right">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableWrap>
    </AdminPageShell>
  );
}
