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
        <span className="text-aq-muted shrink-0">
          {pricesIncludeVat ? 'Ürünler (KDV Dahil)' : `Ara Toplam${hasTax ? ' (KDV Hariç)' : ''}`}
        </span>
        <span className="font-medium text-aq-text text-right">
          {formatPrice(pricesIncludeVat ? totals.linesGross : totals.linesNet)}
        </span>
      </div>

      <div className="flex justify-between text-sm gap-4">
        <span className="text-aq-muted shrink-0">
          Kargo {hasTax ? '(KDV Hariç)' : ''}
        </span>
        <span className={totals.shippingNet === 0 ? 'text-aq-blue font-medium' : 'font-medium text-aq-text'}>
          {totals.shippingNet === 0 ? 'Ücretsiz' : formatPrice(totals.shippingNet)}
        </span>
      </div>

      {totals.codNet > 0 && (
        <div className="flex justify-between text-sm gap-4">
          <span className="text-aq-muted shrink-0">Kapıda Ödeme (KDV Hariç)</span>
          <span className="font-medium text-aq-text">{formatPrice(totals.codNet)}</span>
        </div>
      )}

      {totals.discount > 0 && (
        <div className="flex justify-between text-sm text-aq-blue gap-4">
          <span className="shrink-0">İndirim</span>
          <span>-{formatPrice(totals.discount)}</span>
        </div>
      )}

      {hasTax && taxConfig.displayInCheckout !== false && (
        <>
          {!compact && (
            <div className="flex justify-between text-sm gap-4 pt-1 border-t border-dashed border-aq-border/60">
              <span className="text-aq-muted shrink-0">Matrah (KDV Hariç)</span>
              <span className="font-medium text-aq-text text-right">{formatPrice(totals.totalNet)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm gap-4 bg-aq-ice/60 -mx-2 px-2 py-2 rounded-xl">
            <span className="text-aq-text font-medium shrink-0">
              KDV (%{taxRate})
              {vatAddedOnTop ? '' : ' (dahil)'}
            </span>
            <span className="font-semibold text-aq-blue text-right">
              {vatAddedOnTop ? '+' : ''}{formatPrice(totalTax)}
            </span>
          </div>
          {!vatAddedOnTop && !compact && (
            <p className="text-[11px] text-aq-muted leading-snug">
              Ürün fiyatları KDV dahil girilmiştir. KDV tutarı bilgi amaçlı gösterilir; toplam fiyata tekrar eklenmez.
            </p>
          )}
        </>
      )}

      <div className="flex justify-between text-base font-semibold pt-3 border-t-2 border-aq-border/60 gap-4">
        <span className="text-aq-text shrink-0">
          {totalLabel}
          {hasTax ? ' (KDV Dahil)' : ''}
        </span>
        <span className="text-xl font-semibold text-aq-blue text-right">{formatPrice(totalGross)}</span>
      </div>
    </div>
  );
}

export { calcOrderTotals } from '@/services/taxService';
