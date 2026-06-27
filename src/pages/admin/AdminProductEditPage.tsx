import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, X, Save, ImageIcon } from 'lucide-react';
import { adminCreateProduct, adminGetCategories, type CategoryDto } from '@/services/productService';
import { useToastStore } from '@/components/Toast';

export default function AdminProductEditPage() {
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const addToast = useToastStore((s) => s.add);

  useEffect(() => {
    let cancelled = false;
    adminGetCategories()
      .then((cats) => {
        if (!cancelled) {
          setCategories(cats);
          if (cats.length > 0) setCategoryId(cats[0].id);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Kategoriler yüklenemedi.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const s = [...specs]; s[i][field] = val; setSpecs(s);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const specifications = specs.reduce<Record<string, string>>((acc, s) => {
      if (s.key.trim()) acc[s.key.trim()] = s.value;
      return acc;
    }, {});

    try {
      await adminCreateProduct({
        name,
        slug,
        categoryId,
        shortDescription: shortDescription || undefined,
        description,
        price: Number(price),
        oldPrice: oldPrice ? Number(oldPrice) : null,
        stock: Number(stock),
        images: [],
        features: [],
        specifications,
        isActive,
      });
      addToast('Ürün başarıyla kaydedildi.', 'success');
      setName('');
      setSlug('');
      setShortDescription('');
      setDescription('');
      setPrice('');
      setOldPrice('');
      setStock('0');
      setSpecs([{ key: '', value: '' }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Kayıt başarısız.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-[#8B9DAF]">Yükleniyor...</div>;
  }

  return (
      <>      <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-white mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
      </Link>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Yeni Ürün Ekle</h2>
      </div>

      {error && <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">{error}</div>}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Ürün Adı</label><input required value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Slug</label><input required value={slug} onChange={e => setSlug(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Kategori</label>
                <select required value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Kısa Açıklama</label><input value={shortDescription} onChange={e => setShortDescription(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" /></div>
            <div><label className="text-xs text-[#8B9DAF] mb-1 block">Uzun Açıklama</label><textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] resize-none" /></div>
          </div>

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

        <div className="space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Fiyat & Stok</h3>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Fiyat (₺)</label><input required type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">İndirimli (₺)</label><input type="number" min="0" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
              <div><label className="text-xs text-[#8B9DAF] mb-1 block">Stok</label><input required type="number" min="0" value={stock} onChange={e => setStock(e.target.value)} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#5A6B7B]"><input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#1A73E8]" />Aktif</label>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Ürün Görselleri</h3>
            <div className="border-2 border-dashed border-[#D6E3F0] rounded-xl p-8 text-center">
              <ImageIcon className="w-8 h-8 text-[#D6E3F0] mx-auto mb-2" />
              <p className="text-xs text-[#8B9DAF]">Görsel yükleme yakında eklenecek</p>
            </div>
          </div>

          <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3 rounded-xl font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-60">
            <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>
      </>
  );
}
