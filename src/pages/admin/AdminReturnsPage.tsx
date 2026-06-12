import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const initial = [
  { id: '1', customer: 'Ahmet Y.', orderNo: 'AQ-2026-1847', product: 'PurePro 7 Aşamalı', type: 'return', reason: 'Farklı model istiyorum', status: 'approved' },
  { id: '2', customer: 'Zeynep K.', orderNo: 'AQ-2026-1835', product: 'Compact', type: 'exchange', reason: 'Renk değişimi', status: 'reviewing' },
  { id: '3', customer: 'Burak D.', orderNo: 'AQ-2026-1820', product: 'Filtre Seti', type: 'return', reason: 'Fazla sipariş', status: 'received' },
];

const statusLabels: Record<string, { text: string; color: string }> = {
  received: { text: 'Alındı', color: 'bg-blue-50 text-blue-600' },
  reviewing: { text: 'İnceleniyor', color: 'bg-amber-50 text-amber-600' },
  approved: { text: 'Onaylandı', color: 'bg-emerald-50 text-emerald-600' },
  rejected: { text: 'Reddedildi', color: 'bg-red-50 text-red-600' },
  completed: { text: 'Tamamlandı', color: 'bg-gray-100 text-gray-500' },
};

export default function AdminReturnsPage() {
  const [items, setItems] = useState(initial);
  const addToast = useToastStore((s) => s.add);

  const updateStatus = (id: string, status: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    addToast(`Durum güncellendi`, 'success');
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">İade / Değişim Yönetimi</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FBFF]">
                {['Müşteri', 'Sipariş', 'Ürün', 'Tür', 'Sebep', 'Durum', 'İşlem'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const s = statusLabels[item.status];
                return (
                  <tr key={item.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{item.customer}</td>
                    <td className="px-4 py-3 text-sm text-[#1A73E8]">{item.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{item.product}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[#F0F6FF] text-[#1A73E8]">
                        {item.type === 'return' ? 'İade' : 'Değişim'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{item.reason}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>{s.text}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {item.status !== 'approved' && item.status !== 'rejected' && item.status !== 'completed' && (
                          <>
                            <button onClick={() => updateStatus(item.id, 'approved')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-[#8B9DAF] hover:text-emerald-500">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateStatus(item.id, 'rejected')} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
