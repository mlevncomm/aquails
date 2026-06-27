import { describe, expect, it } from 'vitest';
import { getDataProvider } from '@/lib/dataProvider';

describe('dataProvider', () => {
  it('defaults to supabase when env is unset', () => {
    expect(getDataProvider()).toBe('supabase');
  });
});

describe('coupon math', () => {
  it('calculates percent discount', () => {
    const subtotal = 1000;
    const percent = 10;
    const discount = Math.round(subtotal * (percent / 100) * 100) / 100;
    expect(discount).toBe(100);
  });

  it('caps fixed discount at subtotal', () => {
    const subtotal = 80;
    const fixed = 100;
    expect(Math.min(fixed, subtotal)).toBe(80);
  });
});
