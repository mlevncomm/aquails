import type { Product } from '@/types';

const DEFAULT_TAX_RATE = 20;

export function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Ürün satırı KDV oranı (%). Ürün bazlı yoksa site varsayılanı. */
export function getProductTaxRate(product: Pick<Product, 'taxRate'>, defaultRate = DEFAULT_TAX_RATE): number {
  const rate = product.taxRate ?? defaultRate;
  return rate > 0 ? rate : defaultRate;
}

/** Net fiyat + KDV = müşterinin gördüğü fiyat (ör. 100 + %20 = 120) */
export function getGrossPrice(netPrice: number, taxRate: number): number {
  return roundPrice(netPrice * (1 + taxRate / 100));
}

export function getProductGrossPrice(
  product: Pick<Product, 'price' | 'taxRate'> & { oldPrice?: number | null },
  defaultRate = DEFAULT_TAX_RATE,
): number {
  return getGrossPrice(product.price, getProductTaxRate(product, defaultRate));
}

export function getProductGrossOldPrice(
  product: Pick<Product, 'oldPrice' | 'taxRate'>,
  defaultRate = DEFAULT_TAX_RATE,
): number | null {
  if (product.oldPrice == null) return null;
  return getGrossPrice(product.oldPrice, getProductTaxRate(product, defaultRate));
}

export function formatTry(value: number, decimals = 2): string {
  return `${value.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ₺`;
}

export function formatTryShort(value: number): string {
  return `${value.toLocaleString('tr-TR')} ₺`;
}
