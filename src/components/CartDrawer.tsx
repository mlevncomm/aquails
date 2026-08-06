import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowUpRight,
  Sparkles,
  Truck,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCartPricing } from '@/hooks/useCartPricing';
import { OrderPriceBreakdown } from '@/components/OrderPriceBreakdown';
import { CartLinePrice } from '@/components/CartLinePrice';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCartStore();
  const { taxConfig, taxTotals } = useCartPricing(items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-aq-deep/45 backdrop-blur-[2px]"
            onClick={closeDrawer}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-[420px] flex-col overflow-hidden border-l border-white/40 bg-[#F7FBFE] shadow-drawer"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_100%_0%,rgba(32,211,242,0.16),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_0%_100%,rgba(18,134,216,0.1),transparent_50%)]" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-aq-border/40 bg-white/70 px-5 py-4 backdrop-blur-xl">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-aq-blue/70">
                  Alışveriş
                </p>
                <div className="mt-1 flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-aq-blue to-[#0d6fba] text-white shadow-[0_10px_20px_-10px_rgba(18,134,216,0.85)]">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                  <h3 className="font-[Poppins,ui-sans-serif,sans-serif] text-lg font-semibold tracking-tight text-aq-deep">
                    Sepetim
                  </h3>
                  {itemCount > 0 && (
                    <span className="rounded-full bg-aq-sky px-2 py-0.5 text-[11px] font-semibold text-aq-blue">
                      {itemCount} ürün
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Sepeti kapat"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-aq-border/60 bg-white/80 text-aq-muted transition-all hover:border-aq-blue/30 hover:bg-aq-sky hover:text-aq-deep"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="relative z-10 min-w-0 flex-1 overflow-x-hidden overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-2 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 scale-150 rounded-full bg-aq-aqua/20 blur-2xl" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-white/80 bg-white/80 shadow-[0_20px_50px_-28px_rgba(6,38,61,0.45)] backdrop-blur-xl">
                      <ShoppingBag className="h-10 w-10 text-aq-blue/55" strokeWidth={1.5} />
                      <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-aq-aqua to-aq-blue text-white shadow-md">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  <h4 className="font-[Poppins,ui-sans-serif,sans-serif] text-xl font-semibold tracking-tight text-aq-deep">
                    Sepetiniz boş
                  </h4>
                  <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-aq-muted">
                    Su arıtma ürünlerini keşfedin, size uygun çözümü sepetinize ekleyin.
                  </p>
                  <div className="mt-6 flex w-full max-w-[280px] flex-col gap-2.5">
                    <Link
                      to="/urunler"
                      onClick={closeDrawer}
                      className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(18,134,216,0.75)] transition-all hover:-translate-y-0.5"
                    >
                      Alışverişe Başla
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                    <Link
                      to="/urun-secim-sihirbazi"
                      onClick={closeDrawer}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-aq-border/70 bg-white/70 px-5 py-3 text-sm font-medium text-aq-muted transition-colors hover:border-aq-blue/35 hover:text-aq-blue"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Ürün sihirbazı
                    </Link>
                  </div>
                  <div className="mt-8 flex items-center gap-2 rounded-full border border-aq-border/50 bg-white/60 px-3.5 py-2 text-[11px] text-aq-muted">
                    <Truck className="h-3.5 w-3.5 text-aq-blue" />
                    Ücretsiz kargo fırsatlarını kaçırmayın
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/80 bg-white/80 p-3 shadow-[0_12px_30px_-24px_rgba(6,38,61,0.45)] backdrop-blur-sm"
                      >
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-aq-border/40 bg-aq-ice">
                          <img
                            src={item.product.images?.[0] || '/images/products/placeholder.jpg'}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-aq-text">{item.product.name}</p>
                          <p className="mt-1 text-sm font-semibold text-aq-deep">
                            <CartLinePrice product={item.product} quantity={item.quantity} />
                          </p>
                          <div className="mt-2.5 inline-flex items-center gap-1 rounded-xl border border-aq-border/50 bg-aq-ice/80 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-aq-muted transition-colors hover:bg-white hover:text-aq-deep"
                              aria-label="Azalt"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-7 text-center text-sm font-semibold text-aq-deep">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-aq-muted transition-colors hover:bg-white hover:text-aq-deep"
                              aria-label="Artır"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          aria-label="Ürünü kaldır"
                          className={cn(
                            'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl',
                            'text-aq-muted transition-colors hover:bg-red-50 hover:text-red-500',
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="relative z-10 border-t border-aq-border/40 bg-white/80 p-5 min-w-0 backdrop-blur-xl">
                <OrderPriceBreakdown
                  totals={taxTotals}
                  taxConfig={taxConfig}
                  totalLabel="Toplam"
                  compact
                />
                <Link
                  to="/odeme"
                  onClick={closeDrawer}
                  className="group mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-aq-blue to-[#0d6fba] py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(18,134,216,0.75)] transition-all hover:-translate-y-0.5"
                >
                  Ödemeye Geç
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/sepet"
                  onClick={closeDrawer}
                  className="mt-2.5 block text-center text-xs font-medium text-aq-muted transition-colors hover:text-aq-blue"
                >
                  Sepet sayfasına git
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
