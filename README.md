# Purvarang Family Restaurant & Banquet Hall — Digital Platform

> **"Swad ka ek nya rang"**  
> Premium multi-page website and digital dining suite for Purvarang Family Restaurant, Tinpulwa Chowk, Lalganj to Hajipur Road, Lalganj, Vaishali, Bihar, India.

---

## Overview

Designed as a high-end, custom agency-quality demo for the restaurant owner. Built with modern React, TypeScript, Tailwind CSS, Framer Motion, and responsive mobile-first UI with authentic photos and branding.

### Key Highlights
- **Authentic Brand Theme**: Dark charcoal `#14161A`, antique gold accents (`#C9A24B` to `#E8B44F`), warm ivory typography, deep green accents, and non-veg red indicators based on Purvarang's original menu card.
- **Strictly No Emojis**: Clean, professional Lucide SVG iconography throughout.
- **Real Photography**: Uses 28 authentic interior, exterior, tandoori dish, and staff photos from `/public/images/`.
- **Interactive Dine-In Suite**: Table QR ordering (`/table/:tableNumber`), call waiter, request water, request bill, and multi-round ordering.
- **30 Table QR Generator**: Admin panel screen that generates printable QR stands for Tables 1 to 30.
- **Live Order Tracking**: Live 4-stage order stepper (`/track/:orderId`) driven by mock service.
- **Online Table Reservation**: Date, time slot, guest count, and hall preference with instant `.ics` calendar download and WhatsApp confirmation.
- **Printable Menu**: Screen-to-print optimized menu card at `/menu/print`.
- **Admin Demonstration**: Kanban live order board, bookings manager, instant price and stock editor, and sales analytics.

---

## Tech Stack

- **Framework**: Vite + React 19 + TypeScript
- **Styling**: Tailwind CSS (dark mode default with light mode toggle)
- **Routing**: React Router v7
- **Icons**: Lucide React
- **Animations & Delight**: Framer Motion, Canvas Confetti
- **QR Code Engine**: qrcode

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
```

---

## How to Customize

### 1. How to Swap or Add Images
All images are centrally mapped in [`src/data/images.ts`](file:///c:/Users/vk010/Downloads/New%20folder/src/data/images.ts).
- Add new photos into the `/public/images/` directory.
- Open `src/data/images.ts` and change the corresponding role mapping (e.g. `heroDining`, `dishChickenTikka`, `interiorBoothSeating`).
- The `ImageWithFallback` component handles lazy loading, aspect ratio preservation, and graceful fallback shimmers.

### 2. How to Edit the Menu & Prices
The complete typed menu is located in [`src/data/menu.ts`](file:///c:/Users/vk010/Downloads/New%20folder/src/data/menu.ts).
- Each dish has `id`, `name`, `hindiName`, `price`, `type` (`veg` or `non-veg`), `description`, and optional `portions` (Half/Full) or `spiceLevel`.
- **Note on salad & raita**: The salad and raita prices on the printed card were partially faint. The owner can verify and update their exact prices directly in this file.
- The restaurant owner can also toggle availability and adjust prices on the fly via the `/admin` interface.

### 3. How to Update Restaurant Details & Opening Hours
Open [`src/config/restaurant.ts`](file:///c:/Users/vk010/Downloads/New%20folder/src/config/restaurant.ts) to edit:
- Phone number: `9693633870` (auto-updates all call and WhatsApp links)
- Opening hours: `openingHours.display` and individual day schedules
- Address, Google Map coordinates, and landmark
- Demo coupon discount codes (`PURVA20`, `FAMILY100`, etc.)

---

## How to Connect a Real Backend

The app is built with a mock service layer in [`src/lib/storage.ts`](file:///c:/Users/vk010/Downloads/New%20folder/src/lib/storage.ts) and [`src/lib/mockApi.ts`](file:///c:/Users/vk010/Downloads/New%20folder/src/lib/mockApi.ts).

To plug in a real backend (Node.js, Express, Firebase, Supabase, or PostgreSQL):
1. **Orders**: Replace `mockApi.placeOrder()` and `mockApi.getOrderStatus()` with `fetch('/api/orders')` or Supabase table inserts.
2. **Table Sessions**: Connect `tableSession` to a WebSocket / SSE endpoint (e.g. Socket.io) so that waiter calls and water requests ring a buzzer on the kitchen/reception tablet in real time.
3. **Bookings**: Connect `mockApi.createBooking()` to your database and trigger SMS / WhatsApp API (via Twilio, Gupshup, or Wati).
4. **Payments**: Replace the UPI modal simulation in `src/pages/Cart.tsx` with a Razorpay or Cashfree standard checkout gateway.

---

## Pages & Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Hero, signatures, 3-step explainer, categories, special banner, reviews, map |
| `/menu` | Menu | Category tabs, search, veg/non-veg filter, price sort, dish cards |
| `/cart` | Cart & Checkout | Item notes, half/full portions, dine-in vs pre-order, coupons, UPI payment |
| `/table/:tableNumber` | Dine-in Table Ordering | Table welcome, call waiter, request water, request bill, multi-rounds |
| `/track/:orderId` | Live Order Tracking | 4-stage live stepper (Received, Preparing, Ready, Served) |
| `/book` | Book a Table | Reservation form, hall preference, `.ics` calendar file, WhatsApp confirm |
| `/offers` | Offers & Combos | Promo vouchers with copy code, curated family and party combo packs |
| `/gallery` | Gallery | Responsive masonry grid, category filter, keyboard lightbox |
| `/about` | About & Heritage | Founder's story, hygiene pledge, separate veg prep, team showcase |
| `/reviews` | Reviews & Ratings | Rating breakdown, customer testimonials, interactive review submission |
| `/contact` | Contact & Catering | Location map embed, phone, WhatsApp, bulk outdoor catering enquiry |
| `/admin` | Owner Admin Portal | Live kanban order board, booking approvals, menu price editor, QR table generator |
| `/menu/print` | Printable Menu | Print-optimized clean menu layout for physical display |

---

## License & Ownership
Created exclusively for Purvarang Family Restaurant, Lalganj, Vaishali, Bihar.
