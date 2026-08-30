/** Canonical public contact number for header, footer, tel/WhatsApp links, and schema. */
export const CONTACT_PHONE_DISPLAY = '+90 535 223 03 16';
export const CONTACT_PHONE_TEL = '+905352230316';
export const CONTACT_WHATSAPP_DIGITS = '905352230316';
export const CONTACT_PHONE_SCHEMA = '+90-535-223-0316';

const PLACEHOLDER_DIGIT_SETS = new Set([
  '08501234567',
  '8501234567',
  '908501234567',
  '8500000000',
  '908500000000',
  '5001234567',
  '905001234567',
  '05321234567',
  '5321234567',
  '905321234567',
]);

/** Prefer a real configured number; map empty/demo placeholders to the canonical line. */
export function resolveContactPhone(value?: string | null): string {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return CONTACT_PHONE_DISPLAY;
  const digits = trimmed.replace(/\D/g, '');
  if (PLACEHOLDER_DIGIT_SETS.has(digits)) return CONTACT_PHONE_DISPLAY;
  return trimmed;
}

export function telHref(phone: string = CONTACT_PHONE_DISPLAY): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return `tel:${CONTACT_PHONE_TEL}`;
  if (digits.startsWith('90')) return `tel:+${digits}`;
  if (digits.startsWith('0')) return `tel:+90${digits.slice(1)}`;
  return `tel:+${digits}`;
}
