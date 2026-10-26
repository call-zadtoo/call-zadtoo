import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  QrCode, 
  Code, 
  ExternalLink, 
  PhoneCall, 
  MessageSquare, 
  Send as TelegramIcon, 
  Smartphone, 
  Eye, 
  Save, 
  Layers, 
  ArrowLeft, 
  ShieldCheck,
  CheckCircle2,
  Info,
  Sliders,
  Share2
} from 'lucide-react';
import { AbusalimLogo } from './AbusalimLogo';
import { MultiChannelConfig, DEFAULT_WIDGET_CONFIG } from '../types/widget';
import { 
  generateDirectLinks, 
  generateUniversalJsEmbed, 
  generateAbusalimCallOnlyEmbed,
  generateWhatsAppOnlyEmbed, 
  generateTelegramOnlyEmbed, 
  generateHtmlButtonsEmbed 
} from '../utils/embedGenerator';
import { GoogleUser } from './GoogleAuthModal';
import { db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface EmbedStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: GoogleUser | null;
  onOpenGoogleAuth: () => void;
  onTestCall: (source: string) => void;
}

export const EmbedStudioModal: React.FC<EmbedStudioModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenGoogleAuth,
  onTestCall,
}) => {
  const [config, setConfig] = useState<MultiChannelConfig>(() => {
    try {
      const saved = localStorage.getItem('abusalim_widget_config');
      return saved ? JSON.parse(saved) : DEFAULT_WIDGET_CONFIG;
    } catch {
      return DEFAULT_WIDGET_CONFIG;
    }
  });

  const [activeTab, setActiveTab] = useState<'channels' | 'design' | 'codes' | 'guide'>('codes');
  const [activeCodeSubTab, setActiveCodeSubTab] = useState<'call' | 'whatsapp' | 'telegram' | 'direct_links' | 'html' | 'all_in_one'>('call');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewMenuOpen, setPreviewMenuOpen] = useState(false);

  // Sync from Firestore if user logged in
  useEffect(() => {
    if (currentUser?.id && db) {
      getDoc(doc(db, 'widgets', currentUser.id))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as MultiChannelConfig;
            setConfig((prev) => ({ ...prev, ...data }));
          }
        })
        .catch((err) => console.warn('Could not fetch widget config from firestore:', err));
    }
  }, [currentUser?.id]);

  if (!isOpen) return null;

  const links = generateDirectLinks(config);
  const callJs = generateAbusalimCallOnlyEmbed(config.slug, config.brandName, config.position, config.themeColor, config.buttonLabel);
  const whatsappJs = generateWhatsAppOnlyEmbed(config.whatsappNumber, config.whatsappMessage, config.isZadWhatsapp, config.position);
  const telegramJs = generateTelegramOnlyEmbed(config.telegramUsername, config.position);
  const universalJs = generateUniversalJsEmbed(config);
  const htmlButtons = generateHtmlButtonsEmbed(config);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('abusalim_widget_config', JSON.stringify(config));
      if (currentUser?.id && db) {
        await setDoc(doc(db, 'widgets', currentUser.id), {
          ...config,
          userId: currentUser.id,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.warn('Save error:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md" dir="rtl">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <AbusalimLogo size="sm" />
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>مركز أكواد وودجت التواصل المجاني</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  مجاني 100%
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                حرية اختيار الكود المناسب: مكالمات أبوسليم • واتساب زاد • دردشة تلجرام • روابط مباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>تم الحفظ!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ الإعدادات'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Member Access Protection: Gate for Unauthenticated Visitors */}
        {!currentUser ? (
          <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center text-center space-y-5 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-2 max-w-md">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                منطقة الأعضاء المسجلين
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                أكواد وودجت التواصل مخصصة للأعضاء
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                لحماية أرقامك وربط قنوات التواصل (واتساب زاد، تلجرام، ومكالمات أبوسليم الصوتية) بنجاح مع تتبع سجلات المكالمات، يرجى تسجيل الدخول بحسابك أولاً مجاناً.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenGoogleAuth();
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>تسجيل الدخول / إنشاء حساب مجاني الآن</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/50 overflow-x-auto">
              <button
                onClick={() => setActiveTab('channels')}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'channels'
                    ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>1. قنوات التواصل (مكالمة، واتساب، تلجرام)</span>
              </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'design'
                ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>2. المظهر والمعاينة الحية</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'codes'
                ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>3. نسخ الأكواد والروابط الجاهزة</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-orange-400 border-t-2 border-orange-500 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>4. دليل التثبيت (سلة، زد، ووردبريس)</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ================= TAB 1: CHANNELS CONFIGURATION ================= */}
          {activeTab === 'channels' && (
            <div className="space-y-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">بيانات هويتك الأساسية</h3>
                  <p className="text-xs text-slate-400">ستظهر هذه البيانات لعملائك أعلى قائمة التواصل</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    value={config.brandName}
                    onChange={(e) => setConfig({ ...config, brandName: e.target.value })}
                    placeholder="اسم المتجر أو الشركة"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-400" dir="ltr">
                    <span className="text-[11px] text-slate-500">call.zadtoo.com/</span>
                    <input
                      type="text"
                      value={config.slug}
                      onChange={(e) => setConfig({ ...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '') })}
                      placeholder="my-brand"
                      className="w-24 bg-transparent text-orange-400 font-mono text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Channel 1: Abusalim Web Call */}
                <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  config.callEnabled ? 'bg-orange-950/20 border-orange-500/40' : 'bg-slate-950/40 border-slate-800 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">مكالمات أبوسليم الصوتية</h4>
                        <span className="text-[11px] text-orange-400">اتصال مجاني فوري من المتصفح</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.callEnabled}
                        onChange={(e) => setConfig({ ...config, callEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    يتيح لعميلك الاتصال بفريقك أو بوكيل ذكي بضغطة زر دون الحاجة لتحميل أي تطبيق أو تسجيل هاتف.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-300 block">نوع الرد على المكالمات:</label>
                    <select
                      value={config.responderType}
                      onChange={(e) => setConfig({ ...config, responderType: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="hybrid">ذكاء اصطناعي + تحويل لموظف (الأفضل)</option>
                      <option value="team">فريق خدمة العملاء فقط</option>
                      <option value="ai">وكيل ذكي AI بالكامل</option>
                    </select>
                  </div>
                </div>

                {/* Channel 2: WhatsApp / Zad WhatsApp */}
                <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  config.whatsappEnabled ? 'bg-emerald-950/20 border-emerald-500/40' : 'bg-slate-950/40 border-slate-800 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white">واتساب زاد / WhatsApp</h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                            زاد
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-400">فتح دردشة فورية مع رسالة معدة مسبقاً</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.whatsappEnabled}
                        onChange={(e) => setConfig({ ...config, whatsappEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        رقم هاتف الواتساب (مع مفتاح الدولة، مثل 966500000000):
                      </label>
                      <input
                        type="text"
                        value={config.whatsappNumber}
                        onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                        placeholder="966500000000"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-300 block">
                        الرسالة التلقائية الأولى عند فتح الدردشة:
                      </label>
                      <input
                        type="text"
                        value={config.whatsappMessage}
                        onChange={(e) => setConfig({ ...config, whatsappMessage: e.target.value })}
                        placeholder="مرحباً، أود الاستفسار عن منتجاتكم"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-300 font-medium">تكامل واتساب زاد (Zad WhatsApp)</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          جاهز لربط كود زاد
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.isZadWhatsapp}
                        onChange={(e) => setConfig({ ...config, isZadWhatsapp: e.target.checked })}
                        className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Channel 3: Telegram Floating Chat */}
                <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  config.telegramEnabled ? 'bg-sky-950/20 border-sky-500/40' : 'bg-slate-950/40 border-slate-800 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                        <TelegramIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">دردشة تلجرام الفورية</h4>
                        <span className="text-[11px] text-sky-400">أيقونة عائمة تفتح المحادثة بلمسة</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.telegramEnabled}
                        onChange={(e) => setConfig({ ...config, telegramEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-600"></div>
                    </label>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    تفتح محادثة تيليجرام مباشرة مع حسابك أو مع بوت خدمة العملاء بمجرد ضغط الزائر.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      اسم المستخدم في تيليجرام أو البوت (مع أو بدون @):
                    </label>
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700" dir="ltr">
                      <span className="text-sky-400 font-mono text-xs">t.me/</span>
                      <input
                        type="text"
                        value={config.telegramUsername}
                        onChange={(e) => setConfig({ ...config, telegramUsername: e.target.value.replace(/^@/, '') })}
                        placeholder="zadtoo"
                        className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Channel 4: Direct Phone Call */}
                <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
                  config.directPhoneEnabled ? 'bg-slate-900 border-slate-700' : 'bg-slate-950/40 border-slate-800 opacity-70'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">اتصال هاتفي مباشر (GSM)</h4>
                        <span className="text-[11px] text-slate-400">تحويل سريع لطلب رقم الهاتف العادي</span>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.directPhoneEnabled}
                        onChange={(e) => setConfig({ ...config, directPhoneEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500"></div>
                    </label>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    خيار إضافي للعملاء الذين يفضلون الاتصال الخلوي التقليدي مباشرة.
                  </p>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">
                      رقم الهاتف للاتصال المباشر:
                    </label>
                    <input
                      type="text"
                      value={config.directPhoneNumber}
                      onChange={(e) => setConfig({ ...config, directPhoneNumber: e.target.value })}
                      placeholder="+966500000000"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none"
                      dir="ltr"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}


          {/* ================= TAB 2: DESIGN & LIVE PREVIEW ================= */}
          {activeTab === 'design' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Controls Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">طريقة عرض الودجت في موقعك:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, displayMode: 'all_in_one' })}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        config.displayMode === 'all_in_one'
                          ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>✨ ودجت شامل متعدد القنوات</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        يفتح قائمة تجمع المكالمة والواتساب والتلجرام
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, displayMode: 'whatsapp_only' })}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        config.displayMode === 'whatsapp_only'
                          ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>💬 زر واتساب عائم فقط</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        يفتح محادثة واتساب مباشرة عند النقر
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, displayMode: 'telegram_only' })}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        config.displayMode === 'telegram_only'
                          ? 'bg-sky-500/15 border-sky-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>✈️ زر تلجرام عائم فقط</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        أيقونة تلجرام عائمة تفتح شات التلجرام
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfig({ ...config, displayMode: 'call_only' })}
                      className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                        config.displayMode === 'call_only'
                          ? 'bg-orange-500/15 border-orange-500 text-white shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>📞 زر مكالمة أبوسليم فقط</span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        بدء مكالمة صوتية مجانية مباشرة
                      </span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white block">موضع الزر في الشاشة:</label>
                    <select
                      value={config.position}
                      onChange={(e) => setConfig({ ...config, position: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="bottom-right">أسفل اليمين (موصى به للمتاجر العربية)</option>
                      <option value="bottom-left">أسفل اليسار</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white block">اللون الرئيسي للزر:</label>
                    <select
                      value={config.themeColor}
                      onChange={(e) => setConfig({ ...config, themeColor: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="orange">برتقالي أبوسليم الفاخر</option>
                      <option value="emerald">أخضر واتساب الزمردي</option>
                      <option value="sky">أزرق تلجرام السماوي</option>
                      <option value="violet">بنفسجي عصري</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">نص الزر العائم:</label>
                  <input
                    type="text"
                    value={config.buttonLabel}
                    onChange={(e) => setConfig({ ...config, buttonLabel: e.target.value })}
                    placeholder="تواصل مع أبوسليم"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white block">رسالة الترحيب أعلى القائمة:</label>
                  <input
                    type="text"
                    value={config.welcomeMessage}
                    onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                    placeholder="مرحباً بك! تواصل معنا مجاناً بالطريقة الأنسب لك"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Interactive Preview Box */}
              <div className="lg:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">معاينة تفاعلية حية (جرّب الضغط):</span>
                  <span className="text-[10px] text-emerald-400 font-medium">● تفاعلي حقيقي</span>
                </div>

                {/* Simulated Web Page Frame */}
                <div className="relative h-80 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 overflow-hidden shadow-inner p-4 flex flex-col justify-between">
                  {/* Fake Website Header Mock */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span className="font-mono text-[10px] text-slate-500 mr-2" dir="ltr">your-store.com</span>
                    </div>
                    <span className="font-bold text-slate-300">{config.brandName || 'متجرك الإلكتروني'}</span>
                  </div>

                  <div className="p-3 text-center space-y-1 my-auto">
                    <div className="w-10 h-10 rounded-xl bg-slate-800/80 mx-auto flex items-center justify-center text-slate-400">
                      🛍️
                    </div>
                    <div className="text-xs font-bold text-white">صفحة متجرك أو موقعك</div>
                    <div className="text-[11px] text-slate-400 max-w-[220px] mx-auto">
                      سيظهر الزر العائم في هذا الموضع بدقة لجميع الزوار على الحاسوب والجوال
                    </div>
                  </div>

                  {/* Render the actual interactive preview widget */}
                  <div className={`relative flex flex-col items-${config.position === 'bottom-right' ? 'start' : 'end'}`}>
                    
                    {/* Expanded Menu inside preview */}
                    {previewMenuOpen && config.displayMode === 'all_in_one' && (
                      <div className="mb-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 space-y-2 animate-slide-up text-right">
                        <div className="border-b border-slate-800 pb-2">
                          <span className="text-xs font-bold text-white block">{config.brandName}</span>
                          <span className="text-[10px] text-slate-400">{config.welcomeMessage}</span>
                        </div>

                        {config.callEnabled && (
                          <div 
                            onClick={() => onTestCall('معاينة الودجت التفاعلي')}
                            className="p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 flex items-center justify-between cursor-pointer transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">📞</span>
                              <div>
                                <span className="text-xs font-bold text-orange-300 block">مكالمة صوتية مجانية</span>
                                <span className="text-[9px] text-orange-200">تحدث من المتصفح الآن</span>
                              </div>
                            </div>
                            <span className="text-[9px] font-bold bg-orange-600 text-white px-1.5 py-0.5 rounded">مجاناً</span>
                          </div>
                        )}

                        {config.whatsappEnabled && (
                          <a 
                            href={links.whatsappUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-between text-decoration-none transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">💬</span>
                              <div>
                                <span className="text-xs font-bold text-emerald-300 block">{config.isZadWhatsapp ? 'واتساب زاد الفوري' : 'واتساب مباشر'}</span>
                                <span className="text-[9px] text-emerald-200">فتح الدردشة</span>
                              </div>
                            </div>
                            <span className="text-xs text-emerald-400">←</span>
                          </a>
                        )}

                        {config.telegramEnabled && (
                          <a 
                            href={links.telegramUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 flex items-center justify-between text-decoration-none transition-all"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">✈️</span>
                              <div>
                                <span className="text-xs font-bold text-sky-300 block">دردشة تلجرام</span>
                                <span className="text-[9px] text-sky-200">فتح المحادثة الفورية</span>
                              </div>
                            </div>
                            <span className="text-xs text-sky-400">←</span>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Floating Main Button */}
                    <button
                      onClick={() => {
                        if (config.displayMode === 'all_in_one') {
                          setPreviewMenuOpen(!previewMenuOpen);
                        } else if (config.displayMode === 'call_only') {
                          onTestCall('زر المكالمة فقط');
                        } else if (config.displayMode === 'whatsapp_only') {
                          window.open(links.whatsappUrl, '_blank');
                        } else if (config.displayMode === 'telegram_only') {
                          window.open(links.telegramUrl, '_blank');
                        }
                      }}
                      className="relative flex items-center gap-2 px-3.5 py-2 rounded-full text-white font-bold text-xs shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: 
                          config.displayMode === 'whatsapp_only' ? '#25D366' :
                          config.displayMode === 'telegram_only' ? '#0088cc' :
                          config.themeColor === 'emerald' ? '#059669' :
                          config.themeColor === 'sky' ? '#0284c7' :
                          config.themeColor === 'violet' ? '#7c3aed' : '#ea580c'
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                      <span>
                        {config.displayMode === 'whatsapp_only' ? 'واتساب زاد' :
                         config.displayMode === 'telegram_only' ? 'دردشة تلجرام' :
                         config.displayMode === 'call_only' ? 'اتصال مجاني' : config.buttonLabel}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}


          {/* ================= TAB 3: CODES & DIRECT LINKS ================= */}
          {activeTab === 'codes' && (
            <div className="space-y-5">
              
              {/* Freedom of Choice Banner */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/30 via-slate-900 to-slate-900 border border-orange-500/30 flex items-start sm:items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-white block">حرية اختيار كاملة للأكواد لمتجرك وموقعك:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    اختر الكود المناسب لمتطلباتك بشكل مستقل — يمكنك اختيار <strong>كود مكالمات أبوسليم الصوتية فقط</strong>، أو <strong>كود واتساب زاد فقط</strong>، أو <strong>كود تلجرام فقط</strong>، أو الروابط المباشرة. لا يوجد أي إلزام بدمج الأكواد معاً!
                  </p>
                </div>
              </div>

              {/* Sub-tab Selection Buttons */}
              <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
                <button
                  onClick={() => setActiveCodeSubTab('call')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'call'
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>1. كود مكالمات أبوسليم الصوتية (مستقل)</span>
                </button>

                <button
                  onClick={() => setActiveCodeSubTab('whatsapp')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>2. كود واتساب زاد (مستقل)</span>
                </button>

                <button
                  onClick={() => setActiveCodeSubTab('telegram')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'telegram'
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <TelegramIcon className="w-3.5 h-3.5" />
                  <span>3. كود تلجرام العائم (مستقل)</span>
                </button>

                <button
                  onClick={() => setActiveCodeSubTab('direct_links')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'direct_links'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>4. الروابط المباشرة</span>
                </button>

                <button
                  onClick={() => setActiveCodeSubTab('html')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'html'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>5. أزرار HTML</span>
                </button>

                <button
                  onClick={() => setActiveCodeSubTab('all_in_one')}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeCodeSubTab === 'all_in_one'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-[11px]">اختياري: كود مدمج شامل</span>
                </button>
              </div>

              {/* Subtab 1: Standalone Abusalim Voice Call Code */}
              {activeCodeSubTab === 'call' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          كود مكالمات أبوسليم الصوتية المستقل (Web Call):
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          مستقل تماماً
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        يُنشئ زراً عائماً لمكالمات الإنترنت المجانية فقط لمتجرك وموقعك بدون أي ملحقات إضافية.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onTestCall('تجربة كود المكالمة المستقل')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>تجربة المكالمة</span>
                      </button>

                      <button
                        onClick={() => handleCopy(callJs, 'call_code')}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        {copiedKey === 'call_code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-300" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ كود مكالمة أبوسليم</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>انسخ هذا الكود والصقه في &lt;/body&gt; في منصة سلة، زد، ووردبريس أو موقعك:</span>
                      <span className="text-[11px] font-mono text-orange-400">كود جافاسكريبت فوري وخفيف جداً</span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-orange-300 overflow-x-auto max-h-56 select-all leading-relaxed" dir="ltr">
                      {callJs}
                    </pre>
                  </div>
                </div>
              )}

              {/* Subtab 2: Standalone WhatsApp / Zad WhatsApp */}
              {activeCodeSubTab === 'whatsapp' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          كود زر واتساب {config.isZadWhatsapp ? 'زاد' : ''} العائم المستقل:
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          مستقل تماماً
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        كود جافاسكريبت مستقل يضع أيقونة واتساب خضراء عائمة تفتح المحادثة الفورية مع: <strong className="text-emerald-400 font-mono" dir="ltr">{config.whatsappNumber}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={links.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1 text-decoration-none"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح الرابط للتجربة</span>
                      </a>

                      <button
                        onClick={() => handleCopy(whatsappJs, 'wa_code')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        {copiedKey === 'wa_code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ كود واتساب زاد</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>انسخ الكود المستقل لواتساب وضعه في متجرك (يعمل على الجوال وسطح المكتب):</span>
                      <span className="text-[11px] font-mono text-emerald-400">جاهز برقم هاتفك ورسالتك الترحيبية</span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto max-h-56 select-all leading-relaxed" dir="ltr">
                      {whatsappJs}
                    </pre>
                  </div>
                </div>
              )}

              {/* Subtab 3: Standalone Telegram Button */}
              {activeCodeSubTab === 'telegram' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          كود أيقونة تلجرام العائمة المستقل (Telegram Chat):
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                          مستقل تماماً
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        كود جافاسكريبت مستقل لأيقونة تيليجرام العائمة، تفتح الدردشة المباشرة مع: <strong className="text-sky-400 font-mono" dir="ltr">@{config.telegramUsername}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={links.telegramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold cursor-pointer border border-slate-700 flex items-center gap-1 text-decoration-none"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>فتح الرابط للتجربة</span>
                      </a>

                      <button
                        onClick={() => handleCopy(telegramJs, 'tg_code')}
                        className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                      >
                        {copiedKey === 'tg_code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ كود تلجرام</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>انسخ كود زر تلجرام المستقل وضعه في متجرك أو موقعك:</span>
                      <span className="text-[11px] font-mono text-sky-400">أيقونة تلجرام عائمة وأنيقة</span>
                    </div>
                    <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-sky-400 overflow-x-auto max-h-56 select-all leading-relaxed" dir="ltr">
                      {telegramJs}
                    </pre>
                  </div>
                </div>
              )}

              {/* Subtab 4: Direct Links */}
              {activeCodeSubTab === 'direct_links' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-xs text-slate-300">
                    إذا كنت لا ترغب بإضافة أي كود برمجي، يمكنك استخدام هذه الروابط المباشرة في بايو إنستغرام، تيك توك، رسائل البريد، أو في أزرار مخصصة:
                  </p>

                  {/* Call Link */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                        <span className="text-xs text-orange-400 font-bold">رابط مكالمات أبوسليم المباشر:</span>
                      </div>
                      <span className="text-xs font-mono text-slate-200 truncate block" dir="ltr">{links.callUrl}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(links.callUrl, 'link_call')}
                      className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      {copiedKey === 'link_call' ? 'تم النسخ!' : 'نسخ الرابط'}
                    </button>
                  </div>

                  {/* WhatsApp Link */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-xs text-emerald-400 font-bold">رابط واتساب زاد المباشر:</span>
                      </div>
                      <span className="text-xs font-mono text-slate-200 truncate block" dir="ltr">{links.whatsappUrl}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(links.whatsappUrl, 'link_wa')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      {copiedKey === 'link_wa' ? 'تم النسخ!' : 'نسخ الرابط'}
                    </button>
                  </div>

                  {/* Telegram Link */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span className="text-xs text-sky-400 font-bold">رابط محادثة تلجرام المباشر:</span>
                      </div>
                      <span className="text-xs font-mono text-slate-200 truncate block" dir="ltr">{links.telegramUrl}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(links.telegramUrl, 'link_tg')}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      {copiedKey === 'link_tg' ? 'تم النسخ!' : 'نسخ الرابط'}
                    </button>
                  </div>
                </div>
              )}

              {/* Subtab 5: HTML Buttons */}
              {activeCodeSubTab === 'html' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        كود أزرار HTML مدمجة (لإدراجها في المقالات وصفحات المتجر):
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        أزرار منسقة جاهزة بدون أي مكتبات جافاسكريبت إضافية
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopy(htmlButtons, 'html_btn')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                    >
                      {copiedKey === 'html_btn' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ أزرار HTML</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-amber-300 overflow-x-auto max-h-56 select-all leading-relaxed" dir="ltr">
                    {htmlButtons}
                  </pre>
                </div>
              )}

              {/* Subtab 6: Optional All-in-one script */}
              {activeCodeSubTab === 'all_in_one' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300">
                    <strong>خيار اختياري:</strong> هذا الكود مخصص لمن يرغب بدمج القنوات الثلاث في زر عائم واحد بقائمة منبثقة. إذا أردت استقلالية تامة، اختر التبويبات الفردية أعلاه.
                  </div>

                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      الكود المدمج متعدد القنوات:
                    </h4>

                    <button
                      onClick={() => handleCopy(universalJs, 'multi_js')}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
                    >
                      {copiedKey === 'multi_js' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم النسخ!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الكود المدمج</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-purple-300 overflow-x-auto max-h-56 select-all leading-relaxed" dir="ltr">
                    {universalJs}
                  </pre>
                </div>
              )}

            </div>
          )}


          {/* ================= TAB 4: PLATFORM INSTALLATION GUIDE ================= */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Salla Guide */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold flex items-center justify-center text-xs">
                      1
                    </span>
                    <h4 className="text-sm font-bold text-white">خطوات التثبيت في متجر سلة (Salla):</h4>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>ادخل على لوحة تحكم متجرك في <strong>سلة</strong>.</li>
                    <li>توجه إلى: <strong>إعدادات المتجر</strong> ← <strong>الرموز المخصصة (Custom Scripts)</strong>.</li>
                    <li>انسخ <strong>الكود الذي اخترته لمتجرك</strong> (مكالمة أبوسليم، أو واتساب زاد، أو تلجرام) من التبويب السابق.</li>
                    <li>الصقه في خانة <strong>كود قبل نهاية الجسم (Before &lt;/body&gt;)</strong> ثم اضغط <strong>حفظ</strong>.</li>
                    <li className="text-emerald-400 font-semibold">سيظهر الزر العائم فوراً لجميع عملائك!</li>
                  </ol>
                </div>

                {/* Zid Guide */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 font-bold flex items-center justify-center text-xs">
                      2
                    </span>
                    <h4 className="text-sm font-bold text-white">خطوات التثبيت في متجر زد (Zid):</h4>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>ادخل على لوحة تحكم <strong>زد</strong>.</li>
                    <li>اذهب إلى: <strong>تصميم المتجر</strong> ← <strong>الرموز التتبعية أو الأكواد الإضافية</strong>.</li>
                    <li>اختر إضافة كود مخصص (Body Script).</li>
                    <li>الصق كود أبوسليم واضغط <strong>تفعيل</strong>.</li>
                    <li className="text-orange-400 font-semibold">يعمل متوافقاً مع الهواتف الذكية وأجهزة الحاسوب.</li>
                  </ol>
                </div>

                {/* WordPress Guide */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 font-bold flex items-center justify-center text-xs">
                      3
                    </span>
                    <h4 className="text-sm font-bold text-white">خطوات ووردبريس (WordPress / WooCommerce):</h4>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>استخدم أي إضافة لإدراج الأكواد مثل (WPCode أو Header and Footer Scripts).</li>
                    <li>أضف Snippet جديد من نوع <strong>Footer Script</strong>.</li>
                    <li>الصق الكود كاملاً وفعّل الحالة إلى <strong>Active</strong> ثم حفظ.</li>
                  </ol>
                </div>

                {/* Shopify & Custom HTML Guide */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-400 font-bold flex items-center justify-center text-xs">
                      4
                    </span>
                    <h4 className="text-sm font-bold text-white">شوبيفاي (Shopify) ومواقع HTML البرمجية:</h4>
                  </div>
                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>في شوبيفاي: <strong>Online Store</strong> ← <strong>Themes</strong> ← <strong>Edit Code</strong>.</li>
                    <li>افتح ملف <strong>theme.liquid</strong>.</li>
                    <li>ابحث عن وسام <code className="text-amber-400 font-mono text-[11px]">&lt;/body&gt;</code> في نهاية الملف.</li>
                    <li>الصق الكود قبله مباشرة واحفظ التعديل.</li>
                  </ol>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Bottom Banner */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              جميع خدمات التواصل (المكالمات، واتساب زاد، وتلجرام) مجانية بالكامل 100% ولا تتطلب أي بطاقة ائتمان.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!currentUser && (
              <button
                onClick={onOpenGoogleAuth}
                className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>حفظ في حساب Google</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('codes')}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              نسخ الكود الآن
            </button>
          </div>
        </div>
          </>
        )}

      </div>
    </div>
  );
};
