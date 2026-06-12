import type { Testimonial, FAQItem, BlogPost } from '@/types';

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ayşe K.',
    product: 'PurePro kullanıcısı',
    rating: 5,
    content: '3 yıldır kullanıyoruz, su kalitesi inanılmaz fark etti. Çocuklarımızın suyunu güvenle içiyoruz. Kurulum çok profesyoneldi.',
    date: '10 Haziran 2025',
    avatar: '/images/avatars/avatar1.jpg',
  },
  {
    id: '2',
    name: 'Mehmet T.',
    product: 'Compact kullanıcısı',
    rating: 5,
    content: 'Filtre hatırlatma sistemi çok pratik. Değişim zamanı gelince kendileri arıyorlar, randevu alıyoruz ve hemen geliyorlar.',
    date: '5 Haziran 2025',
    avatar: '/images/avatars/avatar2.jpg',
  },
  {
    id: '3',
    name: 'Selin Y.',
    product: 'Business Pro kullanıcısı',
    rating: 5,
    content: 'Restoranımızda 2 yıldır Aquails Business kullanıyoruz. Endüstriyel çözüm arayanlara kesinlikle tavsiye ederim.',
    date: '1 Haziran 2025',
    avatar: '/images/avatars/avatar3.jpg',
  },
];

export const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'Aquails su arıtma cihazları hangi teknolojiyi kullanıyor?',
    answer: 'Aquails cihazları, dünyanın en gelişmiş Reverse Osmosis (RO) teknolojisini kullanır. 7 aşamalı arıtma sistemi ile sudaki klor, kurşun, bakteri, virüs, nitrat ve diğer zararlı maddeleri %99.9 oranında temizler. Mineral takviyesi aşaması ile sağlıklı mineralleri koruyarak en saf ve sağlıklı suyu sunar.',
  },
  {
    id: '2',
    question: 'Filtre değişim sıklığı nedir?',
    answer: 'Filtre değişim sıklığı kullanım miktarına ve su kalitesine bağlıdır. Genel olarak: Sediment filtre 6-12 ay, karbon filtre 6-12 ay, RO membran 24-36 ay, mineral filtresi 12 ay olarak önerilir. Aquails akıllı sensör sistemi, filtre ömrü azaldığında otomatik olarak size bildirim gönderir.',
  },
  {
    id: '3',
    question: 'Kurulum ücretli mi?',
    answer: 'Tüm Aquails su arıtma cihazları için Türkiye genelinde profesyonel kurulum hizmeti ücretsizdir. Uzman teknisyenlerimiz cihazınızı evinizde veya iş yerinizde en uygun konuma kurar ve kullanımı hakkında sizi bilgilendirir.',
  },
  {
    id: '4',
    question: 'Garanti kapsamı nedir?',
    answer: 'Aquails cihazları 5 yıl garantilidir. Garanti kapsamında; cihaz gövdesi, elektronik kart, pompa ve sensörler yer alır. Filtreler tüketim malzemesi olduğu için garanti kapsamında değildir, ancak özel kampanyalarımız ile uygun fiyata temin edebilirsiniz.',
  },
  {
    id: '5',
    question: 'Acil servis talebi nasıl oluşturabilirim?',
    answer: '7/24 acil servis hattımızı (0850 123 45 67) arayarak veya web sitemizden \'Servis Talep Et\' butonunu kullanarak acil servis talebi oluşturabilirsiniz. Talebiniz en yakın servis noktasına yönlendirilir ve ortalama 2 saat içinde dönüş sağlanır.',
  },
  {
    id: '6',
    question: 'Kapıda ödeme imkanı var mı?',
    answer: 'Evet, tüm ürünlerimizde kapıda ödeme seçeneği mevcuttur. Ayrıca kredi kartına taksit (3-6-9 ay), havale/EFT ve online ödeme seçenekleri de sunulmaktadır.',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'su-aritma-cihazi-alirken-dikkat-edilmesi-gerekenler',
    title: 'Su Arıtma Cihazı Alırken Dikkat Edilmesi Gereken 7 Kriter',
    category: 'Su Arıtma Rehberi',
    excerpt: 'Su arıtma cihazı alırken dikkat etmeniz gereken en önemli 7 kriteri sizin için derledik.',
    content: '',
    image: '/images/blog/blog1.jpg',
    date: '15 Ocak 2025',
    author: 'Aquails Editör',
  },
  {
    id: '2',
    slug: 'aritilmis-suyun-sagliga-faydalari',
    title: 'Arıtılmış Suyun Sağlığınıza 10 Faydası',
    category: 'Sağlık',
    excerpt: 'Günde yeterli su içmenin önemi kadar, içtiğiniz suyun kalitesi de önemlidir.',
    content: '',
    image: '/images/blog/blog2.jpg',
    date: '8 Ocak 2025',
    author: 'Dr. Zeynep Yılmaz',
  },
  {
    id: '3',
    slug: 'filtre-degisim-sikligi',
    title: 'Filtre Değişim Sıklığı: Ne Zaman Değiştirilmeli?',
    category: 'Bakım',
    excerpt: 'Su arıtma cihazınızın filtrelerini ne sıklıkla değiştirmeniz gerektiğini öğrenin.',
    content: '',
    image: '/images/blog/blog3.jpg',
    date: '2 Ocak 2025',
    author: 'Aquails Teknik Ekibi',
  },
];
