import { useCallback, useEffect, useMemo, useState } from 'react';
import { Award, Gift, TrendingUp, Search, Plus, Minus, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  EARN_RULES,
  getCustomerLoyaltyBalances,
  getRecentLoyaltyTransactions,
  adminAdjustLoyaltyPoints,
  type CustomerLoyaltyBalance,
  type AdminLoyaltyTransaction,
} from '@/services/loyaltyService';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminTableWrap,
  AdminStatCard,
  AdminInput,
  AdminLabel,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminDrawer,
} from '@/components/admin/admin-ui';
import { cn } from '@/lib/utils';

export default function AdminLoyaltyPage() {
  const addToast = useToastStore((s) => s.add);
  const [balances, setBalances] = useState<CustomerLoyaltyBalance[]>([]);
  const [transactions, setTransactions] = useState<AdminLoyaltyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState<CustomerLoyaltyBalance | null>(null);
  const [mode, setMode] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [b, t] = await Promise.all([getCustomerLoyaltyBalances(), getRecentLoyaltyTransactions(30)]);
    setBalances(b);
    setTransactions(t);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const totals = useMemo(() => ({
    available: balances.reduce((s, b) => s + b.points, 0),
    redeemed: balances.reduce((s, b) => s + b.redeemed, 0),
    members: balances.filter((b) => b.points > 0).length,
  }), [balances]);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('tr-TR');
    return q ? balances.filter((b) => `${b.name} ${b.email}`.toLocaleLowerCase('tr-TR').includes(q)) : balances;
  }, [balances, query]);

  const openAdjust = (b: CustomerLoyaltyBalance, m: 'add' | 'deduct') => {
    setTarget(b);
    setMode(m);
    setAmount('');
    setReason('');
  };

  const submit = async () => {
    if (!target) return;
    const value = Math.trunc(Number(amount));
    if (!value || value < 0) return addToast('Geçerli bir puan miktarı girin.', 'error');
    if (!reason.trim()) return addToast('Lütfen bir gerekçe yazın (müşteriye bildirimde gösterilir).', 'error');
    setSaving(true);
    const res = await adminAdjustLoyaltyPoints(target.id, mode === 'add' ? value : -value, reason);
    setSaving(false);
    if (!res.success) return addToast(res.error ?? 'Puan güncellenemedi.', 'error');
    addToast(`${target.name}: yeni bakiye ${res.balance ?? '—'} puan.`, 'success');
    setTarget(null);
    void load();
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Sadakat Programı"
        description="Müşteri puan bakiyeleri ve işlemleri. Manuel ekleme/düşme işlemleri kayıt altına alınır ve müşteriye bildirim gönderilir."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <AdminStatCard label="Kullanılabilir puan" value={totals.available.toLocaleString('tr-TR')} sub={`${totals.members} müşteride bakiye var`} icon={<Award className="h-5 w-5" />} />
        <AdminStatCard label="Kullanılan puan" value={totals.redeemed.toLocaleString('tr-TR')} sub="Kupona dönüştürülen" icon={<Gift className="h-5 w-5" />} />
        <AdminStatCard label="Kazanma kuralı" value="10₺ = 1 puan" sub="100 puan = 10₺ kupon" icon={<TrendingUp className="h-5 w-5" />} />
      </div>

      {loading ? (
        <AdminLoading />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="relative mb-4 sm:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aq-muted" />
              <AdminInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Müşteri adı veya e-posta" className="pl-9" />
            </div>
            {visible.length === 0 ? (
              <AdminCard padding={false}><AdminEmpty icon={Award} message="Eşleşen müşteri bulunamadı." /></AdminCard>
            ) : (
              <AdminTableWrap>
                <table className="w-full min-w-[560px]">
                  <thead>
                    <tr>
                      {['Müşteri', 'Bakiye', 'Kullanılan', ''].map((h) => <th key={h} className="px-4 py-3 text-left">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((b) => (
                      <tr key={b.id}>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-aq-ink">{b.name}</p>
                          <p className="text-xs text-aq-muted">{b.email}</p>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold tabular-nums text-aq-ink">{b.points.toLocaleString('tr-TR')}</td>
                        <td className="px-4 py-3 text-sm tabular-nums text-aq-muted">{b.redeemed.toLocaleString('tr-TR')}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => openAdjust(b, 'add')} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30">
                              <Plus className="h-3.5 w-3.5" /> Ekle
                            </button>
                            <button type="button" disabled={b.points === 0} onClick={() => openAdjust(b, 'deduct')} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-aq-ink ring-1 ring-aq-border hover:ring-aq-ink/30 disabled:opacity-40">
                              <Minus className="h-3.5 w-3.5" /> Düş
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminTableWrap>
            )}
          </div>

          <div className="space-y-6">
            <AdminCard>
              <h2 className="text-[15px] font-semibold text-aq-ink">Puan kazanma kuralları</h2>
              <ul className="mt-3 divide-y divide-aq-border/60">
                {EARN_RULES.map((r) => (
                  <li key={r.action} className="flex justify-between py-2.5 text-sm">
                    <span className="text-aq-ink/80">{r.action}</span>
                    <span className="font-semibold text-aq-ink">{r.points}</span>
                  </li>
                ))}
              </ul>
            </AdminCard>
            <AdminCard padding={false}>
              <h2 className="px-5 pb-2 pt-5 text-[15px] font-semibold text-aq-ink">Son işlemler</h2>
              {transactions.length === 0 ? (
                <p className="px-5 pb-6 text-sm text-aq-muted">Henüz puan işlemi yok.</p>
              ) : (
                <ul className="max-h-[420px] divide-y divide-aq-border/60 overflow-y-auto">
                  {transactions.map((t) => (
                    <li key={t.id} className="flex items-start justify-between gap-3 px-5 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-aq-ink">{t.customer}</p>
                        <p className="truncate text-xs text-aq-muted">{t.description || (t.type === 'earn' ? 'Kazanım' : 'Kullanım')} · {t.date}</p>
                      </div>
                      <span className={cn('flex-shrink-0 text-sm font-bold tabular-nums', t.amount >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                        {t.amount >= 0 ? '+' : ''}{t.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>
        </div>
      )}

      <AdminDrawer
        open={!!target}
        title={mode === 'add' ? 'Puan Ekle' : 'Puan Düş'}
        onClose={() => setTarget(null)}
        footer={
          <div className="flex justify-end gap-2">
            <AdminButton variant="ghost" onClick={() => setTarget(null)}>Vazgeç</AdminButton>
            <AdminButton onClick={() => void submit()} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />} Onayla
            </AdminButton>
          </div>
        }
      >
        {target && (
          <div className="space-y-4">
            <div className="rounded-xl bg-aq-cloud p-4">
              <p className="text-sm font-semibold text-aq-ink">{target.name}</p>
              <p className="text-xs text-aq-muted">{target.email}</p>
              <p className="mt-2 text-sm text-aq-ink">Mevcut bakiye: <strong>{target.points.toLocaleString('tr-TR')} puan</strong></p>
            </div>
            <div>
              <AdminLabel>Puan miktarı</AdminLabel>
              <AdminInput type="number" min={1} max={mode === 'deduct' ? target.points : undefined} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Örn. 100" />
            </div>
            <div>
              <AdminLabel>Gerekçe (müşteriye gösterilir)</AdminLabel>
              <AdminInput value={reason} onChange={(e) => setReason(e.target.value)} placeholder={mode === 'add' ? 'Örn. Geciken kargo için özür puanı' : 'Örn. İade edilen sipariş puanı'} />
            </div>
          </div>
        )}
      </AdminDrawer>
    </AdminPageShell>
  );
}
