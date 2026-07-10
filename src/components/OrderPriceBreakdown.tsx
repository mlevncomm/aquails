import { calcOrderTotals, type TaxConfig } from '@/services/shippingService';

interface OrderPriceBreakdownProps {
  subtotal: number;
  shipping: number;
  codFee?: number;
  discount?: number;
  taxConfig: TaxConfig;
  totalLabel?: string;
  className?: string;
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`;
}

export function OrderPriceBreakdown({
  subtotal,
  shipping,
  codFee = 0,
  discount = 0,
  taxConfig,
  totalLabel = 'Genel Toplam',
  className = '',
}: OrderPriceBreakdownProps) {
  const totals = calcOrderTotals({
    subtotal,
    shipping,
    codFee,
    discount,
    taxRate: taxConfig.rate,
    priceIncludesVat: taxConfig.priceIncludesVat,
  });

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex justify-between text-sm gap-4">
        <span className="text-[#5A6B7B] shrink-0">Ara Toplam</span>
        <span className="font-medium text-[#0D2137] text-right">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm gap-4">
        <span className="text-[#5A6B7B] shrink-0">Kargo Bedeli</span>
        <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium text-[#0D2137]'}>
          {shipping === 0 ? 'Ücretsiz' : formatPrice(shipping)}
        </span>
      </div>
      {codFee > 0 && (
        <div className="flex justify-between text-sm gap-4">
          <span className="text-[#5A6B7B] shrink-0">Kapıda Ödeme</span>
          <span className="font-medium text-[#0D2137]">+{formatPrice(codFee)}</span>
        </div>
      )}
      {discount > 0 && (
        <div className="flex justify-between text-sm text-emerald-600 gap-4">
          <span className="shrink-0">İndirim</span>
          <span>-{formatPrice(discount)}</span>
        </div>
      )}
      {taxConfig.displayInCheckout && (
        <>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#5A6B7B] shrink-0">KDV Hariç Tutar</span>
            <span className="font-medium text-[#0D2137] text-right">{formatPrice(totals.net)}</span>
          </div>
          <div className="flex justify-between text-sm gap-4">
            <span className="text-[#5A6B7B] shrink-0">
              KDV (%{taxConfig.rate}){taxConfig.priceIncludesVat ? ' (dahil)' : ''}
            </span>
            <span className="font-medium text-[#0D2137] text-right">{formatPrice(totals.vat)}</span>
          </div>
        </>
      )}
      <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#F0F6FF] gap-4">
        <span className="text-[#0D2137] shrink-0">
          {totalLabel}
          {taxConfig.priceIncludesVat && taxConfig.displayInCheckout ? ' (KDV Dahil)' : ''}
        </span>
        <span className="text-xl font-bold text-[#0D2137] text-right">{formatPrice(totals.gross)}</span>
      </div>
    </div>
  );
}

export { calcOrderTotals };
