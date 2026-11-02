import React from 'react';
import { Link } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menu';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { Button } from '../components/common/Button';

export const PrintMenu: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-cream text-espresso py-6 px-4 print:p-0 print:bg-white font-sans">
      {/* Non-print toolbar */}
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          to="/menu"
          className="text-[14px] text-clay hover:text-mirchi flex items-center gap-1.5 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          <span>Back to Interactive Menu</span>
        </Link>

        <Button size="sm" variant="primary" onClick={handlePrint} leftIcon={<Printer className="w-4 h-4 stroke-[1.75]" />}>
          Print Menu Card / Save PDF
        </Button>
      </div>

      {/* Printable Menu Sheet (Physical Menu Card Aesthetic) */}
      <div className="max-w-5xl mx-auto bg-white border border-wheat rounded-[16px] p-8 sm:p-12 shadow-soft print:border-0 print:p-2 print:shadow-none print:max-w-none print:bg-white">
        
        {/* Brand Crest Header */}
        <div className="text-center pb-6 border-b border-wheat mb-8 space-y-1.5">
          <span className="font-hindi text-base text-clay font-medium block">
            स्वाद का एक नया रंग
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-widest text-espresso uppercase">
            PURVARANG
          </h1>
          <p className="font-serif text-[13px] text-mirchi font-bold tracking-widest uppercase">
            Family Restaurant
          </p>
          <p className="text-[14px] text-clay pt-1">
            {RESTAURANT_CONFIG.address.full} • Phone: +91 {RESTAURANT_CONFIG.phone}
          </p>
        </div>

        {/* 2-Column Editorial Menu Grid with Dotted Leader Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2">
          {MENU_CATEGORIES.map(cat => {
            const items = MENU_ITEMS.filter(i => i.categorySlug === cat.id);
            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3 break-inside-avoid">
                {/* Category Header with Haldi underline */}
                <div className="border-b border-wheat pb-1.5 flex items-baseline justify-between">
                  <span className="font-serif text-[16px] font-bold uppercase tracking-wider text-espresso">
                    {cat.name}
                  </span>
                  <span className="font-hindi text-[14px] text-clay font-medium">
                    {cat.hindiName}
                  </span>
                </div>

                {/* Items List with dotted leader lines */}
                <div className="space-y-2.5">
                  {items.map(dish => (
                    <div
                      key={dish.id}
                      className="text-[14px] space-y-0.5"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              dish.type === 'veg' ? 'bg-palak' : 'bg-nonveg'
                            }`}
                          />
                          <span className="font-bold text-espresso">
                            {dish.name}
                          </span>
                        </div>

                        {/* Dotted Leader Line */}
                        <span className="flex-1 border-b border-dotted border-wheat min-w-4 translate-y-[-2px]" />

                        <div className="shrink-0 text-right font-serif font-bold text-mirchi">
                          {dish.portions ? (
                            <span className="text-[13px]">
                              {dish.portions.map(p => `${p.portion[0]}: ₹${p.price}`).join(' / ')}
                            </span>
                          ) : dish.price !== null ? (
                            <span>₹{dish.price}</span>
                          ) : (
                            <span className="text-[12px] text-clay">Ask staff</span>
                          )}
                        </div>
                      </div>

                      {dish.description && (
                        <p className="text-[13px] text-clay pl-4 italic line-clamp-1">
                          {dish.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info on printed sheet */}
        <div className="mt-12 pt-6 border-t border-wheat text-center text-[13px] text-clay space-y-1">
          <p className="font-bold text-espresso">
            {RESTAURANT_CONFIG.address.full} • Phone: +91 {RESTAURANT_CONFIG.phone}
          </p>
          <p>Strictly separate vegetarian cooking vessels • Fresh food prepared upon order • GST 5% applicable</p>
          <p className="text-mirchi font-serif text-[14px] italic font-bold pt-1">
            Thank you for dining with Purvarang Family Restaurant
          </p>
        </div>

      </div>
    </div>
  );
};
