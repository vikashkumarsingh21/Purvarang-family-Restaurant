import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingBag, CalendarDays } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  const { t } = useLanguage();

  const links = [
    { path: '/', label: t('navHome'), icon: Home },
    { path: '/menu', label: t('navMenu'), icon: UtensilsCrossed },
    { path: '/cart', label: t('navCart'), icon: ShoppingBag, hasBadge: true },
    { path: '/book', label: t('navBook'), icon: CalendarDays },
  ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-wheat pb-safe shadow-soft"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center justify-center relative py-1 transition-colors ${
                isActive ? 'text-mirchi font-bold' : 'text-clay hover:text-espresso'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2]' : 'stroke-[1.75]'}`} />
                {link.hasBadge && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-mirchi text-white text-[11px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-[12px] mt-0.5 leading-tight font-medium">
                {link.label}
              </span>
              {isActive && (
                <span className="absolute top-0 inset-x-6 h-[2px] bg-mirchi rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
