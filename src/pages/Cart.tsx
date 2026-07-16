import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, ArrowRight, Check, Minus, Plus, Trash2,
  MessageCircle, Truck, Package, Sparkles, ShieldCheck, X
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal, StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { ProductCard } from '@/components/ProductCard';
import { useCartStore } from '@/stores/cartStore';
import { getSmartRecommendations } from '@/services/smartCartService';
import { openWhatsApp, getCartOrderMessage } from '@/services/whatsappService';
import { SEO } from '@/components/SEO';
import { useCartPricing } from '@/hooks/useCartPricing';
import { OrderPriceBreakdown } from '@/components/OrderPriceBreakdown';
import { CartLinePrice } from '@/components/CartLinePrice';
import { getProductGrossPrice } from '@/lib/pricing';
import { validateCoupon } from '@/services/couponService';
import { useToastStore } from '@/components/Toast';


export default function Cart() {
  const { items, updateQuantity, removeItem, appliedCoupon, setAppliedCoupon } = useCartStore();
  const addToast = useToastStore((s) => s.add);
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code ?? '');
  const [couponLoading, setCouponLoading] = useState(false);
  const {
    taxConfig,
    total,
    taxTotals,
    freeShippingProgress,
    remainingForFreeShipping,
  } = useCartPricing(items);

  const recommendations = items.length > 0 ? getSmartRecommendations(items) : [];

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      addToast('Kupon kodu girin.', 'error');
      return;
    }
    setCouponLoading(true);
    const res = await validateCoupon(couponCode.trim(), total);
    setCouponLoading(false);
    if (!res.valid || !res.coupon) {
      setAppliedCoupon(null);
      addToast(res.message || 'Kupon geçersiz.', 'error');
      return;
    }
    setAppliedCoupon({
      code: res.coupon.code,
      discount: res.discount,
      type: res.coupon.type,
    });
    addToast(`${res.coupon.code} uygulandı.`, 'success');
  };

  return (
    <>
      <SEO
        title="Sepetim | Aquails"
        description="Aquails alışveriş sepetiniz. Su arıtma cihazları ve filtre setleri."
        canonical="/sepet"
      />
    <PageLayout>
      {/* Hero */}
      <div className="relative bg-white py-12 md:py-14 overflow-hidden border-b border-aq-border/50">
        <div className="page-container relative">
          <h1 className="text-2xl md:text-3xl font-bold text-aq-text">Alışveriş Sepetim</h1>
          <p className="text-sm text-aq-muted mt-2">
            {items.length === 0 ? 'Sepetiniz boş' : `Sepetinizde ${items.length} ürün bulunuyor`}
          </p>
        </div>
      </div>

      <div className="page-container py-8 sm:py-10 overflow-x-hidden">
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-aq-ice rounded-2xl flex items-center justify-center mx-auto mb-6 border border-aq-border/60">
              <ShoppingCart className="w-12 h-12 text-aq-blue/30" />
            </div>
            <h2 className="text-xl font-semibold text-aq-text mb-2">Sepetiniz Henüz Boş</h2>
            <p className="text-sm text-aq-muted leading-relaxed mb-6">
              Su arıtma cihazları, filtre setleri ve aksesuarlarımızı keşfedin. Size en uygun ürünleri sepetinize ekleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/urunler"
                className="inline-flex items-center justify-center gap-2 bg-aq-blue text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-aq-deep hover:text-white transition-all"
              >
                <Package className="w-4 h-4" /> Ürünleri Keşfet
              </Link>
              <Link
                to="/urun-secim-sihirbazi"
                className="inline-flex items-center justify-center gap-2 border-2 border-aq-border/60 text-aq-muted px-8 py-3.5 rounded-xl font-semibold text-sm hover:border-aq-blue hover:text-aq-blue transition-all"
              >
                <Sparkles className="w-4 h-4" /> Sihirbaz Kullan
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 min-w-0">
            {/* Product List */}
            <ScrollReveal>
              <div className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-3 sm:px-5 py-4 sm:py-5 border-b border-aq-border/60 last:border-0 min-w-0"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-aq-ice rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-aq-border/60">
                        <img
                          src={item.product.images?.[0] || '/images/products/placeholder.jpg'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/urun/${item.product.slug}`}
                          className="text-sm font-semibold text-aq-text hover:text-aq-blue transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-aq-muted mt-1">{item.product.category}</p>
                        <p className="text-sm text-aq-muted mt-1">
                          <CartLinePrice product={item.product} quantity={1} layout="unit" />
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center bg-aq-ice rounded-xl overflow-hidden border border-aq-border/60">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-aq-muted hover:bg-aq-border transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-aq-text">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-aq-muted hover:bg-aq-border transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right w-20 flex-shrink-0 hidden sm:block">
                        <p className="text-base font-semibold text-aq-text">
                          <CartLinePrice product={item.product} quantity={item.quantity} />
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-aq-muted hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Smart Recommendations */}
              {recommendations.length > 0 && (
                <ScrollReveal className="mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-aq-blue" />
                    <h3 className="text-sm font-semibold text-aq-text">Bu Ürünlerle Birlikte Önerilenler</h3>
                  </div>
                  <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3" staggerDelay={0.08}>
                    {recommendations.slice(0, 4).map((p) => (
                      <StaggerItem key={p.id}>
                        <ProductCard product={p} compact />
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </ScrollReveal>
              )}
            </ScrollReveal>

            {/* Order Summary */}
            <ScrollReveal x={20} delay={0.2}>
              <div className="space-y-5 lg:sticky lg:top-28">
                {/* Free Shipping Progress */}
                {remainingForFreeShipping > 0 ? (
                  <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-aq-blue" />
                      <p className="text-sm font-semibold text-aq-text">Ücretsiz Kargo</p>
                    </div>
                    <div className="w-full h-2 bg-aq-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-aq-blue to-aq-aqua rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-aq-muted mt-2">
                      Ücretsiz kargo için <span className="font-semibold text-aq-blue">{remainingForFreeShipping.toLocaleString('tr-TR')} ₺</span> daha ürün ekleyin.
                    </p>
                  </div>
                ) : (
                  <div className="bg-aq-sky border border-aq-aqua/30 rounded-2xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-aq-blue flex-shrink-0" />
                    <p className="text-sm font-medium text-aq-blue">Tebrikler! Kargonuz ücretsiz.</p>
                  </div>
                )}

                {/* Coupon */}
                <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-aq-text mb-3">Kupon Kodu</h3>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-aq-aqua/30 bg-aq-sky/40 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-aq-blue">{appliedCoupon.code}</p>
                        <p className="text-xs text-aq-muted mt-0.5">
                          {appliedCoupon.discount < 0
                            ? 'Ücretsiz kargo'
                            : `${appliedCoupon.discount.toLocaleString('tr-TR')} ₺ indirim`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-aq-muted hover:bg-white"
                        aria-label="Kuponu kaldır"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && void handleApplyCoupon()}
                        placeholder="Kupon kodunuzu girin"
                        className="flex-1 px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl focus:outline-none focus:border-aq-blue bg-aq-ice"
                      />
                      <button
                        type="button"
                        onClick={() => void handleApplyCoupon()}
                        disabled={couponLoading}
                        className="bg-aq-blue text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60"
                      >
                        {couponLoading ? '...' : 'Uygula'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-white border border-aq-border/60 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-aq-text mb-5">Sipariş Özeti</h3>

                  <div className="space-y-3">
                    <OrderPriceBreakdown
                      totals={taxTotals}
                      taxConfig={taxConfig}
                      totalLabel="Toplam"
                    />
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-4 mt-5 py-4 border-t border-aq-border/60">
                    {[
                      { icon: ShieldCheck, label: 'Güvenli' },
                      { icon: Check, label: 'SSL' },
                    ].map((badge) => (
                      <div key={badge.label} className="flex items-center gap-1.5 text-[11px] text-aq-muted">
                        <badge.icon className="w-3.5 h-3.5" />
                        {badge.label}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/odeme"
                    className="flex items-center justify-center gap-2 w-full bg-aq-blue text-white py-4 rounded-xl font-semibold hover:bg-aq-deep hover:text-white transition-all mt-2"
                  >
                    Ödemeye Geç <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* WhatsApp Order */}
                  <button
                    onClick={() =>
                      openWhatsApp(
                        getCartOrderMessage(
                          items.map((i) => ({
                            name: i.product.name,
                            quantity: i.quantity,
                            price: getProductGrossPrice(i.product, taxConfig.rate),
                          })),
                          total
                        )
                      )
                    }
                    className="flex items-center justify-center gap-2 w-full mt-3 border border-aq-border/60 text-aq-muted py-3 rounded-xl text-sm font-semibold hover:border-aq-aqua hover:text-aq-blue transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp ile Sipariş Ver
                  </button>

                  <Link
                    to="/urunler"
                    className="flex items-center justify-center w-full text-sm font-medium text-aq-muted hover:text-aq-text py-3 mt-2 transition-colors"
                  >
                    Alışverişe Devam Et
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>
    </PageLayout>
    </>
  );
}
