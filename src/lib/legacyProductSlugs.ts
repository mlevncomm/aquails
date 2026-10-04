/**
 * Product slugs that were renamed during the catalog cleanup (Oct 2026).
 * Old URLs stay reachable through a permanent redirect in middleware.ts.
 */
export const LEGACY_PRODUCT_SLUGS: Record<string, string> = {
  'https-aquails-com-tr-collections-su-aritma-products-orti-cc-87max-h2o-tesla-su-aritma-si-cc-87stemi-cc-87':
    'aquails-h2o-tesla-alkali-su-aritma-sistemi',
  'ort-100midi': 'aquails-aq-100-soft-midi-su-yumusatma-sistemi',
  'ort-150maxi': 'aquails-aq-150-softmax-maxi-su-yumusatma-sistemi',
  'aquails-ort-300-ro-sistem': 'aquails-aq-300-endustriyel-su-aritma-cihazi',
  'ort-600-ro': 'aquails-aq-600-endustriyel-su-aritma-cihazi',
  'aquails-or-115-aritmali-sebil': 'aquails-aq-115-aritmali-sebil',
  'wg-115-sebil-kopya': 'aquails-aq-351-aritmali-sebil',
  'wg-50-sebil': 'aquails-aq-50-aritmali-sebil',
  'wg-80-sebil': 'aquails-aq-80-aritmali-sebil',
  'aquails-h2o-green-plus-su-aritma-sistemi-1': 'aquails-10-3lu-bina-girisi-filtrasyon-sistemi',
  'aquails-20-3-lu-bina-giris-filtrasyon-aritma-sistemi-kopya': 'aquails-20-3lu-bina-girisi-filtrasyon-sistemi',
  'water-chef-filtreler-su-aritma': 'aquails-water-chef-direkt-akis-su-aritma-cihazi',
  'water-chef-filtreler': 'aquails-water-chef-yedek-filtre-seti',
  'daire-girisi-10-filtrasyon-sistemi': 'aquails-10-bina-girisi-yedek-filtre-seti',
};

/** Returns the current slug for a renamed product, or null when the slug is not legacy. */
export function resolveLegacyProductSlug(slug: string): string | null {
  return LEGACY_PRODUCT_SLUGS[slug] ?? null;
}
