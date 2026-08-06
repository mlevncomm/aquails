/** Product → category classification for Aquails catalog */

export const CATEGORY_CONFIG = [
  { slug: 'direkt-akis-ro', name: 'Direkt Akış RO Cihazları', icon: 'Zap', sortOrder: 1 },
  { slug: 'klasik-ro-sistemleri', name: 'Klasik RO Sistemleri', icon: 'Droplet', sortOrder: 2 },
  { slug: 'soft-kompakt', name: 'Soft / Kompakt Sistemler', icon: 'Settings', sortOrder: 3 },
  { slug: 'sebiller', name: 'Sebiller', icon: 'Coffee', sortOrder: 4 },
  { slug: 'bina-giris-filtrasyon', name: 'Bina Giriş Filtrasyonu', icon: 'Building2', sortOrder: 5 },
  { slug: 'filtreler-membranlar', name: 'Filtreler & Membranlar', icon: 'Filter', sortOrder: 6 },
  { slug: 'musluklar-aksesuarlar', name: 'Musluklar & Aksesuarlar', icon: 'Wrench', sortOrder: 7 },
];

const FILTER_ONLY_SLUGS = [
  'alkali-mineral-filtre',
  'aquails-1812-80gpd-membran',
  'aquails-alkaline-filtre',
  'aquails-antioxdant-orp-alkaline-filtre',
  'aquails-mineral-ph-stabilizer-filtre',
  'aquails-orp-filtre',
  'inline-filtreler',
  'post-karbon-filtre',
  'pro-inline-filtreler',
  'water-chef-filtreler',
];

const DIREKT_SLUGS = [
  'aquails-blue-drop-su-aritma-cihazi',
  'water-chef-filtreler-su-aritma',
  'aquails-h2o-drop-su-aritma-sistemi',
  'aquails-h2o-drop-plus-su-aritma-sistemi',
];

const SOFT_SLUGS = [
  'ort-100midi',
  'ort-150maxi',
  'aquails-eko-plus-su-aritma-sistemi',
  'aquails-h2o-neo-su-aritma-sistemi',
];

export function classifyProduct(slug, name = '') {
  const s = slug.toLowerCase();
  const n = name.toLowerCase();

  if (s.includes('sebil') || n.includes('sebil')) return 'sebiller';
  if (s.includes('bina-giris') || n.includes('bina giriş')) return 'bina-giris-filtrasyon';
  if (s.includes('musluk') || s.includes('batarya') || n.includes('musluk') || n.includes('batarya'))
    return 'musluklar-aksesuarlar';

  if (DIREKT_SLUGS.includes(s) || /direk(t)?\s*ak[ıi]ş|direk\s*akis/.test(n))
    return 'direkt-akis-ro';

  if (FILTER_ONLY_SLUGS.includes(s) || (s.includes('membran') && !s.includes('cihaz')))
    return 'filtreler-membranlar';
  if (s.includes('filtre') && !s.includes('su-aritma') && !s.includes('cihaz') && !s.includes('sistem'))
    return 'filtreler-membranlar';

  if (SOFT_SLUGS.includes(s) || s.includes('midi') || s.includes('maxi') || s.includes('eko') || s.includes('neo') || s.includes('kompakt'))
    return 'soft-kompakt';

  if (s.includes('su-aritma') || s.includes('ro-sistem') || s.includes('ro-sistemi') || s.includes('ort-'))
    return 'klasik-ro-sistemleri';

  if (s.includes('filtrasyon') || s.includes('filtre'))
    return 'filtreler-membranlar';

  return 'klasik-ro-sistemleri';
}
