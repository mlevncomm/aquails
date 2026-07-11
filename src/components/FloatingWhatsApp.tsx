import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Wrench, Package, HelpCircle, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { openWhatsApp, getWhatsAppUrl } from '@/services/whatsappService';
import { BrandLogo } from '@/components/BrandLogo';

const QUICK_MESSAGES = [
  { label: 'Ürün bilgisi', message: 'Merhaba, su arıtma ürünleriniz hakkında bilgi almak istiyorum.' },
  { label: 'Kurulum randevusu', message: 'Merhaba, kurulum randevusu almak istiyorum.' },
  { label: 'Filtre değişimi', message: 'Merhaba, filtre değişimi için destek almak istiyorum.' },
  { label: 'Sipariş durumu', message: 'Merhaba, siparişim hakkında bilgi almak istiyorum.' },
];

const MENU_ACTIONS = [
  {
    icon: Wrench,
    label: 'Servis Randevusu',
    desc: 'Kurulum ve bakım',
    color: 'bg-sky-500',
    type: 'route' as const,
    to: '/servis-randevusu',
  },
  {
    icon: Package,
    label: 'Sipariş Takip',
    desc: 'Kargonuzu izleyin',
    color: 'bg-slate-700',
    type: 'route' as const,
    to: '/siparis-takip',
  },
  {
    icon: Sparkles,
    label: 'Ürün Sihirbazı',
    desc: 'Size uygun cihazı bulun',
    color: 'bg-violet-500',
    type: 'route' as const,
    to: '/urun-secim-sihirbazi',
  },
  {
    icon: HelpCircle,
    label: 'Sık Sorulan Sorular',
    desc: 'Hızlı cevaplar',
    color: 'bg-slate-400',
    type: 'route' as const,
    to: '/sss',
  },
];

const panelVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 420, damping: 28, staggerChildren: 0.05 },
  },
  exit: { opacity: 0, y: 12, scale: 0.96, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
};

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (open) setShowHint(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [open, close]);

  const handleWhatsApp = (message?: string) => {
    close();
    openWhatsApp(message);
  };

  const handleRoute = (to: string) => {
    close();
    navigate(to);
  };

  return (
    <div
      className="fixed z-50 flex flex-col items-end gap-3"
      style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))', right: 'max(1.25rem, env(safe-area-inset-right))' }}
    >
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px]"
              aria-hidden
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-label="Destek menüsü"
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-[min(100vw-2rem,320px)] bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30">
                    <BrandLogo variant="icon" className="w-7 h-7 rounded-md" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-300 border-2 border-emerald-600 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[15px] leading-tight">Aquails Destek</p>
                    <p className="text-emerald-100 text-xs mt-0.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                      Genellikle birkaç dakika içinde yanıt
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                    aria-label="Kapat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4 max-h-[min(70vh,420px)] overflow-y-auto">
                {/* Greeting bubble */}
                <div className="bg-slate-50 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-600 leading-relaxed">
                  Merhaba! 👋 Size nasıl yardımcı olabiliriz? Hızlı mesaj gönderin veya aşağıdan bir seçenek seçin.
                </div>

                {/* Quick messages */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Hızlı mesaj</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_MESSAGES.map((q) => (
                      <motion.button
                        key={q.label}
                        type="button"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleWhatsApp(q.message)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                      >
                        {q.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Primary CTA */}
                <motion.a
                  variants={itemVariants}
                  href={getWhatsAppUrl('Merhaba, Aquails hakkında bilgi almak istiyorum.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={close}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-md shadow-emerald-500/25 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  WhatsApp&apos;ta Sohbet Başlat
                </motion.a>

                {/* Secondary actions */}
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Diğer seçenekler</p>
                  <div className="space-y-1">
                    {MENU_ACTIONS.map((action) => (
                      <motion.button
                        key={action.label}
                        type="button"
                        variants={itemVariants}
                        onClick={() => handleRoute(action.to)}
                        className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                      >
                        <div className={`w-9 h-9 ${action.color} rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                          <action.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800">{action.label}</p>
                          <p className="text-xs text-slate-400">{action.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            className="hidden sm:block bg-white border border-slate-200 shadow-lg rounded-xl px-3 py-2 text-xs text-slate-600 whitespace-nowrap"
          >
            Yardıma mı ihtiyacınız var?
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <div className="relative">
        {!open && (
          <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" aria-hidden />
        )}
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Destek menüsünü kapat' : 'Destek menüsünü aç'}
          aria-expanded={open}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X className="w-6 h-6 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
