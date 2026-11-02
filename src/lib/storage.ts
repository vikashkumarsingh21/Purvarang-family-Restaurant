import { Order, Booking, Review, CartItem } from '../types';
import { MENU_ITEMS } from '../data/menu';

const STORAGE_KEYS = {
  CART: 'purvarang_cart',
  FAVORITES: 'purvarang_favorites',
  RECENT_ORDERS: 'purvarang_recent_orders',
  ALL_ORDERS: 'purvarang_orders_store',
  BOOKINGS: 'purvarang_bookings_store',
  REVIEWS: 'purvarang_reviews_store',
  TABLE_SESSIONS: 'purvarang_table_sessions',
  THEME: 'purvarang_theme',
  LANG: 'purvarang_lang',
  MENU_OVERRIDES: 'purvarang_menu_overrides',
};

// Initial Seed Reviews for authentic social proof
const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-1",
    customerName: "Rakesh Ranjan Singh",
    rating: 5,
    comment: "Best family restaurant on Lalganj Hajipur highway. The Chicken Dehati is authentic desi style with whole garlic pods. Very clean ambiance and courteous staff.",
    date: "2026-10-24",
    dishRecommended: "Chicken Dehati & Garlic Naan",
    verifiedVisit: true,
  },
  {
    id: "rev-2",
    customerName: "Pooja Kumari",
    rating: 5,
    comment: "Celebrated my daughter's 5th birthday in the banquet hall. Beautiful green swing photobooth and wonderful food. Paneer Tikka and Rasmalai were heavenly!",
    date: "2026-10-18",
    dishRecommended: "Paneer Tikka & KitKat Shake",
    verifiedVisit: true,
  },
  {
    id: "rev-3",
    customerName: "Amitabh Kumar",
    rating: 5,
    comment: "Finally a true fine-dine experience in Lalganj! Mutton Biryani was full of aroma and the mocktails are refreshing. Very affordable prices for such luxury interior.",
    date: "2026-10-12",
    dishRecommended: "Mutton Dum Biryani & Virgin Mojito",
    verifiedVisit: true,
  },
  {
    id: "rev-4",
    customerName: "Dr. Alok Verma",
    rating: 4,
    comment: "Food quality is top-notch. Dal Tadka and Paneer Butter Masala are consistently delicious. Ample parking space right at Tinpulwa Chowk.",
    date: "2026-10-05",
    dishRecommended: "Paneer Butter Masala & Butter Roti",
    verifiedVisit: true,
  },
];

// Initial Seed Bookings
const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "bk-101",
    bookingNumber: "PRB-9402",
    customerName: "Sanjay Mishra",
    customerPhone: "9835012345",
    date: "2026-11-02",
    timeSlot: "08:00 PM",
    guestCount: 6,
    seatingPreference: "Family Hall",
    occasion: "Family Anniversary",
    specialRequests: "Table near the green garden wall please",
    status: "Confirmed",
    createdAt: "2026-10-31T14:30:00.000Z",
  },
  {
    id: "bk-102",
    bookingNumber: "PRB-8831",
    customerName: "Vikramaditya Roy",
    customerPhone: "9431278901",
    date: "2026-11-03",
    timeSlot: "01:30 PM",
    guestCount: 12,
    seatingPreference: "Party Banquet",
    occasion: "Office Team Lunch",
    specialRequests: "Pre-order vegetarian & non-veg sizzlers",
    status: "Confirmed",
    createdAt: "2026-10-31T18:00:00.000Z",
  },
];

// Initial Seed Orders for Admin Kanban Board
const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "PR-201",
    customerName: "Saurabh Pandey",
    customerPhone: "9693633870",
    orderType: "dine-in",
    tableNumber: 4,
    items: [
      {
        id: "mcn-10-Full",
        menuItemId: "mcn-10",
        name: "Chicken Dehati",
        price: 599,
        portion: "Full",
        quantity: 1,
        type: "non-veg",
      },
      {
        id: "brd-04",
        menuItemId: "brd-04",
        name: "Butter Naan",
        price: 44,
        quantity: 4,
        type: "veg",
      },
      {
        id: "mock-01",
        menuItemId: "mock-01",
        name: "Virgin Mojito",
        price: 139,
        quantity: 2,
        type: "veg",
      }
    ],
    subtotal: 1053,
    gst: 53,
    packagingFee: 0,
    discount: 150,
    couponCode: "PURVA20",
    total: 956,
    paymentMethod: "restaurant",
    paymentStatus: "completed",
    status: "Preparing",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedMinutes: 20,
    roundNumber: 1,
  },
  {
    id: "ord-1002",
    orderNumber: "PR-202",
    customerName: "Priyanka Sharma",
    customerPhone: "9123456789",
    orderType: "pre-order",
    pickupTime: "07:30 PM",
    items: [
      {
        id: "bry-04",
        menuItemId: "bry-04",
        name: "Chicken Biryani",
        price: 249,
        quantity: 2,
        type: "non-veg",
      },
      {
        id: "stn-01",
        menuItemId: "stn-01",
        name: "Chicken Tikka",
        price: 259,
        quantity: 1,
        type: "non-veg",
      }
    ],
    subtotal: 757,
    gst: 38,
    packagingFee: 20,
    discount: 0,
    total: 815,
    paymentMethod: "upi",
    paymentStatus: "completed",
    status: "Received",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedMinutes: 25,
  },
  {
    id: "ord-1003",
    orderNumber: "PR-203",
    customerName: "Deepak Kumar",
    customerPhone: "9835123999",
    orderType: "dine-in",
    tableNumber: 9,
    items: [
      {
        id: "mcv-08",
        menuItemId: "mcv-08",
        name: "Paneer Butter Masala",
        price: 269,
        quantity: 1,
        type: "veg",
      },
      {
        id: "mcv-01",
        menuItemId: "mcv-01",
        name: "Dal Tadka",
        price: 149,
        quantity: 1,
        type: "veg",
      },
      {
        id: "brd-02",
        menuItemId: "brd-02",
        name: "Butter Tandoori Roti",
        price: 22,
        quantity: 6,
        type: "veg",
      }
    ],
    subtotal: 550,
    gst: 28,
    packagingFee: 0,
    discount: 50,
    total: 528,
    paymentMethod: "restaurant",
    paymentStatus: "completed",
    status: "Ready",
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    estimatedMinutes: 20,
    roundNumber: 1,
  }
];

export const storage = {
  // Cart
  getCart: (): CartItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCart: (cart: CartItem[]): void => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },
  clearCart: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  // Favorites
  getFavorites: (): string[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : ['mcn-10', 'mcv-08', 'stn-01', 'shk-05'];
    } catch {
      return [];
    }
  },
  toggleFavorite: (dishId: string): string[] => {
    const favs = storage.getFavorites();
    const next = favs.includes(dishId)
      ? favs.filter(id => id !== dishId)
      : [...favs, dishId];
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next));
    return next;
  },

  // Orders
  getOrders: (): Order[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_ORDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ALL_ORDERS, JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },
  getOrderById: (id: string): Order | undefined => {
    const orders = storage.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id);
  },
  saveOrder: (order: Order): void => {
    const orders = storage.getOrders();
    const updated = [order, ...orders];
    localStorage.setItem(STORAGE_KEYS.ALL_ORDERS, JSON.stringify(updated));

    // Also update recent orders phone map
    try {
      const recent = storage.getRecentOrdersByPhone(order.customerPhone);
      const nextRecent = [order, ...recent.filter(o => o.id !== order.id)];
      localStorage.setItem(`${STORAGE_KEYS.RECENT_ORDERS}_${order.customerPhone}`, JSON.stringify(nextRecent));
    } catch (e) {
      console.warn("Storage error saving recent orders", e);
    }
  },
  updateOrderStatus: (orderId: string, status: Order['status']): Order | null => {
    const orders = storage.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      localStorage.setItem(STORAGE_KEYS.ALL_ORDERS, JSON.stringify(orders));
      return orders[idx];
    }
    return null;
  },
  getRecentOrdersByPhone: (phone: string): Order[] => {
    try {
      const clean = phone.trim();
      const all = storage.getOrders();
      return all.filter(o => o.customerPhone.includes(clean));
    } catch {
      return [];
    }
  },

  // Table Sessions (for table QR order / rounds)
  getTableSession: (tableNumber: number): { waiterCalled: boolean; waterRequested: boolean; billRequested: boolean; orders: Order[] } => {
    try {
      const key = `${STORAGE_KEYS.TABLE_SESSIONS}_${tableNumber}`;
      const data = localStorage.getItem(key);
      const tableOrders = storage.getOrders().filter(o => o.orderType === 'dine-in' && o.tableNumber === tableNumber && o.status !== 'Served' && o.status !== 'Cancelled');
      if (data) {
        const parsed = JSON.parse(data);
        return { ...parsed, orders: tableOrders };
      }
      return { waiterCalled: false, waterRequested: false, billRequested: false, orders: tableOrders };
    } catch {
      return { waiterCalled: false, waterRequested: false, billRequested: false, orders: [] };
    }
  },
  setTableServiceFlag: (tableNumber: number, flag: 'waiterCalled' | 'waterRequested' | 'billRequested', val: boolean): void => {
    const key = `${STORAGE_KEYS.TABLE_SESSIONS}_${tableNumber}`;
    const current = storage.getTableSession(tableNumber);
    const updated = { ...current, [flag]: val };
    localStorage.setItem(key, JSON.stringify(updated));
  },

  // Bookings
  getBookings: (): Booking[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
        return INITIAL_BOOKINGS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKINGS;
    }
  },
  saveBooking: (booking: Booking): void => {
    const list = storage.getBookings();
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify([booking, ...list]));
  },
  updateBookingStatus: (id: string, status: Booking['status']): void => {
    const list = storage.getBookings();
    const updated = list.map(b => b.id === id ? { ...b, status } : b);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(updated));
  },

  // Reviews
  getReviews: (): Review[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
        return INITIAL_REVIEWS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_REVIEWS;
    }
  },
  saveReview: (review: Review): void => {
    const list = storage.getReviews();
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([review, ...list]));
  },

  // Menu Overrides for Admin (price & availability)
  getMenuOverrides: (): Record<string, { price?: number | null; isAvailable?: boolean }> => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MENU_OVERRIDES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  },
  saveMenuOverride: (dishId: string, override: { price?: number | null; isAvailable?: boolean }): void => {
    const current = storage.getMenuOverrides();
    current[dishId] = { ...current[dishId], ...override };
    localStorage.setItem(STORAGE_KEYS.MENU_OVERRIDES, JSON.stringify(current));
  },
  resetMenuOverrides: (): void => {
    localStorage.removeItem(STORAGE_KEYS.MENU_OVERRIDES);
  },

  // Theme & Language
  getTheme: (): 'dark' | 'light' => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
  },
  setTheme: (theme: 'dark' | 'light'): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },
  getLanguage: (): 'en' | 'hi' => {
    return (localStorage.getItem(STORAGE_KEYS.LANG) as 'en' | 'hi') || 'en';
  },
  setLanguage: (lang: 'en' | 'hi'): void => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
  }
};
