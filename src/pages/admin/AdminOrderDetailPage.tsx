import { Link } from 'react-router';
import {
  ArrowLeft, Package, MapPin, CreditCard, Printer, ChevronDown,
  CheckCircle, Clock, Truck, User, Phone, Mail, Receipt, Tag,
  Percent, Calendar
} from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const order = {
  orderNo: 'AQ-2025-1847', date: '10 Haziran 2025, 14:30', status: 'shipped',
  customer: { name: 'Ahmet Yılmaz', email: 'ahmet@email.com', phone: '0532 123 45 67' },
  products: [
    { name: 'Aquails PurePro 7 Aşamalı Su Arıtma Cihazı', qty: 1, price: 12900, sku: 'AQ-PP7-001', category: 'Ev Tipi' },
    { name: 'Mineral Plus Filtre Seti (4\'lü)', qty: 2, price: 1490, sku: 'AQ-FLT-004', category: 'Filtre Seti' },
  ],
  shipping: { title: 'Ev', address: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12, Pendik/İstanbul, 34912' },
  billing: { title: 'Ev', address: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12, Pendik/İstanbul, 34912' },
  payment: 'Kredi Kartı - 3 Taksit', subtotal: 15880, shippingCost: 0, discount: 2000, total: 13880,
  cargo: { company: 'Yurtiçi Kargo', trackingNo: 'YT1234567890' },
  note: 'Kapı zili çalışmıyor, lütfen arayın.', timeline: [
    { step: 'Sipariş Alındı', date: '10 Haz 14:30', done: true, icon: Receipt, desc: 'Sipariş sisteme kaydedildi.' },
    { step: 'Ödeme Onaylandı', date: '10 Haz 14:32', done: true, icon: CreditCard, desc: 'Kredi kartı ödemesi onaylandı.' },
    { step: 'Hazırlanıyor', date: '10 Haz 16:00', done: true, icon: Package, desc: 'Ürünler depoda hazırlanıyor.' },
    { step: 'Kargoya Verildi', date: '11 Haz 09:15', done: true, icon: Truck, desc: `Kargonuz ${'Yurtiçi Kargo'} ile teslim edildi.` },
    { step: 'Teslim Edildi', date: 'Tahmini: 12 Haz', done: false, icon: CheckCircle, desc: 'Teslimat bekleniyor.' },
  ],
};

const statusOptions = ['Yeni', 'Hazırlanıyor', 'Kargoda', 'Tamamlandı', 'İptal Edildi'];
const statusKeyMap: Record<string, string> = { 'Yeni': 'pending', 'Hazırlanıyor': 'processing', 'Kargoda': 'shipped', 'Tamamlandı': 'delivered', 'İptal Edildi': 'cancelled' };

export default function AdminOrderDetailPage() {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const doneSteps = order.timeline.filter(t => t.done).length;
  const progress = (doneSteps / order.timeline.length) * 100;

  return (
    <>
      <Link to="/admin/siparisler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-[#1A73E8] mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Siparişlere Dön
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 bg-[#F0F6FF] rounded-xl flex items-center justify-center">
            <Receipt className="w-5 h-5 text-[#1A73E8]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#0D2137]">{order.orderNo}</h2>
            <p className="text-xs text-[#8B9DAF] flex items-center gap-1"><Calendar className="w-3 h-3" />{order.date}</p>
          </div>
          <StatusBadge status={currentStatus} />
        </div>
        <div className="flex gap-2">
          {/* Modern Status Select */}
          <div className="relative">
            <select
              value={currentStatus}
              onChange={e => setCurrentStatus(statusKeyMap[e.target.value] || e.target.value)}
              className="appearance-none cursor-pointer pl-4 pr-10 py-2.5 text-sm font-medium bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 shadow-sm min-w-[160px]"
            >
              {statusOptions.map(s => <option key={s} value={statusKeyMap[s]}>{s}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 text-[#8B9DAF] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="flex items-center gap-2 bg-white border border-[#D6E3F0] text-[#5A6B7B] px-4 py-2.5 rounded-xl text-sm font-medium hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Yazdır
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-[#0D2137]">Sipariş Durumu</span>
          <span className="text-sm font-bold text-[#1A73E8]">%{Math.round(progress)}</span>
        </div>
        <div className="w-full h-2.5 bg-[#F0F6FF] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#1A73E8] to-[#00C9A7] rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between mt-3">
          {order.timeline.map((t, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', t.done ? 'bg-[#1A73E8]' : 'bg-[#F0F6FF]')}>
                {t.done ? <CheckCircle className="w-3.5 h-3.5 text-white" /> : <Clock className="w-3.5 h-3.5 text-[#8B9DAF]" />}
              </div>
              <span className={cn('text-[10px] font-medium hidden sm:block', t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]')}>{t.step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-5">

          {/* Products */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-[#1A73E8]" /> Sipariş Ürünleri ({order.products.length})
            </h3>
            {order.products.map((p, i) => (
              <div key={i} className="flex items-center gap-4 py-4 border-b border-[#F0F6FF] last:border-0">
                <div className="w-14 h-14 bg-[#F0F6FF] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-[#1A73E8]/30" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0D2137]">{p.name}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[11px] text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-md">SKU: {p.sku}</span>
                    <span className="text-[11px] text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-md">{p.category}</span>
                    <span className="text-[11px] text-[#8B9DAF]">{p.qty} adet</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-[#0D2137]">{(p.price * p.qty).toLocaleString('tr-TR')}₺</p>
                  <p className="text-xs text-[#8B9DAF]">{p.price.toLocaleString('tr-TR')}₺ / adet</p>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Timeline */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-5 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1A73E8]" /> Sipariş Takibi
            </h3>
            <div className="relative pl-2">
              {/* Vertical line */}
              <div className="absolute left-[23px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#1A73E8] via-[#1A73E8]/30 to-[#E8F0FE]" />

              {order.timeline.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    {/* Status icon */}
                    <div className={cn(
                      'relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
                      t.done
                        ? 'bg-gradient-to-br from-[#1A73E8] to-[#4285F4] shadow-md shadow-[#1A73E8]/20'
                        : 'bg-[#F0F6FF] border-2 border-[#E8F0FE]'
                    )}>
                      <Icon className={cn('w-5 h-5', t.done ? 'text-white' : 'text-[#8B9DAF]')} />
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3 mb-1">
                        <p className={cn('text-sm font-semibold', t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]')}>
                          {t.step}
                        </p>
                        {t.date && (
                          <span className="text-[11px] text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-full w-fit flex items-center gap-1">
                            <Clock className="w-3 h-3" />{t.date}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8B9DAF] leading-relaxed">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {order.note && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
              <Tag className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700"><strong>Sipariş Notu:</strong> {order.note}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#1A73E8]" /> Müşteri
            </h3>
            <div className="bg-[#F8FBFF] rounded-xl p-4">
              <p className="text-sm font-semibold text-[#0D2137]">{order.customer.name}</p>
              <p className="text-xs text-[#8B9DAF] mt-1 flex items-center gap-1"><Mail className="w-3 h-3" />{order.customer.email}</p>
              <p className="text-xs text-[#8B9DAF] flex items-center gap-1"><Phone className="w-3 h-3" />{order.customer.phone}</p>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#1A73E8]" /> Teslimat
            </h3>
            <div className="bg-[#F8FBFF] rounded-xl p-4 mb-3">
              <p className="text-xs text-[#8B9DAF] mb-1">{order.shipping.title}</p>
              <p className="text-sm text-[#5A6B7B] leading-relaxed">{order.shipping.address}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Truck className="w-3.5 h-3.5 text-[#8B9DAF]" />
              <span className="text-[#5A6B7B]">{order.cargo.company}</span>
              <span className="text-[#1A73E8] bg-[#F0F6FF] px-2 py-0.5 rounded-md font-medium">{order.cargo.trackingNo}</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#1A73E8]" /> Ödeme
            </h3>
            <p className="text-sm text-[#5A6B7B] mb-3">{order.payment}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Ara Toplam</span><span>{order.subtotal.toLocaleString('tr-TR')}₺</span>
              </div>
              <div className="flex justify-between text-[#5A6B7B]">
                <span className="flex items-center gap-1"><Percent className="w-3 h-3" />İndirim</span>
                <span className="text-emerald-600 font-medium">-{order.discount.toLocaleString('tr-TR')}₺</span>
              </div>
              <div className="flex justify-between text-[#5A6B7B]">
                <span>Kargo</span><span className="text-emerald-600 font-medium">Ücretsiz</span>
              </div>
              <div className="flex justify-between font-bold text-[#0D2137] pt-2 border-t border-[#F0F6FF] text-base">
                <span>Toplam</span><span>{order.total.toLocaleString('tr-TR')}₺</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
