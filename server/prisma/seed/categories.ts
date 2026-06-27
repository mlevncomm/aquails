export interface CategorySeedData {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export const categorySeedData: CategorySeedData[] = [
  {
    slug: 'su-aritma-cihazlari',
    name: 'Su Arıtma Cihazları',
    description: 'Ev ve iş yeri için profesyonel su arıtma cihazları',
    icon: 'Droplet',
  },
  {
    slug: 'direkt-akis-su-aritma',
    name: 'Direkt Akış Su Arıtma',
    description: 'Tankless, anında saf su üreten sistemler',
    icon: 'Zap',
  },
  {
    slug: 'dijital-su-aritma',
    name: 'Dijital Su Arıtma',
    description: 'Akıllı dijital kontrol panelli su arıtma cihazları',
    icon: 'Monitor',
  },
  {
    slug: 'sebiller',
    name: 'Sebiller',
    description: 'Sıcak-soğuk su sunan arıtmalı sebil sistemleri',
    icon: 'Coffee',
  },
  {
    slug: 'bina-girisi-filtrasyon',
    name: 'Bina Girişi Filtrasyon',
    description: 'Apartman ve site girişi filtrasyon sistemleri',
    icon: 'Building',
  },
  {
    slug: 'filtreler',
    name: 'Filtreler',
    description: 'Su arıtma cihazları için yedek filtreler ve setler',
    icon: 'Filter',
  },
  {
    slug: 'membran-filtreler',
    name: 'Membran Filtreler',
    description: 'Ters ozmoz membran filtreler',
    icon: 'CircleDot',
  },
  {
    slug: 'musluklar',
    name: 'Musluklar',
    description: '304 paslanmaz çelik su arıtma muslukları',
    icon: 'Faucet',
  },
  {
    slug: 'pompa-ve-yedek-parcalar',
    name: 'Pompa ve Yedek Parçalar',
    description: 'Su arıtma cihazı pompası ve yedek parçalar',
    icon: 'Settings',
  },
  {
    slug: 'aksesuarlar',
    name: 'Aksesuarlar',
    description: 'Sebil aparatları ve pratik aksesuarlar',
    icon: 'Wrench',
  },
  {
    slug: 'elektrikli-ev-aletleri',
    name: 'Elektrikli Ev Aletleri',
    description: 'Mutfakınızı kolaylaştıran elektrikli aletler',
    icon: 'Plug',
  },
  {
    slug: 'ev-temizligi',
    name: 'Ev Temizliği',
    description: 'Güçlü temizlik robotları ve süpürgeler',
    icon: 'Sparkles',
  },
  {
    slug: 'ev-gerecleri',
    name: 'Ev Gereçleri',
    description: 'Döküm ve granit tencere setleri, çatal kaşık takımları',
    icon: 'ChefHat',
  },
  {
    slug: 'tens-cihazi',
    name: 'Tens Cihazı',
    description: 'Profesyonel TENS/EMS tedavi cihazı',
    icon: 'Activity',
  },
];
