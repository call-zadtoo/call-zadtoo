export type UserRole = 'guest' | 'subscriber' | 'admin';

export type SubscriberStatus = 'active' | 'suspended' | 'blocked';

export interface SubscriberMember {
  id: string;
  name: string;
  email: string;
  storeName: string;
  storeSlug: string;
  phone: string;
  status: SubscriberStatus; // 'active' (نشط) | 'suspended' (معلق) | 'blocked' (محجوب/محظور)
  statusReason?: string;
  registeredAt: string;
  totalCallsReceived: number;
  callMinutesAllowed: number; // e.g. 500 or 9999 for unlimited
  whatsappNumber?: string;
  telegramUser?: string;
}

export interface AgentStaff {
  id: string;
  name: string;
  email: string;
  department: string;
  isAvailable: boolean;
  role: 'agent' | 'supervisor';
  callsHandled: number;
}

export interface SystemSettings {
  isMaintenanceMode: boolean;
  announcementBanner: string;
  maxCallDurationMinutes: number;
  allowGuestCalls: boolean;
  requireEmailVerification: boolean;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
  adminEmail: string;
  details?: string;
}

export interface RoleInfo {
  id: UserRole;
  title: string;
  badge: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}

export const ROLES_DEFINITION: Record<UserRole, RoleInfo> = {
  guest: {
    id: 'guest',
    title: 'زائر',
    badge: 'وضع التصفح والتجربة المجانية',
    description: 'تصفح مميزات منصة أبوسليم، إجراء مكالمة صوتية تجريبية مجانية مباشرة من المتصفح بدون تسجيل، وتجربة الاتصال السريع.',
    icon: '👤',
    color: 'text-sky-400',
    bgColor: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30',
    features: [
      'إجراء مكالمة تجريبية مباشرة من المتصفح بدون أي تسجيل',
      'تصفح كافة وسائل الربط (QR، روابط مباشرة، أكواد جافاسكريبت)',
      'تجربة محادثة الرد التفاعلي الصوتي الذكي',
      'إمكانية الترقية بنقرة واحدة إلى عضو مشترك مجاناً 100%'
    ],
  },
  subscriber: {
    id: 'subscriber',
    title: 'عضو مشترك',
    badge: 'بوابة التاجر وأصحاب المواقع',
    description: 'حساب التاجر أو المشترك: إنشاء وإدارة روابط الاتصال المخصصة، وتوليد أكواد الجافاسكريبت المستقلة للواتساب وتلجرام ومكالمات أبوسليم لموقعك.',
    icon: '💼',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    features: [
      'رابط اتصال مباشر مخصص لمتجرك (call.zadtoo.com/@متجرك)',
      'كود جافاسكريبت مستقل لمكالمات أبوسليم لوضعه في موقعك (سلة / زد / ووردبريس)',
      'كود جافاسكريبت مستقل لواتساب زاد لفتح محادثة واتساب فورية لعملائك',
      'كود جافاسكريبت مستقل لزر تلجرام العائم لموقعك لفتح الدردشة المباشرة',
      'رمز QR مخصص لمتجرك صالح للطباعة على الفواتير والكراتين',
      'إحصائيات اتصالات العملاء ومعدل التواصل بمتجرك'
    ],
  },
  admin: {
    id: 'admin',
    title: 'مشرف',
    badge: 'لوحة الإشراف العام وإدارة الأعضاء والنظام',
    description: 'لوحة التحكم المركزية للمشرف (محمية بكلمة مرور): إدارة وتفعيل وتعليق وحجب الأعضاء، تعيين صلاحيات الموظفين، ضبط إعدادات المنصة، ومراقبة المكالمات.',
    icon: '🛡️',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    features: [
      'حماية كاملة بكلمة مرور مخصصة للمشرف العام',
      'إدارة الأعضاء: تفعيل (Activate)، تعليق (Suspend)، وحجب (Block) أي مشترك',
      'تعديل حصص المكالمات ودقائق الاستخدام لكل عضو',
      'إدارة فريق الوكلاء وتوزيع الأقسام وحالة التوفر',
      'التحكم في وضع الصيانة والإعلانات العامة والحد الأقصى للمكالمات',
      'مراقبة المكالمات النشطة في الوقت الفعلي وتصدير السجلات'
    ],
  },
};
