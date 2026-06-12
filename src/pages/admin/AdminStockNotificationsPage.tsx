import { useState } from 'react';
import { Mail, Check, Trash2 } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const initial = [
  { id: '1', product: 'Aquails PurePro 7 Aşamalı', email: 'ahmet@email.com', date: '10 Haziran 2026', status: 'pending' },
  { id: '2', product: 'RO Membran Filtre 100GPD', email: 'zeynep@email.com', date: '9 Haziran 2026', status: 'sent' },
  { id: '3', product: 'Mineral Plus Karbon Filtre', email: 'burak@email.com', date: '8 Haziran 2026', status: 'pending' },
];

export default function AdminStockNotificationsPage() {
  const [items, setItems] = useState(initial);
  const addToast = useToastStore(s => s.add);
  const markSent = (id: string) => { setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'sent' as const } : i)); addToast('Bildirim gönderildi olarak işaretlendi.', 'success'); };
  const remove = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); addToast('Kayıt silindi.', 'success'); };

  return (
      <>      <h2 className="text-lg font-semibold text-[#0D2137] mb-5">Stok Bildirim Talepleri</h2>
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Ürün', 'E-posta', 'Talep Tarihi', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3 text-sm font-medium text-[#0D2137]">{item.product}</td>
                  <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-sm text-[#5A6B7B]"><Mail className="w-3.5 h-3.5 text-[#8B9DAF]" />{item.email}</span></td>
                  <td className="px-4 py-3 text-sm text-[#8B9DAF]">{item.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.status === 'sent' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{item.status === 'sent' ? 'Gönderildi' : 'Bekliyor'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">{item.status === 'pending' && <button onClick={() => markSent(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-50 text-[#8B9DAF] hover:text-emerald-500"><Check className="w-4 h-4" /></button>}<button onClick={() => remove(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
  );
}
