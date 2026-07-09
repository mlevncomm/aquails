import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, LayoutGrid, List, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/layouts/PageLayout';
import { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { products, categories } from '@/data';
import { cn } from '@/lib/utils';
import { SEO } from '@/components/SEO';


const brands = ['Aquails', 'PurePro', 'Compact', 'Business', 'Mineral Plus'];
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
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategoryId = searchParams.get('kategori');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [stockStatus, setStockStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [gridView, setGridView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync URL category param with filter state
  useEffect(() => {
    if (urlCategoryId) {
      const cat = categories.find(c => c.id === urlCategoryId);
      if (cat && !selectedCategories.includes(cat.name)) {
        setSelectedCategories([cat.name]);
      }
    } else if (selectedCategories.length > 0 && !urlCategoryId) {
      // Clear if URL has no category but state does (on direct nav to /urunler)
      // Only clear if we just arrived (check if it was set from URL)
    }
  }, [urlCategoryId]);

  // Get active category info for display
  const activeCategory = urlCategoryId ? categories.find(c => c.id === urlCategoryId) : null;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.some((b) => p.name.includes(b)));
    }

    // Stock filter
    if (stockStatus === 'in') result = result.filter((p) => p.stock > 10);
    else if (stockStatus === 'low') result = result.filter((p) => p.stock > 0 && p.stock <= 10);
    else if (stockStatus === 'out') result = result.filter((p) => p.stock === 0);

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Sort
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
    }

    return result;
  }, [selectedCategories, priceRange, selectedBrands, stockStatus, sortBy, searchQuery]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50000]);
    setSelectedBrands([]);
    setStockStatus('all');
    setSearchQuery('');
    if (urlCategoryId) {
      setSearchParams({});
    }
  };

  const hasActiveFilters = selectedCategories.length > 0 || priceRange[1] < 50000 || selectedBrands.length > 0 || stockStatus !== 'all' || !!urlCategoryId;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-semibold text-aqua-secondary pb-3 border-b border-aqua-bg">Kategoriler</h4>
        <div className="mt-3 space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div
                  onClick={() => toggleCategory(cat.name)}
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-all',
                    selectedCategories.includes(cat.name)
                      ? 'bg-aqua-primary border-aqua-primary'
                      : 'border-aqua-border group-hover:border-aqua-primary'
                  )}
                >
                  {selectedCategories.includes(cat.name) && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-aqua-text-secondary">{cat.name}</span>
              </div>
              <span className="text-xs text-aqua-text-muted">({cat.productCount})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-semibold text-aqua-secondary pb-3 border-b border-aqua-bg">Fiyat Aralığı</h4>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full px-3 py-2 text-sm border border-aqua-border rounded-lg focus:outline-none focus:border-aqua-primary"
            placeholder="Min"
          />
          <span className="text-aqua-text-muted">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full px-3 py-2 text-sm border border-aqua-border rounded-lg focus:outline-none focus:border-aqua-primary"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Brands */}
      <div>
        <h4 className="text-sm font-semibold text-aqua-secondary pb-3 border-b border-aqua-bg">Marka / Seri</h4>
        <div className="mt-3 space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleBrand(brand)}
                className={cn(
                  'w-4 h-4 rounded border flex items-center justify-center transition-all',
                  selectedBrands.includes(brand)
                    ? 'bg-aqua-primary border-aqua-primary'
                    : 'border-aqua-border group-hover:border-aqua-primary'
                )}
              >
                {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-aqua-text-secondary">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Status */}
      <div>
        <h4 className="text-sm font-semibold text-aqua-secondary pb-3 border-b border-aqua-bg">Stok Durumu</h4>
        <div className="mt-3 space-y-2">
          {stockOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => setStockStatus(opt.value)}
                className={cn(
                  'w-4 h-4 rounded-full border flex items-center justify-center transition-all',
                  stockStatus === opt.value ? 'border-aqua-primary' : 'border-aqua-border'
                )}
              >
                {stockStatus === opt.value && <div className="w-2 h-2 bg-aqua-primary rounded-full" />}
              </div>
              <span className="text-sm text-aqua-text-secondary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2.5 text-sm font-medium text-aqua-primary border border-aqua-primary rounded-full hover:bg-aqua-primary hover:text-white transition-all"
      >
        Filtreleri Temizle
      </button>
    </div>
  );

  const categoryHero: Record<string, { title: string; desc: string }> = {
    'su-aritma-cihazlari': { title: 'Su Arıtma Cihazları', desc: 'Eviniz ve iş yeriniz için yüksek performanslı, uzun ömürlü Aquails su arıtma çözümlerini keşfedin.' },
    'direkt-akis-su-aritma': { title: 'Direkt Akış Su Arıtma', desc: 'Tanksız modern sistemlerle anında temiz su. En yeni teknoloji direkt akış cihazları.' },
    'filtreler': { title: 'Filtreler', desc: 'Cihazınızın performansını koruyan, düzenli değişim için uygun Aquails filtre çözümleri.' },
    'sebiller': { title: 'Sebiller', desc: 'Sıcak ve soğuk su seçenekli modern sebil modelleri.' },
    'aksesuarlar': { title: 'Aksesuarlar', desc: 'Su arıtma sistemlerinizi tamamlayıcı aksesuarlar ve yedek parçalar.' },
  };
  const heroInfo = urlCategoryId && categoryHero[urlCategoryId] ? categoryHero[urlCategoryId] : null;

  return (
    <>
      <SEO
        title="Aquails Ürünleri | Su Arıtma Cihazları ve Filtreler"
        description="Aquails su arıtma cihazları, filtre setleri, tezgah altı sistemler ve endüstriyel arıtma çözümleri. Ücretsiz kurulum ve 2 yıl garanti."
        canonical="/urunler"
      />
    <PageLayout>
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E8F4FF] py-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1A73E8]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4FC3F7]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 relative">
          <nav className="text-[13px] text-aqua-text-muted mb-2">
            <Link to="/" className="text-aqua-primary hover:underline">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link to="/urunler" className="text-aqua-primary hover:underline">Ürünler</Link>
            {activeCategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-aqua-text-secondary">{activeCategory.name}</span>
              </>
            )}
          </nav>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-aqua-secondary">
                {heroInfo ? heroInfo.title : activeCategory ? activeCategory.name : 'Aquails Ürünleri'}
              </h1>
              {heroInfo ? (
                <p className="text-sm text-aqua-text-muted mt-2 max-w-lg leading-relaxed">{heroInfo.desc}</p>
              ) : activeCategory ? (
                <p className="text-sm text-aqua-text-muted mt-1">{activeCategory.productCount} ürün</p>
              ) : (
                <p className="text-sm text-aqua-text-muted mt-2 max-w-lg leading-relaxed">Su arıtma cihazları, filtre setleri, aksesuarlar ve servis çözümlerini tek yerden keşfedin.</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-aqua-text-muted">{filteredProducts.length} ürün bulundu</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-aqua-border rounded-lg bg-white focus:outline-none focus:border-aqua-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="hidden md:flex border border-aqua-border rounded-lg overflow-hidden">
                <button onClick={() => setGridView(true)} className={cn('p-2', gridView ? 'bg-aqua-primary text-white' : 'text-aqua-text-secondary hover:bg-aqua-bg')}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setGridView(false)} className={cn('p-2', !gridView ? 'bg-aqua-primary text-white' : 'text-aqua-text-secondary hover:bg-aqua-bg')}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aqua-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full pl-11 pr-4 py-3 border border-aqua-border rounded-xl text-sm focus:outline-none focus:border-aqua-primary focus:ring-2 focus:ring-aqua-primary/10 bg-white"
          />
        </div>

        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden fixed bottom-6 left-6 z-40 bg-aqua-primary text-white p-4 rounded-full shadow-lg"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="bg-white border border-aqua-border-light rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-aqua-secondary">Filtrele</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-aqua-danger hover:underline">Temizle</button>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
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
                    <h3 className="font-semibold text-aqua-secondary">Filtrele</h3>
                    <button onClick={() => setMobileFilterOpen(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Active filter chips */}
            {(selectedCategories.length > 0 || urlCategoryId) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center gap-1.5 bg-aqua-primary/10 text-aqua-primary text-xs font-medium px-3 py-1.5 rounded-full">
                    {cat}
                    <button onClick={() => { toggleCategory(cat); if (urlCategoryId) setSearchParams({}); }} className="hover:text-aqua-danger"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-aqua-border mx-auto mb-4" />
                <p className="text-lg font-semibold text-aqua-text-muted">Ürün bulunamadı</p>
                <p className="text-sm text-aqua-text-muted mt-1">Farklı filtreler deneyin</p>
                <button onClick={clearFilters} className="mt-4 text-aqua-primary hover:underline">Filtreleri Temizle</button>
              </div>
            ) : (
              <StaggerContainer
                className={cn(
                  'grid gap-5',
                  gridView
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
                staggerDelay={0.06}
              >
                {filteredProducts.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-aqua-border text-aqua-text-secondary hover:bg-aqua-bg transition-colors">
                  <span className="text-sm">&lsaquo;</span>
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={cn(
                      'w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
                      page === 1
                        ? 'bg-aqua-primary text-white border border-aqua-primary'
                        : 'border border-aqua-border text-aqua-text-secondary hover:bg-aqua-bg'
                    )}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-aqua-border text-aqua-text-secondary hover:bg-aqua-bg transition-colors">
                  <span className="text-sm">&rsaquo;</span>
                </button>
                <span className="text-[13px] text-aqua-text-muted ml-4">
                  1 - {filteredProducts.length} / {filteredProducts.length} ürün
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
