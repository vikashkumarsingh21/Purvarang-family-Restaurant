import { storage } from './storage';
import { Order, Booking, Review, CartItem, OrderType } from '../types';
import { RESTAURANT_CONFIG } from '../config/restaurant';

export const mockApi = {
  // Place an Order
  placeOrder: async (data: {
    customerName: string;
    customerPhone: string;
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
    specialInstructions?: string;
    roundNumber?: number;
  }): Promise<Order> => {
    // Artificial latency for authentic network simulation
    await new Promise(r => setTimeout(r, 600));

    const timestamp = Date.now();
    const orderNumber = `PR-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: `ord-${timestamp}`,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      orderType: data.orderType,
      tableNumber: data.tableNumber,
      pickupTime: data.pickupTime,
      items: data.items,
      subtotal: data.subtotal,
      gst: data.gst,
      packagingFee: data.packagingFee,
      discount: data.discount,
      couponCode: data.couponCode,
      total: data.total,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === 'upi' ? 'completed' : 'pending',
      status: 'Received',
      createdAt: new Date().toISOString(),
      estimatedMinutes: data.orderType === 'dine-in' ? 20 : 30,
      roundNumber: data.roundNumber || 1,
      specialInstructions: data.specialInstructions,
    };

    storage.saveOrder(newOrder);
    storage.clearCart();
    return newOrder;
  },

  // Track Order with simulated progressive stages
  getOrderStatus: async (orderId: string): Promise<Order | null> => {
    await new Promise(r => setTimeout(r, 300));
    const order = storage.getOrderById(orderId);
    if (!order) return null;

    // Simulate natural order progression based on time elapsed since created
    const elapsedMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
    let computedStatus = order.status;

    if (order.status !== 'Served' && order.status !== 'Cancelled') {
      if (elapsedMinutes > 15) {
        computedStatus = 'Served';
      } else if (elapsedMinutes > 8) {
        computedStatus = 'Ready';
      } else if (elapsedMinutes > 2) {
        computedStatus = 'Preparing';
      }
      if (computedStatus !== order.status) {
        storage.updateOrderStatus(order.id, computedStatus);
        order.status = computedStatus;
      }
    }

    return order;
  },

  // Create Table Reservation
  createBooking: async (data: Omit<Booking, 'id' | 'bookingNumber' | 'status' | 'createdAt'>): Promise<Booking> => {
    await new Promise(r => setTimeout(r, 600));
    const timestamp = Date.now();
    const bookingNumber = `PRB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      ...data,
      id: `bk-${timestamp}`,
      bookingNumber,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    storage.saveBooking(newBooking);
    return newBooking;
  },

  // Submit Review
  submitReview: async (data: Omit<Review, 'id' | 'date'>): Promise<Review> => {
    await new Promise(r => setTimeout(r, 400));
    const newRev: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      verifiedVisit: true,
    };
    storage.saveReview(newRev);
    return newRev;
  },

  // Generate Calendar ICS Download
  downloadCalendarEvent: (booking: Booking): void => {
    // Format date string YYYYMMDD
    const cleanDate = booking.date.replace(/-/g, '');
    const startTime = "190000"; // Default 7 PM fallback
    const endTime = "210000";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Purvarang Family Restaurant//Table Reservation//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Table Booking at Purvarang Restaurant (${booking.bookingNumber})`,
      `DESCRIPTION:Reservation for ${booking.guestCount} guests in ${booking.seatingPreference}. Booking ID: ${booking.bookingNumber}. Contact: ${RESTAURANT_CONFIG.phone}`,
      `LOCATION:${RESTAURANT_CONFIG.name}, ${RESTAURANT_CONFIG.address.line1}, ${RESTAURANT_CONFIG.address.city}, Bihar`,
      `DTSTART:${cleanDate}T${startTime}`,
      `DTEND:${cleanDate}T${endTime}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Purvarang_Booking_${booking.bookingNumber}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  // Admin Dashboard Statistics
  getAdminStats: () => {
    const orders = storage.getOrders();
    const bookings = storage.getBookings();
    
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => o.createdAt.startsWith(todayStr));
    const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    
    // Status breakdown
    const activeOrders = orders.filter(o => o.status !== 'Served' && o.status !== 'Cancelled');
    const newCount = orders.filter(o => o.status === 'Received').length;
    const preparingCount = orders.filter(o => o.status === 'Preparing').length;
    const readyCount = orders.filter(o => o.status === 'Ready').length;
    const servedCount = orders.filter(o => o.status === 'Served').length;

    // Simulated weekly revenue trend
    const salesChartData = [
      { day: "Mon", revenue: 8400, orders: 14 },
      { day: "Tue", revenue: 11200, orders: 19 },
      { day: "Wed", revenue: 9800, orders: 16 },
      { day: "Thu", revenue: 13500, orders: 22 },
      { day: "Fri", revenue: 18900, orders: 31 },
      { day: "Sat", revenue: 26400, orders: 42 },
      { day: "Sun", revenue: 31200, orders: 49 },
    ];

    return {
      totalSales,
      todaySales,
      totalOrders: orders.length,
      activeOrdersCount: activeOrders.length,
      newCount,
      preparingCount,
      readyCount,
      servedCount,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'Pending').length,
      salesChartData,
    };
  }
};
