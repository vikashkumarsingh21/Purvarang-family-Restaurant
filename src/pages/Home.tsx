import React from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  CalendarDays,
  ShoppingBag,
  Award,
  ShieldCheck,
  ChevronRight,
  Phone,
  MessageSquare,
  QrCode,
  Flame,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { RESTAURANT_IMAGES, CATEGORY_COVERS } from '../data/images';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';
import { DishCard } from '../components/menu/DishCard';
import { Button } from '../components/common/Button';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { JaaliDivider } from '../components/common/JaaliDivider';
import { StampBadge } from '../components/common/StampBadge';
import { storage } from '../lib/storage';

export const Home: React.FC = () => {
  const reviews = storage.getReviews().slice(0, 3);
  const signatureDishes = MENU_ITEMS.filter(d => d.isBestseller || d.isChefPick).slice(0, 6);

  return (
    <div className="space-y-0 text-espresso bg-cream">
      {/* 1. HERO SECTION */}
      <section className="relative bg-cream pt-10 pb-16 md:pt-16 md:pb-24 border-b border-wheat overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-wheat text-[14px] font-semibold text-palak shadow-soft">
                <MapPin className="w-4 h-4 text-mirchi shrink-0" strokeWidth={1.75} />
                <span>Lalganj, Vaishali</span>
              </div>

              <div>
                <span className="font-hindi text-[20px] sm:text-[24px] text-clay font-medium block mb-2">
                  स्वाद का एक नया रंग
                </span>
                <h1 className="font-serif text-[clamp(40px,6.5vw,76px)] font-bold text-espresso leading-[1.08] tracking-tight max-w-[14ch] [text-wrap:balance]">
                  Swad ka ek nya rang, now at your table.
                </h1>
              </div>

              <p className="text-[16px] sm:text-[17px] text-clay leading-relaxed font-sans max-w-xl">
                Tandoori starters, biryani, paneer and chicken curries, Chinese, pasta, shakes and ice cream. Order from your table, pre-order for pickup, or book a table for the family.
              </p>

              {/* 3 Prominent Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button size="lg" fullWidth leftIcon={<ShoppingBag className="w-5 h-5" />}>
                    Order Now
                  </Button>
                </Link>
                <Link to="/book" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" fullWidth leftIcon={<CalendarDays className="w-5 h-5" />}>
                    Book a Table
                  </Button>
                </Link>
                <Link to="/menu" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth leftIcon={<UtensilsCrossed className="w-5 h-5" />}>
                    See the Menu
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-6 border-t border-wheat">
                <div className="p-3.5 rounded-[12px] bg-white border border-wheat shadow-soft">
                  <p className="text-[14px] font-bold text-palak">Pure Veg & Non-Veg</p>
                  <p className="text-[14px] text-clay">Separate pans and preparation</p>
                </div>
                <div className="p-3.5 rounded-[12px] bg-white border border-wheat shadow-soft">
                  <p className="text-[14px] font-bold text-mirchi">Charcoal Tandoor</p>
                  <p className="text-[14px] text-clay">Earthen kiln fired breads and tikkas</p>
                </div>
                <div className="p-3.5 rounded-[12px] bg-white border border-wheat shadow-soft col-span-2 sm:col-span-1">
                  <p className="text-[14px] font-bold text-espresso">QR Table Ordering</p>
                  <p className="text-[14px] text-clay">Direct kitchen dispatch from mobile</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Overlapping Stamp */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Main Photo Frame */}
                <div className="relative bg-white p-3 rounded-[16px] border border-wheat shadow-soft">
                  <div className="aspect-[4/3] sm:aspect-square overflow-hidden rounded-[12px] bg-paper">
                    <ImageWithFallback
                      src={RESTAURANT_IMAGES.heroDining.src}
                      alt={RESTAURANT_IMAGES.heroDining.alt}
                      aspectRatio="4/3"
                      category="interior"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[14px] text-clay px-1">
                    <span className="font-serif italic text-espresso">Family Dining Hall at Tinpulwa Chowk</span>
                    <span className="font-sans font-medium text-palak">Warm & Welcoming</span>
                  </div>
                </div>

                {/* Overlapping Rotated Stamp Badge */}
                <div className="absolute -top-7 -right-6 sm:-top-9 sm:-right-8 z-20">
                  <StampBadge size={130} />
                </div>

                {/* Small note */}
                <div className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-6 z-20 bg-white p-3.5 rounded-[12px] border border-wheat shadow-soft max-w-[220px]">
                  <p className="font-serif text-[15px] font-bold text-espresso">Taste of Bihar</p>
                  <p className="text-[14px] text-clay mt-0.5 leading-snug">
                    Handi meat and clay-oven breads cooked fresh to your order.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. FROM OUR MENU SECTION */}
      <section className="bg-cream py-16 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[14px] text-mirchi font-bold uppercase tracking-wider mb-1.5">
                <Award className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
                <span>From our menu</span>
              </div>
              <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-bold text-espresso">
                Dishes families order the most
              </h2>
              <p className="text-[16px] text-clay mt-1">
                Hand-crafted dishes prepared with ground spices, fresh ingredients and rich gravies.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-[15px] font-bold text-mirchi hover:underline group"
            >
              <span>Explore all dishes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
            </Link>
          </div>

          <JaaliDivider variant="wheat" className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signatureDishes.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/menu">
              <Button size="lg" variant="primary">
                View Full Menu Card
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 3. TODAY'S KITCHEN HIGHLIGHT */}
      <section className="bg-paper py-16 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[16px] border border-wheat p-6 sm:p-10 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Photo Frame */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="p-2.5 bg-paper rounded-[12px] border border-wheat">
                  <div className="aspect-[4/3] rounded-[8px] overflow-hidden">
                    <ImageWithFallback
                      src={RESTAURANT_IMAGES.heroBannerDish.src}
                      alt={RESTAURANT_IMAGES.heroBannerDish.alt}
                      aspectRatio="4/3"
                      category="food"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center font-serif text-[14px] italic text-clay mt-2.5">
                    Charcoal-roasted Chicken Tikka straight from the clay tandoor
                  </p>
                </div>
              </div>

              {/* Copy */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-haldi/15 text-espresso border border-haldi text-[14px] font-semibold">
                  <Flame className="w-4 h-4 text-kesar" strokeWidth={2} />
                  <span>Chef Recommendation</span>
                </div>

                <h3 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-espresso leading-tight">
                  Smoky Earthen <span className="text-mirchi">Chicken Tikka</span>
                </h3>

                <p className="text-[16px] text-clay leading-relaxed font-sans">
                  Marinated in hung curd, freshly pounded ginger, garlic and roasted garam masala. Charred on red-hot earthen coals until tender and smoky, brushed with butter and served with fresh mint chutney.
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-2 pb-2">
                  <div>
                    <span className="text-[14px] font-semibold text-clay block uppercase tracking-wider">Price</span>
                    <span className="font-serif text-3xl font-bold text-mirchi">₹259</span>
                  </div>
                  <div className="h-10 w-[1px] bg-wheat" />
                  <div>
                    <span className="text-[14px] font-semibold text-clay block uppercase tracking-wider">Service Mode</span>
                    <span className="text-[15px] font-bold text-palak">Dine-in Table QR & Takeaway</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link to="/menu">
                    <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Order Dish
                    </Button>
                  </Link>
                  <a
                    href={`tel:${RESTAURANT_CONFIG.phone}`}
                    className="px-5 py-3 rounded-[10px] bg-paper text-espresso border border-wheat text-[15px] font-semibold flex items-center gap-2 hover:bg-wheat/50 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
                    <span>Call 9693633870</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION */}
      <section className="bg-cream py-16 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[14px] text-mirchi font-bold uppercase tracking-wider block mb-1">
              Easy & Fast
            </span>
            <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-bold text-espresso">
              How it works
            </h2>
            <p className="text-[16px] text-clay mt-1">
              Experience smooth dining at your fingertips from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-[14px] bg-white border border-wheat shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center font-serif text-[22px] font-bold text-espresso mb-4">
                  1
                </div>
                <h3 className="font-serif text-[20px] font-bold text-espresso mb-2">
                  Sit down and scan the QR on your table.
                </h3>
                <p className="text-[15px] text-clay leading-relaxed">
                  Every table features an easy-to-scan QR code. Open your smartphone camera to view our complete menu with live prices and veg/non-veg markers.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-wheat">
                <Link to="/table/4" className="text-[14px] font-bold text-mirchi hover:underline flex items-center gap-1">
                  <span>Try Table 4 demo ordering</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-[14px] bg-white border border-wheat shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center font-serif text-[22px] font-bold text-espresso mb-4">
                  2
                </div>
                <h3 className="font-serif text-[20px] font-bold text-espresso mb-2">
                  Pick your dishes and send the order to the kitchen.
                </h3>
                <p className="text-[15px] text-clay leading-relaxed">
                  Choose your portions, add spice or cooking notes, and dispatch directly to the kitchen display screen.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-wheat text-[14px] text-clay">
                Fresh cooking: approx. 15-20 minutes
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-[14px] bg-white border border-wheat shadow-soft flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center font-serif text-[22px] font-bold text-espresso mb-4">
                  3
                </div>
                <h3 className="font-serif text-[20px] font-bold text-espresso mb-2">
                  Watch your order status and pay at the counter.
                </h3>
                <p className="text-[15px] text-clay leading-relaxed">
                  Track cooking and ready progress on your phone. When finished, request your bill with a single tap and settle with cash or UPI.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-wheat">
                <Link to="/book" className="text-[14px] font-bold text-palak hover:underline flex items-center gap-1">
                  <span>Reserve a family table ahead</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. POPULAR CATEGORIES */}
      <section className="bg-paper py-16 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[14px] text-palak font-bold uppercase tracking-wider block mb-1">
                Variety For Everyone
              </span>
              <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-bold text-espresso">
                Popular Menu Sections
              </h2>
              <p className="text-[16px] text-clay mt-1">
                From hearty curries and hot breads to chilled mocktails and desserts.
              </p>
            </div>
            <Link to="/menu" className="text-[15px] font-bold text-mirchi hover:underline flex items-center gap-1">
              <span>View all categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MENU_CATEGORIES.slice(0, 6).map(cat => (
              <Link
                key={cat.id}
                to={`/menu?category=${cat.id}`}
                className="group p-3 rounded-[12px] bg-white border border-wheat shadow-soft hover:border-clay/40 transition-all flex flex-col justify-between"
              >
                <div className="aspect-square rounded-[8px] overflow-hidden border border-wheat/60 mb-3 bg-paper">
                  <ImageWithFallback
                    src={CATEGORY_COVERS[cat.id] || cat.image}
                    alt={cat.name}
                    aspectRatio="square"
                    category={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center pb-1">
                  <h4 className="font-serif text-[16px] font-bold text-espresso line-clamp-1 group-hover:text-mirchi transition-colors">
                    {cat.name}
                  </h4>
                  <p className="font-hindi text-[14px] text-clay mt-0.5">
                    {cat.hindiName}
                  </p>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 6. REAL GUEST REVIEWS */}
      <section className="bg-cream py-16 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[14px] text-palak font-bold uppercase tracking-wider block mb-1">
              Guest Feedback
            </span>
            <h2 className="font-serif text-[clamp(30px,4vw,44px)] font-bold text-espresso">
              Loved by Lalganj Families
            </h2>
            <p className="text-[16px] text-clay mt-1">
              Honest words from local diners and travelers stopping on Hajipur Road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white border border-wheat rounded-[14px] p-6 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i} className="text-haldi text-lg">★</span>
                    ))}
                  </div>

                  <p className="text-[15px] text-espresso leading-relaxed italic mb-4 font-serif">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-4 border-t border-wheat flex items-center justify-between">
                  <div>
                    <h4 className="text-[15px] font-bold text-espresso">{rev.customerName}</h4>
                    {rev.dishRecommended && (
                      <p className="text-[14px] text-clay mt-0.5">
                        Liked: {rev.dishRecommended}
                      </p>
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-palak bg-palak/10 px-2.5 py-1 rounded-full border border-palak/20">
                    Guest
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/reviews">
              <Button variant="outline" size="sm">
                Read all guest reviews or share your feedback
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* 7. VISIT US & MAP BLOCK */}
      <section className="bg-paper py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[16px] border border-wheat p-6 sm:p-10 shadow-soft">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[14px] text-mirchi font-bold uppercase tracking-wider block">
                  Location & Directions
                </span>
                <h3 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
                  Visit us at Tinpulwa Chowk
                </h3>
                <p className="text-[15px] text-clay leading-relaxed">
                  Located directly on the main Lalganj to Hajipur Road, Lalganj, Vaishali, Bihar with convenient vehicle parking.
                </p>

                <div className="space-y-3 pt-2 text-[15px] text-espresso">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-5 h-5 text-mirchi shrink-0 mt-0.5" strokeWidth={1.75} />
                    <span>{RESTAURANT_CONFIG.address.full}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-5 h-5 text-palak shrink-0" strokeWidth={1.75} />
                    <span>Phone: {RESTAURANT_CONFIG.phone}</span>
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-3">
                  <a
                    href={`tel:${RESTAURANT_CONFIG.phone}`}
                    className="px-5 py-3 rounded-[10px] bg-mirchi hover:bg-[#A82217] text-white font-semibold text-[15px] flex items-center gap-2 transition-colors shadow-soft"
                  >
                    <Phone className="w-4 h-4" strokeWidth={2} />
                    <span>Call To Reserve</span>
                  </a>
                  <a
                    href={RESTAURANT_CONFIG.socials.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-[10px] bg-palak hover:bg-[#163826] text-white font-semibold text-[15px] flex items-center gap-2 transition-colors shadow-soft"
                  >
                    <MessageSquare className="w-4 h-4" strokeWidth={2} />
                    <span>WhatsApp Direction</span>
                  </a>
                </div>

                <div className="pt-2">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] font-semibold text-mirchi hover:underline inline-flex items-center gap-1"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Map Frame */}
              <div className="lg:col-span-7 h-72 sm:h-84 rounded-[12px] overflow-hidden border border-wheat bg-paper shadow-soft">
                <iframe
                  title="Purvarang Location Map"
                  src="https://maps.google.com/maps?q=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
