import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const colors = {
    danger: { confirm: 'bg-red-500 hover:bg-red-600', icon: 'text-red-500 bg-red-50' },
    warning: { confirm: 'bg-amber-500 hover:bg-amber-600', icon: 'text-amber-500 bg-amber-50' },
    info: { confirm: 'bg-[#1A73E8] hover:bg-[#1557B0]', icon: 'text-[#1A73E8] bg-[#F0F6FF]' },
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 text-[#8B9DAF] hover:text-[#0D2137]">
          <X className="w-4 h-4" />
        </button>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors[variant].icon}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-[#0D2137] mb-2">{title}</h3>
        <p className="text-sm text-[#5A6B7B] mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-[#D6E3F0] text-[#5A6B7B] rounded-xl text-sm font-medium hover:bg-[#F8FBFF] transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all ${colors[variant].confirm}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
