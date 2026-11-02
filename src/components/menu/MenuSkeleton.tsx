import React from 'react';

export const MenuSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-wheat rounded-[12px] p-5 animate-pulse flex flex-col justify-between h-72 shadow-soft"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-24 h-4 bg-paper rounded-full" />
              <div className="w-5 h-5 bg-paper rounded-[4px]" />
            </div>
            <div className="w-3/4 h-6 bg-paper rounded-[6px] mb-2" />
            <div className="w-1/2 h-4 bg-paper/70 rounded-[6px] mb-4" />
            <div className="w-full h-3.5 bg-paper/50 rounded-[4px] mb-1.5" />
            <div className="w-4/5 h-3.5 bg-paper/50 rounded-[4px]" />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-wheat">
            <div className="w-16 h-6 bg-paper rounded-[6px]" />
            <div className="w-24 h-10 bg-mirchi/20 rounded-[8px]" />
          </div>
        </div>
      ))}
    </div>
  );
};
