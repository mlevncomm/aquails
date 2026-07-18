import { useState, useEffect } from 'react';
import { RotateCcw, Plus, X } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { useAuthStore } from '@/stores/authStore';
import { getCustomerReturns, createReturnRequest, type ReturnRequest } from '@/services/returnService';
import { getCustomerOrders, type CustomerOrder } from '@/services/orderService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerInput,
  CustomerSelect,
  CustomerTextarea,
  CustomerLabel,
  CustomerButton,
  CustomerBadge,
} from '@/components/customer/customer-ui';

const reasons = [
  'Farklı model istiyorum',
  'Arızalı ürün',
  'Kusurlu ürün',
  'Beklentimi karşılamadı',
  'Diğer',
];
const statusTone: Record<string, 'info' | 'success' | 'danger' | 'neutral'> = {
  pending: 'info',
  approved: 'success',
  rejected: 'danger',
  completed: 'neutral',
};
const statusText: Record<string, string> = {
  pending: 'Bekliyor',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  completed: 'Tamamlandı',
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
    setForm({
      orderId: '',
      orderNo: '',
      productName: '',
      type: 'return',
      reason: '',
      description: '',
    });
    void loadData();
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
        title="İade / Değişim"
        description="İade ve değişim taleplerinizi buradan yönetin."
        action={
          <CustomerButton onClick={() => setShowForm(!showForm)}>
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'İptal' : 'Yeni Talep'}
          </CustomerButton>
        }
      />

      {showForm && (
        <CustomerCard className="mb-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <CustomerLabel>Sipariş</CustomerLabel>
                {orders.length > 0 ? (
                  <CustomerSelect
                    required
                    value={form.orderId}
                    onChange={(e) => handleOrderChange(e.target.value)}
                  >
                    <option value="">Sipariş seçin</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNo} — {o.date}
                      </option>
                    ))}
                  </CustomerSelect>
                ) : (
                  <CustomerInput
                    required
                    value={form.orderNo}
                    onChange={(e) => setForm({ ...form, orderNo: e.target.value })}
                    placeholder="Sipariş No"
                  />
                )}
              </div>
              <div>
                <CustomerLabel>Talep Tipi</CustomerLabel>
                <CustomerSelect
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value as 'return' | 'exchange' })
                  }
                >
                  <option value="return">İade</option>
                  <option value="exchange">Değişim</option>
                </CustomerSelect>
              </div>
            </div>
            <div>
              <CustomerLabel>Ürün Adı</CustomerLabel>
              <CustomerInput
                required
                value={form.productName}
                onChange={(e) => setForm({ ...form, productName: e.target.value })}
              />
            </div>
            <div>
              <CustomerLabel>Sebep</CustomerLabel>
              <CustomerSelect
                required
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              >
                <option value="">Sebep seçin</option>
                {reasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </CustomerSelect>
            </div>
            <div>
              <CustomerLabel>Açıklama</CustomerLabel>
              <CustomerTextarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
            <CustomerButton type="submit" disabled={saving}>
              {saving ? 'Oluşturuluyor...' : 'Talep Oluştur'}
            </CustomerButton>
          </form>
        </CustomerCard>
      )}

      {returns.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={RotateCcw}
            title="Talebiniz yok"
            message="Henüz bir iade/değişim talebiniz bulunmuyor."
            action={
              <CustomerButton onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" /> Yeni Talep
              </CustomerButton>
            }
          />
        </CustomerCard>
      ) : (
        <div className="space-y-3">
          {returns.map((r) => (
            <CustomerCard key={r.id}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-aq-text">{r.productName}</p>
                  <p className="text-xs text-aq-muted">
                    {r.orderNumber} · {typeLabels[r.type] ?? r.type}
                  </p>
                </div>
                <CustomerBadge tone={statusTone[r.status] ?? 'info'}>
                  {statusText[r.status] ?? r.status}
                </CustomerBadge>
              </div>
              <p className="text-sm text-aq-muted">{r.reason}</p>
              <p className="text-xs text-aq-muted mt-1">{r.date}</p>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
