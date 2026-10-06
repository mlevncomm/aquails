import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Clock, ArrowLeft, Share2, MessageCircle, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { getArticleSchema, getBreadcrumbSchema } from '@/components/SchemaOrg';
import { getBlogPostBySlug, type PublicBlogPostDetail } from '@/services/blogService';
import { openWhatsApp } from '@/services/whatsappService';
import { PageHero } from '@/components/PageHero';

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

  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <SEO
        title={`${post.title} | Aquails Blog`}
        description={post.excerpt}
        ogImage={post.image}
        ogType="article"
        canonical={`/blog/${slug}`}
        schema={[articleSchema, breadcrumbSchema]}
      />
      <PageLayout variant="gradient">
        <PageHero
          eyebrow={post.category}
          title={post.title}
          breadcrumbs={[{ label: 'Blog', to: '/blog' }, { label: post.title }]}
          image={post.image || '/images/lifestyle/pour-glass.jpg'}
          className="[&_h1]:max-w-[800px]"
        >
          <div className="flex flex-wrap items-center gap-4 text-sm text-aq-muted">
            <span>{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readTime} okuma</span>
            <Link to="/blog" className="inline-flex items-center gap-1.5 transition-colors hover:text-aq-ink">
              <ArrowLeft className="w-4 h-4" /> Bloga Dön
            </Link>
          </div>
        </PageHero>

        <div className="max-w-[800px] mx-auto px-4 py-10 sm:py-14">
          <ScrollReveal>
            <article>
              <div>
                <div className="max-w-none whitespace-pre-line text-base leading-[1.8] text-aq-ink/80 sm:text-[17px]">
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
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-aq-ink/15 text-sm font-semibold text-aq-ink transition-colors hover:border-emerald-500 hover:text-emerald-700"
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
