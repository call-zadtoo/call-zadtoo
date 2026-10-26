import React, { useState } from 'react';
import { Menu, X, Sparkles, LogOut, LayoutDashboard, Home, Code } from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';
import { GoogleUser } from './GoogleAuthModal';
import { UserRole } from '../types/roles';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onOpenTrialModal: () => void;
  onOpenStudio?: () => void;
  onTestCall: () => void;
  currentUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
  isAdminAuthenticated: boolean;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  onOpenTrialModal,
  onOpenStudio,
  onTestCall,
  currentUser,
  onOpenGoogleAuth,
  isAdminAuthenticated,
  onAdminLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Requirement: Hamburger menu is hidden for visitors, only enabled after member or admin login
  const isUserOrAdminLoggedIn = !!currentUser || isAdminAuthenticated;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 shadow-md w-full" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        
        {/* Right side in RTL: Hamburger & Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Hamburger Menu (3 bars): ONLY shown after Member or Admin logs in */}
          {isUserOrAdminLoggedIn && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="القائمة"
              title="القائمة"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          {/* Member Quick Switcher - ONLY shown if logged in as a member (currentUser) */}
          {currentUser && (
            <button
              onClick={() => onSelectRole(currentRole === 'subscriber' ? 'guest' : 'subscriber')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                currentRole === 'subscriber'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title={currentRole === 'subscriber' ? 'العودة لصفحة المنصة' : 'الانتقال إلى لوحة المشترك'}
            >
              {currentRole === 'subscriber' ? (
                <>
                  <Home className="w-3.5 h-3.5 text-amber-400" />
                  <span>الرئيسية</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>لوحة المشترك</span>
                </>
              )}
            </button>
          )}

          {/* Admin Authenticated Quick Access - ONLY shown if admin already unlocked via footer */}
          {isAdminAuthenticated && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectRole(currentRole === 'admin' ? 'guest' : 'admin')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  currentRole === 'admin'
                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title="لوحة الإدارة"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">لوحة الإدارة</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
              {onAdminLogout && (
                <button
                  onClick={onAdminLogout}
                  className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 border border-slate-700/60 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-all cursor-pointer hidden sm:flex"
                  title="تسجيل خروج الإدارة"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Google Sign In / User Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-white transition-all cursor-pointer"
              title="الملف الشخصي وإدارة الحساب"
            >
              <img src={currentUser.avatar} alt={currentUser.name} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-emerald-400" />
              <span className="font-semibold text-[11px] sm:text-xs hidden sm:inline">{currentUser.name}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            </button>
          ) : (
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-[11px] sm:text-xs shadow-sm transition-all cursor-pointer border border-slate-300"
              title="تسجيل الدخول عبر Google"
            >
              {/* Google G Icon */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span className="hidden xs:inline sm:inline">دخول الأعضاء</span>
            </button>
          )}

          {/* مرکز أكواد وودجت التواصل (Embed Studio) - ONLY shown to authenticated Members on desktop */}
          {currentUser && onOpenStudio && (
            <button
              onClick={onOpenStudio}
              className="hidden lg:flex px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 hover:text-cyan-200 font-bold text-xs border border-cyan-500/30 transition-all cursor-pointer items-center gap-1.5"
              title="توليد كود وودجت التواصل لموقعك"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>أكواد وودجت التواصل</span>
            </button>
          )}

          {/* ابدأ مجاناً بالكامل - Poster golden-yellow theme */}
          <button
            onClick={onOpenTrialModal}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] sm:text-xs md:text-sm shadow-md shadow-amber-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 hidden xs:inline" />
            <span>خدمة مجانية 100%</span>
          </button>
        </div>

        {/* Brand Logo أبوسليم | ABUSALIM */}
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => onSelectRole('guest')}
            className="cursor-pointer text-right flex items-center"
            title="أبوسليم - الصفحة الرئيسية"
          >
            <AbusalimLogo size="md" />
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu - ONLY accessible when logged in as member or admin */}
      {isUserOrAdminLoggedIn && mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/98 px-4 py-4 space-y-3 animate-slide-down">
          
          {currentUser && (
            <div className="space-y-2">
              <button
                onClick={() => {
                  onSelectRole(currentRole === 'subscriber' ? 'guest' : 'subscriber');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-amber-300 bg-amber-500/10 border border-amber-500/20"
              >
                <span>{currentRole === 'subscriber' ? 'العودة للصفحة الرئيسية' : 'الانتقال إلى لوحة المشترك'}</span>
                <LayoutDashboard className="w-4 h-4 text-amber-400" />
              </button>

              {onOpenStudio && (
                <button
                  onClick={() => {
                    onOpenStudio();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-cyan-300 bg-cyan-500/10 border border-cyan-500/20"
                >
                  <span>أكواد وودجت التواصل (واتساب + تلجرام + أبوسليم)</span>
                  <Code className="w-4 h-4 text-cyan-400" />
                </button>
              )}
            </div>
          )}

          {isAdminAuthenticated && (
            <button
              onClick={() => {
                onSelectRole(currentRole === 'admin' ? 'guest' : 'admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-emerald-300 bg-emerald-500/10 border border-emerald-500/20"
            >
              <span>{currentRole === 'admin' ? 'العودة للرئيسية' : 'لوحة الإدارة والمشتركين'}</span>
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            </button>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                onOpenGoogleAuth();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>إدارة الحساب</span>
            </button>
            <button
              onClick={() => {
                onTestCall();
                setMobileMenuOpen(false);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-cyan-500/30"
            >
              <span>مكالمة تجريبية</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
