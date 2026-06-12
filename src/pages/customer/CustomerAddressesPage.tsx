import { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, Home, Building2, Star } from 'lucide-react';

interface Addr {
  id: string; title: string; type: 'shipping' | 'billing';
  city: string; district: string; fullAddress: string; isDefault: boolean;
}

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState<Addr[]>([
    { id: '1', title: 'Ev Adresi', type: 'shipping', city: 'İstanbul', district: 'Pendik', fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12', isDefault: true },
    { id: '2', title: 'İş Adresi', type: 'shipping', city: 'İstanbul', district: 'Kadıköy', fullAddress: 'Caferağa Mah. Moda Cad. No:12 Kat:3', isDefault: false },
    { id: '3', title: 'Fatura Adresi', type: 'billing', city: 'İstanbul', district: 'Pendik', fullAddress: 'Atatürk Mah. Cumhuriyet Cad. No:45 D:12', isDefault: true },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', city: '', district: '', fullAddress: '', type: 'shipping' as 'shipping' | 'billing', isDefault: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? { ...a, ...form } : form.isDefault && a.type === form.type ? { ...a, isDefault: false } : a));
    } else {
      const newAddr: Addr = { id: Date.now().toString(), ...form };
      if (form.isDefault) setAddresses(prev => prev.map(a => a.type === form.type ? { ...a, isDefault: false } : a).concat(newAddr));
      else setAddresses(prev => [...prev, newAddr]);
    }
    setShowForm(false); setEditingId(null);
    setForm({ title: '', city: '', district: '', fullAddress: '', type: 'shipping', isDefault: false });
  };

  const startEdit = (a: Addr) => { setForm({ title: a.title, city: a.city, district: a.district, fullAddress: a.fullAddress, type: a.type, isDefault: a.isDefault }); setEditingId(a.id); setShowForm(true); };
  const remove = (id: string) => setAddresses(prev => prev.filter(a => a.id !== id));

  return (
      <>      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#0D2137]">Adreslerim</h2>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', city: '', district: '', fullAddress: '', type: 'shipping', isDefault: false }); }} className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#1557B0] transition-all">
          <Plus className="w-3.5 h-3.5" /> Yeni Adres
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-5 space-y-3">
          <h3 className="text-sm font-semibold text-[#0D2137]">{editingId ? 'Adresi Düzenle' : 'Yeni Adres Ekle'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Adres Başlığı (Ev, İş)" className="px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'shipping' | 'billing' })} className="px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] bg-white">
              <option value="shipping">Teslimat Adresi</option>
              <option value="billing">Fatura Adresi</option>
            </select>
            <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Şehir" className="px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
            <input required value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} placeholder="İlçe" className="px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
          </div>
          <textarea required value={form.fullAddress} onChange={e => setForm({ ...form, fullAddress: e.target.value })} placeholder="Açık Adres" rows={2} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] resize-none" />
          <label className="flex items-center gap-2 text-sm text-[#5A6B7B]">
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 accent-[#1A73E8]" />
            Varsayılan adres yap
          </label>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#1A73E8] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">Kaydet</button>
            <button type="button" onClick={() => setShowForm(false)} className="border border-[#E8F0FE] text-[#5A6B7B] px-5 py-2 rounded-full text-sm font-medium hover:border-[#1A73E8] transition-all">İptal</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {addresses.map(a => (
          <div key={a.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 relative hover:shadow-md transition-shadow">
            {a.isDefault && <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#EBF3FF] text-[#1A73E8] text-[10px] font-semibold px-2 py-0.5 rounded-full"><Star className="w-3 h-3" />Varsayılan</span>}
            <div className="flex items-center gap-2 mb-2">
              {a.type === 'shipping' ? <Home className="w-4 h-4 text-[#1A73E8]" /> : <Building2 className="w-4 h-4 text-[#8B5CF6]" />}
              <h3 className="text-sm font-semibold text-[#0D2137]">{a.title}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${a.type === 'shipping' ? 'bg-sky-50 text-sky-600' : 'bg-violet-50 text-violet-600'}`}>{a.type === 'shipping' ? 'Teslimat' : 'Fatura'}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#5A6B7B]"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8B9DAF]" /><p>{a.fullAddress}, {a.district}/{a.city}</p></div>
            <div className="flex gap-1 mt-3">
              <button onClick={() => startEdit(a)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8] transition-all"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
      </>
  );
}
