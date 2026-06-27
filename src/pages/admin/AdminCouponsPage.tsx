import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Tag, Percent, CircleDollarSign } from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import {
  adminGetCoupons,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon,
} from '@/services/couponService';

interface CouponRow {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: string | null;
  endsAt: string | null;
  isActive: boolean;
}

function mapCoupon(raw: Record<string, unknown>): CouponRow {
  return {
    id: String(raw.id),
    code: String(raw.code),
    type: String(raw.type).toLowerCase(),
    value: Number(raw.value ?? 0),
    minOrder: raw.minOrder != null ? Number(raw.minOrder) : null,
    usageLimit: raw.usageLimit != null ? Number(raw.usageLimit) : null,
    usedCount: Number(raw.usedCount ?? 0),
    startsAt: raw.startsAt ? String(raw.startsAt).slice(0, 10) : null,
    endsAt: raw.endsAt ? String(raw.endsAt).slice(0, 10) : null,
    isActive: Boolean(raw.isActive),
  };
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percent' as 'percent' | 'fixed', value: '', minOrder: '', usageLimit: '', start: '', end: '', active: true });
  const addToast = useToastStore((s) => s.add);

  const loadCoupons = () => {
    setLoading(true);
    setError(null);
    adminGetCoupons()
      .then((data) => setCoupons(data.map(mapCoupon)))
      .catch((err) => setError(err instanceof Error ? err.message : 'Kuponlar yüklenemedi.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateCoupon({
        code: form.code,
        type: form.type.toUpperCase(),
        value: Number(form.value),
        minOrder: form.minOrder ? Number(form.minOrder) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        isActive: form.active,
        startsAt: form.start || null,
        endsAt: form.end || null,
      });
      addToast('Kupon oluşturuldu.', 'success');
      setShowForm(false);
      setForm({ code: '', type: 'percent', value: '', minOrder: '', usageLimit: '', start: '', end: '', active: true });
      loadCoupons();
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Oluşturma başarısız.', 'error');
    }
  };

  const remove = async (id: string) => {
    try {
      await adminDeleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
      addToast('Kupon silindi.', 'success');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Silme başarısız.', 'error');
    }
  };

  const toggleActive = async (coupon: CouponRow) => {
    try {
      await adminUpdateCoupon(coupon.id, { isActive: !coupon.isActive });
      setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
      addToast('Durum güncellendi.', 'info');
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Güncelleme başarısız.', 'error');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
      <>      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Kupon / Kampanya Yönetimi</h2>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0]"><Plus className="w-4 h-4" /> Yeni Kupon</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0A1929] border border-[#1A3A5C] rounded-xl p-4 mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Kupon Kodu" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white"><option value="percent">Yüzde (%)</option><option value="fixed">Sabit Tutar (₺)</option></select>
          <input required type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder={form.type === 'percent' ? 'İndirim %' : 'İndirim ₺'} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input type="number" value={form.minOrder} onChange={e => setForm({ ...form, minOrder: e.target.value })} placeholder="Min. Sepet ₺" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input type="number" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} placeholder="Kullanım Limiti" className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white placeholder-[#8B9DAF]" />
          <input type="date" value={form.start} onChange={e => setForm({ ...form, start: e.target.value })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white" />
          <input type="date" value={form.end} onChange={e => setForm({ ...form, end: e.target.value })} className="px-3 py-2 text-sm bg-[#0D2137] border border-[#1A3A5C] rounded-lg text-white" />
          <div className="flex gap-2"><button type="submit" className="bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm">Kaydet</button><button type="button" onClick={() => setShowForm(false)} className="border border-[#1A3A5C] text-[#8B9DAF] px-4 py-2 rounded-lg text-sm">İptal</button></div>
        </form>
      )}

      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">{['Kod', 'Tip', 'Değer', 'Min. Sipariş', 'Kullanım', 'Tarih Aralığı', 'Durum', 'İşlem'].map(h => <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50">
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1.5 bg-[#EBF3FF] text-[#1A73E8] text-sm font-bold px-3 py-1 rounded-lg"><Tag className="w-3.5 h-3.5" />{c.code}</span></td>
                  <td className="px-4 py-3">{c.type === 'percent' ? <span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><Percent className="w-3.5 h-3.5" />Yüzde</span> : <span className="flex items-center gap-1 text-sm text-[#5A6B7B]"><CircleDollarSign className="w-3.5 h-3.5" />Sabit</span>}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{c.type === 'percent' ? `%${c.value}` : `${c.value.toLocaleString('tr-TR')}₺`}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.minOrder != null ? `${c.minOrder.toLocaleString('tr-TR')}₺` : '—'}</td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{c.usedCount} / {c.usageLimit ?? '∞'}</td>
                  <td className="px-4 py-3 text-[13px] text-[#8B9DAF] whitespace-nowrap">{c.startsAt ?? '—'} - {c.endsAt ?? '—'}</td>
                  <td className="px-4 py-3"><button onClick={() => toggleActive(c)} className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>{c.isActive ? 'Aktif' : 'Pasif'}</button></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Pencil className="w-3.5 h-3.5" /></button><button onClick={() => remove(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {coupons.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Kupon bulunamadı</div>}
      </div>
      </>
  );
}
