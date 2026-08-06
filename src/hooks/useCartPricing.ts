import { useState, useEffect, useMemo } from 'react';
import type { CartItem } from '@/types';
import { getShippingConfig, getTaxConfig, getEffectiveTaxRate, type TaxConfig } from '@/services/shippingService';
import { calculateCartTax, cartItemsToTaxLines } from '@/services/taxService';
import { getProductGrossPrice } from '@/lib/pricing';
import { getSiteConfig } from '@/services/settingsService';

const DEFAULT_TAX: TaxConfig = { enabled: true, rate: 20, displayInCheckout: true, priceIncludesVat: false };

export function useCartPricing(
  items: CartItem[],
  options?: { codFee?: number; discount?: number; shipping?: number },
) {
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX);
  const [shippingCost, setShippingCost] = useState(49);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [loaded, setLoaded] = useState(false);

  const effectiveRate = getEffectiveTaxRate(taxConfig);

  const pricingTaxConfig = useMemo(
    () => ({
      ...taxConfig,
      rate: effectiveRate,
      enabled: taxConfig.enabled,
    }),
    [taxConfig, effectiveRate],
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + getProductGrossPrice(i.product, effectiveRate) * i.quantity,
        0,
      ),
    [items, effectiveRate],
  );

  useEffect(() => {
    void Promise.all([
      getTaxConfig().then(setTaxConfig),
      getShippingConfig().then((cfg) => {
        const standard = cfg.methods.find((m) => m.id === 'standard') ?? cfg.methods[0];
        if (standard) setShippingCost(standard.price);
      }),
      getSiteConfig().then((s) => setFreeShippingThreshold(s.freeShippingLimit)),
    ]).finally(() => setLoaded(true));
  }, []);

  const codFee = options?.codFee ?? 0;
  const discount = options?.discount ?? 0;
  const autoShipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const shipping = options?.shipping ?? autoShipping;

  const taxTotals = useMemo(
    () =>
      calculateCartTax({
        lines: cartItemsToTaxLines(items),
        shipping,
        codFee,
        discount,
        config: { ...pricingTaxConfig, priceIncludesVat: false },
      }),
    [items, shipping, codFee, discount, pricingTaxConfig],
  );

  const freeShippingProgress = Math.min(
    100,
    freeShippingThreshold > 0 ? (subtotal / freeShippingThreshold) * 100 : 0,
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return {
    /** Fiyatlandırma için efektif config (KDV kapalıysa rate=0) */
    taxConfig: pricingTaxConfig,
    shipping,
    shippingCost,
    codFee,
    discount,
    subtotal,
    total: taxTotals.totalGross,
    taxTotals,
    freeShippingThreshold,
    freeShippingProgress,
    remainingForFreeShipping,
    loaded,
  };
}
