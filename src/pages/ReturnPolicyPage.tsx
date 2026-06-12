import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Check, X, Clock, Package, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { PageLayout } from '@/layouts/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SEO } from '@/components/SEO';


const conditions = [
  { ok: true, text: 'Ürün kullanılmamış ve orijinal ambalajında olmalı' },
  { ok: true, text: '14 gün içinde iade talebi oluşturulmalı' },
  { ok: true, text: 'Fatura veya irsaliye ibraz edilmeli' },
  { ok: false, text: 'Kullanılmış veya hasar görmüş ürünler' },
  { ok: false, text: 'Orijinal ambalajı açılmış özel üretim ürünler' },
  { ok: false, text: 'Kurulumu yapılmış cihazlar (arıza hariç)' },
];

export default function ReturnPolicyPage() {
  return (
    <>
      <SEO title="Aquails" noindex />
    <PageLayout variant="gradient">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D2137] via-[#1A3A5C] to-[#1A73E8] py-14 md:py-18">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-20 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-5 left-10 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="max-w-[800px] mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link to="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-white/80">İade Politikası</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">İade Politikası</h1>
            </div>
            <p className="text-white/70 text-sm">14 gün koşulsuz iade garantisi.</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 py-8 -mt-6 relative z-10">
        {/* Conditions */}
        <ScrollReveal>
          <div className="bg-white border border-[#E8F0FE] rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#0D2137] mb-5 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1A73E8]" />
              İade Koşulları
            </h2>
            <div className="space-y-3">
              {conditions.map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FBFF]/50">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${c.ok ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                    {c.ok ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </div>
                  <span className="text-sm text-[#5A6B7B] pt-0.5">{c.text}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Highlights */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Clock, title: '14 Gün', desc: 'Cayma hakkı süresi' },
              { icon: Package, title: 'Ücretsiz İade', desc: 'Kargo ücreti tarafımızdan karşılanır' },
              { icon: Sparkles, title: 'Hızlı İade', desc: '3-5 iş günü içinde geri ödeme' },
            ].map(item => (
              <div key={item.title} className="bg-white border border-[#E8F0FE] rounded-2xl p-5 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-[#F0F6FF] rounded-xl flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-[#1A73E8]" />
                </div>
                <h3 className="text-sm font-semibold text-[#0D2137]">{item.title}</h3>
                <p className="text-xs text-[#8B9DAF] mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </PageLayout>
    </>
  );
}
