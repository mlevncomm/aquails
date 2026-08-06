import { useState } from 'react';
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { importProductsBatch, getCategoryOptions, type AdminProductForm } from '@/services/productService';
import { useToastStore } from '@/components/Toast';
import { AdminPageShell, AdminPageHeader, AdminCard } from '@/components/admin/admin-ui';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseCsv(text: string, categoryMap: Map<string, string>): AdminProductForm[] {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows: AdminProductForm[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
    const get = (key: string) => cols[headers.indexOf(key)] ?? '';

    const name = get('name') || get('urun') || get('ürün');
    if (!name) continue;

    const catSlug = get('category') || get('kategori') || 'su-aritma';
    const categoryId = categoryMap.get(catSlug) ?? categoryMap.values().next().value ?? '';

    rows.push({
      name,
      slug: get('slug') || slugify(name),
      categoryId,
      sku: get('sku') || undefined,
      shortDescription: get('short_description') || get('kisa') || name.slice(0, 80),
      description: get('description') || get('aciklama') || name,
      price: Number(get('price') || get('fiyat') || 0),
      oldPrice: get('old_price') ? Number(get('old_price')) : null,
      stock: Number(get('stock') || get('stok') || 10),
      isActive: get('active') !== 'false',
      specifications: {},
    });
  }
  return rows;
}

export default function AdminProductImportPage() {
  const addToast = useToastStore((s) => s.add);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  const handleFile = async (file: File) => {
    setImporting(true);
    setResult(null);
    const text = await file.text();
    const categories = await getCategoryOptions();
    const catMap = new Map(categories.map((c) => [c.slug, c.id]));
    const rows = parseCsv(text, catMap);

    if (!rows.length) {
      addToast('CSV dosyasında geçerli satır bulunamadı.', 'error');
      setImporting(false);
      return;
    }

    const res = await importProductsBatch(rows);
    setResult({ imported: res.imported, errors: res.errors });
    addToast(`${res.imported} ürün yüklendi.`, res.errors.length ? 'error' : 'success');
    setImporting(false);
  };

  return (
    <AdminPageShell>
      <AdminPageHeader title="Ürün Yükleme" description="CSV dosyası ile toplu ürün import" />

      <AdminCard className="max-w-2xl mb-6">
        <h3 className="text-sm font-semibold text-aq-text mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-aq-blue" />CSV Format
        </h3>
        <pre className="text-xs bg-aq-ice p-4 rounded-xl overflow-x-auto text-aq-muted">
{`name,slug,category,price,stock,sku,description
Aquails Pro, aquails-pro, su-aritma, 85900, 10, AQ-001, Açıklama...`}
        </pre>
        <p className="text-xs text-aq-muted mt-2">category = kategori slug (su-aritma, filtre, vb.)</p>
      </AdminCard>

      <AdminCard className="max-w-2xl">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-aq-border/60 rounded-xl p-10 cursor-pointer hover:border-aq-blue transition-colors">
          {importing ? (
            <Loader2 className="w-8 h-8 animate-spin text-aq-blue" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-aq-muted mb-3" />
              <span className="text-sm font-medium text-aq-muted">CSV dosyası seçin veya sürükleyin</span>
              <span className="text-xs text-aq-muted mt-1">.csv formatında</span>
            </>
          )}
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            disabled={importing}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        </label>

        {result && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-emerald-600 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />{result.imported} ürün başarıyla yüklendi
            </p>
            {result.errors.slice(0, 5).map((err) => (
              <p key={err} className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{err}</p>
            ))}
          </div>
        )}
      </AdminCard>
    </AdminPageShell>
  );
}
