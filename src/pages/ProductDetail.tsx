import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingCart, Zap, Check, ChevronRight,
  Shield, Truck, Wrench, ThumbsUp,
  MessageCircle, Bell, Mail, Phone, Send, AlertCircle, HelpCircle, Loader2
} from 'lucide-react';
import { openWhatsApp, getProductInquiryMessage } from '@/services/whatsappService';
import { subscribeStockAlert, getStockNotifications } from '@/services/stockNotificationService';
import { useToastStore } from '@/components/Toast';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { RatingStars } from '@/components/RatingStars';
import { QuantitySelector } from '@/components/QuantitySelector';
import { SEO } from '@/components/SEO';
import { getProductSchema, getBreadcrumbSchema } from '@/components/SchemaOrg';
import { useProduct } from '@/hooks/useCatalog';
import { askQuestion, getPublicQuestionsForProduct } from '@/services/productQuestionService';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { ProductPrice } from '@/components/ProductPrice';
import { getProductGrossPrice } from '@/lib/pricing';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'description', label: 'Ürün Açıklaması' },
  { id: 'specs', label: 'Teknik Özellikler' },
  { id: 'shipping', label: 'Kargo ve Kurulum' },
  { id: 'reviews', label: 'Yorumlar' },
  { id: 'questions', label: 'Soru & Cevap' },
];

const reviews = [
  { id: '1', name: 'Ayşe K.', rating: 5, title: 'Mükemmel ürün!', content: '3 aydır kullanıyorum, suyun tadı inanılmaz değişti. Kurulum ekibi çok profesyoneldi. Çocuklarım artık suyu severek içiyor. Kesinlikle tavsiye ederim.', date: '10 Haz 2025', helpful: 12 },
  { id: '2', name: 'Mehmet T.', rating: 4, title: 'Kaliteli ama filtresi pahalı', content: 'Cihazın kendisi mükemmel çalışıyor, su kalitesi harika. Tek eksi filtre değişim maliyetleri biraz yüksek.', date: '5 Haz 2025', helpful: 8 },
  { id: '3', name: 'Selin Y.', rating: 5, title: 'İkinci kez alıyorum', content: 'Annem için de aldım, o da çok memnun. Akıllı sensör özelliği çok pratik, telefona bildirim geliyor.', date: '1 Haz 2025', helpful: 5 },
];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { product, related: relatedProducts, loading } = useProduct(slug);
  const { addItem, openDrawer } = useCartStore();
  const user = useAuthStore((s) => s.user);
  const { toggle: toggleFavorite, isFav } = useFavoritesStore();
  const addToast = useToastStore(s => s.add);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImage, setActiveImage] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);

  const [questionName, setQuestionName] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // Stock notification state
  const [showNotifyForm, setShowNotifyForm] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifySubmitted, setNotifySubmitted] = useState(false);
  const [notifyErrors, setNotifyErrors] = useState<Record<string, string>>({});

  const [publicQuestions, setPublicQuestions] = useState<Awaited<ReturnType<typeof getPublicQuestionsForProduct>>>([]);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (!product) return;
    void getPublicQuestionsForProduct(product.id).then(setPublicQuestions);
    if (notifyEmail) {
      void getStockNotifications().then((items) => {
        setHasNotification(items.some((n) => n.productName === product.name && n.email === notifyEmail && !n.notified));
      });
    }
  }, [product, notifyEmail]);

  if (loading) {
    return (
      <PageLayout>
        <div className="page-container py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-aq-blue" />
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <>
        <SEO title="Ürün Bulunamadı | Aquails" noindex />
        <PageLayout>
          <div className="page-container py-20 text-center">
            <h1 className="text-2xl font-bold text-aq-text">Ürün bulunamadı</h1>
            <Link to="/urunler" className="text-aq-blue hover:underline mt-4 inline-block">
              Ürünlere Dön
            </Link>
          </div>
        </PageLayout>
      </>
    );
  }

  const productSchema = getProductSchema({
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images?.[0] || '/images/products/placeholder.jpg',
    sku: product.id,
    price: getProductGrossPrice(product),
    oldPrice: product.oldPrice != null ? getProductGrossPrice({ ...product, price: product.oldPrice }) : undefined,
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category,
    availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Ürünler', url: '/urunler' },
    { name: product.category, url: `/urunler?kategori=${product.categorySlug}` },
    { name: product.name, url: `/urun/${product.slug}` },
  ]);

  const handleAddToCart = () => {
    addItem(product, quantity);
    openDrawer();
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate('/odeme');
  };

  const isFavorited = isFav(product.id);

  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;
  const existingNotification = hasNotification ? { productId: product.id } : undefined;

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    const errors: Record<string, string> = {};
    if (!notifyEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }
    if (notifyPhone && !/^\d{10,11}$/.test(notifyPhone.replace(/\s/g, ''))) {
      errors.phone = 'Geçerli bir telefon numarası girin';
    }
    setNotifyErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await subscribeStockAlert({
      productId: product.id,
      productName: product.name,
      email: notifyEmail,
    });
    if (result.success) {
      setNotifySubmitted(true);
      setHasNotification(true);
      addToast('Stok bildirimine kaydoldunuz. Ürün gelince haberdar edileceksiniz.', 'success');
    } else {
      addToast(result.error ?? 'Kayıt başarısız.', 'error');
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = questionName.trim() || user?.name || '';
    const text = questionText.trim();
    if (!name) {
      addToast('Lütfen adınızı girin.', 'error');
      return;
    }
    if (!text) {
      addToast('Lütfen sorunuzu yazın.', 'error');
      return;
    }
    const result = await askQuestion(product.id, product.name, name, text);
    if (result.success) {
      setQuestionText('');
      setQuestionSubmitted(true);
      addToast('Sorunuz alındı. Cevaplandığında burada görünecek.', 'success');
    } else {
      addToast(result.error ?? 'Soru gönderilemedi.', 'error');
    }
  };

  const productImages = product.images && product.images.length > 0
    ? product.images
    : ['/images/products/placeholder.jpg'];
  const thumbnails = productImages.length > 1
    ? productImages.slice(0, 4)
    : [productImages[0], productImages[0], productImages[0], productImages[0]];

  return (
    <>
      <SEO
        title={`${product.name} | Aquails`}
        description={product.shortDescription || product.description}
        ogTitle={product.name}
        ogDescription={product.shortDescription || product.description}
        ogImage={product.images?.[0] || '/images/brand/aquails-og.jpg'}
        canonical={`/urun/${product.slug}`}
        schema={{ ...productSchema, ...breadcrumbSchema }}
      />
      <PageLayout>
      {/* Breadcrumb */}
      <div className="page-container pt-6">
        <nav className="text-[13px] text-aq-muted">
          <Link to="/" className="text-aq-blue hover:underline">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <Link to="/urunler" className="text-aq-blue hover:underline">Ürünler</Link>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <span className="text-aq-muted">{product.category}</span>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <span className="text-aq-muted">{product.name}</span>
        </nav>
      </div>

      {/* Product Main */}
      <section className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Gallery */}
          <ScrollReveal x={-20}>
            <div className="bg-aq-ice border border-aq-border/60 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={productImages[activeImage] || productImages[0]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
              />
            </div>
            <div className="flex gap-3 mt-3">
              {thumbnails.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    'w-[72px] h-[72px] rounded-xl border-2 flex items-center justify-center bg-aq-ice transition-all overflow-hidden',
                    activeImage === i ? 'border-aq-deep' : 'border-transparent hover:border-aq-border/60'
                  )}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${i + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                  />
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Right - Info */}
          <ScrollReveal x={20} delay={0.1}>
            <span className="inline-block bg-aq-sky text-aq-blue text-xs font-medium px-3 py-1 rounded-md">
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-aq-text mt-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-aq-text">{product.rating}</span>
              <Link to="#reviews" className="text-sm text-aq-muted hover:text-aq-blue">
                ({product.reviewCount} Değerlendirme)
              </Link>
            </div>

            <ProductPrice product={product} size="lg" showTaxHint className="mt-5" />

            <div className="mt-3">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-red-50 text-red-500 px-2.5 py-1 rounded-md">
                  <AlertCircle className="w-3 h-3" />
                  Stokta Yok
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-600 px-2.5 py-1 rounded-md">
                  <AlertCircle className="w-3 h-3" />
                  Son {product.stock} adet - Hemen sipariş verin
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-aq-sky text-aq-blue px-2.5 py-1 rounded-md">
                  <Check className="w-3 h-3" />
                  Stokta ({product.stock} adet)
                </span>
              )}
            </div>

            <p className="text-[15px] text-aq-muted leading-relaxed mt-5">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {product.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 bg-aq-ice border border-aq-border/60 rounded-lg px-3 py-1.5 text-[13px] font-medium text-aq-text">
                  <Check className="w-3 h-3 text-aq-aqua" />
                  {f}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <span className="text-sm font-semibold text-aq-text">Adet</span>
              <div className="mt-2">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity(quantity + 1)}
                  onDecrease={() => setQuantity(Math.max(1, quantity - 1))}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-6">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 border border-aq-border/60 py-3.5 sm:py-4 rounded-xl font-semibold transition-all',
                  isOutOfStock
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'text-aq-text hover:border-aq-blue hover:text-aq-blue active:scale-[0.98]'
                )}
              >
                <Zap className="w-5 h-5" />
                Hemen Al
              </button>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                aria-label={isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                title={isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
                className={cn(
                  'w-full sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full border transition-all active:scale-[0.96]',
                  isOutOfStock
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-aq-border/60 text-aq-deep hover:border-aq-blue hover:text-aq-blue hover:bg-aq-sky'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              <button
                onClick={() => openWhatsApp(getProductInquiryMessage(product.name))}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-aq-aqua text-aq-aqua py-3.5 sm:py-4 rounded-xl font-semibold hover:bg-aq-sky active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={cn(
                  'w-full sm:w-14 h-12 sm:h-14 flex items-center justify-center border rounded-xl transition-all',
                  isFavorited
                    ? 'border-aqua-danger bg-aqua-danger/5 text-aqua-danger'
                    : 'border-aq-border/60 text-aq-muted hover:border-aq-deep'
                )}
              >
                <Heart className={cn('w-5 h-5', isFavorited && 'fill-aqua-danger')} />
              </button>
            </div>

            {/* Stock Notification */}
            {(isLowStock || isOutOfStock) && !existingNotification && !notifySubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4"
              >
                {!showNotifyForm ? (
                  <button
                    onClick={() => setShowNotifyForm(true)}
                    className="flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    {isOutOfStock ? 'Gelince Haber Ver' : 'Stok Bittiğinde Haber Ver'}
                  </button>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="space-y-3">
                    <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Stoğa girdiğinde haberdar edelim
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                          <input
                            type="email"
                            placeholder="E-posta adresiniz"
                            value={notifyEmail}
                            onChange={e => setNotifyEmail(e.target.value)}
                            className={cn(
                              'w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:border-amber-400',
                              notifyErrors.email ? 'border-red-300' : 'border-amber-200'
                            )}
                          />
                        </div>
                        {notifyErrors.email && <p className="text-xs text-red-500 mt-1">{notifyErrors.email}</p>}
                      </div>
                      <div>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                          <input
                            type="tel"
                            placeholder="Telefon (opsiyonel)"
                            value={notifyPhone}
                            onChange={e => setNotifyPhone(e.target.value)}
                            className={cn(
                              'w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:border-amber-400',
                              notifyErrors.phone ? 'border-red-300' : 'border-amber-200'
                            )}
                          />
                        </div>
                        {notifyErrors.phone && <p className="text-xs text-red-500 mt-1">{notifyErrors.phone}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-600 transition-all"
                      >
                        <Send className="w-3.5 h-3.5" /> Bildirim Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowNotifyForm(false); setNotifyErrors({}); }}
                        className="text-sm text-amber-600 hover:text-amber-700 px-3 py-2"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}

            {/* Already subscribed */}
            {(existingNotification || notifySubmitted) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-aq-sky border border-aq-aqua/30 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-aq-aqua/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-aq-blue" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-aq-blue">Bildirim kaydınız alındı</p>
                  <p className="text-xs text-aq-muted">Ürün stoğa girdiğinde size e-posta ile haber vereceğiz.</p>
                </div>
              </motion.div>
            )}

            <div className="mt-6 pt-5 border-t border-aq-border/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Truck, label: 'Ücretsiz Kargo', value: '1.500₺ üzeri' },
                { icon: Wrench, label: 'Ücretsiz Kurulum', value: 'Profesyonel montaj' },
                { icon: Shield, label: '5 Yıl Garanti', value: 'Tam kapsamlı' },
                { icon: Check, label: 'Stok & Servis', value: isOutOfStock ? 'Stokta yok' : 'Hazır teslimat' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl bg-aq-ice border border-aq-border/60 px-3 py-3 flex flex-col gap-1.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-aq-border/60 flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-aq-blue" />
                  </div>
                  <p className="text-[12px] font-semibold text-aq-text leading-tight">{item.label}</p>
                  <p className="text-[11px] text-aq-muted">{item.value}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabs — responsive minimalist */}
      <section className="page-container pb-12 md:pb-16">
        <div className="-mx-5 sm:mx-0 px-5 sm:px-0">
          <div
            className="flex gap-2 overflow-x-auto overscroll-x-contain pb-1 snap-x snap-mandatory scrollbar-hide"
            role="tablist"
            aria-label="Ürün bilgileri"
          >
            {tabs.map((tab) => {
              const count =
                tab.id === 'reviews'
                  ? product.reviewCount
                  : tab.id === 'questions' && publicQuestions.length > 0
                    ? publicQuestions.length
                    : null;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'snap-start flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-2 text-[12px] sm:text-[13px] font-semibold transition-all',
                    isActive
                      ? 'bg-aq-deep text-white'
                      : 'bg-aq-ice text-aq-muted hover:text-aq-text hover:bg-aq-sky',
                  )}
                >
                  <span>{tab.label}</span>
                  {count != null && (
                    <span
                      className={cn(
                        'tabular-nums text-[11px] font-medium',
                        isActive ? 'text-white/70' : 'text-aq-muted',
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-6 sm:pt-8 md:pt-10">
          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="description"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
              >
                <div className="lg:col-span-7 min-w-0">
                  <div className="relative">
                    <p
                      className={cn(
                        'text-[14px] sm:text-[15px] text-aq-muted leading-[1.75] whitespace-pre-line',
                        !descExpanded && 'line-clamp-[8] sm:line-clamp-[10]',
                      )}
                    >
                      {product.description}
                    </p>
                    {!descExpanded && (product.description?.length ?? 0) > 320 && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                    )}
                  </div>
                  {(product.description?.length ?? 0) > 320 && (
                    <button
                      type="button"
                      onClick={() => setDescExpanded((v) => !v)}
                      className="mt-3 text-[13px] font-semibold text-aq-blue hover:text-aq-deep transition-colors"
                    >
                      {descExpanded ? 'Daha az göster' : 'Devamını oku'}
                    </button>
                  )}
                </div>

                <div className="lg:col-span-5 min-w-0">
                  <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-aq-muted mb-4">
                    7 Aşamalı Arıtma
                  </h4>
                  <ol className="space-y-0 divide-y divide-aq-border/70 rounded-2xl border border-aq-border/80 bg-aq-ice/40 overflow-hidden">
                    {[
                      { t: '5 Mikron Sediment', d: 'Pas, kum ve tortuları tutar.' },
                      { t: 'GAC Aktif Karbon', d: 'Klor, kötü koku ve tadı giderir.' },
                      { t: 'CTO Karbon Blok', d: 'Klor kalıntılarını ve organik bileşikleri temizler.' },
                      { t: 'RO Membran', d: 'Bakteri, virüs, ağır metaller ve %99.9 safsızlığı giderir.' },
                      { t: 'Post Karbon', d: 'Son tat ve koku düzenlemesi.' },
                      { t: 'Mineral Filtre', d: 'Kalsiyum ve magnezyumu suya katar.' },
                      { t: 'UV Sterilizasyon', d: 'Son aşamada mikrop temizliği.' },
                    ].map((step, i) => (
                      <li key={step.t} className="flex gap-3 px-4 py-3.5">
                        <span className="text-[11px] font-semibold text-aq-blue tabular-nums pt-0.5 w-5 flex-shrink-0">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] sm:text-sm font-semibold text-aq-text">{step.t}</p>
                          <p className="text-[12px] sm:text-[13px] text-aq-muted mt-0.5 leading-relaxed">{step.d}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}

            {activeTab === 'specs' && (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-2xl border border-aq-border/80 overflow-hidden bg-aq-border/60"
              >
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex flex-col gap-1 bg-white px-4 py-4 sm:px-5"
                  >
                    <span className="text-[12px] text-aq-muted">{key}</span>
                    <span className="text-sm font-semibold text-aq-text break-words">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
              >
                <div className="rounded-2xl border border-aq-border/80 bg-aq-ice/40 p-5 sm:p-6 sm:col-span-3 md:col-span-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-aq-border/60 flex items-center justify-center mb-3">
                    <Truck className="w-4 h-4 text-aq-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-aq-text mb-1.5">Kargo</h4>
                  <p className="text-[13px] text-aq-muted leading-relaxed">
                    1–3 iş günü içinde kargoya verilir. İstanbul içi aynı gün; diğer iller 2–4 iş günü.
                  </p>
                </div>
                <div className="rounded-2xl border border-aq-border/80 bg-white p-5 sm:p-6">
                  <div className="w-9 h-9 rounded-xl bg-aq-ice border border-aq-border/60 flex items-center justify-center mb-3">
                    <Wrench className="w-4 h-4 text-aq-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-aq-text mb-1.5">Kurulum</h4>
                  <p className="text-[13px] text-aq-muted leading-relaxed">
                    Profesyonel kurulum ücretsizdir. Ekibimiz montajı yapar ve cihazı çalıştırır.
                  </p>
                </div>
                <div className="rounded-2xl border border-aq-border/80 bg-white p-5 sm:p-6">
                  <div className="w-9 h-9 rounded-xl bg-aq-ice border border-aq-border/60 flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4 text-aq-blue" />
                  </div>
                  <h4 className="text-sm font-semibold text-aq-text mb-1.5">İade</h4>
                  <p className="text-[13px] text-aq-muted leading-relaxed">
                    14 gün koşulsuz iade. Ürün kutusu ve ambalajının hasarsız olması gerekir.
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-end mb-8 sm:mb-10 pb-8 sm:pb-10 border-b border-aq-border/70">
                  <div>
                    <span className="text-4xl sm:text-5xl font-bold tracking-tight text-aq-text">{product.rating}</span>
                    <div className="mt-2">
                      <RatingStars rating={product.rating} size="md" />
                    </div>
                    <p className="text-[13px] text-aq-muted mt-1.5">{product.reviewCount} değerlendirme</p>
                  </div>
                  <div className="w-full max-w-sm">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs text-aq-muted w-3 tabular-nums">{star}</span>
                          <div className="flex-1 h-1 bg-aq-ice rounded-full overflow-hidden">
                            <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-aq-muted w-8 tabular-nums text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    className="w-full sm:w-auto border border-aq-border/60 text-aq-text px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:border-aq-blue hover:text-aq-blue transition-all"
                  >
                    Yorum Yaz
                  </button>
                </div>

                <div className="space-y-0 divide-y divide-aq-border/70 max-w-3xl">
                  {reviews.map((review) => (
                    <div key={review.id} className="py-6 first:pt-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-aq-sky rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-aq-blue">{review.name[0]}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-aq-text">{review.name}</p>
                          <p className="text-xs text-aq-muted">{review.date}</p>
                        </div>
                        <RatingStars rating={review.rating} size="sm" />
                      </div>
                      <h5 className="text-sm font-semibold text-aq-text mt-3">{review.title}</h5>
                      <p className="text-[14px] text-aq-muted leading-relaxed mt-1.5">{review.content}</p>
                      <button
                        type="button"
                        className="flex items-center gap-1.5 text-xs text-aq-muted hover:text-aq-blue mt-3 transition-colors"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Faydalı ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2 }}
                className="max-w-3xl space-y-10"
              >
                <div>
                  <h4 className="text-sm font-semibold text-aq-text flex items-center gap-2 mb-4">
                    <HelpCircle className="w-4 h-4 text-aq-blue" />
                    Soru Sor
                  </h4>
                  {questionSubmitted ? (
                    <p className="text-sm text-aq-muted">
                      Sorunuz başarıyla gönderildi. Admin onayından sonra cevap burada yayınlanacaktır.
                    </p>
                  ) : (
                    <form onSubmit={handleQuestionSubmit} className="space-y-3">
                      <input
                        type="text"
                        value={questionName}
                        onChange={(e) => setQuestionName(e.target.value)}
                        placeholder={user?.name ? user.name : 'Adınız Soyadınız'}
                        className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue bg-white"
                      />
                      <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="Ürün hakkında sorunuzu yazın..."
                        rows={3}
                        className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue bg-white resize-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 border border-aq-border/60 text-aq-text px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:border-aq-blue hover:text-aq-blue transition-all"
                      >
                        <Send className="w-4 h-4" />
                        Soruyu Gönder
                      </button>
                    </form>
                  )}
                </div>

                {publicQuestions.length > 0 ? (
                  <div className="divide-y divide-aq-border/70">
                    {publicQuestions.map((q) => (
                      <div key={q.id} className="py-5 first:pt-0">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-aq-sky rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-aq-blue">{q.customerName[0]}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-aq-text">{q.customerName}</p>
                            <p className="text-[14px] text-aq-muted mt-1 leading-relaxed">{q.question}</p>
                            {q.answer && (
                              <div className="mt-3 pl-3 border-l-2 border-aq-blue/30">
                                <p className="text-xs font-medium text-aq-blue mb-1 flex items-center gap-1">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  Aquails Cevabı
                                </p>
                                <p className="text-[14px] text-aq-muted leading-relaxed">{q.answer}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-aq-muted">
                    Henüz yayınlanmış soru-cevap bulunmuyor. İlk soruyu siz sorun!
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="page-container pb-20">
          <h2 className="text-xl md:text-2xl font-bold text-aq-text mb-6">Benzer Ürünler</h2>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" staggerDelay={0.08}>
            {relatedProducts.map((rp) => (
              <StaggerItem key={rp.id}>
                <ProductCard product={rp} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      )}

      {/* Recently Viewed */}
      <section className="page-container pb-20">
        <h2 className="text-xl md:text-2xl font-bold text-aq-text mb-6">Son Görüntüledikleriniz</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {relatedProducts.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              to={`/urun/${p.slug}`}
              className="flex-shrink-0 w-[180px] group"
            >
              <div className="bg-aq-ice rounded-xl aspect-square flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={p.images?.[0] || '/images/products/placeholder.jpg'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                />
              </div>
              <p className="text-[13px] font-medium text-aq-text line-clamp-1 group-hover:text-aq-blue transition-colors">
                {p.name}
              </p>
              <p className="text-sm font-semibold text-aq-text mt-0.5">
                {p.price.toLocaleString('tr-TR')}₺
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
    </>
  );
}
