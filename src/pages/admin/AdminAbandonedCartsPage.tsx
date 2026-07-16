import { useState, useEffect, useCallback } from 'react';
import { Send, RotateCcw, Trash2 } from 'lucide-react';
import {
  getAbandonedCarts,
  getStats,
  sendReminder,
  markConverted,
  deleteAbandonedCart,
  type AbandonedCart,
} from '@/services/abandonedCartService';
import { useToastStore } from '@/components/Toast';

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
      addToast('Hatırlatıcı gönderildi.', 'success');
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

  const statusColor: Record<string, string> = {
    new: 'text-aq-blue bg-aq-ice',
    'reminder-sent': 'text-amber-600 bg-amber-50',
    converted: 'text-emerald-600 bg-emerald-50',
  };

  const statusLabel: Record<string, string> = {
    new: 'Yeni',
    'reminder-sent': 'Hatırlatıcı Gönderildi',
    converted: 'Dönüştü',
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-aq-text mb-1">Terk Edilmiş Sepetler</h1>
      <p className="text-sm text-aq-muted mb-6">Sepeti terk eden müşterileri takip edin, hatırlatıcı gönderin.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam', value: stats.total },
          { label: 'Yeni', value: stats.new },
          { label: 'Hatırlatıcı', value: stats.reminderSent },
          { label: 'Dönüşüm', value: stats.converted },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-aq-border/60 rounded-xl p-4">
            <p className="text-xs text-aq-muted">{s.label}</p>
            <p className="text-xl font-semibold text-aq-text">{s.value}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-aq-muted">Yükleniyor...</div>
      ) : carts.length === 0 ? (
        <div className="bg-white border border-aq-border/60 rounded-2xl p-8 text-center text-sm text-aq-muted">
          Terk edilmiş sepet bulunmuyor.
        </div>
      ) : (
        <div className="space-y-3">
          {carts.map((cart) => (
            <div key={cart.id} className="bg-white border border-aq-border/60 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-aq-text">{cart.customerName}</p>
                  {cart.customerEmail && <p className="text-xs text-aq-muted">{cart.customerEmail}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[cart.status]}`}>
                    {statusLabel[cart.status]}
                  </span>
                  <span className="text-sm font-semibold text-aq-text">{cart.total.toLocaleString('tr-TR')}₺</span>
                </div>
              </div>
              <p className="text-xs text-aq-muted mb-3">
                {cart.items.length} ürün · Son aktivite: {new Date(cart.lastActivity).toLocaleString('tr-TR')}
              </p>
              <div className="flex gap-2">
                {cart.status === 'new' && (
                  <button
                    onClick={() => void handleSendReminder(cart.id)}
                    className="flex items-center gap-1.5 text-xs bg-aq-blue text-white px-3 py-1.5 rounded-xl hover:bg-aq-deep"
                  >
                    <Send className="w-3.5 h-3.5" /> Hatırlat
                  </button>
                )}
                {cart.status !== 'converted' && (
                  <button
                    onClick={() => void handleConvert(cart.id)}
                    className="flex items-center gap-1.5 text-xs border border-aq-border/60 text-aq-muted px-3 py-1.5 rounded-lg hover:border-emerald-400 hover:text-emerald-600"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Dönüştü
                  </button>
                )}
                <button
                  onClick={() => void handleDelete(cart.id)}
                  className="flex items-center gap-1.5 text-xs border border-red-200 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
