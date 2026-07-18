import { useState, useEffect } from 'react';
import { Filter, Bell, BellOff, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { useAuthStore } from '@/stores/authStore';
import { getFilterDevices, toggleFilterReminder, type FilterDevice } from '@/services/filterTrackingService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerBadge,
  CustomerButton,
} from '@/components/customer/customer-ui';
import { cn } from '@/lib/utils';

function computeNextChange(f: FilterDevice): string {
  const next = new Date();
  next.setDate(next.getDate() + f.daysRemaining);
  return next.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function CustomerFilterTrackingPage() {
  const user = useAuthStore((s) => s.user);
  const [filters, setFilters] = useState<FilterDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void getFilterDevices(user.id).then((data) => {
      setFilters(data);
      setLoading(false);
    });
  }, [user]);

  const handleToggleReminder = async (id: string, enabled: boolean) => {
    await toggleFilterReminder(id, !enabled);
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, reminderEnabled: !enabled } : f)));
  };

  if (loading) {
    return (
      <CustomerPageShell>
        <CustomerLoading rows={3} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Filtre Takibi"
        description="Filtre ömrünüzü takip edin, değişim zamanını kaçırmayın."
      />

      <div className="bg-gradient-to-r from-aq-sky to-aq-ice rounded-2xl border border-aq-border/40 p-5 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-aq-border/40">
            <Filter className="w-5 h-5 text-aq-blue" />
          </div>
          <div>
            <p className="text-sm font-semibold text-aq-text">Filtre değişim zamanı yaklaşıyor mu?</p>
            <p className="text-xs text-aq-muted">Hemen yeni filtre seti sipariş edin.</p>
          </div>
        </div>
        <Link to="/urunler">
          <CustomerButton>
            <ShoppingCart className="w-3.5 h-3.5" /> Filtre Satın Al
          </CustomerButton>
        </Link>
      </div>

      {filters.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Filter}
            title="Filtre takibi yok"
            message="Cihazınıza filtre eklediğinizde burada görünecek."
          />
        </CustomerCard>
      ) : (
        <div className="space-y-3">
          {filters.map((f) => (
            <CustomerCard
              key={f.id}
              className={cn(
                '!p-5',
                f.daysRemaining <= 14 && '!border-amber-200 !bg-amber-50/30',
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-aq-text">{f.filterName}</p>
                    {f.daysRemaining <= 14 && <CustomerBadge tone="warning">Yakında</CustomerBadge>}
                  </div>
                  <p className="text-xs text-aq-muted">{f.deviceName}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-aq-muted">
                    <span>
                      Son Değişim:{' '}
                      <span className="font-medium text-aq-text">{f.lastChangedAt ?? f.installedAt}</span>
                    </span>
                    <span>
                      Sonraki: <span className="font-medium text-aq-text">{computeNextChange(f)}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p
                      className={cn(
                        'text-2xl font-bold tabular-nums',
                        f.daysRemaining <= 14 ? 'text-amber-600' : 'text-aq-blue',
                      )}
                    >
                      {Math.max(0, f.daysRemaining)}
                    </p>
                    <p className="text-[10px] text-aq-muted">gün kaldı</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleToggleReminder(f.id, f.reminderEnabled)}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                      f.reminderEnabled ? 'bg-aq-sky text-aq-blue' : 'bg-aq-ice text-aq-muted',
                    )}
                    aria-label="Hatırlatıcı"
                  >
                    {f.reminderEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-aq-ice rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    f.daysRemaining <= 14
                      ? 'bg-amber-400'
                      : f.daysRemaining <= 60
                        ? 'bg-aq-aqua'
                        : 'bg-emerald-400',
                  )}
                  style={{
                    width: `${Math.min(100, Math.max(5, (f.daysRemaining / f.changeIntervalDays) * 100))}%`,
                  }}
                />
              </div>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
