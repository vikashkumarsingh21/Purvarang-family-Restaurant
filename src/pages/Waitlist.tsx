import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Users, ArrowLeft } from 'lucide-react';
import { WaitlistView } from '../components/demo/WaitlistView';

export const Waitlist: React.FC = () => {
  const location = useLocation();
  const isSelfJoin = location.pathname.includes('/join');

  return (
    <div className="min-h-screen bg-cream py-6 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-[13px] text-clay">
          <Link to="/" className="hover:text-espresso flex items-center gap-1.5 font-bold">
            <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
            <span>Back to Restaurant</span>
          </Link>
          <span className="font-mono text-[12px] bg-paper px-2.5 py-0.5 rounded-full border border-wheat text-espresso">
            {isSelfJoin ? 'Guest Self-Check-in' : 'Host Desk Management'}
          </span>
        </div>

        {/* Reusable Waitlist View */}
        <div className="bg-white border border-wheat rounded-[16px] overflow-hidden shadow-soft">
          <WaitlistView isSelfJoin={isSelfJoin} isPanel={false} />
        </div>

      </div>
    </div>
  );
};
