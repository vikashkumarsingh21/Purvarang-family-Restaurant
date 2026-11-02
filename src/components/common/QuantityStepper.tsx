import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const buttonDim = isSm ? 'w-8 h-8' : 'w-10 h-10';
  const iconDim = isSm ? 'w-4 h-4' : 'w-4 h-4';
  const textClass = isSm ? 'text-[15px] w-8' : 'text-[16px] w-10 font-bold';

  return (
    <div className="inline-flex items-center bg-white border border-wheat rounded-[10px] p-1 shadow-soft-sm">
      <button
        type="button"
        onClick={onDecrement}
        className={`${buttonDim} flex items-center justify-center rounded-[8px] bg-paper hover:bg-wheat text-espresso transition-colors focus:outline-none`}
        aria-label="Decrease quantity"
        disabled={quantity <= min}
      >
        {quantity === 1 ? (
          <Trash2 className={`${iconDim} text-mirchi stroke-[1.75]`} />
        ) : (
          <Minus className={`${iconDim} text-espresso stroke-[1.75]`} />
        )}
      </button>

      <span className={`${textClass} text-center font-sans font-bold text-espresso select-none`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrement}
        className={`${buttonDim} flex items-center justify-center rounded-[8px] bg-mirchi text-white hover:bg-mirchi-hover transition-colors focus:outline-none`}
        aria-label="Increase quantity"
        disabled={quantity >= max}
      >
        <Plus className={`${iconDim} stroke-[1.75]`} />
      </button>
    </div>
  );
};
