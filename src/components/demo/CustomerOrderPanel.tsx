import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bell, 
  UtensilsCrossed, 
  Flame, 
  Coffee,
  Check,
  MessageSquare
} from 'lucide-react';
import { useOrderStore, OrderItem } from '../../store/orders';
import { MENU_ITEMS, MENU_CATEGORIES } from '../../data/menu';
import { RESTAURANT_CONFIG } from '../../config/restaurant';

interface CustomerOrderPanelProps {
  tableNumber?: number;
  isPhoneFrame?: boolean;
  onOrderPlaced?: (tokenId: string) => void;
}

export const CustomerOrderPanel: React.FC<CustomerOrderPanelProps> = ({
  tableNumber,
  isPhoneFrame = false,
  onOrderPlaced
}) => {
  const store = useOrderStore();
  const [selectedTable, setSelectedTable] = useState<number>(tableNumber || 4);
  const effectiveTable = tableNumber || selectedTable;

  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [cart, setCart] = useState<{ [name: string]: { item: any; qty: number; note: string } }>({});
  const [activeToken, setActiveToken] = useState<string | null>(null);
  const [showNoteFor, setShowNoteFor] = useState<string | null>(null);

  // Curate dishes: In phone frame show 16 popular dishes; otherwise full menu with category tabs
  const displayedDishes = useMemo(() => {
    let list = MENU_ITEMS.filter(d => !store.isOutOfStock(d.name));

    if (dietFilter === 'veg') {
      list = list.filter(d => d.type === 'veg');
    } else if (dietFilter === 'nonveg') {
      list = list.filter(d => d.type === 'non-veg');
    }

    if (!isPhoneFrame && activeCategory !== 'all') {
      list = list.filter(d => d.categorySlug === activeCategory);
    }

    if (isPhoneFrame) {
      // Pick top 16 popular dishes across categories
      const popular = list.filter(d => d.isBestseller || d.isChefPick);
      if (popular.length >= 16) return popular.slice(0, 16);
      return list.slice(0, 16);
    }

    return list;
  }, [dietFilter, activeCategory, isPhoneFrame, store.outOfStock]);

  // Find active order for this table if any
  const currentTableOrder = useMemo(() => {
    if (activeToken) {
      return store.orders.find(o => o.id === activeToken);
    }
    // Check if table currently has an active order
    return store.orders.find(
      o => o.table === effectiveTable && o.status !== 'served' && o.status !== 'cancelled'
    );
  }, [store.orders, activeToken, effectiveTable]);

  const handleAddToCart = (dish: any) => {
    setCart(prev => {
      const current = prev[dish.name];
      const newQty = (current?.qty || 0) + 1;
      return {
        ...prev,
        [dish.name]: {
          item: dish,
          qty: newQty,
          note: current?.note || ''
        }
      };
    });
  };

  const handleRemoveFromCart = (dishName: string) => {
    setCart(prev => {
      const current = prev[dishName];
      if (!current) return prev;
      if (current.qty <= 1) {
        const next = { ...prev };
        delete next[dishName];
        return next;
      }
      return {
        ...prev,
        [dishName]: {
          ...current,
          qty: current.qty - 1
        }
      };
    });
  };

  const handleUpdateNote = (dishName: string, note: string) => {
    setCart(prev => {
      if (!prev[dishName]) return prev;
      return {
        ...prev,
        [dishName]: {
          ...prev[dishName],
          note
        }
      };
    });
  };

  const cartItemsArray = Object.values(cart);
  const cartItemCount = cartItemsArray.reduce((acc, it) => acc + it.qty, 0);
  const cartSubtotal = cartItemsArray.reduce((acc, it) => {
    const price = it.item.price || (it.item.portions ? it.item.portions[0].price : 200);
    return acc + price * it.qty;
  }, 0);

  const handleSendToKitchen = () => {
    if (cartItemsArray.length === 0) return;

    const items: OrderItem[] = cartItemsArray.map(it => ({
      name: it.item.name,
      qty: it.qty,
      veg: it.item.type === 'veg',
      price: it.item.price || (it.item.portions ? it.item.portions[0].price : 200),
      note: it.note ? it.note.trim() : undefined,
      categorySlug: it.item.categorySlug
    }));

    const tokenId = store.placeOrder({
      table: effectiveTable,
      source: 'dine',
      items
    });

    setActiveToken(tokenId);
    setCart({});
    if (onOrderPlaced) onOrderPlaced(tokenId);
  };

  // Stepper helper
  const getStepStatus = (step: 'new' | 'cooking' | 'ready' | 'served', current?: string) => {
    const order = ['new', 'cooking', 'ready', 'served'];
    const stepIdx = order.indexOf(step);
    const currIdx = order.indexOf(current || 'new');
    if (currIdx > stepIdx) return 'completed';
    if (currIdx === stepIdx) return 'active';
    return 'pending';
  };

  return (
    <div className={`flex flex-col bg-cream text-espresso ${isPhoneFrame ? 'h-full max-w-[390px] mx-auto rounded-[24px] overflow-hidden border border-wheat shadow-soft-lg' : 'w-full'}`}>
      
      {/* Header Strip in Palak */}
      <div className="bg-palak text-white px-4 py-3 shrink-0 flex items-center justify-between">
        <div>
          <span className="text-[12px] uppercase font-bold tracking-wider text-haldi block">
            Welcome to Purvarang
          </span>
          <h2 className="font-serif text-[18px] font-bold leading-tight">
            Order from your table
          </h2>
        </div>

        {/* Table Selector (1 to 20) in /demo; fixed badge on /table/:n */}
        {!tableNumber ? (
          <div className="flex items-center gap-1.5 bg-dark/40 px-2.5 py-1 rounded-[8px] border border-white/10">
            <span className="text-[12px] font-bold text-cream/80">Table</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="bg-transparent text-white font-bold text-[14px] focus:outline-none cursor-pointer"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num} className="bg-espresso text-white">
                  {num}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-white/10 px-3 py-1 rounded-[8px] text-[13px] font-bold text-white border border-white/20">
            Table {tableNumber}
          </div>
        )}
      </div>

      {/* Quick Service Alerts for Table */}
      <div className="bg-paper border-b border-wheat px-3 py-2 flex items-center justify-between text-[13px] gap-2">
        <button
          onClick={() => store.requestTableAlert(effectiveTable, 'waiter')}
          className="flex-1 py-1.5 px-2 bg-white border border-wheat rounded-[6px] hover:border-kesar font-medium text-espresso flex items-center justify-center gap-1 text-[13px] transition-colors"
        >
          <Bell className="w-3.5 h-3.5 text-kesar stroke-[1.75]" />
          <span>Call Waiter</span>
        </button>
        <button
          onClick={() => store.requestTableAlert(effectiveTable, 'water')}
          className="flex-1 py-1.5 px-2 bg-white border border-wheat rounded-[6px] hover:border-palak font-medium text-espresso flex items-center justify-center gap-1 text-[13px] transition-colors"
        >
          <Coffee className="w-3.5 h-3.5 text-palak stroke-[1.75]" />
          <span>Water</span>
        </button>
        <button
          onClick={() => store.requestTableAlert(effectiveTable, 'bill')}
          className="flex-1 py-1.5 px-2 bg-white border border-wheat rounded-[6px] hover:border-mirchi font-medium text-espresso flex items-center justify-center gap-1 text-[13px] transition-colors"
        >
          <UtensilsCrossed className="w-3.5 h-3.5 text-mirchi stroke-[1.75]" />
          <span>Bill</span>
        </button>
      </div>

      {/* Live Order Tracking Card if an active order exists */}
      {currentTableOrder && (
        <div className="m-3 p-3.5 bg-white border border-wheat rounded-[12px] shadow-soft space-y-3 shrink-0" aria-live="polite">
          <div className="flex items-center justify-between border-b border-wheat pb-2">
            <div>
              <span className="text-[12px] font-bold text-clay uppercase">Live Tracking</span>
              <h3 className="font-serif text-[17px] font-bold text-espresso">
                Order {currentTableOrder.id} • Table {currentTableOrder.table}
              </h3>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold uppercase ${
              currentTableOrder.status === 'ready'
                ? 'bg-palak/10 text-palak border border-palak/30 animate-pulse'
                : currentTableOrder.status === 'cooking'
                ? 'bg-kesar/10 text-kesar border border-kesar/30'
                : currentTableOrder.status === 'served'
                ? 'bg-wheat/50 text-clay border border-wheat'
                : 'bg-paper text-espresso border border-wheat'
            }`}>
              {currentTableOrder.status === 'new' ? 'Received' : currentTableOrder.status}
            </span>
          </div>

          {/* 4-Step Progress Bar: Received -> Cooking -> Ready -> Served */}
          <div className="grid grid-cols-4 gap-1 pt-1">
            {[
              { id: 'new', label: 'Received' },
              { id: 'cooking', label: 'Cooking' },
              { id: 'ready', label: 'Ready' },
              { id: 'served', label: 'Served' }
            ].map((step, idx) => {
              const status = getStepStatus(step.id as any, currentTableOrder.status);
              return (
                <div key={step.id} className="text-center">
                  <div className={`h-1.5 rounded-full mb-1.5 transition-colors ${
                    status === 'completed'
                      ? 'bg-palak'
                      : status === 'active'
                      ? 'bg-kesar animate-pulse'
                      : 'bg-wheat/60'
                  }`} />
                  <span className={`text-[11px] font-medium leading-none block ${
                    status === 'active' ? 'text-espresso font-bold' : 'text-clay'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Friendly Status Messages */}
          {currentTableOrder.status === 'ready' && (
            <div className="p-2 bg-[#F2F8F4] border border-[#C4DFC9] rounded-[8px] text-[13px] text-palak font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-palak stroke-[1.75]" />
              <span>Your order is ready! Our waiter is bringing it to your table.</span>
            </div>
          )}
          {currentTableOrder.status === 'served' && (
            <div className="p-2 bg-paper border border-wheat rounded-[8px] text-[13px] text-espresso font-medium flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-palak stroke-[1.75]" />
                <span>Enjoy your meal!</span>
              </span>
              <button
                onClick={() => setActiveToken(null)}
                className="text-[12px] text-mirchi font-bold underline"
              >
                Order More
              </button>
            </div>
          )}
        </div>
      )}

      {/* Veg / Non-veg / All Filter Chips */}
      <div className="px-3 py-2 bg-cream flex items-center justify-between gap-2 border-b border-wheat shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setDietFilter('all')}
            className={`px-3 py-1 rounded-full text-[13px] font-bold transition-all ${
              dietFilter === 'all'
                ? 'bg-espresso text-white'
                : 'bg-white text-clay border border-wheat hover:text-espresso'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setDietFilter('veg')}
            className={`px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1 transition-all ${
              dietFilter === 'veg'
                ? 'bg-palak text-white'
                : 'bg-white text-palak border border-wheat hover:bg-palak/10'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-palak shrink-0" />
            <span>Veg</span>
          </button>
          <button
            onClick={() => setDietFilter('nonveg')}
            className={`px-3 py-1 rounded-full text-[13px] font-bold flex items-center gap-1 transition-all ${
              dietFilter === 'nonveg'
                ? 'bg-[#B3261E] text-white'
                : 'bg-white text-[#B3261E] border border-wheat hover:bg-red-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#B3261E] shrink-0" />
            <span>Non-Veg</span>
          </button>
        </div>

        <span className="text-[12px] text-clay">
          {displayedDishes.length} items
        </span>
      </div>

      {/* Category Tabs (Only on full-screen /table/:n view) */}
      {!isPhoneFrame && (
        <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 bg-paper/60 border-b border-wheat no-scrollbar shrink-0">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1 text-[13px] font-bold rounded-[6px] shrink-0 transition-colors ${
              activeCategory === 'all'
                ? 'bg-mirchi text-white'
                : 'text-clay hover:text-espresso'
            }`}
          >
            All Categories
          </button>
          {MENU_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 text-[13px] font-medium rounded-[6px] shrink-0 transition-colors ${
                activeCategory === cat.id
                  ? 'bg-mirchi text-white font-bold'
                  : 'text-clay hover:text-espresso bg-white border border-wheat'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Menu Dishes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {displayedDishes.map(dish => {
          const inCart = cart[dish.name];
          const price = dish.price || (dish.portions ? dish.portions[0].price : 200);

          return (
            <div
              key={dish.id}
              className="p-3 bg-white border border-wheat rounded-[12px] shadow-soft flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        dish.type === 'veg' ? 'bg-palak' : 'bg-nonveg'
                      }`}
                      title={dish.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                    />
                    <h4 className="font-bold text-[15px] text-espresso leading-snug line-clamp-1">
                      {dish.name}
                    </h4>
                  </div>
                  <p className="font-serif text-[15px] font-bold text-mirchi">
                    ₹{price}
                  </p>
                </div>

                {/* ADD / Quantity Stepper */}
                <div className="shrink-0">
                  {!inCart ? (
                    <button
                      onClick={() => handleAddToCart(dish)}
                      className="px-3.5 py-1.5 min-h-[38px] bg-paper hover:bg-wheat/70 border border-wheat text-espresso font-bold text-[13px] rounded-[8px] flex items-center gap-1 transition-colors active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[2]" />
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="flex items-center bg-mirchi text-white rounded-[8px] min-h-[38px] overflow-hidden shadow-soft">
                      <button
                        onClick={() => handleRemoveFromCart(dish.name)}
                        className="px-2.5 py-1.5 hover:bg-black/10 active:bg-black/20 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                      <span className="px-2.5 text-[14px] font-bold min-w-6 text-center">
                        {inCart.qty}
                      </span>
                      <button
                        onClick={() => handleAddToCart(dish)}
                        className="px-2.5 py-1.5 hover:bg-black/10 active:bg-black/20 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Optional Cooking Note per Item */}
              {inCart && (
                <div className="pt-1 border-t border-wheat/60">
                  {showNoteFor === dish.name ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. less spicy, extra crispy..."
                        value={inCart.note}
                        onChange={(e) => handleUpdateNote(dish.name, e.target.value)}
                        className="flex-1 text-[13px] px-2.5 py-1 bg-cream border border-wheat rounded-[6px] text-espresso focus:outline-none focus:ring-1 focus:ring-kesar"
                      />
                      <button
                        onClick={() => setShowNoteFor(null)}
                        className="text-[12px] text-palak font-bold px-2 py-1 bg-paper rounded-[6px]"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowNoteFor(dish.name)}
                      className="text-[12px] text-clay hover:text-espresso flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3 stroke-[1.75]" />
                      <span>{inCart.note ? `Note: "${inCart.note}" (edit)` : '+ Add note for chef'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Order Button */}
      <div className="p-3 bg-white border-t border-wheat shrink-0">
        {cartItemCount > 0 ? (
          <button
            onClick={handleSendToKitchen}
            className="w-full min-h-[48px] bg-mirchi hover:bg-[#a92218] text-white font-bold text-[16px] rounded-[10px] shadow-soft flex items-center justify-between px-4 transition-transform active:scale-[0.99]"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
              <span>Send to Kitchen ({cartItemCount})</span>
            </span>
            <span className="font-serif text-[17px]">
              ₹{cartSubtotal}
            </span>
          </button>
        ) : (
          <button
            disabled
            className="w-full min-h-[48px] bg-paper text-clay font-bold text-[15px] rounded-[10px] border border-wheat cursor-not-allowed opacity-80"
          >
            Add dishes to order
          </button>
        )}
      </div>

    </div>
  );
};
