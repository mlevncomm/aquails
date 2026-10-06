import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { getFAQSchema } from '@/components/SchemaOrg';


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
        schema={getFAQSchema(faqs.map((item) => ({ question: item.q, answer: item.a })))}
      />
    <PageLayout>
      <PageHero
        eyebrow="Yardım merkezi"
        title="Sıkça Sorulan Sorular"
        description="Aklınıza takılan soruların yanıtlarını burada bulabilirsiniz."
        breadcrumbs={[{ label: 'SSS' }]}
        image="/images/lifestyle/pour-glass.jpg"
      />
      <div className="max-w-[800px] mx-auto px-4 py-10 sm:py-14">

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(c => (
            <button key={c} className="px-4 py-2 text-sm font-semibold rounded-full border border-aq-border/60 text-aq-muted hover:bg-aq-cloud hover:text-aq-blue transition-all">
              {c}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-soft">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-aq-ink flex-shrink-0" />
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
