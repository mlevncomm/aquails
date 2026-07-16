import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, size = 'md' }: QuantitySelectorProps) {
  const btnClass = size === 'sm' ? 'w-7 h-7' : 'w-10 h-10';
  const inputClass = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className="inline-flex items-center border border-aq-border/60 rounded-full overflow-hidden bg-white">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Azalt"
        className={`${btnClass} flex items-center justify-center bg-aq-ice text-aq-muted hover:bg-aq-sky hover:text-aq-blue transition-colors`}
      >
        <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
      <span className={`${inputClass} font-semibold text-aq-text w-10 text-center`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Artır"
        className={`${btnClass} flex items-center justify-center bg-aq-ice text-aq-muted hover:bg-aq-sky hover:text-aq-blue transition-colors`}
      >
        <Plus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
    </div>
  );
}
