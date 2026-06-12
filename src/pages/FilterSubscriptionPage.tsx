import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { RefreshCw, Check, Truck, Shield, Clock, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { SEO } from '@/components/SEO';


const plans = [
  { id: '6ay', name: '6 Aylık Filtre Seti', price: 590, period: '6 ayda bir', features: ['4\'lü filtre seti', 'Ücretsiz kargo', 'Kurulum hatırlatma', '%10 indirim'], color: 'bg-blue-500', popular: false },
  { id: '12ay', name: '12 Aylık Filtre Seti', price: 990, period: '12 ayda bir', features: ['4\'lü filtre seti', 'Ücretsiz kargo', 'Öncelikli servis', '%15 indirim', 'Yedek sediment'], color: 'bg-emerald-500', popular: true },
  { id: 'premium', name: 'Premium Bakım Paketi', price: 1890, period: '6 ayda bir', features: ['Filtre seti', 'Cihaz bakımı', 'Ücretsiz kargo', '7/24 destek', '%20 indirim', 'Garanti uzatma'], color: 'bg-purple-500', popular: false },
];

const benefits = [
  { icon: RefreshCw, title: 'Otomatik Teslimat', desc: 'Filtreleriniz düzenli aralıklarla kapınıza kadar gelir.' },
  { icon: Truck, title: 'Ücretsiz Kargo', desc: 'Tüm abonelik gönderilerinde kargo ücretsizdir.' },
  { icon: Shield, title: 'Garanti Uzatma', desc: 'Premium pakette cihaz garantisi 1 yıl uzatılır.' },
  { icon: Clock, title: 'Hatırlatma Sistemi', desc: 'Filtre değişim zamanı yaklaştığında bildirim alırsınız.' },
];

export default function FilterSubscriptionPage() {
  return (
    <>
      <SEO
        title="Filtre Aboneliği | Aquails"
        description="Aquails filtre aboneliği ile filtreleriniz düzenli olarak kapınıza gelsin. %15 indirim ve ücretsiz değişim avantajları."
        canonical="/filtre-aboneligi"
      />
    <PageLayout>
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-[13px] text-[#8B9DAF] mb-2">
            <Link to="/" className="hover:text-[#1A73E8]">Ana Sayfa</Link>
            <span>/</span>
            <span className="text-[#5A6B7B]">Filtre Aboneliği</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0D2137] mb-3">Filtre Aboneliği</h1>
          <p className="text-[#5A6B7B] max-w-xl mx-auto">
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
              className="bg-white border border-[#E8F0FE] rounded-2xl p-5 text-center"
            >
              <div className="w-10 h-10 bg-[#F0F6FF] rounded-xl flex items-center justify-center mx-auto mb-3">
                <b.icon className="w-5 h-5 text-[#1A73E8]" />
              </div>
              <h3 className="text-sm font-semibold text-[#0D2137] mb-1">{b.title}</h3>
              <p className="text-xs text-[#8B9DAF]">{b.desc}</p>
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
              className={`relative bg-white border-2 rounded-2xl p-6 ${plan.popular ? 'border-[#1A73E8]' : 'border-[#E8F0FE]'}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A73E8] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  En Popüler
                </span>
              )}
              <h3 className="text-base font-bold text-[#0D2137] mt-2">{plan.name}</h3>
              <p className="text-xs text-[#8B9DAF] mb-4">{plan.period} teslimat</p>
              <div className="mb-5">
                <span className="text-3xl font-bold text-[#0D2137]">{plan.price}₺</span>
                <span className="text-sm text-[#8B9DAF]"> / dönem</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#5A6B7B]">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/urunler"
                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-sm font-semibold transition-all ${
                  plan.popular ? 'bg-[#1A73E8] text-white hover:bg-[#1557B0]' : 'border-2 border-[#1A73E8] text-[#1A73E8] hover:bg-[#F0F6FF]'
                }`}
              >
                Abone Ol <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
    </>
  );
}
