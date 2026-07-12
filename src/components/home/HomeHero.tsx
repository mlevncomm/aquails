import { Link } from 'react-router';
import { motion } from 'framer-motion';

export function HomeHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      <img
        src="/images/hero-bg.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden
      />
      <div className="absolute inset-0 hero-cinematic" />

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 py-28 sm:py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.12] text-balance max-w-4xl mx-auto"
        >
          Doğayla Uyumlu
          <span className="block mt-1">Akıllı Su Teknolojisi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm sm:text-base md:text-lg text-white/75 mt-5 sm:mt-6 leading-relaxed max-w-2xl mx-auto"
        >
          Aquails; eviniz ve iş yeriniz için modern su arıtma cihazları, akıllı filtre takibi
          ve profesyonel servis hizmetlerini tek platformda sunar.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-10"
        >
          <Link to="/urunler" className="btn-pill-white px-7 sm:px-8 py-3.5">
            Ürünleri Keşfet
          </Link>
          <Link to="/servis-randevusu" className="btn-pill-glass px-7 sm:px-8 py-3.5">
            Servis Sürecimiz
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
