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
    info: { confirm: 'bg-aq-blue hover:bg-aq-deep text-white', icon: 'text-aq-blue bg-aq-sky' },
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-sm max-w-sm w-full p-6">
        <button onClick={onCancel} className="absolute top-4 right-4 text-aq-muted hover:text-aq-text">
          <X className="w-4 h-4" />
        </button>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${colors[variant].icon}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-aq-text mb-2">{title}</h3>
        <p className="text-sm text-aq-muted mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-aq-border/60 text-aq-muted rounded-xl text-sm font-medium hover:bg-aq-ice transition-all"
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
