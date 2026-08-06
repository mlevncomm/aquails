import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';


const faqs = [
  { q: 'Su arıtma cihazı almalı mıyım?', a: 'Musluk suyu şebekeden gelirken borularda kirlenme, klor ve ağır metaller içerebilir. Su arıtma cihazı bu zararlı maddeleri %99.9 oranında arındırarak size daha sağlıklı su sunar.' },
  { q: 'Filtreleri ne sıklıkla değiştirmeliyim?', a: 'Sediment filtreyi 3-6 ayda, karbon filtreleri 6-12 ayda, RO membranı 2-3 yılda bir değiştirmeniz önerilir. Cihazınız akıllı sensör ile filtrenizin ömrünü takip eder.' },
  { q: 'Kurulum ücretli mi?', a: 'Aquails PurePro ve Compact serisi cihazlarımızda profesyonel kurulum ücretsizdir. Kurulum ekibimiz randevulu sistemle evinize gelir.' },
  { q: 'Garanti süresi ne kadar?', a: 'Tüm cihazlarımızda 5 yıl garanti bulunmaktadır. Garanti kapsamında parça değişimi ve işçilik ücretsizdir.' },
  { q: 'Kapıda ödeme yapabilir miyim?', a: 'Evet, kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz. Kapıda ödeme seçeneği +150₺ ek ücretlidir.' },
  { q: 'Siparişim ne zaman elime ulaşır?', a: 'İstanbul içi 1-2 iş günü, diğer iller 3-5 iş günü içinde kargoya verilir. Kurulum dahil siparişlerde ek 1-2 gün planlama süresi vardır.' },
  { q: 'Filtre aboneliği nedir?', a: 'Filtre aboneliği ile filtreleriniz otomatik olarak belirli aralıklarla kapınıza gelir. Abone olarak %15 indirim kazanırsınız.' },
  { q: 'Cihazı kendim kurabilir miyim?', a: 'Profesyonel kurulum önerilir ancak Compact serisi cihazlarımızda DIY kurulum kiti mevcuttur. Detaylı kurulum videosu desteği sağlıyoruz.' },
];

const categories = ['Tümü', 'Sipariş', 'Kurulum', 'Bakım', 'Garanti', 'Ödeme'];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <SEO
        title="Sıkça Sorulan Sorular | Aquails"
        description="Aquails su arıtma cihazları hakkında en çok sorulan sorular ve yanıtları. Kurulum, garanti, filtre değişimi ve daha fazlası."
        canonical="/sss"
      />
    <PageLayout>
      <div className="max-w-[800px] mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[13px] text-aq-muted mb-2">
            <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-aq-muted">SSS</span>
          </div>
          <h1 className="text-2xl font-bold text-aq-text mb-2">Sıkça Sorulan Sorular</h1>
          <p className="text-sm text-aq-muted">Aklınıza takılan soruların yanıtlarını burada bulabilirsiniz.</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(c => (
            <button key={c} className="px-4 py-2 text-sm font-semibold rounded-xl border border-aq-border/60 text-aq-muted hover:bg-aq-sky hover:text-aq-blue transition-all">
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white border border-aq-border/60 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-aq-blue flex-shrink-0" />
                  <span className="text-sm font-semibold text-aq-text">{f.q}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-aq-muted transition-transform flex-shrink-0 ${openIdx === i ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === i && (
                <div className="px-5 pb-5 pl-13">
                  <p className="text-sm text-aq-muted leading-relaxed ml-8">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
    </>
  );
}
