import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  Download,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockApi } from '../lib/mockApi';
import { Booking } from '../types';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';

export const BookTable: React.FC = () => {
  const { success, error } = useToast();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('08:00 PM');
  const [guestCount, setGuestCount] = useState<number>(4);
  const [seatingPreference, setSeatingPreference] = useState<'Family Hall' | 'Window View' | 'Party Banquet'>('Family Hall');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  const availableSlots = [
    "12:30 PM", "01:15 PM", "02:00 PM",
    "07:00 PM", "07:45 PM", "08:30 PM", "09:15 PM", "10:00 PM"
  ];

  const occasions = [
    "Casual Dining", "Birthday Party", "Anniversary Celebration", "Family Reunion", "Corporate Lunch / Dinner"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      error("Name Required", "Please enter your name.");
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      error("Valid Mobile Required", "Please provide a 10-digit phone number for reservation verification.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await mockApi.createBooking({
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        date,
        timeSlot,
        guestCount,
        seatingPreference,
        occasion,
        specialRequests: specialRequests.trim() || undefined,
      });

      setConfirmedBooking(res);
      success("Table Reservation Confirmed", `Booking ID: ${res.bookingNumber}`);

      try {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#C62B1F', '#F5B21B', '#1E4A33'],
        });
      } catch (err) {
        console.warn("Confetti error", err);
      }
    } catch (err) {
      error("Booking Failed", "Unable to confirm reservation. Please try again or call restaurant.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCalendar = () => {
    if (confirmedBooking) {
      mockApi.downloadCalendarEvent(confirmedBooking);
      success("Calendar Event Saved", "Purvarang table reservation added to your device calendar.");
    }
  };

  const getWhatsAppBookingUrl = (bk: Booking): string => {
    const text = `Namaste Purvarang! I have confirmed a reservation online.
*Booking ID:* ${bk.bookingNumber}
*Name:* ${bk.customerName}
*Date:* ${bk.date} at ${bk.timeSlot}
*Guests:* ${bk.guestCount} (${bk.seatingPreference})
*Occasion:* ${bk.occasion || 'Dining'}
Please acknowledge our reservation. Thank you!`;
    return `https://wa.me/${RESTAURANT_CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  if (confirmedBooking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-espresso">
        <div className="bg-white border border-wheat rounded-[16px] p-6 sm:p-10 space-y-6 text-center shadow-soft">
          <div className="w-14 h-14 rounded-full bg-palak/10 border border-palak/20 flex items-center justify-center text-palak mx-auto">
            <CheckCircle2 className="w-8 h-8 text-palak" strokeWidth={2} />
          </div>

          <div className="space-y-1">
            <span className="text-[14px] font-bold text-palak uppercase tracking-wider">
              Table Reservation Confirmed
            </span>
            <h1 className="font-serif text-[clamp(28px,3.5vw,36px)] font-bold text-espresso">
              We Look Forward to Welcoming You
            </h1>
            <p className="text-[15px] text-clay">
              Your table at Purvarang Family Restaurant, Lalganj is reserved.
            </p>
          </div>

          {/* Booking Pass Card */}
          <div className="bg-cream/60 border border-wheat rounded-[14px] p-6 text-left space-y-4">
            <div className="flex justify-between items-baseline pb-3 border-b border-wheat">
              <span className="text-[14px] text-clay uppercase tracking-wider font-semibold">Booking ID</span>
              <span className="font-serif text-[22px] font-bold text-mirchi">{confirmedBooking.bookingNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-[14px]">
              <div>
                <p className="text-clay">Guest Name:</p>
                <p className="font-bold text-espresso mt-0.5">{confirmedBooking.customerName}</p>
              </div>
              <div>
                <p className="text-clay">Contact:</p>
                <p className="font-bold text-espresso mt-0.5">+91 {confirmedBooking.customerPhone}</p>
              </div>
              <div>
                <p className="text-clay">Date & Slot:</p>
                <p className="font-bold text-espresso mt-0.5">{confirmedBooking.date} • {confirmedBooking.timeSlot}</p>
              </div>
              <div>
                <p className="text-clay">Seating & Guests:</p>
                <p className="font-bold text-espresso mt-0.5">{confirmedBooking.guestCount} Guests • {confirmedBooking.seatingPreference}</p>
              </div>
            </div>

            {confirmedBooking.specialRequests && (
              <div className="pt-2 border-t border-wheat text-[14px]">
                <p className="text-clay">Special Request:</p>
                <p className="text-espresso mt-0.5 italic">"{confirmedBooking.specialRequests}"</p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={handleDownloadCalendar}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Add to Calendar (.ics)
            </Button>

            <a
              href={getWhatsAppBookingUrl(confirmedBooking)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-semibold rounded-[10px] px-5 py-3 text-[15px] gap-2 bg-palak hover:bg-[#163826] text-white transition-colors shadow-soft"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm via WhatsApp</span>
            </a>
          </div>

          <p className="text-[14px] text-clay">
            Need adjustments? Call our reception at <a href={`tel:${RESTAURANT_CONFIG.phone}`} className="text-mirchi underline font-bold">{RESTAURANT_CONFIG.phone}</a>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 text-espresso">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-wheat text-palak text-[14px] font-semibold shadow-soft">
          <CalendarDays className="w-4 h-4 text-mirchi" strokeWidth={1.75} />
          <span>Table Reservation</span>
        </div>
        <h1 className="font-serif text-[clamp(32px,4vw,48px)] font-bold text-espresso">
          Book a Table at Purvarang
        </h1>
        <p className="text-[16px] text-clay">
          Planning a family dinner or a birthday? Tell us the date, time and number of guests and we will keep a table ready.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-wheat rounded-[16px] p-6 sm:p-10 space-y-8 shadow-soft">
        
        {/* Step 1: Date & Time */}
        <div className="space-y-4">
          <h2 className="font-serif text-[20px] font-bold text-espresso pb-2 border-b border-wheat flex items-center gap-2">
            <Clock className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
            <span>1. Choose Date & Time</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-espresso block mb-1.5">
                Reservation Date <span className="text-mirchi">*</span>
              </label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40 transition-colors cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[14px] font-semibold text-espresso block mb-1.5">
                Number of Guests <span className="text-mirchi">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[2, 4, 6, 8, 12].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestCount(num)}
                    className={`flex-1 py-2 rounded-[8px] text-[14px] font-semibold transition-all border ${
                      guestCount === num
                        ? 'bg-mirchi text-white border-mirchi shadow-soft'
                        : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={guestCount}
                  onChange={e => setGuestCount(parseInt(e.target.value, 10) || 1)}
                  className="w-16 px-2 py-2 text-center rounded-[8px] bg-cream/50 border border-wheat text-[14px] font-bold text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
                  title="Custom guest count"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-espresso block mb-2">
              Select Preferred Time Slot <span className="text-mirchi">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-3 rounded-[8px] text-[14px] font-medium transition-all border ${
                    timeSlot === slot
                      ? 'bg-mirchi text-white border-mirchi shadow-soft font-semibold'
                      : 'bg-cream/50 text-espresso border-wheat hover:bg-paper'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Seating & Occasion */}
        <div className="space-y-4">
          <h2 className="font-serif text-[20px] font-bold text-espresso pb-2 border-b border-wheat flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
            <span>2. Seating Preference & Occasion</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Family Hall', name: 'Family Dining Hall', desc: 'Comfortable booth seating in the main dining floor' },
              { id: 'Window View', name: 'Front Highway Enclosure', desc: 'Glass-enclosed seating with natural ambient light' },
              { id: 'Party Banquet', name: 'Banquet Hall Area', desc: 'Spacious area with swing photography backdrop' },
            ].map(sec => (
              <button
                key={sec.id}
                type="button"
                onClick={() => setSeatingPreference(sec.id as any)}
                className={`p-4 rounded-[12px] border text-left transition-all ${
                  seatingPreference === sec.id
                    ? 'bg-paper/70 border-mirchi shadow-soft ring-1 ring-mirchi/30'
                    : 'bg-white border-wheat hover:bg-paper/40'
                }`}
              >
                <p className="font-serif text-[16px] font-bold text-espresso">{sec.name}</p>
                <p className="text-[13px] text-clay mt-1 leading-snug">{sec.desc}</p>
              </button>
            ))}
          </div>

          <div>
            <label className="text-[14px] font-semibold text-espresso block mb-1.5">
              Occasion
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map(occ => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all border ${
                    occasion === occ
                      ? 'bg-espresso text-white border-espresso shadow-soft font-semibold'
                      : 'bg-paper text-espresso border-wheat hover:bg-wheat/50'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Contact Details */}
        <div className="space-y-4">
          <h2 className="font-serif text-[20px] font-bold text-espresso pb-2 border-b border-wheat flex items-center gap-2">
            <Users className="w-5 h-5 text-mirchi" strokeWidth={1.75} />
            <span>3. Contact & Special Requests</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[14px] font-semibold text-espresso block mb-1">
                Full Name <span className="text-mirchi">*</span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="Rakesh Kumar"
                required
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
              />
            </div>

            <div>
              <label className="text-[14px] font-semibold text-espresso block mb-1">
                Mobile Number (10 digits) <span className="text-mirchi">*</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="9693633870"
                required
                maxLength={10}
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
              />
            </div>
          </div>

          <div>
            <label className="text-[14px] font-semibold text-espresso block mb-1">
              Special Requests or Notes (Optional)
            </label>
            <textarea
              value={specialRequests}
              onChange={e => setSpecialRequests(e.target.value)}
              placeholder="e.g. Baby chair needed, birthday decor or specific dish preferences..."
              rows={2}
              className="w-full px-3.5 py-2 rounded-[10px] bg-cream/50 border border-wheat text-[15px] text-espresso focus:outline-none focus:ring-2 focus:ring-kesar/40"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          variant="primary"
          fullWidth
          isLoading={isSubmitting}
          rightIcon={<ArrowRight className="w-5 h-5" />}
        >
          Confirm Reservation
        </Button>
      </form>
    </div>
  );
};
