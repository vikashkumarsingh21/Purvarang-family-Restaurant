import React from 'react';
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

// Customer Pages
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { TableOrder } from './pages/TableOrder';
import { TrackOrder } from './pages/TrackOrder';
import { BookTable } from './pages/BookTable';
import { Offers } from './pages/Offers';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';
import { Reviews } from './pages/Reviews';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { PrintMenu } from './pages/PrintMenu';
import { NotFound } from './pages/NotFound';

// Live Demo & Staff Pages
import { DemoControlRoom } from './pages/DemoControlRoom';
import { KitchenDisplay } from './pages/KitchenDisplay';
import { LiveBoard } from './pages/LiveBoard';
import { Waitlist } from './pages/Waitlist';
import { WaiterDesk } from './pages/WaiterDesk';
import { BillingCashier } from './pages/BillingCashier';

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isFullScreenPage = ['/kitchen', '/live', '/menu/print'].includes(location.pathname);

  if (isFullScreenPage) {
    return (
      <main className="min-h-screen">
        <ScrollToTop />
        <Routes>
          <Route path="/kitchen" element={<KitchenDisplay />} />
          <Route path="/live" element={<LiveBoard />} />
          <Route path="/menu/print" element={<PrintMenu />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream text-espresso">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
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
