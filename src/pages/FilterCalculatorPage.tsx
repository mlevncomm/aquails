import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, AlertTriangle, CheckCircle,
  ShoppingCart, RefreshCw, Droplet
} from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { useToastStore } from '@/components/Toast';
import { calculateFilterChange, type FilterCalcInput, type FilterCalcResult } from '@/services/filterCalculatorService';
import { addFilterDevice } from '@/services/filterTrackingService';
import { useAuthStore } from '@/stores/authStore';
import { useCatalog } from '@/hooks/useCatalog';
import { SEO } from '@/components/SEO';
import { PageHero } from '@/components/PageHero';


const DEVICE_CATEGORIES = new Set(['direkt-akis-ro', 'klasik-ro-sistemleri', 'soft-kompakt', 'sebiller', 'bina-giris-filtrasyon']);

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
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const { products } = useCatalog();
  const [reminderState, setReminderState] = useState<'idle' | 'saved' | 'login'>('idle');

  // Real catalog devices (RO systems, dispensers, whole-house) instead of a hard-coded list.
  const deviceModels = useMemo(() => {
    const names = products.filter((p) => DEVICE_CATEGORIES.has(p.categorySlug)).map((p) => p.name);
    return [...Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, 'tr')), 'Diğer'];
  }, [products]);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.deviceModel || !form.lastChangeDate) {
      addToast('Lütfen cihaz modeli ve son değişim tarihini girin.', 'error');
      return;
    }
    if (form.lastChangeDate > new Date().toISOString().slice(0, 10)) {
      addToast('Son değişim tarihi gelecekte olamaz.', 'error');
      return;
    }
    const res = calculateFilterChange(form);
    setResult(res);
    setSubmitted(true);
    setReminderState('idle');

    if (!form.createReminder) return;
    if (!user) {
      setReminderState('login');
      return;
    }
    const interval = Math.max(30, Math.round((res.nextChangeDate.getTime() - new Date(form.lastChangeDate).getTime()) / 86400000));
    const saved = await addFilterDevice(user.id, {
      deviceName: form.deviceModel,
      filterName: 'Filtre seti',
      changeIntervalDays: interval,
      installedAt: form.lastChangeDate,
    });
    if (saved.success) {
      setReminderState('saved');
      addToast('Hatırlatıcı hesabınıza eklendi.', 'success');
    } else {
      addToast(saved.error ?? 'Hatırlatıcı kaydedilemedi.', 'error');
    }
  };

  const statusConfig = {
    healthy: { icon: CheckCircle, bg: 'bg-aq-cloud', border: 'border-aq-aqua/30', text: 'text-aq-blue', iconColor: 'text-aq-aqua' },
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
      <PageHero
        eyebrow="Filtre hesaplayıcı"
        title="Filtre Değişim Zamanınızı Hesaplayın"
        description="Cihaz modelinizi ve kullanım bilgilerinizi girin, bir sonraki filtre değişim tarihinizi öğrenin."
        breadcrumbs={[{ label: 'Filtre Hesaplayıcı' }]}
        image="/images/filter-subscription.jpg"
      />

      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={(e) => void handleCalculate(e)}
              className="bg-white rounded-2xl p-6 space-y-5 shadow-soft"
            >
              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Cihaz Modeli *</label>
                <select
                  value={form.deviceModel}
                  onChange={e => setForm({ ...form, deviceModel: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                >
                  <option value="">Seçiniz</option>
                  {deviceModels.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Son Filtre Değişimi Tarihi *</label>
                <input
                  type="date"
                  value={form.lastChangeDate}
                  onChange={e => setForm({ ...form, lastChangeDate: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-1.5 block">Kaç Kişi Kullanıyor?</label>
                  <select
                    value={form.peopleCount}
                    onChange={e => setForm({ ...form, peopleCount: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                  >
                    <option value="1-2">1-2 kişi</option>
                    <option value="3-4">3-4 kişi</option>
                    <option value="5+">5+ kişi</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-1.5 block">Kullanım Yoğunluğu</label>
                  <select
                    value={form.usageIntensity}
                    onChange={e => setForm({ ...form, usageIntensity: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Su Tadında/Kokusunda Değişim Var Mı?</label>
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
                          ? 'border-aq-deep bg-aq-cloud text-aq-blue'
                          : 'border-aq-border/60 text-aq-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-aq-muted mb-1.5 block">Filtre Değişim Hatırlatıcısı Oluşturulsun Mu?</label>
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
                          ? 'border-aq-deep bg-aq-cloud text-aq-blue'
                          : 'border-aq-border/60 text-aq-muted'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.createReminder && (
                <p className="text-xs text-aq-muted">
                  {user
                    ? 'Hatırlatıcı Hesabım > Filtre Takibi bölümüne eklenecek; değişim zamanı yaklaşınca bildirim alırsınız.'
                    : 'Hatırlatıcı oluşturmak için hesabınıza giriş yapmanız gerekir; sonuç ekranında giriş bağlantısı gösterilir.'}
                </p>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-aq-ink text-white py-3.5 rounded-full text-sm font-semibold hover:bg-aq-ink-soft hover:text-white transition-all"
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
                    <h3 className={`text-lg font-semibold ${statusConfig[result.status].text}`}>{result.statusLabel}</h3>
                    <div className="mt-4">
                      <p className="text-3xl font-bold text-aq-text">{result.daysRemaining > 0 ? `${result.daysRemaining} gün` : `${Math.abs(result.daysRemaining)} gün gecikme`}</p>
                      <p className="text-xs text-aq-muted mt-1">Sonraki önerilen değişim: {result.nextChangeDate.toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  {reminderState === 'saved' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
                      Hatırlatıcınız Filtre Takibi listenize eklendi.
                      <Link to="/hesabim/filtre-takibi" className="font-semibold underline underline-offset-4">Görüntüle</Link>
                    </div>
                  )}
                  {reminderState === 'login' && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-aq-cloud px-5 py-4 text-sm text-aq-ink">
                      Hatırlatıcı için giriş yapın; hesaplamanızı tekrar yapmanız yeterli.
                      <Link to={`/giris?redirect=${encodeURIComponent(location.pathname)}`} className="rounded-full bg-aq-ink px-4 py-2 text-xs font-semibold text-white">Giriş Yap</Link>
                    </div>
                  )}

                  {/* Recommended Filters */}
                  <div className="bg-white rounded-2xl p-5 shadow-soft">
                    <h4 className="text-sm font-semibold text-aq-text mb-3">Önerilen Filtreler</h4>
                    <div className="space-y-2">
                      {result.recommendedFilters.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-aq-muted">
                          <Droplet className="w-4 h-4 text-aq-ink" /> {f}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link to="/kategori/filtreler-membranlar" className="flex items-center gap-1.5 bg-aq-ink text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-aq-ink-soft hover:text-white transition-all">
                        <ShoppingCart className="w-3 h-3" /> Filtre Al
                      </Link>
                      <Link to="/filtre-aboneligi" className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2 rounded-full hover:border-aq-blue hover:text-aq-blue transition-all">
                        <RefreshCw className="w-3 h-3" /> Abonelik Oluştur
                      </Link>
                    </div>
                  </div>

                  <button
                    onClick={() => { setSubmitted(false); setResult(null); }}
                    className="w-full text-sm font-medium text-aq-muted hover:text-aq-text transition-all py-2"
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
