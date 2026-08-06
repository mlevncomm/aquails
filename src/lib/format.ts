export function formatDateTR(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(iso).toLocaleDateString('tr-TR', options ?? {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTimeTR(iso: string): string {
  return new Date(iso).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('tr-TR')}₺`;
}
