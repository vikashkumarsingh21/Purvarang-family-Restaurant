import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { DietaryType, SpiceLevel } from '../../data/menu';

/**
 * Standard Indian Veg/Non-Veg symbol indicator
 * veg: #1E4A33 (palak), non-veg: #B3261E
 */
export const DietaryBadge: React.FC<{ type: DietaryType; size?: 'sm' | 'md' }> = ({
  type,
  size = 'md',
}) => {
  const isVeg = type === 'veg';
  const boxDim = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const innerDim = size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5';

  return (
    <div
      className={`inline-flex items-center justify-center border-2 ${boxDim} rounded-[4px] p-0.5 shrink-0 bg-white ${
        isVeg ? 'border-veg' : 'border-nonveg'
      }`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      aria-label={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      {isVeg ? (
        <span className={`${innerDim} rounded-full bg-veg shrink-0`} />
      ) : (
        <span
          className="shrink-0 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-nonveg"
        />
      )}
    </div>
  );
};

export const SpiceBadge: React.FC<{ level?: SpiceLevel }> = ({ level }) => {
  if (!level) return null;

  const count = level === 'spicy' ? 3 : level === 'medium' ? 2 : 1;
  const label = level === 'spicy' ? 'Teekha' : level === 'medium' ? 'Medium' : 'Mild';

  return (
    <span
      className="inline-flex items-center gap-1 text-[14px] text-mirchi font-medium px-2.5 py-0.5 bg-paper border border-wheat rounded-full"
      title={`${label} Spice`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Flame key={i} className="w-3.5 h-3.5 text-mirchi fill-mirchi stroke-[1.75]" />
      ))}
      <span className="uppercase tracking-wider text-[14px]">{label}</span>
    </span>
  );
};

export const TagBadge: React.FC<{
  type: 'bestseller' | 'chef-pick' | 'offer';
  text?: string;
}> = ({ type, text }) => {
  if (type === 'bestseller') {
    return (
      <span className="inline-flex items-center gap-1 text-[14px] font-semibold px-3 py-1 bg-haldi/20 text-espresso border border-haldi/40 rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-espresso fill-haldi stroke-[1.75]" />
        <span>{text || "Bestseller"}</span>
      </span>
    );
  }

  if (type === 'offer') {
    return (
      <span className="inline-flex items-center gap-1 text-[14px] font-bold px-3 py-1 bg-kesar text-white rounded-full shadow-soft-sm">
        <span>{text || "Offer"}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-[14px] font-semibold px-3 py-1 bg-palak/15 text-palak border border-palak/30 rounded-full">
      <span>{text || "Chef's Pick"}</span>
    </span>
  );
};
