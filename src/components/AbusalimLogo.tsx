import React from 'react';

export const AbusalimLogo: React.FC<{ 
  className?: string; 
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}> = ({ 
  className = '', 
  size = 'md',
  showTagline = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-lg sm:text-xl font-black',
    lg: 'text-xl sm:text-2xl font-black'
  };

  const subSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} dir="rtl">
      {/* Official Poster Logo Icon: Stylized Curved "A" in Cyan & Emerald */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center p-1.5 border border-cyan-500/30 shadow-lg shadow-cyan-500/20">
          <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
            <defs>
              <linearGradient id="cyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#00D2FF" />
              </linearGradient>
              <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#00E676" />
              </linearGradient>
            </defs>
            {/* Left curved wing of "A" in vibrant cyan */}
            <path
              d="M10 28 C9 22, 11 14, 18 8 C18 12, 14 18, 14 26 C13 28, 11 28, 10 28 Z"
              fill="url(#cyanGrad)"
            />
            {/* Right curved wing of "A" in vibrant emerald */}
            <path
              d="M18 8 C25 14, 27 22, 26 28 C25 28, 23 28, 22 26 C22 18, 18 12, 18 8 Z"
              fill="url(#greenGrad)"
            />
            {/* Center cross connection */}
            <path
              d="M13 21 C16 19, 20 19, 23 21"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Dynamic dot / voice pulse */}
            <circle cx="18" cy="14" r="2.2" fill="#00D2FF" />
          </svg>
        </div>
        {/* Active online pulse badge */}
        <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-white"></span>
        </span>
      </div>

      <div className="flex flex-col text-right min-w-0">
        <div className={`tracking-tight text-white flex items-center gap-1.5 leading-none ${textSizes[size]}`}>
          <span className="font-black text-white">أبوسليم</span>
          <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 text-[10px] sm:text-xs font-black tracking-wider">
            كول
          </span>
          <span className="text-cyan-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest hidden sm:inline" dir="ltr">
            ABUSALIM — CALL —
          </span>
        </div>

        {showTagline && (
          <div className={`text-slate-300 font-medium mt-1 flex items-center gap-1.5 ${subSizes[size]}`}>
            <span className="text-cyan-300 font-bold">موقعك .. يتكلم مع عملائك</span>
            <span className="text-amber-300 font-extrabold bg-amber-500/15 px-1 py-0.2 rounded border border-amber-400/30 text-[9px] sm:text-[10px] hidden sm:inline">
              مجاناً 100%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Backwards compatibility export
export const HotlineyLogo = AbusalimLogo;
