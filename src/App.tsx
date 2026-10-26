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
  CreditCard,
  Code
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
import { EmbedStudioModal } from './components/EmbedStudioModal';
import { SubscriberDashboard } from './components/SubscriberDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminLoginPanel } from './components/AdminLoginPanel';
import { DirectStoreCallView } from './components/DirectStoreCallView';
import { getStoreSlugFromUrl } from './utils/urlRouter';
import { CallLog } from './types/call';
import { 
  UserRole, 
  ROLES_DEFINITION, 
  SubscriberMember, 
  SubscriberStatus, 
  SystemSettings, 
  AdminAuditLog 
} from './types/roles';
import { auth, onAuthStateChanged } from './lib/firebase';

const INITIAL_MEMBERS: SubscriberMember[] = [
  {
    id: 'mem_1',
    name: 'عبدالرحمن السالم',
    email: 'zadtoo.com@gmail.com',
    storeName: 'متجر الرياض الحديث',
    storeSlug: 'al-riyadh-store',
    phone: '0551234567',
    status: 'active',
    registeredAt: '2026-03-10',
    totalCallsReceived: 42,
    callMinutesAllowed: 9999,
    whatsappNumber: '966551234567',
    telegramUser: 'riyadh_store',
  },
  {
    id: 'mem_2',
    name: 'نورة المنصور',
    email: 'noura@alanaqa.sa',
    storeName: 'متجر الأناقة للعطور',
    storeSlug: 'al-anaqa',
    phone: '0509876543',
    status: 'active',
    registeredAt: '2026-03-14',
    totalCallsReceived: 28,
    callMinutesAllowed: 1500,
    whatsappNumber: '966509876543',
    telegramUser: 'alanaqa_perfume',
  },
  {
    id: 'mem_3',
    name: 'خالد السبيعي',
    email: 'khaled@alofouq.com',
    storeName: 'مؤسسة الأفق للتقنية',
    storeSlug: 'al-ofouq',
    phone: '0562345678',
    status: 'suspended',
    statusReason: 'تجاوز الاستخدام العادل والمراجعة الدورية من المشرف',
    registeredAt: '2026-02-28',
    totalCallsReceived: 65,
    callMinutesAllowed: 500,
    whatsappNumber: '966562345678',
    telegramUser: 'ofouq_tech',
  },
  {
    id: 'mem_4',
    name: 'ماجد العوفي',
    email: 'majed@discountmarket.com',
    storeName: 'سوق التخفيضات السريعة',
    storeSlug: 'discount-market',
    phone: '0547654321',
    status: 'blocked',
    statusReason: 'مخالفة سياسة المحتوى واستقبال اتصالات مزعجة',
    registeredAt: '2026-01-20',
    totalCallsReceived: 94,
    callMinutesAllowed: 0,
    whatsappNumber: '966547654321',
    telegramUser: 'discount_market',
  },
  {
    id: 'mem_5',
    name: 'د. يوسف الحربي',
    email: 'pharmacy@directpharma.com',
    storeName: 'صيدلية الدواء المباشر',
    storeSlug: 'direct-pharma',
    phone: '0531122334',
    status: 'active',
    registeredAt: '2026-03-01',
    totalCallsReceived: 51,
    callMinutesAllowed: 3000,
    whatsappNumber: '966531122334',
    telegramUser: 'direct_pharma',
  },
];

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('abusalim_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('abusalim_active_role');
      const isAuthed = localStorage.getItem('abusalim_admin_auth') === 'true';
      const hasUser = !!localStorage.getItem('abusalim_user');
      if (saved === 'admin' && isAuthed) {
        return 'admin';
      }
      if (saved === 'subscriber' && hasUser) {
        return 'subscriber';
      }
    } catch {}
    return 'guest';
  });

  const [isCallOpen, setIsCallOpen] = useState(false);
  const [callSource, setCallSource] = useState('رابط الموقع (المتصفح)');
  const [callDepartment, setCallDepartment] = useState('الدعم والمبيعات');
  const [activeStoreSlug, setActiveStoreSlug] = useState<string | null>(() => getStoreSlugFromUrl());
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [activeWayTab, setActiveWayTab] = useState<'qr' | 'button' | 'page' | 'embed'>('qr');

  // Members state
  const [members, setMembers] = useState<SubscriberMember[]>(() => {
    try {
      const saved = localStorage.getItem('abusalim_subscribers_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MEMBERS;
  });

  // Save members
  const persistMembers = (newList: SubscriberMember[]) => {
    setMembers(newList);
    try {
      localStorage.setItem('abusalim_subscribers_list', JSON.stringify(newList));
    } catch {}
  };

  // System settings state
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('abusalim_system_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isMaintenanceMode: false,
      announcementBanner: '',
      maxCallDurationMinutes: 15,
      allowGuestCalls: true,
      requireEmailVerification: false,
    };
  });

  const handleUpdateSystemSettings = (updates: Partial<SystemSettings>) => {
    setSystemSettings(prev => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('abusalim_system_settings', JSON.stringify(next));
      } catch {}
      return next;
    });
    addAuditLog('تحديث إعدادات النظام', 'لوحة التحكم', JSON.stringify(updates));
  };

  // Admin audit logs state
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('abusalim_audit_logs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'audit_1',
        action: 'تفعيل حساب مشترك',
        target: 'متجر الرياض الحديث',
        timestamp: '10:00 ص',
        adminEmail: 'thrayanabil2026@gmail.com',
        details: 'منح اشتراك غير محدود',
      },
      {
        id: 'audit_2',
        action: 'تعليق حساب مؤقتاً',
        target: 'مؤسسة الأفق للتقنية',
        timestamp: '09:15 ص',
        adminEmail: 'thrayanabil2026@gmail.com',
        details: 'تجاوز الاستخدام العادل',
      },
    ];
  });

  const addAuditLog = (action: string, target: string, details?: string) => {
    const newLog: AdminAuditLog = {
      id: `audit_${Date.now()}`,
      action,
      target,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      adminEmail: 'thrayanabil2026@gmail.com',
      details,
    };
    setAuditLogs(prev => {
      const next = [newLog, ...prev];
      try {
        localStorage.setItem('abusalim_audit_logs', JSON.stringify(next.slice(0, 50)));
      } catch {}
      return next;
    });
  };

  // Member Status actions
  const handleUpdateMemberStatus = (memberId: string, status: SubscriberStatus, reason?: string) => {
    const updated = members.map(m => m.id === memberId ? { ...m, status, statusReason: reason } : m);
    persistMembers(updated);
    const memberName = members.find(m => m.id === memberId)?.storeName || memberId;
    const actionLabel = status === 'active' ? 'تفعيل العضو' : status === 'suspended' ? 'تعليق العضو' : 'حجب العضو';
    addAuditLog(actionLabel, memberName, reason || `تغيير الحالة إلى ${status}`);
  };

  const handleUpdateMemberQuota = (memberId: string, minutes: number) => {
    const updated = members.map(m => m.id === memberId ? { ...m, callMinutesAllowed: minutes } : m);
    persistMembers(updated);
    const memberName = members.find(m => m.id === memberId)?.storeName || memberId;
    addAuditLog('تعديل حصة المكالمات', memberName, `${minutes} دقيقة`);
  };

  const handleDeleteMember = (memberId: string) => {
    const memberName = members.find(m => m.id === memberId)?.storeName || memberId;
    const updated = members.filter(m => m.id !== memberId);
    persistMembers(updated);
    addAuditLog('حذف مشترك نهائياً', memberName);
  };

  const handleAddMember = (newMem: Omit<SubscriberMember, 'id' | 'registeredAt' | 'totalCallsReceived'>) => {
    const created: SubscriberMember = {
      ...newMem,
      id: `mem_${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
      totalCallsReceived: 0,
    };
    const updated = [created, ...members];
    persistMembers(updated);
    addAuditLog('إضافة مشترك جديد', created.storeName, `بواسطة المشرف (${created.email})`);
  };

  // Google User Authentication State
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem('abusalim_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSelectRole = (role: UserRole) => {
    if (role === 'subscriber' && !currentUser) {
      setIsGoogleAuthOpen(true);
      return;
    }
    if (role === 'admin' && !isAdminAuthenticated) {
      setIsAdminAuthModalOpen(true);
      return;
    }
    setCurrentRole(role);
    try {
      localStorage.setItem('abusalim_active_role', role);
    } catch {}
  };

  const handleAdminAuthSuccess = () => {
    setIsAdminAuthenticated(true);
    setIsAdminAuthModalOpen(false);
    setCurrentRole('admin');
    try {
      localStorage.setItem('abusalim_admin_auth', 'true');
      localStorage.setItem('abusalim_active_role', 'admin');
    } catch {}
    addAuditLog('تسجيل دخول ناجح للمشرف', 'لوحة التحكم', 'جلسة إشرافية موثقة');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    const nextRole: UserRole = currentUser ? 'subscriber' : 'guest';
    try {
      localStorage.removeItem('abusalim_admin_auth');
      localStorage.setItem('abusalim_active_role', nextRole);
    } catch {}
    setCurrentRole(nextRole);
    addAuditLog('تسجيل خروج المشرف', 'لوحة التحكم');
  };

  const handleSignIn = (user: GoogleUser) => {
    setCurrentUser(user);
    setCurrentRole('subscriber');
    try {
      localStorage.setItem('abusalim_user', JSON.stringify(user));
      localStorage.setItem('abusalim_active_role', 'subscriber');
    } catch {}
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    try {
      localStorage.removeItem('abusalim_user');
      localStorage.setItem('abusalim_active_role', 'guest');
    } catch {}
  };

  const handleOpenStudio = () => {
    if (!currentUser) {
      setIsGoogleAuthOpen(true);
    } else {
      setIsStudioOpen(true);
    }
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

  // Active store matched from URL handle (e.g. /@al-riyadh-store)
  const activeStoreMember: SubscriberMember | null = React.useMemo(() => {
    if (!activeStoreSlug) return null;
    const found = members.find(m => m.storeSlug.toLowerCase() === activeStoreSlug.toLowerCase());
    if (found) return found;

    // Friendly dynamic store if not found in pre-seeded list
    const formattedName = activeStoreSlug === 'al-riyadh-store'
      ? 'متجر الرياض الحديث'
      : `متجر ${activeStoreSlug.replace(/[-_]/g, ' ')}`;

    return {
      id: `mem_dynamic_${activeStoreSlug}`,
      name: formattedName,
      email: `contact@${activeStoreSlug}.com`,
      storeName: formattedName,
      storeSlug: activeStoreSlug,
      phone: '0551234567',
      status: 'active',
      registeredAt: '2026-03-01',
      totalCallsReceived: 18,
      callMinutesAllowed: 2000,
      whatsappNumber: '966551234567',
      telegramUser: activeStoreSlug,
    };
  }, [activeStoreSlug, members]);

  // Sync URL changes (back/forward navigation, hashchange, pushstate)
  useEffect(() => {
    const handleUrlChange = () => {
      const slug = getStoreSlugFromUrl();
      setActiveStoreSlug(slug);
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleGoHome = () => {
    setActiveStoreSlug(null);
    try {
      window.history.pushState({}, '', '/');
    } catch {}
  };

  const handleSelectStoreSlug = (slug: string) => {
    setActiveStoreSlug(slug);
    try {
      window.history.pushState({}, '', `/@${slug}`);
    } catch {}
  };

  // Listen for custom trigger to start call with specific source
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ source?: string; department?: string }>;
      setCallSource(customEvent.detail?.source || 'رابط الموقع المباشر');
      if (customEvent.detail?.department) {
        setCallDepartment(customEvent.detail.department);
      }
      setIsCallOpen(true);
    };
    window.addEventListener('open-hotliney-call', handler);
    return () => window.removeEventListener('open-hotliney-call', handler);
  }, []);

  const handleStartCall = (sourceLabel = 'زر جرّب مكالمة مباشرة', departmentName = 'خدمة العملاء والاستشارات') => {
    setCallSource(sourceLabel);
    setCallDepartment(departmentName);
    setIsCallOpen(true);
  };

  const handleCallFinished = (newLog: CallLog) => {
    setCallLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden w-full" dir="rtl">
      
      {/* Maintenance Mode Banner if enabled */}
      {systemSettings.isMaintenanceMode && (
        <div className="bg-rose-950 text-rose-200 text-xs py-2.5 px-4 text-center font-bold border-b border-rose-800 flex items-center justify-center gap-2 animate-pulse" dir="rtl">
          <span>⚠️ تنبيه النظام: وضع الصيانة العامة مفعّل حالياً للمنصة بواسطة المشرف العام.</span>
        </div>
      )}

      {/* Emergency Announcement Banner if present */}
      {systemSettings.announcementBanner && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-white text-xs py-2 px-4 text-center font-bold shadow-md flex items-center justify-center gap-2" dir="rtl">
          <span>📢 {systemSettings.announcementBanner}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onOpenTrialModal={() => setIsTrialModalOpen(true)}
        onOpenStudio={handleOpenStudio}
        onTestCall={() => handleStartCall('زر النافبار')}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Container View Switcher based on 3 Roles */}
      {currentRole === 'admin' ? (
        isAdminAuthenticated ? (
          <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in pb-28 sm:pb-16">
            <AgentDashboard
              logs={callLogs}
              onStartSimulationCall={(src) => handleStartCall(src)}
              onClearLogs={() => setCallLogs([])}
              onDeleteLog={(id) => setCallLogs(prev => prev.filter(l => l.id !== id))}
              onOpenStudio={() => setIsStudioOpen(true)}
              onSwitchRole={handleSelectRole}
              onAdminLogout={handleAdminLogout}
              members={members}
              onUpdateMemberStatus={handleUpdateMemberStatus}
              onUpdateMemberQuota={handleUpdateMemberQuota}
              onDeleteMember={handleDeleteMember}
              onAddMember={handleAddMember}
              systemSettings={systemSettings}
              onUpdateSystemSettings={handleUpdateSystemSettings}
              auditLogs={auditLogs}
            />
          </main>
        ) : (
          <main className="flex-1 max-w-xl w-full mx-auto px-3.5 sm:px-6 py-8 sm:py-16 animate-fade-in flex flex-col items-center justify-center pb-28 sm:pb-16">
            <AdminLoginPanel
              onSuccess={handleAdminAuthSuccess}
              onCancel={() => handleSelectRole('guest')}
              isModal={false}
            />
          </main>
        )
      ) : currentRole === 'subscriber' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in pb-28 sm:pb-16">
          <SubscriberDashboard
            currentUser={currentUser}
            onOpenStudio={() => setIsStudioOpen(true)}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            onStartCall={handleStartCall}
            onSwitchToAdmin={() => handleSelectRole('admin')}
            memberStatus={members.find(m => m.email === currentUser?.email)?.status || members[0]?.status || 'active'}
            statusReason={members.find(m => m.email === currentUser?.email)?.statusReason || members[0]?.statusReason}
            callMinutesAllowed={members.find(m => m.email === currentUser?.email)?.callMinutesAllowed || members[0]?.callMinutesAllowed || 1000}
          />
        </main>
      ) : activeStoreMember && currentRole === 'guest' ? (
        <main className="flex-1 flex flex-col pb-28 sm:pb-16 animate-fade-in">
          <DirectStoreCallView
            store={activeStoreMember}
            onStartCall={(src, storeName) => handleStartCall(src, storeName)}
            onGoHome={handleGoHome}
            onOpenQrModal={() => setIsQrModalOpen(true)}
          />
        </main>
      ) : (
        <main className="flex-1 flex flex-col pb-28 sm:pb-16">
          
          {/* ================= HERO SECTION (ABUSALIM CALL POSTER THEME) ================= */}
          <section className="relative overflow-hidden pt-6 pb-14 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24 border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#071324] to-slate-950">
            {/* Background ambient lighting in Cyan, Emerald, and Navy */}
            <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-600/12 blur-[140px] rounded-full pointer-events-none"></div>
            <div className="absolute top-1/3 right-10 w-[450px] h-[300px] bg-emerald-600/10 blur-[130px] rounded-full pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              
              {/* User Logged in Welcome Banner */}
              {currentUser && (
                <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex items-center justify-between text-xs animate-slide-down">
                  <div className="flex items-center gap-3">
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full border border-emerald-400 object-cover" />
                    <div>
                      <span className="font-bold text-white block">مرحباً بك، {currentUser.name}!</span>
                      <span className="text-emerald-400 text-[11px]">حسابك مسجل بنجاح • متاح لك الذكاء الاصطناعي والمكالمات مجاناً 100%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsStudioOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs cursor-pointer border border-cyan-500/30"
                    >
                      ⚡ كود وودجت التواصل
                    </button>
                    <button
                      onClick={() => setIsTrialModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs cursor-pointer shadow-md"
                    >
                      + إنشاء رابط مكالمات جديد
                    </button>
                  </div>
                </div>
              )}

              {/* Direct Calling Handle Demo Bar */}
              <div className="mb-6 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-slate-300 font-bold">تجربة روابط الاتصال الصوتي المباشر للمتاجر:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSelectStoreSlug('al-riyadh-store')}
                    className="px-2.5 py-1 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span>/@al-riyadh-store</span>
                    <span className="text-[10px] text-cyan-400/80 font-sans">(متجر الرياض)</span>
                  </button>
                  <button
                    onClick={() => handleSelectStoreSlug('al-anaqa')}
                    className="px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span>/@al-anaqa</span>
                    <span className="text-[10px] text-purple-400/80 font-sans">(عطور)</span>
                  </button>
                  <button
                    onClick={() => handleSelectStoreSlug('direct-pharma')}
                    className="px-2.5 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                  >
                    <span>/@direct-pharma</span>
                    <span className="text-[10px] text-emerald-400/80 font-sans">(صيدلية)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Right Side / Text Column in RTL */}
                <div className="lg:col-span-7 space-y-6 text-right">
                  
                  {/* Poster Top Dual Badges: Golden-Yellow "خدمة مجانية 100%" + Navy "🌐 لأصحاب الموقع" */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Vibrant Yellow Badge from Poster */}
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/20 border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                      <span>خدمة مجانية 100%</span>
                    </div>

                    {/* Navy Banner from Poster */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 font-bold text-xs shadow-sm">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      <span>لأصحاب الموقع والمتاجر</span>
                    </div>

                    {/* Online indicator */}
                    <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>جاهز للتثبيت الفوري</span>
                    </div>
                  </div>

                  {/* Main Headline - Poster Core Slogan: موقعك .. يتكلم مع عملائك */}
                  <div className="space-y-2">
                    <div className="text-xs sm:text-sm font-black tracking-widest text-emerald-400 uppercase font-mono">
                      ABUSALIM — CALL — | أبوسليم كول
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2]">
                      موقعك .. <br className="hidden sm:block" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 via-sky-300 to-emerald-400">
                        يتكلم مع عملائك!
                      </span>
                    </h1>
                  </div>

                  {/* Subtitle description */}
                  <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
                    منصة <strong className="text-cyan-300">أبوسليم كول (ABUSALIM CALL)</strong> تمنحك ذكاءً اصطناعياً لموقعك يرد على استفسارات الزوار، ويتيح لهم الاتصال الصوتي المباشر بك من المتصفح <span className="text-amber-300 font-bold underline underline-offset-4 decoration-amber-400/60">دون كشف رقم هاتفك الشخصي</span> — مجاناً 100% بالكامل.
                  </p>

                  {/* ================= The 3 Key Value Feature Pillars directly from Poster ================= */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
                    {/* Feature 1: سجل واحصل على ذكاء اصطناعي لموقعك */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-400/50 transition-all flex flex-col gap-2 shadow-lg shadow-cyan-950/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25">
                          <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-black text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                          الخطوة 1
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          سجل واحصل على ذكاء اصطناعي لموقعك
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          مساعد ذكي يرحب بالعملاء ويفهم تفاصيل منتجاتك فور دخولهم.
                        </p>
                      </div>
                    </div>

                    {/* Feature 2: يجيب على عملائك */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 hover:border-emerald-400/50 transition-all flex flex-col gap-2 shadow-lg shadow-emerald-950/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
                          <Headphones className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-black text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          الخطوة 2
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          يجيب على عملائك
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          ردود فورية ذكية 24/7 دون أي تأخير، كتابياً وصوتياً.
                        </p>
                      </div>
                    </div>

                    {/* Feature 3: يتيح للعملاء التواصل معك هاتفيًا دون كشف رقمك */}
                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-sky-500/30 hover:border-sky-400/50 transition-all flex flex-col gap-2 shadow-lg shadow-sky-950/20">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-black text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                          سرية تامة
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-white leading-snug">
                          تواصل هاتفي دون كشف رقمك
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          مكالمة بنقرة واحدة من المتصفح مع حماية تامة لخصوصية رقمك.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Primary & Secondary Call to Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
                    {/* Golden Yellow / Emerald Free Button */}
                    <button
                      onClick={() => setIsTrialModalOpen(true)}
                      className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-400/20 transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-5 h-5 text-slate-950" />
                      <span>سجل واحصل على الذكاء الاصطناعي مجاناً</span>
                      <ArrowLeft className="w-5 h-5" />
                    </button>

                    {/* Secondary Button: كود وودجت التواصل */}
                    <button
                      onClick={handleOpenStudio}
                      className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 to-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 font-bold text-xs sm:text-sm md:text-base border border-cyan-500/40 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Code className="w-4 h-4 text-cyan-400" />
                      <span>أكواد الموقع (واتساب + تلجرام + أبوسليم)</span>
                    </button>

                    {/* Button: جرب مكالمة مباشرة */}
                    <button
                      onClick={() => handleStartCall('زر الهيرو الرئيسي')}
                      className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm md:text-base border border-slate-700/80 shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4 text-emerald-400" />
                      <span>جرّب مكالمة</span>
                    </button>
                  </div>

                  {/* Free Policy Guarantee */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-300">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" />
                      خدمة مجانية 100% لأصحاب المواقع
                    </span>
                    <span className="text-slate-600">•</span>
                    <span>بدون بطاقة بنكية</span>
                    <span className="text-slate-600">•</span>
                    <span>بدون تطبيقات أو أجهزة</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-300 font-semibold">مكالمات سرية تحمي رقم هاتفك</span>
                  </div>

                </div>

                {/* Left Side / Visual Poster Showcase & Interactive Card in RTL */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-md space-y-4">
                    {/* Glowing background halo */}
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/15 via-emerald-500/15 to-amber-500/10 blur-2xl pointer-events-none"></div>

                    {/* Official Poster Showcase Card */}
                    <div className="relative rounded-3xl bg-slate-900/95 border border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-950/40">
                      
                      {/* Top mini toolbar */}
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                          <span className="text-slate-400 font-mono text-[11px] pr-2" dir="ltr">abusalim.call</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-400/30">
                          ⭐ بوستر الخدمة المعتمد
                        </span>
                      </div>

                      {/* Poster Image Display with Interactive Zoom / Overlay */}
                      <div className="relative bg-slate-950 overflow-hidden group">
                        <img 
                          src="/assets/aistudio/WhatsApp_Image_2026-10-26_at_1.15.08_PM_54ce6145.jpeg" 
                          alt="أبوسليم كول - موقعك يتكلم مع عملائك - خدمة مجانية 100%"
                          className="w-full h-auto object-cover max-h-[340px] sm:max-h-[380px] transition-transform duration-500 group-hover:scale-102"
                        />

                        {/* Interactive floating badges over poster */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                              <span>مكالمة فورية بدون كشف رقمك</span>
                            </span>
                            <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/90 border border-cyan-500/30 px-2 py-0.5 rounded-lg">
                              صوت فائق الوضوح
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => handleStartCall('بوستر المعاينة المعتمد')}
                              className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>جرّب المكالمة الحية</span>
                            </button>
                            <button
                              onClick={() => setIsTrialModalOpen(true)}
                              className="py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-bold text-xs border border-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Bot className="w-3.5 h-3.5" />
                              <span>تفعيل لموقعي</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Interactive audio waveform footer preview */}
                      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                            🎙️
                          </div>
                          <div>
                            <span className="text-slate-200 font-bold block text-[11px]">مكالمة واردة من العميل</span>
                            <span className="text-emerald-400 text-[10px]">● محمي: رقم هاتفك غير مكشوف</span>
                          </div>
                        </div>

                        {/* Animated bars */}
                        <div className="flex items-center gap-1 h-5">
                          {[35, 70, 50, 95, 60, 85, 45, 80, 40].map((h, i) => (
                            <div
                              key={i}
                              style={{ height: `${h}%` }}
                              className="w-1 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-full animate-pulse"
                            />
                          ))}
                        </div>
                      </div>

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
                  <span className="text-cyan-400">قدام عميلك مباشرة مع أبوسليم كول.</span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  رابط مكالمة واحد من <strong className="text-cyan-300">أبوسليم (ABUSALIM CALL)</strong> وأربع طرق مجانية للوصول له: داخل صفحتك، أو صفحة مستقلة، أو زر في موقعك، أو رمز QR على أي مطبوعة — دون كشف رقمك الشخصي.
                </p>
              </div>

              {/* 4 Methods Tabs / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* 01: زر في موقعك */}
                <div 
                  onClick={() => setActiveWayTab('button')}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    activeWayTab === 'button'
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-cyan-400 font-mono text-sm font-bold">01</span>
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
                    className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                      ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-emerald-400 font-mono text-sm font-bold">02</span>
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
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                      ? 'bg-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <span className="text-cyan-400 font-mono text-sm font-bold">03</span>
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
                    className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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
                      ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-950/30'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-mono text-sm font-bold">04</span>
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


          {/* ================= SECTION: ALL-IN-ONE CUSTOMER CHANNELS ================= */}
          <section className="py-16 bg-slate-950 border-b border-slate-800/80" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
                <div className="space-y-2 max-w-2xl text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تواصل متكامل وشامل مع زبائنك مجاناً</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    اختر كود التواصل المناسب لمتجرك بكل حرية
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    اختر ما يناسب موقعك: كود مكالمات أبوسليم الصوتية المجانية، كود واتساب زاد، أو كود أيقونة تلجرام العائمة — كل كود متاح بشكل مستقل تماماً بضغطة زر.
                  </p>
                </div>

                <button
                  onClick={() => setIsStudioOpen(true)}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-orange-600/25 transition-all hover:scale-102 cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <Code className="w-4 h-4" />
                  <span>توليد كود الودجت لموقعي مجاناً 100%</span>
                </button>
              </div>

              {/* 3 Pillar Channels Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Pillar 1: Abusalim Voice Call */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-orange-500/30 space-y-4 relative overflow-hidden text-right">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">مكالمات أبوسليم الصوتية</h3>
                      <span className="text-[10px] bg-orange-500/20 text-orange-400 font-bold px-2 py-0.5 rounded">مجاني</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      اتصال صوتي فائق الوضوح مباشرة من متصفح العميل دون أن يدفع قرشاً واحداً وبدون تحميل تطبيق.
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartCall('قسم القنوات المتكاملة')}
                    className="text-xs text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>جرّب المكالمة الآن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 2: Zad WhatsApp */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-emerald-500/30 space-y-4 relative overflow-hidden text-right">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">واتساب زاد (Zad WhatsApp)</h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded">فوري</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      زر عائم أو رابط مباشر يفتح المحادثة فوراً مع رسالة ترحيبية جاهزة، مع تكامل سلس لكود واتساب زاد.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsStudioOpen(true)}
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>استخرج كود الواتساب لموقعك</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Pillar 3: Telegram Chat */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-sky-500/30 space-y-4 relative overflow-hidden text-right">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">دردشة تلجرام الفورية</h3>
                      <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded">بلمسة واحدة</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      أيقونة تلجرام عائمة بموقعك تنقل العميل فوراً لمحادثة حسابك أو بوت الدعم الفني الخاص بك.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsStudioOpen(true)}
                    className="text-xs text-sky-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>استخرج كود زر تلجرام</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>

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
                    onClick={() => handleSelectRole('admin')}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer pt-2"
                  >
                    <span>معاينة لوحة المشرف وتحكم الفريق</span>
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
          <div className="flex flex-wrap items-center gap-4">
            <button onClick={() => setIsQrModalOpen(true)} className="hover:text-white cursor-pointer">رمز QR</button>
            <button onClick={() => setIsGoogleAuthOpen(true)} className="hover:text-white cursor-pointer">
              {currentUser ? 'إدارة الحساب' : 'دخول الأعضاء'}
            </button>
            {/* The small, discreet supervisor link requested: "ويكفي ان تضع في الفوتر كلمة المشرف بخط صغير" */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  setCurrentRole('admin');
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors cursor-pointer"
              title="المشرف"
            >
              المشرف
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Multi-Channel Call Widget */}
      <FloatingCallWidget 
        onCall={() => handleStartCall('الزر العائم (اتصل بـ أبوسليم)')} 
        onOpenStudio={handleOpenStudio}
      />

      {/* Live Calling Modal (Real WebRTC audio calling service) */}
      <CallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        department={callDepartment}
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
        currentUserId={currentUser?.id}
        onOpenStudio={() => setIsStudioOpen(true)}
        onSuccess={(url) => {
          // Link created
        }}
      />

      {/* Multi-channel Customer Communication Embed Studio Modal */}
      <EmbedStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        currentUser={currentUser}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onTestCall={(src) => handleStartCall(src)}
      />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        currentUser={currentUser}
        currentRole={currentRole}
        onSelectRole={handleSelectRole}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Admin Authentication Gate Modal */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onSuccess={handleAdminAuthSuccess}
      />

    </div>
  );
}
