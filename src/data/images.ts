/**
 * PURVARANG IMAGE ASSETS REGISTRY
 * 
 * Maps conceptual roles and sections to authentic local photography from /public/images/.
 * Every image is a real photo of Purvarang Family Restaurant in Lalganj, Bihar.
 * 
 * To swap or update an image, update the mapping here.
 */

export interface ImageAsset {
  src: string;
  alt: string;
  caption?: string;
  category: 'interior' | 'exterior' | 'food' | 'drinks' | 'dessert' | 'team' | 'brand';
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide' | '4/3';
}

/**
 * Resolves an asset path with Vite's BASE_URL
 * Handles absolute paths (/images/...), relative paths, external URLs, and data URLs.
 */
export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}

export const RESTAURANT_IMAGES = {
  // Brand & Crest
  brandLogo: {
    src: "/images/images-9.jpg",
    alt: "Purvarang Family Restaurant Gold Crest Plaque",
    category: "brand",
    aspectRatio: "portrait",
  },
  brandCrestWall: {
    src: "/images/images-27.jpg",
    alt: "Founder with Purvarang Emblem Backdrop",
    category: "brand",
    aspectRatio: "portrait",
  },

  // Hero Section
  heroDining: {
    src: "/images/images-hero.jpg",
    alt: "Purvarang Restaurant Luxury Dining Hall",
    caption: "Warm ambiance and comfortable family dining",
    category: "interior",
    aspectRatio: "wide",
  },
  heroBannerDish: {
    src: "/images/images-8.jpg",
    alt: "Smoky Tandoori Chicken Tikka Celebration Platter",
    caption: "Signature Charcoal-Grilled Chicken Tikka",
    category: "food",
    aspectRatio: "square",
  },

  // Exterior & Building
  exteriorBuilding: {
    src: "/images/images-4.jpg",
    alt: "Purvarang Family Restaurant and Banquet Hall Building at Tinpulwa Chowk",
    caption: "Our prominent location on Lalganj to Hajipur Road",
    category: "exterior",
    aspectRatio: "portrait",
  },

  // Interior Ambiance & Dining Areas
  interiorMainHall: {
    src: "/images/images-1.jpg",
    alt: "Purvarang Spacious Dining Hall with Designer Ambient Lighting",
    category: "interior",
    aspectRatio: "square",
  },
  interiorBanquetSetup: {
    src: "/images/images-2.jpg",
    alt: "Purvarang Celebration Dining Hall & Banquet Setup",
    category: "interior",
    aspectRatio: "square",
  },
  interiorBoothSeating: {
    src: "/images/images-5.jpg",
    alt: "Cozy Booth Seating and Contemporary Patterned Wall",
    category: "interior",
    aspectRatio: "square",
  },
  interiorEveningBanquet: {
    src: "/images/images-6.jpg",
    alt: "Banquet Hall Illuminated Long Dining Table",
    category: "interior",
    aspectRatio: "square",
  },
  interiorGreenWall: {
    src: "/images/images-11.jpg",
    alt: "Lush Greenery Wall and Dining Enclosure",
    category: "interior",
    aspectRatio: "portrait",
  },
  interiorVipPrivate: {
    src: "/images/images-15.jpg",
    alt: "VIP Family Dining Enclosure with Hexagonal Ceiling Mirrors",
    category: "interior",
    aspectRatio: "portrait",
  },
  interiorSwingPhotobooth: {
    src: "/images/images-19.jpg",
    alt: "Signature Purvarang Swing Photo Zone with Floral Canopy",
    caption: "Guest favorite photography corner",
    category: "interior",
    aspectRatio: "portrait",
  },
  interiorChandelier: {
    src: "/images/images-23.jpg",
    alt: "Dining Hall Ambient Crystal Chandelier",
    category: "interior",
    aspectRatio: "portrait",
  },

  // Team & Leadership
  ownerGreeting: {
    src: "/images/images-27.jpg",
    alt: "Founder of Purvarang Family Restaurant",
    caption: "Dedicated to bringing royal culinary flavors to Vaishali",
    category: "team",
    aspectRatio: "portrait",
  },
  managerBarCounter: {
    src: "/images/images-13.jpg",
    alt: "Purvarang Mocktail Bar Counter & Hospitality Staff",
    caption: "Handcrafted mocktails and warm welcome",
    category: "team",
    aspectRatio: "portrait",
  },
  banquetTeamBanner: {
    src: "/images/images-10.jpg",
    alt: "Purvarang Courteous Service Staff and Dining Hall",
    caption: "Professional hospitality for every family gathering",
    category: "team",
    aspectRatio: "square",
  },
  serviceKitchenTeam: {
    src: "/images/images-21.jpg",
    alt: "Purvarang Service Counter and Kitchen Staff",
    category: "team",
    aspectRatio: "square",
  },

  // Food Specialties
  dishChickenTikka: {
    src: "/images/images-8.jpg",
    alt: "Purvarang Rich & Aromatic Tandoori Chicken Tikka",
    category: "food",
    aspectRatio: "square",
  },
  dishPaneerButterMasala: {
    src: "/images/images-17.jpg",
    alt: "Fresh Paneer Butter Masala presented hot at dining table",
    category: "food",
    aspectRatio: "portrait",
  },
  dishMuttonBotiKabab: {
    src: "/images/images-7.jpg",
    alt: "Tender Mutton Boti Kabab Skewers on Sizzling Platter",
    category: "food",
    aspectRatio: "square",
  },
  dishNorthIndianFeast: {
    src: "/images/images-14.jpg",
    alt: "North Indian Deluxe Spread with Butter Naans and Handi Gravies",
    category: "food",
    aspectRatio: "square",
  },
  dishRoyalSpread: {
    src: "/images/images-20.jpg",
    alt: "Royal Feast with Curries, Breads, and Tandoori Appetizers",
    category: "food",
    aspectRatio: "portrait",
  },
  dishJhalFry: {
    src: "/images/images-22.jpg",
    alt: "Sizzling Jhal Fry vegetable specialty dish",
    category: "food",
    aspectRatio: "portrait",
  },
  dishChineseNoodles: {
    src: "/images/images-24.jpg",
    alt: "Tasty Veg Hakka Noodles with garden fresh bell peppers",
    category: "food",
    aspectRatio: "square",
  },
  dishCrispyStarters: {
    src: "/images/images-18.jpg",
    alt: "Golden Fried Starter Platter with tangy dip",
    category: "food",
    aspectRatio: "portrait",
  },

  // Events & Celebrations
  banquetCelebration: {
    src: "/images/images-25.jpg",
    alt: "Birthday Celebration and Cake Cutting Party at Purvarang",
    caption: "Host your birthdays, anniversaries, and family milestones with us",
    category: "interior",
    aspectRatio: "portrait",
  },

  // Offers & Promo Banner
  offerBanner20Off: {
    src: "/images/images-26.jpg",
    alt: "Flat 20 Percent Discount Offer Announcement at Purvarang",
    caption: "Special 20% discount celebration for Lalganj diners",
    category: "brand",
    aspectRatio: "portrait",
  },

  // Original Printed Menus
  menuCardStarters: {
    src: "/images/images-3.jpg",
    alt: "Original Purvarang Special Non-Veg and Veg Starters Card",
    category: "brand",
    aspectRatio: "portrait",
  },
  menuCardPage1: {
    src: "/images/menu-page-1.jpg",
    alt: "Original Menu Card Side 1: Mocktails, Shakes, Ice Cream, Pasta, Desserts",
    category: "brand",
    aspectRatio: "wide",
  },
  menuCardPage2: {
    src: "/images/menu-page-2.jpg",
    alt: "Original Menu Card Side 2: Chinese, Starters, Main Course, Breads, Biryani",
    category: "brand",
    aspectRatio: "wide",
  },
} as const;

/**
 * Category cover images for the menu browser
 */
export const CATEGORY_COVERS: Record<string, string> = {
  "mocktail": "/images/menu-page-1.jpg",
  "shake": "/images/images-13.jpg",
  "ice-cream": "/images/images-22.jpg",
  "soft-drink": "/images/images-13.jpg",
  "dessert": "/images/images-25.jpg",
  "papad": "/images/images-14.jpg",
  "pasta": "/images/menu-page-1.jpg",
  "chinese-veg": "/images/images-24.jpg",
  "chinese-non-veg": "/images/images-24.jpg",
  "sizzler": "/images/images-8.jpg",
  "starter-veg": "/images/images-3.jpg",
  "starter-non-veg": "/images/images-7.jpg",
  "soup": "/images/menu-page-2.jpg",
  "main-course-veg": "/images/images-17.jpg",
  "main-course-non-veg": "/images/images-20.jpg",
  "bread-and-rice": "/images/images-14.jpg",
  "biryani": "/images/menu-page-2.jpg",
  "salad-and-raita": "/images/images-7.jpg",
};

/**
 * Gallery Items List for the Gallery page with masonry layout
 */
export const GALLERY_ITEMS: ImageAsset[] = [
  {
    src: "/images/images-hero.jpg",
    alt: "Fine Dine Main Hall with Lush Green Living Wall",
    caption: "Spacious seating with warm gold ambiance",
    category: "interior",
    aspectRatio: "wide",
  },
  {
    src: "/images/images-8.jpg",
    alt: "Purvarang Signature Charcoal Chicken Tikka",
    caption: "Marinated overnight and slow-cooked in charcoal clay tandoor",
    category: "food",
    aspectRatio: "square",
  },
  {
    src: "/images/images-4.jpg",
    alt: "Purvarang Restaurant & Banquet Facade at Tinpulwa Chowk",
    caption: "Multi-level restaurant building on Lalganj to Hajipur road",
    category: "exterior",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-19.jpg",
    alt: "Purvarang Floral Swing Photo Zone",
    caption: "Memorable moments at our signature floral selfie swing",
    category: "interior",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-17.jpg",
    alt: "Fresh Creamy Paneer Butter Masala",
    caption: "Prepared with rich makhani gravy and soft cottage cheese",
    category: "food",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-7.jpg",
    alt: "Mutton Boti Kabab Skewer Platter",
    caption: "Succulent mutton chunks spiced with royal herbs",
    category: "food",
    aspectRatio: "square",
  },
  {
    src: "/images/images-1.jpg",
    alt: "Panoramic View of the Dining Hall",
    caption: "Comfortable family booth seating with air conditioning",
    category: "interior",
    aspectRatio: "square",
  },
  {
    src: "/images/images-14.jpg",
    alt: "Lavish North Indian Family Spread",
    caption: "Garlic naans, dal tadka, and signature handi curries",
    category: "food",
    aspectRatio: "square",
  },
  {
    src: "/images/images-24.jpg",
    alt: "Crispy Wok Veg Hakka Noodles",
    caption: "Tossed in fiery Indo-Chinese sauces and fresh greens",
    category: "food",
    aspectRatio: "square",
  },
  {
    src: "/images/images-15.jpg",
    alt: "Private VIP Dining Booth with Mirror Ceilings",
    caption: "Reserved comfort for celebrations and family parties",
    category: "interior",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-13.jpg",
    alt: "Purvarang Mocktail Bar Counter",
    caption: "Refreshing mocktails, chillers, and milkshakes",
    category: "drinks",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-25.jpg",
    alt: "Family Birthday Celebration in Banquet Hall",
    caption: "Memorable parties and festive gatherings",
    category: "interior",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-26.jpg",
    alt: "Flat 20% OFF Special Season Offer",
    caption: "Special culinary discounts for Lalganj food lovers",
    category: "brand",
    aspectRatio: "portrait",
  },
  {
    src: "/images/images-27.jpg",
    alt: "Founder at Purvarang Emblem Wall",
    caption: "Committed to quality food and Bihari warmth",
    category: "team",
    aspectRatio: "portrait",
  },
];
