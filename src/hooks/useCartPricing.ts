import { useState, useEffect, useMemo } from 'react';
import type { CartItem } from '@/types';
import { getShippingConfig, getTaxConfig, type TaxConfig } from '@/services/shippingService';
import { calculateCartTax, cartItemsToTaxLines } from '@/services/taxService';
import { getSiteSettings } from '@/services/settingsService';

const DEFAULT_TAX: TaxConfig = { rate: 20, displayInCheckout: true, priceIncludesVat: true };

export function useCartPricing(
  items: CartItem[],
  options?: { codFee?: number; discount?: number; shipping?: number },
) {
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX);
  const [shippingCost, setShippingCost] = useState(49);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [loaded, setLoaded] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    [items],
  );

  useEffect(() => {
    void Promise.all([
      getTaxConfig().then(setTaxConfig),
      getShippingConfig().then((cfg) => {
        const standard = cfg.methods.find((m) => m.id === 'standard') ?? cfg.methods[0];
        if (standard) setShippingCost(standard.price);
      }),
      getSiteSettings().then((s) => setFreeShippingThreshold(s.freeShippingThreshold)),
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
        config: taxConfig,
      }),
    [items, shipping, codFee, discount, taxConfig],
  );

  const freeShippingProgress = Math.min(
    100,
    freeShippingThreshold > 0 ? (subtotal / freeShippingThreshold) * 100 : 0,
  );
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return {
    taxConfig,
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
