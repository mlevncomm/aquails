export interface CategorySeoContent {
  title: string;
  description: string;
  heading: string;
  intro: string;
}

const CATEGORY_SEO: Record<string, CategorySeoContent> = {
  'direkt-akis-ro': {
    title: 'Direkt Akış Su Arıtma Cihazları | Aquails',
    description: 'Aquails direkt akış ters ozmoz su arıtma cihazlarını inceleyin. Tanksız ve yüksek kapasiteli RO sistemlerini özelliklerine göre karşılaştırın.',
    heading: 'Direkt Akış RO Su Arıtma Cihazları',
    intro: 'Direkt akış RO sistemleri, suyu ihtiyaç anında ters ozmoz membranından geçirerek arıtan yüksek kapasiteli çözümlerdir. Bu kategoride Aquails direkt akış cihazlarını kapasite, filtre yapısı ve kullanım özelliklerine göre inceleyebilirsiniz.',
  },
  'klasik-ro-sistemleri': {
    title: 'Klasik RO Su Arıtma Cihazları | Aquails',
    description: 'Tanklı klasik ters ozmoz su arıtma cihazlarını keşfedin. Ev tipi RO sistemlerini filtre yapısı, kapasite ve özelliklerine göre karşılaştırın.',
    heading: 'Klasik RO Su Arıtma Sistemleri',
    intro: 'Klasik RO sistemleri, ters ozmoz teknolojisini depolama tankıyla birleştiren yaygın ev tipi su arıtma çözümleridir. Farklı filtre aşamalarına ve teknik özelliklere sahip Aquails modellerini bu sayfada karşılaştırabilirsiniz.',
  },
  'soft-kompakt': {
    title: 'Kompakt Su Arıtma Sistemleri | Aquails',
    description: 'Kompakt ve modern su arıtma sistemlerini inceleyin. Alan tasarrufu sağlayan Aquails su arıtma çözümlerini özelliklerine göre karşılaştırın.',
    heading: 'Soft ve Kompakt Su Arıtma Sistemleri',
    intro: 'Kompakt su arıtma sistemleri, sınırlı alanlarda düzenli ve bütünleşik bir kurulum isteyen kullanıcılar için tasarlanır. Aquails kompakt modellerini boyut, filtrasyon yapısı ve kullanım özellikleri açısından inceleyebilirsiniz.',
  },
  sebiller: {
    title: 'Arıtmalı Su Sebilleri ve Sebil Sistemleri | Aquails',
    description: 'Aquails arıtmalı su sebilleri ve sebil çözümlerini keşfedin. Ev ve iş yeri kullanımına uygun modelleri ve sebil aparatlarını karşılaştırın.',
    heading: 'Arıtmalı Su Sebilleri',
    intro: 'Arıtmalı su sebilleri, filtrasyon ve kolay su erişimini tek sistemde bir araya getirir. Ev, ofis ve ortak kullanım alanlarına yönelik Aquails sebil modellerini ve uyumlu çözümleri bu kategoride inceleyebilirsiniz.',
  },
  'bina-giris-filtrasyon': {
    title: 'Bina Giriş Su Filtrasyon Sistemleri | Aquails',
    description: 'Bina ve daire girişinde kullanılan su filtrasyon sistemlerini inceleyin. Tortu ve partikül filtrasyonu için Aquails çözümlerini keşfedin.',
    heading: 'Bina Giriş Su Filtrasyon Sistemleri',
    intro: 'Bina giriş filtrasyon sistemleri, şebeke suyunu kullanım noktalarına ulaşmadan önce ön filtrasyondan geçirmek için kullanılır. Aquails bina ve daire giriş çözümlerini filtre yapısı ve kullanım alanına göre karşılaştırabilirsiniz.',
  },
  'filtreler-membranlar': {
    title: 'Su Arıtma Filtreleri ve Membranlar | Aquails',
    description: 'Su arıtma filtresi, RO membran, karbon ve mineral filtre seçeneklerini inceleyin. Aquails filtre ve membran ürünlerini kolayca karşılaştırın.',
    heading: 'Su Arıtma Filtreleri ve Membranlar',
    intro: 'Filtre ve membranlar, su arıtma sisteminin performansını ve bakım döngüsünü doğrudan etkileyen temel bileşenlerdir. Sediment, karbon, membran ve tamamlayıcı filtre seçeneklerini bu sayfada inceleyebilirsiniz.',
  },
  'musluklar-aksesuarlar': {
    title: 'Su Arıtma Muslukları ve Aksesuarları | Aquails',
    description: 'Su arıtma muslukları, bağlantı ve sistem aksesuarlarını inceleyin. Aquails uyumlu musluk ve tamamlayıcı parçaları keşfedin.',
    heading: 'Su Arıtma Muslukları ve Aksesuarları',
    intro: 'Su arıtma muslukları ve aksesuarları, sistemin kullanım ve bağlantı tarafını tamamlar. Paslanmaz çelik musluklar ve uyumlu aksesuarları özelliklerine göre bu kategoride karşılaştırabilirsiniz.',
  },
};

export function getCategorySeo(slug: string, fallbackName: string): CategorySeoContent {
  return CATEGORY_SEO[slug] ?? {
    title: `${fallbackName} | Aquails`,
    description: `Aquails ${fallbackName.toLocaleLowerCase('tr-TR')} ürünlerini inceleyin ve ihtiyacınıza uygun su arıtma çözümlerini karşılaştırın.`,
    heading: fallbackName,
    intro: `${fallbackName} kategorisindeki Aquails ürünlerini teknik özellikleri ve kullanım amaçlarına göre inceleyebilirsiniz.`,
  };
}
