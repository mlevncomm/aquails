import type { TaxCalculationResult, TaxConfigLike } from '@/services/taxService';

interface OrderPriceBreakdownProps {
  totals: TaxCalculationResult;
  taxConfig: TaxConfigLike;
  totalLabel?: string;
  className?: string;
  compact?: boolean;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}

export function OrderPriceBreakdown({
  totals,
  taxConfig,
  totalLabel = 'Ödenecek Toplam',
  className = '',
  compact = false,
}: OrderPriceBreakdownProps) {
  const { pricesIncludeVat, taxRate, totalTax, totalGross } = totals;
  const hasTax = taxRate > 0 && totalTax > 0;
  const vatAddedOnTop = !pricesIncludeVat;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Ürün ara toplamı */}
      <div className="flex justify-between text-sm gap-4">
        <span className="text-[#5A6B7B] shrink-0">
          {pricesIncludeVat ? 'Ürünler (KDV Dahil)' : `Ara Toplam${hasTax ? ' (KDV Hariç)' : ''}`}
        </span>
        <span className="font-medium text-[#0D2137] text-right">
          {formatPrice(pricesIncludeVat ? totals.linesGross : totals.linesNet)}
        </span>
      </div>

      <div className="flex justify-between text-sm gap-4">
        <span className="text-[#5A6B7B] shrink-0">
          Kargo {hasTax ? '(KDV Hariç)' : ''}
        </span>
        <span className={totals.shippingNet === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-[#0D2137]'}>
          {totals.shippingNet === 0 ? 'Ücretsiz' : formatPrice(totals.shippingNet)}
        </span>
      </div>

      {totals.codNet > 0 && (
        <div className="flex justify-between text-sm gap-4">
          <span className="text-[#5A6B7B] shrink-0">Kapıda Ödeme (KDV Hariç)</span>
          <span className="font-medium text-[#0D2137]">{formatPrice(totals.codNet)}</span>
        </div>
      )}

      {totals.discount > 0 && (
        <div className="flex justify-between text-sm text-emerald-600 gap-4">
          <span className="shrink-0">İndirim</span>
          <span>-{formatPrice(totals.discount)}</span>
        </div>
      )}

      {hasTax && taxConfig.displayInCheckout !== false && (
        <>
          {!compact && (
            <div className="flex justify-between text-sm gap-4 pt-1 border-t border-dashed border-[#E8F0FE]">
              <span className="text-[#5A6B7B] shrink-0">Matrah (KDV Hariç)</span>
              <span className="font-medium text-[#0D2137] text-right">{formatPrice(totals.totalNet)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm gap-4 bg-[#F0F6FF]/60 -mx-2 px-2 py-2 rounded-xl">
            <span className="text-[#0D2137] font-medium shrink-0">
              KDV (%{taxRate})
              {vatAddedOnTop ? '' : ' (dahil)'}
            </span>
            <span className="font-bold text-[#1A73E8] text-right">
              {vatAddedOnTop ? '+' : ''}{formatPrice(totalTax)}
            </span>
          </div>
          {!vatAddedOnTop && !compact && (
            <p className="text-[11px] text-[#8B9DAF] leading-snug">
              Ürün fiyatları KDV dahil girilmiştir. KDV tutarı bilgi amaçlı gösterilir; toplam fiyata tekrar eklenmez.
            </p>
          )}
        </>
      )}

      <div className="flex justify-between text-base font-semibold pt-3 border-t-2 border-[#E8F0FE] gap-4">
        <span className="text-[#0D2137] shrink-0">
          {totalLabel}
          {hasTax ? ' (KDV Dahil)' : ''}
        </span>
        <span className="text-xl font-bold text-[#1A73E8] text-right">{formatPrice(totalGross)}</span>
      </div>
    </div>
  );
}

export { calcOrderTotals } from '@/services/taxService';
