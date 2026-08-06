import { Award, Gift, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLoyaltyData, EARN_RULES, type LoyaltyData } from '@/services/loyaltyService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminTableWrap,
  AdminStatCard,
} from '@/components/admin/admin-ui';

export default function AdminLoyaltyPage() {
  const [data, setData] = useState<LoyaltyData>({ totalPoints: 0, availablePoints: 0, totalRedeemed: 0 });

  useEffect(() => {
    void getLoyaltyData().then(setData);
  }, []);

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Sadakat Yönetimi"
        description="Salt okunur özet — müşteri bazlı puan işlemleri bu ekrandan yapılmaz."
      />

      <AdminCard className="mb-6 border border-amber-200 bg-amber-50">
        <p className="text-sm text-amber-800">
          Bu sayfa <strong>salt okunur</strong>dur. Puan kurallarını görüntüler; manuel ekleme/çıkarma burada yoktur.
        </p>
      </AdminCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <AdminStatCard label="Toplam Puan" value={data.totalPoints} icon={<Award className="w-5 h-5" />} />
        <AdminStatCard label="Kullanılabilir" value={data.availablePoints} icon={<Gift className="w-5 h-5" />} />
        <AdminStatCard label="Kullanılan" value={data.totalRedeemed} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

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
