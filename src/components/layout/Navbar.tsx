import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Globe,
  CalendarDays,
  ChefHat,
  Monitor,
  Users,
  Tv
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../../config/restaurant';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { itemCount, subtotal } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('navHome') },
    { path: '/menu', label: t('navMenu') },
    { path: '/offers', label: t('navOffers') },
    { path: '/gallery', label: t('navGallery') },
    { path: '/about', label: t('navAbout') },
    { path: '/reviews', label: t('navReviews') },
    { path: '/contact', label: t('navContact') },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-wheat shadow-soft-sm h-[72px] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Logo Left */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 group focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-[10px] bg-paper border border-wheat p-1.5 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-mirchi fill-current">
                <path d="M40 32 L50 25 L60 32 L56 36 L44 36 Z" fill="#F5B21B" />
                <circle cx="50" cy="23" r="2.5" fill="#F5B21B"/>
                <path d="M42 38 H54 C59 38 63 41 63 46 C63 51 59 54 54 54 H48 V68 H42 V38 Z M48 44 V48 H53 C55 48 57 47 57 46 C57 45 55 44 53 44 H48 Z" fill="#C62B1F" />
                <path d="M34 74 C42 71 58 71 66 74" stroke="#2B1A12" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="leading-tight">
              <span className="font-serif text-[22px] font-bold tracking-tight text-espresso block">
                PURVARANG
              </span>
              <span className="font-hindi text-[14px] text-clay font-medium block">
                {language === 'hi' ? RESTAURANT_CONFIG.taglineHindi : "स्वाद का एक नया रंग"}
              </span>
            </div>
          </Link>

          {/* Links Centred */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[16px] font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-mirchi font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-mirchi'
                      : 'text-espresso/80 hover:text-mirchi'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language, Cart, Book Table CTA */}
          <div className="flex items-center gap-3">
            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-2 rounded-[10px] bg-paper hover:bg-wheat text-espresso text-[14px] font-medium flex items-center gap-1.5 transition-colors"
              title="Switch Language / भाषा बदलें"
              aria-label="Switch Language"
            >
              <Globe className="w-4 h-4 text-mirchi stroke-[1.75]" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Cart Icon with Count */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-3 py-2 rounded-[10px] bg-paper hover:bg-wheat text-espresso text-[15px] font-semibold transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5 text-espresso stroke-[1.75]" />
              <span className="hidden sm:inline">
                {itemCount > 0 ? `₹${subtotal}` : t('navCart')}
              </span>
              {itemCount > 0 && (
                <span className="w-5 h-5 bg-mirchi text-white text-[14px] rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* One Mirchi "Book a Table" Button */}
            <Link to="/book" className="hidden sm:inline-block">
              <button className="h-[48px] px-5 rounded-[10px] bg-mirchi hover:bg-mirchi-hover text-white font-sans font-semibold text-[16px] transition-all shadow-soft-sm active:scale-[0.98]">
                {t('bookTable')}
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="p-2.5 rounded-[10px] bg-paper text-espresso lg:hidden transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.75]" /> : <MenuIcon className="w-6 h-6 stroke-[1.75]" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-[72px] inset-x-0 bg-white border-b border-wheat p-5 space-y-4 shadow-soft-lg z-50 animate-fade-up">
          <div className="grid grid-cols-2 gap-2.5">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`p-3 rounded-[10px] text-[15px] font-medium transition-colors ${
                    isActive
                      ? 'bg-mirchi text-white font-bold'
                      : 'bg-paper text-espresso hover:bg-wheat'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-wheat flex flex-col gap-2.5">
            <Link
              to="/book"
              onClick={closeMobileMenu}
              className="w-full h-[48px] rounded-[10px] bg-mirchi text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-soft-sm"
            >
              <CalendarDays className="w-4 h-4 stroke-[1.75]" />
              <span>{t('bookTable')}</span>
            </Link>

            {/* Staff Shortcuts */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <Link
                to="/kitchen"
                onClick={closeMobileMenu}
                className="py-2.5 px-2 rounded-[8px] bg-paper text-espresso text-[14px] font-medium flex items-center justify-center gap-1.5"
              >
                <ChefHat className="w-4 h-4 text-mirchi stroke-[1.75]" />
                <span>Kitchen</span>
              </Link>
              <Link
                to="/live"
                onClick={closeMobileMenu}
                className="py-2.5 px-2 rounded-[8px] bg-paper text-espresso text-[14px] font-medium flex items-center justify-center gap-1.5"
              >
                <Tv className="w-4 h-4 text-kesar stroke-[1.75]" />
                <span>TV Board</span>
              </Link>
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="py-2.5 px-2 rounded-[8px] bg-paper text-espresso text-[14px] font-medium flex items-center justify-center gap-1.5"
              >
                <Monitor className="w-4 h-4 text-palak stroke-[1.75]" />
                <span>Admin</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
