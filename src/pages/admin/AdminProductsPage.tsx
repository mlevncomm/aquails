import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Plus, Pencil } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useCatalog } from '@/hooks/useCatalog';

export default function AdminProductsPage() {
  const { products, categories, loading } = useCatalog();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const cats = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  return (
      <>      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-aq-text">Ürün Yönetimi</h2>
        <Link to="/admin/urunler/ekle" className="flex items-center gap-2 bg-aq-blue text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-aq-deep transition-all w-fit">
          <Plus className="w-4 h-4" /> Yeni Ürün
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-aq-border/60 rounded-xl text-aq-text placeholder-aq-muted focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 text-sm bg-white border border-aq-border/60 rounded-xl text-aq-text focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/30 appearance-none cursor-pointer min-w-[140px]">
          <option value="all">Tüm Kategoriler</option>
          {cats.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-aq-ice">
              {['Ürün', 'Kategori', 'Fiyat', 'İndirimli', 'Stok', 'Durum', 'İşlemler'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-aq-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-aq-muted">Yükleniyor...</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="border-b border-aq-border/60 last:border-0 hover:bg-aq-ice/50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-aq-ice rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"><img src={p.images?.[0] || '/images/products/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} /></div><span className="text-sm font-medium text-aq-text line-clamp-1 max-w-[180px]">{p.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-aq-muted">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-aq-text">{p.price.toLocaleString('tr-TR')}₺</td>
                  <td className="px-4 py-3 text-sm text-[#E85454]">{p.oldPrice ? `${p.oldPrice.toLocaleString('tr-TR')}₺` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-aq-text">{p.stock}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.stock <= 5 ? 'low' : 'active'} /></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Link to={`/admin/urunler/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-aq-ice text-aq-muted hover:text-aq-blue"><Pencil className="w-3.5 h-3.5" /></Link></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && <div className="text-center py-8 text-sm text-aq-muted">Ürün bulunamadı</div>}
        {!loading && products.length > 0 && (
          <div className="px-4 py-3 border-t border-aq-border/60 text-xs text-aq-muted">
            {filtered.length} / {products.length} ürün · {categories.length} kategori
          </div>
        )}
      </div>
      </>
  );
}
