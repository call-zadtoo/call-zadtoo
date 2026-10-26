import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  ArrowLeft, 
  Check, 
  QrCode, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Zap, 
  Bot, 
  Users, 
  Radio, 
  Monitor, 
  Smartphone, 
  FileSpreadsheet,
  Headphones,
  CheckCircle2,
  Share2,
  ChevronDown,
  Gift,
  CreditCard
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { AbusalimLogo } from './components/AbusalimLogo';
import { CallModal } from './components/CallModal';
import { AgentDashboard } from './components/AgentDashboard';
import { QrCodeModal } from './components/QrCodeModal';
import { HotlinkBuilderModal } from './components/HotlinkBuilderModal';
import { InteractiveCallDemo } from './components/InteractiveCallDemo';
import { FloatingCallWidget } from './components/FloatingCallWidget';
import { GoogleAuthModal, GoogleUser } from './components/GoogleAuthModal';
import { CallLog } from './types/call';
import { auth, onAuthStateChanged } from './lib/firebase';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'agent_dashboard'>('landing');
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callSource, setCallSource] = useState('رابط الموقع (المتصفح)');
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [activeWayTab, setActiveWayTab] = useState<'qr' | 'button' | 'page' | 'embed'>('qr');

  // Google User Authentication State
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('abusalim_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSignIn = (user: GoogleUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('abusalim_user', JSON.stringify(user));
    } catch {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('abusalim_user');
    } catch {}
  };

  // Sync with live Firebase Google Authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const userObj: GoogleUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مستخدم Google',
          email: fbUser.email || 'zadtoo.com@gmail.com',
          avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          plan: 'free_unlimited',
          isFirebaseLive: true,
        };
        setCurrentUser(userObj);
        try {
          localStorage.setItem('abusalim_user', JSON.stringify(userObj));
        } catch {}
      }
    });
    return () => unsubscribe();
  }, []);

  // Stored Call Logs for the team dashboard
  const [callLogs, setCallLogs] = useState<CallLog[]>([
    {
      id: 'call_101',
      callerName: 'عميل من متجر الرياض',
      callerSource: 'رمز QR على الفاتورة',
      startTime: '10:15 ص',
      durationSeconds: 94,
      status: 'completed',
      agentName: 'أحمد التميمي',
      department: 'المبيعات والدعم',
      interactiveResponses: [
        { question: 'هل تريد تفعيل خط المكالمات لمتجر أم لشركة؟', answer: 'متجر إلكتروني 🛍️' },
        { question: 'بيانات التواصل', answer: '0551234567' },
      ],
      notes: 'تم تفعيل الخط المجاني بنجاح',
    },
    {
      id: 'call_102',
      callerName: 'زائر من إعلان إنستغرام',
      callerSource: 'إعلان إنستغرام (حملة الخريف)',
      startTime: '09:40 ص',
      durationSeconds: 45,
      status: 'completed',
      agentName: 'سارة خالد',
      department: 'المبيعات',
      interactiveResponses: [
        { question: 'طرح الأسئلة وطلبات التأكيد', answer: 'نعم بالتأكيد' },
      ],
      notes: 'استفسار عن إمكانية الربط مع متجر سلة وزد بدون أي تكلفة',
    },
    {
      id: 'call_103',
      callerName: 'عميل من صفحة الدفع',
      callerSource: 'زر عائم في سلة المشتريات',
      startTime: '08:22 ص',
      durationSeconds: 120,
      status: 'completed',
      agentName: 'وكيل أبوسليم الذكي AI',
      department: 'الدعم الفني السريع',
      interactiveResponses: [
        { question: 'خيارات يختار منها العميل', answer: 'استفسار عن الشحن السريع' },
      ],
      notes: 'تمت إجابة العميل آلياً وأكمل طلبه',
    },
  ]);

  // Listen for custom trigger to start call with specific source
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ source?: string }>;
      setCallSource(customEvent.detail?.source || 'رابط الموقع المباشر');
      setIsCallOpen(true);
    };
    window.addEventListener('open-hotliney-call', handler);
    return () => window.removeEventListener('open-hotliney-call', handler);
  }, []);

  const handleStartCall = (sourceLabel = 'زر جرّب مكالمة مباشرة') => {
    setCallSource(sourceLabel);
    setIsCallOpen(true);
  };

  const handleCallFinished = (newLog: CallLog) => {
    setCallLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200" dir="rtl">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSwitchView={setCurrentView}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        onTestCall={() => handleStartCall('زر النافبار')}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
      />

      {/* Main Container View Switcher */}
      {currentView === 'agent_dashboard' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <AgentDashboard
            logs={callLogs}
            onStartSimulationCall={(src) => handleStartCall(src)}
            onClearLogs={() => setCallLogs([])}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col">
          
          {/* ================= HERO SECTION ================= */}
          <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
            {/* Background ambient lighting */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/10 blur-[130px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* User Logged in Welcome Banner */}
              {currentUser && (
                <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs animate-slide-down">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-emerald-400 object-cover" />
                    <div>
                      <span className="font-bold text-white block">مرحباً بك، {currentUser.name}!</span>
                      <span className="text-emerald-400 text-[11px]">حسابك مسجل عبر Google • الخدمة مجانية 100% بالكامل</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    + إنشاء رابط مكالمات جديد
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Right Side / Text Column in RTL */}
                <div className="lg:col-span-7 space-y-6 text-right">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-emerald-400 font-bold">خدمة مجانية 100%</span>
                    <span className="text-slate-500">•</span>
                    <span>منصة مكالمات واردة تبدأ من رابط</span>
                  </div>

                  {/* Main Headline for أبوسليم | ABUSALIM */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25]">
                    استقبال مكالمات عملائك <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-l from-orange-400 via-orange-500 to-amber-400">أصبح مجانيًا مع أبوسليم!</span>
                  </h1>

                  {/* Subtitle description */}
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                    شارك رابطًا واحدًا عبر منصة <strong className="text-orange-400">أبوسليم (ABUSALIM)</strong>. العميل يضغط ويتحدث مع فريقك أو مع وكيل ذكي مباشرة من المتصفح، مع حفظ سجل المكالمة ومصدر الحملة مجاناً بالكامل.
                  </p>

                  {/* Primary & Secondary Call to Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                    {/* Orange Free Button */}
                    <button
                      onClick={() => setIsTrialModalOpen(true)}
                      className="px-6 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/25 transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>احصل على خطك مجاناً 100%</span>
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Secondary Button: جرب مكالمة مباشرة */}
                    <button
                      onClick={() => handleStartCall('زر الهيرو الرئيسي')}
                      className="px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      <PhoneCall className="w-5 h-5 text-orange-400" />
                      <span>جرّب مكالمة مباشرة</span>
                    </button>

                    {/* Google One-Click CTA */}
                    {!currentUser && (
                      <button
                        onClick={() => setIsGoogleAuthOpen(true)}
                        className="px-4 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-300"
                        title="تسجيل سريع عبر حساب Google"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>دخول عبر Google</span>
                      </button>
                    )}
                  </div>

                  {/* Free Policy Guarantee */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      الخدمة مجانية بالكامل للجميع
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>بدون بطاقة ائتمان</span>
                    <span className="text-slate-600">•</span>
                    <span>بدون تثبيت أي تطبيق</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">إمكانية تفعيل باقات مدفوعة وميزات إضافية لاحقاً</span>
                  </div>

                  {/* Value Bullet Points */}
                  <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">✓</span>
                      <span>مجاني 100% بدون اشتراكات</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">✓</span>
                      <span>فريقك يرد من المتصفح</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">✓</span>
                      <span>تسجيل دخول فوري عبر Google</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 font-medium">
                      <span className="w-5 h-5 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/20">✓</span>
                      <span>سجل مكالمات وتتبع المصادر</span>
                    </div>
                  </div>
                </div>

                {/* Left Side / Visual Showcase Column in RTL */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-md">
                    {/* Glowing circular waves behind the asset */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-orange-600/20 to-amber-500/10 blur-2xl pointer-events-none"></div>

                    {/* Active In-Browser Calling Card */}
                    <div className="relative rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl p-6 space-y-6">
                      
                      {/* Top mini toolbar */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="text-xs font-mono text-slate-400" dir="ltr">call.zadtoo.com/sales</span>
                      </div>

                      {/* Central Animated Audio Waves */}
                      <div className="flex flex-col items-center justify-center py-4 space-y-4 text-center">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 p-1 shadow-lg shadow-orange-500/30 animate-pulse">
                            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                              <Radio className="w-10 h-10 text-orange-400" />
                            </div>
                          </div>
                          {/* Pulsing rings */}
                          <div className="absolute -inset-3 rounded-full border border-orange-500/30 animate-ping"></div>
                        </div>

                        <div>
                          <div className="text-lg font-bold text-white">مكالمة واردة عبر أبوسليم</div>
                          <div className="text-xs text-emerald-400 font-semibold mt-0.5">● متصل الآن (صوت فائق الوضوح - مجاناً)</div>
                        </div>

                        {/* Animated live waveform visual */}
                        <div className="flex items-center justify-center gap-1.5 h-10 w-full max-w-[200px]">
                          {[40, 75, 55, 90, 60, 85, 45, 95, 65, 80, 50, 70, 40].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-1.5 bg-gradient-to-t from-orange-600 to-amber-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Interactive prompt sample */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-orange-500/30 text-right space-y-2">
                        <span className="text-[11px] font-bold text-orange-400 block">
                          تفاعل حي أثناء المكالمة:
                        </span>
                        <p className="text-xs text-slate-200">
                          اختر نوع نشاطك لتفعيل الخط المجاني فوراً:
                        </p>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => handleStartCall('زر العرض التوضيحي')}
                            className="py-1.5 px-2.5 rounded-xl bg-orange-600/30 border border-orange-500/50 text-orange-300 text-xs font-semibold hover:bg-orange-600 hover:text-white transition-all cursor-pointer"
                          >
                            متجر تجارة إلكترونية
                          </button>
                          <button
                            onClick={() => handleStartCall('زر العرض التوضيحي')}
                            className="py-1.5 px-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            شركة وخدمات أعمال
                          </button>
                        </div>
                      </div>

                      {/* Direct action button */}
                      <button
                        onClick={() => handleStartCall('كارت المعاينة بالهيرو')}
                        className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>اضغط لتجربة التحدث الآن</span>
                      </button>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>


          {/* ================= SECTION: 4 WAYS TO REACH CUSTOMERS ================= */}
          <section className="py-16 lg:py-24 bg-slate-900/40 border-b border-slate-800/80" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              
              {/* Header */}
              <div className="max-w-3xl space-y-4">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                  أربع طرق تخلي المكالمة <br />
                  <span className="text-orange-500">قدام عميلك مباشرة مع أبوسليم.</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  رابط مكالمة واحد من <strong className="text-orange-400">أبوسليم ABUSALIM</strong> وأربع طرق مجانية للوصول له: داخل صفحتك، أو صفحة مستقلة، أو زر في موقعك، أو رمز QR على أي مطبوعة. كلهم يوصلوا لنفس قائمة الانتظار بدون أي تكاليف.
                </p>
              </div>

              {/* 4 Methods Tabs / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* 01: زر في موقعك */}
                <div 
                  onClick={() => setActiveWayTab('button')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    activeWayTab === 'button'
                      ? 'bg-slate-900 border-orange-500 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-orange-400 font-mono text-sm font-bold">01</span>
                    <h3 className="text-base font-bold text-white">زر في موقعك</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      ويدجت عائم أو زر مخصص يتم تثبيته بسطر كود واحد في أي منصة (سلة، زد، ووردبريس، شوبيفاي).
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCall('تجربة زر الموقع');
                    }}
                    className="text-xs text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>جرّب الزر الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 02: صفحة مستقلة */}
                <div 
                  onClick={() => setActiveWayTab('page')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    activeWayTab === 'page'
                      ? 'bg-slate-900 border-orange-500 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-orange-400 font-mono text-sm font-bold">02</span>
                    <h3 className="text-base font-bold text-white">صفحة مستقلة</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      رابط مباشر بهويتك وشعارك وأقسامك، يشارك في البايو أو رسائل الواتساب أو توقيع البريد.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTrialModalOpen(true);
                    }}
                    className="text-xs text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>أنشئ صفحتك</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 03: داخل صفحتك (Embed) */}
                <div 
                  onClick={() => setActiveWayTab('embed')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    activeWayTab === 'embed'
                      ? 'bg-slate-900 border-orange-500 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-orange-400 font-mono text-sm font-bold">03</span>
                    <h3 className="text-base font-bold text-white">داخل صفحتك</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      تضمين مباشر في صفحة اتصل بنا أو صفحة إتمام الطلب ليظل العميل في موقعك دون مغادرة.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartCall('تجربة التضمين الداخلي');
                    }}
                    className="text-xs text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>معاينة التضمين</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 04: رمز QR */}
                <div 
                  onClick={() => setActiveWayTab('qr')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    activeWayTab === 'qr'
                      ? 'bg-gradient-to-b from-orange-950/40 to-slate-900 border-orange-500 shadow-xl'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-400 font-mono text-sm font-bold">04</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">مجاني للطباعة</span>
                    </div>
                    <h3 className="text-base font-bold text-white">رمز QR</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      اطبعه على العبوات أو الفواتير أو الإيصالات أو واجهة المتجر، فتفتح كاميرا العميل نفس الرابط.
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsQrModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                  >
                    <QrCode className="w-3.5 h-3.5 text-orange-600" />
                    <span>تنزيل رمز QR مجاناً</span>
                  </button>
                </div>

              </div>

              {/* Active Tab Detailed View */}
              {activeWayTab === 'qr' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-slide-up">
                  <div className="space-y-3 max-w-xl text-right">
                    <div className="flex items-center gap-2 text-orange-400 text-xs font-bold">
                      <QrCode className="w-4 h-4" />
                      <span>04 رمز QR الفوري للمكالمات (أبوسليم ABUSALIM)</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">
                      اطبعه على العبوات أو الفواتير أو الإيصالات أو واجهة المتجر، فتفتح كاميرا العميل نفس الرابط.
                    </h3>
                    <p className="text-xs text-orange-400 font-semibold">
                      امسح الرمز ← يفتح الرابط ← تبدأ المكالمة من المتصفح
                    </p>
                    <p className="text-xs text-slate-400">
                      نفس قائمة الانتظار • نفس التوجيه • نفس سجل المكالمة • مجاني 100%
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                    >
                      <QrCode className="w-4 h-4 text-orange-600" />
                      <span>تنزيل رمز QR</span>
                    </button>
                    <button
                      onClick={() => handleStartCall('مسح رمز QR تجريبي')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>تجربة الاتصال عبر الرابط</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </section>


          {/* ================= SECTION: INTERACTIVE CALLS ================= */}
          <InteractiveCallDemo onLaunchCall={() => handleStartCall('من قسم المكالمات التفاعلية')} />


          {/* ================= SECTION: START IN 3 STEPS ================= */}
          <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 border-t border-slate-800/80" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
              
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  ابدأ في ثلاث خطوات مجاناً
                </h2>
                <p className="text-sm sm:text-base text-slate-400">
                  من غير مشروع اتصالات، ولا شراء أرقام، ولا تطبيق للعميل، وبدون أي تكاليف مادية حالياً.
                </p>
              </div>

              {/* 3 Step Timeline Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                
                {/* Step 1 */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-xl flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    أنشئ رابط أبوسليم الخاص بك
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    سمّه، وأضف هويتك، واختر من يرد: فريقك، أو وكيل ذكي، أو الذكاء الاصطناعي أولاً مع تحويل إلى موظف.
                  </p>
                  <button
                    onClick={() => setIsTrialModalOpen(true)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>أنشئ رابطك الآن مجاناً</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 2 */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-xl flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    انشره حيث يوجد عملاؤك
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    زر في موقعك، أو إعلان حملة، أو توقيع بريد، أو رمز QR، أو صفحة طلب — وكل موضع يحتفظ بمصدره.
                  </p>
                  <button
                    onClick={() => setIsQrModalOpen(true)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>استخراج رمز QR وروابط النشر</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Step 3 */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-black text-xl flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    ردّ واعرف ما الذي حدث
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    يرد فريقك من لوحة المتصفح، وتظهر كل مكالمة في السجل ببياناتها وملاحظاتها ومصدر حملتها.
                  </p>
                  <button
                    onClick={() => setCurrentView('agent_dashboard')}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>معاينة لوحة تحكم الفريق</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

            </div>
          </section>


          {/* ================= FINAL CTA SECTION ================= */}
          <section className="py-16 bg-slate-900/40 border-t border-slate-800/80" dir="rtl">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>أبوسليم | ABUSALIM - منصة اتصال ذكية ومجانية</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                جاهز تحول خط خدمة عملائك إلى رابط؟
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                سجّل دخولك الآن عبر Google أو أنشئ خطك المجاني في ثوانٍ، وابدأ باستقبال مكالمات عملائك مباشرة من المتصفح بدون أي رسوم.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setIsTrialModalOpen(true)}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>ابدأ مجاناً 100% الآن</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsGoogleAuthOpen(true)}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base border border-slate-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>التسجيل بحساب Google</span>
                </button>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-slate-400 text-xs" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <AbusalimLogo size="sm" />
          <p>© 2026 أبوسليم | ABUSALIM • منصة مكالمات واردة مجانية تبدأ من رابط. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('landing')} className="hover:text-white cursor-pointer">الرئيسية</button>
            <button onClick={() => setCurrentView('agent_dashboard')} className="hover:text-white cursor-pointer">لوحة الفريق</button>
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-white cursor-pointer">رمز QR</button>
            <button onClick={() => setIsGoogleAuthOpen(true)} className="hover:text-white cursor-pointer">حساب Google</button>
          </div>
        </div>
      </footer>

      {/* Floating Call Widget ("اتصل بـ أبوسليم") */}
      <FloatingCallWidget onCall={() => handleStartCall('الزر العائم (اتصل بـ أبوسليم)')} />

      {/* Live Calling Modal (Real WebRTC audio calling service) */}
      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        department="خدمة العملاء والاستشارات"
        source={callSource}
        onCallCompleted={handleCallFinished}
      />

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        onTestCall={() => handleStartCall('مسح رمز QR الفعلي')}
      />

      {/* 100% Free Hotlink Builder Modal */}
      <HotlinkBuilderModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        onGoogleSignIn={() => setIsGoogleAuthOpen(true)}
        isLoggedIn={!!currentUser}
        onSuccess={(url) => {
          // Link created
        }}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

    </div>
  );
}
