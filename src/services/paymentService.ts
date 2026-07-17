import { getSupabase } from '@/lib/supabase';

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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return { success: false, error: 'Ödeme için giriş yapmalısınız.' };
    }

    const res = await fetch('/api/paytr-init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = (await res.json()) as {
      success?: boolean;
      token?: string;
      error?: string;
      message?: string;
    };

    if (!res.ok || !result?.success || !result.token) {
      return {
        success: false,
        error: result?.error ?? result?.message ?? 'Ödeme başlatılamadı.',
      };
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
