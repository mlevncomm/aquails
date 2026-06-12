import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Wrench, Package, HelpCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: Phone, label: 'WhatsApp\'tan Yaz', href: 'https://wa.me/905001234567', color: 'bg-emerald-500' },
    { icon: Wrench, label: 'Servis Talebi', href: '/servis-randevusu', color: 'bg-[#1A73E8]' },
    { icon: Package, label: 'Sipariş Takip', href: '/siparis-takip', color: 'bg-[#0D2137]' },
    { icon: HelpCircle, label: 'SSS', href: '/sss', color: 'bg-[#8B9DAF]' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="relative bg-white border border-[#E8F0FE] rounded-2xl shadow-xl p-4 mb-2 min-w-[200px]"
            >
              <p className="text-sm font-semibold text-[#0D2137] mb-3">Nasıl yardımcı olabilirim?</p>
              <div className="space-y-2">
                {actions.map((a) => (
                  <a
                    key={a.label}
                    href={a.href.startsWith('http') ? a.href : `#${a.href}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8FBFF] transition-colors text-sm text-[#5A6B7B] hover:text-[#0D2137]"
                  >
                    <div className={`w-8 h-8 ${a.color} rounded-lg flex items-center justify-center text-white`}>
                      <a.icon className="w-4 h-4" />
                    </div>
                    {a.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95"
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>
    </div>
  );
}
