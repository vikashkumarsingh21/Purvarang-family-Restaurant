/**
 * PURVARANG FAMILY RESTAURANT CONFIGURATION
 * Single source of truth for restaurant details, contact, and operational settings.
 * 
 * CONTENT RULES:
 * Facts NOT confirmed by the restaurant owner are set to null and hidden in the UI until verified.
 * The restaurant serves BOTH vegetarian and non-vegetarian food. No "pure veg" claims.
 * No invented specialties, awards, or fake claims.
 */

export interface RestaurantConfig {
  name: string;
  tagline: string;
  taglineHindi: string;
  phone: string;
  whatsappNumber: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    district: string;
    state: string;
    country: string;
    full: string;
    pinCode: string | null; // TODO_CONFIRM: Pin code not confirmed by owner
    landmark: string | null; // TODO_CONFIRM: Nearby landmark not confirmed by owner
    mapsSearchQuery: string;
    googleMapsUrl: string;
    embedMapUrl: string;
  };
  openingHours: {
    display: string;
    lastOrderTime: string;
  } | null; // TODO_CONFIRM: Exact opening and closing hours not confirmed by owner
  banquet: {
    available: boolean;
    capacity: number | null; // TODO_CONFIRM: Exact banquet hall guest capacity
  } | null;
  establishmentYear: number | null; // TODO_CONFIRM: Year established not confirmed
  awards: string[] | null; // TODO_CONFIRM: Awards not confirmed
  ratings: {
    average: number | null;
    count: number | null;
  } | null; // TODO_CONFIRM: External public ratings not confirmed
  socials: {
    whatsapp: string;
    phoneCall: string;
    instagram: string | null; // TODO_CONFIRM: Social handle not confirmed
    facebook: string | null;
  };
  billing: {
    currency: string;
    gstPercentage: number;
    packagingChargePreorder: number;
    gstin?: string;
  };
  tables: {
    total: number;
  };
  demoCoupons: Array<{
    code: string;
    discountPercent?: number;
    discountAmount?: number;
    description: string;
    minOrder: number;
    maxDiscount?: number;
  }>;
  demoStaffPins: {
    owner: string;
    chef: string;
    waiter: string;
    cashier: string;
  };
}

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: "Purvarang Family Restaurant",
  tagline: "Swad ka ek nya rang",
  taglineHindi: "स्वाद का एक नया रंग",
  phone: "9693633870",
  whatsappNumber: "919693633870",
  
  address: {
    line1: "Tinpulwa Chowk",
    line2: "Lalganj to Hajipur Road",
    city: "Lalganj",
    district: "Vaishali",
    state: "Bihar",
    country: "India",
    full: "Tinpulwa Chowk, Lalganj to Hajipur Road, Lalganj, Vaishali, Bihar, India",
    pinCode: null, // TODO_CONFIRM
    landmark: null, // TODO_CONFIRM
    mapsSearchQuery: "Tinpulwa Chowk, Lalganj, Vaishali, Bihar",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar",
    embedMapUrl: "https://maps.google.com/maps?q=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
  },
  
  // Opening hours not confirmed - hidden in UI until confirmed
  openingHours: null, // TODO_CONFIRM

  // Banquet details not confirmed
  banquet: null, // TODO_CONFIRM

  establishmentYear: null, // TODO_CONFIRM
  awards: null, // TODO_CONFIRM
  ratings: null, // TODO_CONFIRM

  socials: {
    whatsapp: "https://wa.me/919693633870?text=Namaste%20Purvarang,%20I%20would%20like%20to%20inquire%20about%20a%20table%20or%20food%20order.",
    phoneCall: "tel:9693633870",
    instagram: null, // TODO_CONFIRM
    facebook: null, // TODO_CONFIRM
  },

  billing: {
    currency: "₹",
    gstPercentage: 5,
    packagingChargePreorder: 20,
    gstin: "10AAAAA0000A1Z5",
  },

  tables: {
    total: 30,
  },

  demoCoupons: [
    { code: "PURVA20", discountPercent: 20, description: "Flat 20% OFF on all orders above ₹499", minOrder: 499, maxDiscount: 150 },
    { code: "FAMILY100", discountAmount: 100, description: "Flat ₹100 OFF on Family orders above ₹899", minOrder: 899 },
    { code: "WELCOME", discountPercent: 15, description: "15% Welcome discount for new customers", minOrder: 299, maxDiscount: 80 },
    { code: "BIRYANI50", discountAmount: 50, description: "₹50 OFF on any Biryani combo above ₹399", minOrder: 399 },
  ],

  demoStaffPins: {
    owner: "1111",
    chef: "2222",
    waiter: "3333",
    cashier: "4444"
  }
};

/**
 * Live Demo & Operations Settings
 * DEMO_SPEED: 3 real seconds = 1 kitchen minute (so colour transitions are clearly visible)
 */
export const DEMO_SPEED = 3;

export const LIVE_TICKER_ANNOUNCEMENTS = [
  "Welcome to Purvarang Family Restaurant • Tinpulwa Chowk, Lalganj",
  "Fresh food prepared to order • Pure desi ghee preparation available on request",
  "Separate vegetarian and non-vegetarian cooking stations",
  "Please keep your order token ready at the pickup counter",
  "Scan QR on your table to request water, call waiter or ask for bill"
];

