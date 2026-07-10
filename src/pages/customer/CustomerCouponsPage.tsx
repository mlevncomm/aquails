import { EmptyState } from '@/components/EmptyState';
import { Tag, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToastStore } from '@/components/Toast';
import { getActiveCouponsForCustomer, type Coupon } from '@/services/couponService';

function formatDiscount(c: Coupon): string {
  if (c.type === 'percent') return `%${c.value} İndirim`;
  if (c.type === 'shipping') return 'Ücretsiz Kargo';
  return `${c.value.toLocaleString('tr-TR')}₺ İndirim`;
}

function formatMin(c: Coupon): string {
  return c.minOrder && c.minOrder > 0 ? `${c.minOrder.toLocaleString('tr-TR')}₺` : 'Yok';
}

export default function CustomerCouponsPage() {
  const [copied, setCopied] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  useEffect(() => {
    void getActiveCouponsForCustomer().then((data) => {
      setCoupons(data);
      setLoading(false);
    });
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    addToast(`${code} kopyalandı!`, 'success');
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-[#8B9DAF]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Yükleniyor...
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Kuponlarım</h2>

      {coupons.length === 0 ? (
        <EmptyState icon={<Tag className="w-8 h-8" />} title="Aktif Kuponunuz Yok" description="Kampanyaları takip ederek kupon kazanabilirsiniz." action={{ label: 'Kampanyalar', href: '/kampanyalar' }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <div key={c.code} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#F0F6FF] rounded-bl-full" />
              <p className="text-lg font-bold text-[#0D2137] mb-1">{formatDiscount(c)}</p>
              <p className="text-xs text-[#8B9DAF] mb-3">Min. sipariş: {formatMin(c)}</p>
              <button
                onClick={() => copyCode(c.code)}
                className="flex items-center gap-2 bg-[#F0F6FF] text-[#1A73E8] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#E8F0FE] transition-all"
              >
                {copied === c.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {c.code}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
