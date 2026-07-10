import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft, Package, MapPin, CreditCard, Printer, ChevronDown,
  User, Phone, Mail, Receipt, Tag, Percent, Calendar, Loader2, Save
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  getOrderById,
  updateOrderStatus,
  updateOrderShipping,
  type OrderDetail,
} from '@/services/orderService';
import { orderStatusFromTr, orderStatusToTr, ADMIN_ORDER_STATUS_OPTIONS } from '@/lib/orderStatus';
import { useToastStore } from '@/components/Toast';

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const addToast = useToastStore((s) => s.add);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLabel, setStatusLabel] = useState('');
  const [cargoCompany, setCargoCompany] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const data = await getOrderById(id);
    setOrder(data);
    if (data) {
      setStatusLabel(orderStatusToTr(data.status));
      setCargoCompany(data.cargoCompany ?? '');
      setTrackingNo(data.trackingNumber ?? '');
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [id]);

  const handleStatusChange = async (label: string) => {
    if (!order) return;
    setStatusLabel(label);
    const status = orderStatusFromTr(label);
    const res = await updateOrderStatus(order.id, status);
    if (res.success) {
      addToast('Durum güncellendi.', 'success');
      setOrder({ ...order, status });
    } else {
      addToast(res.error ?? 'Güncellenemedi.', 'error');
    }
  };

  const handleSaveShipping = async () => {
    if (!order || !cargoCompany || !trackingNo) {
      addToast('Kargo firması ve takip no girin.', 'error');
      return;
    }
    setSaving(true);
    const res = await updateOrderShipping(order.id, cargoCompany, trackingNo);
    setSaving(false);
    if (res.success) {
      addToast('Kargo bilgisi kaydedildi.', 'success');
      setOrder({ ...order, cargoCompany, trackingNumber: trackingNo, status: 'shipped' });
      setStatusLabel('Kargoda');
    } else {
      addToast(res.error ?? 'Kaydedilemedi.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[#8B9DAF]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-[#8B9DAF]">Sipariş bulunamadı.</p>
        <Link to="/admin/siparisler" className="text-[#1A73E8] text-sm mt-2 inline-block">Geri dön</Link>
      </div>
    );
  }

  const paid = order.paymentStatus === 'paid';
  const timeline = [
    { step: 'Sipariş Alındı', done: true },
    { step: 'Ödeme Onaylandı', done: paid },
    { step: 'Hazırlanıyor', done: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { step: 'Kargoda', done: ['shipped', 'delivered'].includes(order.status) },
    { step: 'Teslim Edildi', done: order.status === 'delivered' },
  ];
  const progress = (timeline.filter((t) => t.done).length / timeline.length) * 100;

  return (
    <>
      <Link to="/admin/siparisler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-[#1A73E8] mb-5">
        <ArrowLeft className="w-4 h-4" /> Siparişlere Dön
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <Receipt className="w-5 h-5 text-[#1A73E8]" />
          <h2 className="text-lg font-semibold text-[#0D2137]">{order.orderNo}</h2>
          <StatusBadge status={order.status} />
          <span className="text-xs text-[#8B9DAF]">Ödeme: {order.paymentStatus}</span>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusLabel}
              onChange={(e) => void handleStatusChange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-white min-w-[160px]"
            >
              {ADMIN_ORDER_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B9DAF]" />
          </div>
          <button className="flex items-center gap-2 border border-[#D6E3F0] px-4 py-2.5 rounded-xl text-sm">
            <Printer className="w-4 h-4" /> Yazdır
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">İlerleme</span>
          <span className="text-sm font-bold text-[#1A73E8]">%{Math.round(progress)}</span>
        </div>
        <div className="w-full h-2 bg-[#F0F6FF] rounded-full">
          <div className="h-full bg-gradient-to-r from-[#1A73E8] to-[#00C9A7] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-[#8B9DAF] mt-2 flex items-center gap-1"><Calendar className="w-3 h-3" />{order.date}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-[#1A73E8]" /> Ürünler</h3>
            {order.products.map((p, i) => (
              <div key={i} className="flex justify-between py-3 border-b border-[#F0F6FF] last:border-0">
                <div>
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="text-xs text-[#8B9DAF]">{p.qty} adet × {p.price.toLocaleString('tr-TR')}₺</p>
                </div>
                <p className="text-sm font-bold">{(p.qty * p.price).toLocaleString('tr-TR')}₺</p>
              </div>
            ))}
          </div>

          {order.note && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-2">
              <Tag className="w-4 h-4 text-amber-500" />
              <p className="text-sm text-amber-700"><strong>Not:</strong> {order.note}</p>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><User className="w-4 h-4" /> Müşteri</h3>
            <p className="text-sm font-semibold">{order.customer.name}</p>
            <p className="text-xs text-[#8B9DAF] flex items-center gap-1 mt-1"><Mail className="w-3 h-3" />{order.customer.email}</p>
            <p className="text-xs text-[#8B9DAF] flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer.phone || '—'}</p>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Teslimat</h3>
            <p className="text-sm text-[#5A6B7B]">{order.shipping.address}</p>
            <div className="mt-4 space-y-2">
              <input value={cargoCompany} onChange={(e) => setCargoCompany(e.target.value)} placeholder="Kargo firması" className="w-full px-3 py-2 text-sm border rounded-xl" />
              <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} placeholder="Takip numarası" className="w-full px-3 py-2 text-sm border rounded-xl" />
              <button onClick={() => void handleSaveShipping()} disabled={saving} className="flex items-center gap-2 w-full justify-center bg-[#1A73E8] text-white py-2 rounded-xl text-sm font-medium disabled:opacity-60">
                <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kargo Bilgisi Kaydet'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Ödeme</h3>
            <p className="text-sm mb-3">{order.payment}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Ara Toplam</span><span>{order.subtotal.toLocaleString('tr-TR')}₺</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-1"><Percent className="w-3 h-3" />İndirim</span><span>-{order.discount.toLocaleString('tr-TR')}₺</span></div>
              <div className="flex justify-between"><span>Kargo</span><span>{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost}₺`}</span></div>
              <div className="flex justify-between font-bold pt-2 border-t"><span>Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
