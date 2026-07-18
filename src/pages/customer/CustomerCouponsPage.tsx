import { Tag, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useToastStore } from '@/components/Toast';
import { getActiveCouponsForCustomer, type Coupon } from '@/services/couponService';
import {
  CustomerPageShell,
  CustomerPageHeader,
  CustomerCard,
  CustomerEmpty,
  CustomerLoading,
  CustomerButton,
} from '@/components/customer/customer-ui';

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
      <CustomerPageShell>
        <CustomerLoading rows={2} />
      </CustomerPageShell>
    );
  }

  return (
    <CustomerPageShell>
      <CustomerPageHeader
        title="Kuponlarım"
        description="Aktif indirim kodlarınızı kopyalayıp ödemede kullanın."
      />

      {coupons.length === 0 ? (
        <CustomerCard padding={false}>
          <CustomerEmpty
            icon={Tag}
            title="Aktif kuponunuz yok"
            message="Kampanyaları takip ederek kupon kazanabilirsiniz."
            action={
              <Link to="/kampanyalar">
                <CustomerButton>Kampanyalar</CustomerButton>
              </Link>
            }
          />
        </CustomerCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c) => (
            <CustomerCard key={c.code} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-aq-sky/50 rounded-bl-full" />
              <p className="text-lg font-semibold text-aq-text mb-1 relative">{formatDiscount(c)}</p>
              <p className="text-xs text-aq-muted mb-3 relative">Min. sipariş: {formatMin(c)}</p>
              <button
                type="button"
                onClick={() => copyCode(c.code)}
                className="relative flex items-center gap-2 bg-aq-ice text-aq-blue px-4 py-2 rounded-xl text-sm font-semibold hover:bg-aq-sky transition-all"
              >
                {copied === c.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {c.code}
              </button>
            </CustomerCard>
          ))}
        </div>
      )}
    </CustomerPageShell>
  );
}
