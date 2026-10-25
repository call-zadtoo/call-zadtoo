import React, { useState } from 'react';
import { Menu, X, Globe, PhoneCall, LayoutDashboard, Sparkles, User, LogIn, ShieldCheck } from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';
import { GoogleUser } from './GoogleAuthModal';

interface NavbarProps {
  currentView: 'landing' | 'agent_dashboard';
  onSwitchView: (view: 'landing' | 'agent_dashboard') => void;
  onOpenTrialModal: () => void;
  onTestCall: () => void;
  currentUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSwitchView,
  onOpenTrialModal,
  onTestCall,
  currentUser,
  onOpenGoogleAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lang, setLang] = useState<'ar' | 'en'>('ar');

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Right side in RTL: Menu hamburger & Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Google Sign In / User Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-white transition-all cursor-pointer"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-6 h-6 rounded-full object-cover border border-emerald-400" />
              <span className="font-semibold hidden sm:inline">{currentUser.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </button>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-sm transition-all cursor-pointer border border-slate-300"
            >
              {/* Google G Icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>تسجيل عبر Google</span>
            </button>
          )}

          {/* ابدأ مجاناً بالكامل - Free 100% */}
          <button
            onClick={onOpenTrialModal}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>ابدأ مجاناً 100%</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>
        </div>

        {/* Center: Mode Toggle: Landing Page vs Agent Console */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => onSwitchView('landing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            صفحة الخدمة
          </button>

          <button
            onClick={() => onSwitchView('agent_dashboard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'agent_dashboard'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>لوحة تحكم الفريق (رد المتصفح)</span>
          </button>
        </div>

        {/* Left side in RTL: Brand Logo أبوسليم | ABUSALIM */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSwitchView('landing')}
            className="cursor-pointer text-right flex items-center"
          >
            <AbusalimLogo size="md" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/98 px-4 py-4 space-y-3 animate-slide-down">
          <div className="space-y-1">
            <button
              onClick={() => {
                onSwitchView('landing');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                currentView === 'landing' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>صفحة أبوسليم ABUSALIM الرئيسية</span>
              <span>🏠</span>
            </button>

            <button
              onClick={() => {
                onSwitchView('agent_dashboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                currentView === 'agent_dashboard' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>لوحة تحكم الفريق (رد المتصفح والسجل)</span>
              <span>📊</span>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenGoogleAuth();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>تسجيل الدخول عبر Google</span>
            </button>
            <button
              onClick={() => {
                onTestCall();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>مكالمة تجريبية</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
