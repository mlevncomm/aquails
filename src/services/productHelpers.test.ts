import { describe, expect, it } from 'vitest';
import {
  normalizeSlug,
  validateAdminProductForm,
} from '@/services/productService';
import { validateProductImageFile } from '@/services/storageService';
import { fail, ok, requireRows } from '@/lib/mutationResult';
import { hasConfiguredBankAccounts } from '@/services/settingsService';

describe('normalizeSlug (production)', () => {
  it('lowercases and dashes', () => {
    expect(normalizeSlug('Aquails Su Arıtma')).toBe('aquails-su-aritma');
  });

  it('returns empty for blank input', () => {
    expect(normalizeSlug('   ')).toBe('');
  });
});

describe('validateAdminProductForm (production)', () => {
  const base = {
    name: 'Test',
    slug: 'test',
    categoryId: 'cat-1',
    shortDescription: '',
    description: '',
    price: 100,
    oldPrice: null as number | null,
    taxRate: 0,
    stock: 1,
    isActive: true,
    specifications: {},
  };

  it('accepts taxRate 0', () => {
    expect(validateAdminProductForm(base)).toBeNull();
  });

  it('rejects negative price/stock and invalid tax', () => {
    expect(validateAdminProductForm({ ...base, price: -1 })).toMatch(/fiyat/i);
    expect(validateAdminProductForm({ ...base, stock: -1 })).toMatch(/stok/i);
    expect(validateAdminProductForm({ ...base, taxRate: 101 })).toMatch(/KDV/i);
    expect(validateAdminProductForm({ ...base, oldPrice: -5 })).toMatch(/eski fiyat/i);
  });

  it('rejects empty name/slug/category', () => {
    expect(validateAdminProductForm({ ...base, name: '' })).toMatch(/ad/i);
    expect(validateAdminProductForm({ ...base, slug: '!!!' })).toMatch(/slug|adres/i);
    expect(validateAdminProductForm({ ...base, categoryId: '' })).toMatch(/Kategori/i);
  });
});

describe('image validation (production)', () => {
  it('rejects bad mime and oversized', () => {
    const bad = new File([new Uint8Array(10)], 'x.txt', { type: 'text/plain' });
    expect(validateProductImageFile(bad)).toBeTruthy();
    const big = new File([new Uint8Array(6 * 1024 * 1024)], 'x.jpg', { type: 'image/jpeg' });
    expect(validateProductImageFile(big)).toMatch(/5/);
  });
});

describe('mutation helpers', () => {
  it('treats zero rows as failure', () => {
    const result = requireRows([], 'zero');
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe('zero');
    expect(ok({ id: '1' }).success).toBe(true);
    expect(fail('x').success).toBe(false);
  });
});

describe('bank accounts', () => {
  it('rejects empty/fake TR00 accounts', () => {
    expect(hasConfiguredBankAccounts([])).toBe(false);
    expect(
      hasConfiguredBankAccounts([
        { bankName: 'Ziraat', accountName: 'X', iban: 'TR00 0000 0000 0000 0000 0000 00' },
      ]),
    ).toBe(false);
    expect(
      hasConfiguredBankAccounts([
        { bankName: 'Ziraat', accountName: 'X', iban: 'TR330006100519786457841326' },
      ]),
    ).toBe(true);
  });
});
