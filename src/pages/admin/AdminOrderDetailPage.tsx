import { Link, useParams } from 'react-router';
import {
  ArrowLeft, Package, MapPin, CreditCard, Printer, ChevronDown,
  CheckCircle, Truck, User, Phone, Mail, Receipt, Tag,
  Percent, Calendar, Loader2, Save,
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getOrderById, updateOrderStatus, updateOrderShipping, adminConfirmOfflinePayment } from '@/services/orderService';
import type { OrderDetail } from '@/services/orderService';
import { ADMIN_ORDER_STATUS_OPTIONS, orderStatusFromTr, orderStatusToTr } from '@/lib/orderStatus';
import { useToastStore } from '@/components/Toast';
import { AdminCard } from '@/components/admin/admin-ui';

const TIMELINE_STEPS = [
  { key: 'pending', step: 'Sipariş Alındı', icon: Receipt },
  { key: 'processing', step: 'Hazırlanıyor', icon: Package },
  { key: 'shipped', step: 'Kargoya Verildi', icon: Truck },
  { key: 'delivered', step: 'Teslim Edildi', icon: CheckCircle },
];

const STATUS_ORDER = ['pending', 'processing', 'shipped', 'delivered'];

function buildTimeline(status: string, date: string, paymentStatus: string) {
  const idx = STATUS_ORDER.indexOf(status);
  const paid = paymentStatus === 'paid';
  const steps = [
    { step: 'Sipariş Alındı', icon: Receipt, done: true },
    { step: 'Ödeme Onaylandı', icon: CreditCard, done: paid },
    ...TIMELINE_STEPS.slice(1).map((t, i) => ({
      step: t.step,
      icon: t.icon,
      done: status === 'cancelled' || status === 'returned' ? false : i + 1 <= idx,
    })),
  ];
  return steps.map((t, i) => ({
    ...t,
    date: i === 0 ? date : t.done ? date : '',
  }));
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const addToast = useToastStore((s) => s.add);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('');
  const [cargoCompany, setCargoCompany] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    if (!id) return;
    void getOrderById(id).then((data) => {
      setOrder(data);
      if (data) {
        setCurrentStatus(data.status);
        setCargoCompany(data.cargoCompany ?? '');
        setTrackingNo(data.trackingNumber ?? '');
      }
      setLoading(false);
    });
  }, [id]);

  const handleConfirmPayment = async () => {
    if (!order) return;
    setConfirmingPayment(true);
    const res = await adminConfirmOfflinePayment(order.id);
    setConfirmingPayment(false);
    if (res.success) {
      setOrder({ ...order, paymentStatus: 'paid', status: order.status === 'pending' ? 'processing' : order.status });
      setCurrentStatus((prev) => (prev === 'pending' ? 'processing' : prev));
      addToast('Ödeme onaylandı, sipariş işleme alındı.', 'success');
    } else {
      addToast(res.error ?? 'Ödeme onaylanamadı.', 'error');
    }
  };

  const handleStatusChange = async (label: string) => {
    if (!id || !order) return;
    const status = orderStatusFromTr(label);
    const result = await updateOrderStatus(id, status);
    if (result.success) {
      setCurrentStatus(status);
      setOrder({ ...order, status });
      addToast('Sipariş durumu güncellendi.', 'success');
    } else {
      addToast(result.error ?? 'Güncelleme başarısız.', 'error');
    }
  };

  const handleSaveShipping = async () => {
    if (!order || !cargoCompany.trim() || !trackingNo.trim()) {
      addToast('Kargo firması ve takip numarası girin.', 'error');
      return;
    }
    setSaving(true);
    const res = await updateOrderShipping(order.id, cargoCompany.trim(), trackingNo.trim());
    setSaving(false);
    if (res.success) {
      setCurrentStatus('shipped');
      setOrder({ ...order, cargoCompany, trackingNumber: trackingNo, status: 'shipped' });
      addToast('Kargo bilgisi kaydedildi.', 'success');
    } else {
      addToast(res.error ?? 'Kaydedilemedi.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-aq-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <>
        <Link to="/admin/siparisler" className="inline-flex items-center gap-1.5 text-sm text-aq-muted hover:text-aq-blue mb-6">
          <ArrowLeft className="w-4 h-4" /> Siparişlere Dön
        </Link>
        <AdminCard>
          <p className="text-center py-12 text-aq-muted">Sipariş bulunamadı.</p>
        </AdminCard>
      </>
    );
  }

  const timeline = buildTimeline(currentStatus, order.date, order.paymentStatus);
  const doneSteps = timeline.filter((t) => t.done).length;
  const progress = (doneSteps / timeline.length) * 100;

  return (
    <>
      <Link to="/admin/siparisler" className="inline-flex items-center gap-1.5 text-sm text-aq-muted hover:text-aq-blue mb-6">
        <ArrowLeft className="w-4 h-4" /> Siparişlere Dön
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 bg-aq-sky rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-aq-blue" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-aq-text">{order.orderNo}</h2>
            <p className="text-xs text-aq-muted flex items-center gap-1"><Calendar className="w-3 h-3" />{order.date}</p>
          </div>
          <StatusBadge status={currentStatus} />
          <span className="text-xs text-aq-muted bg-aq-ice px-2 py-0.5 rounded-full">Ödeme: {order.paymentStatus}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {order.paymentStatus !== 'paid' && (
            <button
              type="button"
              onClick={() => void handleConfirmPayment()}
              disabled={confirmingPayment}
              className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-aq-deep disabled:opacity-60"
            >
              {confirmingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Ödemeyi Onayla
            </button>
          )}
          <div className="relative">
            <select
              value={orderStatusToTr(currentStatus)}
              onChange={(e) => void handleStatusChange(e.target.value)}
              className="appearance-none cursor-pointer pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-aq-border/60 rounded-xl text-aq-text focus:outline-none focus:ring-2 focus:ring-aq-aqua/30 min-w-[160px]"
            >
              {ADMIN_ORDER_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-aq-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white border border-aq-border/60 text-aq-muted px-4 py-2.5 rounded-xl text-sm font-medium hover:border-aq-aqua/50 hover:text-aq-blue"
          >
            <Printer className="w-4 h-4" /> Yazdır
          </button>
        </div>
      </div>

      <AdminCard className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-aq-text">Sipariş Durumu</span>
          <span className="text-sm font-semibold text-aq-blue">%{Math.round(progress)}</span>
        </div>
        <div className="w-full h-2.5 bg-aq-ice rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-aq-blue to-aq-aqua rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-aq-blue" /> Sipariş Ürünleri ({order.products.length})
            </h3>
            {order.products.map((p, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-aq-border/60 last:border-0">
                <div className="w-14 h-14 bg-aq-ice rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-aq-sky/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aq-text">{p.name}</p>
                  <p className="text-xs text-aq-muted mt-1">{p.qty} adet</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-aq-text">{(p.price * p.qty).toLocaleString('tr-TR')}₺</p>
                </div>
              </div>
            ))}
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-aq-blue" /> Sipariş Takibi
            </h3>
            <div className="relative pl-2">
              <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-aq-ice" />
              {timeline.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    <div className={cn(
                      'relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      t.done ? 'bg-aq-deep text-white' : 'bg-aq-ice border border-aq-border/60',
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 pt-1">
                      <p className={cn('text-sm font-semibold', t.done ? 'text-aq-text' : 'text-aq-muted')}>{t.step}</p>
                      {t.date && <p className="text-xs text-aq-muted mt-0.5">{t.date}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </AdminCard>

          {order.note && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Tag className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700"><strong>Sipariş Notu:</strong> {order.note}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-aq-blue" /> Müşteri
            </h3>
            <div className="bg-aq-ice rounded-xl p-4">
              <p className="text-sm font-semibold text-aq-text">{order.customer.name}</p>
              <p className="text-xs text-aq-muted mt-1 flex items-center gap-1"><Mail className="w-3 h-3" />{order.customer.email}</p>
              {order.customer.phone && (
                <p className="text-xs text-aq-muted flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer.phone}</p>
              )}
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-aq-blue" /> Teslimat & Kargo
            </h3>
            <div className="bg-aq-ice rounded-xl p-4 mb-4">
              <p className="text-xs text-aq-muted mb-1">{order.shipping.title}</p>
              <p className="text-sm text-aq-muted leading-relaxed">{order.shipping.address || '—'}</p>
            </div>
            <div className="space-y-2">
              <input
                value={cargoCompany}
                onChange={(e) => setCargoCompany(e.target.value)}
                placeholder="Kargo firması (örn: Yurtiçi Kargo)"
                className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue"
              />
              <input
                value={trackingNo}
                onChange={(e) => setTrackingNo(e.target.value)}
                placeholder="Takip numarası"
                className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue"
              />
              <button
                type="button"
                onClick={() => void handleSaveShipping()}
                disabled={saving}
                className="flex items-center justify-center gap-2 w-full bg-aq-blue text-white py-2.5 rounded-xl text-sm font-medium hover:bg-aq-deep hover:text-white disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : 'Kargo Bilgisi Kaydet'}
              </button>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-aq-blue" /> Ödeme
            </h3>
            <p className="text-sm text-aq-muted mb-3">{order.payment}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-aq-muted">
                <span>Ara Toplam</span><span>{order.subtotal.toLocaleString('tr-TR')}₺</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-aq-muted">
                  <span className="flex items-center gap-1"><Percent className="w-3 h-3" />İndirim</span>
                  <span className="text-emerald-600">-{order.discount.toLocaleString('tr-TR')}₺</span>
                </div>
              )}
              <div className="flex justify-between text-aq-muted">
                <span>Kargo</span>
                <span>{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost.toLocaleString('tr-TR')}₺`}</span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between text-aq-muted">
                  <span>Kapıda Ödeme</span><span>+{order.codFee.toLocaleString('tr-TR')}₺</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-aq-text pt-2 border-t border-aq-border/60">
                <span>Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </>
  );
}
