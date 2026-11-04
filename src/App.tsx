import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { ScrollToTop } from './components/common/ScrollToTop';

// Core Customer Pages (Eagerly Loaded)
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { TableOrder } from './pages/TableOrder';
import { TrackOrder } from './pages/TrackOrder';
import { BookTable } from './pages/BookTable';
import { Offers } from './pages/Offers';
import { About } from './pages/About';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';
import { PrintMenu } from './pages/PrintMenu';
import { NotFound } from './pages/NotFound';

// Lazy-Loaded Routes for Code Splitting (Gallery, Admin, Kitchen, Live, Waitlist, Demo, Staff)
const Gallery = React.lazy(() => import('./pages/Gallery').then(m => ({ default: m.Gallery })));
const Admin = React.lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const KitchenDisplay = React.lazy(() => import('./pages/KitchenDisplay').then(m => ({ default: m.KitchenDisplay })));
const LiveBoard = React.lazy(() => import('./pages/LiveBoard').then(m => ({ default: m.LiveBoard })));
const Waitlist = React.lazy(() => import('./pages/Waitlist').then(m => ({ default: m.Waitlist })));
const DemoControlRoom = React.lazy(() => import('./pages/DemoControlRoom').then(m => ({ default: m.DemoControlRoom })));
const WaiterDesk = React.lazy(() => import('./pages/WaiterDesk').then(m => ({ default: m.WaiterDesk })));
const BillingCashier = React.lazy(() => import('./pages/BillingCashier').then(m => ({ default: m.BillingCashier })));

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
    <div className="w-8 h-8 border-2 border-wheat border-t-mirchi rounded-full animate-spin mb-3" />
    <span className="font-serif text-sm text-clay italic">Loading Purvarang...</span>
  </div>
);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isFullScreenPage = ['/kitchen', '/live', '/menu/print'].includes(location.pathname);

  if (isFullScreenPage) {
    return (
      <main className="min-h-screen">
        <ScrollToTop />
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/kitchen" element={<KitchenDisplay />} />
            <Route path="/live" element={<LiveBoard />} />
            <Route path="/menu/print" element={<PrintMenu />} />
          </Routes>
        </Suspense>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-espresso">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/table/:tableNumber" element={<TableOrder />} />
            <Route path="/track/:orderId" element={<TrackOrder />} />
            <Route path="/book" element={<BookTable />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Live Operations & Staff Routes */}
            <Route path="/demo" element={<DemoControlRoom />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/waitlist/join" element={<Waitlist />} />
            <Route path="/waiter" element={<WaiterDesk />} />
            <Route path="/billing" element={<BillingCashier />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
      <FloatingWhatsApp />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppLayout />
            </BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
