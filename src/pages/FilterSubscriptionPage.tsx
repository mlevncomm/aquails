import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { RefreshCw, Check, Truck, Shield, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/components/Toast';
import { createSubscription } from '@/services/subscriptionService';


const plans = [
  { id: '6ay', name: '6 Aylık Filtre Seti', price: 590, period: '6 ayda bir', features: ['4\'lü filtre seti', 'Ücretsiz kargo', 'Kurulum hatırlatma', '%10 indirim'], color: 'bg-aq-navy', popular: false },
  { id: '12ay', name: '12 Aylık Filtre Seti', price: 990, period: '12 ayda bir', features: ['4\'lü filtre seti', 'Ücretsiz kargo', 'Öncelikli servis', '%15 indirim', 'Yedek sediment'], color: 'bg-aq-aqua', popular: true },
  { id: 'premium', name: 'Premium Bakım Paketi', price: 1890, period: '6 ayda bir', features: ['Filtre seti', 'Cihaz bakımı', 'Ücretsiz kargo', '7/24 destek', '%20 indirim', 'Garanti uzatma'], color: 'bg-purple-500', popular: false },
];

const benefits = [
  { icon: RefreshCw, title: 'Otomatik Teslimat', desc: 'Filtreleriniz düzenli aralıklarla kapınıza kadar gelir.' },
  { icon: Truck, title: 'Ücretsiz Kargo', desc: 'Tüm abonelik gönderilerinde kargo ücretsizdir.' },
  { icon: Shield, title: 'Garanti Uzatma', desc: 'Premium pakette cihaz garantisi 1 yıl uzatılır.' },
  { icon: Clock, title: 'Hatırlatma Sistemi', desc: 'Filtre değişim zamanı yaklaştığında bildirim alırsınız.' },
];

export default function FilterSubscriptionPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addToast = useToastStore((s) => s.add);
  const [submittingPlan, setSubmittingPlan] = useState<string | null>(null);

  const subscribe = async (plan: (typeof plans)[number]) => {
    if (!user) {
      addToast('Abonelik oluşturmak için giriş yapmalısınız.', 'info');
      navigate('/giris?redirect=/filtre-aboneligi');
      return;
    }
    setSubmittingPlan(plan.id);
    const result = await createSubscription({
      userId: user.id,
      plan: plan.id,
      deviceName: 'Aquails Cihazım',
      price: plan.price,
    });
    setSubmittingPlan(null);
    if (!result.success) {
      addToast(result.error ?? 'Abonelik oluşturulamadı.', 'error');
      return;
    }
    addToast('Aboneliğiniz oluşturuldu.', 'success');
    navigate('/hesabim/abonelikler');
  };

  return (
    <>
      <SEO
        title="Filtre Aboneliği | Aquails"
        description="Aquails filtre aboneliği ile filtreleriniz düzenli olarak kapınıza gelsin. %15 indirim ve ücretsiz değişim avantajları."
        canonical="/filtre-aboneligi"
      />
    <PageLayout>
      <div className="page-container py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[13px] text-aq-muted mb-2">
            <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-aq-muted">Filtre Aboneliği</span>
          </div>
          <h1 className="text-3xl font-bold text-aq-text mb-3">Filtre Aboneliği</h1>
          <p className="text-aq-muted max-w-xl mx-auto">
            Filtre değişimini unutmayın! Abone olun, filtreleriniz düzenli olarak kapınıza gelsin.
            Hem daha uygun fiyatla alın, hem sağlığınızdan ödün vermeyin.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-aq-border/60 rounded-2xl p-5 text-center"
            >
              <div className="w-10 h-10 bg-aq-sky rounded-xl flex items-center justify-center mx-auto mb-3">
                <b.icon className="w-5 h-5 text-aq-blue" />
              </div>
              <h3 className="text-sm font-semibold text-aq-text mb-1">{b.title}</h3>
              <p className="text-xs text-aq-muted">{b.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`relative bg-white border-2 rounded-2xl p-6 ${plan.popular ? 'border-aq-deep' : 'border-aq-border/60'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-aq-deep text-white text-xs font-medium px-3 py-1 rounded-full">
                  En Popüler
                </span>
              )}
              <h3 className="text-base font-semibold text-aq-text mt-2">{plan.name}</h3>
              <p className="text-xs text-aq-muted mb-4">{plan.period} teslimat</p>
              <div className="mb-5">
                <span className="text-3xl font-bold text-aq-text">{plan.price}₺</span>
                <span className="text-sm text-aq-muted"> / dönem</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-aq-muted">
                    <Check className="w-4 h-4 text-aq-aqua flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => void subscribe(plan)}
                disabled={submittingPlan !== null}
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  plan.popular ? 'bg-aq-blue text-white hover:bg-aq-deep' : 'border-2 border-aq-deep text-aq-blue hover:bg-aq-sky'
                } disabled:opacity-60`}
              >
                {submittingPlan === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Abone Ol
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
    </>
  );
}
