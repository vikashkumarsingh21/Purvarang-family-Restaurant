import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  UtensilsCrossed,
  ShoppingBag,
  Heart,
  X,
  FileText
} from 'lucide-react';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';
import { DishCard } from '../components/menu/DishCard';
import { MenuSkeleton } from '../components/menu/MenuSkeleton';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';
import { JaaliDivider } from '../components/common/JaaliDivider';
import { storage } from '../lib/storage';

export const Menu: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const { itemCount, subtotal } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'bestseller'>('default');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategorySelect = (catId: string) => {
    setIsLoading(true);
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
    setTimeout(() => setIsLoading(false), 150);
  };

  const menuOverrides = useMemo(() => storage.getMenuOverrides(), []);
  const favorites = useMemo(() => storage.getFavorites(), []);

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.map(item => {
      const override = menuOverrides[item.id];
      if (override) {
        return {
          ...item,
          price: override.price !== undefined ? override.price : item.price,
          isAvailable: override.isAvailable !== undefined ? override.isAvailable : item.isAvailable,
        };
      }
      return item;
    })
    .filter(item => {
      if (!item.isAvailable) return false;

      if (activeCategory !== 'all' && item.categorySlug !== activeCategory) {
        return false;
      }

      if (dietaryFilter !== 'all' && item.type !== dietaryFilter) {
        return false;
      }

      if (showFavoritesOnly && !favorites.includes(item.id)) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesHindi = item.hindiName?.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        return matchesName || matchesHindi || matchesCategory || matchesDesc;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.price || 0) - (b.price || 0);
      }
      if (sortBy === 'price-desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'bestseller') {
        return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      }
      return 0;
    });
  }, [activeCategory, dietaryFilter, searchQuery, sortBy, showFavoritesOnly, menuOverrides, favorites]);

  const activeCategoryObj = MENU_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Menu Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-wheat pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[14px] text-mirchi font-bold uppercase tracking-wider mb-1">
            <UtensilsCrossed className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
            <span>Purvarang Menu Card</span>
          </div>
          <h1 className="font-serif text-[clamp(30px,4vw,44px)] font-bold text-espresso">
            Dine-In & Takeaway Menu
          </h1>
          <p className="text-[16px] text-clay mt-1">
            Hand-ground spices, clay tandoor breads, pure vegetarian gravies and chilled drinks.
          </p>
        </div>

        {/* Printable Menu Link */}
        <Link
          to="/menu/print"
          className="self-start md:self-auto px-4 py-2.5 rounded-[10px] bg-white hover:bg-paper border border-wheat text-espresso text-[14px] font-semibold flex items-center gap-2 shadow-soft transition-all"
        >
          <FileText className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
          <span>Print Physical Menu</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-wheat rounded-[14px] p-4 sm:p-5 space-y-4 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-clay absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search dishes (e.g. Chicken Dehati, Paneer Butter Masala, Mojito)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso placeholder:text-clay/70 focus:outline-none focus:ring-2 focus:ring-kesar/40 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-clay hover:text-espresso"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-52">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3.5 pl-9 rounded-[10px] bg-cream/50 border border-wheat text-[14px] font-medium text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40 appearance-none cursor-pointer"
                aria-label="Sort dishes"
              >
                <option value="default">Sort: Menu Order</option>
                <option value="bestseller">Sort: Bestsellers First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-mirchi absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
            </div>

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(prev => !prev)}
              className={`p-2.5 rounded-[10px] border border-wheat text-[14px] font-medium flex items-center gap-1.5 transition-colors shrink-0 shadow-soft ${
                showFavoritesOnly
                  ? 'bg-mirchi text-white border-mirchi'
                  : 'bg-cream/50 text-espresso hover:bg-paper'
              }`}
              title="Show Favorites"
              aria-label="Show Favorites"
            >
              <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white text-white' : 'text-mirchi'}`} strokeWidth={1.75} />
              <span className="hidden md:inline">Saved</span>
            </button>
          </div>
        </div>

        {/* Dietary Filter Buttons (All / Veg / Non-Veg) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-wheat">
          <span className="text-[14px] text-clay font-medium flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-mirchi" strokeWidth={1.75} />
            <span>Preference:</span>
          </span>

          <button
            onClick={() => setDietaryFilter('all')}
            className={`px-4 py-1.5 rounded-full text-[14px] font-medium transition-all border ${
              dietaryFilter === 'all'
                ? 'bg-espresso text-white border-espresso shadow-soft'
                : 'bg-white text-espresso border-wheat hover:bg-paper'
            }`}
          >
            All Items ({MENU_ITEMS.length})
          </button>

          <button
            onClick={() => setDietaryFilter('veg')}
            className={`px-4 py-1.5 rounded-full text-[14px] font-medium flex items-center gap-1.5 transition-all border ${
              dietaryFilter === 'veg'
                ? 'bg-palak text-white border-palak shadow-soft'
                : 'bg-white text-palak border-wheat hover:bg-paper'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-palak inline-block" />
            <span>Pure Veg Only</span>
          </button>

          <button
            onClick={() => setDietaryFilter('non-veg')}
            className={`px-4 py-1.5 rounded-full text-[14px] font-medium flex items-center gap-1.5 transition-all border ${
              dietaryFilter === 'non-veg'
                ? 'bg-[#B3261E] text-white border-[#B3261E] shadow-soft'
                : 'bg-white text-[#B3261E] border-wheat hover:bg-paper'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#B3261E] inline-block" />
            <span>Non-Veg Only</span>
          </button>
        </div>
      </div>

      {/* Sticky Category Tabs Bar */}
      <div className="sticky top-20 z-30 bg-cream/95 backdrop-blur-md py-3 -mx-4 px-4 sm:mx-0 sm:px-0 border-y border-wheat overflow-x-auto no-scrollbar flex items-center gap-2">
        <button
          onClick={() => handleCategorySelect('all')}
          className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all whitespace-nowrap shrink-0 border ${
            activeCategory === 'all'
              ? 'bg-mirchi text-white border-mirchi shadow-soft'
              : 'bg-white text-espresso border-wheat hover:bg-paper'
          }`}
        >
          All Items
        </button>

        {MENU_CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-mirchi text-white border-mirchi shadow-soft font-semibold'
                  : 'bg-white text-espresso border-wheat hover:bg-paper'
              }`}
            >
              <span>{cat.name}</span>
              <span className={`text-[13px] font-hindi ${isActive ? 'text-white/80' : 'text-clay'}`}>
                {cat.hindiName}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Section Header in Fraunces */}
      {activeCategory !== 'all' && activeCategoryObj && (
        <div className="pt-2">
          <div className="inline-block">
            <h2 className="font-serif text-[clamp(26px,3vw,34px)] font-bold text-espresso">
              {activeCategoryObj.name}
            </h2>
            <div className="h-1 w-full bg-haldi mt-1 rounded-full" />
          </div>
          <p className="text-[15px] text-clay mt-1">
            {activeCategoryObj.description || `${activeCategoryObj.name} dishes prepared freshly on order.`}
          </p>
        </div>
      )}

      {/* Dish Cards Grid or Skeleton */}
      {isLoading ? (
        <MenuSkeleton />
      ) : filteredItems.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-[14px] text-clay font-medium">
            <span>
              Showing <strong className="text-espresso font-bold">{filteredItems.length}</strong> items
            </span>
            <span>All items freshly cooked</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-6 bg-white border border-wheat rounded-[16px] max-w-md mx-auto space-y-4 shadow-soft">
          <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat mx-auto flex items-center justify-center text-clay">
            <UtensilsCrossed className="w-6 h-6 text-mirchi" strokeWidth={1.75} />
          </div>
          <h3 className="font-serif text-[20px] font-bold text-espresso">
            No Dishes Found
          </h3>
          <p className="text-[15px] text-clay leading-relaxed">
            We couldn't find any dish matching your filter criteria. Try clearing search keywords or checking another category.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setDietaryFilter('all');
              setActiveCategory('all');
              setShowFavoritesOnly(false);
            }}
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Floating Bottom Cart Bar (if items present) */}
      {itemCount > 0 && (
        <aside aria-label="Order Cart Summary" className="fixed bottom-20 lg:bottom-6 inset-x-4 max-w-xl mx-auto z-40">
          <div className="bg-white text-espresso p-4 rounded-[14px] shadow-soft-lg flex items-center justify-between border border-wheat animate-slide-up">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-wider text-palak">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in order
              </p>
              <p className="font-serif text-[22px] font-bold text-mirchi leading-tight">
                ₹{subtotal} <span className="text-[14px] font-normal text-clay">(excl. taxes)</span>
              </p>
            </div>

            <Link to="/cart">
              <Button size="md" variant="primary" leftIcon={<ShoppingBag className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </aside>
      )}

    </div>
  );
};
