import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingCart, Zap, Check, ChevronRight,
  Shield, Truck, Wrench, Star, ThumbsUp,
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
          <Loader2 className="w-8 h-8 animate-spin text-aqua-primary" />
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
            <h1 className="text-2xl font-bold text-aqua-secondary">Ürün bulunamadı</h1>
            <Link to="/urunler" className="text-aqua-primary hover:underline mt-4 inline-block">
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
        <nav className="text-[13px] text-aqua-text-muted">
          <Link to="/" className="text-aqua-primary hover:underline">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <Link to="/urunler" className="text-aqua-primary hover:underline">Ürünler</Link>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <span className="text-aqua-text-secondary">{product.category}</span>
          <ChevronRight className="w-3 h-3 inline mx-1" />
          <span className="text-aqua-text-secondary">{product.name}</span>
        </nav>
      </div>

      {/* Product Main */}
      <section className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Gallery */}
          <ScrollReveal x={-20}>
            <div className="bg-white border border-aqua-border-light rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
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
                    'w-[72px] h-[72px] rounded-xl border-2 flex items-center justify-center bg-aqua-bg transition-all overflow-hidden',
                    activeImage === i ? 'border-aqua-primary' : 'border-transparent hover:border-aqua-border'
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
            <span className="inline-block bg-aqua-primary/5 text-aqua-primary text-xs font-medium px-3 py-1 rounded-md">
              {product.category}
            </span>

            <h1 className="text-2xl md:text-3xl font-bold text-aqua-secondary mt-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} size="md" />
              <span className="text-sm font-semibold text-aqua-secondary">{product.rating}</span>
              <Link to="#reviews" className="text-sm text-aqua-text-muted hover:text-aqua-primary">
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
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md">
                  <Check className="w-3 h-3" />
                  Stokta ({product.stock} adet)
                </span>
              )}
            </div>

            <p className="text-[15px] text-aqua-text-secondary leading-relaxed mt-5">
              {product.shortDescription}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {product.features.map((f) => (
                <span key={f} className="inline-flex items-center gap-1.5 bg-aqua-bg border border-aqua-border-light rounded-lg px-3 py-1.5 text-[13px] font-medium text-aqua-secondary">
                  <Check className="w-3 h-3 text-aqua-success" />
                  {f}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <span className="text-sm font-semibold text-aqua-secondary">Adet</span>
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
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-full font-semibold transition-all',
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-aqua-primary text-white hover:bg-aqua-primary-dark hover:shadow-primary active:scale-[0.98]'
                )}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOutOfStock ? 'Stokta Yok' : 'Sepete Ekle'}
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 border-2 py-3.5 sm:py-4 rounded-full font-semibold transition-all',
                  isOutOfStock
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'border-aqua-primary text-aqua-primary hover:bg-aqua-primary hover:text-white active:scale-[0.98]'
                )}
              >
                <Zap className="w-5 h-5" />
                Hemen Al
              </button>
              <button
                onClick={() => openWhatsApp(getProductInquiryMessage(product.name))}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-[#00C9A7] text-[#00C9A7] py-3.5 sm:py-4 rounded-full font-semibold hover:bg-[#00C9A7]/5 active:scale-[0.98] transition-all"
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
                    : 'border-aqua-border-light text-aqua-text-secondary hover:border-aqua-primary'
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
                className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">Bildirim kaydınız alındı</p>
                  <p className="text-xs text-emerald-600">Ürün stoğa girdiğinde size e-posta ile haber vereceğiz.</p>
                </div>
              </motion.div>
            )}

            <div className="mt-6 pt-5 border-t border-aqua-border-light space-y-2.5">
              {[
                { icon: Truck, label: 'Kargo', value: 'Ücretsiz' },
                { icon: Wrench, label: 'Kurulum', value: 'Ücretsiz Profesyonel' },
                { icon: Shield, label: 'Garanti', value: '5 Yıl' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 text-[13px]">
                  <span className="text-aqua-text-muted w-20">{item.label}</span>
                  <div className="flex items-center gap-2 text-aqua-secondary">
                    <item.icon className="w-4 h-4 text-aqua-primary" />
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Tabs */}
      <section className="page-container pb-12">
        <div className="bg-white border border-aqua-border-light rounded-2xl overflow-hidden">
          {/* Tab Nav */}
          <div className="flex border-b border-aqua-border-light overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-all',
                  activeTab === tab.id
                    ? 'text-aqua-primary border-aqua-primary'
                    : 'text-aqua-text-muted border-transparent hover:text-aqua-secondary'
                )}
              >
                {tab.label}
                {tab.id === 'reviews' && ` (${product.reviewCount})`}
                {tab.id === 'questions' && publicQuestions.length > 0 && ` (${publicQuestions.length})`}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[15px] text-aqua-text-secondary leading-relaxed"
                >
                  <p>{product.description}</p>
                  <h4 className="text-base font-semibold text-aqua-secondary mt-6 mb-3">7 Aşamalı Arıtma Süreci</h4>
                  <ol className="space-y-2 ml-5">
                    <li className="list-decimal"><strong>5 Mikron Sediment Filtre:</strong> Pas, kum ve tortuları tutar.</li>
                    <li className="list-decimal"><strong>GAC Aktif Karbon Filtre:</strong> Klor, kötü koku ve tadı giderir.</li>
                    <li className="list-decimal"><strong>CTO Karbon Blok Filtre:</strong> Klor kalıntılarını ve organik bileşikleri temizler.</li>
                    <li className="list-decimal"><strong>RO Membran Filtre:</strong> Bakteri, virüs, ağır metaller ve %99.9 safsızlığı giderir.</li>
                    <li className="list-decimal"><strong>Post Karbon Filtre:</strong> Son tat ve koku düzenlemesi.</li>
                    <li className="list-decimal"><strong>Mineral Filtre:</strong> Sağlıklı mineralleri (kalsiyum, magnezyum) suya katar.</li>
                    <li className="list-decimal"><strong>UV Sterilizasyon:</strong> Son aşamada mikrop temizliği.</li>
                  </ol>
                </motion.div>
              )}

              {activeTab === 'specs' && (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <table className="w-full">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-aqua-bg last:border-0">
                          <td className="py-3.5 text-sm font-medium text-aqua-text-secondary w-1/2">{key}</td>
                          <td className="py-3.5 text-sm font-medium text-aqua-secondary text-right">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[15px] text-aqua-text-secondary leading-relaxed"
                >
                  <div className="bg-aqua-bg border-l-4 border-aqua-primary rounded-r-xl p-4 mb-4">
                    <p className="font-medium text-aqua-secondary">Siparişleriniz 1-3 iş günü içinde kargoya verilir.</p>
                  </div>
                  <p>İstanbul içi aynı gün teslimat imkanı mevcuttur. Diğer iller için ortalama teslimat süresi 2-4 iş günüdür.</p>
                  <h4 className="text-base font-semibold text-aqua-secondary mt-4 mb-2">Kurulum Hizmeti</h4>
                  <p>Tüm su arıtma cihazlarımızda profesyonel kurulum hizmeti ücretsizdir. Kurulum ekibimiz cihazı evinize getirir, monte eder ve çalıştırır.</p>
                  <h4 className="text-base font-semibold text-aqua-secondary mt-4 mb-2">İade Politikası</h4>
                  <p>14 gün içinde koşulsuz iade imkanı. Ürün kutusunda ve ambalajında hasar olmaması gerekmektedir.</p>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Rating Summary */}
                  <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="text-center md:text-left">
                      <span className="text-5xl font-bold text-aqua-secondary">{product.rating}</span>
                      <div className="mt-2">
                        <RatingStars rating={product.rating} size="md" />
                      </div>
                      <p className="text-sm text-aqua-text-muted mt-1">{product.reviewCount} Değerlendirme</p>
                    </div>
                    <div className="flex-1 max-w-xs">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
                        return (
                          <div key={star} className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs text-aqua-text-muted w-3">{star}</span>
                            <Star className="w-3 h-3 text-[#F5A623] fill-[#F5A623]" />
                            <div className="flex-1 h-1.5 bg-aqua-bg rounded-full overflow-hidden">
                              <div className="h-full bg-[#F5A623] rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-aqua-text-muted w-6">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-start">
                      <button className="border-2 border-aqua-primary text-aqua-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-aqua-primary hover:text-white transition-all">
                        Yorum Yaz
                      </button>
                    </div>
                  </div>

                  {/* Review List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-aqua-bg pb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-aqua-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-aqua-primary">{review.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-aqua-secondary">{review.name}</p>
                            <p className="text-xs text-aqua-text-muted">{review.date}</p>
                          </div>
                          <RatingStars rating={review.rating} size="sm" className="ml-auto" />
                        </div>
                        <h5 className="text-sm font-semibold text-aqua-secondary mt-3">{review.title}</h5>
                        <p className="text-sm text-aqua-text-secondary leading-relaxed mt-1.5">{review.content}</p>
                        <button className="flex items-center gap-1.5 text-xs text-aqua-text-muted hover:text-aqua-primary mt-3 transition-colors">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-aqua-bg border border-aqua-border-light rounded-xl p-5">
                    <h4 className="text-sm font-semibold text-aqua-secondary flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-aqua-primary" />
                      Soru Sor
                    </h4>
                    {questionSubmitted ? (
                      <p className="text-sm text-aqua-text-secondary">
                        Sorunuz başarıyla gönderildi. Admin onayından sonra cevap burada yayınlanacaktır.
                      </p>
                    ) : (
                      <form onSubmit={handleQuestionSubmit} className="space-y-3">
                        <input
                          type="text"
                          value={questionName}
                          onChange={(e) => setQuestionName(e.target.value)}
                          placeholder={user?.name ? user.name : 'Adınız Soyadınız'}
                          className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary bg-white"
                        />
                        <textarea
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          placeholder="Ürün hakkında sorunuzu yazın..."
                          rows={3}
                          className="w-full px-4 py-2.5 text-sm border border-aqua-border rounded-xl focus:outline-none focus:border-aqua-primary bg-white resize-none"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 bg-aqua-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-aqua-primary-dark transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Soruyu Gönder
                        </button>
                      </form>
                    )}
                  </div>

                  {publicQuestions.length > 0 ? (
                    <div className="space-y-4">
                      {publicQuestions.map((q) => (
                        <div key={q.id} className="border-b border-aqua-bg pb-4 last:border-0">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-aqua-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-aqua-primary">{q.customerName[0]}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-aqua-secondary">{q.customerName}</p>
                              <p className="text-sm text-aqua-text-secondary mt-1">{q.question}</p>
                              {q.answer && (
                                <div className="mt-3 bg-aqua-bg rounded-xl p-3">
                                  <p className="text-xs font-medium text-aqua-primary mb-1 flex items-center gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    Aquails Cevabı
                                  </p>
                                  <p className="text-sm text-aqua-text-secondary">{q.answer}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-aqua-text-muted text-center py-4">
                      Henüz yayınlanmış soru-cevap bulunmuyor. İlk soruyu siz sorun!
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="page-container pb-20">
          <h2 className="text-xl md:text-2xl font-bold text-aqua-secondary mb-6">Benzer Ürünler</h2>
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
        <h2 className="text-xl md:text-2xl font-bold text-aqua-secondary mb-6">Son Görüntüledikleriniz</h2>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {relatedProducts.slice(0, 4).map((p) => (
            <Link
              key={p.id}
              to={`/urun/${p.slug}`}
              className="flex-shrink-0 w-[180px] group"
            >
              <div className="bg-aqua-bg rounded-xl aspect-square flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={p.images?.[0] || '/images/products/placeholder.jpg'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                />
              </div>
              <p className="text-[13px] font-medium text-aqua-secondary line-clamp-1 group-hover:text-aqua-primary transition-colors">
                {p.name}
              </p>
              <p className="text-sm font-semibold text-aqua-secondary mt-0.5">
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
