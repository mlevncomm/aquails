/**
 * WooCommerce tarzı vergi hesaplama motoru.
 *
 * Kurallar (WooCommerce docs):
 * - Ürün fiyatları admin ayarına göre KDV dahil veya hariç girilir
 * - Kargo ücretleri her zaman KDV hariç girilir; vergi üstüne eklenir
 * - Vergi satır (line) bazında hesaplanır
 */

export interface CartLineForTax {
  unitPrice: number;
  quantity: number;
  /** Ürün bazlı KDV oranı; yoksa varsayılan kullanılır */
  taxRate?: number;
}

export interface TaxConfigLike {
  rate: number;
  priceIncludesVat: boolean;
  displayInCheckout: boolean;
}

export interface TaxCalculationInput {
  lines: CartLineForTax[];
  shipping: number;
  codFee?: number;
  discount?: number;
  config: TaxConfigLike;
}

export interface TaxCalculationResult {
  /** Ürün satırları */
  linesNet: number;
  linesTax: number;
  linesGross: number;
  /** Kargo (her zaman KDV hariç girilir) */
  shippingNet: number;
  shippingTax: number;
  shippingGross: number;
  /** Kapıda ödeme */
  codNet: number;
  codTax: number;
  codGross: number;
  discount: number;
  /** Genel */
  subtotalNet: number;
  subtotalTax: number;
  subtotalGross: number;
  totalNet: number;
  totalTax: number;
  /** Ödenecek tutar (PayTR / sipariş) */
  totalGross: number;
  pricesIncludeVat: boolean;
  taxRate: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function lineRate(line: CartLineForTax, defaultRate: number): number {
  const r = line.taxRate ?? defaultRate;
  return r > 0 ? r : defaultRate;
}

/** Tek satır: fiyatların KDV dahil girildiği mod */
function lineFromInclusive(unitPrice: number, qty: number, rate: number) {
  const gross = unitPrice * qty;
  const net = gross / (1 + rate / 100);
  return { net: round2(net), tax: round2(gross - net), gross: round2(gross) };
}

/** Tek satır: fiyatların KDV hariç girildiği mod */
function lineFromExclusive(unitPrice: number, qty: number, rate: number) {
  const net = unitPrice * qty;
  const tax = net * (rate / 100);
  return { net: round2(net), tax: round2(tax), gross: round2(net + tax) };
}

/** Kargo / ek ücret — WooCommerce: her zaman KDV hariç, vergi eklenir */
function feeWithTax(amount: number, rate: number) {
  if (amount <= 0) return { net: 0, tax: 0, gross: 0 };
  const net = round2(amount);
  const tax = round2(net * (rate / 100));
  return { net, tax, gross: round2(net + tax) };
}

/**
 * WooCommerce uyumlu sepet vergi hesabı
 */
export function calculateCartTax(input: TaxCalculationInput): TaxCalculationResult {
  const { lines, shipping, codFee = 0, discount = 0, config } = input;
  const defaultRate = config.rate > 0 ? config.rate : 20;
  const incl = config.priceIncludesVat;

  let linesNet = 0;
  let linesTax = 0;
  let linesGross = 0;

  for (const line of lines) {
    const rate = lineRate(line, defaultRate);
    const part = incl
      ? lineFromInclusive(line.unitPrice, line.quantity, rate)
      : lineFromExclusive(line.unitPrice, line.quantity, rate);
    linesNet += part.net;
    linesTax += part.tax;
    linesGross += part.gross;
  }

  linesNet = round2(linesNet);
  linesTax = round2(linesTax);
  linesGross = round2(linesGross);

  // İndirim ürün ara toplamına uygulanır (WooCommerce kupon mantığı)
  if (discount > 0) {
    if (incl) {
      linesGross = round2(Math.max(0, linesGross - discount));
      linesNet = round2(linesGross / (1 + defaultRate / 100));
      linesTax = round2(linesGross - linesNet);
    } else {
      linesNet = round2(Math.max(0, linesNet - discount));
      linesTax = round2(linesNet * (defaultRate / 100));
      linesGross = round2(linesNet + linesTax);
    }
  }

  const ship = feeWithTax(shipping, defaultRate);
  const cod = feeWithTax(codFee, defaultRate);

  const subtotalNet = linesNet;
  const subtotalTax = linesTax;
  const subtotalGross = linesGross;

  const totalNet = round2(subtotalNet + ship.net + cod.net);
  const totalTax = round2(subtotalTax + ship.tax + cod.tax);
  const totalGross = round2(subtotalGross + ship.gross + cod.gross);

  return {
    linesNet,
    linesTax,
    linesGross,
    shippingNet: ship.net,
    shippingTax: ship.tax,
    shippingGross: ship.gross,
    codNet: cod.net,
    codTax: cod.tax,
    codGross: cod.gross,
    discount,
    subtotalNet,
    subtotalTax,
    subtotalGross,
    totalNet,
    totalTax,
    totalGross,
    pricesIncludeVat: incl,
    taxRate: defaultRate,
  };
}

/** Geriye dönük uyumluluk — basit toplam hesabı */
export function calcOrderTotals(input: {
  subtotal: number;
  shipping: number;
  codFee?: number;
  discount?: number;
  taxRate: number;
  priceIncludesVat: boolean;
}) {
  const result = calculateCartTax({
    lines: [{ unitPrice: input.subtotal, quantity: 1 }],
    shipping: input.shipping,
    codFee: input.codFee,
    discount: input.discount,
    config: {
      rate: input.taxRate,
      priceIncludesVat: input.priceIncludesVat,
      displayInCheckout: true,
    },
  });
  return {
    ...input,
    codFee: input.codFee ?? 0,
    discount: input.discount ?? 0,
    net: result.totalNet,
    vat: result.totalTax,
    gross: result.totalGross,
  };
}

export function cartItemsToTaxLines(
  items: { product: { price: number; taxRate?: number }; quantity: number }[],
): CartLineForTax[] {
  return items.map((item) => ({
    unitPrice: item.product.price,
    quantity: item.quantity,
    taxRate: item.product.taxRate,
  }));
}
