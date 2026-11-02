import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChefHat, 
  Printer, 
  Volume2, 
  VolumeX, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Layers, 
  X,
  AlertTriangle
} from 'lucide-react';
import { useOrderStore, Order, OrderItem } from '../../store/orders';
import { DEMO_SPEED } from '../../config/restaurant';
import { MENU_ITEMS } from '../../data/menu';

interface KitchenDisplayViewProps {
  isPanel?: boolean;
}

export type KitchenStation = 'all' | 'tandoor' | 'chinese' | 'gravy_rice' | 'drinks_desserts';

export function getStation(categorySlug?: string, name?: string): KitchenStation {
  const cat = (categorySlug || '').toLowerCase();
  const n = (name || '').toLowerCase();

  if (['mocktail', 'shake', 'ice-cream', 'soft-drink', 'dessert', 'beverages'].includes(cat) || n.includes('mojito') || n.includes('coffee') || n.includes('shake') || n.includes('jamun')) {
    return 'drinks_desserts';
  }
  if (
    cat.includes('starter') ||
    cat.includes('tandoor') ||
    cat.includes('bread') ||
    n.includes('tikka') ||
    n.includes('tandoori') ||
    n.includes('kabab') ||
    n.includes('naan') ||
    n.includes('roti') ||
    n.includes('kulcha') ||
    n.includes('paratha')
  ) {
    return 'tandoor';
  }
  if (['chinese-veg', 'chinese-non-veg', 'pasta', 'soup'].includes(cat) || n.includes('chilli') || n.includes('manchurian') || n.includes('chowmein') || n.includes('noodles')) {
    return 'chinese';
  }
  return 'gravy_rice';
}

export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({ isPanel = false }) => {
  const store = useOrderStore();
  const [stationFilter, setStationFilter] = useState<KitchenStation>('all');
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const [showStockModal, setShowStockModal] = useState<boolean>(false);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Update timer every second for live elapsed minutes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute kitchen minutes: 3 real seconds = 1 kitchen minute
  const getElapsedMinutes = (createdAt: number) => {
    const realElapsedSec = Math.floor((currentTime - createdAt) / 1000);
    return Math.max(0, Math.floor(realElapsedSec / DEMO_SPEED));
  };

  // Header age color:
  // Under 10 min: palak (#1E4A33)
  // 10 to 20 min: kesar (#F26A1B, dark text)
  // Over 20 min: mirchi (#C62B1F)
  const getHeaderAgeStyle = (mins: number) => {
    if (mins < 10) {
      return {
        bg: 'bg-[#1E4A33]',
        text: 'text-white',
        border: 'border-[#1E4A33]'
      };
    }
    if (mins <= 20) {
      return {
        bg: 'bg-[#F26A1B]',
        text: 'text-[#1F130E]',
        border: 'border-[#F26A1B]'
      };
    }
    return {
      bg: 'bg-[#C62B1F]',
      text: 'text-white',
      border: 'border-[#C62B1F]'
    };
  };

  // Filter orders by station
  const filteredOrders = useMemo(() => {
    const nonServed = store.orders.filter(o => o.status !== 'served' && o.status !== 'cancelled');
    if (stationFilter === 'all') return nonServed;

    return nonServed.filter(order => {
      return order.items.some(it => getStation(it.categorySlug, it.name) === stationFilter);
    });
  }, [store.orders, stationFilter]);

  const newOrders = filteredOrders.filter(o => o.status === 'new');
  const cookingOrders = filteredOrders.filter(o => o.status === 'cooking');
  const readyOrders = filteredOrders.filter(o => o.status === 'ready');

  // "All-day count" strip: Total quantity of each dish still pending (new or cooking)
  const pendingDishCounts = useMemo(() => {
    const counts: { [dish: string]: { qty: number; veg: boolean } } = {};
    store.orders
      .filter(o => o.status === 'new' || o.status === 'cooking')
      .forEach(o => {
        o.items.forEach(it => {
          if (!counts[it.name]) {
            counts[it.name] = { qty: 0, veg: it.veg };
          }
          counts[it.name].qty += it.qty;
        });
      });
    return Object.entries(counts).sort((a, b) => b[1].qty - a[1].qty);
  }, [store.orders]);

  const handlePrintKOT = (order: Order) => {
    setPrintingOrder(order);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className={`flex flex-col bg-[#1F130E] text-[#FFF7EA] ${isPanel ? 'h-full rounded-[16px] overflow-hidden border border-wheat/20' : 'min-h-screen p-4 sm:p-6'}`}>
      
      {/* Top Bar */}
      <div className="bg-[#2B1A12] border-b border-wheat/20 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-kesar flex items-center justify-center text-[#1F130E]">
            <ChefHat className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-[22px] font-bold text-white leading-tight">
                Kitchen Display System
              </h1>
              <span className="text-[12px] bg-white/10 text-haldi px-2 py-0.5 rounded-[4px] font-mono border border-white/10">
                Demo speed: 3s = 1 min
              </span>
            </div>
            <p className="text-[14px] text-cream/70">
              Live orders sync across stations • Tinpulwa Kitchen
            </p>
          </div>
        </div>

        {/* Station Filter Chips & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-[#1F130E] p-1 rounded-[8px] border border-wheat/20">
            {[
              { id: 'all', label: 'All Stations' },
              { id: 'tandoor', label: 'Tandoor' },
              { id: 'chinese', label: 'Chinese' },
              { id: 'gravy_rice', label: 'Gravy & Rice' },
              { id: 'drinks_desserts', label: 'Drinks & Desserts' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStationFilter(st.id as KitchenStation)}
                className={`px-2.5 py-1 text-[13px] font-bold rounded-[6px] transition-colors ${
                  stationFilter === st.id
                    ? 'bg-kesar text-[#1F130E]'
                    : 'text-cream/70 hover:text-white'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => store.toggleSound()}
            className={`p-2 rounded-[8px] border transition-colors ${
              store.soundMuted
                ? 'bg-red-950/60 text-red-400 border-red-800/40'
                : 'bg-white/10 text-haldi border-white/20 hover:bg-white/20'
            }`}
            title={store.soundMuted ? 'Sound muted' : 'Sound active'}
          >
            {store.soundMuted ? <VolumeX className="w-5 h-5 stroke-[1.75]" /> : <Volume2 className="w-5 h-5 stroke-[1.75]" />}
          </button>

          {/* Out-of-Stock (86 List) Button */}
          <button
            onClick={() => setShowStockModal(true)}
            className="px-3 py-2 bg-[#2B1A12] hover:bg-white/10 border border-wheat/30 rounded-[8px] text-[13px] font-bold text-cream flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-4 h-4 text-kesar stroke-[1.75]" />
            <span>86 List ({store.outOfStock.length})</span>
          </button>
        </div>
      </div>

      {/* "All-Day Count" Strip: Total Quantity of Pending Dishes */}
      {pendingDishCounts.length > 0 && (
        <div className="bg-[#24150E] border-b border-wheat/15 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 text-[13px]">
          <span className="font-bold text-haldi text-[12px] uppercase shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Pending Prep:
          </span>
          <div className="flex items-center gap-2">
            {pendingDishCounts.map(([name, data]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[6px] bg-[#1F130E] border border-wheat/20 text-white shrink-0 font-medium"
              >
                <span className={`w-2 h-2 rounded-full ${data.veg ? 'bg-palak' : 'bg-nonveg'}`} />
                <span>{name}</span>
                <span className="font-bold text-kesar">×{data.qty}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Three Ticket Columns: New, Cooking, Ready */}
      <div className="flex-1 p-3 sm:p-4 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto">
        
        {/* Column 1: New */}
        <div className="flex flex-col bg-[#24150E]/80 border border-wheat/20 rounded-[12px] overflow-hidden">
          <div className="p-3 bg-[#2B1A12] border-b border-wheat/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-palak animate-pulse" />
              <h2 className="font-serif text-[20px] font-bold text-white">
                New Tickets
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-palak text-white text-[13px] font-bold">
              {newOrders.length}
            </span>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {newOrders.length === 0 ? (
              <div className="text-center py-12 text-cream/40 text-[15px]">
                No new incoming tickets
              </div>
            ) : (
              newOrders.map(order => {
                const mins = getElapsedMinutes(order.createdAt);
                const ageStyle = getHeaderAgeStyle(mins);
                return (
                  <div
                    key={order.id}
                    className="bg-[#2B1A12] border border-wheat/30 rounded-[10px] overflow-hidden shadow-soft flex flex-col transition-all hover:border-kesar"
                  >
                    {/* Ticket Header */}
                    <div className={`${ageStyle.bg} ${ageStyle.text} p-3 flex items-center justify-between font-bold`}>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[22px] tracking-wide">
                          {order.id}
                        </span>
                        <span className="text-[14px] bg-black/25 px-2 py-0.5 rounded-[4px]">
                          {order.table ? `Table ${order.table}` : 'Pickup'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[14px]">
                        <Clock className="w-4 h-4 stroke-[2]" />
                        <span>{mins}m ago</span>
                      </div>
                    </div>

                    {/* Ticket Items */}
                    <div className="p-3 space-y-2 flex-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 border-b border-white/5 pb-1.5 last:border-0">
                          <div className="flex items-start gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${it.veg ? 'bg-palak' : 'bg-nonveg'}`} />
                            <div>
                              <p className="text-[18px] font-bold text-white leading-snug">
                                {it.name}
                              </p>
                              {it.note && (
                                <p className="text-[13px] text-kesar italic font-medium">
                                  Note: "{it.note}"
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[20px] font-serif font-bold text-haldi">
                            ×{it.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="p-3 bg-[#1F130E] border-t border-wheat/20 flex items-center gap-2">
                      <button
                        onClick={() => store.advanceOrder(order.id)}
                        className="flex-1 min-h-[46px] bg-kesar hover:bg-[#e05e14] text-[#1F130E] font-bold text-[16px] rounded-[8px] flex items-center justify-center gap-2 transition-colors active:scale-98"
                      >
                        <Flame className="w-5 h-5 stroke-[2]" />
                        <span>Start Cooking</span>
                      </button>
                      <button
                        onClick={() => handlePrintKOT(order)}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-cream rounded-[8px] border border-white/10"
                        title="Print KOT"
                      >
                        <Printer className="w-5 h-5 stroke-[1.75]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 2: Cooking */}
        <div className="flex flex-col bg-[#24150E]/80 border border-wheat/20 rounded-[12px] overflow-hidden">
          <div className="p-3 bg-[#2B1A12] border-b border-wheat/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-kesar animate-pulse" />
              <h2 className="font-serif text-[20px] font-bold text-white">
                Cooking / On Range
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-kesar text-[#1F130E] text-[13px] font-bold">
              {cookingOrders.length}
            </span>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {cookingOrders.length === 0 ? (
              <div className="text-center py-12 text-cream/40 text-[15px]">
                No dishes currently on the stove
              </div>
            ) : (
              cookingOrders.map(order => {
                const mins = getElapsedMinutes(order.createdAt);
                const ageStyle = getHeaderAgeStyle(mins);
                return (
                  <div
                    key={order.id}
                    className="bg-[#2B1A12] border border-wheat/30 rounded-[10px] overflow-hidden shadow-soft flex flex-col transition-all hover:border-palak"
                  >
                    <div className={`${ageStyle.bg} ${ageStyle.text} p-3 flex items-center justify-between font-bold`}>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[22px] tracking-wide">
                          {order.id}
                        </span>
                        <span className="text-[14px] bg-black/25 px-2 py-0.5 rounded-[4px]">
                          {order.table ? `Table ${order.table}` : 'Pickup'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[14px]">
                        <Clock className="w-4 h-4 stroke-[2]" />
                        <span>{mins}m ago</span>
                      </div>
                    </div>

                    <div className="p-3 space-y-2 flex-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-start justify-between gap-2 border-b border-white/5 pb-1.5 last:border-0">
                          <div className="flex items-start gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${it.veg ? 'bg-palak' : 'bg-nonveg'}`} />
                            <div>
                              <p className="text-[18px] font-bold text-white leading-snug">
                                {it.name}
                              </p>
                              {it.note && (
                                <p className="text-[13px] text-kesar italic font-medium">
                                  Note: "{it.note}"
                                </p>
                              )}
                            </div>
                          </div>
                          <span className="text-[20px] font-serif font-bold text-haldi">
                            ×{it.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-[#1F130E] border-t border-wheat/20 flex items-center gap-2">
                      <button
                        onClick={() => store.advanceOrder(order.id)}
                        className="flex-1 min-h-[46px] bg-palak hover:bg-[#163826] text-white font-bold text-[16px] rounded-[8px] flex items-center justify-center gap-2 transition-colors active:scale-98"
                      >
                        <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                        <span>Mark Ready</span>
                      </button>
                      <button
                        onClick={() => handlePrintKOT(order)}
                        className="p-2.5 bg-white/10 hover:bg-white/20 text-cream rounded-[8px] border border-white/10"
                        title="Print KOT"
                      >
                        <Printer className="w-5 h-5 stroke-[1.75]" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Column 3: Ready */}
        <div className="flex flex-col bg-[#24150E]/80 border border-wheat/20 rounded-[12px] overflow-hidden">
          <div className="p-3 bg-[#2B1A12] border-b border-wheat/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-haldi animate-pulse" />
              <h2 className="font-serif text-[20px] font-bold text-white">
                Ready at Pass
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-haldi text-[#1F130E] text-[13px] font-bold">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-12 text-cream/40 text-[15px]">
                No orders waiting at pickup pass
              </div>
            ) : (
              readyOrders.map(order => {
                const mins = getElapsedMinutes(order.createdAt);
                return (
                  <div
                    key={order.id}
                    className="bg-[#2B1A12] border border-palak/50 rounded-[10px] overflow-hidden shadow-soft flex flex-col"
                  >
                    <div className="bg-palak text-white p-3 flex items-center justify-between font-bold">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-[22px] tracking-wide">
                          {order.id}
                        </span>
                        <span className="text-[14px] bg-black/25 px-2 py-0.5 rounded-[4px]">
                          {order.table ? `Table ${order.table}` : 'Pickup'}
                        </span>
                      </div>
                      <span className="text-[13px] uppercase bg-white/20 px-2 py-0.5 rounded-[4px]">
                        Pass Ready
                      </span>
                    </div>

                    <div className="p-3 space-y-1.5 flex-1">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 text-[16px]">
                          <span className="text-white/90 font-medium">
                            {it.name}
                          </span>
                          <span className="font-serif font-bold text-haldi">
                            ×{it.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-[#1F130E] border-t border-wheat/20">
                      <button
                        onClick={() => store.advanceOrder(order.id)}
                        className="w-full min-h-[46px] bg-white/10 hover:bg-white/20 text-cream font-bold text-[16px] rounded-[8px] flex items-center justify-center gap-2 transition-colors active:scale-98"
                      >
                        <CheckCircle2 className="w-5 h-5 text-palak stroke-[2]" />
                        <span>Handover & Served</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* 86 List / Out-of-Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#2B1A12] border border-wheat/30 rounded-[16px] max-w-lg w-full p-5 shadow-soft-lg text-cream">
            <div className="flex items-center justify-between pb-3 border-b border-wheat/20 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-kesar stroke-[1.75]" />
                <h3 className="font-serif text-[20px] font-bold text-white">
                  86 List (Out-of-Stock Manager)
                </h3>
              </div>
              <button
                onClick={() => setShowStockModal(false)}
                className="p-1 rounded-[6px] text-cream/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[14px] text-cream/70 mb-4">
              Dishes toggled off here immediately vanish from the customer table menu in real time across all phones.
            </p>

            <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
              {MENU_ITEMS.map(dish => {
                const isOff = store.isOutOfStock(dish.name);
                return (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#1F130E] border border-wheat/15"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${dish.type === 'veg' ? 'bg-palak' : 'bg-nonveg'}`} />
                      <span className="font-medium text-[15px] text-white">
                        {dish.name}
                      </span>
                    </div>
                    <button
                      onClick={() => store.toggleOutOfStock(dish.name)}
                      className={`px-3 py-1 rounded-[6px] text-[13px] font-bold transition-colors ${
                        isOff
                          ? 'bg-red-900/60 text-red-200 border border-red-700'
                          : 'bg-palak/60 text-emerald-200 border border-emerald-700'
                      }`}
                    >
                      {isOff ? 'Out of Stock (86)' : 'In Stock'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-wheat/20 mt-4 flex justify-end">
              <button
                onClick={() => setShowStockModal(false)}
                className="px-4 py-2 bg-kesar text-[#1F130E] font-bold text-[14px] rounded-[8px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable KOT Sheet */}
      {printingOrder && (
        <div className="hidden print:block fixed inset-0 bg-white text-black p-8 font-mono">
          <div className="text-center pb-4 border-b-2 border-black mb-4">
            <h1 className="text-2xl font-bold uppercase">KITCHEN ORDER TICKET</h1>
            <p className="text-sm">Purvarang Family Restaurant • Lalganj</p>
            <p className="text-lg font-bold pt-1">TOKEN: {printingOrder.id}</p>
            <p className="text-sm">
              {printingOrder.table ? `TABLE: ${printingOrder.table}` : 'PICKUP'} • {new Date(printingOrder.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="space-y-3 pb-6 border-b-2 border-black">
            {printingOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-lg">
                <span className="font-bold">{it.qty} × {it.name}</span>
                {it.note && <span className="text-xs italic pl-2">({it.note})</span>}
              </div>
            ))}
          </div>
          <div className="text-center pt-4 text-xs">
            *** End of Ticket ***
          </div>
        </div>
      )}

    </div>
  );
};
