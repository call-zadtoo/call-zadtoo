import React, { useState } from 'react';
import { 
  PhoneCall, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare, 
  Send as TelegramIcon, 
  ArrowRight, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Globe, 
  Clock, 
  Headphones, 
  AlertTriangle, 
  Ban, 
  Volume2,
  Lock,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';
import { SubscriberMember } from '../types/roles';

interface DirectStoreCallViewProps {
  store: SubscriberMember;
  onStartCall: (sourceLabel: string, storeName: string) => void;
  onGoHome: () => void;
  onOpenQrModal?: () => void;
}

export const DirectStoreCallView: React.FC<DirectStoreCallViewProps> = ({
  store,
  onStartCall,
  onGoHome,
  onOpenQrModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCard, setShowQrCard] = useState(false);

  const fullStoreUrl = `https://call.zadtoo.com/@${store.storeSlug}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(fullStoreUrl)}&color=0f172a&bgcolor=ffffff&qzone=2`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullStoreUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isStoreActive = store.status === 'active';
  const isStoreSuspended = store.status === 'suspended';
  const isStoreBlocked = store.status === 'blocked';

  return (
    <div className="flex-1 w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center py-6 sm:py-12 px-3.5 sm:px-6 relative overflow-hidden" dir="rtl">
      {/* Background ambient decorative glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-2xl w-full mx-auto space-y-6 relative z-10">
        
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 rotate-180 text-orange-400" />
            <span>الصفحة الرئيسية لمنصة أبوسليم</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>call.zadtoo.com/@{store.storeSlug}</span>
          </span>
        </div>

        {/* ================= MAIN DIRECT CALL CARD ================= */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800/90 shadow-2xl p-5 sm:p-8 backdrop-blur-xl text-center space-y-6 overflow-hidden">
          
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400"></div>

          {/* Platform & Store Identification */}
          <div className="flex flex-col items-center justify-center space-y-3">
            
            {/* Store Avatar / Monogram */}
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10 flex items-center justify-center text-3xl sm:text-4xl font-black text-cyan-300">
                {store.storeName.charAt(0) || '🏪'}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white shadow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Store Name & Verified Badge */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>متجر موثّق في شبكة أبوسليم كول</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {store.storeName}
              </h1>
              <p className="text-xs sm:text-sm text-cyan-400 font-mono font-semibold" dir="ltr">
                @{store.storeSlug}
              </p>
            </div>

            {/* Store Real-time Call Availability Status */}
            {isStoreActive && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>الخط الصوتي مباشر ومتاح للاستقبال الآن</span>
              </div>
            )}

            {isStoreSuspended && (
              <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs text-right w-full space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>خط الاتصال معلق مؤقتاً لهذا المتجر</span>
                </div>
                <p className="text-[11px] text-amber-300/80">
                  {store.statusReason || 'المتجر تحت المراجعة الإدارية الدورية. يرجى استخدام القنوات البديلة أو معاودة الاتصال لاحقاً.'}
                </p>
              </div>
            )}

            {isStoreBlocked && (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs text-right w-full space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-300">
                  <Ban className="w-4 h-4 shrink-0" />
                  <span>خط الاتصال الصوتي محجوب لهذا المتجر</span>
                </div>
                <p className="text-[11px] text-rose-300/80">
                  {store.statusReason || 'تم حجب هذا الحساب لمخالفة سياسات الاستخدام من قبل المشرف العام.'}
                </p>
              </div>
            )}
          </div>

          {/* ================= PRIMARY CALL ACTION BUTTON ================= */}
          {isStoreActive ? (
            <div className="space-y-3 pt-2">
              <button
                onClick={() => onStartCall(`رابط المتجر المباشر: @${store.storeSlug}`, store.storeName)}
                className="w-full group relative overflow-hidden py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-500 text-white font-black text-lg sm:text-xl shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer flex items-center justify-center gap-3 border border-emerald-400/30"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <span>اتصال صوتي فوري ومجاني الآن</span>
                <span className="text-xs font-normal opacity-90 px-2 py-0.5 rounded-full bg-black/20 hidden sm:inline">
                  بدون رصيد
                </span>
              </button>

              <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>مكالمة آمنة ومجانية 100% عبر المتصفح دون كشف رقم هاتفك الشخصي</span>
              </p>
            </div>
          ) : (
            <div className="py-4 text-center">
              <button
                disabled
                className="w-full py-4 px-6 rounded-2xl bg-slate-800 text-slate-500 font-bold text-sm cursor-not-allowed border border-slate-700/60"
              >
                الاتصال غير متاح حالياً بهذا المتجر
              </button>
            </div>
          )}

          {/* Secondary Quick Action Row: WhatsApp, Telegram, Share */}
          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-xs text-slate-400 font-bold block mb-3">
              أو تواصل مع المتجر عبر القنوات السريعة المعتمدة:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* WhatsApp direct */}
              {store.whatsappNumber ? (
                <a
                  href={`https://wa.me/${store.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً ${store.storeName}، أتواصل معك عبر صفحة الاتصال المباشر`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>واتساب زاد</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-500 text-xs cursor-not-allowed opacity-60"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>واتساب (غير محدد)</span>
                </button>
              )}

              {/* Telegram direct */}
              {store.telegramUser ? (
                <a
                  href={`https://t.me/${store.telegramUser.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/30 text-sky-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  <TelegramIcon className="w-4 h-4 text-sky-400" />
                  <span>تلجرام المتجر</span>
                </a>
              ) : (
                <button
                  disabled
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-500 text-xs cursor-not-allowed opacity-60"
                >
                  <TelegramIcon className="w-4 h-4" />
                  <span>تلجرام (غير محدد)</span>
                </button>
              )}

              {/* Copy URL */}
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>

              {/* QR Code toggle */}
              <button
                onClick={() => setShowQrCard(!showQrCard)}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{showQrCard ? 'إخفاء QR' : 'رمز QR'}</span>
              </button>
            </div>
          </div>

          {/* Expandable QR Code Card for Scanning */}
          {showQrCard && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-3 animate-fade-in">
              <div className="p-2.5 bg-white rounded-2xl shadow-md">
                <img src={qrImageUrl} alt="QR Code" className="w-40 h-40 sm:w-48 sm:h-48 object-contain" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-white">امسح الكود بكاميرا الجوال للاتصال المباشر</p>
                <p className="text-[11px] text-slate-400">صالح للطباعة على الفواتير، الملصقات، وتغليف الشحنات</p>
              </div>
            </div>
          )}

          {/* 3 Pillar Features for Callers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-right">
            
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">صوت HD عالي النقاء</span>
                <span className="text-[11px] text-slate-400">اتصال WebRTC فائق الوضوح ومستقر.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">خصوصية تامة</span>
                <span className="text-[11px] text-slate-400">لا حاجة لمشاركة رقم هاتفك الخاص.</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/60 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-white block">بدون تثبيت برامج</span>
                <span className="text-[11px] text-slate-400">يعمل مباشرة من أي متصفح هاتف أو كمبيوتر.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer info & Powered by Abusalim Call */}
        <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AbusalimLogo size="sm" />
            <span>• نظام الاتصال المباشر والرد التفاعلي للمتاجر</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4 cursor-pointer"
            >
              هل تريد تفعيل خط لموقعك مجاناً؟ اضغط هنا
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
