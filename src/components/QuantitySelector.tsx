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
    <div className="flex items-center border border-aqua-border rounded-xl overflow-hidden">
      <button
        onClick={onDecrease}
        className={`${btnClass} flex items-center justify-center bg-aqua-bg text-aqua-text-secondary hover:bg-aqua-border-light transition-colors`}
      >
        <Minus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
      <span className={`${inputClass} font-semibold text-aqua-secondary w-10 text-center`}>
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        className={`${btnClass} flex items-center justify-center bg-aqua-bg text-aqua-text-secondary hover:bg-aqua-border-light transition-colors`}
      >
        <Plus className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      </button>
    </div>
  );
}
