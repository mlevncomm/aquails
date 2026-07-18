import { useEffect, useState } from 'react';
import { Percent, Loader2 } from 'lucide-react';
import { bulkUpdateProductPrices, getCategoryOptions } from '@/services/productService';
import { useToastStore } from '@/components/Toast';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminCard,
  AdminLabel,
  AdminButton,
  AdminInput,
  AdminSelect,
} from '@/components/admin/admin-ui';

export default function AdminBulkPricePage() {
  const addToast = useToastStore((s) => s.add);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [categorySlug, setCategorySlug] = useState('');
  const [mode, setMode] = useState<'percent' | 'fixed_add' | 'set_tax'>('percent');
  const [value, setValue] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void getCategoryOptions().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await bulkUpdateProductPrices(categorySlug, mode, value);
    setSaving(false);
    if (!res.success) {
      addToast(res.error ?? 'Güncelleme başarısız.', 'error');
      return;
    }
    addToast(`${res.count ?? 0} ürün güncellendi.`, 'success');
  };

  return (
    <AdminPageShell>
      <AdminPageHeader title="Toplu Fiyat Güncelleme" description="Kategori bazlı fiyat veya KDV oranı güncelleme" />

      <form onSubmit={(e) => void handleSubmit(e)}>
        <AdminCard className="max-w-xl">
          <div className="space-y-4">
            <div>
              <AdminLabel>Kategori (boş = tümü)</AdminLabel>
              <AdminSelect value={categorySlug} onChange={(e) => setCategorySlug(e.target.value)}>
                <option value="">Tüm Kategoriler</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </AdminSelect>
            </div>
            <div>
              <AdminLabel>İşlem Türü</AdminLabel>
              <AdminSelect
                value={mode}
                onChange={(e) => setMode(e.target.value as typeof mode)}
              >
                <option value="percent">Yüzde değiştir (+/- %)</option>
                <option value="fixed_add">Sabit tutar ekle (₺)</option>
                <option value="set_tax">KDV oranı ata (%)</option>
              </AdminSelect>
            </div>
            <div>
              <AdminLabel>Değer {mode === 'percent' ? '(%)' : mode === 'set_tax' ? '(KDV %)' : '(₺)'}</AdminLabel>
              <AdminInput type="number" step="0.01" value={value} onChange={(e) => setValue(Number(e.target.value))} />
              {mode === 'percent' && <p className="text-xs text-aq-muted mt-1">Örn: 10 = %10 artış, -5 = %5 indirim</p>}
            </div>
            <AdminButton type="submit" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Percent className="w-4 h-4" />}
              Toplu Güncelle
            </AdminButton>
          </div>
        </AdminCard>
      </form>
    </AdminPageShell>
  );
}
