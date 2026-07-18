import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { RefreshCw, Pause, Play } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import {
  getCustomerSubscriptions,
  updateSubscriptionStatus,
  type CustomerSubscription,
} from '@/services/subscriptionService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerBadge,
  CustomerButton,
} from '@/components/customer/customer-ui';

const statusTone: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  cancelled: 'neutral',
};
const statusText: Record<string, string> = {
  active: 'Aktif',
  paused: 'Duraklatıldı',
  cancelled: 'İptal',
};
const planLabels: Record<string, string> = { '6ay': '6 Aylık', '12ay': '12 Aylık', premium: 'Premium' };

export default function CustomerSubscriptionsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSubscriptions = async () => {
    if (!user) return;
    const data = await getCustomerSubscriptions(user.id);
    setSubscriptions(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadSubscriptions();
  }, [user]);

  const handlePause = async (id: string) => {
    const res = await updateSubscriptionStatus(id, 'paused');
    if (res.success) {
      addToast('Abonelik duraklatıldı.', 'info');
      void loadSubscriptions();
    } else {
      addToast(res.error ?? 'İşlem başarısız.', 'error');
    }
  };

  const handleResume = async (id: string) => {
    const res = await updateSubscriptionStatus(id, 'active');
    if (res.success) {
      addToast('Abonelik devam ettirildi.', 'success');
      void loadSubscriptions();
    } else {
      addToast(res.error ?? 'İşlem başarısız.', 'error');
    }
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
        title="Aboneliklerim"
        description="Filtre aboneliklerinizi yönetin."
      />

      {subscriptions.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={RefreshCw}
            title="Aktif aboneliğiniz yok"
            message="Filtre aboneliği oluşturarak filtrelerinizin düzenli gelmesini sağlayın."
            action={
              <Link to="/filtre-aboneligi">
                <CustomerButton>Abonelikleri İncele</CustomerButton>
              </Link>
            }
          />
        </CustomerCard>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <CustomerCard key={sub.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-sm font-semibold text-aq-text">
                      {planLabels[sub.plan] ?? sub.plan} Filtre Paketi
                    </h3>
                    <CustomerBadge tone={statusTone[sub.status] ?? 'neutral'}>
                      {statusText[sub.status] ?? sub.status}
                    </CustomerBadge>
                  </div>
                  <p className="text-xs text-aq-muted">{sub.device}</p>
                </div>
                <span className="text-lg font-semibold text-aq-text tabular-nums">
                  {sub.price.toLocaleString('tr-TR')}₺
                  <span className="text-xs text-aq-muted font-normal">/dönem</span>
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-aq-muted mb-4 pb-4 border-b border-aq-border/60">
                <span>
                  Sonraki Teslimat:{' '}
                  <strong className="text-aq-text">{sub.nextDelivery}</strong>
                </span>
              </div>
              {sub.status === 'active' && (
                <CustomerButton variant="secondary" onClick={() => void handlePause(sub.id)}>
                  <Pause className="w-3.5 h-3.5" /> Duraklat
                </CustomerButton>
              )}
              {sub.status === 'paused' && (
                <CustomerButton onClick={() => void handleResume(sub.id)}>
                  <Play className="w-3.5 h-3.5" /> Devam Ettir
                </CustomerButton>
              )}
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
