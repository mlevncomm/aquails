import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, Wrench, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';
import { submitContactMessage } from '@/services/contactService';
import { getSiteConfig } from '@/services/settingsService';

const sikSorulan = [
  { q: 'Siparişim ne zaman elime ulaşır?', a: 'Stoktaki ürünler için ortalama 1-3 iş günü içinde kargo teslimatı sağlanır.' },
  { q: 'Kurulum ücretli mi?', a: 'Tüm su arıtma cihazlarımızda profesyonel kurulum ücretsizdir.' },
  { q: 'Servis talebi nasıl oluşturabilirim?', a: 'Web sitemizden veya müşteri hizmetleri hattımızdan servis randevusu alabilirsiniz.' },
];

function toWaLink(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '');
  if (!digits) return 'https://wa.me/905321234567';
  const normalized = digits.startsWith('90') ? digits : digits.startsWith('0') ? `90${digits.slice(1)}` : `90${digits}`;
  return `https://wa.me/${normalized}`;
}

export default function ContactPage() {
  const addToast = useToastStore(s => s.add);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [phone, setPhone] = useState('0850 123 45 67');
  const [whatsapp, setWhatsapp] = useState('0532 123 45 67');
  const [email, setEmail] = useState('info@aquails.com.tr');
  const [address, setAddress] = useState('Pendik, İstanbul');
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Genel Bilgi', message: '' });

  useEffect(() => {
    let cancelled = false;
    getSiteConfig().then((cfg) => {
      if (cancelled) return;
      if (cfg.phone) setPhone(cfg.phone);
      if (cfg.whatsapp) setWhatsapp(cfg.whatsapp);
      if (cfg.email) setEmail(cfg.email);
      if (cfg.address) setAddress(cfg.address);
    });
    return () => { cancelled = true; };
  }, []);

  const contactInfo = [
    { icon: Phone, label: 'Müşteri Hizmetleri', value: phone, sub: '7/24 destek hattı' },
    { icon: Phone, label: 'WhatsApp', value: whatsapp, sub: 'Hızlı destek için yazın' },
    { icon: Mail, label: 'E-posta', value: email, sub: '24 saat içinde yanıt' },
    { icon: Mail, label: 'Teknik Destek', value: email.replace('info@', 'teknik@'), sub: 'Servis ve arıza talepleri' },
    { icon: MapPin, label: 'Merkez Ofis', value: address, sub: 'Türkiye geneli servis ağı' },
    { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt-Cmt: 08:00-18:00', sub: 'Pazar: 10:00-16:00' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast('Lütfen tüm zorunlu alanları doldurun.', 'error');
      return;
    }
    setSubmitting(true);
    const result = await submitContactMessage(form);
    setSubmitting(false);
    if (!result.success) {
      addToast(result.error || 'Mesaj gönderilemedi.', 'error');
      return;
    }
    setSent(true);
    addToast('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
  };

  return (
    <>
      <SEO
        title="İletişim | Aquails"
        description={`Aquails iletişim bilgileri. Su arıtma cihazları, servis ve destek için bize ulaşın. ${phone}`}
        canonical="/iletisim"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-aq-ice via-white to-aq-sky/40 py-12 md:py-16">
        <div className="page-container">
          <div className="flex items-center gap-2 text-[13px] text-aq-muted mb-3">
            <Link to="/" className="hover:text-aq-blue">Ana Sayfa</Link><span>/</span><span className="text-aq-muted">İletişim</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-aq-text">Bize Ulaşın</h1>
          <p className="text-sm text-aq-muted mt-2 max-w-lg">Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşabilirsiniz.</p>
        </div>
      </section>

      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <ScrollReveal className="lg:col-span-1">
            <div className="space-y-3">
              {contactInfo.map(item => (
                <div key={item.label} className="bg-white border border-aq-border/60 rounded-2xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 bg-aq-sky rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-aq-blue" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-aq-muted mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-aq-text">{item.value}</p>
                    <p className="text-[11px] text-aq-muted">{item.sub}</p>
                  </div>
                </div>
              ))}

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-r from-aq-aqua to-aq-aqua-hover rounded-2xl p-5 text-aq-text">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp Destek</p>
                    <p className="text-xs text-aq-muted">Anında yanıt</p>
                  </div>
                </div>
                <p className="text-xs text-aq-muted mb-3">Ürün seçimi, sipariş ve servis talepleriniz için WhatsApp hattımızdan bize ulaşabilirsiniz.</p>
                <a href={toWaLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-aq-deep/10 hover:bg-aq-deep/20 text-aq-text text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp&apos;tan Yaz
                </a>
              </div>

              {/* Service Redirect */}
              <Link to="/servis-randevusu" className="block bg-white border border-aq-border/60 rounded-2xl p-4 hover:border-aq-blue/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-aq-sky rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-aq-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-aq-text group-hover:text-aq-blue transition-colors">Servis Randevusu Al</p>
                    <p className="text-[11px] text-aq-muted">Kurulum, bakım ve arıza talepleri</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-aq-muted group-hover:text-aq-blue" />
                </div>
              </Link>

              {/* SSS Quick */}
              <div className="bg-aq-ice border border-aq-border/60 rounded-2xl p-5">
                <p className="text-sm font-semibold text-aq-text mb-3">Sık Sorulan Sorular</p>
                <div className="space-y-3">
                  {sikSorulan.map((f, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between text-xs font-medium text-aq-muted cursor-pointer list-none hover:text-aq-blue transition-colors">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-aq-muted" />{f.q}</span>
                      </summary>
                      <p className="text-[11px] text-aq-muted mt-1 pl-5">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="bg-white border border-aq-border/60 rounded-2xl p-6 md:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-aq-sky rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-aq-aqua" />
                  </div>
                  <h3 className="text-lg font-semibold text-aq-text mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-sm text-aq-muted">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-aq-text mb-1">Bize Mesaj Gönderin</h2>
                  <p className="text-sm text-aq-muted mb-6">Formu doldurun, size en kısa sürede dönüş yapalım.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-aq-muted mb-1.5 block">Ad Soyad *</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" placeholder="Adınız Soyadınız" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-aq-muted mb-1.5 block">E-posta *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" placeholder="ornek@email.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-aq-muted mb-1.5 block">Telefon</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue" placeholder="0 5XX XXX XX XX" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-aq-muted mb-1.5 block">Konu</label>
                        <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue">
                          <option>Genel Bilgi</option>
                          <option>Ürün Desteği</option>
                          <option>Servis Talebi</option>
                          <option>Is Birligi</option>
                          <option>Sikayet/Oneri</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-aq-muted mb-1.5 block">Mesajınız *</label>
                      <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-2.5 text-sm border border-aq-border/60 rounded-xl bg-aq-ice focus:outline-none focus:border-aq-blue resize-none" placeholder="Mesajınızı buraya yazın..." />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto bg-aq-blue text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-aq-deep hover:text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? 'Gönderiliyor…' : 'Gönder'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </PageLayout>
    </>
  );
}
