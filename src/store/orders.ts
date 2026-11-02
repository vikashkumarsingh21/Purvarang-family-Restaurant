import { useSyncExternalStore } from 'react';
import { DEMO_SPEED } from '../config/restaurant';

export interface OrderItem {
  name: string;
  qty: number;
  veg: boolean;
  price?: number;
  note?: string;
  categorySlug?: string;
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'served' | 'cancelled';

export interface Order {
  id: string; // Token like A101
  table: number | null;
  source: 'dine' | 'pickup';
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
}

export interface WaitEntry {
  id: string; // W1
  name: string;
  party: number;
  createdAt: number;
  called: boolean;
  phone?: string;
}

export interface TableAlert {
  table: number;
  type: 'water' | 'waiter' | 'bill';
  timestamp: number;
}

const STORAGE_KEYS = {
  ORDERS: 'purvarang_live_orders_v2',
  WAITLIST: 'purvarang_live_waitlist_v2',
  TOKEN_SEQ: 'purvarang_live_token_seq_v2',
  WAIT_SEQ: 'purvarang_live_wait_seq_v2',
  OUT_OF_STOCK: 'purvarang_live_out_of_stock_v2',
  SOUND_MUTED: 'purvarang_live_sound_muted_v2',
  TABLE_ALERTS: 'purvarang_live_table_alerts_v2',
};

// Seed Orders (3 sample orders at different stages)
export function getInitialSeedOrders(): Order[] {
  const now = Date.now();
  // 1 kitchen minute = DEMO_SPEED real seconds (3s)
  // Let's set initial orders with created times:
  // A101: Cooking (6 kitchen mins ago = 18 real seconds ago)
  // A102: Ready (12 kitchen mins ago = 36 real seconds ago)
  // A103: New (1 kitchen min ago = 3 real seconds ago)
  return [
    {
      id: 'A101',
      table: 4,
      source: 'dine',
      status: 'cooking',
      createdAt: now - 18 * 1000,
      items: [
        { name: 'Paneer Butter Masala', qty: 1, veg: true, price: 260, categorySlug: 'north-indian-main-veg' },
        { name: 'Butter Naan', qty: 3, veg: true, price: 50, categorySlug: 'tandoor-breads' },
        { name: 'Jeera Rice', qty: 1, veg: true, price: 140, categorySlug: 'rice-biryani' }
      ]
    },
    {
      id: 'A102',
      table: 2,
      source: 'dine',
      status: 'ready',
      createdAt: now - 36 * 1000,
      items: [
        { name: 'Chicken Dum Biryani', qty: 2, veg: false, price: 290, categorySlug: 'rice-biryani' },
        { name: 'Mixed Veg Raita', qty: 1, veg: true, price: 90, categorySlug: 'accompaniments' },
        { name: 'Fresh Lime Soda', qty: 2, veg: true, price: 80, categorySlug: 'mocktail' }
      ]
    },
    {
      id: 'A103',
      table: 7,
      source: 'dine',
      status: 'new',
      createdAt: now - 3 * 1000,
      items: [
        { name: 'Veg Manchurian Dry', qty: 1, veg: true, price: 190, categorySlug: 'chinese-veg' },
        { name: 'Veg Hakka Noodles', qty: 1, veg: true, price: 170, categorySlug: 'chinese-veg' },
        { name: 'Sweet Corn Soup', qty: 2, veg: true, price: 110, categorySlug: 'soup' }
      ]
    }
  ];
}

// Seed Waiting Guests (2 sample guests)
export function getInitialSeedWaitlist(): WaitEntry[] {
  const now = Date.now();
  return [
    {
      id: 'W1',
      name: 'Ramesh Sharma',
      party: 4,
      phone: '9876543210',
      called: false,
      createdAt: now - 24 * 1000 // 8 kitchen mins ago
    },
    {
      id: 'W2',
      name: 'Pooja Verma',
      party: 2,
      phone: '9876512345',
      called: true,
      createdAt: now - 45 * 1000 // 15 kitchen mins ago
    }
  ];
}

interface OrderStoreState {
  orders: Order[];
  waitlist: WaitEntry[];
  outOfStock: string[];
  soundMuted: boolean;
  isSimulating: boolean;
  tableAlerts: TableAlert[];
}

// BroadcastChannel for instant multi-tab sync
const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('purvarang_live_sync_channel')
  : null;

function safeGetItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to read ${key} from storage:`, e);
    return fallback;
  }
}

function safeSetItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to write ${key} to storage:`, e);
  }
}

// Web Audio API Chime Helpers
export function playWebAudioChime(type: 'new' | 'ready') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (type === 'new') {
      // Ascending two-tone chime (E5 -> A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.15);
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.5);
    } else {
      // Ready chime (Three sweet rising tones: C5 -> E5 -> G5)
      const freqs = [523.25, 659.25, 783.99];
      freqs.forEach((freq, idx) => {
        const start = now + idx * 0.12;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.4);
      });
    }
  } catch (e) {
    // Non-fatal if audio context blocked before user gesture
  }
}

// Initial state loader
function loadInitialState(): OrderStoreState {
  let orders = safeGetItem<Order[]>(STORAGE_KEYS.ORDERS, []);
  if (!orders || orders.length === 0) {
    orders = getInitialSeedOrders();
    safeSetItem(STORAGE_KEYS.ORDERS, orders);
    safeSetItem(STORAGE_KEYS.TOKEN_SEQ, 103);
  }

  let waitlist = safeGetItem<WaitEntry[]>(STORAGE_KEYS.WAITLIST, []);
  if (!waitlist || waitlist.length === 0) {
    waitlist = getInitialSeedWaitlist();
    safeSetItem(STORAGE_KEYS.WAITLIST, waitlist);
    safeSetItem(STORAGE_KEYS.WAIT_SEQ, 2);
  }

  const outOfStock = safeGetItem<string[]>(STORAGE_KEYS.OUT_OF_STOCK, []);
  const soundMuted = safeGetItem<boolean>(STORAGE_KEYS.SOUND_MUTED, false);
  const tableAlerts = safeGetItem<TableAlert[]>(STORAGE_KEYS.TABLE_ALERTS, []);

  return {
    orders,
    waitlist,
    outOfStock,
    soundMuted,
    isSimulating: false,
    tableAlerts
  };
}

let state: OrderStoreState = loadInitialState();
const listeners = new Set<() => void>();
let simulationTimer: ReturnType<typeof setInterval> | null = null;

function notify() {
  listeners.forEach(fn => fn());
}

function broadcastSync(type: string, data?: any) {
  if (syncChannel) {
    try {
      syncChannel.postMessage({ type, data, timestamp: Date.now() });
    } catch (e) {
      console.warn('Broadcast sync error:', e);
    }
  }
}

// Listen to other browser tabs
if (syncChannel) {
  syncChannel.onmessage = (event) => {
    const { type } = event.data || {};
    if (type === 'STATE_UPDATED') {
      state = {
        ...state,
        orders: safeGetItem<Order[]>(STORAGE_KEYS.ORDERS, state.orders),
        waitlist: safeGetItem<WaitEntry[]>(STORAGE_KEYS.WAITLIST, state.waitlist),
        outOfStock: safeGetItem<string[]>(STORAGE_KEYS.OUT_OF_STOCK, state.outOfStock),
        tableAlerts: safeGetItem<TableAlert[]>(STORAGE_KEYS.TABLE_ALERTS, state.tableAlerts)
      };
      notify();
    } else if (type === 'PLAY_SOUND') {
      if (!state.soundMuted) {
        playWebAudioChime(event.data.soundType || 'new');
      }
    }
  };
}

// Core Store Operations
export const ordersStore = {
  getState(): OrderStoreState {
    return state;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Token generator: Starts at A101 and increases
  generateToken(): string {
    try {
      let seq = parseInt(localStorage.getItem(STORAGE_KEYS.TOKEN_SEQ) || '103', 10);
      seq += 1;
      if (seq > 999) seq = 101;
      localStorage.setItem(STORAGE_KEYS.TOKEN_SEQ, seq.toString());
      return `A${seq}`;
    } catch {
      return `A${Math.floor(100 + Math.random() * 899)}`;
    }
  },

  // Waitlist token generator: W1, W2...
  generateWaitToken(): string {
    try {
      let seq = parseInt(localStorage.getItem(STORAGE_KEYS.WAIT_SEQ) || '2', 10);
      seq += 1;
      localStorage.setItem(STORAGE_KEYS.WAIT_SEQ, seq.toString());
      return `W${seq}`;
    } catch {
      return `W${Math.floor(1 + Math.random() * 99)}`;
    }
  },

  // Action: placeOrder
  placeOrder(input: {
    table: number | null;
    source: 'dine' | 'pickup';
    items: OrderItem[];
  }): string {
    const id = this.generateToken();
    const newOrder: Order = {
      id,
      table: input.table,
      source: input.source,
      items: input.items,
      status: 'new',
      createdAt: Date.now()
    };

    const nextOrders = [newOrder, ...state.orders];
    state = { ...state, orders: nextOrders };
    safeSetItem(STORAGE_KEYS.ORDERS, nextOrders);
    notify();
    broadcastSync('STATE_UPDATED');

    if (!state.soundMuted) {
      playWebAudioChime('new');
      broadcastSync('PLAY_SOUND', { soundType: 'new' });
    }

    return id;
  },

  // Action: advanceOrder (new -> cooking -> ready -> served)
  advanceOrder(id: string): void {
    let advancedToReady = false;
    const nextOrders = state.orders.map(order => {
      if (order.id !== id) return order;
      let nextStatus: OrderStatus = order.status;
      if (order.status === 'new') {
        nextStatus = 'cooking';
      } else if (order.status === 'cooking') {
        nextStatus = 'ready';
        advancedToReady = true;
      } else if (order.status === 'ready') {
        nextStatus = 'served';
      }
      return { ...order, status: nextStatus };
    });

    state = { ...state, orders: nextOrders };
    safeSetItem(STORAGE_KEYS.ORDERS, nextOrders);
    notify();
    broadcastSync('STATE_UPDATED');

    if (advancedToReady && !state.soundMuted) {
      playReadyChime();
      broadcastSync('PLAY_SOUND', { soundType: 'ready' });
    }
  },

  // Action: cancelOrder
  cancelOrder(id: string): void {
    const nextOrders = state.orders.map(order => {
      if (order.id === id) {
        return { ...order, status: 'cancelled' as OrderStatus };
      }
      return order;
    });
    state = { ...state, orders: nextOrders };
    safeSetItem(STORAGE_KEYS.ORDERS, nextOrders);
    notify();
    broadcastSync('STATE_UPDATED');
  },

  // Action: addWait
  addWait(input: { name: string; party: number; phone?: string }): string {
    const id = this.generateWaitToken();
    const newEntry: WaitEntry = {
      id,
      name: input.name.trim(),
      party: Math.max(1, Math.min(8, input.party)),
      phone: input.phone?.trim(),
      called: false,
      createdAt: Date.now()
    };

    const nextWaitlist = [...state.waitlist, newEntry];
    state = { ...state, waitlist: nextWaitlist };
    safeSetItem(STORAGE_KEYS.WAITLIST, nextWaitlist);
    notify();
    broadcastSync('STATE_UPDATED');
    return id;
  },

  // Action: callWait
  callWait(id: string): void {
    const nextWaitlist = state.waitlist.map(entry => {
      if (entry.id === id) {
        return { ...entry, called: true };
      }
      return entry;
    });
    state = { ...state, waitlist: nextWaitlist };
    safeSetItem(STORAGE_KEYS.WAITLIST, nextWaitlist);
    notify();
    broadcastSync('STATE_UPDATED');
  },

  // Action: seatWait (removes from list)
  seatWait(id: string): void {
    const nextWaitlist = state.waitlist.filter(entry => entry.id !== id);
    state = { ...state, waitlist: nextWaitlist };
    safeSetItem(STORAGE_KEYS.WAITLIST, nextWaitlist);
    notify();
    broadcastSync('STATE_UPDATED');
  },

  // Action: noShowWait (removes from list)
  noShowWait(id: string): void {
    this.seatWait(id);
  },

  // Action: reset demo data (restores seed)
  resetDemoData(): void {
    const seedOrders = getInitialSeedOrders();
    const seedWaitlist = getInitialSeedWaitlist();

    state = {
      ...state,
      orders: seedOrders,
      waitlist: seedWaitlist,
      outOfStock: [],
      tableAlerts: []
    };

    safeSetItem(STORAGE_KEYS.ORDERS, seedOrders);
    safeSetItem(STORAGE_KEYS.WAITLIST, seedWaitlist);
    safeSetItem(STORAGE_KEYS.TOKEN_SEQ, 103);
    safeSetItem(STORAGE_KEYS.WAIT_SEQ, 2);
    safeSetItem(STORAGE_KEYS.OUT_OF_STOCK, []);
    safeSetItem(STORAGE_KEYS.TABLE_ALERTS, []);

    this.stopSimulation();
    notify();
    broadcastSync('STATE_UPDATED');
  },

  // Action: startSimulation
  // Creates a random order (1 to 3 dishes, random table 1 to 20) every 6s, pauses at >= 10 active orders
  startSimulation(): void {
    if (simulationTimer) return;
    state = { ...state, isSimulating: true };
    notify();

    simulationTimer = setInterval(() => {
      const activeCount = state.orders.filter(
        o => o.status !== 'served' && o.status !== 'cancelled'
      ).length;

      if (activeCount < 10) {
        const sampleDishes: Array<{ name: string; veg: boolean; price: number; category: string }> = [
          { name: 'Paneer Tikka', veg: true, price: 230, category: 'tandoor' },
          { name: 'Chicken Tandoori', veg: false, price: 340, category: 'tandoor' },
          { name: 'Butter Naan', veg: true, price: 50, category: 'tandoor' },
          { name: 'Dal Makhani', veg: true, price: 220, category: 'gravy_rice' },
          { name: 'Kadhai Paneer', veg: true, price: 250, category: 'gravy_rice' },
          { name: 'Butter Chicken', veg: false, price: 360, category: 'gravy_rice' },
          { name: 'Veg Hakka Noodles', veg: true, price: 170, category: 'chinese' },
          { name: 'Chilli Chicken', veg: false, price: 260, category: 'chinese' },
          { name: 'Chicken Biryani', veg: false, price: 290, category: 'gravy_rice' },
          { name: 'Jeera Rice', veg: true, price: 140, category: 'gravy_rice' },
          { name: 'Cold Coffee', veg: true, price: 90, category: 'drinks_desserts' },
          { name: 'Virgin Mojito', veg: true, price: 110, category: 'drinks_desserts' },
          { name: 'Gulab Jamun', veg: true, price: 60, category: 'drinks_desserts' },
        ];

        const dishCount = Math.floor(1 + Math.random() * 3); // 1 to 3 dishes
        const selectedItems: OrderItem[] = [];
        for (let i = 0; i < dishCount; i++) {
          const dish = sampleDishes[Math.floor(Math.random() * sampleDishes.length)];
          const existing = selectedItems.find(it => it.name === dish.name);
          if (existing) {
            existing.qty += 1;
          } else {
            selectedItems.push({
              name: dish.name,
              qty: 1,
              veg: dish.veg,
              price: dish.price,
              categorySlug: dish.category
            });
          }
        }

        const randomTable = Math.floor(1 + Math.random() * 20); // 1 to 20
        ordersStore.placeOrder({
          table: randomTable,
          source: 'dine',
          items: selectedItems
        });
      }
    }, 6000);
  },

  // Action: stopSimulation
  stopSimulation(): void {
    if (simulationTimer) {
      clearInterval(simulationTimer);
      simulationTimer = null;
    }
    state = { ...state, isSimulating: false };
    notify();
  },

  // 86-list Out-of-Stock Toggle
  toggleOutOfStock(dishName: string): void {
    const exists = state.outOfStock.includes(dishName);
    const nextList = exists
      ? state.outOfStock.filter(d => d !== dishName)
      : [...state.outOfStock, dishName];

    state = { ...state, outOfStock: nextList };
    safeSetItem(STORAGE_KEYS.OUT_OF_STOCK, nextList);
    notify();
    broadcastSync('STATE_UPDATED');
  },

  isOutOfStock(dishName: string): boolean {
    return state.outOfStock.includes(dishName);
  },

  // Sound mute toggle
  toggleSound(): void {
    const nextMuted = !state.soundMuted;
    state = { ...state, soundMuted: nextMuted };
    safeSetItem(STORAGE_KEYS.SOUND_MUTED, nextMuted);
    notify();
  },

  // Service alert request from table (Water, Waiter, Bill)
  requestTableAlert(table: number, type: 'water' | 'waiter' | 'bill'): void {
    const filtered = state.tableAlerts.filter(a => !(a.table === table && a.type === type));
    const nextAlerts = [...filtered, { table, type, timestamp: Date.now() }];
    state = { ...state, tableAlerts: nextAlerts };
    safeSetItem(STORAGE_KEYS.TABLE_ALERTS, nextAlerts);
    notify();
    broadcastSync('STATE_UPDATED');
  },

  clearTableAlert(table: number, type?: 'water' | 'waiter' | 'bill'): void {
    const nextAlerts = state.tableAlerts.filter(a => {
      if (a.table !== table) return true;
      if (type && a.type !== type) return true;
      return false;
    });
    state = { ...state, tableAlerts: nextAlerts };
    safeSetItem(STORAGE_KEYS.TABLE_ALERTS, nextAlerts);
    notify();
    broadcastSync('STATE_UPDATED');
  }
};

export function playReadyChime() {
  playWebAudioChime('ready');
}

// React Custom Hook using useSyncExternalStore
export function useOrderStore() {
  const storeState = useSyncExternalStore(
    ordersStore.subscribe,
    ordersStore.getState,
    ordersStore.getState
  );

  return {
    ...storeState,
    placeOrder: ordersStore.placeOrder.bind(ordersStore),
    advanceOrder: ordersStore.advanceOrder.bind(ordersStore),
    cancelOrder: ordersStore.cancelOrder.bind(ordersStore),
    addWait: ordersStore.addWait.bind(ordersStore),
    callWait: ordersStore.callWait.bind(ordersStore),
    seatWait: ordersStore.seatWait.bind(ordersStore),
    noShowWait: ordersStore.noShowWait.bind(ordersStore),
    resetDemoData: ordersStore.resetDemoData.bind(ordersStore),
    startSimulation: ordersStore.startSimulation.bind(ordersStore),
    stopSimulation: ordersStore.stopSimulation.bind(ordersStore),
    toggleOutOfStock: ordersStore.toggleOutOfStock.bind(ordersStore),
    isOutOfStock: ordersStore.isOutOfStock.bind(ordersStore),
    toggleSound: ordersStore.toggleSound.bind(ordersStore),
    requestTableAlert: ordersStore.requestTableAlert.bind(ordersStore),
    clearTableAlert: ordersStore.clearTableAlert.bind(ordersStore),
  };
}
