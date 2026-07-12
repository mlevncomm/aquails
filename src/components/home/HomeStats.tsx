import { ScrollReveal } from '@/components/ScrollReveal';
import { cn } from '@/lib/utils';

interface StatItem {
  v: string;
  l: string;
  sub: string;
}

interface HomeStatsProps {
  stats: StatItem[];
}

const tints = ['bg-[#F0F6FF]', 'bg-[#EEF6FF]', 'bg-[#F8FBFF]', 'bg-[#F0F6FF]'];

export function HomeStats({ stats }: HomeStatsProps) {
  return (
    <section className="cropsync-section bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <ScrollReveal className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-semibold text-[#1A73E8] tracking-widest uppercase">Etki</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0D2137] mt-2">
            Gerçek Su Kalitesi Etkisi
          </h2>
          <p className="text-sm sm:text-base text-[#5A6B7B] mt-3 max-w-xl mx-auto">
            Türkiye genelinde binlerce aile ve işletmenin güvendiği Aquails rakamları.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <ScrollReveal key={s.l} delay={i * 0.06}>
              <div className={cn(`${tints[i % tints.length]} rounded-2xl p-6 sm:p-8 text-center border border-[#E8F0FE]/60`)}>
                <p className="text-3xl sm:text-4xl font-bold text-[#1A73E8]">{s.v}</p>
                <p className="text-sm font-semibold text-[#0D2137] mt-2">{s.l}</p>
                <p className="text-xs text-[#8B9DAF] mt-1">{s.sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
