import { useState, useEffect, useCallback } from 'react';
import { Send, RotateCcw, Trash2, ShoppingCart } from 'lucide-react';
import {
  getAbandonedCarts,
  getStats,
  sendReminder,
  markConverted,
  deleteAbandonedCart,
  type AbandonedCart,
} from '@/services/abandonedCartService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminStatCard,
  AdminLoading,
  AdminEmpty,
  AdminCard,
  AdminBadge,
  AdminButton,
} from '@/components/admin/admin-ui';

const statusTone: Record<string, 'info' | 'warning' | 'success'> = {
  new: 'info',
  'reminder-sent': 'warning',
  converted: 'success',
};

const statusLabel: Record<string, string> = {
  new: 'Yeni',
  'reminder-sent': 'Hatırlatıcı Kuyrukta',
  converted: 'Dönüştü',
};

export default function AdminAbandonedCartsPage() {
  const addToast = useToastStore((s) => s.add);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, reminderSent: 0, converted: 0, avgCartValue: 0 });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [cartData, statsData] = await Promise.all([getAbandonedCarts(), getStats()]);
    setCarts(cartData);
    setStats(statsData);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleSendReminder = async (id: string) => {
    const result = await sendReminder(id);
    if (result.success) {
      addToast('Hatırlatıcı e-posta kuyruğuna alındı.', 'success');
      void refresh();
    }
  };

  const handleConvert = async (id: string) => {
    const result = await markConverted(id);
    if (result.success) {
      addToast('Dönüştürüldü olarak işaretlendi.', 'success');
      void refresh();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAbandonedCart(id);
    if (result.success) void refresh();
  };

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Terk Edilmiş Sepetler"
        description="Sepeti terk eden müşterileri takip edin, hatırlatıcı gönderin."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <AdminStatCard label="Toplam" value={stats.total} />
        <AdminStatCard label="Yeni" value={stats.new} />
        <AdminStatCard label="Hatırlatıcı" value={stats.reminderSent} />
        <AdminStatCard label="Dönüşüm" value={stats.converted} />
      </div>

      {loading ? (
        <AdminLoading />
      ) : carts.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty icon={ShoppingCart} message="Terk edilmiş sepet bulunmuyor." />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {carts.map((cart) => (
            <AdminCard key={cart.id}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-aq-text">{cart.customerName}</p>
                  {cart.customerEmail && <p className="text-xs text-aq-muted">{cart.customerEmail}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <AdminBadge tone={statusTone[cart.status] ?? 'neutral'}>
                    {statusLabel[cart.status] ?? cart.status}
                  </AdminBadge>
                  <span className="text-sm font-semibold text-aq-text">{cart.total.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>
              <p className="text-xs text-aq-muted mb-3">
                {cart.items.length} ürün · Son aktivite: {new Date(cart.lastActivity).toLocaleString('tr-TR')}
              </p>
              <div className="flex flex-wrap gap-2">
                {cart.status === 'new' && (
                  <AdminButton
                    type="button"
                    className="text-xs min-h-0 py-1.5 px-3"
                    onClick={() => void handleSendReminder(cart.id)}
                  >
                    <Send className="w-3.5 h-3.5" /> Hatırlat
                  </AdminButton>
                )}
                {cart.status !== 'converted' && (
                  <AdminButton
                    type="button"
                    variant="secondary"
                    className="text-xs min-h-0 py-1.5 px-3"
                    onClick={() => void handleConvert(cart.id)}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Dönüştü
                  </AdminButton>
                )}
                <AdminButton
                  type="button"
                  variant="danger"
                  className="text-xs min-h-0 py-1.5 px-3"
                  onClick={() => void handleDelete(cart.id)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </AdminButton>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </AdminPageShell>
  );
}
