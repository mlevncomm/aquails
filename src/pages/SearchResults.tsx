import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { searchProducts } from '@/services/productService';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

const sortOptions = [
  { label: 'Önerilen', value: 'default' },
  { label: 'En Yeni', value: 'newest' },
  { label: 'Fiyat: Düşükten Yükseğe', value: 'price-asc' },
  { label: 'Fiyat: Yüksekten Düşüğe', value: 'price-desc' },
  { label: 'En Çok Satan', value: 'bestseller' },
  { label: 'En Yüksek Puan', value: 'rating' },
];

export default function SearchResults() {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState('default');
  const [catFilter, setCatFilter] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    searchProducts(query)
      .then((items) => {
        if (!cancelled) setProducts(items);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [query]);

  const cats = useMemo(() => ['all', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filtered = useMemo(() => {
    let res = products.filter(p => {
      const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchCat = catFilter === 'all' || p.category === catFilter;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchQ && matchCat && matchPrice;
    });
    switch (sort) {
      case 'price-asc': res = [...res].sort((a, b) => a.price - b.price); break;
      case 'price-desc': res = [...res].sort((a, b) => b.price - a.price); break;
      case 'rating': res = [...res].sort((a, b) => b.rating - a.rating); break;
      case 'bestseller': res = [...res].sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: break;
    }
    return res;
  }, [products, query, sort, catFilter, priceRange]);

  const handleSort = (val: string) => {
    setSort(val);
  };

  const activeFilters = [
    ...(catFilter !== 'all' ? [{ label: catFilter, onRemove: () => setCatFilter('all') }] : []),
    ...(priceRange[0] > 0 || priceRange[1] < 50000 ? [{ label: `${priceRange[0].toLocaleString('tr-TR')}₺ - ${priceRange[1].toLocaleString('tr-TR')}₺`, onRemove: () => setPriceRange([0, 50000]) }] : []),
  ];

  return (
    <PageLayout>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Breadcrumb + Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[13px] text-[#8B9DAF] mb-2">
            <Link to="/" className="hover:text-[#1A73E8]">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-[#5A6B7B]">Arama</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-[#0D2137]">
            {query ? `"${query}" arama sonuçları` : 'Tüm Ürünler'}
          </h1>
          <p className="text-sm text-[#8B9DAF] mt-1">{filtered.length} ürün bulundu</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters - Desktop Sidebar / Mobile Drawer */}
          <aside className={cn(
            'lg:w-[240px] flex-shrink-0',
            showFilters ? 'fixed inset-0 z-50 bg-white p-5 overflow-y-auto lg:static lg:p-0 lg:bg-transparent' : 'hidden lg:block'
          )}>
            {showFilters && (
              <div className="flex items-center justify-between mb-5 lg:hidden">
                <h3 className="text-lg font-bold text-[#0D2137]">Filtreler</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-[#F0F6FF] rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#0D2137] mb-3">Kategori</h4>
              <div className="space-y-1.5">
                {cats.map(c => (
                  <button
                    key={c}
                    onClick={() => setCatFilter(c)}
                    className={cn(
                      'block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                      catFilter === c ? 'bg-[#F0F6FF] text-[#1A73E8] font-medium' : 'text-[#5A6B7B] hover:bg-[#F8FBFF]'
                    )}
                  >
                    {c === 'all' ? 'Tümü' : c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#0D2137] mb-3">Fiyat Aralığı</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF]"
                  placeholder="Min"
                />
                <span className="text-[#8B9DAF]">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full px-3 py-2 text-sm border border-[#D6E3F0] rounded-lg bg-[#F8FBFF]"
                  placeholder="Max"
                />
              </div>
            </div>

            {showFilters && (
              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-[#1A73E8] text-white py-3 rounded-full font-semibold text-sm lg:hidden"
              >
                Sonuçları Göster ({filtered.length})
              </button>
            )}
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#D6E3F0] rounded-xl text-sm font-medium text-[#5A6B7B]"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filtrele
              </button>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#8B9DAF]" />
                <select
                  value={sort}
                  onChange={e => handleSort(e.target.value)}
                  className="text-sm border border-[#D6E3F0] rounded-xl px-3 py-2 bg-white text-[#0D2137] focus:outline-none focus:border-[#1A73E8]"
                >
                  {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-[#F0F6FF] text-[#1A73E8] text-xs font-medium px-3 py-1.5 rounded-full">
                    {f.label}
                    <button onClick={f.onRemove}><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <button onClick={() => { setCatFilter('all'); setPriceRange([0, 50000]); }} className="text-xs text-[#E85454] font-medium hover:underline">
                  Tümünü Temizle
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : filtered.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </motion.div>
            ) : (
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="Sonuç Bulunamadı"
                description="Arama kriterlerinize uygun ürün bulunamadı. Farklı bir arama terimi deneyin."
                action={{ label: 'Tüm Ürünleri Gör', href: '/urunler' }}
              />
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
