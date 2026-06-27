import { invokeFunction } from '@/lib/api';
import type { CreateOrderPayload } from '@/services/orderService';

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentStatus: string;
}

export async function checkout(payload: CreateOrderPayload): Promise<CheckoutResult> {
  return invokeFunction<CheckoutResult>('checkout', {
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    customerPhone: payload.customerPhone,
    paymentMethod: payload.paymentMethod,
    shippingAddress: payload.shippingAddress,
    note: payload.note,
    couponCode: payload.couponCode,
    serviceSlotId: payload.serviceSlotId,
    sessionId: payload.sessionId ?? localStorage.getItem('aquails_cart_session') ?? undefined,
  });
}
