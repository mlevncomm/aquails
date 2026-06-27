import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';
import { getOrderByNumber, mapApiOrderToOrder } from '@/services/orderService';
import type { Order } from '@/types';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Sipariş Alındı',
  processing: 'Hazırlanıyor',
  shipped: 'Kargoda',
  delivered: 'Teslim Edildi',
  cancelled: 'İptal Edildi',
};

function buildTimeline(order: Order) {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentIndex = steps.indexOf(order.status);
  return steps.map((status, index) => ({
    status: STATUS_LABELS[status] ?? status,
    date: index <= currentIndex ? new Date(order.createdAt).toLocaleString('tr-TR') : '',
    done: index <= currentIndex,
  }));
}

export default function OrderTrackingPage() {
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const result = await getOrderByNumber(orderNo.trim());
      if (!result) {
        setError('Sipariş bulunamadı.');
        return;
      }
      if (email.trim() && result.customer.email !== email.trim() && result.customer.phone !== email.trim()) {
        setError('E-posta veya telefon eşleşmiyor.');
        return;
      }
      setOrder(mapApiOrderToOrder(result));
    } catch {
      setError('Sipariş sorgulanamadı.');
    } finally {
      setLoading(false);
    }
  };

  const timeline = order ? buildTimeline(order) : [];

  return (
    <>
      <SEO
        title="Sipariş Takip | Aquails"
        description="Aquails siparişinizi takip edin. Kargo durumu, teslimat bilgileri ve sipariş geçmişi."
        canonical="/siparis-takip"
      />
    <PageLayout>
      <div className="max-w-[700px] mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[13px] text-[#8B9DAF] mb-2">
            <Link to="/" className="hover:text-[#1A73E8]">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-[#5A6B7B]">Sipariş Takip</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0D2137] mb-2">Sipariş Takip</h1>
          <p className="text-sm text-[#8B9DAF]">Sipariş numaranızı girerek durumunu öğrenin.</p>
        </div>

        <form onSubmit={(e) => void handleSearch(e)} className="bg-white border border-[#E8F0FE] rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Sipariş Numarası</label>
              <input value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="AQ-2026-XXXX" className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">E-posta veya Telefon</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ornek@email.com" className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
            </div>
          </div>
          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}
          <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1A73E8] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-60">
            <Search className="w-4 h-4" /> {loading ? 'Sorgulanıyor...' : 'Sorgula'}
          </button>
        </form>

        {order && (
          <div className="space-y-5">
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F0F6FF] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#1A73E8]" />
                </div>
                <div>
                  <p className="text-sm text-[#8B9DAF]">Sipariş No</p>
                  <p className="text-lg font-bold text-[#0D2137]">{order.orderNumber}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  <Truck className="w-3 h-3" /> {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#5A6B7B]">
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#8B9DAF]" />{order.shippingAddress.city}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-[#0D2137] mb-5">Sipariş Durumu</h3>
              <div className="space-y-0">
                {timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.done ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                        {t.done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      {i < timeline.length - 1 && <div className={`w-0.5 h-10 ${t.done ? 'bg-emerald-200' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]'}`}>{t.status}</p>
                      {t.date && <p className="text-xs text-[#8B9DAF]">{t.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-[#0D2137] mb-4">Sipariş Özeti</h3>
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#F0F6FF] last:border-0">
                  <span className="text-sm text-[#5A6B7B]">{item.quantity}x {item.product.name}</span>
                  <span className="text-sm font-semibold text-[#0D2137]">{(item.unitPrice * item.quantity).toLocaleString('tr-TR')}₺</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
    </>
  );
}
