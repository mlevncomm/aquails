import { useState, useEffect } from 'react';
import { AlertTriangle, Minus, Plus } from 'lucide-react';
import { adminGetProducts } from '@/services/productService';
import type { Product } from '@/types';

const CRITICAL_THRESHOLD = 10;

export default function AdminStockPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    adminGetProducts({ lowStock: true, limit: 100 })
      .then((result) => { if (!cancelled) setItems(result.items); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Stok verileri yüklenemedi.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  const criticalCount = items.filter(i => i.stock <= CRITICAL_THRESHOLD).length;

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Stok Yönetimi</h2>

      {criticalCount > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{criticalCount} ürün kritik stok seviyesinin altında!</p>
        </div>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Ürün', 'Slug', 'Mevcut Stok', 'Kritik Limit', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className={`border-b border-[#F0F6FF] last:border-0 ${i.stock <= CRITICAL_THRESHOLD ? 'bg-red-50/50' : 'hover:bg-[#F8FBFF]/50'}`}>
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{i.name}</td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF] font-mono">{i.slug}</td>
                  <td className="px-4 py-3"><span className={`text-sm font-bold ${i.stock <= CRITICAL_THRESHOLD ? 'text-red-600' : 'text-[#0D2137]'}`}>{i.stock}</span></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{CRITICAL_THRESHOLD}</td>
                  <td className="px-4 py-3">
                    {i.stock <= CRITICAL_THRESHOLD ? <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Kritik</span> : i.stock <= CRITICAL_THRESHOLD + 5 ? <span className="text-xs font-medium bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Düşük</span> : <span className="text-xs font-medium bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Normal</span>}
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1 opacity-50"><button disabled className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F0F6FF] text-[#5A6B7B]"><Minus className="w-3 h-3" /></button><span className="w-8 text-center text-sm font-semibold">{i.stock}</span><button disabled className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F0F6FF] text-[#5A6B7B]"><Plus className="w-3 h-3" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Düşük stoklu ürün yok</div>}
      </div>
      </>
  );
}
