import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Building2, Users, Cpu, Droplet, Zap, Wallet,
  Wrench, CheckCircle, ArrowRight, ArrowLeft, ShoppingCart,
  MessageCircle, Sparkles, RefreshCw
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { openWhatsApp, getProductInquiryMessage } from '@/services/whatsappService';
import { getRecommendations, type WizardAnswers } from '@/services/recommendationService';



const steps = [
  {
    key: 'place' as const,
    title: 'Kullanim yeri nedir?',
    options: [
      { value: 'ev', label: 'Ev', icon: Home, desc: 'Ev için su arıtma çözümü' },
      { value: 'ofis', label: 'Ofis', icon: Building2, desc: 'Ofis ve kurumsal kullanım' },
      { value: 'isletme', label: 'Isletme', icon: Users, desc: 'Restoran, kafe, fabrika' },
      { value: 'bina', label: 'Bina girisi', icon: Building2, desc: 'Apartman ve site girisi' },
    ],
  },
  {
    key: 'people' as const,
    title: 'Kaç kişi kullanacak?',
    options: [
      { value: '1-2', label: '1-2 kisi', icon: Users, desc: 'Bekar/cift' },
      { value: '3-4', label: '3-4 kisi', icon: Users, desc: 'Aile' },
      { value: '5+', label: '5+ kisi', icon: Users, desc: 'Genis aile' },
      { value: 'yogun', label: 'Yoğun kullanım', icon: Droplet, desc: 'İş yeri/yoğun ihtiyaç' },
    ],
  },
  {
    key: 'systemType' as const,
    title: 'Hangi sistem tipi ilgini çekiyor?',
    options: [
      { value: 'tankli', label: 'Tankli klasik', icon: Droplet, desc: 'Geleneksel depolamali sistem' },
      { value: 'direkt-akis', label: 'Tanksız direkt akış', icon: Zap, desc: 'Anında arıtım, modern' },
      { value: 'dijital', label: 'Dijital sistem', icon: Cpu, desc: 'Akıllı sensör ve IoT' },
      { value: 'emin-degilim', label: 'Emin değilim', icon: Sparkles, desc: 'Size en uygununu bulalım' },
    ],
  },
  {
    key: 'priority' as const,
    title: 'Onceligin nedir?',
    options: [
      { value: 'fiyat', label: 'Uygun fiyat', icon: Wallet, desc: 'Ekonomik çözüm' },
      { value: 'performans', label: 'Yüksek performans', icon: Zap, desc: 'En iyi arıtım kalitesi' },
      { value: 'mineral', label: 'Mineral destekli', icon: Droplet, desc: 'Saglikli mineral dengesi' },
      { value: 'sessiz', label: 'Sessiz calisma', icon: CheckCircle, desc: 'Gurultusuz sistem' },
    ],
  },
  {
    key: 'budget' as const,
    title: 'Butce araligin nedir?',
    options: [
      { value: '5000-10000', label: '5.000 - 10.000 ₺', icon: Wallet, desc: 'Giris seviyesi' },
      { value: '10000-20000', label: '10.000 - 20.000 ₺', icon: Wallet, desc: 'Orta seviye' },
      { value: '20000+', label: '20.000+ ₺', icon: Wallet, desc: 'Premium' },
      { value: 'oner', label: 'Bütçeye göre öner', icon: Sparkles, desc: 'En uygun fiyat' },
    ],
  },
  {
    key: 'installation' as const,
    title: 'Kurulum dahil olsun mu?',
    options: [
      { value: 'evet', label: 'Evet', icon: Wrench, desc: 'Ücretsiz kurulum' },
      { value: 'hayir', label: 'Hayir', icon: CheckCircle, desc: 'Kendim kurarim' },
      { value: 'aransin', label: 'Servis beni arasın', icon: PhoneIcon, desc: 'Bilgi almak istiyorum' },
    ],
  },
  {
    key: 'subscription' as const,
    title: 'Filtre aboneliği ister misin?',
    options: [
      { value: 'evet', label: 'Evet', icon: RefreshCw, desc: 'Otomatik filtre hatırlama' },
      { value: 'hayir', label: 'Hayir', icon: CheckCircle, desc: 'Sonra dusunurum' },
      { value: 'sonra', label: 'Sonra karar veririm', icon: Sparkles, desc: 'Simdi degil' },
    ],
  },
];

function PhoneIcon(props: { className?: string }) {
  return (
    <svg className={props.className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function ProductWizardPage() {
  const addToast = useToastStore(s => s.add);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<WizardAnswers>({
    place: '', people: '', systemType: '', priority: '', budget: '', installation: '', subscription: '',
  });
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getRecommendations> | null>(null);

  const handleSelect = (value: string) => {
    const key = steps[currentStep].key;
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const recs = getRecommendations(answers);
      setRecommendations(recs);
      setCurrentStep(currentStep + 1);
      addToast('Size özel ürün önerileri hazırlandı!', 'success');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({ place: '', people: '', systemType: '', priority: '', budget: '', installation: '', subscription: '' });
    setRecommendations(null);
  };

  const isAnswered = answers[steps[currentStep].key] !== '';
  const progress = ((currentStep) / steps.length) * 100;

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0D2137] via-[#1A3A5C] to-[#0D2137] py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#1A73E8] rounded-full blur-3xl" />
        </div>
        <div className="page-container relative text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Size En Uygun Su Arıtma Cihazını Birlikte Seçelim</h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg mx-auto">Birkaç soruya cevap verin, eviniz veya iş yeriniz için en doğru Aquails sistemini önerelim.</p>
        </div>
      </section>

      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-10">
        {/* Progress */}
        {currentStep < steps.length && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs text-[#8B9DAF] mb-2">
              <span>Adim {currentStep + 1} / {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-[#E8F0FE] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#1A73E8] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Wizard Steps */}
        <AnimatePresence mode="wait">
          {currentStep < steps.length ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-[#0D2137] mb-6">{steps[currentStep].title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {steps[currentStep].options.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = answers[steps[currentStep].key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#1A73E8] bg-[#F0F6FF]'
                          : 'border-[#E8F0FE] bg-white hover:border-[#D6E3F0]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#1A73E8]' : 'bg-[#F0F6FF]'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-[#1A73E8]'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? 'text-[#1A73E8]' : 'text-[#0D2137]'}`}>{opt.label}</p>
                        <p className="text-[11px] text-[#8B9DAF]">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 text-sm font-medium text-[#5A6B7B] hover:text-[#0D2137] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Geri
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isAnswered}
                  className="flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === steps.length - 1 ? 'Sonuçları Gör' : 'Devam Et'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#F0F6FF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#1A73E8]" />
                </div>
                <h2 className="text-xl font-bold text-[#0D2137]">Size Özel Önerilerimiz</h2>
                <p className="text-sm text-[#5A6B7B] mt-2">İhtiyaclarınıza en uygun {recommendations?.length || 0} ürün bulduk.</p>
              </div>

              {recommendations?.map((rec, i) => (
                <ScrollReveal key={rec.product.id} delay={i * 0.1}>
                  <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5 mb-4 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-[#F0F6FF] rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={rec.product.images?.[0] || '/images/products/placeholder.jpg'}
                          alt={rec.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#1A73E8] bg-[#F0F6FF] px-2 py-0.5 rounded-full">%{rec.score} Uyum</span>
                          {rec.tags.map(t => (
                            <span key={t} className="text-[10px] text-[#8B9DAF] bg-[#F8FBFF] px-2 py-0.5 rounded-full">{t}</span>
                          ))}
                        </div>
                        <h3 className="text-base font-semibold text-[#0D2137]">{rec.product.name}</h3>
                        <p className="text-xs text-[#5A6B7B] mt-1">{rec.reason}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-[#1A73E8]">{rec.product.price.toLocaleString('tr-TR')} ₺</span>
                          {rec.product.oldPrice && (
                            <span className="text-xs text-[#8B9DAF] line-through">{rec.product.oldPrice.toLocaleString('tr-TR')} ₺</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Link to={`/urun/${rec.product.slug}`} className="flex items-center gap-1.5 bg-[#1A73E8] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1557B0] transition-all">
                            <ShoppingCart className="w-3 h-3" /> Ürünü İncele
                          </Link>
                          <button
                            onClick={() => openWhatsApp(getProductInquiryMessage(rec.product.name))}
                            className="flex items-center gap-1.5 border border-[#E8F0FE] text-[#5A6B7B] text-xs font-medium px-4 py-2 rounded-full hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all"
                          >
                            <MessageCircle className="w-3 h-3" /> WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}

              <div className="flex justify-center gap-3 mt-8">
                <button onClick={handleRestart} className="flex items-center gap-2 text-sm font-medium text-[#5A6B7B] hover:text-[#0D2137] transition-all">
                  <ArrowLeft className="w-4 h-4" /> Bastan Basla
                </button>
                <Link to="/urunler" className="flex items-center gap-2 bg-[#1A73E8] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">
                  Tumu <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
