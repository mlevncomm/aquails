import { useEffect } from 'react';
import { create } from 'zustand';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastStore {
  toasts: ToastItem[];
  add: (message: string, type?: ToastItem['type']) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'info') =>
    set((s) => ({ toasts: [...s.toasts, { id: Date.now().toString(), message, type }] })),
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, type?: ToastItem['type']) {
  useToastStore.getState().add(message, type);
}

export function ToastContainer() {
  const { toasts, remove } = useToastStore();
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 max-w-xs w-full">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}

function Toast({ message, type, onClose }: ToastItem & { onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
    info: <Info className="w-4 h-4 text-[#1A73E8]" />,
  };

  const borders = {
    success: 'border-l-emerald-500',
    error: 'border-l-red-500',
    info: 'border-l-[#1A73E8]',
  };

  return (
    <div className={`bg-white border border-[#E8F0FE] border-l-4 ${borders[type]} rounded-xl shadow-lg p-3.5 flex items-start gap-2.5 animate-fade-in-up`}>
      {icons[type]}
      <p className="text-sm text-[#0D2137] flex-1">{message}</p>
      <button onClick={onClose} className="text-[#8B9DAF] hover:text-[#0D2137] transition-colors mt-0.5">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
