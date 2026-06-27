import { useState } from 'react';
import { Link } from 'react-router';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, MessageCircle, Wrench, ArrowRight, ShieldCheck } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useToastStore } from '@/components/Toast';
import { SEO } from '@/components/SEO';


const contactInfo = [
  { icon: Phone, label: 'Müşteri Hizmetleri', value: '0850 123 45 67', sub: '7/24 destek hattı' },
  { icon: Phone, label: 'WhatsApp', value: '0 532 123 45 67', sub: 'Hızlı destek için yazın' },
  { icon: Mail, label: 'E-posta', value: 'info@aquails.com', sub: '24 saat içinde yanıt' },
  { icon: Mail, label: 'Teknik Destek', value: 'teknik@aquails.com', sub: 'Servis ve arıza talepleri' },
  { icon: MapPin, label: 'Merkez Ofis', value: 'Pendik, İstanbul', sub: 'Türkiye geneli servis ağı' },
  { icon: Clock, label: 'Çalışma Saatleri', value: 'Pzt-Cmt: 08:00-18:00', sub: 'Pazar: 10:00-16:00' },
];

const sikSorulan = [
  { q: 'Siparişim ne zaman elime ulaşır?', a: 'Stoktaki ürünler için ortalama 1-3 iş günü içinde kargo teslimatı sağlanır.' },
  { q: 'Kurulum ücretli mi?', a: 'Tüm su arıtma cihazlarımızda profesyonel kurulum ücretsizdir.' },
  { q: 'Servis talebi nasıl oluşturabilirim?', a: 'Web sitemizden veya 0850 123 45 67 numaralı hattımızdan servis randevusu alabilirsiniz.' },
];

export default function ContactPage() {
  const addToast = useToastStore(s => s.add);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Genel Bilgi', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      addToast('Lütfen tüm zorunlu alanları doldurun.', 'error');
      return;
    }
    setSent(true);
    addToast('Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
  };

  return (
    <>
      <SEO
        title="İletişim | Aquails"
        description="Aquails iletişim bilgileri. Su arıtma cihazları, servis ve destek için bize ulaşın. 0850 123 45 67"
        canonical="/iletisim"
      />
    <PageLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#EBF4FF] via-[#F0F8FF] to-[#E0F0FF] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-[13px] text-[#8B9DAF] mb-3">
            <Link to="/" className="hover:text-[#1A73E8]">Ana Sayfa</Link><span>/</span><span className="text-[#5A6B7B]">İletişim</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#0D2137]">Bize Ulaşın</h1>
          <p className="text-sm text-[#5A6B7B] mt-2 max-w-lg">Sorularınız, önerileriniz veya destek talepleriniz için bize ulaşabilirsiniz.</p>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <ScrollReveal className="lg:col-span-1">
            <div className="space-y-3">
              {contactInfo.map(item => (
                <div key={item.label} className="bg-white border border-[#E8F0FE] rounded-2xl p-4 flex items-start gap-3 hover:shadow-sm transition-all">
                  <div className="w-9 h-9 bg-[#F0F6FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-[#1A73E8]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8B9DAF] mb-0.5">{item.label}</p>
                    <p className="text-sm font-semibold text-[#0D2137]">{item.value}</p>
                    <p className="text-[11px] text-[#8B9DAF]">{item.sub}</p>
                  </div>
                </div>
              ))}

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-r from-[#00C9A7] to-[#00BFA5] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <p className="text-sm font-semibold">WhatsApp Destek</p>
                    <p className="text-xs text-white/70">Anında yanıt</p>
                  </div>
                </div>
                <p className="text-xs text-white/80 mb-3">Ürün seçimi, sipariş ve servis talepleriniz için WhatsApp hattımızdan bize ulaşabilirsiniz.</p>
                <a href="https://wa.me/905321234567" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all">
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp\'tan Yaz
                </a>
              </div>

              {/* Service Redirect */}
              <Link to="/servis-randevusu" className="block bg-white border border-[#E8F0FE] rounded-2xl p-4 hover:shadow-md hover:border-[#1A73E8]/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F0F6FF] rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-[#1A73E8]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#0D2137] group-hover:text-[#1A73E8] transition-colors">Servis Randevusu Al</p>
                    <p className="text-[11px] text-[#8B9DAF]">Kurulum, bakım ve arıza talepleri</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8B9DAF] group-hover:text-[#1A73E8]" />
                </div>
              </Link>

              {/* SSS Quick */}
              <div className="bg-[#F8FBFF] border border-[#E8F0FE] rounded-2xl p-5">
                <p className="text-sm font-semibold text-[#0D2137] mb-3">Sık Sorulan Sorular</p>
                <div className="space-y-3">
                  {sikSorulan.map((f, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center justify-between text-xs font-medium text-[#5A6B7B] cursor-pointer list-none hover:text-[#1A73E8] transition-colors">
                        <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#8B9DAF]" />{f.q}</span>
                      </summary>
                      <p className="text-[11px] text-[#8B9DAF] mt-1 pl-5">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Form */}
          <ScrollReveal delay={0.1} className="lg:col-span-2">
            <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 md:p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0D2137] mb-2">Mesajınız Gönderildi!</h3>
                  <p className="text-sm text-[#8B9DAF]">En kısa sürede size dönüş yapacağız.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-[#0D2137] mb-1">Bize Mesaj Gönderin</h2>
                  <p className="text-sm text-[#8B9DAF] mb-6">Formu doldurun, size en kısa sürede dönüş yapalım.</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Ad Soyad *</label>
                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" placeholder="Adınız Soyadınız" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">E-posta *</label>
                        <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" placeholder="ornek@email.com" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Telefon</label>
                        <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]" placeholder="0 5XX XXX XX XX" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Konu</label>
                        <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8]">
                          <option>Genel Bilgi</option>
                          <option>Ürün Desteği</option>
                          <option>Servis Talebi</option>
                          <option>Is Birligi</option>
                          <option>Sikayet/Oneri</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#5A6B7B] mb-1.5 block">Mesajiniz *</label>
                      <textarea required value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-2.5 text-sm border border-[#D6E3F0] rounded-xl bg-[#F8FBFF] focus:outline-none focus:border-[#1A73E8] resize-none" placeholder="Mesajinizi buraya yazin..." />
                    </div>
                    <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#1A73E8] text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-[#1557B0] transition-all">
                      <Send className="w-4 h-4" /> Gonder
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
