import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Square, 
  RotateCcw, 
  ExternalLink, 
  Smartphone, 
  ChefHat, 
  Tv, 
  Users, 
  Sparkles,
  Layers,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useOrderStore } from '../store/orders';
import { CustomerOrderPanel } from '../components/demo/CustomerOrderPanel';
import { KitchenDisplayView } from '../components/demo/KitchenDisplayView';
import { LiveBoardView } from '../components/demo/LiveBoardView';
import { WaitlistView } from '../components/demo/WaitlistView';

export const DemoControlRoom: React.FC = () => {
  const store = useOrderStore();
  const [activeMobileTab, setActiveMobileTab] = useState<'phone' | 'kitchen' | 'tv' | 'waitlist'>('phone');

  const handleToggleAutoOrders = () => {
    if (store.isSimulating) {
      store.stopSimulation();
    } else {
      store.startSimulation();
    }
  };

  const handleReset = () => {
    store.resetDemoData();
  };

  const activeOrdersCount = store.orders.filter(
    o => o.status !== 'served' && o.status !== 'cancelled'
  ).length;

  return (
    <div className="min-h-screen bg-cream text-espresso py-6 px-3 sm:px-6">
      <div className="max-w-[1560px] mx-auto space-y-6">
        
        {/* Top Header Strip */}
        <div className="bg-white border border-wheat rounded-[16px] p-4 sm:p-6 shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-hindi text-[15px] text-palak font-bold">
                स्वाद का एक नया रंग, अब लाइव
              </span>
              <span className="text-[12px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-paper border border-wheat text-espresso">
                Multi-Screen Demo
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-espresso">
              Swad ka ek nya rang, ab live.
            </h1>
            <p className="text-[14px] text-clay">
              Live synchronous restaurant operations powered by real-time state sync. Test table ordering, kitchen tickets, TV board, and waitlist together.
            </p>
          </div>

          {/* Action Buttons: Auto Orders & Reset Demo */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto Orders Simulator Toggle */}
            <button
              onClick={handleToggleAutoOrders}
              className={`min-h-[46px] px-4 rounded-[10px] font-bold text-[14px] flex items-center gap-2 transition-all shadow-soft ${
                store.isSimulating
                  ? 'bg-kesar text-[#1F130E] border border-kesar'
                  : 'bg-paper hover:bg-wheat/70 text-espresso border border-wheat'
              }`}
            >
              {store.isSimulating ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>Stop Auto Orders</span>
                  <span className="bg-[#1F130E] text-kesar px-2 py-0.5 rounded-full text-[11px] uppercase tracking-wider font-mono">
                    Demo Mode Active
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-palak" />
                  <span>Start Auto Orders</span>
                  <span className="text-[12px] text-clay font-normal">
                    (Every 6s)
                  </span>
                </>
              )}
            </button>

            {/* Reset Demo Button */}
            <button
              onClick={handleReset}
              className="min-h-[46px] px-4 bg-white hover:bg-paper border border-wheat text-espresso font-bold text-[14px] rounded-[10px] flex items-center gap-2 transition-colors shadow-soft"
              title="Restores sample orders (A101, A102, A103) and 2 waiting guests"
            >
              <RotateCcw className="w-4 h-4 text-mirchi stroke-[2]" />
              <span>Reset Demo</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => store.toggleSound()}
              className={`min-h-[46px] px-3.5 rounded-[10px] border flex items-center gap-1.5 transition-colors shadow-soft ${
                store.soundMuted
                  ? 'bg-red-50 text-mirchi border-red-200'
                  : 'bg-white text-palak border-wheat hover:bg-paper'
              }`}
              title={store.soundMuted ? 'Sound Muted' : 'WebAudio Chime Active'}
            >
              {store.soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[13px] font-bold">{store.soundMuted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>
        </div>

        {/* Mobile View Selector Tabs */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'phone', label: '1. Customer Phone', icon: Smartphone },
            { id: 'kitchen', label: '2. Kitchen KDS', icon: ChefHat },
            { id: 'tv', label: '3. TV Board', icon: Tv },
            { id: 'waitlist', label: '4. Waitlist', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMobileTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-1.5 shrink-0 transition-colors ${
                  activeMobileTab === tab.id
                    ? 'bg-mirchi text-white'
                    : 'bg-white text-clay border border-wheat hover:text-espresso'
                }`}
              >
                <Icon className="w-4 h-4 stroke-[1.75]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop 4-Screen Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Customer Phone Frame (lg:col-span-4) */}
          <div className={`lg:col-span-4 flex flex-col ${activeMobileTab !== 'phone' ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-white border border-wheat rounded-[16px] p-3 shadow-soft mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-mirchi" />
                <span className="font-bold text-[14px]">Screen 1: Customer Phone</span>
              </div>
              <Link
                to="/table/4"
                target="_blank"
                className="text-[12px] text-clay hover:text-mirchi flex items-center gap-1 font-bold"
              >
                <span>Open in Tab</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Reusable Customer Order Panel in Phone Frame */}
            <div className="h-[740px]">
              <CustomerOrderPanel isPhoneFrame />
            </div>
          </div>

          {/* RIGHT COLUMN: Kitchen (Top), TV Board & Waitlist (Bottom) (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Top Right: Kitchen Display System */}
            <div className={`flex flex-col ${activeMobileTab !== 'kitchen' ? 'hidden lg:flex' : 'flex'}`}>
              <div className="bg-white border border-wheat rounded-[16px] p-3 shadow-soft mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-kesar" />
                  <span className="font-bold text-[14px]">Screen 2: Chef Kitchen Display (KDS)</span>
                </div>
                <Link
                  to="/kitchen"
                  target="_blank"
                  className="text-[12px] text-clay hover:text-kesar flex items-center gap-1 font-bold"
                >
                  <span>Open Full-screen</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Reusable Kitchen Display View */}
              <div className="h-[440px]">
                <KitchenDisplayView isPanel />
              </div>
            </div>

            {/* Bottom Row: TV Board & Walk-in Waitlist (Side-by-Side on Desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* TV Board */}
              <div className={`flex flex-col ${activeMobileTab !== 'tv' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="bg-white border border-wheat rounded-[16px] p-3 shadow-soft mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-palak" />
                    <span className="font-bold text-[14px]">Screen 3: TV Waiting Board</span>
                  </div>
                  <Link
                    to="/live"
                    target="_blank"
                    className="text-[12px] text-clay hover:text-palak flex items-center gap-1 font-bold"
                  >
                    <span>Open Full-screen</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="h-[380px]">
                  <LiveBoardView isPanel />
                </div>
              </div>

              {/* Walk-in Waitlist */}
              <div className={`flex flex-col ${activeMobileTab !== 'waitlist' ? 'hidden lg:flex' : 'flex'}`}>
                <div className="bg-white border border-wheat rounded-[16px] p-3 shadow-soft mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-espresso" />
                    <span className="font-bold text-[14px]">Screen 4: Walk-in Waitlist</span>
                  </div>
                  <Link
                    to="/waitlist"
                    target="_blank"
                    className="text-[12px] text-clay hover:text-espresso flex items-center gap-1 font-bold"
                  >
                    <span>Open Desk</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="h-[380px]">
                  <WaitlistView isPanel />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
