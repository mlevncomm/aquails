import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Droplet, Info,
  ArrowRight, ShoppingCart, Wrench, BookOpen
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { analyzeTDS, getEstimatedTDSForCity, type TDSInput, type TDSResult } from '@/services/tdsService';
import { SEO } from '@/components/SEO';


const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Kocaeli', 'Konya', 'Adana', 'Gaziantep', 'Kayseri', 'Samsun', 'Trabzon', 'Eskişehir', 'Mersin'];

const usagePurposes = [
  { value: 'icme', label: 'İçme suyu' },
  { value: 'yemek', label: 'Yemek/çay/kahve' },
  { value: 'bebek', label: 'Bebek/çocuk için' },
  { value: 'isyeri', label: 'İş yeri kullanımı' },
];

const waterIssues = [
  { value: 'kirec', label: 'Kireç' },
  { value: 'koku', label: 'Koku' },
  { value: 'tat', label: 'Tat bozukluğu' },
  { value: 'tortu', label: 'Tortu' },
];

export default function WaterQualityTestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TDSResult | null>(null);
  const [form, setForm] = useState<TDSInput>({
    tdsValue: 0,
    city: 'İstanbul',
    usagePurpose: 'icme',
    waterIssues: [],
  });

  const handleIssueToggle = (issue: string) => {
    setForm(prev => ({
      ...prev,
      waterIssues: prev.waterIssues.includes(issue)
        ? prev.waterIssues.filter(i => i !== issue)
        : [...prev.waterIssues, issue],
    }));
  };

  const handleCityChange = (city: string) => {
    setForm(prev => ({ ...prev, city, tdsValue: getEstimatedTDSForCity(city) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.tdsValue <= 0) return;
    const res = analyzeTDS(form);
    setResult(res);
    setSubmitted(true);
  };

  const tdsColor = form.tdsValue < 50 ? '#1286D8' : form.tdsValue <= 150 ? '#20D3F2' : form.tdsValue <= 300 ? '#F59E0B' : '#E85454';

  return (
    <>
      <SEO
        title="Su Kalitesi Testi | Aquails"
        description="Evdeki suyunuzun kalitesini test edin. TDS değeri, pH seviyesi ve saflık oranı hakkında bilgi edinin."
        canonical="/su-kalitesi-testi"
      />
    <PageLayout>
      <section className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/40 py-12 md:py-16">
        <div className="page-container text-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm mx-auto mb-4 flex items-center justify-center">
            <FlaskConical className="w-7 h-7 text-aq-blue" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-aq-text">Suyunuzun Kalitesini Ogrenin</h1>
          <p className="text-sm text-aq-muted mt-2 max-w-lg mx-auto">TDS değeri ve kullanım ihtiyacınıza göre size en uygun su arıtma çözümünü önerelim.</p>
        </div>
      </section>

      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-white border border-aq-border/60 rounded-2xl p-6 space-y-5"
            >
              {/* TDS Value */}
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">TDS Degeri (ppm) *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="2000"
                    value={form.tdsValue || ''}
                    onChange={e => setForm({ ...form, tdsValue: Number(e.target.value) })}
                    placeholder="Örn: 180"
                    className="flex-1 px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                  />
                  {form.tdsValue > 0 && (
                    <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: tdsColor + '20' }}>
                      <Droplet className="w-5 h-5 m-2.5" style={{ color: tdsColor }} />
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-aq-muted mt-1">TDS ölçeriniz yoksa şehir seçerek tahmini değer alabilirsiniz.</p>
              </div>

              {/* City */}
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Şehir</label>
                <select
                  value={form.city}
                  onChange={e => handleCityChange(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {form.tdsValue > 0 && (
                  <p className="text-[11px] text-aq-muted mt-1">{form.city} için tahmini TDS: ~{getEstimatedTDSForCity(form.city)} ppm</p>
                )}
              </div>

              {/* Usage Purpose */}
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Kullanim Amaci</label>
                <div className="grid grid-cols-2 gap-2">
                  {usagePurposes.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setForm({ ...form, usagePurpose: p.value })}
                      className={`py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                        form.usagePurpose === p.value
                          ? 'border-aq-deep bg-aq-sky text-aq-blue'
                          : 'border-aq-border/60 text-aq-muted'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Water Issues */}
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Musluk Suyunda Sorun Var Mi?</label>
                <div className="flex flex-wrap gap-2">
                  {waterIssues.map(i => (
                    <button
                      key={i.value}
                      type="button"
                      onClick={() => handleIssueToggle(i.value)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border-2 transition-all ${
                        form.waterIssues.includes(i.value)
                          ? 'border-aq-deep bg-aq-sky text-aq-blue'
                          : 'border-aq-border/60 text-aq-muted'
                      }`}
                    >
                      {i.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, waterIssues: [] })}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border-2 transition-all ${
                      form.waterIssues.length === 0
                        ? 'border-aq-deep bg-aq-sky text-aq-blue'
                        : 'border-aq-border/60 text-aq-muted'
                    }`}
                  >
                    Emin değilim
                  </button>
                </div>
              </div>

              {/* TDS Scale */}
              <div className="bg-aq-ice rounded-xl p-4">
                <p className="text-xs font-medium text-aq-muted mb-2">TDS Degeri Olcegi</p>
                <div className="flex h-3 rounded-full overflow-hidden">
                  <div className="flex-1 bg-aq-sky" />
                  <div className="flex-1 bg-aq-aqua" />
                  <div className="flex-1 bg-[#F59E0B]" />
                  <div className="flex-1 bg-[#E85454]" />
                </div>
                <div className="flex justify-between text-[10px] text-aq-muted mt-1">
                  <span>0-50 Dusuk</span>
                  <span>50-150 Ideal</span>
                  <span>150-300 Orta</span>
                  <span>300+ Yüksek</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={form.tdsValue <= 0}
                className="w-full flex items-center justify-center gap-2 bg-aq-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-50"
              >
                <FlaskConical className="w-4 h-4" /> Analiz Et
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {result && (
                <>
                  {/* Result Card */}
                  <div className="bg-white border border-aq-border/60 rounded-2xl p-6 text-center">
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: result.color + '15' }}>
                      <FlaskConical className="w-8 h-8" style={{ color: result.color }} />
                    </div>
                    <h3 className="text-lg font-semibold text-aq-text">{result.label}</h3>
                    <p className="text-sm text-aq-muted mt-2">{result.description}</p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-aq-sky text-aq-blue text-xs font-semibold px-4 py-2 rounded-xl">
                      Önerilen: {result.recommendedDeviceType}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
                    <h4 className="text-sm font-semibold text-aq-text mb-3">Oneriler</h4>
                    <div className="space-y-2">
                      {result.tips.map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-aq-muted">
                          <Info className="w-4 h-4 text-aq-blue flex-shrink-0 mt-0.5" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Products */}
                  {result.recommendedProducts.length > 0 && (
                    <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
                      <h4 className="text-sm font-semibold text-aq-text mb-3">Önerilen Ürünler</h4>
                      <div className="space-y-3">
                        {result.recommendedProducts.map(p => (
                          <Link
                            key={p.id}
                            to={`/urun/${p.slug}`}
                            className="flex items-center gap-3 p-3 bg-aq-ice rounded-xl hover:bg-aq-sky transition-all group"
                          >
                            <div className="w-12 h-12 bg-aq-sky rounded-lg overflow-hidden flex-shrink-0">
                              <img src={p.images?.[0] || '/images/products/placeholder.jpg'} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/images/products/placeholder.jpg'; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-aq-text group-hover:text-aq-blue transition-colors line-clamp-1">{p.name}</p>
                              <p className="text-xs text-aq-muted">{p.price.toLocaleString('tr-TR')} ₺</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-aq-muted group-hover:text-aq-blue" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <Link to="/urun-secim-sihirbazi" className="flex items-center gap-1.5 bg-aq-blue text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-aq-deep hover:text-white transition-all">
                      <ShoppingCart className="w-3 h-3" /> Sihirbaz
                    </Link>
                    <Link to="/servis-randevusu" className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2 rounded-xl hover:border-aq-blue hover:text-aq-blue transition-all">
                      <Wrench className="w-3 h-3" /> Servis
                    </Link>
                    <Link to="/blog" className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2 rounded-xl hover:border-aq-blue hover:text-aq-blue transition-all">
                      <BookOpen className="w-3 h-3" /> Blog
                    </Link>
                  </div>

                  <button
                    onClick={() => { setSubmitted(false); setResult(null); }}
                    className="w-full text-sm font-medium text-aq-muted hover:text-aq-text transition-all py-2"
                  >
                    Yeniden Test Et
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
    </>
  );
}
