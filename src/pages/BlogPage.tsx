import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { getPublishedBlogPosts, type PublicBlogPost } from '@/services/blogService';

const categoryColors: Record<string, string> = {
  'Teknik Bilgiler': 'bg-aq-sky text-aq-blue',
  'Bakım Önerileri': 'bg-aq-sky text-aq-blue',
  'Sağlıklı Yaşam': 'bg-purple-50 text-purple-600',
  'Rehber': 'bg-amber-50 text-amber-600',
};

export default function BlogPage() {
  const [posts, setPosts] = useState<PublicBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('Tümü');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    void getPublishedBlogPosts(50).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const categories = useMemo(
    () => ['Tümü', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts],
  );

  const filtered = posts.filter((p) => {
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
        <section className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/40 py-12 md:py-16">
          <div className="page-container">
            <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-3">
              <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link><span>/</span><span className="text-aq-muted">Blog</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-aq-text">Aquails Bilgi Merkezi</h1>
            <p className="text-sm text-aq-muted mt-2 max-w-lg">Su arıtma teknolojileri, bakım ipuçları ve sağlıklı yaşam rehberi.</p>
            <div className="relative max-w-md mt-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Blog yazısı ara..." className="w-full pl-9 pr-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-white focus:outline-none focus:border-aq-blue" />
            </div>
          </div>
        </section>

        <div className="page-container py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all ${activeCat === c ? 'bg-aq-deep text-white border-aq-deep' : 'border-aq-border/60 text-aq-muted hover:bg-aq-sky hover:text-aq-blue'}`}>
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20 text-aq-muted">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post, i) => (
                <motion.article key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link to={`/blog/${post.slug}`} className="block group bg-white border border-aq-border/60 rounded-2xl overflow-hidden transition-all duration-300 h-full">
                    <div className="aspect-[16/9] overflow-hidden bg-aq-ice">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${categoryColors[post.category] || 'bg-aq-ice text-aq-muted'}`}>{post.category}</span>
                        <span className="text-[11px] text-aq-muted flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      </div>
                      <h3 className="text-base font-semibold text-aq-text group-hover:text-aq-blue transition-colors line-clamp-2 mb-2">{post.title}</h3>
                      <p className="text-sm text-aq-muted line-clamp-2">{post.excerpt}</p>
                      <p className="text-xs text-aq-muted mt-3">{post.date}</p>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-aq-border mx-auto mb-3" />
              <p className="text-sm text-aq-muted">Aranan kriterlere uygun blog yazısı bulunamadı.</p>
            </div>
          )}

          <ScrollReveal className="mt-12">
            <div className="bg-gradient-to-r from-aq-deep to-aq-navy rounded-2xl p-8 text-center text-white">
              <h3 className="text-xl font-semibold mb-2">Filtre Değişim Hatırlatıcısı</h3>
              <p className="text-sm text-white/70 mb-5">Filtre değişim tarihlerinizi kaçırmayın, size hatırlatalım.</p>
              <Link to="/filtre-aboneligi" className="inline-flex items-center gap-2 bg-aq-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all">Aboneliği İncele <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </ScrollReveal>
        </div>
      </PageLayout>
    </>
  );
}
