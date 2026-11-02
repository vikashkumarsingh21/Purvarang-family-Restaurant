import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../lib/storage';

export type Language = 'en' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Navigation
  navHome: { en: "Home", hi: "होम" },
  navMenu: { en: "Menu", hi: "मेन्यू" },
  navBook: { en: "Book Table", hi: "टेबल बुक करें" },
  navOffers: { en: "Offers", hi: "ऑफ़र्स" },
  navGallery: { en: "Gallery", hi: "गैलरी" },
  navAbout: { en: "About", hi: "परिचय" },
  navReviews: { en: "Reviews", hi: "समीक्षाएं" },
  navContact: { en: "Contact", hi: "संपर्क" },
  navCart: { en: "Cart", hi: "कार्ट" },
  navAdmin: { en: "Admin", hi: "एडमिन" },

  // CTAs
  orderOnline: { en: "Order Online", hi: "ऑनलाइन ऑर्डर" },
  bookTable: { en: "Book a Table", hi: "टेबल रिज़र्व करें" },
  viewMenu: { en: "Explore Menu", hi: "मेन्यू देखें" },
  callUs: { en: "Call Restaurant", hi: "कॉल करें" },
  whatsappUs: { en: "WhatsApp Us", hi: "व्हाट्सएप करें" },
  addToCart: { en: "Add to Order", hi: "कार्ट में जोड़ें" },

  // Food badges
  veg: { en: "Pure Veg", hi: "शुद्ध शाकाहारी" },
  nonVeg: { en: "Non-Veg", hi: "मांसाहारी" },
  bestseller: { en: "Bestseller", hi: "बेस्टसेलर" },
  chefPick: { en: "Chef's Special", hi: "शेफ स्पेशल" },
  askStaff: { en: "Ask staff", hi: "स्टाफ से पूछें" },

  // Dining
  tableOrderTitle: { en: "Table Ordering", hi: "टेबल से ऑर्डर" },
  callWaiter: { en: "Call Waiter", hi: "वेटर बुलाएं" },
  requestWater: { en: "Request Water", hi: "पानी मंगवाएं" },
  askBill: { en: "Request Bill", hi: "बिल मंगवाएं" },

  // Tagline
  tagline: { en: "Swad ka ek nya rang", hi: "स्वाद का एक नया रंग" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => storage.getLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storage.setLanguage(lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en';
    setLanguage(next);
  };

  const t = (key: string): string => {
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
