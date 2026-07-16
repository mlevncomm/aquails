import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Search } from 'lucide-react';
import { useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


const blogPosts = [
  { slug: 'su-aritma-nasil-calisir', title: 'Su Arıtma Cihazı Nasıl Çalışır?', excerpt: 'Ters ozmoz teknolojisi ve 7 aşamalı arıtma sürecinin detaylı açıklaması.', category: 'Teknik Bilgiler', date: '5 Haziran 2026', readTime: '5 dk', image: '/images/blog-3.jpg' },
  { slug: 'filtre-degisim-sikligi', title: 'Filtre Değişim Sıklığı Ne Olmalı?', excerpt: 'Filtre ömrünü uzatmanın yolları ve doğru değişim zamanının belirlenmesi.', category: 'Bakım Önerileri', date: '1 Haziran 2026', readTime: '4 dk', image: '/images/blog-2.jpg' },
  { slug: 'arisu-icmenin-faydalari', title: 'Arıtılmış Su İçmenin 10 Faydası', excerpt: 'Sağlıklı yaşam için günlük arıtılmış su tüketiminin önemi.', category: 'Sağlıklı Yaşam', date: '28 Mayıs 2026', readTime: '6 dk', image: '/images/blog-1.jpg' },
  { slug: 'ro-membran-nedir', title: 'RO Membran Nedir ve Ne İşe Yarar?', excerpt: 'Ters ozmoz membran teknolojisinin çalışma prensibi ve avantajları.', category: 'Teknik Bilgiler', date: '20 Mayıs 2026', readTime: '7 dk', image: '/images/hero-bg.jpg' },
  { slug: 'kisin-su-aritma-bakimi', title: 'Kışın Su Arıtma Cihazı Bakımı', excerpt: 'Soğuk havalarda cihazınızı korumak için uzman önerileri.', category: 'Bakım Önerileri', date: '15 Mayıs 2026', readTime: '4 dk', image: '/images/filter-subscription.jpg' },
  { slug: 'isletmelerde-su-aritma', title: 'İşletmelerde Endüstriyel Su Arıtma', excerpt: 'Restoran, kafe ve fabrikalar için su arıtma çözümleri.', category: 'Rehber', date: '10 Mayıs 2026', readTime: '8 dk', image: '/images/campaign-1.jpg' },
  { slug: 'su-aritma-secerken', title: 'Su Arıtma Cihazı Seçerken Nelere Dikkat Edilmeli?', excerpt: 'Eviniz için en uygun cihazı seçerken dikkat etmeniz gereken 7 kritik faktör.', category: 'Rehber', date: '5 Mayıs 2026', readTime: '5 dk', image: '/images/hero-product.jpg' },
  { slug: 'direkt-akis-nedir', title: 'Direkt Akış Su Arıtma Nedir?', excerpt: 'Tankless sistemlerin avantajları ve klasik sistemlerden farkları.', category: 'Teknik Bilgiler', date: '1 Mayıs 2026', readTime: '4 dk', image: '/images/service-installation.jpg' },
  { slug: 'mineral-su-faydalari', title: 'Mineralli Su İçmenin Sağlığa Etkileri', excerpt: 'Mineral dengesi korunmuş arıtılmış suyun vücut sağlığına katkıları.', category: 'Sağlıklı Yaşam', date: '25 Nisan 2026', readTime: '6 dk', image: '/images/campaign-3.jpg' },
];

const categoryColors: Record<string, string> = {
  'Teknik Bilgiler': 'bg-blue-50 text-blue-600',
  'Bakım Önerileri': 'bg-emerald-50 text-emerald-600',
  'Sağlıklı Yaşam': 'bg-purple-50 text-purple-600',
  'Rehber': 'bg-amber-50 text-amber-600',
};

const categories = ['Tümü', 'Teknik Bilgiler', 'Bakım Önerileri', 'Sağlıklı Yaşam', 'Rehber'];

export default function BlogPage() {
  const [activeCat, setActiveCat] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = blogPosts.filter(p => {
    const matchesCat = activeCat === 'Tümü' || p.category === activeCat;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <>
      <SEO
        title="Aquails Blog | Su Arıtma Rehberi ve Filtre Bakımı"
        description="Su arıtma teknolojileri, filtre bakımı, su kalitesi ve sağlıklı yaşam hakkında kapsamlı rehberler ve uzman yazıları."
        canonical="/blog"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E0F0FF] py-12 md:py-16">
        <div className="page-container">
          <div className="flex items-center gap-2 text-[13px] text-[#8B9DAF] mb-3">
            <Link to="/" className="hover:text-[#1A73E8]">Ana Sayfa</Link><span>/</span><span className="text-[#5A6B7B]">Blog</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137]">Aquails Bilgi Merkezi</h1>
          <p className="text-sm text-[#5A6B7B] mt-2 max-w-lg">Su arıtma teknolojileri, bakım ipuçları ve sağlıklı yaşam rehberi.</p>
          <div className="relative max-w-md mt-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DAF]" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Blog yazısı ara..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-white focus:outline-none focus:border-[#1A73E8]" />
          </div>
        </div>
      </section>

      <div className="page-container py-8">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all ${activeCat === c ? 'bg-[#1A73E8] text-white border-[#1A73E8]' : 'border-[#D6E3F0] text-[#5A6B7B] hover:bg-[#F0F6FF] hover:text-[#1A73E8]'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <motion.article key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Link to={`/blog/${post.slug}`} className="block group bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${categoryColors[post.category] || 'bg-gray-50 text-gray-600'}`}>{post.category}</span>
                    <span className="text-[11px] text-[#8B9DAF] flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0D2137] group-hover:text-[#1A73E8] transition-colors line-clamp-2 mb-2">{post.title}</h3>
                  <p className="text-sm text-[#8B9DAF] line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-[#8B9DAF] mt-3">{post.date}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-[#D6E3F0] mx-auto mb-3" />
            <p className="text-sm text-[#8B9DAF]">Aranan kriterlere uygun blog yazısı bulunamadı.</p>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal className="mt-12">
          <div className="bg-gradient-to-r from-[#0D2137] to-[#1A3A5C] rounded-2xl p-8 text-center text-white">
            <h3 className="text-xl font-bold mb-2">Filtre Değişim Hatırlatıcısı</h3>
            <p className="text-sm text-white/70 mb-5">Filtre değişim tarihlerinizi kaçırmayın, size hatırlatalım.</p>
            <Link to="/filtre-aboneligi" className="inline-flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">Aboneliği İncele <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
