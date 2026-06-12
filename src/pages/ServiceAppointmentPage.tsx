import { useState } from 'react';
import { Link } from 'react-router';
import { Wrench, Calendar, CheckCircle, ShieldCheck, Phone, Package, ChevronDown } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';


const serviceTypes = [
  { id: 'installation', label: 'Yeni Cihaz Kurulumu', icon: Package, desc: 'Satin aldiginiz cihazin profesyonel kurulumu' },
  { id: 'filter', label: 'Filtre Degisimi', icon: Wrench, desc: 'Periyodik filtre degisimi hizmeti' },
  { id: 'repair', label: 'Ariza Onarimi', icon: Wrench, desc: 'Teknik ariza tespiti ve onarim' },
  { id: 'maintenance', label: 'Periyodik Bakim', icon: ShieldCheck, desc: 'Cihaz bakimi ve performans kontrolu' },
];

const kurulumSureci = [
  { step: '1', title: 'Randevu Al', desc: 'Online form veya telefon ile servis talebi olusturun.' },
  { step: '2', title: 'Teknik Inceleme', desc: 'Ekibimiz su hatti ve kullanim alanini inceler.' },
  { step: '3', title: 'Profesyonel Kurulum', desc: 'Ortalama 45-60 dakikada kurulum tamamlanir.' },
  { step: '4', title: 'Test ve Egitim', desc: 'Cihaz test edilir, kullanim hakkinda bilgi verilir.' },
];

const serviceSss = [
  { q: 'Servis ucretli mi?', a: 'Yeni cihaz kurulumu ucretsizdir. Filtre degisimi, bakim ve ariza onarim hizmetleri icin servis ucreti uygulanabilir.' },
  { q: 'Randevu icin ne kadar beklerim?', a: 'Talebinize bagli olarak genellikle ayni gun veya 24 saat icinde randevu olusturulur.' },
  { q: 'Garanti kapsami disindaki arizalar icin ne oluyor?', a: 'Garanti kapsami disindaki arizalar icin onceden fiyat bilgisi verilir, onayiniz alinarak islem yapilir.' },
];

export default function ServiceAppointmentPage() {
  const addToast = useToastStore(s => s.add);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState('installation');
  const [form, setForm] = useState({ name: '', phone: '', address: '', device: '', date: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      addToast('Lutfen zorunlu alanlari doldurun.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Servis randevunuz olusturuldu! En kisa surede size donus yapacagiz.', 'success');
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
      <section className="relative bg-gradient-to-br from-[#0D2137] via-[#1A3A5C] to-[#0D2137] py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-[#1A73E8] rounded-full blur-3xl" />
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative">
          <div className="flex items-center gap-2 text-[13px] text-white/50 mb-3">
            <Link to="/" className="hover:text-white">Ana Sayfa</Link><span>/</span><span className="text-white/70">Servis Randevusu</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Profesyonel Servis Hizmeti</h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg">Uzman ekibimiz kurulum, bakim ve ariza cozumleri icin yaninizda.</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white border border-[#E8F0FE] rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-[#0D2137] mb-2">Randevunuz Alindi!</h2>
                <p className="text-sm text-[#8B9DAF] mb-4">Servis ekibimiz 24 saat icinde size donus yapacaktir.</p>
                <p className="text-xs text-[#5A6B7B] bg-[#F8FBFF] rounded-xl p-3 inline-block">Randevu No: <strong>SR-{Date.now().toString().slice(-6)}</strong></p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link to="/" className="text-sm font-medium text-[#1A73E8] hover:underline">Ana Sayfaya Don</Link>
                  <Link to="/urunler" className="text-sm font-medium text-[#1A73E8] hover:underline">Urunleri Incele</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-[#E8F0FE] rounded-2xl p-6 space-y-5">
                {/* Service Type */}
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-2 block">Talep Turu</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {serviceTypes.map(s => {
                      const Icon = s.icon;
                      return (
                        <button key={s.id} type="button" onClick={() => setType(s.id)} className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${type === s.id ? 'border-[#1A73E8] bg-[#F0F6FF] text-[#1A73E8]' : 'border-[#E8F0FE] text-[#5A6B7B] hover:border-[#D6E3F0]'}`}>
                          <Icon className="w-4 h-4 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">{s.label}</p>
                            <p className="text-[10px] text-[#8B9DAF]">{s.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Ad Soyad *</label>
                    <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Telefon *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="05XX XXX XX XX" className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Adres *</label>
                  <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8] resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Cihaz Modeli</label>
                    <input value={form.device} onChange={e => setForm({ ...form, device: e.target.value })} placeholder="Orn: Aquails Smart RO Pro" className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Tercih Ettiginiz Tarih</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Aciklama</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Sorunuzu kisaca aciklayin..." className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8] resize-none" />
                </div>
                <button type="submit" className="flex items-center justify-center gap-2 w-full bg-[#1A73E8] text-white py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">
                  <Calendar className="w-4 h-4" /> Randevu Olustur
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#1A73E8] to-[#1557B0] rounded-2xl p-5 text-white">
              <h3 className="text-base font-semibold mb-1">Hizli Destek</h3>
              <p className="text-xs text-white/70 mb-3">Acil durumlar icin 7/24 telefon destegi</p>
              <a href="tel:08501234567" className="flex items-center gap-2 text-sm font-semibold"><Phone className="w-4 h-4" /> 0850 123 45 67</a>
            </div>
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Servis Kapsami</h3>
              <div className="space-y-2.5">
                {[
                  { icon: CheckCircle, label: 'Yeni cihaz kurulumu' },
                  { icon: CheckCircle, label: 'Filtre degisimi' },
                  { icon: CheckCircle, label: 'Ariza tespiti ve onarim' },
                  { icon: CheckCircle, label: 'Periyodik bakim' },
                  { icon: CheckCircle, label: 'Bina girisi filtrasyon' },
                  { icon: CheckCircle, label: '7/24 teknik destek' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#5A6B7B]">
                    <item.icon className="w-4 h-4 text-[#00C9A7] flex-shrink-0" />{item.label}
                  </div>
                ))}
              </div>
            </div>
            {/* SSS */}
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-[#0D2137] mb-3">Sik Sorulan</h3>
              <div className="space-y-2">
                {serviceSss.map((f, i) => (
                  <details key={i} className="group">
                    <summary className="flex items-center gap-2 text-xs font-medium text-[#5A6B7B] cursor-pointer list-none hover:text-[#1A73E8] transition-colors py-1">
                      <ChevronDown className="w-3 h-3 text-[#8B9DAF] group-open:rotate-180 transition-transform" />{f.q}
                    </summary>
                    <p className="text-[11px] text-[#8B9DAF] mt-1 pl-5 pb-1">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kurulum Sureci */}
        <ScrollReveal className="mt-16">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-[#1A73E8] tracking-[0.15em] uppercase">Kurulum Sureci</span>
            <h2 className="text-xl md:text-2xl font-bold text-[#0D2137] mt-2">4 Adimda Profesyonel Kurulum</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kurulumSureci.map(k => (
              <div key={k.step} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-[#F0F6FF] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-bold text-[#1A73E8]">{k.step}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#0D2137]">{k.title}</h4>
                <p className="text-[11px] text-[#8B9DAF] mt-1">{k.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
