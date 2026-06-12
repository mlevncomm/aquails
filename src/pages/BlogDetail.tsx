import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ArrowLeft, Share2, MessageCircle, ChevronRight } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';

const blogData: Record<string, { title: string; category: string; date: string; readTime: string; content: string; color: string }> = {
  'su-aritma-nasil-calisir': {
    title: 'Su Arıtma Cihazı Nasıl Çalışır?',
    category: 'Teknik Bilgiler',
    date: '5 Haziran 2026',
    readTime: '5 dk',
    color: 'bg-blue-100 text-blue-600',
    content: 'Su arıtma cihazları, ters ozmoz (RO) teknolojisi kullanarak musluk suyunu saf, içilebilir suya dönüştürür. 7 aşamalı arıtma süreci şu şekilde işler:\n\n1. Sediment Filtre: Pas, kum ve tortuları tutar.\n2. GAC Karbon Filtre: Klor, kötü koku ve tadı giderir.\n3. Blok Karbon Filtre: İnce partikülleri ve klor kalıntılarını yakalar.\n4. RO Membran: Ağır metaller, bakteri ve virüsleri %99.9 oranında arındırır.\n5. Post Karbon Filtre: Suya son lezzet dokunuşunu yapar.\n6. Mineral Filtre: Yararlı mineralleri suya geri kazandırır.\n7. UV Sterilizasyon: Kalan mikroorganizmaları nötralize eder.\n\nBu teknoloji sayesinde musluk suyu, şişe su kalitesine ulaşır ve aile bütçesine önemli katkı sağlar.',
  },
};

const defaultPost = {
  title: 'Blog Yazısı',
  category: 'Genel',
  date: '2026',
  readTime: '5 dk',
  color: 'bg-blue-100 text-blue-600',
  content: 'Blog yazısı içeriği burada yer alacak. Aquails olarak su arıtma teknolojileri, sağlıklı yaşam ve bakım önerileri hakkında kapsamlı bilgiler sunuyoruz.',
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogData[slug || ''] || defaultPost;

  return (
    <>
      <SEO
        title={`${post.title} | Aquails Blog`}
        description={post.content.substring(0, 160).replace(/\n/g, ' ')}
        canonical={`/blog/${slug}`}
      />
      <PageLayout variant="gradient">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A73E8] via-[#2B7DE9] to-[#00C9A7] py-16 md:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white rounded-full" />
        </div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Bloga Dön
            </Link>
            <span className={`inline-block text-xs font-medium px-3 py-1 rounded-full bg-white/20 text-white mb-4`}>
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
        {/* Main Content Card */}
        <ScrollReveal>
          <article className="bg-white border border-[#E8F0FE] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 md:p-10">
              <div className="prose prose-sm max-w-none text-[#5A6B7B] leading-relaxed whitespace-pre-line text-[15px]">
                {post.content}
              </div>

              {/* Share */}
              <div className="mt-10 pt-6 border-t border-[#F0F6FF]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#8B9DAF]">Paylaş:</span>
                    <button
                      onClick={() => {
                        const url = window.location.href;
                        navigator.clipboard?.writeText(url);
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#F0F6FF] text-[#1A73E8] hover:bg-[#1A73E8] hover:text-white transition-all"
                      title="Linki Kopyala"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(`${post.title} - Aquails Blog`);
                        window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                      title="WhatsApp'ta Paylaş"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-[#8B9DAF]">Aquails Blog</span>
                </div>
              </div>
            </div>
          </article>
        </ScrollReveal>

        {/* Related Posts */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10">
            <h3 className="text-lg font-bold text-[#0D2137] mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1A73E8]" />
              İlgili Yazılar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(blogData).slice(0, 2).map(([s, p]) => (
                <Link key={s} to={`/blog/${s}`} className="group bg-white border border-[#E8F0FE] rounded-xl p-5 hover:shadow-md hover:border-[#D6E3F0] transition-all">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-md ${p.color}`}>{p.category}</span>
                  <h4 className="text-sm font-semibold text-[#0D2137] mt-3 group-hover:text-[#1A73E8] transition-colors line-clamp-2">{p.title}</h4>
                  <div className="flex items-center gap-1 text-xs text-[#8B9DAF] mt-2">
                    <span>{p.date}</span>
                    <ChevronRight className="w-3 h-3 ml-auto text-[#8B9DAF] group-hover:text-[#1A73E8] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal delay={0.3}>
          <div className="mt-8 bg-gradient-to-r from-[#1A73E8] to-[#1557B0] rounded-2xl p-6 text-white text-center">
            <h3 className="text-lg font-bold mb-2">Su Arıtma Çözümleri</h3>
            <p className="text-sm text-white/80 mb-4">Aileniz için en uygun su arıtma cihazını keşfedin.</p>
            <Link
              to="/urunler"
              className="inline-flex items-center gap-2 bg-white text-[#1A73E8] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-all"
            >
              Ürünleri İncele <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
