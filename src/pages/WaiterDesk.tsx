import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Droplets,
  Receipt,
  UtensilsCrossed,
  CheckCircle2,
  Users,
  ExternalLink,
  RotateCcw,
  Clock,
  Sparkles
} from 'lucide-react';
import { orderStore } from '../lib/orderStore';
import { TableState, TableStatus } from '../types';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const WaiterDesk: React.FC = () => {
  const { success } = useToast();
  const [tables, setTables] = useState<TableState[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableState | null>(null);

  const loadData = () => {
    const list = orderStore.getTables();
    setTables(list);
    if (selectedTable) {
      const refreshed = list.find(t => t.tableNumber === selectedTable.tableNumber);
      if (refreshed) setSelectedTable(refreshed);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = orderStore.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, []);

  const handleClearAlert = (tableNum: number, alertKey: 'waiterCalled' | 'waterRequested' | 'billRequested') => {
    orderStore.setTableAlert(tableNum, alertKey, false);
    loadData();
    success("Alert Cleared", `Table ${tableNum} service alert acknowledged.`);
  };

  const handleSetTableStatus = (tableNum: number, status: TableStatus) => {
    orderStore.updateTableStatus(tableNum, status);
    loadData();
    success("Table Updated", `Table ${tableNum} marked as ${status.replace('_', ' ')}.`);
  };

  const getTableStatusColor = (st: TableStatus) => {
    switch (st) {
      case 'food_ready':
        return 'bg-[#F5B21B]/15 border-[#F5B21B] text-espresso ring-2 ring-[#F5B21B]/40';
      case 'bill_requested':
        return 'bg-[#C62B1F]/10 border-[#C62B1F] text-[#C62B1F] ring-2 ring-[#C62B1F]/30';
      case 'order_placed':
        return 'bg-[#F26A1B]/10 border-[#F26A1B] text-espresso';
      case 'occupied':
        return 'bg-paper border-wheat text-espresso';
      case 'free':
      default:
        return 'bg-white border-wheat text-clay hover:border-clay/40';
    }
  };

  const activeAlerts = tables.filter(t => t.waiterCalled || t.waterRequested || t.billRequested);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-wheat pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[14px] text-palak font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-palak" strokeWidth={1.75} />
            <span>Captain & Service Floor</span>
          </div>
          <h1 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
            30-Table Floor Map & Attendant Desk
          </h1>
          <p className="text-[15px] text-clay">
            Monitor real-time table statuses, acknowledge call-waiter chimes, and coordinate kitchen delivery.
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

      {/* Urgent Table Alerts Bar */}
      {activeAlerts.length > 0 && (
        <div className="p-4 rounded-[14px] bg-[#C62B1F]/10 border border-[#C62B1F]/30 space-y-2">
          <div className="flex items-center gap-2 text-[#C62B1F] font-bold text-[15px]">
            <Bell className="w-5 h-5 animate-bounce" />
            <span>Active Guest Alerts ({activeAlerts.length})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeAlerts.map(t => (
              <div
                key={t.tableNumber}
                className="bg-white border border-wheat rounded-[10px] px-3.5 py-2 flex items-center gap-3 shadow-soft"
              >
                <span className="font-serif font-bold text-[17px] text-espresso">
                  Table {t.tableNumber}
                </span>

                {t.waiterCalled && (
                  <button
                    onClick={() => handleClearAlert(t.tableNumber, 'waiterCalled')}
                    className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-haldi text-espresso flex items-center gap-1"
                  >
                    <span>Staff Called</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {t.waterRequested && (
                  <button
                    onClick={() => handleClearAlert(t.tableNumber, 'waterRequested')}
                    className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-palak text-white flex items-center gap-1"
                  >
                    <span>Water Alert</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}

                {t.billRequested && (
                  <button
                    onClick={() => handleClearAlert(t.tableNumber, 'billRequested')}
                    className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-mirchi text-white flex items-center gap-1"
                  >
                    <span>Bill Alert</span>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Legend Strip */}
      <div className="flex flex-wrap items-center gap-4 text-[14px] text-clay bg-white border border-wheat p-3.5 rounded-[12px] shadow-soft">
        <span className="font-semibold text-espresso">Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-white border border-wheat inline-block" />
          <span>Free</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-paper border border-wheat inline-block" />
          <span>Occupied</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F26A1B] inline-block" />
          <span>Cooking</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#F5B21B] inline-block" />
          <span>Food Ready</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-[#C62B1F] inline-block" />
          <span>Bill Requested</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 30-Table Grid (Columns: 8 on lg) */}
        <div className="lg:col-span-8 bg-white border border-wheat rounded-[16px] p-6 shadow-soft space-y-4">
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {tables.map(tbl => {
              const isSelected = selectedTable?.tableNumber === tbl.tableNumber;
              const hasAlert = tbl.waiterCalled || tbl.waterRequested || tbl.billRequested;
              return (
                <button
                  key={tbl.tableNumber}
                  onClick={() => setSelectedTable(tbl)}
                  className={`p-3 rounded-[12px] border text-center transition-all flex flex-col items-center justify-between min-h-[96px] relative ${getTableStatusColor(tbl.status)} ${
                    isSelected ? 'ring-2 ring-espresso scale-105 shadow-md' : 'shadow-soft'
                  }`}
                >
                  {/* Alert Icon Pill */}
                  {hasAlert && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-mirchi text-white flex items-center justify-center text-[12px] shadow-md animate-bounce">
                      !
                    </span>
                  )}

                  <span className="text-[12px] font-bold text-clay uppercase">
                    T{tbl.tableNumber}
                  </span>

                  <span className="font-serif text-[26px] font-bold leading-none">
                    {tbl.tableNumber}
                  </span>

                  <div className="text-[11px] font-semibold truncate max-w-full">
                    {tbl.currentOrderToken ? (
                      <span className="text-mirchi font-bold font-serif">{tbl.currentOrderToken}</span>
                    ) : (
                      <span className="capitalize">{tbl.status.replace('_', ' ')}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Table Inspector & Action Desk */}
        <div className="lg:col-span-4 space-y-6">
          {selectedTable ? (
            <div className="bg-white border border-wheat rounded-[16px] p-6 shadow-soft space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-wheat">
                <div>
                  <span className="text-[12px] font-semibold text-clay uppercase tracking-wider">
                    Selected Table
                  </span>
                  <h3 className="font-serif text-[28px] font-bold text-espresso">
                    Table {selectedTable.tableNumber}
                  </h3>
                </div>

                <div className="p-2.5 rounded-[10px] bg-paper border border-wheat text-center">
                  <span className="text-[11px] font-bold text-clay block uppercase">STATUS</span>
                  <span className="text-[14px] font-bold text-mirchi capitalize">
                    {selectedTable.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Order Info if active */}
              {selectedTable.currentOrderToken && (
                <div className="p-4 rounded-[12px] bg-paper border border-wheat space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[13px] text-clay">Active Token:</span>
                    <span className="font-serif text-[22px] font-bold text-mirchi">
                      {selectedTable.currentOrderToken}
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link
                      to={`/track/${selectedTable.currentOrderToken}`}
                      className="text-[13px] font-semibold text-mirchi hover:underline"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              )}

              {/* Status Change Buttons */}
              <div className="space-y-2 pt-2 border-t border-wheat">
                <span className="text-[13px] font-semibold text-clay block uppercase tracking-wider">
                  Quick Actions
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSetTableStatus(selectedTable.tableNumber, 'occupied')}
                    className="p-2.5 rounded-[8px] bg-paper hover:bg-wheat/50 border border-wheat text-[14px] font-semibold text-espresso transition-colors"
                  >
                    Seat Guests
                  </button>

                  <button
                    onClick={() => handleSetTableStatus(selectedTable.tableNumber, 'free')}
                    className="p-2.5 rounded-[8px] bg-paper hover:bg-wheat/50 border border-wheat text-[14px] font-semibold text-palak transition-colors"
                  >
                    Free / Clear Table
                  </button>
                </div>

                <div className="pt-2">
                  <Link
                    to={`/table/${selectedTable.tableNumber}`}
                    className="w-full py-2.5 rounded-[8px] bg-mirchi hover:bg-[#A82217] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-soft"
                  >
                    <span>Open Customer Table Order View</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-wheat rounded-[16px] p-8 text-center space-y-3 shadow-soft">
              <Users className="w-8 h-8 text-clay mx-auto" strokeWidth={1.5} />
              <h3 className="font-serif text-[18px] font-bold text-espresso">
                Select a Table
              </h3>
              <p className="text-[14px] text-clay">
                Click any table on the floor map to inspect its orders, acknowledge service flags, or seat guests.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
