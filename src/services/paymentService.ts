import { getSupabase } from '@/lib/supabase';
import type { PaytrSettings } from '@/services/settingsService';

export interface PaytrInitResult {
  success: boolean;
  token?: string;
  iframeUrl?: string;
  error?: string;
}

export interface PaytrInitPayload {
  orderId: string;
  orderNumber: string;
  email: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  paymentAmount: number;
  userBasket: [string, string, number][];
  merchantOkUrl: string;
  merchantFailUrl: string;
}

export async function initPaytrPayment(payload: PaytrInitPayload): Promise<PaytrInitResult> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase.functions.invoke('paytr-init', {
      body: payload,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const result = data as { success?: boolean; token?: string; error?: string; message?: string };
    if (!result?.success || !result.token) {
      return { success: false, error: result?.error ?? result?.message ?? 'Ödeme başlatılamadı.' };
    }

    return {
      success: true,
      token: result.token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${result.token}`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Ödeme servisi hatası.',
    };
  }
}

export function buildPaytrBasket(
  items: { name: string; price: number; qty: number }[]
): [string, string, number][] {
  return items.map((item) => [item.name, item.price.toFixed(2), item.qty]);
}

export function sanitizeMerchantOid(orderNumber: string): string {
  return orderNumber.replace(/[^a-zA-Z0-9]/g, '').slice(0, 64);
}

export function formatPaymentAmountKurus(total: number): number {
  return Math.round(total * 100);
}

export function maskPaytrSettings(settings: PaytrSettings): PaytrSettings {
  return {
    ...settings,
    merchantKey: settings.merchantKey ? '••••••••' : '',
    merchantSalt: settings.merchantSalt ? '••••••••' : '',
  };
}
