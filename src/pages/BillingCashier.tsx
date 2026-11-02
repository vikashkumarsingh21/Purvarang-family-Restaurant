import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Receipt,
  CreditCard,
  QrCode,
  Printer,
  CheckCircle2,
  Users,
  Search,
  Percent,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { orderStore } from '../lib/orderStore';
import { Order, TableState } from '../types';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { Button } from '../components/common/Button';
import { useToast } from '../context/ToastContext';

export const BillingCashier: React.FC = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableState[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [splitCount, setSplitCount] = useState<number>(1);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card'>('cash');
  const [settled, setSettled] = useState<boolean>(false);

  const loadData = () => {
    const ords = orderStore.getOrders();
    const tbls = orderStore.getTables();
    setOrders(ords);
    setTables(tbls);

    if (selectedOrder) {
      const refreshed = ords.find(o => o.id === selectedOrder.id);
      if (refreshed) setSelectedOrder(refreshed);
    } else if (ords.length > 0) {
      setSelectedOrder(ords[0]);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = orderStore.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleSelectTable = (tableNum: number) => {
    const match = orders.find(o => o.tableNumber === tableNum && o.status !== 'served');
    if (match) {
      setSelectedOrder(match);
      setSettled(false);
    } else {
      const past = orders.find(o => o.tableNumber === tableNum);
      if (past) {
        setSelectedOrder(past);
        setSettled(false);
      } else {
        error("No Order", `No active order found on Table ${tableNum}`);
      }
    }
  };

  const calculateFinalTotal = () => {
    if (!selectedOrder) return 0;
    const discounted = Math.max(0, selectedOrder.subtotal - discountAmount);
    const gst = Math.round(discounted * (RESTAURANT_CONFIG.billing.gstPercentage / 100));
    return discounted + gst + (selectedOrder.packagingFee || 0);
  };

  const finalTotal = calculateFinalTotal();
  const splitAmount = Math.ceil(finalTotal / splitCount);

  const handleSettleAndPrint = () => {
    if (!selectedOrder) return;
    setSettled(true);
    if (selectedOrder.tableNumber) {
      orderStore.updateTableStatus(selectedOrder.tableNumber, 'free');
    }
    orderStore.updateOrderStatus(selectedOrder.id, 'served');
    loadData();
    success("Bill Settled", `Payment recorded via ${paymentMode.toUpperCase()}. Thermal receipt ready.`);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-wheat pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[14px] text-mirchi font-bold uppercase tracking-wider mb-1">
            <Receipt className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
            <span>Cashier Billing Desk</span>
          </div>
          <h1 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
            POS Billing & Settlement
          </h1>
          <p className="text-[15px] text-clay">
            Settle dine-in table bills, split payments, record cash/UPI, and print thermal 80mm receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/demo"
            className="px-4 py-2 rounded-[10px] bg-white border border-wheat text-[14px] font-semibold text-espresso hover:bg-paper flex items-center gap-1.5 shadow-soft"
          >
            <span>Control Room</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Table Quick Selector Strip */}
      <div className="bg-white border border-wheat rounded-[16px] p-5 shadow-soft space-y-3">
        <span className="text-[13px] font-semibold text-clay uppercase tracking-wider block">
          Select Table for Settlement:
        </span>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(num => {
            const hasOrder = orders.some(o => o.tableNumber === num && o.status !== 'served');
            const isBillReq = tables.find(t => t.tableNumber === num)?.billRequested;
            const isSelected = selectedOrder?.tableNumber === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectTable(num)}
                className={`w-11 h-11 rounded-[8px] text-[14px] font-bold transition-all border flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-espresso text-white border-espresso shadow-md ring-2 ring-espresso/30'
                    : isBillReq
                    ? 'bg-mirchi text-white border-mirchi animate-pulse'
                    : hasOrder
                    ? 'bg-[#F26A1B] text-white border-[#F26A1B]'
                    : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                }`}
              >
                <span>{num}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Order Selector */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="font-serif text-[22px] font-bold text-espresso">
            Active Restaurant Orders ({orders.length})
          </h2>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {orders.map(ord => {
              const isSelected = selectedOrder?.id === ord.id;
              return (
                <div
                  key={ord.id}
                  onClick={() => { setSelectedOrder(ord); setSettled(false); }}
                  className={`p-4 rounded-[14px] border cursor-pointer transition-all shadow-soft ${
                    isSelected
                      ? 'bg-white border-mirchi ring-2 ring-mirchi/20'
                      : 'bg-white border-wheat hover:border-clay/40'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-wheat">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-[20px] font-bold text-mirchi">{ord.token}</span>
                      <span className="text-[14px] font-semibold text-espresso">{ord.source}</span>
                    </div>
                    <span className="font-serif font-bold text-[18px] text-espresso">₹{ord.total}</span>
                  </div>

                  <div className="text-[13px] text-clay mt-2 flex justify-between">
                    <span>{ord.customerName}</span>
                    <span className="capitalize text-palak font-medium">{ord.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Billing Worksheet & Thermal Receipt */}
        <div className="lg:col-span-7 space-y-6">
          {selectedOrder ? (
            <div className="bg-white border border-wheat rounded-[16px] p-6 sm:p-8 shadow-soft space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-wheat">
                <div>
                  <span className="text-[12px] font-bold text-palak uppercase tracking-wider">
                    {selectedOrder.source}
                  </span>
                  <h3 className="font-serif text-[28px] font-bold text-espresso">
                    Token {selectedOrder.token}
                  </h3>
                  <p className="text-[14px] text-clay">
                    Guest: <strong className="text-espresso">{selectedOrder.customerName}</strong> • Phone: +91 {selectedOrder.customerPhone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[12px] text-clay uppercase tracking-wider block">Grand Total</span>
                  <span className="font-serif text-[32px] font-bold text-mirchi">
                    ₹{finalTotal}
                  </span>
                </div>
              </div>

              {/* Items Breakdown Table */}
              <div className="space-y-2">
                <span className="text-[13px] font-semibold text-clay uppercase tracking-wider block">
                  Ordered Dishes
                </span>
                <div className="bg-cream/40 rounded-[12px] p-4 border border-wheat space-y-2 text-[14px]">
                  {selectedOrder.items.map(it => (
                    <div key={it.id} className="flex justify-between items-center text-espresso">
                      <span>{it.quantity}x {it.name} {it.portion ? `(${it.portion})` : ''}</span>
                      <span className="font-serif font-bold">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Calculator Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Split Bill Equally:
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setSplitCount(n)}
                        className={`flex-1 py-2 rounded-[8px] text-[14px] font-bold border transition-all ${
                          splitCount === n
                            ? 'bg-mirchi text-white border-mirchi shadow-soft'
                            : 'bg-paper text-espresso border-wheat'
                        }`}
                      >
                        {n}p
                      </button>
                    ))}
                  </div>
                  {splitCount > 1 && (
                    <p className="text-[13px] text-palak mt-1 font-semibold">
                      ₹{splitAmount} per person
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Special Cashier Discount (₹):
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={e => setDiscountAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3.5 py-2 rounded-[8px] bg-cream/50 border border-wheat text-[14px] text-espresso"
                    placeholder="Discount in INR"
                  />
                </div>
              </div>

              {/* Payment Mode */}
              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-2">
                  Payment Mode Recorded:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cash', label: 'Cash' },
                    { id: 'upi', label: 'UPI / QR' },
                    { id: 'card', label: 'Card' },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id as any)}
                      className={`py-3 rounded-[10px] text-[14px] font-semibold border transition-all ${
                        paymentMode === m.id
                          ? 'bg-espresso text-white border-espresso shadow-soft'
                          : 'bg-paper text-espresso border-wheat'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settle & Print Button */}
              <div className="pt-4 border-t border-wheat flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSettleAndPrint}
                  size="lg"
                  variant="primary"
                  fullWidth
                  leftIcon={<Printer className="w-5 h-5" />}
                >
                  Settle Payment & Print Thermal Receipt
                </Button>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-wheat rounded-[16px] p-12 text-center space-y-3 shadow-soft">
              <Receipt className="w-10 h-10 text-clay mx-auto" />
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Select an Order to Bill
              </h3>
              <p className="text-[14px] text-clay">
                Click a table number or pick an order from the list on the left.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Thermal 80mm Print Receipt (Visible only during printing) */}
      {selectedOrder && (
        <div id="thermal-receipt" className="hidden print:block fixed inset-0 bg-white text-black p-4 font-mono text-[13px] leading-tight max-w-[80mm] mx-auto">
          <div className="text-center pb-2 border-b border-dashed border-black">
            <h1 className="text-[16px] font-bold">PURVARANG FAMILY RESTAURANT</h1>
            <p className="text-[11px]">Tinpulwa Chowk, Lalganj to Hajipur Road</p>
            <p className="text-[11px]">Lalganj, Vaishali, Bihar</p>
            <p className="text-[11px]">Phone: 9693633870</p>
            <p className="text-[11px] mt-1">GSTIN: {RESTAURANT_CONFIG.billing.gstin}</p>
          </div>

          <div className="py-2 border-b border-dashed border-black text-[12px]">
            <div className="flex justify-between">
              <span>Token: <strong>{selectedOrder.token}</strong></span>
              <span>{selectedOrder.source}</span>
            </div>
            <div className="flex justify-between">
              <span>Date: {new Date().toLocaleDateString()}</span>
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div>Guest: {selectedOrder.customerName}</div>
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1">
            <div className="flex justify-between font-bold border-b border-black pb-1">
              <span>Item</span>
              <span>Qty</span>
              <span>Amount</span>
            </div>
            {selectedOrder.items.map(it => (
              <div key={it.id} className="flex justify-between">
                <span className="truncate max-w-[45mm]">{it.name} {it.portion ? `(${it.portion[0]})` : ''}</span>
                <span>{it.quantity}</span>
                <span>₹{it.price * it.quantity}</span>
              </div>
            ))}
          </div>

          <div className="py-2 border-b border-dashed border-black space-y-1 text-[12px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{selectedOrder.subtotal}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (5%):</span>
              <span>₹{Math.round((selectedOrder.subtotal - discountAmount) * 0.05)}</span>
            </div>
            <div className="flex justify-between text-[15px] font-bold pt-1 border-t border-black">
              <span>TOTAL PAID:</span>
              <span>₹{finalTotal}</span>
            </div>
            <div className="text-[11px] pt-1">
              Payment: {paymentMode.toUpperCase()}
            </div>
          </div>

          <div className="text-center pt-3 text-[11px] space-y-1">
            <p>Thank You For Dining With Us!</p>
            <p className="font-bold">स्वाद का एक नया रंग</p>
            <p>Visit Again • Purvarang Lalganj</p>
          </div>
        </div>
      )}

    </div>
  );
};
