import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  MessageSquare,
  ChevronRight,
  ChefHat,
  Tv,
  Monitor,
  Users,
  Receipt,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../../config/restaurant';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-cream border-t-2 border-haldi pt-12 pb-24 lg:pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Character */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[8px] bg-paper text-espresso p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-mirchi fill-current">
                  <path d="M40 32 L50 25 L60 32 L56 36 L44 36 Z" fill="#F5B21B" />
                  <path d="M42 38 H54 C59 38 63 41 63 46 C63 51 59 54 54 54 H48 V68 H42 V38 Z M48 44 V48 H53 C55 48 57 47 57 46 C57 45 55 44 53 44 H48 Z" fill="#C62B1F" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-[20px] font-bold text-white tracking-wide">
                  PURVARANG
                </h3>
                <p className="font-hindi text-[14px] text-haldi">
                  स्वाद का एक नया रंग
                </p>
              </div>
            </div>

            <p className="text-[14px] text-cream/80 leading-relaxed font-sans">
              Family restaurant serving tandoori starters, biryani, paneer and chicken curries, Chinese, pasta, shakes and ice cream.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={RESTAURANT_CONFIG.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-[8px] bg-palak text-white text-[14px] font-medium flex items-center gap-1.5 hover:bg-palak/90 transition-colors"
              >
                <MessageSquare className="w-4 h-4 stroke-[1.75]" />
                <span>WhatsApp</span>
              </a>
              <a
                href={RESTAURANT_CONFIG.socials.phoneCall}
                className="px-3.5 py-2 rounded-[8px] bg-mirchi text-white text-[14px] font-medium flex items-center gap-1.5 hover:bg-[#A82217] transition-colors"
              >
                <Phone className="w-4 h-4 stroke-[1.75]" />
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-serif text-[16px] font-bold uppercase tracking-wider text-haldi mb-3.5 pb-1 border-b border-cream/20 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2 text-[14px]">
              <li>
                <Link to="/menu" className="text-cream/80 hover:text-haldi transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi stroke-[1.75]" />
                  <span>Menu & Ordering</span>
                </Link>
              </li>
              <li>
                <Link to="/book" className="text-cream/80 hover:text-haldi transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi stroke-[1.75]" />
                  <span>Book a Table</span>
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-cream/80 hover:text-haldi transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi stroke-[1.75]" />
                  <span>Offers & Combos</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-cream/80 hover:text-haldi transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi stroke-[1.75]" />
                  <span>Restaurant Gallery</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/80 hover:text-haldi transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi stroke-[1.75]" />
                  <span>About Purvarang</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Address & Phone details */}
          <div>
            <h4 className="font-serif text-[16px] font-bold uppercase tracking-wider text-haldi mb-3.5 pb-1 border-b border-cream/20 inline-block">
              Location & Phone
            </h4>
            <div className="space-y-3 text-[14px] text-cream/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-haldi shrink-0 mt-1 stroke-[1.75]" />
                <div>
                  <p className="font-bold text-white">Address:</p>
                  <p className="text-cream/80">
                    {RESTAURANT_CONFIG.address.full}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Phone className="w-4 h-4 text-haldi shrink-0 stroke-[1.75]" />
                <div>
                  <p className="font-bold text-white">Phone:</p>
                  <a href={`tel:${RESTAURANT_CONFIG.phone}`} className="text-cream hover:text-haldi font-medium">
                    +91 {RESTAURANT_CONFIG.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Staff and demo */}
          <div>
            <h4 className="font-serif text-[16px] font-bold uppercase tracking-wider text-haldi mb-3.5 pb-1 border-b border-cream/20 inline-block">
              Staff and demo
            </h4>
            <ul className="space-y-1.5 text-[14px]">
              <li>
                <Link to="/demo" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Control room (/demo)</span>
                </Link>
              </li>
              <li>
                <Link to="/table/4" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Table 4 QR order (/table/4)</span>
                </Link>
              </li>
              <li>
                <Link to="/kitchen" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Kitchen display (/kitchen)</span>
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Waiting board (/live)</span>
                </Link>
              </li>
              <li>
                <Link to="/waitlist" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Waitlist (/waitlist)</span>
                </Link>
              </li>
              <li>
                <Link to="/waiter" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Waiter desk (/waiter)</span>
                </Link>
              </li>
              <li>
                <Link to="/billing" className="text-cream/80 hover:text-haldi flex items-center gap-1.5 transition-colors">
                  <ChevronRight className="w-3.5 h-3.5 text-haldi" />
                  <span>Cashier (/billing)</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits with Exact Footer Line */}
        <div className="pt-6 border-t border-cream/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-[14px] text-cream/70">
          <p className="font-medium">
            Purvarang Family Restaurant, Tinpulwa Chowk, Lalganj.
          </p>
          <p>© {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
