import { useParams, Link } from 'react-router';
import {
  ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin,
  CreditCard, Calendar, Download, Receipt, Phone, Box
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';

const orderData: Record<string, {
  orderNo: string; date: string; status: string; total: number; shipping: number; discount: number;
  payment: string; paymentMethod: string; cargoCompany: string; trackingNo: string;
  products: { name: string; qty: number; price: number; sku: string }[];
  address: { title: string; full: string; phone: string };
  timeline: { step: string; date: string; done: boolean; desc: string }[];
}> = {
  '1': {
    orderNo: 'AQ-2025-1847', date: '10 Haziran 2025, 14:30', status: 'shipped', total: 12900, shipping: 0, discount: 2000,
    payment: 'Kredi Kartı', paymentMethod: '3 Taksit', cargoCompany: 'Yurtiçi Kargo', trackingNo: 'YT1234567890',
    products: [
      { name: 'Aquails PurePro 7 Aşamalı Su Arıtma Cihazı', qty: 1, price: 12900, sku: 'AQ-PP7-001' },
      { name: 'Mineral Plus Filtre Seti (4\'lü)', qty: 2, price: 1490, sku: 'AQ-FLT-004' },
    ],
    address: { title: 'Ev', full: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12, Pendik/İstanbul', phone: '0532 123 45 67' },
    timeline: [
      { step: 'Sipariş Alındı', date: '10 Haz 14:30', done: true, desc: 'Siparişiniz başarıyla alındı.' },
      { step: 'Ödeme Onaylandı', date: '10 Haz 14:32', done: true, desc: 'Kredi kartı ödemeniz onaylandı.' },
      { step: 'Hazırlanıyor', date: '10 Haz 16:00', done: true, desc: 'Ürünleriniz depoda hazırlanıyor.' },
      { step: 'Kargoya Verildi', date: '11 Haz 09:15', done: true, desc: `Kargonuz ${'Yurtiçi Kargo'} ile teslim edildi.` },
      { step: 'Teslimatta', date: 'Tahmini: 12 Haz', done: false, desc: 'Kargonuz size ulaştırılmak üzere yola çıktı.' },
      { step: 'Teslim Edildi', date: '', done: false, desc: 'Teslimat tamamlandığında burada görünecek.' },
    ],
  },
};

export default function CustomerOrderDetailPage() {
  const { id } = useParams();
  const order = orderData[id || '1'] || orderData['1'];
  const completedSteps = order.timeline.filter(t => t.done).length;
  const progressPercent = (completedSteps / order.timeline.length) * 100;

  return (
    <>
      {/* Back Link */}
      <Link to="/hesabim/siparisler" className="inline-flex items-center gap-1.5 text-sm text-[#5A6B7B] hover:text-[#1A73E8] mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Siparişlerime Dön
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">

          {/* Header Card */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-3">
                <Receipt className="w-5 h-5 text-[#1A73E8]" />
                <h2 className="text-base sm:text-lg font-bold text-[#0D2137]">{order.orderNo}</h2>
                <StatusBadge status={order.status} />
              </div>
              <button className="flex items-center gap-1.5 text-xs font-medium text-[#5A6B7B] hover:text-[#1A73E8] border border-[#E8F0FE] hover:border-[#1A73E8] px-3 py-1.5 rounded-lg transition-all w-fit">
                <Download className="w-3.5 h-3.5" /> Fatura İndir
              </button>
            </div>

            {/* Progress Bar */}
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
                <p className="font-medium text-[#0D2137] text-xs sm:text-sm">{order.date}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" />Ödeme</p>
                <p className="font-medium text-[#0D2137] text-xs sm:text-sm">{order.payment}</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Receipt className="w-3 h-3" />Tutar</p>
                <p className="font-bold text-[#0D2137] text-xs sm:text-sm">{order.total.toLocaleString('tr-TR')}₺</p>
              </div>
              <div className="bg-[#F8FBFF] rounded-xl p-3">
                <p className="text-[#8B9DAF] text-[11px] mb-1 flex items-center gap-1"><Truck className="w-3 h-3" />Kargo</p>
                <p className="font-medium text-[#00C9A7] text-xs sm:text-sm">Ücretsiz</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <Box className="w-4 h-4 text-[#1A73E8]" /> Sipariş Ürünleri ({order.products.length})
            </h3>
            {order.products.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-[#F0F6FF] last:border-0">
                <div className="w-16 h-16 sm:w-14 sm:h-14 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-7 h-7 sm:w-6 sm:h-6 text-[#1A73E8]/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0D2137]">{p.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-md">SKU: {p.sku}</span>
                    <span className="text-xs text-[#8B9DAF]">{p.qty} adet</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#0D2137]">{(p.price * p.qty).toLocaleString('tr-TR')}₺</p>
                  <p className="text-xs text-[#8B9DAF]">{p.price.toLocaleString('tr-TR')}₺ / adet</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A73E8]" /> Sipariş Takibi
            </h3>
            <div className="relative pl-2 sm:pl-4">
              {/* Vertical line */}
              <div className="absolute left-[19px] sm:left-[23px] top-3 bottom-3 w-0.5 bg-[#E8F0FE]" />

              {order.timeline.map((t, i) => (
                <div key={i} className="relative flex items-start gap-3 sm:gap-4 pb-5 sm:pb-6 last:pb-0">
                  {/* Status dot */}
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

                  {/* Content */}
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

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-5">
          {/* Address */}
          <div className="bg-gradient-to-br from-[#F8FBFF] to-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1A73E8]" /> Teslimat Adresi
            </h3>
            <div className="bg-white rounded-xl p-3 border border-[#F0F6FF]">
              <p className="text-xs text-[#8B9DAF] mb-1">{order.address.title}</p>
              <p className="text-sm text-[#5A6B7B] leading-relaxed">{order.address.full}</p>
              <p className="text-xs text-[#8B9DAF] mt-2 flex items-center gap-1"><Phone className="w-3 h-3" />{order.address.phone}</p>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A73E8]" /> Kargo Bilgisi
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-[#8B9DAF]">Kargo Firması</span><span className="font-medium text-[#0D2137]">{order.cargoCompany}</span></div>
              <div className="flex justify-between"><span className="text-[#8B9DAF]">Takip No</span>
                <span className="font-medium text-[#1A73E8] bg-[#F0F6FF] px-2 py-0.5 rounded-md text-xs">{order.trackingNo}</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Sipariş Özeti</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Ara Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span>
              </div>
              <div className="flex justify-between text-[#5A6B7B]">
                <span>İndirim</span><span className="text-[#00C9A7] font-medium">-{order.discount.toLocaleString('tr-TR')}₺</span>
              </div>
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Kargo</span><span className="text-[#00C9A7] font-medium">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-[#0D2137] pt-3 border-t border-[#F0F6FF] text-base">
                <span>Toplam</span><span>{(order.total - order.discount).toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </div>

          {/* Actions */}
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
