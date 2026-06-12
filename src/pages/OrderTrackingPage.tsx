import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';


const mockOrder = {
  orderNo: 'AQ-2026-1847',
  status: 'shipped',
  statusLabel: 'Kargoda',
  carrier: 'Yurtiçi Kargo',
  trackingNo: 'YT1234567890',
  items: [
    { name: 'Aquails PurePro 7 Aşamalı Su Arıtma Cihazı', qty: 1, price: 12900 },
    { name: 'Mineral Plus Filtre Seti', qty: 1, price: 1490 },
  ],
  address: 'Pendik, İstanbul',
  timeline: [
    { status: 'Sipariş Alındı', date: '10 Haziran 2026, 09:30', done: true },
    { status: 'Sipariş Hazırlanıyor', date: '10 Haziran 2026, 11:00', done: true },
    { status: 'Kargoya Verildi', date: '10 Haziran 2026, 15:30', done: true },
    { status: 'Teslimatta', date: 'Tahmini: 12 Haziran 2026', done: false },
    { status: 'Teslim Edildi', date: '', done: false },
  ],
};

export default function OrderTrackingPage() {
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(true);
  };

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

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-white border border-[#E8F0FE] rounded-2xl p-6 mb-8">
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
          <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1A73E8] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">
            <Search className="w-4 h-4" /> Sorgula
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="space-y-5">
            {/* Status Card */}
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F0F6FF] rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#1A73E8]" />
                </div>
                <div>
                  <p className="text-sm text-[#8B9DAF]">Sipariş No</p>
                  <p className="text-lg font-bold text-[#0D2137]">{mockOrder.orderNo}</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                  <Truck className="w-3 h-3" /> {mockOrder.statusLabel}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#5A6B7B]">
                <span className="flex items-center gap-1.5"><Truck className="w-4 h-4 text-[#8B9DAF]" />{mockOrder.carrier}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#8B9DAF]" />{mockOrder.address}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-[#0D2137] mb-5">Sipariş Durumu</h3>
              <div className="space-y-0">
                {mockOrder.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.done ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-100 text-gray-400'}`}>
                        {t.done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      {i < mockOrder.timeline.length - 1 && <div className={`w-0.5 h-10 ${t.done ? 'bg-emerald-200' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${t.done ? 'text-[#0D2137]' : 'text-[#8B9DAF]'}`}>{t.status}</p>
                      {t.date && <p className="text-xs text-[#8B9DAF]">{t.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
              <h3 className="text-base font-semibold text-[#0D2137] mb-4">Sipariş Özeti</h3>
              {mockOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between py-3 border-b border-[#F0F6FF] last:border-0">
                  <span className="text-sm text-[#5A6B7B]">{item.qty}x {item.name}</span>
                  <span className="text-sm font-semibold text-[#0D2137]">{item.price.toLocaleString('tr-TR')}₺</span>
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
