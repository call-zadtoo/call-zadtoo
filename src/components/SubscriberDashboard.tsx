import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  PhoneCall, 
  MessageSquare, 
  Send, 
  Code, 
  Share2, 
  Store, 
  Layers, 
  Sliders, 
  BarChart3, 
  Users,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { generateAbusalimCallOnlyEmbed, generateWhatsAppOnlyEmbed, generateTelegramOnlyEmbed } from '../utils/embedGenerator';
import { MultiChannelConfig, DEFAULT_WIDGET_CONFIG } from '../types/widget';
import { GoogleUser } from './GoogleAuthModal';

import { SubscriberStatus } from '../types/roles';

interface SubscriberDashboardProps {
  currentUser: GoogleUser | null;
  onOpenStudio: () => void;
  onOpenQrModal: () => void;
  onStartCall: (source: string) => void;
  onSwitchToAdmin: () => void;
  memberStatus?: SubscriberStatus;
  statusReason?: string;
  callMinutesAllowed?: number;
}

export const SubscriberDashboard: React.FC<SubscriberDashboardProps> = ({
  currentUser,
  onOpenStudio,
  onOpenQrModal,
  onStartCall,
  onSwitchToAdmin,
  memberStatus = 'active',
  statusReason,
  callMinutesAllowed = 1000,
}) => {
  const [storeName, setStoreName] = useState(currentUser?.name ? `متجر ${currentUser.name}` : 'متجري التجاري');
  const [storeSlug, setStoreSlug] = useState('al-riyadh-store');
  const [whatsappNumber, setWhatsappNumber] = useState('966501234567');
  const [telegramUser, setTelegramUser] = useState('zadtoo_store');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const customCallLink = `https://call.zadtoo.com/@${storeSlug}`;

  const abusalimSnippet = generateAbusalimCallOnlyEmbed(storeSlug, storeName);
  const whatsappSnippet = generateWhatsAppOnlyEmbed(whatsappNumber, 'مرحباً، أود الاستفسار عبر واتساب زاد', true);
  const telegramSnippet = generateTelegramOnlyEmbed(telegramUser);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="space-y-8 text-right" dir="rtl">
      
      {/* Account Status Alert if Suspended or Blocked */}
      {memberStatus === 'suspended' && (
        <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 flex items-center justify-between gap-3 animate-shake">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <span className="font-bold block text-sm">تم تعليق هذا الحساب مؤقتاً بواسطة المشرف العام</span>
              <span className="text-xs text-amber-300/80">السبب: {statusReason || 'تجاوز شروط الاستخدام أو تحت تدقيق الإدارة'}. يرجى التواصل مع المشرف.</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
            حساب معلّق
          </span>
        </div>
      )}

      {memberStatus === 'blocked' && (
        <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/60 text-rose-200 flex items-center justify-between gap-3 animate-shake">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <span className="font-bold block text-sm">تم حجب هذا الحساب وحظر الخدمة بواسطة المشرف</span>
              <span className="text-xs text-rose-300/80">السبب: {statusReason || 'حظر نهائي للمتجر'}. تم تعطيل استقبال المكالمات والأكواد.</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/30">
            حساب محجوب
          </span>
        </div>
      )}

      {/* Role Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner">
              💼
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  لوحة العضو المشترك (التاجر)
                </span>
                {memberStatus === 'active' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    حساب نشط ومفعّل (رصيد: {callMinutesAllowed >= 9999 ? 'غير محدود' : `${callMinutesAllowed} دقيقة`})
                  </span>
                ) : memberStatus === 'suspended' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    حساب معلّق مؤقتاً
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1">
                    حساب محجوب
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {storeName}
              </h1>
              <p className="text-xs text-slate-400">
                إدارة روابط الاتصال المباشرة وأكواد وودجت موقعك المستقلة (أبوسليم، واتساب زاد، تلجرام)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenStudio}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              <span>استوديو تخصيص الأكواد</span>
            </button>
            <button
              onClick={() => onStartCall('تجربة من لوحة المشترك')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">تجربة الاتصال</span>
            </button>
          </div>
        </div>

        {/* Store Link Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center text-sm font-bold">
              🔗
            </span>
            <div>
              <span className="text-[11px] text-slate-400 block">رابط الاتصال الصوتي المباشر بمتجرك:</span>
              <span className="text-sm font-mono text-orange-400 font-bold" dir="ltr">
                {customCallLink}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => {
                window.location.hash = `/@${storeSlug}`;
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-all cursor-pointer flex items-center gap-1.5"
              title="معاينة وتجربة صفحة الاتصال المباشر لمتجرك"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>معاينة الرابط المباشر</span>
            </button>
            <button
              onClick={() => handleCopy(customCallLink, 'link')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copiedKey === 'link' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'link' ? 'تم نسخ الرابط!' : 'نسخ الرابط'}</span>
            </button>
            <button
              onClick={onOpenQrModal}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>رمز QR للمطبوعات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Settings Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span>⚙️ تخصيص بيانات التواصل لمتجرك لتحديث الأكواد فوراً:</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block font-semibold">اسم المتجر / النشاط:</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
              placeholder="مثال: متجر الزهور"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block font-semibold">رقم واتساب زاد (Zad WhatsApp):</label>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
              dir="ltr"
              placeholder="966501234567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-slate-400 block font-semibold">معرف تلجرام (Telegram):</label>
            <input
              type="text"
              value={telegramUser}
              onChange={(e) => setTelegramUser(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono text-left"
              dir="ltr"
              placeholder="username_store"
            />
          </div>
        </div>
      </div>

      {/* 3 Independent Code Embed Cards - Total Freedom of Choice */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>📋 أكواد الجافاسكريبت المستقلة لموقعك (انسخ الكود الذي تريده بحرية):</span>
            </h2>
            <p className="text-xs text-slate-400">
              يمكنك وضع كود واحد أو كودين أو الثلاثة معاً في متجرك (سلة، زد، ووردبريس، أو موقع خاص).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* 1. كود مكالمات أبوسليم المستقل */}
          <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-orange-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">1. كود مكالمات أبوسليم</h3>
                    <span className="text-[10px] text-orange-400">اتصال صوتي مجاني من المتصفح</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  مستقل
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                يضيف زراً عائماً في متجرك يتيح للعميل التحدث مع فريقك مباشرة بنقرة واحدة عبر المايكروفون.
              </p>

              <div className="relative">
                <pre className="bg-slate-950 p-3 rounded-xl text-[10px] text-orange-300 font-mono overflow-x-auto max-h-36 border border-slate-800" dir="ltr">
                  {abusalimSnippet}
                </pre>
              </div>
            </div>

            <button
              onClick={() => handleCopy(abusalimSnippet, 'call')}
              className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {copiedKey === 'call' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'call' ? 'تم نسخ كود أبوسليم!' : 'نسخ كود مكالمات أبوسليم'}</span>
            </button>
          </div>

          {/* 2. كود واتساب زاد المستقل */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-emerald-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">2. كود واتساب زاد (Zad)</h3>
                    <span className="text-[10px] text-emerald-400">فتح دردشة واتساب للرقم {whatsappNumber}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  مستقل
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                يظهر أيقونة واتساب العائمة في متجرك، وبمجرد نقر العميل يفتح محادثة واتساب فورية مع متجرك.
              </p>

              <div className="relative">
                <pre className="bg-slate-950 p-3 rounded-xl text-[10px] text-emerald-300 font-mono overflow-x-auto max-h-36 border border-slate-800" dir="ltr">
                  {whatsappSnippet}
                </pre>
              </div>
            </div>

            <button
              onClick={() => handleCopy(whatsappSnippet, 'whatsapp')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {copiedKey === 'whatsapp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'whatsapp' ? 'تم نسخ كود واتساب زاد!' : 'نسخ كود واتساب زاد'}</span>
            </button>
          </div>

          {/* 3. كود تلجرام المستقل */}
          <div className="bg-slate-900 border border-sky-500/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:border-sky-500/50 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">3. كود وودجت تلجرام</h3>
                    <span className="text-[10px] text-sky-400">محادثة تليجرام لـ @{telegramUser}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  مستقل
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                أيقونة تلجرام عائمة أنيقة، بمجرد ضغط العميل عليها تفتح الدردشة المباشرة على حسابك في تلجرام.
              </p>

              <div className="relative">
                <pre className="bg-slate-950 p-3 rounded-xl text-[10px] text-sky-300 font-mono overflow-x-auto max-h-36 border border-slate-800" dir="ltr">
                  {telegramSnippet}
                </pre>
              </div>
            </div>

            <button
              onClick={() => handleCopy(telegramSnippet, 'telegram')}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {copiedKey === 'telegram' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'telegram' ? 'تم نسخ كود تلجرام!' : 'نسخ كود تلجرام'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Subscriber Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-orange-400" />
            <span>إحصائيات متجرك الشهرية (مجانية)</span>
          </h3>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            نشط الآن
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">المكالمات المستلمة</span>
            <span className="text-lg font-black text-orange-400 mt-1 block">42</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">نقرات واتساب</span>
            <span className="text-lg font-black text-emerald-400 mt-1 block">89</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block">نقرات تلجرام</span>
            <span className="text-lg font-black text-sky-400 mt-1 block">34</span>
          </div>
        </div>
      </div>

    </div>
  );
};
