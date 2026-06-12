import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, X, Save, ImageIcon } from 'lucide-react';

export default function AdminProductEditPage() {
  const [specs, setSpecs] = useState([{ key: 'Garanti', value: '5 Yıl' }, { key: 'Boyutlar', value: '42 x 21 x 51 cm' }]);
  const [saved, setSaved] = useState(false);
  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const s = [...specs]; s[i][field] = val; setSpecs(s);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
      <>      <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-white mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
      </Link>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Yeni Ürün Ekle</h2>
      </div>

      {saved && <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">Ürün başarıyla kaydedildi.</div>}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Ürün Adı</label><input required defaultValue="Aquails PurePro 7 Aşamalı" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Slug</label><input required defaultValue="aquails-purepro-7-asamali" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Kategori</label><select className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white"><option>Ev Tipi</option><option>Tezgah Altı</option><option>Endüstriyel</option><option>Filtre Seti</option><option>Yedek Parça</option></select></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">SKU</label><input defaultValue="AQ-PUREPRO-7" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            </div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Kısa Açıklama</label><input defaultValue="7 aşamalı RO teknolojisi ile en saf su." className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Uzun Açıklama</label><textarea rows={4} defaultValue="Aquails PurePro, en gelişmiş su arıtma teknolojisini evinize getiriyor..." className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] resize-none" /></div>
          </div>

          {/* Specs */}
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#0D2137]">Teknik Özellikler</h3>
              <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs text-[#1A73E8] font-medium hover:underline"><Plus className="w-3 h-3" /> Ekle</button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.key} onChange={e => updateSpec(i, 'key', e.target.value)} placeholder="Özellik" className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
                  <input value={s.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Değer" className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
                  <button type="button" onClick={() => removeSpec(i)} className="w-9 flex items-center justify-center text-[#8B9DAF] hover:text-red-500"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Fiyat & Stok</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Fiyat (₺)</label><input type="number" defaultValue="12900" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">İndirimli (₺)</label><input type="number" defaultValue="15900" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Stok</label><input type="number" defaultValue="24" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Kritik Stok</label><input type="number" defaultValue="5" className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#5A6B7B]"><input type="checkbox" defaultChecked className="w-4 h-4 accent-[#1A73E8]" />Aktif</label>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Ürün Görselleri</h3>
            <div className="border-2 border-dashed border-[#D6E3F0] rounded-xl p-8 text-center hover:border-[#1A73E8] transition-colors cursor-pointer">
              <ImageIcon className="w-8 h-8 text-[#D6E3F0] mx-auto mb-2" />
              <p className="text-xs text-[#8B9DAF]">Görsel yüklemek için tıklayın</p>
            </div>
          </div>

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3 rounded-xl font-semibold hover:bg-[#1557B0] transition-all">
            <Save className="w-4 h-4" /> Kaydet
          </button>
        </div>
      </form>
      </>
  );
}
