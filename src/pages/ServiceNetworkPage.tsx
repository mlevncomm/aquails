import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { MapPin, Clock, Wrench, CheckCircle, Users, MessageCircle } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { openWhatsApp, getServiceRequestMessage } from '@/services/whatsappService';
import { SEO } from '@/components/SEO';


const cities = [
  { name: 'İstanbul', sameDay: true, avgTime: '2 saat', phone: '0212 123 45 67' },
  { name: 'Ankara', sameDay: true, avgTime: '3 saat', phone: '0312 123 45 67' },
  { name: 'İzmir', sameDay: true, avgTime: '3 saat', phone: '0232 123 45 67' },
  { name: 'Antalya', sameDay: false, avgTime: '1 gun', phone: '0242 123 45 67' },
  { name: 'Bursa', sameDay: true, avgTime: '4 saat', phone: '0224 123 45 67' },
  { name: 'Kocaeli', sameDay: true, avgTime: '3 saat', phone: '0262 123 45 67' },
  { name: 'Konya', sameDay: false, avgTime: '1 gun', phone: '0332 123 45 67' },
  { name: 'Adana', sameDay: false, avgTime: '1 gun', phone: '0322 123 45 67' },
  { name: 'Gaziantep', sameDay: false, avgTime: '1-2 gun', phone: '0342 123 45 67' },
  { name: 'Kayseri', sameDay: false, avgTime: '1 gun', phone: '0352 123 45 67' },
];

const processSteps = [
  { step: '1', title: 'Randevu Al', desc: 'Online veya telefon ile servis talebi oluşturun.' },
  { step: '2', title: 'Ön İnceleme', desc: 'Teknisyen su hattı ve alanı inceler.' },
  { step: '3', title: 'Kurulum', desc: 'Ortalama 45-60 dakikada kurulum tamamlanir.' },
  { step: '4', title: 'Test', desc: 'Cihaz test edilir, kullanım eğitimi verilir.' },
];

export default function ServiceNetworkPage() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const city = cities.find(c => c.name === selectedCity);

  return (
    <>
      <SEO
        title="Aquails Servis Ağı | Kurulum ve Bakım"
        description="Aquails yetkili servis noktaları. İstanbul ve tüm Türkiye'de profesyonel kurulum, bakım ve onarım hizmetleri."
        canonical="/servis-agimiz"
      />
    <PageLayout>
      <section className="relative bg-gradient-to-br from-aq-deep via-aq-navy to-aq-deep py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 bg-aq-aqua rounded-full blur-3xl" />
        </div>
        <div className="page-container relative text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Aquails Servis ve Kurulum Agi</h1>
          <p className="text-sm text-white/70 mt-2 max-w-lg mx-auto">Kurulum, filtre değişimi ve bakım hizmetlerinde size en yakın destek noktasıyla yanınızdayız.</p>
        </div>
      </section>

      <div className="page-container py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {[
            { icon: MapPin, label: '81 İl', desc: 'Tüm Türkiye' },
            { icon: Clock, label: 'Aynı Gün', desc: 'Büyük şehirlerde' },
            { icon: Wrench, label: '500+', desc: 'Yetkili servis' },
            { icon: Users, label: '10.000+', desc: 'Mutlu müşteri' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-aq-border/60 rounded-2xl p-5 text-center">
              <s.icon className="w-6 h-6 text-aq-blue mx-auto mb-2" />
              <p className="text-lg font-semibold text-aq-text">{s.label}</p>
              <p className="text-xs text-aq-muted">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* City Selection */}
        <ScrollReveal className="mb-12">
          <h2 className="text-xl font-semibold text-aq-text mb-4">Şehir Seçin</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {cities.map(c => (
              <button
                key={c.name}
                onClick={() => setSelectedCity(c.name)}
                className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  selectedCity === c.name
                    ? 'border-aq-deep bg-aq-sky text-aq-blue'
                    : 'border-aq-border/60 bg-white text-aq-muted hover:border-aq-border/60'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 mx-auto mb-1" />
                {c.name}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* City Detail */}
        {city && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-aq-border/60 rounded-2xl p-6 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-aq-text">{city.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  {city.sameDay ? (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-aq-blue text-xs font-medium px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3 h-3" /> Aynı gün servis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <Clock className="w-3 h-3" /> {city.avgTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-aq-muted">Ort. Yanit</p>
                  <p className="text-sm font-semibold text-aq-text">{city.avgTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-aq-muted">Telefon</p>
                  <p className="text-sm font-semibold text-aq-text">{city.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link to="/servis-randevusu" className="flex items-center gap-1.5 bg-aq-blue text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-aq-deep hover:text-white transition-all">
                  <Wrench className="w-3.5 h-3.5" /> Randevu Al
                </Link>
                <button onClick={() => openWhatsApp(getServiceRequestMessage(`${city.name} servis`))} className="flex items-center gap-1.5 border border-aq-border/60 text-aq-muted text-xs font-semibold px-4 py-2.5 rounded-xl hover:border-aq-blue hover:text-aq-blue transition-all">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Process Steps */}
        <ScrollReveal className="mb-12">
          <h2 className="text-xl font-semibold text-aq-text mb-6 text-center">Kurulum Sureci</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map(s => (
              <div key={s.step} className="bg-white border border-aq-border/60 rounded-2xl p-5 text-center">
                <div className="w-10 h-10 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-sm font-semibold text-aq-blue">{s.step}</span>
                </div>
                <h4 className="text-sm font-semibold text-aq-text">{s.title}</h4>
                <p className="text-xs text-aq-muted mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
