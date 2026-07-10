import { useState, useEffect, useCallback } from 'react';
import { Mail, Check, Trash2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getStockNotifications,
  markNotified,
  deleteStockNotification,
  type StockNotification,
} from '@/services/stockNotificationService';

export default function AdminStockNotificationsPage() {
  const [items, setItems] = useState<StockNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setItems(await getStockNotifications());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markSent = async (id: string) => {
    const result = await markNotified(id);
    if (result.success) {
      addToast('Bildirim gönderildi olarak işaretlendi.', 'success');
      void load();
    }
  };

  const remove = async (id: string) => {
    const result = await deleteStockNotification(id);
    if (result.success) {
      addToast('Kayıt silindi.', 'success');
      void load();
    }
  };

  return (
    <>
      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Stok Bildirim Talepleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Ürün', 'E-posta', 'Talep Tarihi', 'Durum', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{item.productName}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm text-[#5A6B7B]">
                        <Mail className="w-3.5 h-3.5 text-[#8B9DAF]" />
                        {item.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#8B9DAF]">{item.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.notified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                      >
                        {item.notified ? 'Gönderildi' : 'Bekliyor'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {!item.notified && (
                          <button
                            onClick={() => void markSent(item.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-[#8B9DAF] hover:text-emerald-500"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => void remove(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Bildirim talebi bulunmuyor</div>
        )}
      </div>
    </>
  );
}
