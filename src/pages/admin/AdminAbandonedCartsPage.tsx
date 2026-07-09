import { Send, RotateCcw, Trash2 } from 'lucide-react';
import { getAbandonedCarts, getStats, sendReminder, markConverted, deleteAbandonedCart } from '@/services/abandonedCartService';
import { useToastStore } from '@/components/Toast';
import { useState } from 'react';

export default function AdminAbandonedCartsPage() {
  const addToast = useToastStore(s => s.add);
  const [carts, setCarts] = useState(getAbandonedCarts());
  const stats = getStats();

  const refresh = () => setCarts(getAbandonedCarts());

  const handleSendReminder = (id: string) => {
    sendReminder(id);
    addToast('Hatırlatıcı gönderildi.', 'success');
    refresh();
  };

  const handleConvert = (id: string) => {
    markConverted(id);
    addToast('Dönüştürüldü olarak işaretlendi.', 'success');
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteAbandonedCart(id);
    refresh();
  };

  const statusColor: Record<string, string> = {
    new: 'text-[#1A73E8] bg-[#F0F6FF]',
    'reminder-sent': 'text-amber-600 bg-amber-50',
    converted: 'text-emerald-600 bg-emerald-50',
  };

  const statusLabel: Record<string, string> = {
    new: 'Yeni',
    'reminder-sent': 'Hatırlatıcı Gönderildi',
    converted: 'Dönüştü',
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold text-[#0D2137] mb-1">Terk Edilmis Sepetler</h1>
      <p className="text-sm text-[#8B9DAF] mb-6">Sepeti terk eden müşterileri takip edin, hatırlatıcı gönderin.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Toplam', value: stats.total },
          { label: 'Yeni', value: stats.new },
          { label: 'Hatırlatıcı', value: stats.reminderSent },
          { label: 'Donusum', value: stats.converted },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#E8F0FE] rounded-xl p-4">
            <p className="text-xs text-[#8B9DAF]">{s.label}</p>
            <p className="text-xl font-bold text-[#0D2137]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E8F0FE]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B9DAF]">Müşteri</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B9DAF]">Ürünler</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B9DAF]">Tutar</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B9DAF]">Son Aktivite</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#8B9DAF]">Durum</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[#8B9DAF]">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {carts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-sm text-[#8B9DAF]">Terk edilmiş sepet bulunmuyor.</td></tr>
              ) : carts.map(c => (
                <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{c.customerName}</td>
                  <td className="px-4 py-3 text-xs text-[#5A6B7B]">{c.items.map(i => i.productName).join(', ')}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{c.total.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-4 py-3 text-xs text-[#8B9DAF]">{new Date(c.lastActivity).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor[c.status]}`}>{statusLabel[c.status]}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {c.status === 'new' && (
                        <button onClick={() => handleSendReminder(c.id)} className="p-1.5 rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8] transition-all" title="Hatırlatıcı gönder"><Send className="w-3.5 h-3.5" /></button>
                      )}
                      {c.status !== 'converted' && (
                        <button onClick={() => handleConvert(c.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-[#8B9DAF] hover:text-emerald-500 transition-all" title="Dönüştür"><RotateCcw className="w-3.5 h-3.5" /></button>
                      )}
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500 transition-all" title="Sil"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
