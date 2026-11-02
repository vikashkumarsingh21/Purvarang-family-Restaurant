import { Order, OrderStatus, CartItem, KitchenStation, TableState, TableStatus, WaitlistEntry, StaffRole, StaffUser } from '../types';
import { MENU_ITEMS } from '../data/menu';
import { RESTAURANT_CONFIG } from '../config/restaurant';

const STORAGE_KEYS = {
  ORDERS: 'purvarang_live_orders',
  TOKEN_SEQ: 'purvarang_token_seq',
  TABLES: 'purvarang_tables_state',
  WAITLIST: 'purvarang_waitlist_state',
  OUT_OF_STOCK: 'purvarang_out_of_stock',
  STAFF_SESSION: 'purvarang_staff_session',
  SIMULATION_ACTIVE: 'purvarang_simulation_active',
  SOUND_MUTED: 'purvarang_sound_muted',
};

// Map dish category / name to Kitchen Station
export function getDishStation(categorySlug: string, dishName: string): KitchenStation {
  const cat = (categorySlug || '').toLowerCase();
  const name = (dishName || '').toLowerCase();

  if (['mocktail', 'shake', 'ice-cream', 'soft-drink', 'dessert'].includes(cat)) {
    return 'drinks_desserts';
  }
  if (
    cat.includes('starter') ||
    name.includes('tikka') ||
    name.includes('tandoori') ||
    name.includes('kabab') ||
    name.includes('naan') ||
    name.includes('roti') ||
    name.includes('kulcha') ||
    name.includes('paratha')
  ) {
    return 'tandoor';
  }
  if (['chinese-veg', 'chinese-non-veg', 'pasta', 'soup'].includes(cat) || name.includes('chilli') || name.includes('manchurian') || name.includes('chowmein') || name.includes('noodles')) {
    return 'chinese';
  }
  return 'gravy_rice';
}

// Generate token e.g. A101, A102...
export function generateOrderToken(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOKEN_SEQ);
    let seq = raw ? parseInt(raw, 10) : 100;
    seq += 1;
    if (seq > 999) seq = 101;
    localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, seq.toString());
    return `A${seq}`;
  } catch {
    return `A${Math.floor(100 + Math.random() * 900)}`;
  }
}

// BroadcastChannel instance for real-time multi-tab synchronization
const liveChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('purvarang_live_sync')
  : null;

function broadcast(type: string, payload?: any) {
  if (liveChannel) {
    try {
      liveChannel.postMessage({ type, payload, timestamp: Date.now() });
    } catch (e) {
      console.warn("BroadcastChannel error", e);
    }
  }
}

// Web Audio API chime for new orders
export function playNewOrderChime() {
  if (typeof window === 'undefined') return;
  const isMuted = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  if (isMuted) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Two pleasant ascending chimes (E5 -> A5)
    const now = ctx.currentTime;
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.55);
  } catch (err) {
    // AudioContext might require user interaction first
  }
}

// Initial Seed Orders for demo
function getInitialOrders(): Order[] {
  const now = Date.now();
  return [
    {
      id: "ord-101",
      token: "A101",
      orderNumber: "PUR-A101",
      customerName: "Saurabh Pandey",
      customerPhone: "9693633870",
      source: "Table 4",
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
          station: "gravy_rice",
          notes: "Mild spicy with garlic",
        },
        {
          id: "brd-04",
          menuItemId: "brd-04",
          name: "Butter Naan",
          price: 44,
          quantity: 4,
          type: "veg",
          station: "tandoor",
        },
        {
          id: "mock-01",
          menuItemId: "mock-01",
          name: "Virgin Mojito",
          price: 139,
          quantity: 2,
          type: "veg",
          station: "drinks_desserts",
        }
      ],
      subtotal: 954,
      gst: 48,
      packagingFee: 0,
      discount: 0,
      total: 1002,
      paymentMethod: "restaurant",
      paymentStatus: "pending",
      status: "cooking",
      createdAt: new Date(now - 12 * 60000).toISOString(),
      estimatedMinutes: 18,
    },
    {
      id: "ord-102",
      token: "A102",
      orderNumber: "PUR-A102",
      customerName: "Priyanka Sharma",
      customerPhone: "9123456789",
      source: "Pickup",
      orderType: "pre-order",
      pickupTime: "In 25 mins",
      items: [
        {
          id: "bry-04",
          menuItemId: "bry-04",
          name: "Chicken Dum Biryani",
          price: 249,
          quantity: 2,
          type: "non-veg",
          station: "gravy_rice",
        },
        {
          id: "stn-01",
          menuItemId: "stn-01",
          name: "Chicken Tikka",
          price: 259,
          quantity: 1,
          type: "non-veg",
          station: "tandoor",
          notes: "Extra green chutney",
        }
      ],
      subtotal: 757,
      gst: 38,
      packagingFee: 20,
      discount: 0,
      total: 815,
      paymentMethod: "upi",
      paymentStatus: "completed",
      status: "new",
      createdAt: new Date(now - 4 * 60000).toISOString(),
      estimatedMinutes: 20,
    },
    {
      id: "ord-103",
      token: "A103",
      orderNumber: "PUR-A103",
      customerName: "Amitabh Kumar",
      customerPhone: "9431278901",
      source: "Table 12",
      orderType: "dine-in",
      tableNumber: 12,
      items: [
        {
          id: "mcv-01",
          menuItemId: "mcv-01",
          name: "Paneer Butter Masala",
          price: 249,
          quantity: 1,
          type: "veg",
          station: "gravy_rice",
        },
        {
          id: "brd-02",
          menuItemId: "brd-02",
          name: "Butter Tandoori Roti",
          price: 18,
          quantity: 5,
          type: "veg",
          station: "tandoor",
        },
        {
          id: "shk-01",
          menuItemId: "shk-01",
          name: "Cold Coffee with Ice Cream",
          price: 159,
          quantity: 2,
          type: "veg",
          station: "drinks_desserts",
        }
      ],
      subtotal: 657,
      gst: 33,
      packagingFee: 0,
      discount: 50,
      couponCode: "WELCOME",
      total: 640,
      paymentMethod: "restaurant",
      paymentStatus: "pending",
      status: "ready",
      createdAt: new Date(now - 22 * 60000).toISOString(),
      readyAt: new Date(now - 2 * 60000).toISOString(),
      estimatedMinutes: 15,
    }
  ];
}

// Initial Tables (1 to 30)
function getInitialTables(): TableState[] {
  const tables: TableState[] = [];
  for (let i = 1; i <= RESTAURANT_CONFIG.tables.total; i++) {
    if (i === 4) {
      tables.push({
        tableNumber: 4,
        status: 'order_placed',
        currentOrderId: 'ord-101',
        currentOrderToken: 'A101',
        guestCount: 4,
        waiterCalled: false,
        waterRequested: false,
        billRequested: false,
        lastUpdated: new Date().toISOString(),
      });
    } else if (i === 12) {
      tables.push({
        tableNumber: 12,
        status: 'food_ready',
        currentOrderId: 'ord-103',
        currentOrderToken: 'A103',
        guestCount: 3,
        waiterCalled: false,
        waterRequested: true,
        billRequested: false,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      tables.push({
        tableNumber: i,
        status: 'free',
        waiterCalled: false,
        waterRequested: false,
        billRequested: false,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  return tables;
}

// Initial Waitlist
function getInitialWaitlist(): WaitlistEntry[] {
  return [
    {
      id: "w-1",
      token: "W01",
      customerName: "Vikram Kumar",
      customerPhone: "9835012345",
      partySize: 4,
      status: "waiting",
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
      estimatedWaitMinutes: 15,
    },
    {
      id: "w-2",
      token: "W02",
      customerName: "Neha Roy",
      customerPhone: "9431098765",
      partySize: 6,
      status: "ready",
      createdAt: new Date(Date.now() - 22 * 60000).toISOString(),
      estimatedWaitMinutes: 5,
      notifiedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    }
  ];
}

// Core Store Implementation
export const orderStore = {
  // Orders
  getOrders(): Order[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (data) return JSON.parse(data);
      const init = getInitialOrders();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(init));
      return init;
    } catch {
      return getInitialOrders();
    }
  },

  getOrderByIdOrToken(idOrToken: string): Order | undefined {
    const orders = this.getOrders();
    const query = idOrToken.trim().toLowerCase();
    return orders.find(o => 
      o.id.toLowerCase() === query || 
      (o.token && o.token.toLowerCase() === query) || 
      o.orderNumber.toLowerCase() === query
    );
  },

  createOrder(orderData: Omit<Order, 'id' | 'token' | 'orderNumber' | 'status' | 'createdAt'>): Order {
    const orders = this.getOrders();
    const token = generateOrderToken();
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      token,
      orderNumber: `PUR-${token}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    const updated = [newOrder, ...orders];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    // Update table state if dine-in
    if (newOrder.tableNumber) {
      this.updateTableStatus(newOrder.tableNumber, 'order_placed', newOrder.id, newOrder.token);
    }

    playNewOrderChime();
    broadcast('ORDER_CREATED', newOrder);
    return newOrder;
  },

  updateOrderStatus(orderId: string, status: OrderStatus): Order | null {
    const orders = this.getOrders();
    let updatedOrder: Order | null = null;
    const now = new Date().toISOString();

    const updated = orders.map(ord => {
      if (ord.id === orderId || ord.token === orderId) {
        updatedOrder = {
          ...ord,
          status,
          readyAt: status === 'ready' ? now : ord.readyAt,
          servedAt: status === 'served' ? now : ord.servedAt,
        };
        return updatedOrder;
      }
      return ord;
    });

    if (updatedOrder) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

      // Sync table state if dine-in
      const ord: Order = updatedOrder;
      if (ord.tableNumber) {
        if (status === 'ready') {
          this.updateTableStatus(ord.tableNumber, 'food_ready');
        } else if (status === 'served') {
          this.updateTableStatus(ord.tableNumber, 'occupied');
        }
      }

      broadcast('ORDER_UPDATED', updatedOrder);
    }

    return updatedOrder;
  },

  // Tables State
  getTables(): TableState[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TABLES);
      if (data) return JSON.parse(data);
      const init = getInitialTables();
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(init));
      return init;
    } catch {
      return getInitialTables();
    }
  },

  updateTableStatus(tableNumber: number, status: TableStatus, orderId?: string, orderToken?: string): TableState[] {
    const tables = this.getTables();
    const updated = tables.map(t => {
      if (t.tableNumber === tableNumber) {
        return {
          ...t,
          status,
          currentOrderId: orderId !== undefined ? orderId : t.currentOrderId,
          currentOrderToken: orderToken !== undefined ? orderToken : t.currentOrderToken,
          lastUpdated: new Date().toISOString(),
          // Clear alerts when served or freed
          ...(status === 'free' ? { waiterCalled: false, waterRequested: false, billRequested: false, currentOrderId: undefined, currentOrderToken: undefined } : {})
        };
      }
      return t;
    });

    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(updated));
    broadcast('TABLE_STATUS_CHANGED', { tableNumber, status });
    return updated;
  },

  setTableAlert(tableNumber: number, alertKey: 'waiterCalled' | 'waterRequested' | 'billRequested', value: boolean) {
    const tables = this.getTables();
    const updated = tables.map(t => {
      if (t.tableNumber === tableNumber) {
        return {
          ...t,
          [alertKey]: value,
          ...(alertKey === 'billRequested' && value ? { status: 'bill_requested' as TableStatus } : {}),
          lastUpdated: new Date().toISOString(),
        };
      }
      return t;
    });

    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(updated));
    broadcast('TABLE_ALERT', { tableNumber, alertKey, value });
    return updated;
  },

  // Waitlist
  getWaitlist(): WaitlistEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WAITLIST);
      if (data) return JSON.parse(data);
      const init = getInitialWaitlist();
      localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(init));
      return init;
    } catch {
      return getInitialWaitlist();
    }
  },

  addToWaitlist(customerName: string, customerPhone: string, partySize: number): WaitlistEntry {
    const list = this.getWaitlist();
    const tokenNum = list.length + 1;
    const token = `W${tokenNum < 10 ? '0' : ''}${tokenNum}`;
    const newEntry: WaitlistEntry = {
      id: `w-${Date.now()}`,
      token,
      customerName,
      customerPhone,
      partySize,
      status: 'waiting',
      createdAt: new Date().toISOString(),
      estimatedWaitMinutes: Math.max(10, list.filter(w => w.status === 'waiting').length * 8),
    };

    const updated = [...list, newEntry];
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(updated));
    broadcast('WAITLIST_UPDATED', newEntry);
    return newEntry;
  },

  updateWaitlistStatus(id: string, status: WaitlistEntry['status']): WaitlistEntry[] {
    const list = this.getWaitlist();
    const now = new Date().toISOString();
    const updated = list.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          notifiedAt: status === 'ready' ? now : item.notifiedAt,
        };
      }
      return item;
    });

    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(updated));
    broadcast('WAITLIST_UPDATED', { id, status });
    return updated;
  },

  // Out of Stock Dish Manager
  getOutOfStockIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OUT_OF_STOCK);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleDishOutOfStock(dishId: string): boolean {
    const list = this.getOutOfStockIds();
    const isOutOfStock = list.includes(dishId);
    let updated: string[];

    if (isOutOfStock) {
      updated = list.filter(id => id !== dishId);
    } else {
      updated = [...list, dishId];
    }

    localStorage.setItem(STORAGE_KEYS.OUT_OF_STOCK, JSON.stringify(updated));
    broadcast('OUT_OF_STOCK_TOGGLED', { dishId, isOutOfStock: !isOutOfStock });
    return !isOutOfStock;
  },

  // Staff Session
  getStaffSession(): StaffUser | null {
    try {
      const data = sessionStorage.getItem(STORAGE_KEYS.STAFF_SESSION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  loginStaff(pin: string): StaffUser | null {
    const cleanPin = pin.trim();
    const pins = RESTAURANT_CONFIG.demoStaffPins;

    let user: StaffUser | null = null;
    if (cleanPin === pins.owner || cleanPin === 'admin') {
      user = { role: 'owner', name: 'Owner / Manager', label: 'All Permissions' };
    } else if (cleanPin === pins.chef) {
      user = { role: 'chef', name: 'Head Chef', label: 'Kitchen Display' };
    } else if (cleanPin === pins.waiter) {
      user = { role: 'waiter', name: 'Captain / Waiter', label: 'Floor Map & Waitlist' };
    } else if (cleanPin === pins.cashier) {
      user = { role: 'cashier', name: 'Billing Cashier', label: 'Cashier Desk' };
    }

    if (user) {
      sessionStorage.setItem(STORAGE_KEYS.STAFF_SESSION, JSON.stringify(user));
    }
    return user;
  },

  logoutStaff() {
    sessionStorage.removeItem(STORAGE_KEYS.STAFF_SESSION);
  },

  // Audio Mute State
  isSoundMuted(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SOUND_MUTED) === 'true';
  },

  toggleSoundMute(): boolean {
    const current = this.isSoundMuted();
    localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, (!current).toString());
    return !current;
  },

  // Demo Order Simulator (Creates orders every 20s if enabled)
  isSimulationActive(): boolean {
    return localStorage.getItem(STORAGE_KEYS.SIMULATION_ACTIVE) === 'true';
  },

  setSimulationActive(active: boolean) {
    localStorage.setItem(STORAGE_KEYS.SIMULATION_ACTIVE, active.toString());
    broadcast('SIMULATION_TOGGLED', active);
  },

  generateRandomSimulatedOrder(): Order {
    const sampleNames = ["Vikram Singh", "Rahul Kumar", "Sunita Devi", "Ravi Shankar", "Deepak Verma", "Manoj Jha", "Anjali Kumari"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomTable = Math.floor(1 + Math.random() * 25);
    const isPickup = Math.random() > 0.7;

    // Pick 2-3 random dishes from menu
    const randomDishes = [...MENU_ITEMS].sort(() => 0.5 - Math.random()).slice(0, Math.floor(2 + Math.random() * 2));
    const items: CartItem[] = randomDishes.map(d => ({
      id: `${d.id}-${Date.now()}`,
      menuItemId: d.id,
      name: d.name,
      price: d.price || 180,
      quantity: Math.floor(1 + Math.random() * 2),
      type: d.type,
      station: getDishStation(d.categorySlug, d.name),
      notes: Math.random() > 0.6 ? "Less spicy please" : undefined,
    }));

    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    return this.createOrder({
      customerName: randomName,
      customerPhone: "9693633870",
      source: isPickup ? "Pickup" : `Table ${randomTable}`,
      orderType: isPickup ? "pre-order" : "dine-in",
      tableNumber: isPickup ? undefined : randomTable,
      pickupTime: isPickup ? "In 20 mins" : undefined,
      items,
      subtotal,
      gst,
      packagingFee: isPickup ? 20 : 0,
      discount: 0,
      total: total + (isPickup ? 20 : 0),
      paymentMethod: Math.random() > 0.5 ? 'upi' : 'restaurant',
      paymentStatus: 'pending',
      estimatedMinutes: 15 + Math.floor(Math.random() * 10),
    });
  },

  // Multi-tab listener
  subscribe(callback: (event: { type: string; payload?: any }) => void): () => void {
    if (!liveChannel) return () => {};
    const handler = (e: MessageEvent) => {
      if (e.data) callback(e.data);
    };
    liveChannel.addEventListener('message', handler);
    return () => liveChannel.removeEventListener('message', handler);
  }
};
