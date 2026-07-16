import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { getBlogPostBySlug, type PublicBlogPostDetail } from '@/services/blogService';
import { openWhatsApp } from '@/services/whatsappService';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<PublicBlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    void getBlogPostBySlug(slug).then((data) => {
      setPost(data);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-24 text-aq-muted">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className="page-container py-20 text-center">
          <h1 className="text-xl font-semibold text-aq-text mb-2">Yazı bulunamadı</h1>
          <p className="text-sm text-aq-muted mb-6">Bu blog yazısı yayında değil veya kaldırılmış olabilir.</p>
          <Link to="/blog" className="text-aq-blue font-medium hover:underline">Bloga dön</Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <>
      <SEO
        title={`${post.title} | Aquails Blog`}
        description={post.excerpt}
        canonical={`/blog/${slug}`}
      />
      <PageLayout variant="gradient">
        <div className="relative overflow-hidden bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-16 md:py-20">
          <div className="max-w-[800px] mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Bloga Dön
              </Link>
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white mb-4">
                {post.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
              <div className="flex items-center gap-4 text-sm text-white/80">
                <span>{post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} okuma</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[800px] mx-auto px-4 py-8 -mt-8 relative z-10">
          <ScrollReveal>
            <article className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <div className="p-6 md:p-10">
                <div className="prose prose-sm max-w-none text-aq-muted leading-relaxed whitespace-pre-line text-[15px]">
                  {post.content || post.excerpt}
                </div>

                <div className="mt-10 pt-6 border-t border-aq-border/60">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-aq-muted" />
                      <span className="text-sm text-aq-muted">Bu yazıyı paylaş</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(`Aquails blog: ${post.title} — ${window.location.href}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-aq-border/60 text-sm font-medium text-aq-text hover:border-aq-blue hover:text-aq-blue"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </PageLayout>
    </>
  );
}
