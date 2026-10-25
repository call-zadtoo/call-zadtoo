import React from 'react';

export const AbusalimLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-black',
    lg: 'text-2xl font-black'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} dir="rtl">
      {/* Visual Stylized Logo: Custom Shield / Audio Wave connection in Orange & Navy */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/25 p-1.5 border border-orange-400/40">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-white">
            {/* Handset phone combined with smile/link */}
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </div>
        <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
        </span>
      </div>

      <div className="flex flex-col text-right">
        <div className={`tracking-tight text-white flex items-center gap-1.5 leading-none ${textSizes[size]}`}>
          <span className="text-orange-500">أبوسليم</span>
          <span className="text-slate-400 text-xs font-mono font-medium tracking-wider">| ABUSALIM</span>
        </div>
        <div className={`text-slate-400 font-medium mt-1 flex items-center gap-1 ${subSizes[size]}`}>
          <span>رابط مكالماتك الذكي</span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded border border-emerald-500/20">مجاناً 100%</span>
        </div>
      </div>
    </div>
  );
};

// Backwards compatibility export
export const HotlineyLogo = AbusalimLogo;
