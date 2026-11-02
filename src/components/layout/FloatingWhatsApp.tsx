import React from 'react';
import { MessageSquareText } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../../config/restaurant';

export const FloatingWhatsApp: React.FC = () => {
  const whatsappUrl = `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    "Namaste Purvarang Restaurant! I would like to inquire about food orders / table reservations."
  )}`;

  return (
    <aside aria-label="Quick WhatsApp Contact" className="fixed bottom-20 lg:bottom-8 right-4 sm:right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-palak hover:bg-[#163826] text-white border border-palak shadow-soft transition-all duration-200"
        aria-label="Direct WhatsApp Chat with Purvarang Family Restaurant"
      >
        <MessageSquareText className="w-5 h-5 text-white stroke-[1.75]" />
        <span className="font-sans font-semibold text-[14px] hidden sm:inline">
          WhatsApp Us
        </span>
      </a>
    </aside>
  );
};
