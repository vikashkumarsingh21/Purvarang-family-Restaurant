import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ChefHat,
  UtensilsCrossed,
  Phone,
  ArrowLeft,
  RefreshCw,
  BellRing
} from 'lucide-react';
import { orderStore } from '../lib/orderStore';
import { Order, OrderStatus } from '../types';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { Button } from '../components/common/Button';

export const TrackOrder: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = () => {
    if (!orderId) return;
    const found = orderStore.getOrderByIdOrToken(orderId);
    setOrder(found || null);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    const unsubscribe = orderStore.subscribe(() => {
      fetchStatus();
    });
    return unsubscribe;
  }, [orderId]);

  const handleManualRefresh = () => {
    setRefreshing(true);
    fetchStatus();
    setTimeout(() => setRefreshing(false), 400);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4 text-espresso">
        <div className="w-8 h-8 border-2 border-wheat border-t-mirchi rounded-full animate-spin mx-auto" />
        <p className="text-[14px] text-clay">Checking live kitchen order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center space-y-4 text-espresso">
        <h2 className="font-serif text-[24px] font-bold text-espresso">
          Order Not Found
        </h2>
        <p className="text-[15px] text-clay">
          We could not locate an order with ID or Token: <strong>{orderId}</strong>. Please check with our service staff.
        </p>
        <Link to="/menu">
          <Button variant="outline" size="sm">
            Browse Menu
          </Button>
        </Link>
      </div>
    );
  }

  // Map status to 0..3
  const getStepIndex = (st: OrderStatus): number => {
    const s = st.toLowerCase();
    if (s === 'served') return 3;
    if (s === 'ready') return 2;
    if (s === 'cooking' || s === 'preparing') return 1;
    return 0; // new / received
  };

  const currentStep = getStepIndex(order.status);

  const steps = [
    { label: 'Order Received', desc: 'Sent straight to chef screen' },
    { label: 'Active Cooking', desc: 'Tandoor & curries being prepared' },
    { label: 'Ready to Serve', desc: 'Hot, garnished & plated' },
    { label: 'Served / Collected', desc: 'Enjoy your delicious feast' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to={order.tableNumber ? `/table/${order.tableNumber}` : "/menu"}
          className="text-[14px] text-clay hover:text-mirchi flex items-center gap-1.5 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{order.tableNumber ? `Back to Table ${order.tableNumber}` : "Back to Menu"}</span>
        </Link>

        <button
          onClick={handleManualRefresh}
          className="text-[13px] text-clay hover:text-espresso flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] bg-white border border-wheat shadow-soft transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-mirchi' : ''}`} />
          <span>Live Sync</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border border-wheat rounded-[16px] p-6 sm:p-10 space-y-8 shadow-soft">
        
        {/* Token and Heading */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-wheat">
          <div className="space-y-1">
            <span className="text-[13px] font-bold text-palak uppercase tracking-wider">
              {order.orderType === 'dine-in' ? `Table ${order.tableNumber} Order` : 'Takeaway Order'}
            </span>
            <h1 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
              Live Order Status
            </h1>
            <p className="text-[14px] text-clay">
              Order No: <strong className="text-espresso font-semibold">{order.orderNumber}</strong> • Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="p-3 bg-paper border border-wheat rounded-[12px] text-center min-w-28 shrink-0">
            <span className="text-[12px] text-clay uppercase tracking-wider block font-medium">Order Token</span>
            <span className="font-serif text-[32px] font-bold text-mirchi leading-tight">
              {order.token}
            </span>
          </div>
        </div>

        {/* Ready Banner if status === ready */}
        {order.status === 'ready' && (
          <div className="p-4 rounded-[12px] bg-haldi/15 border border-haldi flex items-center gap-3 animate-pulse">
            <BellRing className="w-6 h-6 text-espresso shrink-0" />
            <div>
              <p className="font-serif text-[17px] font-bold text-espresso">Your Order is Ready!</p>
              <p className="text-[14px] text-clay">
                {order.orderType === 'dine-in'
                  ? 'Our attendants are bringing your dishes to the table now.'
                  : 'Please collect your package at the takeaway counter.'}
              </p>
            </div>
          </div>
        )}

        {/* 4-Step Stepper Display */}
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {steps.map((st, idx) => {
              const isPassed = currentStep > idx;
              const isCurrent = currentStep === idx;
              return (
                <div key={st.label} className="text-center space-y-2">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto flex items-center justify-center font-serif text-[16px] sm:text-[18px] font-bold transition-all border ${
                      isPassed
                        ? 'bg-palak text-white border-palak shadow-soft'
                        : isCurrent
                        ? 'bg-mirchi text-white border-mirchi shadow-soft ring-4 ring-mirchi/20'
                        : 'bg-paper text-clay border-wheat'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div>
                    <h3 className={`text-[13px] sm:text-[14px] font-bold ${isCurrent ? 'text-espresso' : 'text-clay'}`}>
                      {st.label}
                    </h3>
                    <p className="text-[12px] text-clay hidden sm:block mt-0.5">
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ordered Dishes Breakdown */}
        <div className="space-y-3 pt-6 border-t border-wheat">
          <h3 className="font-serif text-[18px] font-bold text-espresso">
            Dishes in This Order
          </h3>
          <div className="space-y-2 bg-cream/40 rounded-[12px] p-4 border border-wheat">
            {order.items.map(it => (
              <div key={it.id} className="flex justify-between items-center text-[15px] text-espresso">
                <span>
                  <strong>{it.quantity}x</strong> {it.name} {it.portion ? `(${it.portion})` : ''}
                  {it.notes && <span className="text-[13px] text-clay block italic">"{it.notes}"</span>}
                </span>
                <span className="font-serif font-bold">₹{it.price * it.quantity}</span>
              </div>
            ))}

            <div className="pt-3 mt-3 border-t border-wheat flex justify-between items-baseline font-serif">
              <span className="font-bold text-espresso text-[16px]">Total Paid/Payable</span>
              <span className="text-[22px] font-bold text-mirchi">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Need Help Box */}
        <div className="p-4 rounded-[12px] bg-paper border border-wheat flex items-center justify-between text-[14px]">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-palak" />
            <span>Questions regarding this order?</span>
          </div>
          <a
            href={`tel:${RESTAURANT_CONFIG.phone}`}
            className="text-mirchi hover:underline font-bold"
          >
            Call Reception
          </a>
        </div>

      </div>

    </div>
  );
};
