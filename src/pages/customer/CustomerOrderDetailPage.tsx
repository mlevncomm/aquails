import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin,
  CreditCard, Calendar, Box, Loader2
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getOrderById, type OrderDetail } from '@/services/orderService';
import { orderStatusToTr } from '@/lib/orderStatus';

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

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    void getOrderById(id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

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
        <Link to="/hesabim/siparisler" className="text-[#1A73E8] text-sm mt-2 inline-block">Siparişlerime dön</Link>
      </div>
    );
  }

  const timeline = buildTimeline(order);
  const completedSteps = timeline.filter((t) => t.done).length;
  const progressPercent = (completedSteps / timeline.length) * 100;

  return (
    <>
      <Link to="/hesabim/siparisler" className="inline-flex items-center gap-1.5 text-sm text-[#5A6B7B] hover:text-[#1A73E8] mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h2 className="text-base sm:text-lg font-bold text-[#0D2137]">{order.orderNo}</h2>
              <StatusBadge status={order.status} />
              <span className="text-xs text-[#8B9DAF]">{orderStatusToTr(order.status)}</span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#8B9DAF]">Sipariş Durumu</span>
                <span className="font-medium text-[#1A73E8]">%{Math.round(progressPercent)}</span>
              </div>
              <div className="w-full h-2 bg-[#F0F6FF] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1A73E8] to-[#00C9A7] rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Tarih</p>
                <p className="font-medium text-[#0D2137] text-xs">{order.date}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" />Ödeme</p>
                <p className="font-medium text-[#0D2137] text-xs">{order.payment}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1">Tutar</p>
                <p className="font-bold text-[#0D2137] text-xs">{order.total.toLocaleString('tr-TR')}₺</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Truck className="w-3 h-3" />Kargo</p>
                <p className="font-medium text-[#00C9A7] text-xs">{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost}₺`}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#1A73E8]" /> Sipariş Ürünleri ({order.products.length})
            </h3>
            {order.products.map((p, i) => (
              <div key={i} className="flex items-center gap-3 py-4 border-b border-[#F0F6FF] last:border-0">
                <div className="w-14 h-14 bg-[#F0F6FF] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#1A73E8]/30" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#0D2137]">{p.name}</p>
                  <p className="text-xs text-[#8B9DAF]">{p.qty} adet</p>
                </div>
                <p className="text-sm font-bold">{(p.price * p.qty).toLocaleString('tr-TR')}₺</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A73E8]" /> Sipariş Takibi
            </h3>
            {timeline.map((t, i) => (
              <div key={i} className="flex items-start gap-4 pb-5 last:pb-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.done ? 'bg-gradient-to-br from-[#1A73E8] to-[#00C9A7]' : 'bg-[#F0F6FF] border-2 border-[#E8F0FE]'}`}>
                  {t.done ? <CheckCircle className="w-5 h-5 text-white" /> : <Clock className="w-4 h-4 text-[#8B9DAF]" />}
                </div>
                <div>
                  <p className={`text-sm font-semibold ${t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]'}`}>{t.step}</p>
                  {t.date && <p className="text-xs text-[#8B9DAF]">{t.date}</p>}
                  <p className="text-xs text-[#8B9DAF] mt-1">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1A73E8]" /> Teslimat Adresi
            </h3>
            <p className="text-xs text-[#8B9DAF]">{order.shipping.title}</p>
            <p className="text-sm text-[#5A6B7B] mt-1">{order.shipping.address}</p>
          </div>

          {(order.cargoCompany || order.trackingNumber) && (
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Kargo Bilgisi</h3>
              {order.cargoCompany && <p className="text-sm text-[#5A6B7B]">{order.cargoCompany}</p>}
              {order.trackingNumber && (
                <p className="text-sm font-medium text-[#1A73E8] mt-1">{order.trackingNumber}</p>
              )}
            </div>
          )}

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Sipariş Özeti</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Ara Toplam</span><span>{order.subtotal.toLocaleString('tr-TR')}₺</span></div>
              {order.discount > 0 && <div className="flex justify-between text-[#00C9A7]"><span>İndirim</span><span>-{order.discount.toLocaleString('tr-TR')}₺</span></div>}
              <div className="flex justify-between"><span>Kargo</span><span>{order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost}₺`}</span></div>
              {order.codFee > 0 && <div className="flex justify-between"><span>Kapıda Ödeme</span><span>+{order.codFee}₺</span></div>}
              <div className="flex justify-between font-bold pt-2 border-t"><span>Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span></div>
            </div>
          </div>

          <Link to="/urunler" className="block w-full py-3 bg-[#1A73E8] text-white rounded-xl text-sm font-semibold text-center hover:bg-[#1557B0]">
            Tekrar Sipariş Ver
          </Link>
        </div>
      </div>
    </>
  );
}
