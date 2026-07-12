import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { cn } from '@/lib/utils';

interface FaqItem {
  q: string;
  a: string;
}

interface HomeFaqProps {
  items: FaqItem[];
}

export function HomeFaq({ items }: HomeFaqProps) {
  const [open, setOpen] = useState<string | null>('0');

  return (
    <section className="cropsync-section bg-[#F7FAFF]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-16 items-start">
          <ScrollReveal>
            <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">SSS</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-2 leading-tight">
              Aquails Hakkında Sorular
            </h2>
            <p className="text-sm sm:text-base text-[#5A6B7B] mt-4 leading-relaxed">
              Su arıtma, kurulum ve bakım süreçleri hakkında en sık sorulan soruların yanıtları.
            </p>
          </ScrollReveal>

          <div className="space-y-3">
            {items.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <div
                  className={cn(
                    'bg-white rounded-2xl overflow-hidden border transition-shadow duration-200',
                    open === String(i) ? 'border-[#1A73E8]/25 shadow-md' : 'border-[#E8F0FE]',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(open === String(i) ? null : String(i))}
                    className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-[#0D2137]">{f.q}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 flex-shrink-0 text-[#8B9DAF] transition-transform duration-200',
                        open === String(i) && 'rotate-180 text-[#1A73E8]',
                      )}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open === String(i) ? 'auto' : 0, opacity: open === String(i) ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-[#5A6B7B] leading-relaxed border-t border-[#F0F6FF] pt-3">
                      {f.a}
                    </p>
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
