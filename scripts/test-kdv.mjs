/**
 * WooCommerce tarzı KDV / sepet toplam testleri
 */

function round2(n) {
  return Math.round(n * 100) / 100;
}

function lineFromInclusive(unitPrice, qty, rate) {
  const gross = unitPrice * qty;
  const net = gross / (1 + rate / 100);
  return { net: round2(net), tax: round2(gross - net), gross: round2(gross) };
}

function lineFromExclusive(unitPrice, qty, rate) {
  const net = unitPrice * qty;
  const tax = net * (rate / 100);
  return { net: round2(net), tax: round2(tax), gross: round2(net + tax) };
}

function feeWithTax(amount, rate) {
  if (amount <= 0) return { net: 0, tax: 0, gross: 0 };
  const net = round2(amount);
  const tax = round2(net * (rate / 100));
  return { net, tax, gross: round2(net + tax) };
}

function calculateCartTax({ lines, shipping, codFee = 0, discount = 0, config }) {
  const defaultRate = config.rate > 0 ? config.rate : 20;
  const incl = config.priceIncludesVat;

  let linesNet = 0;
  let linesTax = 0;
  let linesGross = 0;

  for (const line of lines) {
    const rate = line.taxRate ?? defaultRate;
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

  const totalNet = round2(linesNet + ship.net + cod.net);
  const totalTax = round2(linesTax + ship.tax + cod.tax);
  const totalGross = round2(linesGross + ship.gross + cod.gross);

  return { linesGross, linesTax, shippingTax: ship.tax, totalTax, totalGross, pricesIncludeVat: incl };
}

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${msg}`);
  } else {
    failed++;
    console.error(`  ✗ ${msg}`);
  }
}

console.log('WooCommerce KDV / Sepet Toplam Testleri\n');

// Kullanıcı senaryosu: 100₺ net + %20 KDV = 120₺
const userCase = calculateCartTax({
  lines: [{ unitPrice: 100, quantity: 1, taxRate: 20 }],
  shipping: 0,
  config: { rate: 20, priceIncludesVat: false },
});
assert(userCase.totalGross === 120, `100₺ + %20 KDV = 120₺ (got ${userCase.totalGross})`);

// KDV dahil fiyat — ürün toplamı aynı kalır
const inclProduct = calculateCartTax({
  lines: [{ unitPrice: 2899, quantity: 1 }],
  shipping: 0,
  config: { rate: 20, priceIncludesVat: true },
});
assert(inclProduct.totalGross === 2899, `KDV dahil ürün: toplam 2899₺ (got ${inclProduct.totalGross})`);
assert(inclProduct.linesTax > 0, `KDV tutarı gösterilmeli (got ${inclProduct.linesTax})`);

// KDV dahil + kargo — kargo KDV'si toplama eklenir (WooCommerce)
const inclWithShip = calculateCartTax({
  lines: [{ unitPrice: 2899, quantity: 1 }],
  shipping: 49,
  config: { rate: 20, priceIncludesVat: true },
});
assert(inclWithShip.totalGross === 2957.8, `KDV dahil + kargo: 2957.80₺ (got ${inclWithShip.totalGross})`);
assert(inclWithShip.shippingTax === 9.8, `Kargo KDV 9.80₺ (got ${inclWithShip.shippingTax})`);

// KDV hariç fiyat — KDV toplama eklenir
const exclProduct = calculateCartTax({
  lines: [{ unitPrice: 2899, quantity: 1 }],
  shipping: 0,
  config: { rate: 20, priceIncludesVat: false },
});
assert(exclProduct.totalGross === 3478.8, `KDV hariç ürün: 3478.80₺ (got ${exclProduct.totalGross})`);
assert(exclProduct.totalTax === 579.8, `KDV 579.80₺ eklenmeli (got ${exclProduct.totalTax})`);

// KDV hariç + kargo + kapıda ödeme
const exclFull = calculateCartTax({
  lines: [{ unitPrice: 1000, quantity: 2 }],
  shipping: 49,
  codFee: 150,
  config: { rate: 20, priceIncludesVat: false },
});
assert(exclFull.totalGross === 2638.8, `KDV hariç tam sepet: 2638.80₺ (got ${exclFull.totalGross})`);

// İndirim
const withDiscount = calculateCartTax({
  lines: [{ unitPrice: 2899, quantity: 1 }],
  shipping: 49,
  discount: 100,
  config: { rate: 20, priceIncludesVat: true },
});
assert(Math.abs(withDiscount.totalGross - 2857.8) < 0.01, `İndirimli KDV dahil: 2857.80₺ (got ${withDiscount.totalGross})`);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
