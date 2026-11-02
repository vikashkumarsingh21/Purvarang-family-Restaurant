import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  CalendarDays,
  QrCode,
  UtensilsCrossed,
  Printer,
  Edit2,
  Check,
  X,
  Search,
  RefreshCw,
  LogOut,
  Lock,
  ArrowRight,
  ExternalLink,
  ChefHat,
  Tv,
  Users,
  Receipt
} from 'lucide-react';
import QRCode from 'qrcode';
import { storage } from '../lib/storage';
import { mockApi } from '../lib/mockApi';
import { Order, Booking, OrderStatus } from '../types';
import { MENU_ITEMS, MenuItem } from '../data/menu';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const Admin: React.FC = () => {
  const { success, info } = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('purvarang_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'menu' | 'qr' | 'analytics'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState(mockApi.getAdminStats());
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');
  const [menuSearch, setMenuSearch] = useState('');

  const [qrCodes, setQrCodes] = useState<Record<number, string>>({});
  const [qrGenerating, setQrGenerating] = useState(false);

  const loadData = () => {
    setOrders(storage.getOrders());
    setBookings(storage.getBookings());
    setStats(mockApi.getAdminStats());

    const overrides = storage.getMenuOverrides();
    const computed = MENU_ITEMS.map(item => {
      const over = overrides[item.id];
      if (over) {
        return {
          ...item,
          price: over.price !== undefined ? over.price : item.price,
          isAvailable: over.isAvailable !== undefined ? over.isAvailable : item.isAvailable,
        };
      }
      return item;
    });
    setMenuList(computed);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const generateAllQrCodes = async () => {
    setQrGenerating(true);
    const origin = window.location.origin;
    const generated: Record<number, string> = {};

    try {
      for (let i = 1; i <= RESTAURANT_CONFIG.tables.total; i++) {
        const tableUrl = `${origin}/table/${i}`;
        const dataUrl = await QRCode.toDataURL(tableUrl, {
          width: 300,
          margin: 1.5,
          color: {
            dark: '#2B1A12',
            light: '#FFFFFF',
          },
        });
        generated[i] = dataUrl;
      }
      setQrCodes(generated);
      success("30 Table QR Codes Generated", "Ready for preview and high-resolution printout.");
    } catch (err) {
      console.error(err);
    } finally {
      setQrGenerating(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim().length > 0) {
      setIsAuthenticated(true);
      sessionStorage.setItem('purvarang_admin_auth', 'true');
      success("Welcome to Owner Dashboard", "Authenticated as Purvarang Administrator.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('purvarang_admin_auth');
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    storage.updateOrderStatus(orderId, newStatus);
    loadData();
    info("Order Updated", `Status changed to ${newStatus}`);
  };

  const handleBookingStatus = (id: string, status: Booking['status']) => {
    storage.updateBookingStatus(id, status);
    loadData();
    success("Booking Updated", `Reservation marked as ${status}.`);
  };

  const handleToggleMenuAvailability = (dishId: string, currentVal: boolean) => {
    storage.saveMenuOverride(dishId, { isAvailable: !currentVal });
    loadData();
    info("Menu Updated", `Dish marked as ${!currentVal ? 'Available' : 'Unavailable'}`);
  };

  const handleSavePrice = (dishId: string) => {
    const parsed = parseInt(tempPrice, 10);
    if (!isNaN(parsed) && parsed > 0) {
      storage.saveMenuOverride(dishId, { price: parsed });
      loadData();
      setEditingPriceId(null);
      success("Price Updated", `Dish price updated to ₹${parsed}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-espresso">
        <div className="bg-white border border-wheat rounded-[16px] p-8 space-y-6 shadow-soft text-center">
          <div className="w-14 h-14 rounded-full bg-paper border border-wheat flex items-center justify-center text-mirchi mx-auto shadow-soft">
            <Lock className="w-6 h-6" strokeWidth={1.75} />
          </div>

          <div>
            <h1 className="font-serif text-[26px] font-bold text-espresso">
              Restaurant Owner Portal
            </h1>
            <p className="text-[14px] text-clay mt-1">
              Admin console for Purvarang management & live order monitoring.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[14px] font-semibold text-espresso block mb-1">
                Enter Admin Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Enter password (e.g. admin)"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
              />
              <p className="text-[13px] text-mirchi font-medium mt-1">
                Demo hint: type <strong>admin</strong> or tap 1-Click Login below.
              </p>
            </div>

            <Button type="submit" size="md" variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
              Login to Admin Dashboard
            </Button>

            <button
              type="button"
              onClick={() => {
                setIsAuthenticated(true);
                sessionStorage.setItem('purvarang_admin_auth', 'true');
              }}
              className="w-full py-2.5 rounded-[10px] bg-paper text-espresso border border-wheat text-[14px] font-semibold hover:bg-wheat/50 transition-colors"
            >
              1-Click Instant Demo Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-wheat pb-5">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-palak" strokeWidth={2} />
            <h1 className="font-serif text-[clamp(26px,3vw,34px)] font-bold text-espresso">
              Purvarang Management Console
            </h1>
          </div>
          <p className="text-[14px] text-clay mt-1">
            Real-time kitchen order board, table bookings, menu price controls, and table QR code generator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/demo"
            className="px-4 py-2 rounded-[10px] bg-mirchi text-white text-[14px] font-semibold flex items-center gap-1.5 shadow-soft hover:bg-[#A82217] transition-colors"
          >
            <span>Live Control Room</span>
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            onClick={loadData}
            className="px-3.5 py-2 rounded-[10px] bg-white border border-wheat text-[14px] text-espresso font-semibold flex items-center gap-1.5 shadow-soft hover:bg-paper transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-3.5 py-2 rounded-[10px] bg-white text-[14px] text-mirchi border border-wheat font-semibold flex items-center gap-1.5 shadow-soft hover:bg-paper transition-colors"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-wheat rounded-[14px] p-5 space-y-1 shadow-soft">
          <p className="text-[13px] text-clay font-bold uppercase tracking-wider">Total Sales Today</p>
          <p className="font-serif text-[28px] font-bold text-mirchi">
            ₹{stats.todaySales || stats.totalSales}
          </p>
          <p className="text-[13px] text-palak font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Active dining operations</span>
          </p>
        </div>

        <div className="bg-white border border-wheat rounded-[14px] p-5 space-y-1 shadow-soft">
          <p className="text-[13px] text-clay font-bold uppercase tracking-wider">Active Kitchen Orders</p>
          <p className="font-serif text-[28px] font-bold text-espresso">
            {stats.activeOrdersCount}
          </p>
          <p className="text-[13px] text-clay">
            {stats.newCount} New • {stats.preparingCount} Cooking • {stats.readyCount} Ready
          </p>
        </div>

        <div className="bg-white border border-wheat rounded-[14px] p-5 space-y-1 shadow-soft">
          <p className="text-[13px] text-clay font-bold uppercase tracking-wider">Table Reservations</p>
          <p className="font-serif text-[28px] font-bold text-espresso">
            {stats.totalBookings}
          </p>
          <p className="text-[13px] text-clay">
            Confirmed family reservations
          </p>
        </div>

        <div className="bg-white border border-wheat rounded-[14px] p-5 space-y-1 shadow-soft">
          <p className="text-[13px] text-clay font-bold uppercase tracking-wider">Active Tables</p>
          <p className="font-serif text-[28px] font-bold text-palak">
            30 Tables
          </p>
          <p className="text-[13px] text-clay">
            Full QR mobile ordering
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-wheat gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
        {[
          { id: 'orders', label: 'Live Orders Kanban', count: stats.activeOrdersCount },
          { id: 'bookings', label: 'Table Bookings', count: stats.totalBookings },
          { id: 'menu', label: 'Menu Manager (Price & Stock)' },
          { id: 'qr', label: 'Printable Table QR Generator' },
          { id: 'analytics', label: 'Sales & Trends' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-t-[10px] text-[14px] font-semibold transition-all whitespace-nowrap flex items-center gap-2 border-b-2 ${
              activeTab === tab.id
                ? 'border-mirchi text-mirchi bg-white shadow-xs'
                : 'border-transparent text-clay hover:text-espresso'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${activeTab === tab.id ? 'bg-mirchi text-white' : 'bg-paper text-clay'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: KANBAN LIVE ORDER BOARD */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <p className="text-[14px] text-clay">
            Click status buttons to advance orders as chefs prepare and serve dishes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(['Received', 'Preparing', 'Ready', 'Served'] as OrderStatus[]).map(columnStatus => {
              const columnOrders = orders.filter(o => o.status === columnStatus);
              return (
                <div
                  key={columnStatus}
                  className="bg-white border border-wheat rounded-[16px] p-4 flex flex-col h-[650px] shadow-soft"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-wheat mb-3">
                    <span className="font-serif text-[17px] font-bold text-espresso">
                      {columnStatus}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-paper text-[13px] font-bold text-mirchi">
                      {columnOrders.length}
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {columnOrders.map(ord => (
                      <div
                        key={ord.id}
                        className="bg-cream/40 border border-wheat rounded-[12px] p-3.5 space-y-2 text-[14px] shadow-xs"
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="font-serif font-bold text-mirchi text-[16px]">{ord.orderNumber}</span>
                          <span className="text-[12px] text-clay font-semibold">
                            {ord.orderType === 'dine-in' ? `Table ${ord.tableNumber}` : 'Takeaway'}
                          </span>
                        </div>

                        <p className="font-semibold text-espresso">{ord.customerName}</p>

                        <div className="space-y-1 pt-1 border-t border-wheat text-clay text-[13px]">
                          {ord.items.map(it => (
                            <div key={it.id} className="flex justify-between">
                              <span>{it.quantity}x {it.name} {it.portion ? `(${it.portion})` : ''}</span>
                              <span className="font-bold text-espresso">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-wheat flex justify-between items-center text-[13px]">
                          <span className="font-bold text-espresso">Total: ₹{ord.total}</span>
                          <span className="text-[11px] text-palak uppercase font-bold">
                            {ord.paymentMethod}
                          </span>
                        </div>

                        <div className="pt-2 flex flex-wrap gap-1">
                          {columnStatus === 'Received' && (
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Preparing')}
                              className="flex-1 py-1.5 bg-kesar text-white rounded-[6px] text-[12px] font-semibold"
                            >
                              Fire to Prep →
                            </button>
                          )}
                          {columnStatus === 'Preparing' && (
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Ready')}
                              className="flex-1 py-1.5 bg-mirchi text-white rounded-[6px] text-[12px] font-semibold"
                            >
                              Mark Ready →
                            </button>
                          )}
                          {columnStatus === 'Ready' && (
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Served')}
                              className="flex-1 py-1.5 bg-palak text-white rounded-[6px] text-[12px] font-semibold"
                            >
                              Mark Served
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TABLE BOOKINGS LIST */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
          <div className="p-4 border-b border-wheat flex justify-between items-center">
            <h2 className="font-serif text-[18px] font-bold text-espresso">
              Active Reservations & Banquet Inquiries
            </h2>
            <span className="text-[14px] text-clay font-semibold">Total: {bookings.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-cream/60 text-clay uppercase tracking-wider text-[12px] border-b border-wheat">
                <tr>
                  <th className="p-3.5">Booking ID</th>
                  <th className="p-3.5">Guest Name</th>
                  <th className="p-3.5">Date & Slot</th>
                  <th className="p-3.5">Guests & Hall</th>
                  <th className="p-3.5">Contact</th>
                  <th className="p-3.5">Occasion / Notes</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-wheat">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-cream/40 transition-colors">
                    <td className="p-3.5 font-bold text-mirchi">{b.bookingNumber}</td>
                    <td className="p-3.5 font-bold text-espresso">{b.customerName}</td>
                    <td className="p-3.5">{b.date} • {b.timeSlot}</td>
                    <td className="p-3.5">{b.guestCount} Guests • {b.seatingPreference}</td>
                    <td className="p-3.5">+91 {b.customerPhone}</td>
                    <td className="p-3.5 max-w-xs truncate text-clay">
                      {b.occasion} {b.specialRequests ? `(${b.specialRequests})` : ''}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold ${
                        b.status === 'Confirmed' ? 'bg-palak/10 text-palak border border-palak/30' : 'bg-mirchi/10 text-mirchi border border-mirchi/30'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {b.status !== 'Confirmed' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'Confirmed')}
                          className="px-3 py-1 rounded-[6px] bg-palak text-white text-[12px] font-semibold"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status !== 'Cancelled' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'Cancelled')}
                          className="px-3 py-1 rounded-[6px] bg-paper text-mirchi border border-wheat text-[12px] font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MENU MANAGER */}
      {activeTab === 'menu' && (
        <div className="bg-white border border-wheat rounded-[16px] p-5 space-y-4 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-[20px] font-bold text-espresso">
                Menu Item Availability & Pricing
              </h2>
              <p className="text-[14px] text-clay">
                Toggle dish availability or update live prices instantly.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-clay absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={menuSearch}
                onChange={e => setMenuSearch(e.target.value)}
                placeholder="Search dish to edit..."
                className="w-full pl-9 pr-3 py-2 rounded-[8px] bg-cream/50 border border-wheat text-[14px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-cream/60 text-clay uppercase tracking-wider text-[12px] sticky top-0 border-b border-wheat">
                <tr>
                  <th className="p-3">Dish Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">In Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-wheat">
                {menuList
                  .filter(d => !menuSearch || d.name.toLowerCase().includes(menuSearch.toLowerCase()))
                  .map(dish => (
                    <tr key={dish.id} className="hover:bg-cream/40">
                      <td className="p-3 font-semibold text-espresso">
                        {dish.name}
                        {dish.hindiName && <span className="text-[12px] font-hindi text-clay ml-1.5 font-normal">({dish.hindiName})</span>}
                      </td>
                      <td className="p-3 text-clay">{dish.category}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[12px] font-semibold ${
                          dish.type === 'veg' ? 'bg-palak/10 text-palak border border-palak/30' : 'bg-mirchi/10 text-mirchi border border-mirchi/30'
                        }`}>
                          {dish.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-serif font-bold text-mirchi">
                        {editingPriceId === dish.id ? (
                          <div className="flex items-center gap-1">
                            <span>₹</span>
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={e => setTempPrice(e.target.value)}
                              className="w-20 px-2 py-1 rounded-[6px] bg-cream border border-wheat text-espresso text-[14px]"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(dish.id)}
                              className="p-1 text-palak hover:bg-cream rounded-[4px]"
                            >
                              <Check className="w-4 h-4" strokeWidth={2} />
                            </button>
                            <button
                              onClick={() => setEditingPriceId(null)}
                              className="p-1 text-mirchi hover:bg-cream rounded-[4px]"
                            >
                              <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                          </div>
                        ) : (
                          <span>{dish.price !== null ? `₹${dish.price}` : 'Staff'}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleMenuAvailability(dish.id, dish.isAvailable)}
                          className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${
                            dish.isAvailable
                              ? 'bg-palak/10 text-palak border border-palak/30'
                              : 'bg-mirchi/10 text-mirchi border border-mirchi/30'
                          }`}
                        >
                          {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setEditingPriceId(dish.id);
                            setTempPrice(String(dish.price || 0));
                          }}
                          className="px-3 py-1 rounded-[8px] bg-paper hover:bg-wheat/50 text-espresso border border-wheat text-[12px] font-semibold"
                        >
                          Edit Price
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: QR GENERATOR */}
      {activeTab === 'qr' && (
        <div className="space-y-6">
          <div className="bg-white border border-wheat rounded-[16px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-soft">
            <div>
              <h2 className="font-serif text-[22px] font-bold text-espresso flex items-center gap-2">
                <QrCode className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
                <span>QR Table Stands Generator (Tables 1 to 30)</span>
              </h2>
              <p className="text-[14px] text-clay mt-1 max-w-xl">
                Generate high-resolution printable table stands for all 30 dining tables. Guests scan with their mobile camera to place dine-in orders directly.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="md"
                variant="primary"
                onClick={generateAllQrCodes}
                isLoading={qrGenerating}
                leftIcon={<QrCode className="w-4 h-4" />}
              >
                Generate All 30 QR Codes
              </Button>

              {Object.keys(qrCodes).length > 0 && (
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => window.print()}
                  leftIcon={<Printer className="w-4 h-4" />}
                >
                  Print QR Stands
                </Button>
              )}
            </div>
          </div>

          {Object.keys(qrCodes).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: RESTAURANT_CONFIG.tables.total }, (_, i) => i + 1).map(tableNum => (
                <div
                  key={tableNum}
                  className="bg-white rounded-[14px] p-4 text-center border border-wheat shadow-soft space-y-2"
                >
                  <p className="font-serif text-[12px] font-bold tracking-widest uppercase text-clay">
                    PURVARANG
                  </p>
                  <div className="bg-paper text-espresso font-bold text-[14px] py-0.5 px-3 rounded-full border border-wheat inline-block">
                    TABLE {tableNum}
                  </div>

                  <div className="p-1 bg-cream/30 border border-wheat rounded-[8px] mx-auto w-36 h-36 flex items-center justify-center">
                    {qrCodes[tableNum] ? (
                      <img
                        src={qrCodes[tableNum]}
                        alt={`QR Code Table ${tableNum}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-6 h-6 border-2 border-clay border-t-espresso rounded-full animate-spin" />
                    )}
                  </div>

                  <p className="text-[12px] text-espresso font-bold">
                    Scan with Camera to Order
                  </p>
                  <p className="text-[11px] text-clay">
                    Tinpulwa Chowk, Lalganj
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-wheat rounded-[16px] space-y-3 shadow-soft">
              <QrCode className="w-12 h-12 text-mirchi mx-auto opacity-70" strokeWidth={1.75} />
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                QR Codes Not Generated Yet
              </h3>
              <p className="text-[14px] text-clay max-w-sm mx-auto">
                Click "Generate All 30 QR Codes" above to create printable stands for every table.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white border border-wheat rounded-[16px] p-6 space-y-4 shadow-soft">
            <h2 className="font-serif text-[22px] font-bold text-espresso flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
              <span>Weekly Revenue Trend</span>
            </h2>

            <div className="pt-4">
              <div className="flex items-end justify-between gap-3 h-56 pt-6 border-b border-wheat px-2 sm:px-6 bg-cream/30 rounded-[12px]">
                {stats.salesChartData.map(item => {
                  const maxRev = 35000;
                  const barHeight = (item.revenue / maxRev) * 100;
                  return (
                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[12px] font-bold text-mirchi opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{item.revenue}
                      </span>
                      <div
                        className="w-full max-w-[40px] bg-kesar/80 rounded-t-[6px] transition-all duration-300 group-hover:bg-mirchi"
                        style={{ height: `${barHeight}%` }}
                      />
                      <span className="text-[13px] text-espresso font-semibold pb-2">{item.day}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-3 text-[14px] text-clay">
                <span>Peak revenue: Weekends (family celebrations & dining feasts)</span>
                <span>Average order value: ₹680</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
