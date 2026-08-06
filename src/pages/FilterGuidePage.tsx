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
      <section className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/40 py-12 md:py-16">
        <div className="page-container text-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center">
            <Filter className="w-7 h-7 text-aq-blue" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-aq-text">Cihazınıza Uygun Filtreyi Bulun</h1>
          <p className="text-sm text-aq-muted mt-2 max-w-lg mx-auto">Cihaz modelinizi ve ihtiyacınızı seçin, uyumlu filtreleri görün.</p>
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
              className="bg-white border border-aq-border/60 rounded-2xl p-6"
            >
              {step === 0 && (
                <>
                  <h2 className="text-lg font-semibold text-aq-text mb-4">Cihaz Modeliniz</h2>
                  <select
                    value={deviceModel}
                    onChange={e => setDeviceModel(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue mb-4"
                  >
                    <option value="">Seçiniz</option>
                    {deviceModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </>
              )}
              {step === 1 && (
                <>
                  <h2 className="text-lg font-semibold text-aq-text mb-4">Kullanım Süresi (Ay)</h2>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    value={usageMonths}
                    onChange={e => setUsageMonths(e.target.value)}
                    className="w-full mb-2"
                  />
                  <p className="text-center text-sm font-semibold text-aq-blue">{usageMonths} ay</p>
                </>
              )}
              {step === 2 && (
                <>
                  <h2 className="text-lg font-semibold text-aq-text mb-4">İhtiyacınız</h2>
                  <div className="grid grid-cols-1 gap-2">
                    {needs.map(n => (
                      <button
                        key={n.value}
                        onClick={() => setNeed(n.value)}
                        className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${
                          need === n.value
                            ? 'border-aq-deep bg-aq-sky text-aq-blue'
                            : 'border-aq-border/60 text-aq-muted'
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
                className="w-full flex items-center justify-center gap-2 bg-aq-blue text-white py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-50 mt-6"
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
                <div className="w-12 h-12 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-aq-aqua" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text">Uyumlu Filtreler</h2>
                <p className="text-sm text-aq-muted">{deviceModel} için öneriler</p>
              </div>

              {filterProducts.map(p => (
                <div key={p.id} className="bg-white border border-aq-border/60 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-16 h-16 bg-aq-sky rounded-xl overflow-hidden flex-shrink-0">
                    <img src={p.images?.[0] || '/images/products/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-aq-text">{p.name}</h4>
                    <p className="text-xs text-aq-muted">{p.price.toLocaleString('tr-TR')} ₺</p>
                  </div>
                  <Link to={`/urun/${p.slug}`} className="flex items-center gap-1 bg-aq-blue text-white text-xs font-medium px-3 py-2 rounded-xl hover:bg-aq-deep hover:text-white transition-all flex-shrink-0">
                    <ShoppingCart className="w-3 h-3" />
                  </Link>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-4">
                <Link to="/filtre-aboneligi" className="flex items-center gap-1.5 bg-aq-blue text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-aq-deep hover:text-white transition-all">
                  <RefreshCw className="w-3 h-3" /> Filtre Aboneliği
                </Link>
                <Link to="/filtre-hesaplayici" className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2 rounded-xl hover:border-aq-blue hover:text-aq-blue transition-all">
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
