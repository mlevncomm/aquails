import { useState } from 'react';
import { Link } from 'react-router';
import { Wrench, Calendar, CheckCircle, ShieldCheck, Phone, Package, ChevronDown } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';


const serviceTypes = [
  { id: 'installation', label: 'Yeni Cihaz Kurulumu', icon: Package, desc: 'Satın aldığınız cihazın profesyonel kurulumu' },
  { id: 'filter', label: 'Filtre Değişimi', icon: Wrench, desc: 'Periyodik filtre değişimi hizmeti' },
  { id: 'repair', label: 'Arıza Onarımı', icon: Wrench, desc: 'Teknik arıza tespiti ve onarım' },
  { id: 'maintenance', label: 'Periyodik Bakım', icon: ShieldCheck, desc: 'Cihaz bakımı ve performans kontrolü' },
];

const kurulumSureci = [
  { step: '1', title: 'Randevu Al', desc: 'Online form veya telefon ile servis talebi oluşturun.' },
  { step: '2', title: 'Teknik İnceleme', desc: 'Ekibimiz su hattı ve kullanım alanını inceler.' },
  { step: '3', title: 'Profesyonel Kurulum', desc: 'Ortalama 45-60 dakikada kurulum tamamlanir.' },
  { step: '4', title: 'Test ve Eğitim', desc: 'Cihaz test edilir, kullanım hakkında bilgi verilir.' },
];

const serviceSss = [
  { q: 'Servis ücretli mi?', a: 'Yeni cihaz kurulumu ücretsizdir. Filtre değişimi, bakım ve arıza onarım hizmetleri için servis ücreti uygulanabilir.' },
  { q: 'Randevu için ne kadar beklerim?', a: 'Talebinize bağlı olarak genellikle aynı gün veya 24 saat içinde randevu oluşturulur.' },
  { q: 'Garanti kapsamı dışındaki arızalar için ne oluyor?', a: 'Garanti kapsamı dışındaki arızalar için önceden fiyat bilgisi verilir, onayınız alınarak işlem yapılır.' },
];

export default function ServiceAppointmentPage() {
  const addToast = useToastStore(s => s.add);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('installation');
  const [form, setForm] = useState({ name: '', phone: '', address: '', device: '', date: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      addToast('Lütfen zorunlu alanları doldurun.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Servis randevunuz oluşturuldu! En kısa sürede size dönüş yapacağız.', 'success');
  };

  return (
    <>
      <SEO
        title="Aquails Servis Randevusu | Kurulum ve Filtre Değişimi"
        description="Aquails yetkili servis randevusu alın. Profesyonel kurulum, filtre değişimi ve bakım hizmetleri."
        canonical="/servis-randevusu"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-aq-aqua rounded-full blur-3xl" />
        </div>
        <div className="page-container relative">
          <div className="flex items-center gap-2 text-[13px] text-white/50 mb-3">
            <Link to="/" className="hover:text-white">Ana Sayfa</Link><span>/</span><span className="text-white/70">Servis Randevusu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Profesyonel Servis Hizmeti</h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg">Uzman ekibimiz kurulum, bakım ve arıza çözümleri için yanınızda.</p>
        </div>
      </section>

      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white border border-aq-border/60 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-aq-aqua" />
                </div>
                <h2 className="text-lg font-semibold text-aq-text mb-2">Randevunuz Alindi!</h2>
                <p className="text-sm text-aq-muted mb-4">Servis ekibimiz 24 saat içinde size dönüş yapacaktır.</p>
                <p className="text-xs text-aq-muted bg-aq-ice rounded-xl p-3 inline-block">Randevu No: <strong>SR-{Date.now().toString().slice(-6)}</strong></p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/" className="text-sm font-medium text-aq-blue hover:underline">Ana Sayfaya Don</Link>
                  <Link to="/urunler" className="text-sm font-medium text-aq-blue hover:underline">Ürünleri İncele</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-aq-border/60 rounded-2xl p-6 space-y-5">
                {/* Service Type */}
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-2 block">Talep Turu</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {serviceTypes.map(s => {
                      const Icon = s.icon;
                      return (
                        <button key={s.id} type="button" onClick={() => setType(s.id)} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${type === s.id ? 'border-aq-deep bg-aq-sky text-aq-blue' : 'border-aq-border/60 text-aq-muted hover:border-aq-border/60'}`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{s.label}</p>
                            <p className="text-[10px] text-aq-muted">{s.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-aq-muted mb-1.5 block">Ad Soyad *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-aq-muted mb-1.5 block">Telefon *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XX XX" className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-1.5 block">Adres *</label>
                  <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-aq-muted mb-1.5 block">Cihaz Modeli</label>
                    <input value={form.device} onChange={e => setForm({ ...form, device: e.target.value })} placeholder="Örn: Aquails Smart RO Pro" className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-aq-muted mb-1.5 block">Tercih Ettiğiniz Tarih</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-aq-muted mb-1.5 block">Açıklama</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Sorunuzu kısaca açıklayın..." className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue resize-none" />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 w-full bg-aq-blue text-white py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all">
                  <Calendar className="w-4 h-4" /> Randevu Oluştur
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-aq-blue to-aq-aqua-hover rounded-2xl p-5 text-white">
              <h3 className="text-base font-semibold mb-1">Hızlı Destek</h3>
              <p className="text-xs text-white/70 mb-3">Acil durumlar için 7/24 telefon desteği</p>
              <a href="tel:08501234567" className="flex items-center gap-2 text-sm font-semibold"><Phone className="w-4 h-4" /> 0850 123 45 67</a>
            </div>
            <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-aq-text mb-3">Servis Kapsami</h3>
              <div className="space-y-2.5">
                {[
                  { icon: CheckCircle, label: 'Yeni cihaz kurulumu' },
                  { icon: CheckCircle, label: 'Filtre değişimi' },
                  { icon: CheckCircle, label: 'Arıza tespiti ve onarım' },
                  { icon: CheckCircle, label: 'Periyodik bakım' },
                  { icon: CheckCircle, label: 'Bina girisi filtrasyon' },
                  { icon: CheckCircle, label: '7/24 teknik destek' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-aq-muted">
                    <item.icon className="w-4 h-4 text-aq-aqua flex-shrink-0" />{item.label}
                  </div>
                ))}
              </div>
            </div>
            {/* SSS */}
            <div className="bg-white border border-aq-border/60 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-aq-text mb-3">Sik Sorulan</h3>
              <div className="space-y-2">
                {serviceSss.map((f, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center gap-2 text-xs font-medium text-aq-muted cursor-pointer list-none hover:text-aq-blue transition-colors py-1">
                      <ChevronDown className="w-3 h-3 text-aq-muted group-open:rotate-180 transition-transform" />{f.q}
                    </summary>
                    <p className="text-[11px] text-aq-muted mt-1 pl-5 pb-1">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kurulum Sureci */}
        <ScrollReveal className="mt-16">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-aq-blue tracking-[0.15em] uppercase">Kurulum Sureci</span>
            <h2 className="text-xl md:text-2xl font-bold text-aq-text mt-2">4 Adimda Profesyonel Kurulum</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kurulumSureci.map(k => (
              <div key={k.step} className="bg-white border border-aq-border/60 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-semibold text-aq-blue">{k.step}</span>
                </div>
                <h4 className="text-sm font-semibold text-aq-text">{k.title}</h4>
                <p className="text-[11px] text-aq-muted mt-1">{k.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
