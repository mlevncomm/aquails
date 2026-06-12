import { products } from '@/data';
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
  let score = 50;

  // Place scoring
  if (answers.place === 'ev') {
    if (product.category === 'Su Arıtma Cihazları' || product.category === 'Direkt Akış Su Arıtma') score += 20;
  } else if (answers.place === 'ofis') {
    if (product.category === 'Direkt Akış Su Arıtma' || product.category === 'Sebiller') score += 20;
  } else if (answers.place === 'isletme') {
    if (product.category === 'Bina Girişi Filtrasyon' || product.category === 'Direkt Akış Su Arıtma') score += 20;
  } else if (answers.place === 'bina') {
    if (product.category === 'Bina Girişi Filtrasyon') score += 30;
  }

  // People count
  if (answers.people === '1-2') {
    if (product.price < 10000) score += 10;
  } else if (answers.people === '3-4') {
    score += 10;
  } else if (answers.people === '5+' || answers.people === 'yogun') {
    if (product.category === 'Direkt Akış Su Arıtma') score += 20;
  }

  // System type
  if (answers.systemType === 'direkt-akis') {
    if (product.category === 'Direkt Akış Su Arıtma') score += 25;
  } else if (answers.systemType === 'tankli') {
    if (product.category === 'Su Arıtma Cihazları') score += 20;
  } else if (answers.systemType === 'dijital') {
    if (product.category === 'Dijital Su Arıtma') score += 25;
  }

  // Priority
  if (answers.priority === 'fiyat') {
    if (product.price < 8000) score += 20;
    else if (product.price < 12000) score += 10;
  } else if (answers.priority === 'performans') {
    if (product.price > 10000) score += 15;
  } else if (answers.priority === 'sessiz') {
    if (product.category === 'Direkt Akış Su Arıtma') score += 15;
  }

  // Budget
  if (answers.budget === '5000-10000') {
    if (product.price >= 5000 && product.price <= 10000) score += 25;
    else if (product.price < 5000) score += 15;
  } else if (answers.budget === '10000-20000') {
    if (product.price >= 8000 && product.price <= 20000) score += 25;
  } else if (answers.budget === '20000+') {
    if (product.price > 15000) score += 25;
  }

  // Rating bonus
  score += (product.rating || 0) * 3;

  return Math.min(100, Math.max(0, score));
}

export function getRecommendations(answers: WizardAnswers): Recommendation[] {
  const waterProducts = products.filter(p =>
    p.category === 'Su Arıtma Cihazları' ||
    p.category === 'Direkt Akış Su Arıtma' ||
    p.category === 'Dijital Su Arıtma' ||
    p.category === 'Sebiller' ||
    p.category === 'Bina Girişi Filtrasyon'
  );

  const scored = waterProducts.map(p => ({
    product: p,
    score: scoreProduct(p, answers),
    reason: generateReason(p, answers),
    tags: generateTags(p, answers),
  }));

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
}

function generateReason(product: Product, answers: WizardAnswers): string {
  const reasons: string[] = [];

  if (answers.place === 'ev') reasons.push('Ev kullanımına uygun');
  if (answers.place === 'ofis') reasons.push('Ofis kullanımına uygun');
  if (answers.place === 'isletme') reasons.push('İşletme kullanımına uygun');
  if (answers.place === 'bina') reasons.push('Bina girişi filtrasyonu için ideal');
  if (answers.people === '5+' || answers.people === 'yogun') reasons.push('Yoğun kullanıma uygun kapasite');
  if (answers.systemType === 'direkt-akis') reasons.push('Tanksız modern sistem');
  if (answers.systemType === 'tankli') reasons.push('Klasik tanklı sistem');
  if (answers.priority === 'fiyat') reasons.push('Bütçe dostu');
  if (answers.priority === 'performans') reasons.push('Yüksek performans');
  if (answers.priority === 'sessiz') reasons.push('Sessiz çalışma');
  if (product.rating && product.rating >= 4.5) reasons.push('Çok yüksek müşteri memnuniyeti');

  if (reasons.length === 0) reasons.push('Genel kullanıma uygun');
  return reasons.join(', ') + '.';
}

function generateTags(product: Product, answers: WizardAnswers): string[] {
  const tags: string[] = [];
  if (product.price < 8000) tags.push('Ekonomik');
  if (product.price > 15000) tags.push('Premium');
  if (product.rating && product.rating >= 4.5) tags.push('En Çok Tercih Edilen');
  if (answers.systemType === 'direkt-akis' || product.category === 'Direkt Akış Su Arıtma') tags.push('Direkt Akış');
  if (product.badge === 'new') tags.push('Yeni');
  return tags;
}
