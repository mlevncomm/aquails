import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, ArrowRight, Check, Minus, Plus, Trash2,
  MessageCircle, Truck, Package, Sparkles, ShieldCheck
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


export default function Cart() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const {
    taxConfig,
    shipping,
    total,
    freeShippingProgress,
    remainingForFreeShipping,
  } = useCartPricing(subtotal);
  const discount = 0;

  const recommendations = items.length > 0 ? getSmartRecommendations(items) : [];

  return (
    <>
      <SEO
        title="Sepetim | Aquails"
        description="Aquails alışveriş sepetiniz. Su arıtma cihazları ve filtre setleri."
        canonical="/sepet"
      />
    <PageLayout>
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E8F4FF] py-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1A73E8]/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#4FC3F7]/[0.05] rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137]">Alışveriş Sepetim</h1>
          <p className="text-sm text-[#5A6B7B] mt-2">
            {items.length === 0 ? 'Sepetiniz boş' : `Sepetinizde ${items.length} ürün bulunuyor`}
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-6 sm:py-8 overflow-x-hidden">
        {items.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#F0F6FF] to-[#E8F0FE] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-aquails">
              <ShoppingCart className="w-12 h-12 text-[#1A73E8]/30" />
            </div>
            <h2 className="text-xl font-bold text-[#0D2137] mb-2">Sepetiniz Henüz Boş</h2>
            <p className="text-sm text-[#5A6B7B] leading-relaxed mb-6">
              Su arıtma cihazları, filtre setleri ve aksesuarlarımızı keşfedin. Size en uygun ürünleri sepetinize ekleyin.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/urunler"
                className="inline-flex items-center justify-center gap-2 bg-[#1A73E8] text-white px-8 py-3.5 rounded-full font-semibold text-sm hover:bg-[#1557B0] transition-all shadow-lg shadow-[#1A73E8]/20"
              >
                <Package className="w-4 h-4" /> Ürünleri Keşfet
              </Link>
              <Link
                to="/urun-secim-sihirbazi"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#E8F0FE] text-[#5A6B7B] px-8 py-3.5 rounded-full font-medium text-sm hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all"
              >
                <Sparkles className="w-4 h-4" /> Sihirbaz Kullan
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 lg:gap-8 min-w-0">
            {/* Product List */}
            <ScrollReveal>
              <div className="bg-white/80 backdrop-blur-md border border-[#E8F0FE] rounded-2xl overflow-hidden shadow-aquails">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0, paddingTop: 0, paddingBottom: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-3 sm:px-5 py-4 sm:py-5 border-b border-[#F0F6FF] last:border-0 min-w-0"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-[#F8FBFF] rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-[#E8F0FE]">
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
                          className="text-sm font-semibold text-[#0D2137] hover:text-[#1A73E8] transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-[#8B9DAF] mt-1">{item.product.category}</p>
                        <p className="text-sm text-[#5A6B7B] mt-1">
                          {item.product.price.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center bg-[#F8FBFF] rounded-xl overflow-hidden border border-[#E8F0FE]">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#5A6B7B] hover:bg-[#F0F6FF] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-[#0D2137]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#5A6B7B] hover:bg-[#F0F6FF] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right w-20 flex-shrink-0 hidden sm:block">
                        <p className="text-base font-semibold text-[#0D2137]">
                          {(item.product.price * item.quantity).toLocaleString('tr-TR')} ₺
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-[#8B9DAF] hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
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
                    <Sparkles className="w-4 h-4 text-[#1A73E8]" />
                    <h3 className="text-sm font-semibold text-[#0D2137]">Bu Ürünlerle Birlikte Önerilenler</h3>
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
                  <div className="bg-white/80 backdrop-blur-md border border-[#E8F0FE] rounded-2xl p-5 shadow-aquails">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="w-4 h-4 text-[#1A73E8]" />
                      <p className="text-sm font-semibold text-[#0D2137]">Ücretsiz Kargo</p>
                    </div>
                    <div className="w-full h-2 bg-[#E8F0FE] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#1A73E8] to-[#00D4C8] rounded-full transition-all duration-500"
                        style={{ width: `${freeShippingProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#8B9DAF] mt-2">
                      Ücretsiz kargo için <span className="font-semibold text-[#1A73E8]">{remainingForFreeShipping.toLocaleString('tr-TR')} ₺</span> daha ürün ekleyin.
                    </p>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <p className="text-sm font-medium text-emerald-700">Tebrikler! Kargonuz ücretsiz.</p>
                  </div>
                )}

                {/* Coupon */}
                <div className="bg-white/80 backdrop-blur-md border border-[#E8F0FE] rounded-2xl p-5 shadow-aquails">
                  <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Kupon Kodu</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Kupon kodunuzu girin"
                      className="flex-1 px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl focus:outline-none focus:border-[#1A73E8] bg-[#F8FBFF]"
                    />
                    <button className="bg-[#1A73E8] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">
                      Uygula
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-white/80 backdrop-blur-md border border-[#E8F0FE] rounded-2xl p-6 shadow-aquails">
                  <h3 className="text-lg font-bold text-[#0D2137] mb-5">Sipariş Özeti</h3>

                  <div className="space-y-3">
                    <OrderPriceBreakdown
                      subtotal={subtotal}
                      shipping={shipping}
                      discount={discount}
                      taxConfig={taxConfig}
                      totalLabel="Toplam"
                    />
                  </div>

                  {/* Security */}
                  <div className="flex items-center justify-center gap-4 mt-5 py-4 border-t border-[#F0F6FF]">
                    {[
                      { icon: ShieldCheck, label: 'Güvenli' },
                      { icon: Check, label: 'SSL' },
                    ].map((badge) => (
                      <div key={badge.label} className="flex items-center gap-1.5 text-[11px] text-[#8B9DAF]">
                        <badge.icon className="w-3.5 h-3.5" />
                        {badge.label}
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/odeme"
                    className="flex items-center justify-center gap-2 w-full bg-[#1A73E8] text-white py-4 rounded-full font-semibold hover:bg-[#1557B0] transition-all mt-2 shadow-lg shadow-[#1A73E8]/20"
                  >
                    Ödemeye Geç <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* WhatsApp Order */}
                  <button
                    onClick={() =>
                      openWhatsApp(
                        getCartOrderMessage(
                          items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
                          total
                        )
                      )
                    }
                    className="flex items-center justify-center gap-2 w-full mt-3 border border-[#E8F0FE] text-[#5A6B7B] py-3 rounded-full text-sm font-medium hover:border-[#00C9A7] hover:text-[#00C9A7] transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp ile Sipariş Ver
                  </button>

                  <Link
                    to="/urunler"
                    className="flex items-center justify-center w-full text-sm font-medium text-[#8B9DAF] hover:text-[#0D2137] py-3 mt-2 transition-colors"
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
