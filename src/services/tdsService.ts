import { products } from '@/data';

export interface TDSInput {
  tdsValue: number;
  city: string;
  usagePurpose: string;
  waterIssues: string[];
}

export interface TDSResult {
  level: 'very-low' | 'ideal' | 'medium' | 'high';
  label: string;
  description: string;
  color: string;
  recommendedDeviceType: string;
  recommendedProducts: typeof products;
  mineralFilterNeeded: boolean;
  tips: string[];
}

const CITY_TDS: Record<string, number> = {
  'İstanbul': 180, 'Ankara': 250, 'İzmir': 220, 'Antalya': 200,
  'Bursa': 210, 'Kocaeli': 190, 'Konya': 320, 'Adana': 280,
  'Gaziantep': 350, 'Kayseri': 290, 'Samsun': 170, 'Trabzon': 160,
  'Eskişehir': 260, 'Mersin': 240,
};

export function analyzeTDS(input: TDSInput): TDSResult {
  const tds = input.tdsValue;
  let level: TDSResult['level'];
  let label: string;
  let description: string;
  let color: string;
  let mineralFilterNeeded: boolean;

  if (tds < 50) {
    level = 'very-low';
    label = 'Çok Düşük Mineral Seviyesi';
    description = 'Suyunuzda mineral seviyesi çok düşük. Sağlıklı su içmek için mineral takviyesi önerilir.';
    color = '#4FC3F7';
    mineralFilterNeeded = true;
  } else if (tds <= 150) {
    level = 'ideal';
    label = 'İdeal Su Kalitesi';
    description = 'Suyunuzun mineral dengesi iyi. Temizlik için su arıtma kullanabilirsiniz.';
    color = '#00C9A7';
    mineralFilterNeeded = false;
  } else if (tds <= 300) {
    level = 'medium';
    label = 'Orta Seviye TDS';
    description = 'Suyunuzda orta seviyede mineral var. Su arıtma cihazı önerilir.';
    color = '#F59E0B';
    mineralFilterNeeded = true;
  } else {
    level = 'high';
    label = 'Yüksek TDS - Arıtma Şart';
    description = 'Suyunuzda yüksek mineral ve olası kirletici içeriği tespit edildi. Su arıtma cihazı kullanmanız şiddetle önerilir.';
    color = '#E85454';
    mineralFilterNeeded = true;
  }

  const recommendedProducts = products.filter(p => {
    if (level === 'high') return p.category === 'Su Arıtma Cihazları' || p.category === 'Direkt Akış Su Arıtma';
    if (level === 'medium') return p.category === 'Su Arıtma Cihazları';
    if (level === 'ideal') return p.category === 'Su Arıtma Cihazları' || p.category === 'Filtreler';
    return p.category === 'Su Arıtma Cihazları' || p.category === 'Direkt Akış Su Arıtma';
  }).slice(0, 3);

  const tips: string[] = [];
  if (input.waterIssues.includes('kirec')) tips.push('Kireç probleminiz için 7 aşamalı RO sistemi önerilir.');
  if (input.waterIssues.includes('koku')) tips.push('Koku için aktif karbon filtreli sistem önerilir.');
  if (input.waterIssues.includes('tat')) tips.push('Tat bozukluğu için mineral filtre takviyesi önerilir.');
  if (input.waterIssues.includes('tortu')) tips.push('Tortu için sediment filtresi güçlendirilmiş sistem önerilir.');
  if (mineralFilterNeeded) tips.push('Mineral filtre takviyesi ile daha sağlıklı su elde edebilirsiniz.');
  if (input.usagePurpose === 'bebek') tips.push('Bebek/çocuk kullanımı için NSF sertifikalı ürünler önerilir.');

  if (tips.length === 0) tips.push('Düzenli su arıtma kullanımı sağlığınız için önemlidir.');

  return {
    level, label, description, color,
    recommendedDeviceType: level === 'high' ? '7 Aşamalı RO Sistem' : level === 'medium' ? 'Su Arıtma Cihazı' : 'Su Arıtma veya Filtre',
    recommendedProducts,
    mineralFilterNeeded,
    tips,
  };
}

export function getEstimatedTDSForCity(city: string): number {
  return CITY_TDS[city] || 200;
}
