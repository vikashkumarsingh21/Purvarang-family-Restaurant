import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  hindiLabel?: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex border-b border-wheat gap-6 overflow-x-auto no-scrollbar ${className}`}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`pb-2.5 font-medium text-[14px] transition-all whitespace-nowrap relative flex items-center gap-2 ${
                isActive
                  ? 'text-mirchi font-serif font-bold'
                  : 'text-clay hover:text-espresso'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.hindiLabel && <span className="font-hindi text-[13px] opacity-80">({tab.hindiLabel})</span>}
              {tab.count !== undefined && (
                <span className="text-[12px] px-2 py-0.5 rounded-full bg-paper text-espresso border border-wheat">
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-mirchi rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex gap-1.5 p-1 bg-paper/50 border border-wheat rounded-[10px] overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              isActive
                ? 'bg-mirchi text-white font-semibold shadow-soft'
                : 'text-espresso hover:bg-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[12px] px-2 py-0.5 rounded-full ${
                isActive ? 'bg-white text-mirchi font-bold' : 'bg-white text-clay'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
