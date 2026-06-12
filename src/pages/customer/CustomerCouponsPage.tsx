import { EmptyState } from '@/components/EmptyState';
import { Tag, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToastStore } from '@/components/Toast';

const coupons = [
  { code: 'AQUAILS10', discount: '%10 İndirim', min: '1.000₺', expiry: '31 Aralık 2026', active: true },
  { code: 'FILTRE250', discount: '250₺ İndirim', min: '2.000₺', expiry: '30 Eylül 2026', active: true },
  { code: 'KARGO', discount: 'Ücretsiz Kargo', min: 'Yok', expiry: 'Süresiz', active: true },
  { code: 'YENI500', discount: '500₺ Hoş Geldin', min: '5.000₺', expiry: '30 Haziran 2026', active: false },
];

export default function CustomerCouponsPage() {
  const [copied, setCopied] = useState('');
  const addToast = useToastStore(s => s.add);

  const copyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    addToast(`${code} kopyalandı!`, 'success');
    setTimeout(() => setCopied(''), 2000);
  };

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Kuponlarım</h2>

      {coupons.filter(c => c.active).length === 0 ? (
        <EmptyState icon={<Tag className="w-8 h-8" />} title="Aktif Kuponunuz Yok" description="Kampanyaları takip ederek kupon kazanabilirsiniz." action={{ label: 'Kampanyalar', href: '/kampanyalar' }} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.filter(c => c.active).map(c => (
            <div key={c.code} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#F0F6FF] rounded-bl-full" />
              <p className="text-lg font-bold text-[#0D2137] mb-1">{c.discount}</p>
              <p className="text-xs text-[#8B9DAF] mb-3">Min. {c.min} | {c.expiry}</p>
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
