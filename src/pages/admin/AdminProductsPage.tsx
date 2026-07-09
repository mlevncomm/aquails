import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { products } from '@/data/products';
import { useToastStore } from '@/components/Toast';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [productList, setProductList] = useState(products);
  const addToast = useToastStore((s) => s.add);

  const filtered = productList.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const cats = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const remove = (id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
    addToast('Ürün silindi.', 'success');
  };

  return (
      <>      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <h2 className="text-lg font-semibold text-[#0D2137]">Ürün Yönetimi</h2>
        <Link to="/admin/urunler/ekle" className="flex items-center gap-2 bg-[#1A73E8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1557B0] transition-all w-fit">
          <Plus className="w-4 h-4" /> Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..." className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] placeholder-[#8B9DAF] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 text-sm bg-white border border-[#D6E3F0] rounded-xl text-[#0D2137] focus:outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/10 appearance-none cursor-pointer min-w-[140px]">
          <option value="all">Tüm Kategoriler</option>
          {cats.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-[#F8FBFF]">
              {['Ürün', 'Kategori', 'Fiyat', 'İndirimli', 'Stok', 'Durum', 'İşlemler'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-[#8B9DAF] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-[#F0F6FF] last:border-0 hover:bg-[#F8FBFF]/50 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden"><img src={p.images?.[0] || '/images/products/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} /></div><span className="text-sm font-medium text-[#0D2137] line-clamp-1 max-w-[180px]">{p.name}</span></div></td>
                  <td className="px-4 py-3 text-sm text-[#5A6B7B]">{p.category}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0D2137]">{p.price.toLocaleString('tr-TR')}₺</td>
                  <td className="px-4 py-3 text-sm text-[#E85454]">{p.oldPrice ? `${p.oldPrice.toLocaleString('tr-TR')}₺` : '-'}</td>
                  <td className="px-4 py-3 text-sm text-[#0D2137]">{p.stock}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.stock <= 5 ? 'low' : 'active'} /></td>
                  <td className="px-4 py-3"><div className="flex gap-1"><Link to={`/admin/urunler/${p.id}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F0F6FF] text-[#8B9DAF] hover:text-[#1A73E8]"><Pencil className="w-3.5 h-3.5" /></Link><button onClick={() => remove(p.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-[#8B9DAF] hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="text-center py-8 text-sm text-[#8B9DAF]">Ürün bulunamadı</div>}
      </div>
      </>
  );
}
