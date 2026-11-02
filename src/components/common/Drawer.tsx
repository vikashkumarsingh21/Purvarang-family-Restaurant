import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'bottom',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isBottom = position === 'bottom';

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      <div
        className="fixed inset-0 bg-espresso/60 transition-opacity backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={`fixed z-50 bg-white text-espresso flex flex-col transition-transform ${
          isBottom
            ? 'inset-x-0 bottom-0 max-h-[85vh] rounded-t-[20px] border-t border-wheat shadow-soft-lg'
            : 'inset-y-0 right-0 w-full max-w-md border-l border-wheat shadow-soft-lg'
        }`}
      >
        {isBottom && (
          <div className="w-12 h-1 bg-wheat rounded-full mx-auto mt-3 mb-1" />
        )}

        <div className="flex items-center justify-between px-6 py-4 border-b border-wheat bg-paper">
          <h3 className="font-serif text-[20px] font-bold text-espresso">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-clay hover:text-espresso hover:bg-cream transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 stroke-[1.75]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
};
