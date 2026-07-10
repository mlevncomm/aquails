import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Tag, Percent, CircleDollarSign } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  getCoupons,
  createCoupon,
  toggleCouponActive,
  deleteCoupon,
  type AdminCoupon,
} from '@/services/couponService';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '',
    type: 'percent' as 'percent' | 'fixed',
    value: '',
    minOrder: '',
    usageLimit: '',
    start: '',
    end: '',
    active: true,
  });
  const addToast = useToastStore((s) => s.add);

  const load = useCallback(async () => {
    setLoading(true);
    setCoupons(await getCoupons());
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createCoupon({
      code: form.code,
      type: form.type,
      value: Number(form.value),
      minOrder: Number(form.minOrder),
      usageLimit: Number(form.usageLimit),
      start: form.start,
      end: form.end,
      active: form.active,
    });
    if (result.success) {
      addToast('Kupon oluşturuldu.', 'success');
      setShowForm(false);
      setForm({ code: '', type: 'percent', value: '', minOrder: '', usageLimit: '', start: '', end: '', active: true });
      void load();
    } else {
      addToast(result.error ?? 'Kupon oluşturulamadı.', 'error');
    }
  };

  const remove = async (id: string) => {
    const result = await deleteCoupon(id);
    if (result.success) {
      addToast('Kupon silindi.', 'success');
      void load();
    } else {
      addToast(result.error ?? 'Silinemedi.', 'error');
    }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const result = await toggleCouponActive(id, !active);
    if (result.success) {
      addToast('Durum güncellendi.', 'info');
      void load();
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Kupon / Kampanya Yönetimi</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]"
        >
          <Plus className="w-4 h-4" /> Yeni Kupon
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="bg-[#0A1929] border border-[#1A3A5C] rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          <input
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="Kupon Kodu"
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })}
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white"
          >
            <option value="percent">Yüzde (%)</option>
            <option value="fixed">Sabit Tutar (₺)</option>
          </select>
          <input
            required
            type="number"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder={form.type === 'percent' ? 'İndirim %' : 'İndirim ₺'}
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]"
          />
          <input
            required
            type="number"
            value={form.minOrder}
            onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
            placeholder="Min. Sepet ₺"
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]"
          />
          <input
            required
            type="number"
            value={form.usageLimit}
            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
            placeholder="Kullanım Limiti"
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]"
          />
          <input
            required
            type="date"
            value={form.start}
            onChange={(e) => setForm({ ...form, start: e.target.value })}
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white"
          />
          <input
            required
            type="date"
            value={form.end}
            onChange={(e) => setForm({ ...form, end: e.target.value })}
            className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm">
              Kaydet
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-[#1A3A5C] text-[#8B9DAF] px-4 py-2 rounded-lg text-sm">
              İptal
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-sm text-[#8B9DAF]">Kuponlar yükleniyor...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FBFF]">
                  {['Kod', 'Tip', 'Değer', 'Min. Sipariş', 'Kullanım', 'Tarih Aralığı', 'Durum', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 bg-[#EBF3FF] text-[#1A73E8] text-sm font-bold px-3 py-1 rounded-lg">
                        <Tag className="w-3.5 h-3.5" />
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {c.type === 'percent' ? (
                        <span className="flex items-center gap-1 text-sm text-[#5A6B7B]">
                          <Percent className="w-3.5 h-3.5" />
                          Yüzde
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-[#5A6B7B]">
                          <CircleDollarSign className="w-3.5 h-3.5" />
                          Sabit
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">
                      {c.type === 'percent' ? `%${c.value}` : `${c.value.toLocaleString('tr-TR')}₺`}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.minOrder.toLocaleString('tr-TR')}₺</td>
                    <td className="px-4 py-3 text-sm text-[#5A6B7B]">
                      {c.used} / {c.usageLimit}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">
                      {c.start} - {c.end}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => void toggleActive(c.id, c.active)}
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {c.active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => void remove(c.id)}
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
        {!loading && coupons.length === 0 && (
          <div className="text-center py-8 text-sm text-[#8B9DAF]">Henüz kupon yok</div>
        )}
      </div>
    </>
  );
}
