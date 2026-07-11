import { useState, useEffect } from 'react';
import type { Product } from '@/types';
import { getTaxConfig } from '@/services/shippingService';
import {
  getProductGrossPrice,
  getProductGrossOldPrice,
  getProductTaxRate,
  formatTry,
  formatTryShort,
} from '@/lib/pricing';

export function useProductDisplayPrice(product: Pick<Product, 'price' | 'taxRate' | 'oldPrice'>) {
  const [defaultTaxRate, setDefaultTaxRate] = useState(20);

  useEffect(() => {
    void getTaxConfig().then((cfg) => setDefaultTaxRate(cfg.rate));
  }, []);

  const taxRate = getProductTaxRate(product, defaultTaxRate);
  const grossPrice = getProductGrossPrice(product, defaultTaxRate);
  const grossOldPrice = getProductGrossOldPrice(product, defaultTaxRate);

  return {
    netPrice: product.price,
    taxRate,
    grossPrice,
    grossOldPrice,
    formattedGross: formatTryShort(grossPrice),
    formattedGrossFull: formatTry(grossPrice),
    formattedOldGross: grossOldPrice != null ? formatTryShort(grossOldPrice) : null,
  };
}

export function useDefaultTaxRate(): number {
  const [rate, setRate] = useState(20);
  useEffect(() => {
    void getTaxConfig().then((cfg) => setRate(cfg.rate));
  }, []);
  return rate;
}
