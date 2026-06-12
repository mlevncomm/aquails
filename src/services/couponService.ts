export interface Coupon {
  code: string;
  type: 'percent' | 'fixed' | 'shipping';
  value: number;
  minOrder?: number;
}

const COUPONS: Coupon[] = [
  { code: 'AQUAILS10', type: 'percent', value: 10, minOrder: 1000 },
  { code: 'FILTRE250', type: 'fixed', value: 250, minOrder: 2000 },
  { code: 'KARGO', type: 'shipping', value: 0, minOrder: 0 },
];

export function validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; discount: number; message?: string } {
  const c = COUPONS.find(cp => cp.code === code.toUpperCase());
  if (!c) return { valid: false, discount: 0, message: 'Geçersiz kupon kodu.' };
  if (c.minOrder && subtotal < c.minOrder) return { valid: false, discount: 0, message: `Minimum ${c.minOrder.toLocaleString('tr-TR')}₺ sipariş gerekli.` };

  let discount = 0;
  if (c.type === 'percent') discount = Math.round(subtotal * c.value / 100);
  else if (c.type === 'fixed') discount = c.value;
  else if (c.type === 'shipping') discount = -1;

  return { valid: true, coupon: c, discount };
}
