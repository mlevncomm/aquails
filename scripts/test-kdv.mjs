/**
 * KDV ve fiyat hesaplama smoke testleri
 */

function calcVatAmount(grossPrice, taxRate, includesVat) {
  if (includesVat) {
    const net = grossPrice / (1 + taxRate / 100);
    return { net, vat: grossPrice - net, gross: grossPrice };
  }
  const vat = grossPrice * (taxRate / 100);
  return { net: grossPrice, vat, gross: grossPrice + vat };
}

function calcOrderTotals(input) {
  const base = Math.max(0, input.subtotal + input.shipping + (input.codFee ?? 0) - (input.discount ?? 0));
  const { net, vat, gross } = calcVatAmount(base, input.taxRate, input.priceIncludesVat);
  return { ...input, net, vat, gross };
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

console.log('KDV / Order Totals Tests\n');

const withVat = calcOrderTotals({
  subtotal: 2899,
  shipping: 0,
  discount: 0,
  taxRate: 20,
  priceIncludesVat: true,
});

assert(withVat.gross === 2899, `KDV dahil toplam 2899₺ olmalı (got ${withVat.gross})`);
assert(withVat.vat > 0, `KDV tutarı > 0 olmalı (got ${withVat.vat.toFixed(2)})`);
assert(Math.abs(withVat.net + withVat.vat - withVat.gross) < 0.02, 'net + kdv = gross');
console.log(`    → KDV: ${withVat.vat.toFixed(2)}₺, Net: ${withVat.net.toFixed(2)}₺`);

const withShipping = calcOrderTotals({
  subtotal: 2899,
  shipping: 49,
  discount: 0,
  taxRate: 20,
  priceIncludesVat: true,
});

assert(withShipping.gross === 2948, `Kargo ile toplam 2948₺ (got ${withShipping.gross})`);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
