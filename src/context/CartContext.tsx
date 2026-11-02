import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, OrderType } from '../types';
import { storage } from '../lib/storage';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { getDishStation } from '../lib/orderStore';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  gst: number;
  packagingFee: number;
  discount: number;
  total: number;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: number | null;
  setTableNumber: (table: number | null) => void;
  couponCode: string | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addItem: (item: MenuItem, portion?: 'Half' | 'Full', notes?: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemQuantity: (menuItemId: string, portion?: 'Half' | 'Full') => number;
  favorites: string[];
  toggleFavorite: (dishId: string) => void;
  isFavorite: (dishId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => storage.getCart());
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [favorites, setFavorites] = useState<string[]>(() => storage.getFavorites());

  // Save cart changes to localStorage
  useEffect(() => {
    storage.saveCart(items);
  }, [items]);

  // Calculations
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packagingFee = orderType === 'pre-order' && items.length > 0 ? RESTAURANT_CONFIG.billing.packagingChargePreorder : 0;

  // Re-calculate coupon discount if subtotal changes
  useEffect(() => {
    if (!couponCode) {
      setCouponDiscount(0);
      return;
    }
    const found = RESTAURANT_CONFIG.demoCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (!found || subtotal < (found.minOrder || 0)) {
      setCouponDiscount(0);
      if (found && subtotal < (found.minOrder || 0)) {
        setCouponCode(null);
      }
      return;
    }
    if (found.discountPercent) {
      const disc = Math.round((subtotal * found.discountPercent) / 100);
      setCouponDiscount(found.maxDiscount ? Math.min(disc, found.maxDiscount) : disc);
    } else if (found.discountAmount) {
      setCouponDiscount(found.discountAmount);
    }
  }, [subtotal, couponCode]);

  const discount = couponDiscount;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = Math.round((taxableAmount * RESTAURANT_CONFIG.billing.gstPercentage) / 100);
  const total = taxableAmount + gst + packagingFee;

  const addItem = (dish: MenuItem, portion?: 'Half' | 'Full', notes?: string) => {
    if (dish.price === null && !dish.portions) return; // Unpriced items cannot be directly ordered online

    let itemPrice = dish.price || 0;
    if (portion && dish.portions) {
      const foundPortion = dish.portions.find(p => p.portion === portion);
      if (foundPortion) itemPrice = foundPortion.price;
    }

    const uniqueId = portion ? `${dish.id}-${portion}` : dish.id;

    setItems(prev => {
      const existing = prev.find(i => i.id === uniqueId);
      if (existing) {
        return prev.map(i =>
          i.id === uniqueId
            ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes }
            : i
        );
      }
      return [
        ...prev,
        {
          id: uniqueId,
          menuItemId: dish.id,
          name: dish.name,
          hindiName: dish.hindiName,
          price: itemPrice,
          portion,
          quantity: 1,
          type: dish.type,
          notes,
          station: getDishStation(dish.categorySlug, dish.name),
          image: dish.image,
        },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const updateNotes = (id: string, notes: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, notes } : i));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setCouponDiscount(0);
    storage.clearCart();
  };

  const getItemQuantity = (menuItemId: string, portion?: 'Half' | 'Full'): number => {
    const uniqueId = portion ? `${menuItemId}-${portion}` : menuItemId;
    const item = items.find(i => i.id === uniqueId);
    return item ? item.quantity : 0;
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const coupon = RESTAURANT_CONFIG.demoCoupons.find(c => c.code.toUpperCase() === clean);
    if (!coupon) {
      return { success: false, message: "Invalid coupon code." };
    }
    if (subtotal < (coupon.minOrder || 0)) {
      return {
        success: false,
        message: `Order subtotal must be at least ₹${coupon.minOrder} to apply this code.`
      };
    }

    setCouponCode(clean);
    return { success: true, message: `Coupon ${clean} applied successfully!` };
  };

  const removeCoupon = () => {
    setCouponCode(null);
    setCouponDiscount(0);
  };

  const handleToggleFavorite = (dishId: string) => {
    const updated = storage.toggleFavorite(dishId);
    setFavorites(updated);
  };

  const isFavorite = (dishId: string) => favorites.includes(dishId);

  return (
    <CartContext.Provider
      value={{
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
        couponDiscount,
        applyCoupon,
        removeCoupon,
        addItem,
        updateQuantity,
        updateNotes,
        removeItem,
        clearCart,
        getItemQuantity,
        favorites,
        toggleFavorite: handleToggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
