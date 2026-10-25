import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

interface FloatingCallWidgetProps {
  onCall: () => void;
}

export const FloatingCallWidget: React.FC<FloatingCallWidgetProps> = ({ onCall }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group animate-bounce-subtle" dir="rtl">
      {/* Main Orange Call Pill for Abusalim */}
      <button
        onClick={onCall}
        className="relative flex items-center gap-2.5 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white pl-4 pr-3 py-2.5 rounded-full shadow-2xl shadow-orange-600/40 border border-orange-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>

        {/* Circular Avatar / Abusalim logo mini */}
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>

        <div className="flex flex-col text-right pr-0.5">
          <span className="text-sm font-bold tracking-tight">
            اتصل بـ أبوسليم
          </span>
          <span className="text-[10px] text-amber-100 font-medium leading-none">
            مكالمة مجانية مباشرة
          </span>
        </div>
      </button>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="w-8 h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
        title="إخفاء الزر"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
