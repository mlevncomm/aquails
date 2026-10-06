import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { Clock, ArrowRight, Copy, Check, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';
import { getCampaignBySlug, type Campaign } from '@/services/campaignService';

const FALLBACK_IMAGE = '/images/lifestyle/story-lake.jpg';

export default function CampaignDetail() {
  const { slug } = useParams<{ slug: string }>();
  const addToast = useToastStore((s) => s.add);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getCampaignBySlug(slug ?? '').then((c) => {
      if (cancelled) return;
      setCampaign(c);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [slug]);

  const copyCode = () => {
    if (!campaign?.couponCode) return;
    void navigator.clipboard?.writeText(campaign.couponCode);
    setCopied(true);
    addToast(`${campaign.couponCode} kopyalandı!`, 'success');
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-32 text-aq-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>
      </PageLayout>
    );
  }

  if (!campaign) {
    return (
      <PageLayout>
        <SEO title="Kampanya bulunamadı | Aquails" noindex />
        <PageHero
          size="sm"
          title="Kampanya bulunamadı"
          description="Bu kampanya sona ermiş veya kaldırılmış olabilir."
          breadcrumbs={[{ label: 'Kampanyalar', to: '/kampanyalar' }, { label: 'Bulunamadı' }]}
        >
          <Link to="/kampanyalar" className="inline-flex items-center gap-2 rounded-full bg-aq-ink px-6 py-3 text-sm font-semibold text-white hover:bg-aq-ink-soft">
            Güncel Kampanyalar <ArrowRight className="h-4 w-4" />
          </Link>
        </PageHero>
      </PageLayout>
    );
  }

  const steps = campaign.couponCode
    ? [
        'Ürünler sayfasından dilediğiniz ürünleri sepete ekleyin.',
        `Sepet sayfasındaki "Kupon Kodu" alanına ${campaign.couponCode} kodunu girin.`,
        'İndirim sepet toplamına otomatik olarak uygulanır.',
        'Ödeme adımına geçerek siparişinizi tamamlayın.',
      ]
    : [
        'Ürünler sayfasından kampanyalı ürünleri sepete ekleyin.',
        'Kampanya avantajı sepetinize otomatik olarak yansır.',
        'Ödeme adımına geçerek siparişinizi tamamlayın.',
      ];

  return (
    <>
      <SEO title={`${campaign.title} | Aquails Kampanyalar`} description={campaign.description.slice(0, 160)} canonical={`/kampanya/${campaign.slug}`} />
      <PageLayout>
        <PageHero
          eyebrow={campaign.discountLabel || 'Kampanya'}
          title={campaign.title}
          breadcrumbs={[{ label: 'Kampanyalar', to: '/kampanyalar' }, { label: campaign.title }]}
        >
          <div className="flex items-center gap-1.5 text-sm text-aq-muted">
            <Clock className="h-4 w-4" /> Son geçerlilik: <strong className="text-aq-ink">{campaign.endLabel}</strong>
          </div>
        </PageHero>

        <div className="page-container grid gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-16">
          <ScrollReveal>
            <div className="overflow-hidden rounded-xl bg-aq-cloud">
              <img src={campaign.imageUrl || FALLBACK_IMAGE} alt={campaign.title} className="aspect-[4/3] w-full object-cover" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            {campaign.description && (
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-aq-ink/80">{campaign.description}</p>
            )}

            {campaign.couponCode && (
              <div className="mt-7 rounded-xl bg-[#EEF4FA] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-aq-muted">Kupon kodu</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-bold tracking-wider text-aq-ink">{campaign.couponCode}</span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="inline-flex items-center gap-2 rounded-full bg-aq-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-aq-ink-soft"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Kopyalandı' : 'Kopyala'}
                  </button>
                </div>
              </div>
            )}

            <h2 className="mt-8 text-lg font-bold text-aq-ink">Nasıl yararlanırım?</h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-aq-ink text-xs font-bold text-white">{i + 1}</span>
                  <p className="pt-1 text-sm text-aq-ink/75">{step}</p>
                </li>
              ))}
            </ol>

            <Link to="/urunler" className="mt-8 inline-flex items-center gap-2 rounded-full bg-aq-ink px-7 py-3.5 text-sm font-semibold text-white hover:bg-aq-ink-soft">
              Alışverişe Başla <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </PageLayout>
    </>
  );
}
