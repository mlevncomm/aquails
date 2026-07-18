import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Plus, Pencil, Package } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCatalog } from '@/hooks/useCatalog';
import {
  AdminPageShell,
  AdminPageHeader,
  AdminFilterBar,
  AdminInput,
  AdminSelect,
  AdminButton,
  AdminLoading,
  AdminEmpty,
  AdminTableWrap,
  AdminDesktopOnly,
  AdminMobileCardList,
  AdminCard,
} from '@/components/admin/admin-ui';

export default function AdminProductsPage() {
  const { products, categories, loading } = useCatalog();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const cats = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <AdminPageShell>
      <AdminPageHeader
        title="Ürün Yönetimi"
        description="Katalog ürünlerini arayın, filtreleyin ve düzenleyin."
        action={
          <Link to="/admin/urunler/ekle">
            <AdminButton>
              <Plus className="w-4 h-4" /> Yeni Ürün
            </AdminButton>
          </Link>
        }
      />

      <AdminFilterBar>
        <div className="relative flex-1 min-w-0 sm:min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted pointer-events-none" />
          <AdminInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="pl-9"
          />
        </div>
        <AdminSelect
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="sm:w-[180px]"
        >
          <option value="all">Tüm Kategoriler</option>
          {cats
            .filter((c) => c !== 'all')
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </AdminSelect>
      </AdminFilterBar>

      {loading ? (
        <AdminLoading label="Ürünler yükleniyor..." />
      ) : filtered.length === 0 ? (
        <AdminCard padding={false}>
          <AdminEmpty
            icon={Package}
            title="Ürün bulunamadı"
            message="Arama veya kategori filtresine uygun ürün yok."
            action={
              <Link to="/admin/urunler/ekle">
                <AdminButton>
                  <Plus className="w-4 h-4" /> Yeni Ürün Ekle
                </AdminButton>
              </Link>
            }
          />
        </AdminCard>
      ) : (
        <>
          <AdminMobileCardList>
            {filtered.map((p) => (
              <AdminCard key={p.id} className="!p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 rounded-xl bg-aq-ice overflow-hidden flex-shrink-0">
                    <img
                      src={p.images?.[0] || '/images/products/placeholder.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-aq-text line-clamp-2">{p.name}</p>
                    <p className="text-[11px] text-aq-muted mt-0.5">{p.category}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <p className="text-sm font-bold text-aq-text">{p.price.toLocaleString('tr-TR')}₺</p>
                      <StatusBadge status={p.stock <= 5 ? 'low' : 'active'} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-aq-border/50">
                  <p className="text-xs text-aq-muted">Stok: {p.stock}</p>
                  <Link to={`/admin/urunler/${p.id}`}>
                    <AdminButton variant="secondary" className="!px-3 !py-2">
                      <Pencil className="w-3.5 h-3.5" /> Düzenle
                    </AdminButton>
                  </Link>
                </div>
              </AdminCard>
            ))}
          </AdminMobileCardList>

          <AdminDesktopOnly>
            <AdminTableWrap stickyFirst>
              <table className="w-full">
                <thead>
                  <tr className="bg-aq-ice">
                    {['Ürün', 'Kategori', 'Fiyat', 'İndirimli', 'Stok', 'Durum', 'İşlemler'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-aq-ice rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img
                              src={p.images?.[0] || '/images/products/placeholder.jpg'}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium text-aq-text line-clamp-1 max-w-[220px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-aq-muted">{p.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-aq-text whitespace-nowrap">
                        {p.price.toLocaleString('tr-TR')}₺
                      </td>
                      <td className="px-4 py-3 text-sm text-[#E85454] whitespace-nowrap">
                        {p.oldPrice ? `${p.oldPrice.toLocaleString('tr-TR')}₺` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-aq-text">{p.stock}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.stock <= 5 ? 'low' : 'active'} />
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/urunler/${p.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue"
                          aria-label="Ürünü düzenle"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length > 0 && (
                <div className="px-4 py-3 border-t border-aq-border/60 text-xs text-aq-muted">
                  {filtered.length} / {products.length} ürün · {categories.length} kategori
                </div>
              )}
            </AdminTableWrap>
          </AdminDesktopOnly>
        </>
      )}
    </AdminPageShell>
  );
}
