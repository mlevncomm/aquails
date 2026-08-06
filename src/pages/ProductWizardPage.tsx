import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building2, Users, Cpu, Droplet, Zap, Wallet,
  Wrench, CheckCircle, ArrowRight, ArrowLeft, ShoppingCart,
  MessageCircle, Sparkles, RefreshCw, Phone, Loader2,
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';
import { ProductPrice } from '@/components/ProductPrice';
import { useToastStore } from '@/components/Toast';
import { openWhatsApp, getProductInquiryMessage } from '@/services/whatsappService';
import { getRecommendations, type WizardAnswers, type Recommendation } from '@/services/recommendationService';
import { loadPublicProducts } from '@/services/productService';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

type StepKey = keyof WizardAnswers;

interface StepOption {
  value: string;
  label: string;
  desc: string;
  icon: React.ElementType;
}

interface StepDef {
  key: StepKey;
  title: string;
  options: StepOption[];
}

const steps: StepDef[] = [
  {
    key: 'place',
    title: 'Kullanım yeri nedir?',
    options: [
      { value: 'ev', label: 'Ev', icon: Home, desc: 'Ev için su arıtma çözümü' },
      { value: 'ofis', label: 'Ofis', icon: Building2, desc: 'Ofis ve kurumsal kullanım' },
      { value: 'isletme', label: 'İşletme', icon: Users, desc: 'Restoran, kafe, fabrika' },
      { value: 'bina', label: 'Bina girişi', icon: Building2, desc: 'Apartman ve site girişi' },
    ],
  },
  {
    key: 'people',
    title: 'Kaç kişi kullanacak?',
    options: [
      { value: '1-2', label: '1-2 kişi', icon: Users, desc: 'Bekar / çift' },
      { value: '3-4', label: '3-4 kişi', icon: Users, desc: 'Aile' },
      { value: '5+', label: '5+ kişi', icon: Users, desc: 'Geniş aile' },
      { value: 'yogun', label: 'Yoğun kullanım', icon: Droplet, desc: 'İş yeri / yoğun ihtiyaç' },
    ],
  },
  {
    key: 'systemType',
    title: 'Hangi sistem tipi ilgini çekiyor?',
    options: [
      { value: 'tankli', label: 'Tanklı klasik', icon: Droplet, desc: 'Geleneksel depolamalı sistem' },
      { value: 'direkt-akis', label: 'Tanksız direkt akış', icon: Zap, desc: 'Anında arıtım, modern' },
      { value: 'dijital', label: 'Dijital sistem', icon: Cpu, desc: 'Akıllı sensör ve IoT' },
      { value: 'emin-degilim', label: 'Emin değilim', icon: Sparkles, desc: 'Size en uygununu bulalım' },
    ],
  },
  {
    key: 'priority',
    title: 'Önceliğin nedir?',
    options: [
      { value: 'fiyat', label: 'Uygun fiyat', icon: Wallet, desc: 'Ekonomik çözüm' },
      { value: 'performans', label: 'Yüksek performans', icon: Zap, desc: 'En iyi arıtım kalitesi' },
      { value: 'mineral', label: 'Mineral destekli', icon: Droplet, desc: 'Sağlıklı mineral dengesi' },
      { value: 'sessiz', label: 'Sessiz çalışma', icon: CheckCircle, desc: 'Gürültüsüz sistem' },
    ],
  },
  {
    key: 'budget',
    title: 'Bütçe aralığın nedir?',
    options: [
      { value: '0-20000', label: '20.000 ₺ altı', icon: Wallet, desc: 'Giriş seviyesi' },
      { value: '20000-50000', label: '20.000 – 50.000 ₺', icon: Wallet, desc: 'Orta seviye' },
      { value: '50000-100000', label: '50.000 – 100.000 ₺', icon: Wallet, desc: 'Üst segment' },
      { value: '100000+', label: '100.000 ₺+', icon: Wallet, desc: 'Premium' },
      { value: 'oner', label: 'Bütçeye göre öner', icon: Sparkles, desc: 'En uygun seçenekleri getir' },
    ],
  },
  {
    key: 'installation',
    title: 'Kurulum dahil olsun mu?',
    options: [
      { value: 'evet', label: 'Evet', icon: Wrench, desc: 'Profesyonel kurulum' },
      { value: 'hayir', label: 'Hayır', icon: CheckCircle, desc: 'Kendim kurarım' },
      { value: 'aransin', label: 'Servis beni arasın', icon: Phone, desc: 'Bilgi almak istiyorum' },
    ],
  },
  {
    key: 'subscription',
    title: 'Filtre aboneliği ister misin?',
    options: [
      { value: 'evet', label: 'Evet', icon: RefreshCw, desc: 'Otomatik filtre hatırlatma' },
      { value: 'hayir', label: 'Hayır', icon: CheckCircle, desc: 'Sonra düşünürüm' },
      { value: 'sonra', label: 'Sonra karar veririm', icon: Sparkles, desc: 'Şimdi değil' },
    ],
  },
];

const emptyAnswers: WizardAnswers = {
  place: '',
  people: '',
  systemType: '',
  priority: '',
  budget: '',
  installation: '',
  subscription: '',
};

export default function ProductWizardPage() {
  const addToast = useToastStore((s) => s.add);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>(emptyAnswers);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void loadPublicProducts()
      .then((result) => {
        if (cancelled) return;
        if (result.ok) setCatalog(result.products);
        // result.ok false → recommendationService kendi fallback kataloğunu kullanır
      })
      .finally(() => {
        if (!cancelled) setCatalogLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const showingResults = currentStep >= steps.length;
  const step = steps[currentStep];
  const selectedValue = step ? answers[step.key] : '';
  const progress = showingResults ? 100 : (currentStep / steps.length) * 100;

  const finish = (nextAnswers: WizardAnswers) => {
    const recs = getRecommendations(nextAnswers, catalog);
    setRecommendations(recs);
    setCurrentStep(steps.length);
    if (recs.length > 0) {
      addToast('Size özel ürün önerileri hazırlandı!', 'success');
    } else {
      addToast('Uygun ürün bulunamadı. Filtreleri değiştirip tekrar deneyin.', 'info');
    }
  };

  const goNext = (nextAnswers: WizardAnswers = answers) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
      return;
    }
    finish(nextAnswers);
  };

  const handleSelect = (value: string) => {
    if (!step || advancing) return;
    const nextAnswers = { ...answers, [step.key]: value };
    setAnswers(nextAnswers);
    setAdvancing(true);
    window.setTimeout(() => {
      goNext(nextAnswers);
      setAdvancing(false);
    }, 220);
  };

  const handleNext = () => {
    if (!selectedValue || advancing) return;
    goNext(answers);
  };

  const handleBack = () => {
    if (currentStep === 0 || advancing) return;
    if (showingResults) {
      setCurrentStep(steps.length - 1);
      setRecommendations(null);
      return;
    }
    setCurrentStep((s) => s - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers(emptyAnswers);
    setRecommendations(null);
  };

  const resultCount = recommendations?.length ?? 0;

  const subtitle = useMemo(() => {
    if (catalogLoading) return 'Ürün kataloğu yükleniyor…';
    return 'Birkaç soruya cevap verin, eviniz veya iş yeriniz için en doğru Aquails sistemini önerelim.';
  }, [catalogLoading]);

  return (
    <PageLayout>
      <SEO
        title="Ürün Seçim Sihirbazı | Aquails"
        description="Birkaç soruya cevap vererek eviniz veya iş yeriniz için en uygun Aquails su arıtma cihazını bulun."
        canonical="/urun-secim-sihirbazi"
      />

      <section className="relative bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-aq-aqua rounded-full blur-3xl" />
        </div>
        <div className="page-container relative text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Size En Uygun Su Arıtma Cihazını Birlikte Seçelim
          </h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg mx-auto">{subtitle}</p>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-10">
        {!showingResults && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-aq-muted mb-2">
              <span>
                Adım {currentStep + 1} / {steps.length}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-aq-ice rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-aq-aqua rounded-full"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!showingResults && step ? (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="text-xl font-semibold text-aq-text mb-6">{step.title}</h2>
              <div className={cn('grid gap-3', step.options.length > 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2')}>
                {step.options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={advancing || catalogLoading}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        'flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                        isSelected
                          ? 'border-aq-deep bg-aq-sky'
                          : 'border-aq-border/60 bg-white hover:border-aq-blue/40',
                        (advancing || catalogLoading) && 'opacity-70',
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                          isSelected ? 'bg-aq-aqua' : 'bg-aq-sky',
                        )}
                      >
                        <Icon className={cn('w-5 h-5', isSelected ? 'text-aq-text' : 'text-aq-blue')} />
                      </div>
                      <div>
                        <p className={cn('text-sm font-semibold', isSelected ? 'text-aq-blue' : 'text-aq-text')}>
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-aq-muted">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0 || advancing}
                  className="flex items-center gap-2 text-sm font-medium text-aq-muted hover:text-aq-text disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!selectedValue || advancing || catalogLoading}
                  className="flex items-center gap-2 bg-aq-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {catalogLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Yükleniyor
                    </>
                  ) : currentStep === steps.length - 1 ? (
                    <>
                      Sonuçları Gör <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Devam Et <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-aq-blue" />
                </div>
                <h2 className="text-xl font-semibold text-aq-text">Size Özel Önerilerimiz</h2>
                <p className="text-sm text-aq-muted mt-2">
                  {resultCount > 0
                    ? `İhtiyaçlarınıza en uygun ${resultCount} ürün bulduk.`
                    : 'Seçimlerinize tam uyan cihaz bulunamadı. Bütçe veya sistem tipini değiştirip tekrar deneyin.'}
                </p>
              </div>

              {recommendations?.map((rec, i) => (
                <ScrollReveal key={rec.product.id} delay={i * 0.08}>
                  <div className="bg-white border border-aq-border/60 rounded-2xl p-5 mb-4 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-aq-sky rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <img
                          src={rec.product.images?.[0] || '/images/products/placeholder.jpg'}
                          alt={rec.product.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-aq-blue bg-aq-sky px-2 py-0.5 rounded-full">
                            %{rec.score} Uyum
                          </span>
                          {rec.tags.map((t) => (
                            <span key={t} className="text-[10px] text-aq-muted bg-aq-ice px-2 py-0.5 rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-base font-semibold text-aq-text">{rec.product.name}</h3>
                        <p className="text-xs text-aq-muted mt-1">{rec.reason}</p>
                        <ProductPrice product={rec.product} size="md" className="mt-2" />
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Link
                            to={`/urun/${rec.product.slug}`}
                            className="flex items-center gap-1.5 bg-aq-blue text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-aq-deep transition-all"
                          >
                            <ShoppingCart className="w-3 h-3" /> Ürünü İncele
                          </Link>
                          <button
                            type="button"
                            onClick={() => openWhatsApp(getProductInquiryMessage(rec.product.name))}
                            className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2 rounded-xl hover:border-aq-blue hover:text-aq-blue transition-all"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-2 text-sm font-medium text-aq-muted hover:text-aq-text transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Baştan Başla
                </button>
                <Link
                  to="/urunler"
                  className="flex items-center gap-2 bg-aq-blue text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep transition-all"
                >
                  Tüm Ürünler <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
