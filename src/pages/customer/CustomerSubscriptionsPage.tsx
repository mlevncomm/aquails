import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { RefreshCw, Pause, Play, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import {
  getCustomerSubscriptions,
  updateSubscriptionStatus,
  type CustomerSubscription,
} from '@/services/subscriptionService';

const statusLabels: Record<string, { text: string; color: string }> = {
  active: { text: 'Aktif', color: 'bg-emerald-50 text-emerald-600' },
  paused: { text: 'Duraklatıldı', color: 'bg-amber-50 text-amber-600' },
  cancelled: { text: 'İptal', color: 'bg-gray-100 text-gray-500' },
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
      <div className="flex items-center justify-center py-16 text-aq-muted">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-aq-text mb-5">Aboneliklerim</h2>

      {subscriptions.length === 0 ? (
        <EmptyState
          icon={<RefreshCw className="w-8 h-8" />}
          title="Aktif Aboneliğiniz Yok"
          description="Filtre aboneliği oluşturarak filtrelerinizin düzenli olarak gelmesini sağlayabilirsiniz."
          action={{ label: 'Abonelikleri İncele', href: '/filtre-aboneligi' }}
        />
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => {
            const status = statusLabels[sub.status] ?? statusLabels.active;
            return (
              <div key={sub.id} className="bg-white border border-aq-border/60 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-aq-text">{planLabels[sub.plan] ?? sub.plan} Filtre Paketi</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>{status.text}</span>
                    </div>
                    <p className="text-xs text-aq-muted">{sub.device}</p>
                  </div>
                  <span className="text-lg font-semibold text-aq-text">{sub.price.toLocaleString('tr-TR')}₺<span className="text-xs text-aq-muted font-normal">/dönem</span></span>
                </div>
                <div className="flex items-center gap-4 text-xs text-aq-muted mb-4 pb-4 border-b border-aq-border/60">
                  <span>Sonraki Teslimat: <strong className="text-aq-text">{sub.nextDelivery}</strong></span>
                </div>
                {sub.status === 'active' && (
                  <button onClick={() => void handlePause(sub.id)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border border-aq-border/60 rounded-xl text-aq-muted hover:bg-aq-ice">
                    <Pause className="w-3.5 h-3.5" /> Duraklat
                  </button>
                )}
                {sub.status === 'paused' && (
                  <button onClick={() => void handleResume(sub.id)} className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-aq-blue text-white rounded-xl hover:bg-aq-deep hover:text-white">
                    <Play className="w-3.5 h-3.5" /> Devam Ettir
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
