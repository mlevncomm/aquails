import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, X, Save, ImageIcon, Package, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { useToastStore } from '@/components/Toast';
import {
  getAdminProductById,
  getCategoryOptions,
  updateProduct,
  createProduct,
  setProductPrimaryImage,
} from '@/services/productService';
import { uploadProductImage } from '@/services/storageService';
import { AdminCard, AdminInput, AdminLabel, AdminSelect, AdminTextarea, AdminButton } from '@/components/admin/admin-ui';

function specsFromProduct(specs: Record<string, string>) {
  const entries = Object.entries(specs);
  return entries.length ? entries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }];
}

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id;
  const navigate = useNavigate();
  const addToast = useToastStore((s) => s.add);

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    categoryId: '',
    sku: '',
    shortDescription: '',
    description: '',
    price: '',
    oldPrice: '',
    taxRate: '20',
    stock: '',
    isActive: true,
  });

  useEffect(() => {
    void getCategoryOptions().then((cats) => {
      setCategories(cats);
      if (isNew && cats[0]) setForm((f) => ({ ...f, categoryId: cats[0].id }));
    });
  }, [isNew]);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    setLoading(true);
    void getAdminProductById(id!).then((product) => {
      if (cancelled) return;
      if (!product) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setForm({
        name: product.name,
        slug: product.slug,
        categoryId: product.categoryId ?? '',
        sku: product.sku ?? '',
        shortDescription: product.shortDescription,
        description: product.description,
        price: String(product.price),
        oldPrice: product.oldPrice ? String(product.oldPrice) : '',
        taxRate: String(product.taxRate ?? 20),
        stock: String(product.stock),
        isActive: product.isActive ?? true,
      });
      setSpecs(specsFromProduct(product.specifications));
      setImageUrl(product.images?.[0] ?? null);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id, isNew]);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    const next = [...specs];
    next[i][field] = val;
    setSpecs(next);
  };

  const handleImageUpload = async (file: File | null) => {
    if (!file) return;
    if (isNew) {
      addToast('Önce ürünü kaydedin, sonra görsel yükleyin.', 'error');
      return;
    }
    setUploadingImage(true);
    const uploaded = await uploadProductImage(file, id!);
    if (!uploaded.success || !uploaded.url) {
      setUploadingImage(false);
      addToast(uploaded.error ?? 'Görsel yüklenemedi.', 'error');
      return;
    }
    const saved = await setProductPrimaryImage(id!, uploaded.url);
    setUploadingImage(false);
    if (!saved.success) {
      addToast(saved.error ?? 'Görsel kaydedilemedi.', 'error');
      return;
    }
    setImageUrl(uploaded.url);
    addToast('Ürün görseli güncellendi.', 'success');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      addToast('Lütfen kategori seçin.', 'error');
      return;
    }
    setSaving(true);
    const specifications = Object.fromEntries(
      specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()]),
    );
    const payload = {
      name: form.name,
      slug: form.slug,
      categoryId: form.categoryId,
      sku: form.sku || undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      taxRate: Number(form.taxRate) || 20,
      stock: Number(form.stock),
      isActive: form.isActive,
      specifications,
    };

    const result = isNew
      ? await createProduct(payload)
      : await updateProduct(id!, payload);

    setSaving(false);
    if (!result.success) {
      addToast(result.error ?? 'Kayıt başarısız.', 'error');
      return;
    }
    addToast(isNew ? 'Ürün oluşturuldu.' : 'Ürün güncellendi.', 'success');
    if (isNew && 'id' in result && result.id) navigate(`/admin/urunler/${result.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-aq-muted">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!isNew && notFound) {
    return (
      <>
        <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-aq-muted hover:text-aq-blue mb-6">
          <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
        </Link>
        <AdminCard>
          <EmptyState
            icon={<Package className="w-8 h-8 text-aq-muted" />}
            title="Ürün bulunamadı"
            description="Düzenlemek istediğiniz ürün mevcut değil veya silinmiş olabilir."
            action={
              <Link to="/admin/urunler" className="bg-aq-blue text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white">
                Ürün Listesine Dön
              </Link>
            }
          />
        </AdminCard>
      </>
    );
  }

  return (
    <>
      <Link to="/admin/urunler" className="inline-flex items-center gap-1.5 text-sm text-aq-muted hover:text-aq-blue mb-6">
        <ArrowLeft className="w-4 h-4" /> Ürünlere Dön
      </Link>

      <h2 className="text-xl font-semibold text-aq-text mb-6">
        {isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
      </h2>

      <form onSubmit={(e) => void handleSave(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AdminLabel>Ürün Adı</AdminLabel>
                <AdminInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <AdminLabel>Slug</AdminLabel>
                <AdminInput required value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div>
                <AdminLabel>Kategori</AdminLabel>
                <AdminSelect value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </AdminSelect>
              </div>
              <div>
                <AdminLabel>SKU</AdminLabel>
                <AdminInput value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <AdminLabel>Kısa Açıklama</AdminLabel>
              <AdminInput value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
            </div>
            <div className="mt-4">
              <AdminLabel>Uzun Açıklama</AdminLabel>
              <AdminTextarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-aq-text">Teknik Özellikler</h3>
              <button type="button" onClick={addSpec} className="flex items-center gap-1 text-xs text-aq-blue font-medium hover:underline">
                <Plus className="w-3 h-3" /> Ekle
              </button>
            </div>
            <div className="space-y-2">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <AdminInput value={s.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} placeholder="Özellik" className="flex-1" />
                  <AdminInput value={s.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} placeholder="Değer" className="flex-1" />
                  <button type="button" onClick={() => removeSpec(i)} className="w-9 flex items-center justify-center text-aq-muted hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4">Fiyat & Stok</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <AdminLabel>Fiyat — KDV Hariç (₺)</AdminLabel>
                <AdminInput type="number" required step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <AdminLabel>KDV Oranı (%)</AdminLabel>
                <AdminInput type="number" required value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
              </div>
              <div>
                <AdminLabel>İndirimli — KDV Hariç (₺)</AdminLabel>
                <AdminInput type="number" step="0.01" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
              </div>
              <div>
                <AdminLabel>Stok</AdminLabel>
                <AdminInput type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
              </div>
            </div>
            {form.price && (
              <p className="text-xs text-aq-blue mt-3 bg-aq-sky px-3 py-2 rounded-lg">
                Müşteri fiyatı (KDV dahil):{' '}
                <strong>
                  {(Number(form.price) * (1 + (Number(form.taxRate) || 20) / 100)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                </strong>
              </p>
            )}
            <label className="flex items-center gap-2 text-sm text-aq-muted mt-4">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-aq-deep" />
              Aktif
            </label>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-3">Ürün Görseli</h3>
            {imageUrl && (
              <img src={imageUrl} alt={form.name} className="w-full h-40 object-cover rounded-xl mb-3" />
            )}
            <label className="border-2 border-dashed border-aq-border/60 rounded-xl p-8 text-center block cursor-pointer hover:border-aq-blue/40 transition-colors">
              <ImageIcon className="w-8 h-8 text-aq-muted/60 mx-auto mb-2" />
              <p className="text-xs text-aq-muted">
                {uploadingImage ? 'Yükleniyor...' : isNew ? 'Önce ürünü kaydedin' : 'Görsel yüklemek için tıklayın'}
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                disabled={uploadingImage || isNew}
                onChange={(e) => void handleImageUpload(e.target.files?.[0] ?? null)}
              />
            </label>
          </AdminCard>

          <AdminButton type="submit" disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet
          </AdminButton>
        </div>
      </form>
    </>
  );
}
