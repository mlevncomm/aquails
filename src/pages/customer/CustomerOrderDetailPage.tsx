import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  Package, Truck, CheckCircle, Clock, MapPin,
  CreditCard, Calendar, Box, Loader2, XCircle,
} from 'lucide-react';
import { cancelMyOrder, getOrderById, type OrderDetail } from '@/services/orderService';
import { orderStatusToTr } from '@/lib/orderStatus';
import { useToastStore } from '@/components/Toast';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerBadge,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';

function buildTimeline(order: OrderDetail) {
  const paid = order.paymentStatus === 'paid';
  return [
    { step: 'Sipariş Alındı', date: order.date, done: true, desc: 'Siparişiniz başarıyla alındı.' },
    { step: 'Ödeme Onaylandı', date: paid ? order.date : '', done: paid, desc: paid ? 'Ödemeniz onaylandı.' : 'Ödeme bekleniyor.' },
    { step: 'Hazırlanıyor', date: '', done: ['processing', 'shipped', 'delivered'].includes(order.status), desc: 'Ürünleriniz hazırlanıyor.' },
    { step: 'Kargoya Verildi', date: '', done: ['shipped', 'delivered'].includes(order.status), desc: order.trackingNumber ? `Takip No: ${order.trackingNumber}` : 'Kargo bilgisi bekleniyor.' },
    { step: 'Teslim Edildi', date: '', done: order.status === 'delivered', desc: 'Teslimat tamamlandığında burada görünecek.' },
  ];
}

function orderTone(status: string): 'success' | 'info' | 'warning' | 'danger' | 'neutral' {
  if (status === 'delivered') return 'success';
  if (status === 'shipped' || status === 'processing') return 'info';
  if (status === 'pending') return 'warning';
  if (status === 'cancelled' || status === 'refunded') return 'danger';
  return 'neutral';
}

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const addToast = useToastStore((s) => s.add);

  const cancelOrder = async () => {
    if (!order || !window.confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) return;
    setCancelling(true);
    const result = await cancelMyOrder(order.id);
    setCancelling(false);
    if (!result.success) {
      addToast(result.error ?? 'Sipariş iptal edilemedi.', 'error');
      return;
    }
    addToast('Sipariş iptal edildi; stok, kupon ve randevu rezervasyonları geri alındı.', 'success');
    const refreshed = await getOrderById(order.id);
    setOrder(refreshed);
  };

  useEffect(() => {
    if (!id) return;
    void getOrderById(id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <CustomerPageShell>
        <CustomerLoading rows={5} />
      </CustomerPageShell>
    );
  }

  if (!order) {
    return (
      <CustomerPageShell>
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Package}
            title="Sipariş bulunamadı"
            message="Bu siparişe erişilemiyor veya silinmiş olabilir."
            action={
              <Link to="/hesabim/siparisler">
                <CustomerButton variant="secondary">Siparişlerime dön</CustomerButton>
              </Link>
            }
          />
        </CustomerCard>
      </CustomerPageShell>
    );
  }

  const timeline = buildTimeline(order);
  const completedSteps = timeline.filter((t) => t.done).length;
  const progressPercent = (completedSteps / timeline.length) * 100;

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title={order.orderNo}
        description="Sipariş durumu ve teslimat detayları"
        breadcrumb={[
          { label: 'Siparişlerim', to: '/hesabim/siparisler' },
          { label: order.orderNo },
        ]}
        action={<CustomerBadge tone={orderTone(order.status)}>{orderStatusToTr(order.status)}</CustomerBadge>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <CustomerCard>
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-aq-muted">Sipariş Durumu</span>
                <span className="font-medium text-aq-blue">%{Math.round(progressPercent)}</span>
              </div>
              <div className="w-full h-2 bg-aq-ice rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-aq-blue to-aq-aqua rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-aq-ice rounded-xl p-3">
                <p className="text-aq-muted text-[11px] mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Tarih
                </p>
                <p className="font-medium text-aq-text text-xs">{order.date}</p>
              </div>
              <div className="bg-aq-ice rounded-xl p-3">
                <p className="text-aq-muted text-[11px] mb-1 flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> Ödeme
                </p>
                <p className="font-medium text-aq-text text-xs">{order.payment}</p>
              </div>
              <div className="bg-aq-ice rounded-xl p-3">
                <p className="text-aq-muted text-[11px] mb-1">Tutar</p>
                <p className="font-semibold text-aq-text text-xs tabular-nums">
                  {order.total.toLocaleString('tr-TR')}₺
                </p>
              </div>
              <div className="bg-aq-ice rounded-xl p-3">
                <p className="text-aq-muted text-[11px] mb-1 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Kargo
                </p>
                <p className="font-medium text-aq-blue text-xs">
                  {order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost}₺`}
                </p>
              </div>
            </div>
          </CustomerCard>

          <CustomerCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-aq-blue" /> Sipariş Ürünleri ({order.products.length})
            </h3>
            {order.products.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex items-center gap-3 py-4 border-b border-aq-border/60 last:border-0"
              >
                <div className="w-14 h-14 bg-aq-sky/50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-aq-blue/40" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-aq-text">{p.name}</p>
                  <p className="text-xs text-aq-muted">{p.qty} adet</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">
                  {(p.price * p.qty).toLocaleString('tr-TR')}₺
                </p>
              </div>
            ))}
          </CustomerCard>

          <CustomerCard>
            <h3 className="text-sm font-semibold text-aq-text mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-aq-blue" /> Sipariş Takibi
            </h3>
            {timeline.map((t, i) => (
              <div key={t.step} className="flex items-start gap-4 pb-5 last:pb-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    t.done
                      ? 'bg-gradient-to-br from-aq-blue to-aq-aqua'
                      : 'bg-aq-ice border-2 border-aq-border/60'
                  }`}
                >
                  {t.done ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Clock className="w-4 h-4 text-aq-muted" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold ${t.done ? 'text-aq-text' : 'text-aq-muted'}`}>
                    {t.step}
                  </p>
                  {t.date && <p className="text-xs text-aq-muted">{t.date}</p>}
                  <p className="text-xs text-aq-muted mt-1">{t.desc}</p>
                </div>
                {i < timeline.length - 1 && t.done && (
                  <span className="sr-only">Adım tamamlandı</span>
                )}
              </div>
            ))}
          </CustomerCard>
        </div>

        <div className="space-y-4">
          <CustomerCard>
            <h3 className="text-sm font-semibold text-aq-text mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-aq-blue" /> Teslimat Adresi
            </h3>
            <p className="text-xs text-aq-muted">{order.shipping.title}</p>
            <p className="text-sm text-aq-muted mt-1 leading-relaxed">{order.shipping.address}</p>
          </CustomerCard>

          {(order.cargoCompany || order.trackingNumber) && (
            <CustomerCard>
              <h3 className="text-sm font-semibold text-aq-text mb-3">Kargo Bilgisi</h3>
              {order.cargoCompany && <p className="text-sm text-aq-muted">{order.cargoCompany}</p>}
              {order.trackingNumber && (
                <p className="text-sm font-medium text-aq-blue mt-1">{order.trackingNumber}</p>
              )}
            </CustomerCard>
          )}

          <CustomerCard>
            <h3 className="text-sm font-semibold text-aq-text mb-3">Sipariş Özeti</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-aq-muted">Ara Toplam</span>
                <span className="tabular-nums">{order.subtotal.toLocaleString('tr-TR')}₺</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between gap-3 text-aq-blue">
                  <span>İndirim</span>
                  <span className="tabular-nums">-{order.discount.toLocaleString('tr-TR')}₺</span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-aq-muted">Kargo</span>
                <span>{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost}₺`}</span>
              </div>
              {order.codFee > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-aq-muted">Kapıda Ödeme</span>
                  <span>+{order.codFee}₺</span>
                </div>
              )}
              <div className="flex justify-between gap-3 font-semibold pt-2 border-t border-aq-border/60">
                <span>Toplam</span>
                <span className="tabular-nums">{order.total.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </CustomerCard>

          <Link to="/urunler" className="block">
            <CustomerButton className="w-full">Tekrar Sipariş Ver</CustomerButton>
          </Link>
          {order.status === 'pending' && order.paymentStatus === 'pending' && (
            <CustomerButton
              variant="danger"
              className="w-full"
              onClick={() => void cancelOrder()}
              disabled={cancelling}
            >
              {cancelling ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}{' '}
              Siparişi İptal Et
            </CustomerButton>
          )}
        </div>
      </div>
    </CustomerPageShell>
  );
}
