import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';
import { trackOrderByNumberAndEmail, type OrderTrackingResult } from '@/services/orderService';
import { useToastStore } from '@/components/Toast';

export default function OrderTrackingPage() {
  const addToast = useToastStore((s) => s.add);
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OrderTrackingResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNo.trim() || !email.trim()) {
      addToast('Sipariş numarası ve e-posta/telefon girin.', 'error');
      return;
    }
    setLoading(true);
    const res = await trackOrderByNumberAndEmail(orderNo.trim(), email.trim());
    setLoading(false);
    if (!res.success || !res.order) {
      addToast(res.error ?? 'Sipariş bulunamadı.', 'error');
      setResult(null);
      return;
    }
    setResult(res.order);
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
            <h1 className="text-2xl font-bold text-aq-text mb-2">Sipariş Takip</h1>
            <p className="text-sm text-aq-muted">Sipariş numaranızı ve kayıtlı e-posta/telefonunuzu girin.</p>
          </div>

          <form onSubmit={handleSearch} className="bg-white border border-aq-border/60 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Sipariş Numarası</label>
                <input
                  value={orderNo}
                  onChange={(e) => setOrderNo(e.target.value)}
                  placeholder="AQ-2026-XXXX"
                  className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">E-posta veya Telefon</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-aq-blue text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Sorgula
            </button>
          </form>

          {result && (
            <div className="space-y-5">
              <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-aq-sky rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-aq-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-aq-muted">Sipariş No</p>
                    <p className="text-lg font-semibold text-aq-text">{result.orderNo}</p>
                  </div>
                  <span className="ml-auto inline-flex items-center gap-1.5 bg-aq-sky text-aq-blue text-xs font-medium px-3 py-1 rounded-full">
                    <Truck className="w-3 h-3" /> {result.statusLabel}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-aq-muted">
                  {result.carrier !== '—' && (
                    <span className="flex items-center gap-1.5"><Truck className="w-4 h-4" />{result.carrier}</span>
                  )}
                  {result.trackingNo !== '—' && (
                    <span className="font-medium text-aq-blue">{result.trackingNo}</span>
                  )}
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{result.address}</span>
                </div>
              </div>

              <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-aq-text mb-5">Sipariş Durumu</h3>
                {result.timeline.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${t.done ? 'bg-aq-sky text-aq-aqua' : 'bg-gray-100 text-gray-400'}`}>
                        {t.done ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      {i < result.timeline.length - 1 && <div className={`w-0.5 h-10 ${t.done ? 'bg-aq-aqua/30' : 'bg-gray-200'}`} />}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${t.done ? 'text-aq-text' : 'text-aq-muted'}`}>{t.status}</p>
                      {t.date && <p className="text-xs text-aq-muted">{t.date}</p>}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
                <h3 className="text-base font-semibold text-aq-text mb-4">Sipariş Özeti</h3>
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-aq-border/60 last:border-0">
                    <span className="text-sm text-aq-muted">{item.qty}x {item.name}</span>
                    <span className="text-sm font-semibold">{(item.price * item.qty).toLocaleString('tr-TR')}₺</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-sm text-aq-muted">
                <Link to="/giris" className="text-aq-blue hover:underline">Giriş yaparak</Link> tüm siparişlerinizi görüntüleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      </PageLayout>
    </>
  );
}
