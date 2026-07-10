import { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, AlertTriangle, CheckCircle,
  ShoppingCart, RefreshCw, Droplet
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { useToastStore } from '@/components/Toast';
import { calculateFilterChange, saveFilterReminder, type FilterCalcInput, type FilterCalcResult } from '@/services/filterCalculatorService';
import { SEO } from '@/components/SEO';


const deviceModels = [
  'Aquails Smart RO Pro', 'Aquails BlueDrop DirectFlow', 'Aquails Compact UnderSink',
  'Aquails WaterChef 600GPD', 'Aquails DirectFlow 400GPD', 'Aquails Premium 8 Stage',
  'Aquails Ultra Compact', 'Aquails Smart Digital RO', 'Aquails Office Pro',
  'Diğer',
];

export default function FilterCalculatorPage() {
  const addToast = useToastStore(s => s.add);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<FilterCalcResult | null>(null);
  const [form, setForm] = useState<FilterCalcInput>({
    deviceModel: '',
    lastChangeDate: '',
    peopleCount: '3-4',
    usageIntensity: 'medium',
    hasTasteIssue: false,
    createReminder: true,
  });
  const [email, setEmail] = useState('');

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deviceModel || !form.lastChangeDate) {
      addToast('Lütfen cihaz modeli ve son değişim tarihini girin.', 'error');
      return;
    }
    const res = calculateFilterChange(form);
    setResult(res);
    setSubmitted(true);
    if (form.createReminder && email) {
      saveFilterReminder({ ...form, email });
      addToast('Filtre hatırlatıcınız oluşturuldu!', 'success');
    }
  };

  const statusConfig = {
    healthy: { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', iconColor: 'text-emerald-500' },
    approaching: { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', iconColor: 'text-amber-500' },
    overdue: { icon: AlertTriangle, bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', iconColor: 'text-red-500' },
  };

  return (
    <>
      <SEO
        title="Filtre Değişim Hesaplayıcı | Aquails"
        description="Aquails filtre değişim sürenizi hesaplayın. Cihaz modelinize göre bir sonraki filtre değişim tarihini öğrenin."
        canonical="/filtre-hesaplayici"
      />
    <PageLayout>
      <section className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E0F0FF] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-md mx-auto mb-4 flex items-center justify-center">
            <Calculator className="w-7 h-7 text-[#1A73E8]" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137]">Filtre Değişim Zamanınızı Hesaplayın</h1>
          <p className="text-sm text-[#5A6B7B] mt-2 max-w-lg mx-auto">Cihaz modelinizi ve kullanım bilgilerinizi girin, bir sonraki filtre değişim tarihinizi öğrenin.</p>
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
              onSubmit={handleCalculate}
              className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-5"
            >
              <div>
                <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Cihaz Modeli *</label>
                <select
                  value={form.deviceModel}
                  onChange={e => setForm({ ...form, deviceModel: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                >
                  <option value="">Seçiniz</option>
                  {deviceModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Son Filtre Değişimi Tarihi *</label>
                <input
                  type="date"
                  value={form.lastChangeDate}
                  onChange={e => setForm({ ...form, lastChangeDate: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Kaç Kişi Kullanıyor?</label>
                  <select
                    value={form.peopleCount}
                    onChange={e => setForm({ ...form, peopleCount: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                  >
                    <option value="1-2">1-2 kişi</option>
                    <option value="3-4">3-4 kişi</option>
                    <option value="5+">5+ kişi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Kullanım Yoğunluğu</label>
                  <select
                    value={form.usageIntensity}
                    onChange={e => setForm({ ...form, usageIntensity: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Su Tadında/Kokusunda Değişim Var Mı?</label>
                <div className="flex gap-3">
                  {[
                    { value: false, label: 'Hayır' },
                    { value: true, label: 'Evet' },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setForm({ ...form, hasTasteIssue: opt.value })}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                        form.hasTasteIssue === opt.value
                          ? 'border-[#1A73E8] bg-[#F0F6FF] text-[#1A73E8]'
                          : 'border-[#E8F0FE] text-[#5A6B7B]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Filtre Değişim Hatırlatıcısı Oluşturulsun Mu?</label>
                <div className="flex gap-3">
                  {[
                    { value: true, label: 'Evet' },
                    { value: false, label: 'Hayır' },
                  ].map(opt => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setForm({ ...form, createReminder: opt.value })}
                      className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-all ${
                        form.createReminder === opt.value
                          ? 'border-[#1A73E8] bg-[#F0F6FF] text-[#1A73E8]'
                          : 'border-[#E8F0FE] text-[#5A6B7B]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.createReminder && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">E-posta Adresiniz</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Hatırlatıcı için e-posta"
                    className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]"
                  />
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#1A73E8] text-white py-3.5 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all"
              >
                <Calculator className="w-4 h-4" /> Hesapla
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
                  {/* Status Card */}
                  <div className={`${statusConfig[result.status].bg} border ${statusConfig[result.status].border} rounded-2xl p-6 text-center`}>
                    {(() => { const StatusIcon = statusConfig[result.status].icon; return <StatusIcon className={`w-12 h-12 ${statusConfig[result.status].iconColor} mx-auto mb-3`} />; })()}
                    <h3 className={`text-lg font-bold ${statusConfig[result.status].text}`}>{result.statusLabel}</h3>
                    <div className="mt-4">
                      <p className="text-3xl font-bold text-[#0D2137]">{result.daysRemaining > 0 ? `${result.daysRemaining} gün` : `${Math.abs(result.daysRemaining)} gün gecikme`}</p>
                      <p className="text-xs text-[#8B9DAF] mt-1">Sonraki önerilen değişim: {result.nextChangeDate.toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  {/* Recommended Filters */}
                  <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
                    <h4 className="text-sm font-semibold text-[#0D2137] mb-3">Önerilen Filtreler</h4>
                    <div className="space-y-2">
                      {result.recommendedFilters.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#5A6B7B]">
                          <Droplet className="w-4 h-4 text-[#1A73E8]" /> {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link to="/urunler?kategori=filtreler" className="flex items-center gap-1.5 bg-[#1A73E8] text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-[#1557B0] transition-all">
                        <ShoppingCart className="w-3 h-3" /> Filtre Al
                      </Link>
                      <Link to="/filtre-aboneligi" className="flex items-center gap-1.5 border border-[#E8F0FE] text-[#5A6B7B] text-xs font-medium px-4 py-2 rounded-full hover:border-[#1A73E8] hover:text-[#1A73E8] transition-all">
                        <RefreshCw className="w-3 h-3" /> Abonelik Oluştur
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSubmitted(false); setResult(null); }}
                    className="w-full text-sm font-medium text-[#5A6B7B] hover:text-[#0D2137] transition-all py-2"
                  >
                    Yeniden Hesapla
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
