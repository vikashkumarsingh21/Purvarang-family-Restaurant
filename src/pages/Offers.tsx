import React from 'react';
import { Link } from 'react-router-dom';
import {
  Tag,
  Copy,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { RESTAURANT_IMAGES } from '../data/images';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { JaaliDivider } from '../components/common/JaaliDivider';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/common/Button';

export const Offers: React.FC = () => {
  const { success } = useToast();
  const { applyCoupon } = useCart();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    success(`Code Copied: ${code}`, "Coupon discount automatically applied to your cart!");
  };

  const combos = [
    {
      id: "combo-1",
      name: "Purvarang Royal Family Veg Feast",
      tag: "Family Saver",
      badgeType: "veg",
      originalPrice: 779,
      comboPrice: 649,
      savings: 130,
      description: "Dal Tadka + Paneer Butter Masala + 6 Butter Tandoori Rotis + Fragrant Jeera Rice + 2 Rasmalai (2pc). Perfect for 3-4 diners.",
      itemsList: [
        "1x Paneer Butter Masala",
        "1x Dal Tadka",
        "6x Butter Tandoori Roti",
        "1x Jeera Rice",
        "1x Rasmalai (2 Pcs)"
      ]
    },
    {
      id: "combo-2",
      name: "Desi Non-Veg Celebration Feast",
      tag: "Chef's Bestseller",
      badgeType: "non-veg",
      originalPrice: 1349,
      comboPrice: 1099,
      savings: 250,
      description: "Signature Chicken Dehati (Full) cooked in mustard oil + 4 Butter Naans + Awadhi Chicken Biryani + 2 Virgin Mojitos. Serves 4 diners.",
      itemsList: [
        "1x Chicken Dehati (Full)",
        "1x Chicken Dum Biryani",
        "4x Butter Naan",
        "2x Virgin Mojito"
      ]
    },
    {
      id: "combo-3",
      name: "Tandoor & Biryani Party Pack",
      tag: "Weekend Special",
      badgeType: "non-veg",
      originalPrice: 1479,
      comboPrice: 1199,
      savings: 280,
      description: "Charcoal Tandoori Chicken (Full) + Royal Mutton Biryani + 4 Garlic Naans + 2 Cold Coffee with Ice Cream. Ideal for celebrations.",
      itemsList: [
        "1x Tandoori Chicken (Full)",
        "1x Mutton Dum Biryani",
        "4x Garlic Naan",
        "2x Cold Coffee with Ice Cream"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-espresso">
      
      {/* Offers Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
          <Tag className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
          <span>Dining Vouchers & Combos</span>
        </div>
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-bold text-espresso">
          Offers & Deals
        </h1>
        <p className="text-[16px] text-clay">
          Save on your family feasts with our verified discount coupons and chef-curated combos.
        </p>
      </div>

      {/* Featured 20% OFF Announcement Banner */}
      <div className="rounded-[16px] bg-white border border-wheat p-6 sm:p-10 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          <div className="md:col-span-4 flex justify-center">
            <div className="w-52 sm:w-64 p-2.5 bg-paper rounded-[12px] border border-wheat">
              <div className="aspect-[3/4] rounded-[8px] overflow-hidden">
                <ImageWithFallback
                  src={RESTAURANT_IMAGES.offerBanner20Off.src}
                  alt={RESTAURANT_IMAGES.offerBanner20Off.alt}
                  aspectRatio="portrait"
                  category="brand"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-haldi/15 text-espresso border border-haldi text-[14px] font-semibold">
              Lalganj Special Promotion
            </span>

            <h2 className="font-serif text-[clamp(28px,3.5vw,38px)] font-bold text-espresso">
              Flat 20% OFF on Orders above ₹499
            </h2>

            <p className="text-[15px] sm:text-[16px] text-clay leading-relaxed max-w-xl">
              Enjoy our rich North Indian curries, smoky chicken platters, and handmade milkshakes with flat 20% discount. Valid for both dine-in and takeaway orders.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-3 p-2.5 px-4 rounded-[10px] bg-cream/60 border border-dashed border-wheat">
                <span className="font-mono text-[16px] font-bold text-mirchi tracking-wider">
                  PURVA20
                </span>
                <button
                  onClick={() => handleCopy('PURVA20')}
                  className="p-1 text-clay hover:text-espresso transition-colors"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" strokeWidth={1.75} />
                </button>
              </div>

              <button
                onClick={() => handleCopy('PURVA20')}
                className="px-5 py-2.5 rounded-[10px] bg-mirchi hover:bg-[#A82217] text-white font-semibold text-[15px] shadow-soft transition-all"
              >
                Copy & Apply to Order
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Coupon Cards Grid */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-wheat pb-3">
          <h2 className="font-serif text-[22px] font-bold text-espresso flex items-center gap-2">
            <Tag className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
            <span>Active Promo Codes</span>
          </h2>
          <span className="text-[14px] text-clay">Click code to copy and apply</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESTAURANT_CONFIG.demoCoupons.map(coupon => (
            <div
              key={coupon.code}
              className="bg-white border border-wheat rounded-[14px] p-5 flex flex-col justify-between shadow-soft transition-all hover:border-clay/40"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-[8px] bg-cream/70 border border-dashed border-wheat font-mono text-[14px] font-bold text-mirchi">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 rounded-[6px] text-clay hover:text-espresso hover:bg-paper transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" strokeWidth={1.75} />
                  </button>
                </div>

                <p className="font-serif text-[18px] font-bold text-espresso">
                  {coupon.description}
                </p>
                <p className="text-[13px] text-clay mt-2">
                  Min order: ₹{coupon.minOrder || 0}
                  {coupon.maxDiscount ? ` • Max discount: ₹${coupon.maxDiscount}` : ''}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-wheat">
                <button
                  onClick={() => handleCopy(coupon.code)}
                  className="w-full py-2 rounded-[8px] bg-paper hover:bg-wheat/50 text-espresso border border-wheat text-[14px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
                  <span>Copy Code</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <JaaliDivider variant="wheat" className="my-8" />

      {/* Curated Combo Deals */}
      <div className="space-y-6">
        <div>
          <span className="text-[14px] text-palak font-bold uppercase tracking-wider block mb-1">
            Value Meals
          </span>
          <h2 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
            <span>Family & Party Combo Deals</span>
          </h2>
          <p className="text-[15px] text-clay mt-1">
            Complete multi-course meals bundled at discounted rates.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {combos.map(combo => (
            <div
              key={combo.id}
              className="bg-white border border-wheat rounded-[16px] p-6 flex flex-col justify-between shadow-soft hover:border-clay/40 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-paper border border-wheat text-espresso text-[13px] font-semibold">
                    {combo.tag}
                  </span>
                  <span className="text-[14px] text-palak font-bold">
                    Save ₹{combo.savings}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-[20px] font-bold text-espresso leading-snug">
                    {combo.name}
                  </h3>
                  <p className="text-[14px] text-clay mt-2 leading-relaxed">
                    {combo.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-[12px] bg-cream/50 border border-wheat space-y-1.5">
                  <p className="text-[13px] font-bold text-clay uppercase tracking-wider mb-1">
                    What's Included:
                  </p>
                  {combo.itemsList.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[14px] text-espresso">
                      <CheckCircle2 className="w-4 h-4 text-palak shrink-0" strokeWidth={2} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-wheat flex items-center justify-between">
                <div>
                  <span className="text-[14px] text-clay line-through mr-1.5">₹{combo.originalPrice}</span>
                  <span className="font-serif text-[24px] font-bold text-mirchi">
                    ₹{combo.comboPrice}
                  </span>
                </div>

                <Link to="/menu">
                  <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Order Combo
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
