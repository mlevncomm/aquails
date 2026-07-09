import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Plus, X, Save, ImageIcon, Package } from 'lucide-react';
import { getProductById, products } from '@/data/products';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToastStore } from '@/components/Toast';

const categories = Array.from(new Set(products.map((p) => p.category)));

function specsFromProduct(specs: Record<string, string>) {
  return Object.entries(specs).map(([key, value]) => ({ key, value }));
}

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const product = useMemo(() => (id ? getProductById(id) : undefined), [id]);
  const addToast = useToastStore((s) => s.add);

  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: categories[0] ?? '',
    sku: '',
    shortDescription: '',
    description: '',
    price: '',
    oldPrice: '',
    stock: '',
    isActive: true,
  });

  useEffect(() => {
    if (isNew) {
      setForm({
        name: '',
        slug: '',
        category: categories[0] ?? '',
        sku: '',
        shortDescription: '',
        description: '',
        price: '',
        oldPrice: '',
        stock: '',
        isActive: true,
      });
      setSpecs([{ key: 'Garanti', value: '5 Yıl' }]);
      return;
    }

    if (!product) return;

    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      sku: product.id,
      shortDescription: product.shortDescription,
      description: product.description,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      stock: String(product.stock),
      isActive: true,
    });
    setSpecs(specsFromProduct(product.specifications));
  }, [isNew, product]);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const next = [...specs];
    next[i][field] = val;
    setSpecs(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    addToast(isNew ? 'Ürün kaydedildi (mock).' : 'Ürün güncellendi (mock).', 'success');
    setTimeout(() => setSaved(false), 3000);
  };

  if (!isNew && !product) {
    return (
      <>
        <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-white mb-5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
        </Link>
        <div className="bg-white border border-[#E8F0FE] rounded-2xl">
          <EmptyState
            icon={<Package className="w-8 h-8 text-[#8B9DAF]" />}
            title="Ürün bulunamadı"
            description="Düzenlemek istediğiniz ürün mevcut değil veya silinmiş olabilir."
            action={
              <Link to="/admin/urunler" className="bg-[#1A73E8] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1557B0]">
                Ürün Listesine Dön
              </Link>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-[#8B9DAF] hover:text-white mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
      </Link>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">
          {isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
        </h2>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium mb-5">
          Ürün başarıyla kaydedildi.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">Ürün Adı</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
              </div>
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">Slug</label>
                <input required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
              </div>
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl bg-white">
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">SKU</label>
                <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block">Kısa Açıklama</label>
              <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8]" />
            </div>
            <div>
              <label className="text-xs text-[#8B9DAF] mb-1 block">Uzun Açıklama</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] resize-none" />
            </div>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#0D2137]">Teknik Özellikler</h3>
              <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs text-[#1A73E8] font-medium hover:underline">
                <Plus className="w-3 h-3" /> Ekle
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input value={s.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Özellik" className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
                  <input value={s.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Değer" className="flex-1 px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
                  <button type="button" onClick={() => removeSpec(i)} className="w-9 flex items-center justify-center text-[#8B9DAF] hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-[#0D2137]">Fiyat & Stok</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">Fiyat (₺)</label>
                <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">İndirimli (₺)</label>
                <input type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
              </div>
              <div>
                <label className="text-xs text-[#8B9DAF] mb-1 block">Stok</label>
                <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-xl" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#5A6B7B]">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-[#1A73E8]" />
              Aktif
            </label>
          </div>

          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Ürün Görselleri</h3>
            {product?.images?.[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-3" />
            ) : null}
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
