import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin,
  CreditCard, Calendar, Download, Receipt, Phone, Box
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getOrderById, type ApiOrder } from '@/services/orderService';

const paymentLabels: Record<string, string> = {
  card: 'Kredi Kartı',
  transfer: 'Havale / EFT',
  cod: 'Kapıda Ödeme',
};

function formatOrderDateTime(iso: string) {
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function buildTimeline(status: string, createdAt: string) {
  const date = new Date(createdAt).toLocaleString('tr-TR', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
  const steps = [
    { step: 'Sipariş Alındı', key: 'pending', desc: 'Siparişiniz başarıyla alındı.' },
    { step: 'Hazırlanıyor', key: 'processing', desc: 'Ürünleriniz depoda hazırlanıyor.' },
    { step: 'Kargoya Verildi', key: 'shipped', desc: 'Kargonuz yola çıktı.' },
    { step: 'Teslim Edildi', key: 'delivered', desc: 'Teslimat tamamlandı.' },
  ];
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIdx = status === 'cancelled' ? -1 : statusOrder.indexOf(status);

  return steps.map((s, i) => ({
    step: s.step,
    date: i === 0 ? date : '',
    done: currentIdx >= i,
    desc: s.desc,
  }));
}

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getOrderById(id);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <p className="text-sm text-[#8B9DAF] py-8 text-center">Sipariş yükleniyor...</p>;
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#5A6B7B] mb-4">Sipariş bulunamadı.</p>
        <Link to="/hesabim/siparisler" className="text-sm text-[#1A73E8] hover:underline">Siparişlerime Dön</Link>
      </div>
    );
  }

  const timeline = buildTimeline(order.status, order.createdAt);
  const completedSteps = timeline.filter(t => t.done).length;
  const progressPercent = (completedSteps / timeline.length) * 100;
  const addr = order.shippingAddress;
  const subtotal = order.subtotal ?? order.items.reduce((sum, i) => sum + i.total, 0);

  return (
    <>
      <Link to="/hesabim/siparisler" className="inline-flex items-center gap-1.5 text-sm text-[#5A6B7B] hover:text-[#1A73E8] mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <Receipt className="w-5 h-5 text-[#1A73E8]" />
                <h2 className="text-base sm:text-lg font-bold text-[#0D2137]">{order.orderNumber}</h2>
                <StatusBadge status={order.status} />
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium text-[#5A6B7B] hover:text-[#1A73E8] border border-[#E8F0FE] hover:border-[#1A73E8] px-3 py-1.5 rounded-lg transition-all w-fit">
                <Download className="w-3.5 h-3.5" /> Fatura İndir
              </button>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-[#8B9DAF]">Sipariş Durumu</span>
                <span className="font-medium text-[#1A73E8]">%{Math.round(progressPercent)}</span>
              </div>
              <div className="w-full h-2 bg-[#F0F6FF] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1A73E8] to-[#00C9A7] rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-sm">
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" />Tarih</p>
                <p className="font-medium text-[#0D2137] text-xs sm:text-sm">{formatOrderDateTime(order.createdAt)}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" />Ödeme</p>
                <p className="font-medium text-[#0D2137] text-xs sm:text-sm">{paymentLabels[order.paymentMethod] ?? order.paymentMethod}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Receipt className="w-3 h-3" />Tutar</p>
                <p className="font-bold text-[#0D2137] text-xs sm:text-sm">{order.total.toLocaleString('tr-TR')}₺</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Truck className="w-3 h-3" />Kargo</p>
                <p className="font-medium text-[#00C9A7] text-xs sm:text-sm">
                  {order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost.toLocaleString('tr-TR')}₺`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#1A73E8]" /> Sipariş Ürünleri ({order.items.length})
            </h3>
            {order.items.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-[#F0F6FF] last:border-0">
                <div className="w-16 h-16 sm:w-14 sm:h-14 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-7 h-7 sm:w-6 sm:h-6 text-[#1A73E8]/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0D2137]">{p.productName}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-md">SKU: {p.productId}</span>
                    <span className="text-xs text-[#8B9DAF]">{p.quantity} adet</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#0D2137]">{p.total.toLocaleString('tr-TR')}₺</p>
                  <p className="text-xs text-[#8B9DAF]">{p.unitPrice.toLocaleString('tr-TR')}₺ / adet</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A73E8]" /> Sipariş Takibi
            </h3>
            <div className="relative pl-2 sm:pl-4">
              <div className="absolute left-[19px] sm:left-[23px] top-3 bottom-3 w-0.5 bg-[#E8F0FE]" />
              {timeline.map((t, i) => (
                <div key={i} className="relative flex items-start gap-3 sm:gap-4 pb-5 sm:pb-6 last:pb-0">
                  <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    t.done
                      ? 'bg-gradient-to-br from-[#1A73E8] to-[#00C9A7] shadow-md shadow-[#1A73E8]/20'
                      : 'bg-[#F0F6FF] border-2 border-[#E8F0FE]'
                  }`}>
                    {t.done
                      ? <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      : <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B9DAF]" />
                    }
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
                      <p className={`text-sm font-semibold ${t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]'}`}>
                        {t.step}
                      </p>
                      {t.date && (
                        <span className="text-[11px] text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-full w-fit">
                          {t.date}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8B9DAF] mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <div className="bg-gradient-to-br from-[#F8FBFF] to-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1A73E8]" /> Teslimat Adresi
            </h3>
            <div className="bg-white rounded-xl p-3 border border-[#F0F6FF]">
              <p className="text-xs text-[#8B9DAF] mb-1">{addr.title ?? 'Teslimat'}</p>
              <p className="text-sm text-[#5A6B7B] leading-relaxed">
                {addr.fullAddress}{addr.district ? `, ${addr.district}` : ''}{addr.city ? `/${addr.city}` : ''}
              </p>
              <p className="text-xs text-[#8B9DAF] mt-2 flex items-center gap-1">
                <Phone className="w-3 h-3" />{order.customer.phone}
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Sipariş Özeti</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Ara Toplam</span><span>{subtotal.toLocaleString('tr-TR')}₺</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[#5A6B7B]">
                  <span>İndirim</span><span className="text-[#00C9A7] font-medium">-{order.discount.toLocaleString('tr-TR')}₺</span>
                </div>
              )}
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Kargo</span>
                <span className="text-[#00C9A7] font-medium">
                  {order.shippingCost === 0 ? 'Ücretsiz' : `${order.shippingCost.toLocaleString('tr-TR')}₺`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#0D2137] pt-3 border-t border-[#F0F6FF] text-base">
                <span>Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <button className="w-full py-3 bg-[#1A73E8] text-white rounded-xl text-sm font-semibold hover:bg-[#1557B0] hover:shadow-lg hover:shadow-[#1A73E8]/20 transition-all active:scale-[0.98]">
              Tekrar Sipariş Ver
            </button>
            <button className="w-full py-3 border border-[#E8F0FE] bg-white text-[#5A6B7B] rounded-xl text-sm font-medium hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">
              İade / Değişim Talebi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
