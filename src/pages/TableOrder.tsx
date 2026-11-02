import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { CustomerOrderPanel } from '../components/demo/CustomerOrderPanel';
import { RESTAURANT_CONFIG } from '../config/restaurant';

export const TableOrder: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const parsedTable = parseInt(tableNumber || '1', 10);
  const isValidTable = !isNaN(parsedTable) && parsedTable >= 1 && parsedTable <= 30;

  if (!isValidTable) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4 text-espresso">
        <ShieldAlert className="w-12 h-12 text-mirchi mx-auto stroke-[1.75]" />
        <h2 className="font-serif text-[24px] font-bold text-espresso">
          Invalid Table QR Code
        </h2>
        <p className="text-[15px] text-clay">
          Please scan a valid table QR code (Tables 1 through {RESTAURANT_CONFIG.tables.total}) or enter your table number.
        </p>
        <div className="pt-2">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-mirchi text-white font-bold text-[14px] rounded-[8px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse Full Menu</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-6 px-3 sm:px-4">
      <div className="max-w-3xl mx-auto space-y-4">
        
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between text-[13px] text-clay">
          <Link to="/" className="hover:text-espresso flex items-center gap-1 font-medium">
            <Home className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Home</span>
          </Link>
          <span className="font-bold text-palak">
            Dine-In • Table {parsedTable}
          </span>
        </div>

        {/* Reusable Customer Order Panel with full menu & table preselected */}
        <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
          <CustomerOrderPanel tableNumber={parsedTable} isPhoneFrame={false} />
        </div>

      </div>
    </div>
  );
};
