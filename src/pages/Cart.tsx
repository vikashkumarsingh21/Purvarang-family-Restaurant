import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Tag,
  ArrowRight,
  Clock,
  QrCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { orderStore } from '../lib/orderStore';
import { ordersStore } from '../store/orders';
import { mockApi } from '../lib/mockApi';
import { QuantityStepper } from '../components/common/QuantityStepper';
import { Button } from '../components/common/Button';
import { DietaryBadge } from '../components/common/Badge';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    itemCount,
    subtotal,
    gst,
    packagingFee,
    discount,
    total,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    couponCode,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    updateNotes,
    removeItem,
    clearCart,
  } = useCart();
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('30 mins from now');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [inputCoupon, setInputCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'restaurant' | 'upi'>('restaurant');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    "30 mins from now",
    "45 mins from now",
    "1 hour from now",
    "Today 07:30 PM",
    "Today 08:30 PM",
    "Today 09:30 PM",
  ];

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      success("Coupon Applied", res.message);
      setInputCoupon('');
    } else {
      error("Coupon Error", res.message);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      error("Name Required", "Please enter your full name.");
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      error("Valid Phone Required", "Please enter a valid 10-digit mobile number for order updates.");
      return;
    }
    if (orderType === 'dine-in' && !tableNumber) {
      error("Table Number Required", "Please select your table number for dine-in delivery.");
      return;
    }

    if (paymentMethod === 'upi' && !showUpiModal) {
      setShowUpiModal(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const placedOrder = orderStore.createOrder({
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        source: orderType === 'dine-in' ? `Table ${tableNumber}` : 'Takeaway',
        orderType,
        tableNumber: orderType === 'dine-in' ? (tableNumber || undefined) : undefined,
        pickupTime: orderType === 'pre-order' ? pickupTime : undefined,
        items,
        subtotal,
        gst,
        packagingFee,
        discount,
        couponCode: couponCode || undefined,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'upi' ? 'completed' : 'pending',
        specialInstructions: specialInstructions.trim() || undefined,
        estimatedMinutes: 18,
      });

      // Synchronize to the shared orders store
      try {
        ordersStore.placeOrder({
          table: orderType === 'dine-in' ? (tableNumber || 1) : null,
          source: orderType === 'dine-in' ? 'dine' : 'pickup',
          items: items.map(it => ({
            name: it.name,
            qty: it.quantity,
            veg: it.type === 'veg',
            price: it.price,
            note: it.notes,
            categorySlug: it.station
          }))
        });
      } catch (err) {
        console.warn("ordersStore sync error:", err);
      }

      // Also sync mockApi for backward compatibility
      try {
        await mockApi.placeOrder({
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          orderType,
          tableNumber: orderType === 'dine-in' ? (tableNumber || undefined) : undefined,
          pickupTime: orderType === 'pre-order' ? pickupTime : undefined,
          items,
          subtotal,
          gst,
          packagingFee,
          discount,
          couponCode: couponCode || undefined,
          total,
          paymentMethod,
          specialInstructions: specialInstructions.trim() || undefined,
        });
      } catch (e) {
        // Safe fallback
      }

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C62B1F', '#F5B21B', '#1E4A33'],
        });
      } catch (err) {
        console.warn("Confetti error", err);
      }

      success("Order Placed Successfully", `Token: ${placedOrder.token}`);
      clearCart();
      navigate(`/track/${placedOrder.token}`);
    } catch (err) {
      error("Order Failed", "Unable to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setShowUpiModal(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 text-espresso">
        <div className="w-16 h-16 rounded-[12px] bg-white border border-wheat flex items-center justify-center text-clay mx-auto shadow-soft">
          <ShoppingBag className="w-8 h-8 text-mirchi" strokeWidth={1.75} />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
            Your Order Cart is Empty
          </h2>
          <p className="text-[16px] text-clay max-w-sm mx-auto leading-relaxed">
            You haven't added any dishes yet. Explore our hand-crafted curries, tandoor starters, and drinks.
          </p>
        </div>
        <div className="pt-2">
          <Link to="/menu">
            <Button size="lg" variant="primary" leftIcon={<ShoppingBag className="w-5 h-5" />}>
              Explore Menu & Add Dishes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-espresso">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-wheat pb-5 mb-8">
        <div>
          <h1 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
            Cart & Order Checkout
          </h1>
          <p className="text-[15px] text-clay mt-1">
            Review items, customize instructions, and place your order.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-[14px] text-mirchi font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-[8px] bg-white border border-wheat shadow-soft hover:bg-paper transition-all"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Editable Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Order Type Switch */}
          <div className="bg-white border border-wheat rounded-[16px] p-5 shadow-soft">
            <label className="text-[14px] font-semibold text-clay uppercase tracking-wider block mb-3">
              Select Dining Mode:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('dine-in')}
                className={`py-3 px-4 rounded-[10px] border text-[15px] font-semibold transition-all flex flex-col items-center gap-1 ${
                  orderType === 'dine-in'
                    ? 'bg-mirchi text-white border-mirchi shadow-soft'
                    : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                }`}
              >
                <span>Dine-in at Table</span>
                <span className={`text-[13px] font-normal ${orderType === 'dine-in' ? 'text-white/90' : 'text-clay'}`}>
                  Served at your table
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pre-order')}
                className={`py-3 px-4 rounded-[10px] border text-[15px] font-semibold transition-all flex flex-col items-center gap-1 ${
                  orderType === 'pre-order'
                    ? 'bg-mirchi text-white border-mirchi shadow-soft'
                    : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                }`}
              >
                <span>Takeaway / Pickup</span>
                <span className={`text-[13px] font-normal ${orderType === 'pre-order' ? 'text-white/90' : 'text-clay'}`}>
                  Packed for takeaway
                </span>
              </button>
            </div>

            {/* Table Number or Pickup Time Selection */}
            <div className="mt-4 pt-4 border-t border-wheat">
              {orderType === 'dine-in' ? (
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-2">
                    Select Your Table Number:
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 no-scrollbar">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setTableNumber(num)}
                        className={`w-10 h-10 rounded-[8px] text-[14px] font-semibold transition-all border ${
                          tableNumber === num
                            ? 'bg-mirchi text-white border-mirchi shadow-soft'
                            : 'bg-white text-espresso border-wheat hover:bg-paper'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  {tableNumber && (
                    <p className="text-[14px] text-palak mt-2 font-medium">
                      Table {tableNumber} selected.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
                    <span>Estimated Pickup Time:</span>
                  </label>
                  <select
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] font-medium text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  >
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            <h3 className="font-serif text-[20px] font-bold text-espresso">
              Ordered Items ({itemCount})
            </h3>

            {items.map(item => (
              <div
                key={item.id}
                className="bg-white border border-wheat rounded-[14px] p-4 shadow-soft transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <DietaryBadge type={item.type} size="sm" />
                      <h4 className="font-serif text-[18px] font-bold text-espresso leading-snug">
                        {item.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 text-[14px] text-clay">
                      <span>₹{item.price} each</span>
                      {item.portion && (
                        <span className="text-mirchi font-semibold">
                          Portion: {item.portion}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <QuantityStepper
                      quantity={item.quantity}
                      onIncrement={() => updateQuantity(item.id, 1)}
                      onDecrement={() => updateQuantity(item.id, -1)}
                      size="sm"
                    />
                    <span className="font-serif text-[18px] font-bold text-espresso min-w-14 text-right">
                      ₹{item.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-clay hover:text-mirchi transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                {/* Optional Item Instruction Note */}
                <div className="mt-3 pt-3 border-t border-wheat">
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={e => updateNotes(item.id, e.target.value)}
                    placeholder="Cooking note (e.g. less spicy, crispy naan, no green chili)..."
                    className="w-full px-3 py-1.5 rounded-[8px] bg-cream/40 border border-wheat text-[14px] text-espresso placeholder:text-clay/60 focus:outline-none focus:border-mirchi"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Box */}
          <div className="bg-white border border-wheat rounded-[14px] p-4 shadow-soft">
            <h4 className="text-[14px] font-semibold text-clay uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
              <span>Apply Coupon / Voucher</span>
            </h4>

            {couponCode ? (
              <div className="flex items-center justify-between p-3 rounded-[10px] bg-palak/5 border border-palak/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-palak" strokeWidth={2} />
                  <span className="text-[14px] font-bold text-palak">{couponCode} Applied</span>
                  <span className="text-[14px] text-clay">(-₹{discount})</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-[14px] text-mirchi hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={e => setInputCoupon(e.target.value)}
                  placeholder="Enter code (e.g. PURVA20, FAMILY100)"
                  className="flex-1 px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[14px] text-espresso uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-mirchi hover:bg-[#A82217] text-white text-[14px] font-semibold rounded-[10px] transition-colors shadow-soft"
                >
                  Apply
                </button>
              </form>
            )}

            <div className="mt-2 text-[13px] text-clay flex flex-wrap gap-2">
              <span>Demo coupons:</span>
              <button
                type="button"
                onClick={() => applyCoupon('PURVA20')}
                className="text-mirchi underline font-semibold"
              >
                PURVA20
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => applyCoupon('FAMILY100')}
                className="text-mirchi underline font-semibold"
              >
                FAMILY100
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Customer Details, Bill Breakdown & Checkout */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white border border-wheat rounded-[16px] p-5 space-y-4 shadow-soft">
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Customer Details
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Your Full Name <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Mobile Number (10 digits) <span className="text-mirchi">*</span>
                  </label>
                  <div className="flex">
                    <span className="px-3.5 py-2.5 rounded-l-[10px] bg-paper border border-r-0 border-wheat text-[14px] font-semibold text-espresso flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="9693633870"
                      required
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 rounded-r-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                    />
                  </div>
                  <p className="text-[13px] text-clay mt-1">
                    Order token updates will be shared for this number.
                  </p>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Special Order Note (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={e => setSpecialInstructions(e.target.value)}
                    placeholder="Any specific instructions for kitchen..."
                    rows={2}
                    className="w-full px-3.5 py-2 rounded-[10px] bg-cream/50 border border-wheat text-[14px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>
              </div>
            </div>

            {/* Payment Choice */}
            <div className="bg-white border border-wheat rounded-[16px] p-5 space-y-3 shadow-soft">
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Payment Method
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('restaurant')}
                  className={`p-3 rounded-[10px] border text-[14px] font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'restaurant'
                      ? 'bg-mirchi text-white border-mirchi shadow-soft'
                      : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                  }`}
                >
                  <span>Pay at Counter</span>
                  <span className={`text-[12px] font-normal ${paymentMethod === 'restaurant' ? 'text-white/90' : 'text-clay'}`}>
                    Cash or UPI upon serve
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-[10px] border text-[14px] font-semibold flex flex-col items-center gap-1 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-mirchi text-white border-mirchi shadow-soft'
                      : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                  }`}
                >
                  <span>Instant UPI</span>
                  <span className={`text-[12px] font-normal ${paymentMethod === 'upi' ? 'text-white/90' : 'text-clay'}`}>
                    QR / GPay / PhonePe
                  </span>
                </button>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-white border border-wheat rounded-[16px] p-5 space-y-3 shadow-soft">
              <h3 className="font-serif text-[20px] font-bold text-espresso pb-2 border-b border-wheat">
                Billing Summary
              </h3>

              <div className="space-y-2.5 text-[14px] text-clay">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-serif text-espresso font-bold">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-palak font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>GST ({RESTAURANT_CONFIG.billing.gstPercentage}%)</span>
                  <span className="font-serif text-espresso">₹{gst}</span>
                </div>

                {packagingFee > 0 && (
                  <div className="flex justify-between">
                    <span>Packaging Charge</span>
                    <span className="font-serif text-espresso">₹{packagingFee}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-wheat flex justify-between items-baseline">
                  <span className="font-serif text-[18px] font-bold text-espresso">Total Amount</span>
                  <span className="font-serif text-[26px] font-bold text-mirchi">₹{total}</span>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="mt-4"
              >
                Send Order to Kitchen
              </Button>

              <p className="text-[13px] text-center text-clay">
                Orders are sent directly to the chef's display screen.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* UPI QR Payment Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso/60 backdrop-blur-xs">
          <div className="bg-white border border-wheat rounded-[16px] p-6 max-w-sm w-full text-center space-y-4 shadow-soft-lg animate-slide-up text-espresso">
            <div className="w-12 h-12 rounded-full bg-paper border border-wheat flex items-center justify-center text-mirchi mx-auto">
              <QrCode className="w-6 h-6" strokeWidth={1.75} />
            </div>

            <div>
              <h3 className="font-serif text-[20px] font-bold text-espresso">Scan UPI QR Code</h3>
              <p className="text-[14px] text-clay mt-1">
                Scan with PhonePe, Google Pay, or Paytm to pay <strong className="text-mirchi font-bold">₹{total}</strong>.
              </p>
            </div>

            {/* UPI QR Graphic */}
            <div className="p-3 bg-cream/50 rounded-[12px] border border-wheat inline-block mx-auto">
              <div className="w-44 h-44 bg-white rounded-[8px] p-2 flex flex-col items-center justify-center text-espresso border border-wheat">
                <QrCode className="w-28 h-28 text-espresso" strokeWidth={1.75} />
                <span className="text-[11px] font-semibold tracking-wider uppercase mt-1 text-clay">
                  UPI: 9693633870@upi
                </span>
              </div>
            </div>

            <p className="text-[13px] text-clay">
              Demo Simulation: Click "Payment Completed" to dispatch to kitchen.
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setShowUpiModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleCheckout}
                isLoading={isSubmitting}
              >
                Payment Completed
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
