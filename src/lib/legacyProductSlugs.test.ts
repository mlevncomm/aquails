import { describe, expect, it } from 'vitest';
import { LEGACY_PRODUCT_SLUGS, resolveLegacyProductSlug } from '@/lib/legacyProductSlugs';

describe('resolveLegacyProductSlug', () => {
  it('maps renamed products to their new slug', () => {
    expect(resolveLegacyProductSlug('ort-600-ro')).toBe('aquails-aq-600-endustriyel-su-aritma-cihazi');
  });

  it('returns null for current slugs', () => {
    expect(resolveLegacyProductSlug('aquails-blue-drop-su-aritma-cihazi')).toBeNull();
  });

  it('never redirects to another legacy slug or to a malformed slug', () => {
    for (const target of Object.values(LEGACY_PRODUCT_SLUGS)) {
      expect(LEGACY_PRODUCT_SLUGS[target]).toBeUndefined();
      expect(target).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('keeps every new slug unique', () => {
    const targets = Object.values(LEGACY_PRODUCT_SLUGS);
    expect(new Set(targets).size).toBe(targets.length);
  });
});
