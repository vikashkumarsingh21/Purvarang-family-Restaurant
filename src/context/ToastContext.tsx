import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => toast(title, message, 'success'), [toast]);
  const error = useCallback((title: string, message?: string) => toast(title, message, 'error'), [toast]);
  const info = useCallback((title: string, message?: string) => toast(title, message, 'info'), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast Render Area */}
      <div 
        className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-[12px] border border-wheat shadow-soft-lg transition-all ${
              t.type === 'success'
                ? 'bg-[#F2F8F4] text-palak border-[#C4DFC9]'
                : t.type === 'error'
                ? 'bg-[#FDF2F0] text-mirchi border-[#F6CBC6]'
                : 'bg-white text-espresso border-wheat'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-palak shrink-0 mt-0.5 stroke-[1.75]" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-mirchi shrink-0 mt-0.5 stroke-[1.75]" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-espresso shrink-0 mt-0.5 stroke-[1.75]" />}
            
            <div className="flex-1 min-w-0">
              <p className="font-serif font-bold text-[15px] leading-tight text-espresso">{t.title}</p>
              {t.message && <p className="text-[14px] text-clay mt-1 leading-snug">{t.message}</p>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-clay hover:text-espresso transition-colors shrink-0 p-1 rounded-sm"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4 stroke-[1.75]" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
