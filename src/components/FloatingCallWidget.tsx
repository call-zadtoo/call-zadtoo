import React, { useState } from 'react';
import { Phone, X, MessageSquare, Send as TelegramIcon, Code, ChevronUp, Sparkles, PhoneCall } from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';

interface FloatingCallWidgetProps {
  onCall: () => void;
  onOpenStudio?: () => void;
}

export const FloatingCallWidget: React.FC<FloatingCallWidgetProps> = ({ 
  onCall,
  onOpenStudio,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end group" dir="rtl">
      
      {/* Expanded Multi-Channel Popup Menu */}
      {isOpen && (
        <div className="mb-2 sm:mb-3 w-68 sm:w-72 bg-slate-900/98 backdrop-blur-xl border border-slate-700/80 rounded-3xl shadow-2xl p-3 sm:p-3.5 space-y-2 sm:space-y-2.5 animate-slide-up text-right">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <AbusalimLogo size="sm" />
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                مجاني 100%
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 font-medium">
            اختر طريقة التواصل المفضلة لديك مجاناً:
          </p>

          {/* Option 1: Abusalim Web Voice Call */}
          <button
            onClick={() => {
              setIsOpen(false);
              onCall();
            }}
            className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/10 hover:from-orange-600/30 hover:to-amber-600/20 border border-orange-500/40 flex items-center justify-between text-right transition-all group/item cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">مكالمة صوتية من المتصفح</span>
                <span className="text-[10px] text-orange-300">أبوسليم • فائق الوضوح ومجاني</span>
              </div>
            </div>
            <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded-md">
              اتصل الآن
            </span>
          </button>

          {/* Option 2: WhatsApp / Zad WhatsApp */}
          <a
            href="https://wa.me/966500000000?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D8%AE%D8%AF%D9%85%D8%A9%20%D8%A7%D9%84%D8%B9%D9%85%D9%84%D8%A7%D8%A1%20%D8%B9%D8%A8%D8%B1%20%D9%88%D8%A7%D8%AA%D8%B3%D8%A7%D8%A8%20%D8%B2%D8%A7%D8%AF"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full p-2.5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 flex items-center justify-between text-right transition-all cursor-pointer text-decoration-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white block">واتساب زاد</span>
                  <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-1 rounded">زاد</span>
                </div>
                <span className="text-[10px] text-emerald-300">دردشة فورية مباشرة</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">←</span>
          </a>

          {/* Option 3: Telegram Floating Chat */}
          <a
            href="https://t.me/zadtoo"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="w-full p-2.5 rounded-2xl bg-sky-950/40 hover:bg-sky-900/40 border border-sky-500/30 flex items-center justify-between text-right transition-all cursor-pointer text-decoration-none"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <TelegramIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">دردشة تلجرام</span>
                <span className="text-[10px] text-sky-300">فتح تيليجرام فوراً @zadtoo</span>
              </div>
            </div>
            <span className="text-xs text-sky-400 font-bold">←</span>
          </a>

          {/* Option 4: Get Code for my site */}
          {onOpenStudio && (
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenStudio();
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer pt-2"
            >
              <Code className="w-3.5 h-3.5 text-orange-400" />
              <span>احصل على هذا الودجت لموقعك مجاناً</span>
            </button>
          )}

        </div>
      )}

      {/* Main Bottom Launcher Pill */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-r from-cyan-600 via-sky-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white pl-3 sm:pl-4 pr-2.5 sm:pr-3 py-2 sm:py-2.5 rounded-full shadow-2xl shadow-cyan-600/30 border border-cyan-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900"></span>

          {/* Avatar / mini brand icon */}
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-950 flex items-center justify-center p-1 sm:p-1.5 shadow-inner shrink-0 border border-cyan-400/40">
            <PhoneCall className="w-4 h-4 text-cyan-300" />
          </div>

          <div className="flex flex-col text-right pr-0.5">
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1">
              <span>أبوسليم كول</span>
              <span className="text-[10px] text-amber-300 font-extrabold bg-amber-500/20 px-1 rounded">مجاناً</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-cyan-100 font-medium leading-none flex items-center gap-1">
              <span>موقعك .. يتكلم مع عملائك</span>
              <ChevronUp className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </span>
          </div>
        </button>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/80 flex items-center justify-center shadow-lg transition-colors cursor-pointer shrink-0"
          title="إخفاء"
        >
          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

    </div>
  );
};
