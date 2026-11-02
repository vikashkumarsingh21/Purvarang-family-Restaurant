import React, { useState } from 'react';
import { Heart, Plus } from 'lucide-react';
import { MenuItem } from '../../data/menu';
import { DietaryBadge, SpiceBadge, TagBadge } from '../common/Badge';
import { QuantityStepper } from '../common/QuantityStepper';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface DishCardProps {
  dish: MenuItem;
}

export const DishCard: React.FC<DishCardProps> = ({ dish }) => {
  const { addItem, updateQuantity, getItemQuantity, isFavorite, toggleFavorite } = useCart();
  const { success } = useToast();

  const [selectedPortion, setSelectedPortion] = useState<'Half' | 'Full'>(
    dish.portions ? 'Half' : 'Full'
  );

  const fav = isFavorite(dish.id);
  const qty = getItemQuantity(dish.id, dish.portions ? selectedPortion : undefined);

  let currentPrice: number | null = dish.price;
  if (dish.portions) {
    const p = dish.portions.find(opt => opt.portion === selectedPortion);
    if (p) currentPrice = p.price;
  }

  const handleAdd = () => {
    if (currentPrice === null) return;
    addItem(dish, dish.portions ? selectedPortion : undefined);
    success(
      `Added: ${dish.name}`,
      dish.portions ? `${selectedPortion} portion • ₹${currentPrice}` : `₹${currentPrice}`
    );
  };

  const handleIncrement = () => {
    if (dish.portions) {
      updateQuantity(`${dish.id}-${selectedPortion}`, 1);
    } else {
      updateQuantity(dish.id, 1);
    }
  };

  const handleDecrement = () => {
    if (dish.portions) {
      updateQuantity(`${dish.id}-${selectedPortion}`, -1);
    } else {
      updateQuantity(dish.id, -1);
    }
  };

  // Category band styling for cards without dish photos
  const getCategoryBandColor = () => {
    if (dish.type === 'veg') return 'border-palak text-palak bg-palak/5';
    return 'border-mirchi text-mirchi bg-mirchi/5';
  };

  return (
    <div className="bg-white border border-wheat rounded-[12px] p-4 shadow-soft hover:border-clay/40 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Band for Typographic Cards without photo */}
        {!dish.image && (
          <div className={`-mx-4 -mt-4 mb-3 px-4 py-1.5 border-b border-wheat rounded-t-[12px] flex items-center justify-between border-l-4 ${getCategoryBandColor()}`}>
            <span className="text-[14px] font-semibold tracking-wide uppercase">
              {dish.category}
            </span>
            <span className="text-[14px] text-clay">
              {dish.type === 'veg' ? 'Pure Vegetarian' : 'Non-Vegetarian'}
            </span>
          </div>
        )}

        {/* Header with badges and favorite toggle */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <DietaryBadge type={dish.type} />
            {dish.isBestseller && <TagBadge type="bestseller" />}
            {dish.isChefPick && <TagBadge type="chef-pick" />}
            {dish.spiceLevel && <SpiceBadge level={dish.spiceLevel} />}
          </div>

          <button
            type="button"
            onClick={() => toggleFavorite(dish.id)}
            className={`p-1.5 rounded-lg transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
              fav ? 'text-mirchi bg-mirchi/10' : 'text-clay/60 hover:text-mirchi hover:bg-cream'
            }`}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-mirchi stroke-mirchi' : 'stroke-[1.75]'}`} />
          </button>
        </div>

        {/* Real photo if available */}
        {dish.image && (
          <div className="mb-3 rounded-[8px] overflow-hidden border border-wheat/60 bg-paper">
            <ImageWithFallback
              src={dish.image}
              alt={dish.name}
              aspectRatio="video"
              fallbackText={dish.name}
              className="rounded-[8px] object-cover w-full group-hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}

        {/* Dish Title with Dotted Leader Line & Price */}
        <div className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="font-serif text-[20px] font-bold text-espresso leading-snug">
              {dish.name}
            </h4>
            <div className="border-b border-dotted border-wheat flex-1 mx-1.5 self-center" />
            <div className="shrink-0 font-serif font-bold text-mirchi text-[18px]">
              {currentPrice !== null ? `₹${currentPrice}` : <span className="text-[14px] text-clay font-normal">Ask staff</span>}
            </div>
          </div>

          {dish.hindiName && (
            <p className="font-hindi text-[14px] text-clay font-medium mt-0.5">
              {dish.hindiName}
            </p>
          )}

          <p className="text-[14px] text-clay leading-relaxed mt-1.5 line-clamp-2">
            {dish.description}
          </p>
        </div>
      </div>

      {/* Portion Selector & Add Button */}
      <div className="mt-3 pt-3 border-t border-wheat/80">
        {dish.portions && (
          <div className="flex items-center gap-1.5 p-1 bg-cream/70 rounded-[8px] mb-3 border border-wheat">
            {dish.portions.map(p => (
              <button
                key={p.portion}
                type="button"
                onClick={() => setSelectedPortion(p.portion)}
                className={`flex-1 py-1.5 px-2.5 rounded-[6px] text-[14px] font-medium transition-all flex items-center justify-between ${
                  selectedPortion === p.portion
                    ? 'bg-mirchi text-white shadow-sm font-semibold'
                    : 'text-espresso hover:bg-paper'
                }`}
              >
                <span>{p.portion}</span>
                <span className="font-serif">₹{p.price}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <div className="text-[14px] text-clay">
            {dish.portions ? `${selectedPortion} portion` : 'Freshly prepared'}
          </div>

          <div>
            {currentPrice !== null ? (
              qty > 0 ? (
                <QuantityStepper
                  quantity={qty}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  size="sm"
                />
              ) : (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="px-4 py-2 min-h-[44px] rounded-[10px] bg-mirchi hover:bg-[#A82217] text-white text-[14px] font-semibold flex items-center gap-1.5 transition-all shadow-soft"
                >
                  <Plus className="w-4 h-4 stroke-[2]" />
                  <span>ADD</span>
                </button>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
