import { useState, useEffect, useMemo } from 'react';
import { getShippingConfig, getTaxConfig, calcOrderTotals, type TaxConfig } from '@/services/shippingService';
import { getSiteSettings } from '@/services/settingsService';

const DEFAULT_TAX: TaxConfig = { rate: 20, displayInCheckout: true, priceIncludesVat: true };

export function useCartPricing(
  subtotal: number,
  options?: { codFee?: number; discount?: number },
) {
  const [taxConfig, setTaxConfig] = useState<TaxConfig>(DEFAULT_TAX);
  const [shippingCost, setShippingCost] = useState(49);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1500);
  const [loaded, setLoaded] = useState(false);

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
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;

  const orderTotals = useMemo(
    () =>
      calcOrderTotals({
        subtotal,
        shipping,
        codFee,
        discount,
        taxRate: taxConfig.rate,
        priceIncludesVat: taxConfig.priceIncludesVat,
      }),
    [subtotal, shipping, codFee, discount, taxConfig.rate, taxConfig.priceIncludesVat],
  );

  const freeShippingProgress = Math.min(100, freeShippingThreshold > 0 ? (subtotal / freeShippingThreshold) * 100 : 0);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return {
    taxConfig,
    shipping,
    shippingCost,
    codFee,
    discount,
    total: orderTotals.gross,
    orderTotals,
    freeShippingThreshold,
    freeShippingProgress,
    remainingForFreeShipping,
    loaded,
  };
}
