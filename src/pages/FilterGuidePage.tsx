import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ArrowRight, ShoppingCart, RefreshCw, CheckCircle, Droplet } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { products } from '@/data';
import { SEO } from '@/components/SEO';


const deviceModels = [
  'Aquails Smart RO Pro', 'Aquails BlueDrop DirectFlow', 'Aquails Compact UnderSink',
  'Aquails WaterChef 600GPD', 'Aquails DirectFlow 400GPD', 'Diğer',
];

const needs = [
  { value: 'tatlandirici', label: 'Tatlandırıcı filtre' },
  { value: 'membran', label: 'Membran filtre' },
  { value: 'mineral', label: 'Mineral filtre' },
  { value: '5li-set', label: '5\'li filtre seti' },
  { value: 'emin-degilim', label: 'Emin değilim' },
];

export default function FilterGuidePage() {
  const [step, setStep] = useState(0);
  const [deviceModel, setDeviceModel] = useState('');
  const [usageMonths, setUsageMonths] = useState('6');
  const [need, setNeed] = useState('');
  const [showResult, setShowResult] = useState(false);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else setShowResult(true);
  };

  const filterProducts = products.filter(p => p.category === 'Filtreler' || p.category === 'Membran Filtreler').slice(0, 4);

  return (
    <>
      <SEO
        title="Filtre Seçim Rehberi | Aquails"
        description="Aquails filtre seçim rehberi. Cihazınıza uygun filtre setini bulun ve su kalitenizi koruyun."
        canonical="/filtre-secim-rehberi"
      />
    <PageLayout>
      <section className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E0F0FF] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-md mx-auto mb-4 flex items-center justify-center">
            <Filter className="w-7 h-7 text-[#1A73E8]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137]">Cihazınıza Uygun Filtreyi Bulun</h1>
          <p className="text-sm text-[#5A6B7B] mt-2 max-w-lg mx-auto">Cihaz modelinizi ve ihtiyacınızı seçin, uyumlu filtreleri görün.</p>
        </div>
      </section>

      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white border border-[#E8F0FE] rounded-2xl p-6"
            >
              {step === 0 && (
                <>
                  <h2 className="text-lg font-bold text-[#0D2137] mb-4">Cihaz Modeliniz</h2>
                  <select
                    value={deviceModel}
                    onChange={e => setDeviceModel(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8] mb-4"
                  >
                    <option value="">Seçiniz</option>
                    {deviceModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-bold text-[#0D2137] mb-4">Kullanım Süresi (Ay)</h2>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={usageMonths}
                    onChange={e => setUsageMonths(e.target.value)}
                    className="w-full mb-2"
                  />
                  <p className="text-center text-sm font-semibold text-[#1A73E8]">{usageMonths} ay</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-lg font-bold text-[#0D2137] mb-4">İhtiyacınız</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {needs.map(n => (
                      <button
                        key={n.value}
                        onClick={() => setNeed(n.value)}
                        className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                          need === n.value
                            ? 'border-[#1A73E8] bg-[#F0F6FF] text-[#1A73E8]'
                            : 'border-[#E8F0FE] text-[#5A6B7B]'
                        }`}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={handleNext}
                disabled={step === 0 && !deviceModel || step === 2 && !need}
                className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all disabled:opacity-50 mt-6"
              >
                {step === 2 ? 'Sonuçları Gör' : 'Devam Et'} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-[#0D2137]">Uyumlu Filtreler</h2>
                <p className="text-sm text-[#5A6B7B]">{deviceModel} için öneriler</p>
              </div>

              {filterProducts.map(p => (
                <div key={p.id} className="bg-white border border-[#E8F0FE] rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#F0F6FF] rounded-xl overflow-hidden flex-shrink-0">
                    <img src={p.images?.[0] || '/images/products/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#0D2137]">{p.name}</h4>
                    <p className="text-xs text-[#8B9DAF]">{p.price.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  <Link to={`/urun/${p.slug}`} className="flex items-center gap-1 bg-[#1A73E8] text-white text-xs font-semibold px-3 py-2 rounded-full hover:bg-[#1557B0] transition-all flex-shrink-0">
                    <ShoppingCart className="w-3 h-3" />
                  </Link>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-4">
                <Link to="/filtre-aboneligi" className="flex items-center gap-1.5 bg-[#1A73E8] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1557B0] transition-all">
                  <RefreshCw className="w-3 h-3" /> Filtre Aboneliği
                </Link>
                <Link to="/filtre-hesaplayici" className="flex items-center gap-1.5 border border-[#E8F0FE] text-[#5A6B7B] text-xs font-medium px-4 py-2 rounded-full hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">
                  <Droplet className="w-3 h-3" /> Hesaplayici
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
    </>
  );
}
