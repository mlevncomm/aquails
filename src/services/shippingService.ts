import { getSupabaseOrNull } from '@/lib/supabase';
import { calculateCartTax } from '@/services/taxService';

export interface ShippingMethod {
  id: string;
  label: string;
  desc: string;
  price: number;
  days: string;
}

export interface ShippingConfig {
  methods: ShippingMethod[];
  codFee: number;
}

export interface TaxConfig {
  rate: number;
  displayInCheckout: boolean;
  priceIncludesVat: boolean;
}

const DEFAULT_SHIPPING: ShippingConfig = {
  methods: [
    { id: 'standard', label: 'Standart Kargo', desc: '3-5 iş günü içinde teslimat', price: 0, days: '3-5' },
    { id: 'fast', label: 'Hızlı Kargo', desc: '1-2 iş günü içinde teslimat', price: 49, days: '1-2' },
    { id: 'same', label: 'Aynı Gün Teslimat', desc: 'Bugün teslimat (İstanbul)', price: 99, days: '0' },
  ],
  codFee: 150,
};

const DEFAULT_TAX: TaxConfig = { rate: 20, displayInCheckout: true, priceIncludesVat: true };

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return fallback;
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).maybeSingle();
  if (!data?.value || typeof data.value !== 'object') return fallback;
  return { ...fallback, ...(data.value as Record<string, unknown>) } as T;
}

async function setSetting(key: string, value: Record<string, unknown>): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseOrNull();
  if (!supabase) return { success: false, error: 'Servis yapılandırılmamış.' };
  const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getShippingConfig(): Promise<ShippingConfig> {
  return getSetting<ShippingConfig>('shipping_methods', DEFAULT_SHIPPING);
}

export async function saveShippingConfig(config: ShippingConfig): Promise<{ success: boolean; error?: string }> {
  return setSetting('shipping_methods', config as unknown as Record<string, unknown>);
}

export async function getTaxConfig(): Promise<TaxConfig> {
  const raw = await getSetting<Partial<TaxConfig>>('tax', DEFAULT_TAX);
  const rate = Number(raw.rate);
  return {
    rate: Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_TAX.rate,
    displayInCheckout: raw.displayInCheckout !== false && raw.displayInCheckout !== ('false' as unknown as boolean),
    priceIncludesVat: raw.priceIncludesVat !== false && raw.priceIncludesVat !== ('false' as unknown as boolean),
  };
}

export async function saveTaxConfig(config: TaxConfig): Promise<{ success: boolean; error?: string }> {
  return setSetting('tax', config as unknown as Record<string, unknown>);
}

export function calcVatAmount(grossPrice: number, taxRate: number, includesVat: boolean): { net: number; vat: number; gross: number } {
  if (includesVat) {
    const net = grossPrice / (1 + taxRate / 100);
    return { net, vat: grossPrice - net, gross: grossPrice };
  }
  const vat = grossPrice * (taxRate / 100);
  return { net: grossPrice, vat, gross: grossPrice + vat };
}

export interface OrderTotalsInput {
  subtotal: number;
  shipping: number;
  codFee?: number;
  discount?: number;
  taxRate: number;
  priceIncludesVat: boolean;
}

export interface OrderTotalsResult extends OrderTotalsInput {
  net: number;
  vat: number;
  gross: number;
}

export function calcOrderTotals(input: OrderTotalsInput): OrderTotalsResult {
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
