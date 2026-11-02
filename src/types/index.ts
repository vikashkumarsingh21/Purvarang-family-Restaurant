import type { MenuItem } from '../data/menu';

export type { MenuItem };
export type OrderType = 'dine-in' | 'pre-order';

export type KitchenStation = 'tandoor' | 'chinese' | 'gravy_rice' | 'drinks_desserts';

export interface CartItem {
  id: string; // dishId + portion
  menuItemId: string;
  name: string;
  hindiName?: string;
  price: number;
  portion?: 'Half' | 'Full';
  quantity: number;
  type: 'veg' | 'non-veg';
  notes?: string;
  station?: KitchenStation;
  image?: string;
}

export type OrderStatus =
  | 'new'
  | 'cooking'
  | 'ready'
  | 'served'
  | 'cancelled'
  | 'Received'
  | 'Preparing'
  | 'Ready'
  | 'Served'
  | 'Cancelled';

export interface Order {
  id: string;
  token?: string; // e.g. "A101"
  orderNumber: string; // "PUR-A101"
  customerName: string;
  customerPhone: string;
  source?: string; // "Table 4" or "Pickup"
  orderType: OrderType;
  tableNumber?: number;
  pickupTime?: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  packagingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'restaurant' | 'upi';
  paymentStatus: 'pending' | 'completed';
  status: OrderStatus;
  createdAt: string;
  readyAt?: string;
  servedAt?: string;
  estimatedMinutes: number;
  roundNumber?: number;
  specialInstructions?: string;
}

export type TableStatus = 'free' | 'occupied' | 'order_placed' | 'food_ready' | 'bill_requested';

export interface TableState {
  tableNumber: number;
  status: TableStatus;
  currentOrderId?: string;
  currentOrderToken?: string;
  guestCount?: number;
  waiterCalled: boolean;
  waterRequested: boolean;
  billRequested: boolean;
  lastUpdated: string;
}

export interface WaitlistEntry {
  id: string;
  token: string; // e.g. "W01"
  customerName: string;
  customerPhone: string;
  partySize: number;
  status: 'waiting' | 'ready' | 'seated' | 'no_show' | 'cancelled';
  createdAt: string;
  estimatedWaitMinutes: number;
  notifiedAt?: string;
}

export type StaffRole = 'owner' | 'chef' | 'waiter' | 'cashier';

export interface StaffUser {
  role: StaffRole;
  name: string;
  label: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  seatingPreference: 'Family Hall' | 'Window View' | 'Party Banquet';
  occasion?: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  dishRecommended?: string;
  verifiedVisit?: boolean;
}
