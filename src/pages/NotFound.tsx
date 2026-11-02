import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center text-espresso bg-cream">
      <div className="max-w-md w-full bg-white border border-wheat rounded-[16px] p-8 space-y-6 shadow-soft">
        <div className="w-16 h-16 rounded-[12px] bg-paper border border-wheat flex items-center justify-center text-mirchi mx-auto">
          <UtensilsCrossed className="w-8 h-8" strokeWidth={1.75} />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-[14px] text-palak font-bold uppercase tracking-wider block">
            Error 404
          </span>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Page Not Found
          </h1>
          <p className="text-[15px] text-clay leading-relaxed">
            The page you are looking for might have been moved or does not exist. Let us get you back to the menu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link to="/">
            <Button size="md" variant="primary" leftIcon={<Home className="w-4 h-4 stroke-[1.75]" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/menu">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4 stroke-[1.75]" />}>
              Browse Full Menu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
