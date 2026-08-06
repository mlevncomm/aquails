import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/layouts/PageLayout';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { useCatalog } from '@/hooks/useCatalog';
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
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { products, categories, loading } = useCatalog();
  const [sort, setSort] = useState('default');
  const [catFilter, setCatFilter] = useState('all');
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 150000), [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([0, Math.max(...products.map((p) => p.price))]);
    }
  }, [products]);

  const cats = useMemo(
    () => ['all', ...categories.map((c) => c.name)],
    [categories],
  );

  const filtered = useMemo(() => {
    let res = products.filter((p) => {
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());
      const matchCat = catFilter === 'all' || p.category === catFilter;
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchQ && matchCat && matchPrice;
    });
    switch (sort) {
      case 'price-asc':
        res = [...res].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        res = [...res].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        res = [...res].sort((a, b) => b.rating - a.rating);
        break;
      case 'bestseller':
        res = [...res].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
    return res;
  }, [products, query, sort, catFilter, priceRange, categories]);

  const activeFilters = [
    ...(catFilter !== 'all' ? [{ label: catFilter, onRemove: () => setCatFilter('all') }] : []),
    ...(priceRange[0] > 0 || priceRange[1] < maxPrice
      ? [{
          label: `${priceRange[0].toLocaleString('tr-TR')}₺ - ${priceRange[1].toLocaleString('tr-TR')}₺`,
          onRemove: () => setPriceRange([0, maxPrice]),
        }]
      : []),
  ];

  return (
    <PageLayout>
      <div className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/50 border-b border-aq-border/60">
        <div className="page-container py-10 md:py-12">
          <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-2">
            <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-aq-text">Arama</span>
          </div>
          <h1 className="text-xl md:text-2xl lg:text-[1.75rem] font-bold text-aq-text">
            {query ? `"${query}" arama sonuçları` : 'Tüm Ürünler'}
          </h1>
          <p className="text-sm text-aq-muted mt-1.5">{filtered.length} ürün bulundu</p>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className={cn(
            'lg:w-[240px] flex-shrink-0',
            showFilters ? 'fixed inset-0 z-50 bg-white p-5 overflow-y-auto lg:static lg:p-0 lg:bg-transparent' : 'hidden lg:block',
          )}>
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h3 className="font-semibold text-aq-text">Filtreler</h3>
              <button type="button" onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-white border border-aq-border/60 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h4 className="text-sm font-semibold text-aq-text mb-2">Kategori</h4>
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/20 bg-white"
                >
                  {cats.map((c) => (
                    <option key={c} value={c}>{c === 'all' ? 'Tümü' : c}</option>
                  ))}
                </select>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-aq-text mb-2">Fiyat Aralığı</h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue bg-white"
                  />
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue bg-white"
                  />
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-aq-border/60 rounded-full text-sm text-aq-muted hover:border-aq-blue hover:text-aq-blue transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filtrele
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <ArrowUpDown className="w-4 h-4 text-aq-muted" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3.5 py-2 text-sm border border-aq-border/60 rounded-full focus:outline-none focus:border-aq-blue bg-white"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {activeFilters.map((f) => (
                  <span key={f.label} className="inline-flex items-center gap-1 bg-aq-sky text-aq-blue text-xs px-3 py-1.5 rounded-full border border-aq-blue/15">
                    {f.label}
                    <button type="button" onClick={f.onRemove}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filtered.length === 0 ? (
              <EmptyState
                icon={<Search className="w-8 h-8 text-aq-muted" />}
                title="Sonuç bulunamadı"
                description={query ? `"${query}" için ürün bulunamadı.` : 'Filtreleri değiştirmeyi deneyin.'}
                action={{ label: 'Tüm Ürünleri Gör', href: '/urunler' }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
