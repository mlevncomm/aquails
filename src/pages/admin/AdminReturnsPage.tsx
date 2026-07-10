import { useState, useEffect, useCallback } from 'react';
import { Check, X } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import { getReturnedOrders, updateOrderStatus, type AdminOrderListItem } from '@/services/orderService';

export default function AdminReturnsPage() {
  const [items, setItems] = useState<AdminOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getReturnedOrders());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    const result = await updateOrderStatus(id, status);
    if (result.success) {
      addToast('Durum güncellendi', 'success');
      void load();
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">İade / Değişim Yönetimi</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Müşteri', 'Sipariş', 'Ürün', 'Tutar', 'Durum', 'Tarih', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{item.customer}</td>
                    <td className="px-4 py-3 text-sm text-[#1A73E8]">{item.orderNo}</td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{item.product}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{item.amount.toLocaleString('tr-TR')}₺</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B9DAF]">{item.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => void updateStatus(item.id, 'delivered')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-emerald-500"
                          title="Onayla"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => void updateStatus(item.id, 'cancelled')}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-500"
                          title="Reddet"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">İade talebi bulunmuyor</div>
        )}
      </div>
    </>
  );
}
