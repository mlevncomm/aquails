import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Plus, X, Save, ImageIcon, Package, Loader2,
  Star, Trash2, ArrowUp, ArrowDown,
} from 'lucide-react';
import { useToastStore } from '@/components/Toast';
import type { DbProductImage } from '@/types/database';
import {
  addProductImageRecord,
  createProduct,
  deleteProduct,
  deleteProductImageRecord,
  getAdminProductById,
  getCategoryOptions,
  normalizeSlug,
  reorderProductImages,
  setProductPrimaryImage,
  updateProduct,
  validateAdminProductForm,
} from '@/services/productService';
import { getTaxConfig } from '@/services/shippingService';
import {
  bestEffortDeleteUploadedObject,
  uploadProductImage,
  validateProductImageFile,
} from '@/services/storageService';
import { ConfirmModal } from '@/components/ConfirmModal';
import {
  AdminBreadcrumb, AdminButton, AdminCard, AdminEmpty, AdminInput, AdminLabel,
  AdminLoading, AdminPageHeader, AdminPageShell, AdminSelect, AdminTextarea,
} from '@/components/admin/admin-ui';

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
  const [images, setImages] = useState<DbProductImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [galleryBusy, setGalleryBusy] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [siteTaxEnabled, setSiteTaxEnabled] = useState(true);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [dirty, setDirty] = useState(false);
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
  const busy = saving || uploadingImage || galleryBusy;

  const setFormField = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setDirty(true);
    setForm((f) => ({ ...f, [key]: value }));
  };

  useEffect(() => {
    void getCategoryOptions().then((cats) => {
      setCategories(cats);
      if (isNew && cats[0]) setForm((f) => ({ ...f, categoryId: cats[0].id }));
    });
  }, [isNew]);

  useEffect(() => {
    void getTaxConfig().then((cfg) => setSiteTaxEnabled(cfg.enabled));
  }, []);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    setLoading(true);
    void getAdminProductById(id!).then((result) => {
      if (cancelled) return;
      if (!result.ok) {
        if (result.error.code === 'not_found') setNotFound(true);
        else setLoadError(result.error.message);
        setLoading(false);
        return;
      }
      const product = result.product;
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
        isActive: product.isActive,
      });
      setSpecs(specsFromProduct(product.specifications));
      setImages(product.imageRecords);
      setDirty(false);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id, isNew]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty || saving) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty, saving]);

  const addSpec = () => { setDirty(true); setSpecs([...specs, { key: '', value: '' }]); };
  const removeSpec = (i: number) => { setDirty(true); setSpecs(specs.filter((_, idx) => idx !== i)); };
  const updateSpec = (i: number, field: 'key' | 'value', val: string) => {
    setDirty(true);
    const next = [...specs];
    next[i][field] = val;
    setSpecs(next);
  };

  const fingerprint = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

  const reloadImages = async (productId: string): Promise<boolean> => {
    const result = await getAdminProductById(productId);
    if (!result.ok) return false;
    setImages(result.product.imageRecords);
    return true;
  };

  const handleImageUpload = async (file: File | null, productId: string) => {
    if (!file || busy) return;
    const validation = validateProductImageFile(file);
    if (validation) {
      addToast(validation, 'error');
      return;
    }

    setUploadingImage(true);
    try {
      const uploaded = await uploadProductImage(file, productId);
      if (!uploaded.success || !uploaded.data) {
        addToast(!uploaded.success ? uploaded.error : 'Görsel yüklenemedi.', 'error');
        return;
      }

      const saved = await addProductImageRecord(productId, uploaded.data.url);
      if (!saved.success) {
        const cleanup = await bestEffortDeleteUploadedObject(uploaded.data.path);
        addToast(
          cleanup.cleaned
            ? (saved.error ?? 'Görsel kaydı oluşturulamadı. Yüklenen dosya temizlendi.')
            : `${saved.error ?? 'Görsel kaydı oluşturulamadı.'} Depolama temizliği de başarısız oldu.`,
          'error',
        );
        return;
      }

      const reloaded = await reloadImages(productId);
      if (!reloaded) {
        addToast('Görsel kaydedildi ancak liste yenilenemedi. Sayfayı yenileyin.', 'error');
        return;
      }
      addToast('Görsel eklendi.', 'success');
    } catch {
      addToast('Görsel yüklenirken beklenmeyen bir hata oluştu.', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePendingFiles = (files: FileList | null) => {
    if (!files?.length || busy) return;
    const next = [...pendingFiles];
    for (const file of Array.from(files)) {
      const validation = validateProductImageFile(file);
      if (validation) {
        addToast(validation, 'error');
        continue;
      }
      if (next.some((f) => fingerprint(f) === fingerprint(file))) continue;
      next.push(file);
    }
    setPendingFiles(next);
    setDirty(true);
  };

  const makePrimary = async (imageId: string) => {
    if (!id || busy) return;
    setGalleryBusy(true);
    try {
      const result = await setProductPrimaryImage(id, imageId);
      if (!result.success) {
        addToast(result.error ?? 'Ana görsel ayarlanamadı.', 'error');
        return;
      }
      const reloaded = await reloadImages(id);
      if (!reloaded) {
        addToast('Ana görsel güncellendi ancak liste yenilenemedi.', 'error');
        return;
      }
      addToast('Ana görsel güncellendi.', 'success');
    } catch {
      addToast('Ana görsel ayarlanamadı.', 'error');
    } finally {
      setGalleryBusy(false);
    }
  };

  const removeImage = async (image: DbProductImage) => {
    if (!id || busy) return;
    if (!window.confirm('Bu görseli silmek istediğinize emin misiniz?')) return;
    setGalleryBusy(true);
    try {
      const deleted = await deleteProductImageRecord(image.id);
      if (!deleted.success || !deleted.data) {
        addToast(!deleted.success ? deleted.error : 'Görsel silinemedi.', 'error');
        return;
      }
      const cleanup = await bestEffortDeleteUploadedObject(deleted.data.url);
      const reloaded = await reloadImages(id);
      if (!reloaded) {
        addToast('Görsel silindi ancak liste yenilenemedi.', 'error');
        return;
      }
      addToast(
        cleanup.cleaned ? 'Görsel silindi.' : 'Görsel kaydı silindi; depolama temizliği tamamlanamadı.',
        cleanup.cleaned ? 'success' : 'error',
      );
    } catch {
      addToast('Görsel silinemedi.', 'error');
    } finally {
      setGalleryBusy(false);
    }
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    if (!id || busy) return;
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const ordered = images.map((img) => img.id);
    const tmp = ordered[index];
    ordered[index] = ordered[target];
    ordered[target] = tmp;
    setGalleryBusy(true);
    try {
      const result = await reorderProductImages(id, ordered);
      if (!result.success) {
        addToast(result.error ?? 'Sıralama güncellenemedi.', 'error');
        return;
      }
      const reloaded = await reloadImages(id);
      if (!reloaded) addToast('Sıralama güncellendi ancak liste yenilenemedi.', 'error');
    } catch {
      addToast('Sıralama güncellenemedi.', 'error');
    } finally {
      setGalleryBusy(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!id || deletingProduct) return;
    setDeletingProduct(true);
    const result = await deleteProduct(id);
    if (!result.success) {
      setDeletingProduct(false);
      addToast(result.error ?? 'Ürün silinemedi.', 'error');
      return;
    }
    for (const url of result.data?.imageUrls ?? []) {
      void bestEffortDeleteUploadedObject(url);
    }
    addToast('Ürün silindi.', 'success');
    navigate('/admin/urunler');
  };

  const buildPayload = () => {
    const specifications = Object.fromEntries(
      specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value.trim()]),
    );
    const taxParsed = Number(form.taxRate);
    return {
      name: form.name,
      slug: normalizeSlug(form.slug || form.name),
      categoryId: form.categoryId,
      sku: form.sku || undefined,
      shortDescription: form.shortDescription,
      description: form.description,
      price: Number(form.price),
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice),
      taxRate: taxParsed,
      stock: Number(form.stock),
      isActive: form.isActive,
      specifications,
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const payload = buildPayload();
    const validation = validateAdminProductForm(payload);
    if (validation) {
      addToast(validation, 'error');
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const created = await createProduct(payload);
        if (!created.success || !created.data?.id) {
          addToast(!created.success ? created.error : 'Ürün oluşturulamadı.', 'error');
          return;
        }

        const productId = created.data.id;
        let imageFailures = 0;
        for (const file of pendingFiles) {
          const uploaded = await uploadProductImage(file, productId);
          if (!uploaded.success || !uploaded.data) {
            imageFailures += 1;
            continue;
          }
          const saved = await addProductImageRecord(productId, uploaded.data.url);
          if (!saved.success) {
            await bestEffortDeleteUploadedObject(uploaded.data.path);
            imageFailures += 1;
          }
        }

        setDirty(false);
        if (imageFailures > 0) {
          addToast(
            `Ürün oluşturuldu ancak ${imageFailures} görsel yüklenemedi. Ürünü düzenleyerek görselleri tekrar ekleyebilirsiniz.`,
            'error',
          );
        } else {
          addToast(pendingFiles.length ? 'Ürün ve görseller kaydedildi.' : 'Ürün oluşturuldu.', 'success');
        }
        navigate(`/admin/urunler/${productId}`);
        return;
      }

      const updated = await updateProduct(id!, payload);
      if (!updated.success) {
        addToast(updated.error ?? 'Kayıt başarısız.', 'error');
        return;
      }
      setDirty(false);
      if (updated.data) {
        setImages(updated.data.imageRecords);
        setForm((f) => ({
          ...f,
          slug: updated.data!.slug,
          isActive: updated.data!.isActive,
          sku: updated.data!.sku,
          taxRate: String(updated.data!.taxRate ?? f.taxRate),
        }));
      }
      addToast('Ürün güncellendi.', 'success');
    } catch {
      addToast('Kayıt sırasında beklenmeyen bir hata oluştu.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.sort_order - b.sort_order),
    [images],
  );

  if (loading) {
    return (
      <AdminPageShell>
        <AdminLoading variant="spinner" label="Ürün yükleniyor..." />
      </AdminPageShell>
    );
  }

  if (!isNew && (notFound || loadError)) {
    return (
      <AdminPageShell>
        <AdminBreadcrumb items={[{ label: 'Ürünler', to: '/admin/urunler' }, { label: 'Düzenle' }]} />
        <AdminCard padding={false}>
          <AdminEmpty
            icon={Package}
            title={notFound ? 'Ürün bulunamadı' : 'Ürün yüklenemedi'}
            message={loadError ?? 'Düzenlemek istediğiniz ürün mevcut değil veya erişim yetkiniz yok.'}
            action={
              <Link to="/admin/urunler">
                <AdminButton>Ürün Listesine Dön</AdminButton>
              </Link>
            }
          />
        </AdminCard>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <AdminBreadcrumb
        items={[
          { label: 'Ürünler', to: '/admin/urunler' },
          { label: isNew ? 'Yeni Ürün' : 'Düzenle' },
        ]}
      />
      <AdminPageHeader
        title={isNew ? 'Yeni Ürün Ekle' : 'Ürün Düzenle'}
        description={isNew ? 'Kataloğa yeni ürün ekleyin.' : 'Ürün bilgilerini güncelleyin.'}
        action={
          <div className="flex items-center gap-2">
            {!isNew && (
              <AdminButton
                type="button"
                variant="secondary"
                className="!text-red-500 hover:!bg-red-50"
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" /> Sil
              </AdminButton>
            )}
            <Link to="/admin/urunler">
              <AdminButton variant="ghost" className="!px-3">
                <ArrowLeft className="w-4 h-4" /> Geri
              </AdminButton>
            </Link>
          </div>
        }
      />

      <form onSubmit={(e) => void handleSave(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-4">Temel Bilgiler</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AdminLabel>Ürün Adı</AdminLabel>
                <AdminInput
                  required
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setDirty(true);
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: isNew && (!f.slug || f.slug === normalizeSlug(f.name))
                        ? normalizeSlug(name)
                        : f.slug,
                    }));
                  }}
                />
              </div>
              <div>
                <AdminLabel>Slug</AdminLabel>
                <AdminInput
                  required
                  value={form.slug}
                  onChange={(e) => setFormField('slug', normalizeSlug(e.target.value))}
                />
              </div>
              <div>
                <AdminLabel>Kategori</AdminLabel>
                <AdminSelect
                  required
                  value={form.categoryId}
                  onChange={(e) => setFormField('categoryId', e.target.value)}
                >
                  <option value="">Kategori seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </AdminSelect>
              </div>
              <div>
                <AdminLabel>SKU</AdminLabel>
                <AdminInput value={form.sku} onChange={(e) => setFormField('sku', e.target.value)} />
              </div>
            </div>
            <div className="mt-4">
              <AdminLabel>Kısa Açıklama</AdminLabel>
              <AdminInput value={form.shortDescription} onChange={(e) => setFormField('shortDescription', e.target.value)} />
            </div>
            <div className="mt-4">
              <AdminLabel>Uzun Açıklama</AdminLabel>
              <AdminTextarea rows={4} value={form.description} onChange={(e) => setFormField('description', e.target.value)} />
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
                <AdminInput type="number" required min={0} step="0.01" value={form.price} onChange={(e) => setFormField('price', e.target.value)} />
              </div>
              <div>
                <AdminLabel>KDV Oranı (%)</AdminLabel>
                <AdminInput type="number" required min={0} value={form.taxRate} onChange={(e) => setFormField('taxRate', e.target.value)} />
              </div>
              <div>
                <AdminLabel>İndirimli — KDV Hariç (₺)</AdminLabel>
                <AdminInput type="number" min={0} step="0.01" value={form.oldPrice} onChange={(e) => setFormField('oldPrice', e.target.value)} />
              </div>
              <div>
                <AdminLabel>Stok</AdminLabel>
                <AdminInput type="number" required min={0} value={form.stock} onChange={(e) => setFormField('stock', e.target.value)} />
              </div>
            </div>
            {form.price && (
              <p className="text-xs text-aq-blue mt-3 bg-aq-sky px-3 py-2 rounded-lg">
                {siteTaxEnabled ? (
                  <>
                    Müşteri fiyatı (KDV dahil):{' '}
                    <strong>
                      {(Number(form.price) * (1 + (Number(form.taxRate) || 20) / 100)).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </strong>
                  </>
                ) : (
                  <>
                    KDV site genelinde pasif — müşteri fiyatı:{' '}
                    <strong>
                      {Number(form.price).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
                    </strong>
                  </>
                )}
              </p>
            )}
            <label className="flex items-center gap-2 text-sm text-aq-muted mt-4">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setFormField('isActive', e.target.checked)} className="w-4 h-4 accent-aq-deep" />
              Aktif
            </label>
          </AdminCard>

          <AdminCard>
            <h3 className="text-sm font-semibold text-aq-text mb-3">Ürün Görselleri</h3>
            <div className="space-y-3 mb-3">
              {sortedImages.map((img, index) => (
                <div key={img.id} className="flex gap-2 items-center rounded-xl border border-aq-border/60 p-2">
                  <img
                    src={img.url}
                    alt={img.alt_text || form.name}
                    className="w-16 h-16 rounded-lg object-cover bg-aq-ice"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-aq-muted truncate">{img.alt_text || `Görsel #${index + 1}`}</p>
                    {img.sort_order === 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-aq-blue font-medium mt-1">
                        <Star className="w-3 h-3" /> Ana görsel
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" disabled={busy} className="p-1 text-aq-muted hover:text-aq-blue disabled:opacity-40" onClick={() => void moveImage(index, -1)} aria-label="Yukarı">
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" disabled={busy} className="p-1 text-aq-muted hover:text-aq-blue disabled:opacity-40" onClick={() => void moveImage(index, 1)} aria-label="Aşağı">
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {img.sort_order !== 0 && (
                    <button type="button" disabled={busy} className="p-1 text-aq-muted hover:text-aq-blue disabled:opacity-40" onClick={() => void makePrimary(img.id)} aria-label="Ana görsel yap">
                      <Star className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button type="button" disabled={busy} className="p-1 text-aq-muted hover:text-red-500 disabled:opacity-40" onClick={() => void removeImage(img)} aria-label="Sil">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {isNew && pendingFiles.length > 0 && (
              <ul className="mb-3 space-y-1 text-xs text-aq-muted">
                {pendingFiles.map((f) => (
                  <li key={fingerprint(f)} className="truncate">• {f.name}</li>
                ))}
              </ul>
            )}

            <label className="border-2 border-dashed border-aq-border/60 rounded-xl p-6 text-center block cursor-pointer hover:border-aq-blue/40 transition-colors">
              <ImageIcon className="w-8 h-8 text-aq-muted/60 mx-auto mb-2" />
              <p className="text-xs text-aq-muted">
                {uploadingImage
                  ? 'Yükleniyor...'
                  : isNew
                    ? 'Kaydetmeden önce görsel seçebilirsiniz'
                    : 'JPEG / PNG / WebP / GIF · max 5 MB'}
              </p>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="hidden"
                disabled={uploadingImage || saving}
                onChange={(e) => {
                  const files = e.target.files;
                  if (isNew) handlePendingFiles(files);
                  else if (files) {
                    void (async () => {
                      for (const file of Array.from(files)) {
                        await handleImageUpload(file, id!);
                      }
                    })();
                  }
                  e.target.value = '';
                }}
              />
            </label>
          </AdminCard>

          <AdminButton type="submit" disabled={busy} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Kaydet
          </AdminButton>
        </div>
      </form>

      <ConfirmModal
        open={confirmDeleteOpen}
        onCancel={() => {
          if (!deletingProduct) setConfirmDeleteOpen(false);
        }}
        onConfirm={() => {
          if (!deletingProduct) void handleDeleteProduct();
        }}
        title="Ürünü sil"
        description={`“${form.name || 'Bu ürün'}” kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
        confirmLabel={deletingProduct ? 'Siliniyor...' : 'Sil'}
        cancelLabel="Vazgeç"
        variant="danger"
      />
    </AdminPageShell>
  );
}
