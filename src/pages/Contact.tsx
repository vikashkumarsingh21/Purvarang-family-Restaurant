import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  MessageSquare,
  Send,
  CalendarDays,
  ExternalLink,
  Clock
} from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const Contact: React.FC = () => {
  const { success } = useToast();
  const [activeFormTab, setActiveFormTab] = useState<'general' | 'catering'>('general');

  // General Enquiry State
  const [generalName, setGeneralName] = useState('');
  const [generalPhone, setGeneralPhone] = useState('');
  const [generalMessage, setGeneralMessage] = useState('');
  const [generalSubmitting, setGeneralSubmitting] = useState(false);

  // Catering Form State
  const [cateringName, setCateringName] = useState('');
  const [cateringPhone, setCateringPhone] = useState('');
  const [cateringDate, setCateringDate] = useState('');
  const [cateringGuests, setCateringGuests] = useState('50');
  const [cateringEventType, setCateringEventType] = useState('Wedding Reception');
  const [cateringDiet, setCateringDiet] = useState('Veg & Non-Veg Mixed');
  const [cateringNotes, setCateringNotes] = useState('');
  const [cateringSubmitting, setCateringSubmitting] = useState(false);

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralSubmitting(true);
    setTimeout(() => {
      setGeneralSubmitting(false);
      setGeneralName('');
      setGeneralPhone('');
      setGeneralMessage('');
      success("Message Received", "Our manager will contact you via phone or WhatsApp shortly.");
    }, 600);
  };

  const handleCateringSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCateringSubmitting(true);
    setTimeout(() => {
      setCateringSubmitting(false);
      setCateringName('');
      setCateringPhone('');
      setCateringDate('');
      setCateringNotes('');
      success("Catering Request Logged", "Our banquet team will connect with a quotation.");
    }, 700);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-espresso">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
          <Phone className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
          <span>Get in Touch</span>
        </div>
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-bold text-espresso">
          Contact & Location
        </h1>
        <p className="text-[16px] text-clay">
          Call us or send a message. We usually reply on WhatsApp.
        </p>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Address Card */}
        <div className="bg-white border border-wheat rounded-[14px] p-6 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-mirchi">
            <MapPin className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-[20px] font-bold text-espresso">
            Our Location
          </h2>
          <p className="text-[15px] text-clay leading-relaxed">
            {RESTAURANT_CONFIG.address.full}
          </p>
          <div className="pt-2">
            <a
              href="https://www.google.com/maps/search/?api=1&query=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] text-mirchi font-semibold hover:underline"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Call & WhatsApp Card */}
        <div className="bg-white border border-wheat rounded-[14px] p-6 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-palak">
            <Phone className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-[20px] font-bold text-espresso">
            Phone & WhatsApp
          </h2>
          <p className="text-[15px] text-clay leading-relaxed">
            Call or message us anytime for reservations, takeaway or queries.
          </p>
          <div className="pt-2 space-y-2">
            <a
              href={`tel:${RESTAURANT_CONFIG.phone}`}
              className="block font-serif text-[20px] font-bold text-mirchi hover:underline"
            >
              +91 {RESTAURANT_CONFIG.phone}
            </a>
            <a
              href={RESTAURANT_CONFIG.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[14px] text-palak font-semibold hover:underline"
            >
              <MessageSquare className="w-4 h-4" strokeWidth={2} />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Operating Hours Card */}
        <div className="bg-white border border-wheat rounded-[14px] p-6 space-y-3 shadow-soft">
          <div className="w-10 h-10 rounded-[10px] bg-paper border border-wheat flex items-center justify-center text-clay">
            <Clock className="w-5 h-5" strokeWidth={1.75} />
          </div>
          <h2 className="font-serif text-[20px] font-bold text-espresso">
            Hours & Dining
          </h2>
          <p className="text-[15px] text-clay leading-relaxed">
            Dine-in family seating, takeaway counter, and table QR ordering available daily.
          </p>
          <div className="pt-1 text-[14px] text-clay space-y-1">
            <p>For immediate table availability or large party reservations, call our team directly.</p>
          </div>
        </div>

      </div>

      {/* Forms & Map Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* Forms Container */}
        <div className="lg:col-span-7 bg-white border border-wheat rounded-[16px] p-6 sm:p-8 space-y-6 shadow-soft">
          
          {/* Form Tabs */}
          <div className="flex border-b border-wheat pb-3 gap-3">
            <button
              type="button"
              onClick={() => setActiveFormTab('general')}
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                activeFormTab === 'general'
                  ? 'bg-mirchi text-white font-semibold shadow-soft'
                  : 'bg-paper text-espresso hover:bg-wheat/50'
              }`}
            >
              General Enquiry
            </button>

            <button
              type="button"
              onClick={() => setActiveFormTab('catering')}
              className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                activeFormTab === 'catering'
                  ? 'bg-mirchi text-white font-semibold shadow-soft'
                  : 'bg-paper text-espresso hover:bg-wheat/50'
              }`}
            >
              Catering & Bulk Feasts
            </button>
          </div>

          {activeFormTab === 'general' ? (
            /* General Enquiry Form */
            <form onSubmit={handleGeneralSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Your Name <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="text"
                    value={generalName}
                    onChange={e => setGeneralName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Phone Number <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="tel"
                    value={generalPhone}
                    onChange={e => setGeneralPhone(e.target.value)}
                    required
                    maxLength={10}
                    placeholder="9693633870"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>
              </div>

              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1">
                  Your Message or Question <span className="text-mirchi">*</span>
                </label>
                <textarea
                  value={generalMessage}
                  onChange={e => setGeneralMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Ask about table bookings, party arrangements, or special food preparations..."
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
              </div>

              <Button
                type="submit"
                size="md"
                variant="primary"
                isLoading={generalSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Message
              </Button>
            </form>
          ) : (
            /* Catering Form */
            <form onSubmit={handleCateringSubmit} className="space-y-4">
              <p className="text-[15px] text-clay leading-relaxed">
                Hosting a wedding, celebration, corporate meet, or family party? Let Purvarang cater with fresh food.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Contact Name <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="text"
                    value={cateringName}
                    onChange={e => setCateringName(e.target.value)}
                    required
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Contact Mobile <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="tel"
                    value={cateringPhone}
                    onChange={e => setCateringPhone(e.target.value)}
                    required
                    maxLength={10}
                    placeholder="9693633870"
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Event Date <span className="text-mirchi">*</span>
                  </label>
                  <input
                    type="date"
                    value={cateringDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setCateringDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Expected Number of Guests <span className="text-mirchi">*</span>
                  </label>
                  <select
                    value={cateringGuests}
                    onChange={e => setCateringGuests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[14px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  >
                    <option value="25-50">25 to 50 Guests</option>
                    <option value="50-100">50 to 100 Guests</option>
                    <option value="100-250">100 to 250 Guests</option>
                    <option value="250+">250+ Guests</option>
                  </select>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Event Type
                  </label>
                  <select
                    value={cateringEventType}
                    onChange={e => setCateringEventType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[14px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  >
                    <option value="Wedding Reception">Wedding Reception</option>
                    <option value="Birthday Celebration">Birthday Party</option>
                    <option value="Ring Ceremony / Sagai">Ring Ceremony / Sagai</option>
                    <option value="Corporate / Institution Event">Corporate / Institutional Event</option>
                    <option value="Pooja / Traditional Feast">Pooja / Traditional Feast</option>
                  </select>
                </div>

                <div>
                  <label className="text-[14px] font-semibold text-espresso block mb-1">
                    Menu Preference
                  </label>
                  <select
                    value={cateringDiet}
                    onChange={e => setCateringDiet(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[14px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  >
                    <option value="Pure Veg Buffet">Pure Vegetarian Buffet</option>
                    <option value="Veg & Non-Veg Mixed">Veg & Non-Veg Mixed Feast</option>
                    <option value="Tandoor & Biryani Special">Tandoor & Dum Biryani Focus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[14px] font-semibold text-espresso block mb-1">
                  Additional Details or Venue Address
                </label>
                <textarea
                  value={cateringNotes}
                  onChange={e => setCateringNotes(e.target.value)}
                  placeholder="Specify venue address if outside restaurant, budget per plate, or special dishes..."
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                />
              </div>

              <Button
                type="submit"
                size="md"
                variant="primary"
                isLoading={cateringSubmitting}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Submit Catering Enquiry
              </Button>
            </form>
          )}
        </div>

        {/* Map Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-wheat rounded-[16px] p-5 space-y-4 shadow-soft">
            <h3 className="font-serif text-[20px] font-bold text-espresso flex items-center gap-2">
              <MapPin className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
              <span>Location Map</span>
            </h3>

            <div className="h-80 rounded-[12px] overflow-hidden border border-wheat bg-paper">
              <iframe
                title="Purvarang Contact Map"
                src="https://maps.google.com/maps?q=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="text-[14px] text-clay leading-relaxed">
              Situated directly on the main Lalganj to Hajipur road at Tinpulwa Chowk with ample vehicle parking.
            </p>

            <div>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Tinpulwa+Chowk,+Lalganj,+Vaishali,+Bihar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-mirchi hover:underline inline-flex items-center gap-1.5"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
