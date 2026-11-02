import React, { useMemo } from 'react';
import { Tv, Clock, CheckCircle2, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { useOrderStore } from '../../store/orders';
import { LIVE_TICKER_ANNOUNCEMENTS } from '../../config/restaurant';

interface LiveBoardViewProps {
  isPanel?: boolean;
}

export const LiveBoardView: React.FC<LiveBoardViewProps> = ({ isPanel = false }) => {
  const store = useOrderStore();

  // Preparing orders: 'new' and 'cooking'
  const preparingOrders = useMemo(() => {
    return store.orders.filter(o => o.status === 'new' || o.status === 'cooking');
  }, [store.orders]);

  // Ready orders: 'ready' (auto-hides once served)
  const readyOrders = useMemo(() => {
    return store.orders.filter(o => o.status === 'ready');
  }, [store.orders]);

  // Estimated wait: 10 + 3 x number of preparing orders
  const estimatedWaitMin = 10 + 3 * preparingOrders.length;

  return (
    <div
      className={`flex flex-col bg-[#1F130E] text-[#FFF7EA] ${
        isPanel
          ? 'h-full rounded-[16px] overflow-hidden border border-wheat/20'
          : 'min-h-screen p-4 sm:p-8'
      }`}
      aria-live="polite"
    >
      {/* Brand Header */}
      <div className="bg-[#2B1A12] border-b border-wheat/20 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[8px] bg-palak flex items-center justify-center text-white">
            <Tv className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h1 className="font-serif text-[22px] sm:text-[26px] font-bold tracking-wide text-white leading-tight">
              PURVARANG ORDER STATUS
            </h1>
            <p className="text-[13px] sm:text-[14px] text-haldi font-medium">
              Lobby & Dining TV Board • Live Counter Updates
            </p>
          </div>
        </div>

        {/* Live Indicator & Sound Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#1F130E] px-3 py-1.5 rounded-[8px] border border-wheat/20">
            <span className="w-2.5 h-2.5 rounded-full bg-palak animate-ping" />
            <span className="text-[13px] font-mono font-bold text-white uppercase tracking-wider">
              LIVE SYNC
            </span>
          </div>

          <button
            onClick={() => store.toggleSound()}
            className={`p-2 rounded-[8px] border transition-colors ${
              store.soundMuted
                ? 'bg-red-950/60 text-red-400 border-red-800/40'
                : 'bg-white/10 text-haldi border-white/20'
            }`}
            title={store.soundMuted ? 'Muted' : 'Sound active'}
          >
            {store.soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Two-Column Display: Preparing vs Ready */}
      <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
        
        {/* Left Column: Preparing */}
        <div className="flex flex-col bg-[#24150E] border border-wheat/20 rounded-[16px] overflow-hidden shadow-soft">
          <div className="bg-[#2B1A12] border-b border-wheat/20 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-kesar stroke-[2]" />
              <h2 className="font-serif text-[22px] sm:text-[26px] font-bold text-white">
                Preparing
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-kesar text-[#1F130E] font-bold text-[14px]">
              {preparingOrders.length}
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="text-center py-16 text-cream/40 text-[18px]">
                All placed orders are ready or served
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {preparingOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-[12px] bg-[#2B1A12] border border-wheat/25 text-center flex flex-col justify-center items-center shadow-soft hover:border-kesar transition-colors"
                  >
                    <span className="font-serif text-4xl sm:text-5xl font-bold text-white tracking-wider">
                      {order.id}
                    </span>
                    <span className="text-[12px] text-cream/60 mt-1 uppercase font-bold tracking-wider">
                      {order.table ? `Table ${order.table}` : 'Pickup'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ready, Please Collect */}
        <div className="flex flex-col bg-[#24150E] border border-palak/40 rounded-[16px] overflow-hidden shadow-soft">
          <div className="bg-[#1E4A33] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-haldi stroke-[2]" />
              <h2 className="font-serif text-[22px] sm:text-[26px] font-bold tracking-wide">
                Ready, Please Collect
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white text-palak font-bold text-[14px]">
              {readyOrders.length}
            </span>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="text-center py-16 text-cream/40 text-[18px]">
                Waiting for the next dish from kitchen...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {readyOrders.map(order => (
                  <div
                    key={order.id}
                    className="p-4 rounded-[12px] bg-gradient-to-b from-[#253f2c] to-[#1E4A33] border-2 border-palak text-center flex flex-col justify-center items-center shadow-soft-lg animate-pulse motion-reduce:animate-none"
                  >
                    <span className="font-serif text-5xl sm:text-6xl font-bold text-white tracking-wider drop-shadow-md">
                      {order.id}
                    </span>
                    <span className="text-[13px] text-haldi mt-1 uppercase font-bold tracking-wider">
                      {order.table ? `Table ${order.table}` : 'Takeaway'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Footer Line: Estimated Wait Time Formula */}
      <div className="bg-[#2B1A12] border-t border-wheat/20 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-[16px] sm:text-[18px] text-cream">
          <Clock className="w-5 h-5 text-kesar stroke-[2]" />
          <span className="font-medium">
            Estimated wait: <strong className="font-serif text-kesar text-[20px]">about {estimatedWaitMin} min</strong>
          </span>
          <span className="text-[12px] text-cream/60 pl-2">
            (Calculated live from {preparingOrders.length} pending ticket{preparingOrders.length === 1 ? '' : 's'})
          </span>
        </div>

        <div className="text-[14px] text-haldi font-medium">
          Tinpulwa Chowk • Fresh Food Cooked to Order
        </div>
      </div>

      {/* Scrolling Announcement Marquee Ticker */}
      <div className="bg-espresso text-cream border-t border-wheat/20 overflow-hidden whitespace-nowrap py-2.5 shrink-0">
        <div className="inline-block animate-marquee text-[15px] sm:text-[17px] font-medium tracking-wide">
          {LIVE_TICKER_ANNOUNCEMENTS.map((text, idx) => (
            <span key={idx} className="mx-8 inline-flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-kesar inline-block" />
              <span>{text}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
