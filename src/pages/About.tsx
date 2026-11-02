import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Flame,
  UtensilsCrossed,
  CalendarDays
} from 'lucide-react';
import { RESTAURANT_IMAGES } from '../data/images';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Button } from '../components/common/Button';

export const About: React.FC = () => {
  return (
    <div className="space-y-0 text-espresso bg-cream">
      
      {/* 1. Header Banner */}
      <section className="bg-cream py-14 sm:py-20 border-b border-wheat text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
            <Sparkles className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
            <span>Our Roots & Passion</span>
          </div>
          <span className="font-hindi text-[20px] sm:text-[24px] text-clay font-medium block">
            स्वाद का एक नया रंग
          </span>
          <h1 className="font-serif text-[clamp(32px,4.5vw,52px)] font-bold text-espresso">
            About Purvarang
          </h1>
          <p className="text-[16px] text-clay leading-relaxed font-sans max-w-xl mx-auto">
            Born out of love for authentic Bihari hospitality, slow-cooked village meat, and the royal gravies of North India.
          </p>
        </div>
      </section>

      {/* 2. Founder's Story */}
      <section className="bg-paper py-14 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Founder Real Photo */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md p-3 bg-white rounded-[16px] border border-wheat shadow-soft">
                <div className="aspect-[3/4] rounded-[12px] overflow-hidden bg-cream">
                  <ImageWithFallback
                    src={RESTAURANT_IMAGES.ownerGreeting.src}
                    alt={RESTAURANT_IMAGES.ownerGreeting.alt}
                    aspectRatio="portrait"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="pt-3.5 px-1 text-center">
                  <p className="font-serif text-[18px] font-bold text-espresso">Founder & Management</p>
                  <p className="text-[14px] text-clay font-medium">Purvarang Family Restaurant</p>
                </div>
              </div>
            </div>

            {/* Story Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <span className="text-[14px] text-palak font-bold uppercase tracking-wider block">
                The Story Behind the Name
              </span>
              <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-espresso leading-tight">
                Bringing Wholesome Family Dining to Lalganj, Vaishali
              </h2>

              <p className="text-[15px] sm:text-[16px] text-clay leading-relaxed">
                For years, families travelling along the Lalganj-Hajipur highway and residents seeking a dependable celebration venue had to travel far toward Hajipur or Patna for quality ambiance and clean dining.
              </p>

              <p className="text-[15px] sm:text-[16px] text-clay leading-relaxed">
                Purvarang was founded to change that permanently. We envisioned a warm place where three generations can sit together in air-conditioned comfort, relish authentic Chicken Dehati slow-cooked in mustard oil, savour crisp tandoori butter rotis straight from clay embers, and celebrate birthdays in our dedicated dining hall.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-3">
                <div className="p-4 rounded-[12px] bg-white border border-wheat shadow-soft text-center">
                  <p className="font-serif text-[28px] font-bold text-mirchi">100%</p>
                  <p className="text-[13px] text-clay font-semibold mt-0.5">Fresh Cooked</p>
                </div>
                <div className="p-4 rounded-[12px] bg-white border border-wheat shadow-soft text-center">
                  <p className="font-serif text-[28px] font-bold text-mirchi">30+</p>
                  <p className="text-[13px] text-clay font-semibold mt-0.5">Dining Tables</p>
                </div>
                <div className="p-4 rounded-[12px] bg-white border border-wheat shadow-soft text-center">
                  <p className="font-serif text-[28px] font-bold text-palak">Veg & Non-Veg</p>
                  <p className="text-[13px] text-clay font-semibold mt-0.5">Separate Stations</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Kitchen & Hygiene Promise */}
      <section className="bg-cream py-14 sm:py-20 border-b border-wheat">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[14px] text-mirchi font-bold uppercase tracking-wider block">
              Uncompromising Standards
            </span>
            <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-espresso">
              Kitchen & Hygiene Pledge
            </h2>
            <p className="text-[16px] text-clay leading-relaxed">
              Your family's trust and well-being come first. Every ingredient passes careful inspection before cooking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[14px] bg-white text-espresso border border-wheat shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-palak">
                <ShieldCheck className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Strict Separation of Veg & Non-Veg
              </h3>
              <p className="text-[15px] text-clay leading-relaxed">
                Dedicated chopping boards, separate karahis, distinct storage, and isolated prep stations safeguard the religious dietary trust of vegetarian diners.
              </p>
            </div>

            <div className="p-6 rounded-[14px] bg-white text-espresso border border-wheat shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-mirchi">
                <Flame className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Cold-Pressed Mustard Oil & Ground Spices
              </h3>
              <p className="text-[15px] text-clay leading-relaxed">
                Zero artificial food colors or trans fats. Our signature Dehati gravies use pure cold-pressed mustard oil, whole garlic pods, and freshly ground whole spices.
              </p>
            </div>

            <div className="p-6 rounded-[14px] bg-white text-espresso border border-wheat shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-espresso">
                <UtensilsCrossed className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-serif text-[20px] font-bold text-espresso">
                Purified Water & Sanitized Cutlery
              </h3>
              <p className="text-[15px] text-clay leading-relaxed">
                All drinking and cooking water passes through multi-stage RO filtration. All cutlery and dining tables are thoroughly sanitized between guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership & Hospitality Crew */}
      <section className="bg-paper py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[14px] text-mirchi font-bold uppercase tracking-wider block">
              The People Behind Your Meal
            </span>
            <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-espresso">
              Meet the Purvarang Team
            </h2>
            <p className="text-[16px] text-clay">
              Skilled chefs, prompt attendants, and managers working together every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
              <div className="aspect-[4/5] overflow-hidden bg-cream border-b border-wheat">
                <ImageWithFallback
                  src={RESTAURANT_IMAGES.managerBarCounter.src}
                  alt={RESTAURANT_IMAGES.managerBarCounter.alt}
                  aspectRatio="portrait"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="font-serif text-[18px] font-bold text-espresso">Beverage & Chiller Station</h4>
                <p className="text-[14px] text-mirchi font-semibold">Mocktails & Shakes</p>
                <p className="text-[14px] text-clay mt-2 leading-relaxed">
                  Specialist in fresh mint mojitos, thick cold coffee, and chilled fruit mocktails.
                </p>
              </div>
            </div>

            <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
              <div className="aspect-[4/5] overflow-hidden bg-cream border-b border-wheat">
                <ImageWithFallback
                  src={RESTAURANT_IMAGES.banquetTeamBanner.src}
                  alt={RESTAURANT_IMAGES.banquetTeamBanner.alt}
                  aspectRatio="square"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="font-serif text-[18px] font-bold text-espresso">Dining & Floor Captains</h4>
                <p className="text-[14px] text-palak font-semibold">Guest Hospitality Crew</p>
                <p className="text-[14px] text-clay mt-2 leading-relaxed">
                  Trained for courteous table rounds, quick water service, and family celebration arrangements.
                </p>
              </div>
            </div>

            <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
              <div className="aspect-[4/5] overflow-hidden bg-cream border-b border-wheat">
                <ImageWithFallback
                  src={RESTAURANT_IMAGES.serviceKitchenTeam.src}
                  alt={RESTAURANT_IMAGES.serviceKitchenTeam.alt}
                  aspectRatio="square"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="font-serif text-[18px] font-bold text-espresso">Tandoor & Curry Masters</h4>
                <p className="text-[14px] text-espresso font-semibold">Kitchen Culinary Team</p>
                <p className="text-[14px] text-clay mt-2 leading-relaxed">
                  Masters of charcoal kiln tikkas, slow-cooked handi curries, and soft butter rotis.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link to="/book">
              <Button size="lg" variant="primary" leftIcon={<CalendarDays className="w-5 h-5" />}>
                Reserve a Table & Experience Our Hospitality
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
