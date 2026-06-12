import { useState } from 'react';
import { AlertTriangle, Minus, Plus } from 'lucide-react';

const initialStock = [
  { id: '1', name: 'Aquails PurePro Filtre Kartuşu', sku: 'AQ-FIL-001', stock: 3, critical: 5 },
  { id: '2', name: 'Mineral Plus Karbon Filtre', sku: 'AQ-FIL-002', stock: 5, critical: 5 },
  { id: '3', name: 'Sediment Filtre 5 Mikron', sku: 'AQ-FIL-003', stock: 4, critical: 10 },
  { id: '4', name: 'RO Membran Filtre 100GPD', sku: 'AQ-FIL-004', stock: 2, critical: 3 },
  { id: '5', name: 'Aquails PurePro 7 Aşamalı', sku: 'AQ-CIH-001', stock: 24, critical: 5 },
  { id: '6', name: 'Aquails Compact', sku: 'AQ-CIH-002', stock: 18, critical: 5 },
  { id: '7', name: 'Aquails Business Pro', sku: 'AQ-CIH-003', stock: 8, critical: 3 },
  { id: '8', name: 'Alkali Plus Filtre', sku: 'AQ-FIL-005', stock: 30, critical: 8 },
];

export default function AdminStockPage() {
  const [items, setItems] = useState(initialStock);
  const adjust = (id: string, delta: number) => setItems(prev => prev.map(i => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i));

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Stok Yönetimi</h2>

      {/* Critical alerts */}
      {items.filter(i => i.stock <= i.critical).length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-5 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{items.filter(i => i.stock <= i.critical).length} ürün kritik stok seviyesinin altında!</p>
        </div>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Ürün', 'SKU', 'Mevcut Stok', 'Kritik Limit', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id} className={`border-b border-[#F0F6FF] last:border-0 ${i.stock <= i.critical ? 'bg-red-50/50' : 'hover:bg-[#F8FBFF]/50'}`}>
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{i.name}</td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF] font-mono">{i.sku}</td>
                  <td className="px-4 py-3"><span className={`text-sm font-bold ${i.stock <= i.critical ? 'text-red-600' : 'text-[#0D2137]'}`}>{i.stock}</span></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{i.critical}</td>
                  <td className="px-4 py-3">
                    {i.stock <= i.critical ? <span className="text-xs font-medium bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Kritik</span> : i.stock <= i.critical + 5 ? <span className="text-xs font-medium bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">Düşük</span> : <span className="text-xs font-medium bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Normal</span>}
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1"><button onClick={() => adjust(i.id, -1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F0F6FF] hover:bg-red-100 text-[#5A6B7B] hover:text-red-500 transition-all"><Minus className="w-3 h-3" /></button><span className="w-8 text-center text-sm font-semibold">{i.stock}</span><button onClick={() => adjust(i.id, 1)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#F0F6FF] hover:bg-emerald-100 text-[#5A6B7B] hover:text-emerald-600 transition-all"><Plus className="w-3 h-3" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
