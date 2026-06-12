import { useState } from 'react';
import { useReturnStore } from '@/stores/returnStore';
import { EmptyState } from '@/components/EmptyState';
import { RotateCcw, Plus, X } from 'lucide-react';
import { useToastStore } from '@/components/Toast';

const reasons = ['Farklı model istiyorum', 'Arızalı ürün', 'Kusurlu ürün', 'Beklentimi karşılamadı', 'Diğer'];
const statusLabels: Record<string, { text: string; color: string }> = {
  received: { text: 'Alındı', color: 'bg-blue-50 text-blue-600' },
  reviewing: { text: 'İnceleniyor', color: 'bg-amber-50 text-amber-600' },
  approved: { text: 'Onaylandı', color: 'bg-emerald-50 text-emerald-600' },
  rejected: { text: 'Reddedildi', color: 'bg-red-50 text-red-600' },
  completed: { text: 'Tamamlandı', color: 'bg-gray-100 text-gray-500' },
};

export default function CustomerReturnsPage() {
  const { returns, add } = useReturnStore();
  const addToast = useToastStore((s) => s.add);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ orderNo: '', productName: '', type: 'return' as 'return' | 'exchange' | 'service', reason: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.orderNo || !form.productName || !form.reason) { addToast('Lütfen zorunlu alanları doldurun.', 'error'); return; }
    add({ orderNo: form.orderNo, productName: form.productName, type: form.type, reason: form.reason, description: form.description });
    addToast('Talebiniz oluşturuldu.', 'success');
    setShowForm(false);
    setForm({ orderNo: '', productName: '', type: 'return', reason: '', description: '' });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">İade / Değişim Taleplerim</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1557B0]">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {showForm ? 'İptal' : 'Yeni Talep'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Sipariş No</label>
              <input required value={form.orderNo} onChange={(e) => setForm({ ...form, orderNo: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]" />
            </div>
            <div>
              <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Ürün Adı</label>
              <input required value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Sebep</label>
            <select required value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF]">
              <option value="">Sebep seçin</option>
              {reasons.map((r) => (<option key={r} value={r}>{r}</option>))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Açıklama</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] resize-none" />
          </div>
          <button type="submit" className="bg-[#1A73E8] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0]">Talep Oluştur</button>
        </form>
      )}

      {returns.length === 0 ? (
        <EmptyState icon={<RotateCcw className="w-8 h-8" />} title="Talebiniz Yok" description="Henüz bir iade/değişim talebiniz bulunmuyor." />
      ) : (
        <div className="space-y-3">
          {returns.map((r) => {
            const s = statusLabels[r.status];
            return (
              <div key={r.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-[#0D2137]">{r.productName}</p>
                    <p className="text-xs text-[#8B9DAF]">{r.orderNo}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${s.color}`}>{s.text}</span>
                </div>
                <p className="text-sm text-[#5A6B7B]">{r.reason}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
