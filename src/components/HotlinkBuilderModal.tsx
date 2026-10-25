import React, { useState } from 'react';
import { 
  Sparkles, 
  Link as LinkIcon, 
  Bot, 
  Users, 
  Shuffle, 
  CheckCircle2, 
  Copy, 
  Check, 
  QrCode, 
  Code,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';

interface HotlinkBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (hotlinkUrl: string) => void;
  onGoogleSignIn?: () => void;
  isLoggedIn?: boolean;
}

export const HotlinkBuilderModal: React.FC<HotlinkBuilderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onGoogleSignIn,
  isLoggedIn = false,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [brandName, setBrandName] = useState('متجري');
  const [slug, setSlug] = useState('my-brand');
  const [responderType, setResponderType] = useState<'team' | 'ai' | 'hybrid'>('hybrid');
  const [createdUrl, setCreatedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = slug.trim() ? `https://call.zadtoo.com/${slug.trim()}` : `https://call.zadtoo.com`;
    setCreatedUrl(finalUrl);
    setStep(2);
    onSuccess(finalUrl);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" dir="rtl">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <AbusalimLogo size="sm" />
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              مجاني بالكامل 100%
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                أنشئ خط اتصالك المجاني في ثوانٍ
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                خدمة <strong className="text-orange-400">أبوسليم ABUSALIM</strong> مجانية بالكامل. اختر اسم الرابط ومن يرد على مكالماتك (فريقك أو الوكيل الذكي).
              </p>
            </div>

            {/* Google notice */}
            {!isLoggedIn && onGoogleSignIn && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs text-slate-300">هل تفضل ربطه بحساب Google لحفظ الرابط؟</span>
                </div>
                <button
                  type="button"
                  onClick={onGoogleSignIn}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  دخول سريع
                </button>
              </div>
            )}

            {/* Field 1: Brand Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                اسم نشاطك التجاري / المتجر:
              </label>
              <input
                type="text"
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="مثال: شركة النخبة، متجر أوركيد..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Field 2: Slug */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-200 block">
                رابط الاتصال المجاني المخصص:
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono" dir="ltr">call.zadtoo.com/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="my-brand"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Field 3: Who answers? */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">
                اختر من يرد على المكالمات الواردة:
              </label>
              <div className="grid grid-cols-3 gap-2 text-right">
                <button
                  type="button"
                  onClick={() => setResponderType('team')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    responderType === 'team'
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-5 h-5 text-orange-400" />
                  <span>فريقك فقط</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResponderType('ai')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    responderType === 'ai'
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Bot className="w-5 h-5 text-violet-400" />
                  <span>وكيل ذكي AI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResponderType('hybrid')}
                  className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    responderType === 'hybrid'
                      ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Shuffle className="w-5 h-5 text-emerald-400" />
                  <span>ذكاء + تحويل</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-orange-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>توليد الرابط وتفعيل الخط مجاناً 100%</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <p className="text-[11px] text-center text-slate-400">
              مجاني بالكامل حالياً • بدون أي اشتراكات أو بطاقة ائتمان • إمكانية الترقية لخدمات مدفوعة لاحقاً
            </p>
          </form>
        ) : (
          /* Step 2: Created Successfully */
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">تم تجهيز خط أبوسليم (ABUSALIM) الخاص بك!</h3>
              <p className="text-xs text-slate-400">
                شارك هذا الرابط في موقعك، إعلاناتك، أو عبر رمز QR وسيتصل عملاؤك فوراً وبشكل مجاني
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs text-orange-400 truncate px-2" dir="ltr">
                {createdUrl}
              </span>
              <button
                onClick={copyLink}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                إغلاق والعودة
              </button>
              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new CustomEvent('open-hotliney-call', { detail: { source: 'الرابط المخصص: ' + slug } }));
                }}
                className="py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold cursor-pointer shadow-md"
              >
                جرّب الاتصال بالرابط
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
