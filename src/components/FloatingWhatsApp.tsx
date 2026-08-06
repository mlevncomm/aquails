import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Wrench, Package, HelpCircle, Send, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';
import { openWhatsApp, getWhatsAppUrl } from '@/services/whatsappService';

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
    type: 'route' as const,
    to: '/servis-randevusu',
  },
  {
    icon: Package,
    label: 'Sipariş Takip',
    desc: 'Kargonuzu izleyin',
    type: 'route' as const,
    to: '/siparis-takip',
  },
  {
    icon: Sparkles,
    label: 'Ürün Sihirbazı',
    desc: 'Size uygun cihazı bulun',
    type: 'route' as const,
    to: '/urun-secim-sihirbazi',
  },
  {
    icon: HelpCircle,
    label: 'Sık Sorulan Sorular',
    desc: 'Hızlı cevaplar',
    type: 'route' as const,
    to: '/sss',
  },
];

const panelVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.18, ease: 'easeOut' as const },
  },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } },
};

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(true), 5000);
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
      className="fixed z-50 flex flex-col items-end gap-2.5"
      style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))', right: 'max(1.25rem, env(safe-area-inset-right))' }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Destek menüsü"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-[min(100vw-2rem,300px)] bg-white rounded-2xl border border-aq-border/60 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-aq-border/80">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-aq-text">Destek</p>
                <p className="text-[11px] text-aq-muted mt-0.5">Genelde birkaç dakika içinde yanıt</p>
              </div>
              <button
                type="button"
                onClick={close}
                className="w-8 h-8 rounded-full border border-aq-border/60 text-aq-muted hover:text-aq-text hover:border-aq-deep/30 flex items-center justify-center transition-colors"
                aria-label="Kapat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-3.5 space-y-3.5 max-h-[min(68vh,400px)] overflow-y-auto">
              <p className="text-[13px] text-aq-muted leading-relaxed px-0.5">
                Size nasıl yardımcı olabiliriz?
              </p>

              <div className="flex flex-wrap gap-1.5">
                {QUICK_MESSAGES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => handleWhatsApp(q.message)}
                    className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-aq-border/60 text-aq-muted hover:border-aq-blue hover:text-aq-blue transition-colors"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              <a
                href={getWhatsAppUrl('Merhaba, Aquails hakkında bilgi almak istiyorum.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-aq-border/60 text-aq-text text-[13px] font-semibold hover:border-aq-blue hover:text-aq-blue transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                WhatsApp ile yaz
              </a>

              <div className="divide-y divide-aq-border/70 border-t border-aq-border/80 pt-1">
                {MENU_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => handleRoute(action.to)}
                    className="flex items-center gap-3 w-full py-2.5 text-left group"
                  >
                    <action.icon className="w-4 h-4 text-aq-muted group-hover:text-aq-blue transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-aq-text group-hover:text-aq-blue transition-colors">
                        {action.label}
                      </p>
                      <p className="text-[11px] text-aq-muted">{action.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHint && !open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="hidden sm:block rounded-full border border-aq-border/60 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[11px] text-aq-muted shadow-sm"
          >
            Yardım?
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Destek menüsünü kapat' : 'Destek menüsünü aç'}
        aria-expanded={open}
        whileTap={{ scale: 0.96 }}
        className="w-12 h-12 rounded-full border border-aq-border/60 bg-white text-aq-deep shadow-[0_4px_16px_rgba(7,24,39,0.08)] hover:border-aq-blue hover:text-aq-blue flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aq-blue/40 focus-visible:ring-offset-2"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.12 }}
            >
              <X className="w-5 h-5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -45 }}
              transition={{ duration: 0.12 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
