import { useState, useEffect } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { RotateCcw, Plus, X, Loader2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import { getCustomerReturns, createReturnRequest, type ReturnRequest } from '@/services/returnService';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';

const reasons = ['Farklı model istiyorum', 'Arızalı ürün', 'Kusurlu ürün', 'Beklentimi karşılamadı', 'Diğer'];
const statusLabels: Record<string, { text: string; color: string }> = {
  pending: { text: 'Bekliyor', color: 'bg-blue-50 text-blue-600' },
  approved: { text: 'Onaylandı', color: 'bg-emerald-50 text-emerald-600' },
  rejected: { text: 'Reddedildi', color: 'bg-red-50 text-red-600' },
  completed: { text: 'Tamamlandı', color: 'bg-gray-100 text-gray-500' },
};
const typeLabels: Record<string, string> = { return: 'İade', exchange: 'Değişim' };

export default function CustomerReturnsPage() {
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    orderId: '',
    orderNo: '',
    productName: '',
    type: 'return' as 'return' | 'exchange',
    reason: '',
    description: '',
  });

  const loadData = async () => {
    if (!user) return;
    const [returnData, orderData] = await Promise.all([
      getCustomerReturns(user.id),
      getCustomerOrders(user.id),
    ]);
    setReturns(returnData);
    setOrders(orderData);
    setLoading(false);
  };

  useEffect(() => {
    void loadData();
  }, [user]);

  const handleOrderChange = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    setForm({
      ...form,
      orderId,
      orderNo: order?.orderNo ?? '',
      productName: order?.items[0]?.name ?? '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.orderNo || !form.productName || !form.reason) {
      addToast('Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }
    setSaving(true);
    const res = await createReturnRequest({
      userId: user.id,
      orderId: form.orderId || undefined,
      orderNumber: form.orderNo,
      productName: form.productName,
      type: form.type,
      reason: form.reason,
    });
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Talep oluşturulamadı.', 'error');
      return;
    }
    addToast('Talebiniz oluşturuldu.', 'success');
    setShowForm(false);
    setForm({ orderId: '', orderNo: '', productName: '', type: 'return', reason: '', description: '' });
    void loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#8B9DAF]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">İade / Değişim Taleplerim</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1557B0]">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'İptal' : 'Yeni Talep'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Sipariş</label>
              {orders.length > 0 ? (
                <select
                  required
                  value={form.orderId}
                  onChange={(e) => handleOrderChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]"
                >
                  <option value="">Sipariş seçin</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>{o.orderNo} — {o.date}</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  value={form.orderNo}
                  onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                  placeholder="Sipariş No"
                  className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]"
                />
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Talep Tipi</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'return' | 'exchange' })}
                className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]"
              >
                <option value="return">İade</option>
                <option value="exchange">Değişim</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Ürün Adı</label>
            <input
              required
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Sebep</label>
            <select required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]">
              <option value="">Sebep seçin</option>
              {reasons.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Açıklama</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] resize-none" />
          </div>
          <button type="submit" disabled={saving} className="bg-[#1A73E8] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] disabled:opacity-60">
            {saving ? 'Oluşturuluyor...' : 'Talep Oluştur'}
          </button>
        </form>
      )}

      {returns.length === 0 ? (
        <EmptyState icon={<RotateCcw className="w-8 h-8" />} title="Talebiniz Yok" description="Henüz bir iade/değişim talebiniz bulunmuyor." />
      ) : (
        <div className="space-y-3">
          {returns.map((r) => {
            const s = statusLabels[r.status] ?? statusLabels.pending;
            return (
              <div key={r.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0D2137]">{r.productName}</p>
                    <p className="text-xs text-[#8B9DAF]">{r.orderNumber} · {typeLabels[r.type] ?? r.type}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${s.color}`}>{s.text}</span>
                </div>
                <p className="text-sm text-[#5A6B7B]">{r.reason}</p>
                <p className="text-xs text-[#8B9DAF] mt-1">{r.date}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
