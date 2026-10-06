import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { getPublishedBlogPosts, type PublicBlogPost } from '@/services/blogService';

const categoryColors: Record<string, string> = {
  'Teknik Bilgiler': 'bg-aq-cloud text-aq-blue',
  'Bakım Önerileri': 'bg-aq-cloud text-aq-blue',
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
        <PageHero
          eyebrow="Blog"
          title="Aquails Bilgi Merkezi"
          description="Su arıtma teknolojileri, bakım ipuçları ve sağlıklı yaşam rehberi."
          breadcrumbs={[{ label: 'Blog' }]}
          image="/images/lifestyle/pour-glass.jpg"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-aq-muted" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Blog yazısı ara..." className="w-full pl-10 pr-4 py-3 text-sm rounded-full bg-white text-aq-ink ring-1 ring-aq-border focus:outline-none focus:ring-2 focus:ring-aq-ink/20" />
          </div>
        </PageHero>

        <div className="page-container py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all ${activeCat === c ? 'bg-aq-ink text-white border-aq-ink' : 'border-aq-ink/15 text-aq-ink/70 hover:border-aq-ink hover:text-aq-ink'}`}>
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
                  <Link to={`/blog/${post.slug}`} className="block group bg-white rounded-2xl overflow-hidden transition-all duration-300 h-full shadow-soft">
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
            <div className="relative isolate overflow-hidden rounded-3xl bg-aq-ink px-6 py-12 text-center text-white sm:px-10">
              <img src="/images/filter-subscription.jpg" alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 -z-10 bg-aq-ink/85" />
              <h3 className="text-2xl font-bold tracking-[-0.02em] mb-2">Filtre Değişim Hatırlatıcısı</h3>
              <p className="text-sm text-white/70 mb-5">Filtre değişim tarihlerinizi kaçırmayın, size hatırlatalım.</p>
              <Link to="/filtre-aboneligi" className="inline-flex items-center gap-2 bg-aq-mist text-aq-ink px-6 py-3 rounded-full text-sm font-semibold hover:bg-white transition-all">Aboneliği İncele <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </ScrollReveal>
        </div>
      </PageLayout>
    </>
  );
}
