import { useState, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Wrench, Package, HelpCircle } from 'lucide-react';
import { ExternalLink } from '@/components/ExternalLink';
import { useEscapeKey } from '@/hooks/useEscapeKey';

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(open, close);

  const actions = [
    { icon: Phone, label: "WhatsApp'tan Yaz", href: 'https://wa.me/905001234567', external: true, color: 'bg-emerald-500' },
    { icon: Wrench, label: 'Servis Talebi', href: '/servis-randevusu', external: false, color: 'bg-[#1A73E8]' },
    { icon: Package, label: 'Sipariş Takip', href: '/siparis-takip', external: false, color: 'bg-[#0D2137]' },
    { icon: HelpCircle, label: 'SSS', href: '/sss', external: false, color: 'bg-[#8B9DAF]' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0" onClick={close} aria-hidden="true" />
            <motion.div
              role="dialog"
              aria-label="Hızlı yardım"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="relative bg-white border border-[#E8F0FE] rounded-2xl shadow-xl p-4 mb-2 min-w-[200px]"
            >
              <p className="text-sm font-semibold text-[#0D2137] mb-3">Nasıl yardımcı olabilirim?</p>
              <div className="space-y-2">
                {actions.map((a) => {
                  const content = (
                    <>
                      <div className={`w-8 h-8 ${a.color} rounded-lg flex items-center justify-center text-white`}>
                        <a.icon className="w-4 h-4" />
                      </div>
                      {a.label}
                    </>
                  );
                  const className =
                    'flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8FBFF] transition-colors text-sm text-[#5A6B7B] hover:text-[#0D2137]';

                  if (a.external) {
                    return (
                      <ExternalLink key={a.label} href={a.href} onClick={close} className={className}>
                        {content}
                      </ExternalLink>
                    );
                  }

                  return (
                    <Link key={a.label} to={a.href} onClick={close} className={className}>
                      {content}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? 'Yardım menüsünü kapat' : 'Yardım menüsünü aç'}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
