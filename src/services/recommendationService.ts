import { products as fallbackProducts } from '@/data';
import type { Product } from '@/types';

export interface WizardAnswers {
  place: string;
  people: string;
  systemType: string;
  priority: string;
  budget: string;
  installation: string;
  subscription: string;
}

export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
  tags: string[];
}

const DEFAULT_ANSWERS: WizardAnswers = {
  place: '',
  people: '',
  systemType: '',
  priority: '',
  budget: '',
  installation: '',
  subscription: '',
};

/** Cihaz kategorileri (filtre / aksesuar hariç) */
const DEVICE_SLUGS = new Set([
  'direkt-akis-ro',
  'klasik-ro-sistemleri',
  'soft-kompakt',
  'sebiller',
  'bina-giris-filtrasyon',
]);

function slugOf(product: Product): string {
  return (product.categorySlug || '').toLowerCase();
}

function nameOf(product: Product): string {
  return `${product.name} ${product.category} ${product.shortDescription || ''}`.toLowerCase();
}

function isDeviceProduct(product: Product): boolean {
  const slug = slugOf(product);
  if (DEVICE_SLUGS.has(slug)) return true;
  // Slug yoksa isim/kategori ile yedek eşleme
  const n = nameOf(product);
  return (
    n.includes('su arıtma') ||
    n.includes('ro ') ||
    n.includes('sebil') ||
    n.includes('direkt akış') ||
    n.includes('bina giriş')
  ) && !n.includes('filtre') && !n.includes('musluk') && !n.includes('membran');
}

function isDirektAkis(product: Product): boolean {
  return slugOf(product) === 'direkt-akis-ro' || nameOf(product).includes('direkt');
}

function isKlasikRo(product: Product): boolean {
  return slugOf(product) === 'klasik-ro-sistemleri' || nameOf(product).includes('klasik');
}

function isSoft(product: Product): boolean {
  return slugOf(product) === 'soft-kompakt' || nameOf(product).includes('soft') || nameOf(product).includes('kompakt');
}

function isSebil(product: Product): boolean {
  return slugOf(product) === 'sebiller' || nameOf(product).includes('sebil');
}

function isBina(product: Product): boolean {
  return slugOf(product) === 'bina-giris-filtrasyon' || nameOf(product).includes('bina');
}

function isDigital(product: Product): boolean {
  return nameOf(product).includes('dijital') || nameOf(product).includes('iot') || nameOf(product).includes('eonaqua');
}

export function getWizardAnswers(): WizardAnswers {
  try {
    const saved = localStorage.getItem('wizard-answers');
    return saved ? JSON.parse(saved) : DEFAULT_ANSWERS;
  } catch {
    return DEFAULT_ANSWERS;
  }
}

export function saveWizardAnswers(answers: WizardAnswers): void {
  localStorage.setItem('wizard-answers', JSON.stringify(answers));
}

function scoreProduct(product: Product, answers: WizardAnswers): number {
  let score = 40;

  // Place
  if (answers.place === 'ev') {
    if (isDirektAkis(product) || isKlasikRo(product) || isSoft(product)) score += 22;
    if (isSebil(product) || isBina(product)) score -= 8;
  } else if (answers.place === 'ofis') {
    if (isSebil(product) || isDirektAkis(product)) score += 24;
    if (isSoft(product)) score += 10;
  } else if (answers.place === 'isletme') {
    if (isSebil(product) || isDirektAkis(product) || isBina(product)) score += 24;
  } else if (answers.place === 'bina') {
    if (isBina(product)) score += 35;
    else score -= 15;
  }

  // People / capacity
  if (answers.people === '1-2') {
    if (isSoft(product) || product.price < 25000) score += 14;
  } else if (answers.people === '3-4') {
    if (isKlasikRo(product) || isDirektAkis(product)) score += 14;
  } else if (answers.people === '5+' || answers.people === 'yogun') {
    if (isDirektAkis(product) || isSebil(product)) score += 20;
    if (product.price > 40000) score += 6;
  }

  // System type
  if (answers.systemType === 'direkt-akis') {
    if (isDirektAkis(product)) score += 28;
  } else if (answers.systemType === 'tankli') {
    if (isKlasikRo(product) || isSoft(product)) score += 24;
  } else if (answers.systemType === 'dijital') {
    if (isDigital(product)) score += 30;
    else if (isDirektAkis(product)) score += 10;
  } else if (answers.systemType === 'emin-degilim') {
    score += 8;
  }

  // Priority
  if (answers.priority === 'fiyat') {
    if (product.price < 20000) score += 22;
    else if (product.price < 40000) score += 10;
    else score -= 8;
  } else if (answers.priority === 'performans') {
    if (isDirektAkis(product) || product.price > 40000) score += 18;
  } else if (answers.priority === 'mineral') {
    if (nameOf(product).includes('mineral') || isDirektAkis(product)) score += 16;
  } else if (answers.priority === 'sessiz') {
    if (isDirektAkis(product) || isSoft(product)) score += 16;
  }

  // Budget (net fiyatlar — katalog gerçek aralığına göre)
  if (answers.budget === '0-20000') {
    if (product.price <= 20000) score += 28;
    else if (product.price <= 30000) score += 8;
    else score -= 12;
  } else if (answers.budget === '20000-50000') {
    if (product.price >= 15000 && product.price <= 55000) score += 28;
  } else if (answers.budget === '50000-100000') {
    if (product.price >= 40000 && product.price <= 110000) score += 28;
  } else if (answers.budget === '100000+') {
    if (product.price >= 80000) score += 28;
  } else if (answers.budget === 'oner') {
    // Orta segmenti hafifçe öne çıkar
    if (product.price >= 15000 && product.price <= 60000) score += 12;
  }

  // Rating / stock
  score += (product.rating || 0) * 3;
  if (product.stock > 0) score += 4;
  else score -= 20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function generateReason(product: Product, answers: WizardAnswers): string {
  const reasons: string[] = [];

  if (answers.place === 'ev') reasons.push('Ev kullanımına uygun');
  if (answers.place === 'ofis') reasons.push('Ofis kullanımına uygun');
  if (answers.place === 'isletme') reasons.push('İşletme kullanımına uygun');
  if (answers.place === 'bina') reasons.push('Bina girişi filtrasyonu için ideal');
  if (answers.people === '5+' || answers.people === 'yogun') reasons.push('Yoğun kullanıma uygun kapasite');
  if (answers.systemType === 'direkt-akis' && isDirektAkis(product)) reasons.push('Tanksız modern direkt akış');
  if (answers.systemType === 'tankli' && (isKlasikRo(product) || isSoft(product))) reasons.push('Klasik tanklı sistem');
  if (answers.systemType === 'dijital' && isDigital(product)) reasons.push('Dijital / akıllı özellikli');
  if (answers.priority === 'fiyat') reasons.push('Bütçe dostu');
  if (answers.priority === 'performans') reasons.push('Yüksek performans');
  if (answers.priority === 'mineral') reasons.push('Mineral destekli arıtım');
  if (answers.priority === 'sessiz') reasons.push('Sessiz çalışma profili');
  if (product.rating && product.rating >= 4.5) reasons.push('Yüksek müşteri memnuniyeti');

  if (reasons.length === 0) reasons.push('Genel kullanıma uygun');
  return `${reasons.join(', ')}.`;
}

function generateTags(product: Product, answers: WizardAnswers): string[] {
  const tags: string[] = [];
  if (product.price < 20000) tags.push('Ekonomik');
  if (product.price > 80000) tags.push('Premium');
  if (product.rating && product.rating >= 4.5) tags.push('Çok Tercih Edilen');
  if (isDirektAkis(product)) tags.push('Direkt Akış');
  if (isDigital(product)) tags.push('Dijital');
  if (isSebil(product)) tags.push('Sebil');
  if (product.badge === 'new') tags.push('Yeni');
  if (answers.budget === 'oner') tags.push('Öneri');
  return tags.slice(0, 4);
}

/**
 * Canlı katalogdan (veya fallback) cihaz önerileri üretir.
 * Filtre / musluk aksesuarlarını hariç tutar.
 */
export function getRecommendations(
  answers: WizardAnswers,
  catalog: Product[] = fallbackProducts,
): Recommendation[] {
  const pool = (catalog.length > 0 ? catalog : fallbackProducts).filter(isDeviceProduct);

  const scored = pool.map((p) => ({
    product: p,
    score: scoreProduct(p, answers),
    reason: generateReason(p, answers),
    tags: generateTags(p, answers),
  }));

  return scored
    .filter((r) => r.score >= 35)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 3);
}
