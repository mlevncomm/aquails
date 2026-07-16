import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/layouts/PageLayout';
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/Skeleton';
import { EmptyState } from '@/components/EmptyState';
import { useCatalog } from '@/hooks/useCatalog';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';

const PAGE_SIZE = 12;

const brands = ['Aquails'];
const stockOptions = [
  { label: 'Tümü', value: 'all' },
  { label: 'Stokta Var', value: 'in' },
  { label: 'Stok Az', value: 'low' },
  { label: 'Tükendi', value: 'out' },
];
const sortOptions = [
  { label: 'Önerilen', value: 'default' },
  { label: 'Fiyat (Düşük → Yüksek)', value: 'price-asc' },
  { label: 'Fiyat (Yüksek → Düşük)', value: 'price-desc' },
  { label: 'En Yeniler', value: 'newest' },
  { label: 'En Çok Satanlar', value: 'bestseller' },
  { label: 'En Çok Değerlendirilen', value: 'rated' },
];

export default function Shop() {
  const { products, categories, loading, error } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryId = searchParams.get('kategori');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const maxPrice = useMemo(() => Math.max(...products.map((p) => p.price), 150000), [products]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (products.length > 0) {
      const max = Math.max(...products.map((p) => p.price));
      setPriceRange([0, max]);
    }
  }, [products]);

  useEffect(() => {
    if (urlCategoryId) {
      setSelectedCategories([urlCategoryId]);
    } else {
      setSelectedCategories([]);
    }
    setCurrentPage(1);
  }, [urlCategoryId]);

  const activeCategory = urlCategoryId ? categories.find((c) => c.id === urlCategoryId) : null;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.categorySlug));
    }

    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.some((b) => p.name.includes(b)));
    }

    if (stockStatus === 'in') result = result.filter((p) => p.stock > 10);
    else if (stockStatus === 'low') result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    else if (stockStatus === 'out') result = result.filter((p) => p.stock === 0);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'bestseller':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'newest':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [products, selectedCategories, priceRange, selectedBrands, stockStatus, sortBy, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, selectedBrands, stockStatus, sortBy, searchQuery]);

  const syncCategoryUrl = useCallback((cats: string[]) => {
    if (cats.length === 1) {
      setSearchParams({ kategori: cats[0] });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat];
      syncCategoryUrl(next);
      return next;
    });
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSelectedBrands([]);
    setStockStatus('all');
    setSearchQuery('');
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[1] < maxPrice ||
    selectedBrands.length > 0 ||
    stockStatus !== 'all' ||
    !!searchQuery;

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-aq-text pb-3 border-b border-aq-border/60">Kategoriler</h4>
        <div className="mt-3 space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div
                  onClick={() => toggleCategory(cat.id)}
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-all',
                    selectedCategories.includes(cat.id)
                      ? 'bg-aq-blue border-aq-blue'
                      : 'border-aq-border/60 group-hover:border-aq-blue',
                  )}
                >
                  {selectedCategories.includes(cat.id) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-aq-muted group-hover:text-aq-text transition-colors">{cat.name}</span>
              </div>
              <span className="text-xs text-aq-muted">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-aq-text pb-3 border-b border-aq-border/60">Fiyat Aralığı</h4>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/20 bg-white"
            placeholder="Min"
          />
          <span className="text-aq-muted">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full px-3 py-2 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/20 bg-white"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-aq-text pb-3 border-b border-aq-border/60">Marka / Seri</h4>
        <div className="mt-3 space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleBrand(brand)}
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  selectedBrands.includes(brand)
                    ? 'bg-aq-blue border-aq-blue'
                    : 'border-aq-border/60 group-hover:border-aq-blue',
                )}
              >
                {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-aq-muted">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-aq-text pb-3 border-b border-aq-border/60">Stok Durumu</h4>
        <div className="mt-3 space-y-2">
          {stockOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setStockStatus(opt.value)}
                className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                  stockStatus === opt.value ? 'border-aq-blue' : 'border-aq-border/60',
                )}
              >
                {stockStatus === opt.value && <div className="w-2 h-2 bg-aq-blue rounded-full" />}
              </div>
              <span className="text-sm text-aq-muted">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={clearFilters}
        className="w-full py-2.5 text-sm font-semibold text-aq-blue border border-aq-blue/40 rounded-xl hover:bg-aq-blue hover:text-white transition-all"
      >
        Filtreleri Temizle
      </button>
    </div>
  );

  return (
    <>
      <SEO
        title="Aquails Ürünleri | Su Arıtma Cihazları ve Filtreler"
        description="Aquails su arıtma cihazları, filtre setleri, tezgah altı sistemler ve endüstriyel arıtma çözümleri. Ücretsiz kurulum ve 2 yıl garanti."
        canonical="/urunler"
      />
      <PageLayout>
        {/* Hero */}
        <div className="relative bg-white py-12 md:py-16 overflow-hidden border-b border-aq-border/50">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-aq-sky/40 rounded-full blur-3xl pointer-events-none" />
          <div className="page-container relative">
            <nav className="text-[13px] text-aq-muted mb-4">
              <Link to="/" className="text-aq-blue hover:underline">Ana Sayfa</Link>
              <span className="mx-2">/</span>
              <Link to="/urunler" className="text-aq-blue hover:underline">Ürünler</Link>
              {activeCategory && (
                <>
                  <span className="mx-2">/</span>
                  <span className="text-aq-text">{activeCategory.name}</span>
                </>
              )}
            </nav>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-5">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-[2.1rem] font-bold text-aq-text tracking-tight">
                  {activeCategory ? activeCategory.name : 'Aquails Ürünleri'}
                </h1>
                <p className="text-sm text-aq-muted mt-2 max-w-xl leading-relaxed">
                  {activeCategory
                    ? `${activeCategory.productCount} ürün — ihtiyacınıza uygun su arıtma çözümlerini keşfedin.`
                    : 'Eviniz ve işletmeniz için premium su arıtma çözümleri.'}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[13px] text-aq-muted font-medium">
                  {filteredProducts.length} ürün bulundu
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2 text-sm border border-aq-border/60 rounded-full bg-white focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/20"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="hidden md:flex border border-aq-border/60 rounded-full overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setGridView(true)}
                    aria-label="Izgara görünümü"
                    className={cn('p-2.5 transition-colors', gridView ? 'bg-aq-deep text-white' : 'text-aq-muted hover:bg-aq-ice')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridView(false)}
                    aria-label="Liste görünümü"
                    className={cn('p-2.5 transition-colors', !gridView ? 'bg-aq-deep text-white' : 'text-aq-muted hover:bg-aq-ice')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchParams({});
                }}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
                  selectedCategories.length === 0
                    ? 'bg-aq-deep text-white border-aq-deep'
                    : 'bg-white text-aq-muted border-aq-border/60 hover:border-aq-blue hover:text-aq-blue',
                )}
              >
                Tümü
              </button>
              {categories.map((cat) => {
                const active = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border',
                      active
                        ? 'bg-aq-sky text-aq-blue border-aq-blue/30'
                        : 'bg-white text-aq-muted border-aq-border/60 hover:border-aq-blue hover:text-aq-blue',
                    )}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="page-container py-10 md:py-12">
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün, kategori veya model ara..."
              className="w-full pl-11 pr-4 py-3.5 border border-aq-border/60 rounded-2xl text-sm focus:outline-none focus:border-aq-blue focus:ring-2 focus:ring-aq-aqua/20 bg-white shadow-sm"
            />
          </div>

          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden fixed bottom-6 left-6 z-40 bg-aq-blue text-white p-4 rounded-full shadow-sm shadow-aq-deep/15"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <aside className="hidden lg:block w-[280px] flex-shrink-0">
              <div className="bg-white border border-aq-border/60 rounded-2xl p-6 sticky top-24 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-aq-text">Filtrele</h3>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearFilters} className="text-xs text-[#E85454] hover:underline">
                      Temizle
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            <AnimatePresence>
              {mobileFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-aq-deep/40 z-40 lg:hidden"
                    onClick={() => setMobileFilterOpen(false)}
                  />
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed top-0 left-0 bottom-0 w-[320px] bg-white z-50 lg:hidden overflow-y-auto p-6"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-aq-text">Filtrele</h3>
                      <button type="button" onClick={() => setMobileFilterOpen(false)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <FilterContent />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <div className="flex-1 min-w-0">
              {(selectedCategories.length > 0 || urlCategoryId) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedCategories.map((catSlug) => {
                    const cat = categories.find((c) => c.id === catSlug);
                    return (
                      <span
                        key={catSlug}
                        className="inline-flex items-center gap-1.5 bg-aq-sky text-aq-blue text-xs font-medium px-3 py-1.5 rounded-full border border-aq-blue/15"
                      >
                        {cat?.name ?? catSlug}
                        <button type="button" onClick={() => toggleCategory(catSlug)} className="hover:text-[#E85454]">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              {loading ? (
                <ProductGridSkeleton count={6} />
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-lg font-semibold text-aq-muted">{error}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <EmptyState
                  icon={<Search className="w-8 h-8" />}
                  title="Ürün bulunamadı"
                  description="Arama veya filtre kriterlerinize uygun ürün yok. Filtreleri temizleyip tekrar deneyin."
                  actionNode={
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="inline-flex items-center gap-2 bg-aq-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all"
                    >
                      Filtreleri Temizle
                    </button>
                  }
                />
              ) : (
                <StaggerContainer
                  className={cn(
                    'grid gap-5',
                    gridView ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-2xl',
                  )}
                  staggerDelay={0.06}
                >
                  {paginatedProducts.map((product) => (
                    <StaggerItem key={product.id}>
                      <ProductCard product={product} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}

              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-aq-border/60 text-aq-muted hover:bg-aq-ice transition-colors disabled:opacity-40"
                  >
                    <span className="text-sm">&lsaquo;</span>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-colors',
                        page === currentPage
                          ? 'bg-aq-deep text-white shadow-sm'
                          : 'border border-aq-border/60 text-aq-muted hover:bg-aq-ice',
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-aq-border/60 text-aq-muted hover:bg-aq-ice transition-colors disabled:opacity-40"
                  >
                    <span className="text-sm">&rsaquo;</span>
                  </button>
                  <span className="text-[13px] text-aq-muted ml-2 sm:ml-4">
                    {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
                    {Math.min(currentPage * PAGE_SIZE, filteredProducts.length)} / {filteredProducts.length} ürün
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
