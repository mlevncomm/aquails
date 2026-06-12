const WHATSAPP_NUMBER = '905321234567';

export function getWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

export function openWhatsApp(message?: string): void {
  window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

export function getProductInquiryMessage(productName: string): string {
  return `Merhaba, ${productName} hakkında bilgi almak istiyorum.`;
}

export function getProductOrderMessage(productName: string, price: number): string {
  return `Merhaba, ${productName} (${price.toLocaleString('tr-TR')} ₺) ürününü sipariş etmek istiyorum.`;
}

export function getCartOrderMessage(items: Array<{ name: string; quantity: number; price: number }>, total: number): string {
  const itemsText = items.map(i => `- ${i.name} x${i.quantity} = ${(i.price * i.quantity).toLocaleString('tr-TR')} ₺`).join('\n');
  return `Merhaba, aşağıdaki ürünleri sipariş etmek istiyorum:\n\n${itemsText}\n\nToplam: ${total.toLocaleString('tr-TR')} ₺\n\nLütfen benimle iletişime geçin.`;
}

export function getServiceRequestMessage(serviceType: string): string {
  return `Merhaba, ${serviceType} için servis randevusu almak istiyorum.`;
}

export function getFilterChangeMessage(deviceModel: string): string {
  return `Merhaba, ${deviceModel} cihazım için filtre değişimi talep ediyorum.`;
}
