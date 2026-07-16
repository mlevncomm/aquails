import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useCartPricing } from '@/hooks/useCartPricing';
import { OrderPriceBreakdown } from '@/components/OrderPriceBreakdown';
import { CartLinePrice } from '@/components/CartLinePrice';

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem } = useCartStore();
  const { taxConfig, taxTotals } = useCartPricing(items);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-aq-deep/40 z-50"
            onClick={closeDrawer}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-50 shadow-drawer flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-aq-border/60">
              <h3 className="text-lg font-semibold text-aq-text flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-aq-blue" />
                Sepetim
              </h3>
              <button
                onClick={closeDrawer}
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-aq-ice transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 min-w-0">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-aq-border mb-4" />
                  <p className="text-lg font-semibold text-aq-muted">Sepetiniz boş</p>
                  <p className="text-sm text-aq-muted mt-1">Ürünleri keşfetmeye başlayın</p>
                  <Link
                    to="/urunler"
                    onClick={closeDrawer}
                    className="mt-5 bg-aq-blue text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-colors"
                  >
                    Alışverişe Başla
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 pb-4 border-b border-aq-border/60 last:border-0 min-w-0"
                      >
                        <div className="w-[60px] h-[60px] bg-aq-ice rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                          <img
                            src={item.product.images?.[0] || '/images/products/placeholder.jpg'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-aq-text truncate">{item.product.name}</p>
                          <p className="text-sm font-semibold text-aq-text mt-1">
                            <CartLinePrice product={item.product} quantity={item.quantity} />
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-aq-ice text-aq-muted hover:bg-aq-border transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-aq-ice text-aq-muted hover:bg-aq-border transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-aq-muted hover:bg-red-50 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-aq-border/60 bg-white min-w-0">
                <OrderPriceBreakdown
                  totals={taxTotals}
                  taxConfig={taxConfig}
                  totalLabel="Toplam"
                  compact
                />
                <Link
                  to="/odeme"
                  onClick={closeDrawer}
                  className="flex items-center justify-center gap-2 w-full bg-aq-blue text-white py-3.5 rounded-xl font-semibold hover:bg-aq-deep hover:text-white transition-all mt-4"
                >
                  Ödemeye Geç
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
