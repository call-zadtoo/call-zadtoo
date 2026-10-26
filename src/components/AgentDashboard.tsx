import React, { useState } from 'react';
import { 
  PhoneCall, 
  User, 
  Clock, 
  Tag, 
  Search, 
  Download,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Ban,
  PauseCircle,
  PlayCircle,
  Trash2,
  Edit3,
  UserPlus,
  Sliders,
  Settings,
  Bell,
  ShieldAlert,
  LogOut,
  History,
  Users,
  Check,
  X
} from 'lucide-react';
import { CallLog } from '../types/call';
import { UserRole, SubscriberMember, SubscriberStatus, AgentStaff, SystemSettings, AdminAuditLog } from '../types/roles';

interface AgentDashboardProps {
  logs: CallLog[];
  onStartSimulationCall: (source: string) => void;
  onClearLogs?: () => void;
  onDeleteLog?: (id: string) => void;
  onOpenStudio?: () => void;
  onSwitchRole?: (role: UserRole) => void;
  onAdminLogout: () => void;
  members: SubscriberMember[];
  onUpdateMemberStatus: (memberId: string, status: SubscriberStatus, reason?: string) => void;
  onUpdateMemberQuota: (memberId: string, minutes: number) => void;
  onDeleteMember: (memberId: string) => void;
  onAddMember: (member: Omit<SubscriberMember, 'id' | 'registeredAt' | 'totalCallsReceived'>) => void;
  systemSettings: SystemSettings;
  onUpdateSystemSettings: (settings: Partial<SystemSettings>) => void;
  auditLogs: AdminAuditLog[];
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  logs,
  onStartSimulationCall,
  onClearLogs,
  onDeleteLog,
  onOpenStudio,
  onSwitchRole,
  onAdminLogout,
  members,
  onUpdateMemberStatus,
  onUpdateMemberQuota,
  onDeleteMember,
  onAddMember,
  systemSettings,
  onUpdateSystemSettings,
  auditLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'members' | 'logs' | 'agents' | 'system' | 'audit'>('members');
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy'>('available');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [logSearchTerm, setLogSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [memberStatusFilter, setMemberStatusFilter] = useState<'all' | SubscriberStatus>('all');
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  // Modals for Member Actions
  const [editingQuotaMember, setEditingQuotaMember] = useState<SubscriberMember | null>(null);
  const [quotaInputValue, setQuotaInputValue] = useState<number>(500);
  const [suspendingMember, setSuspendingMember] = useState<SubscriberMember | null>(null);
  const [suspendReason, setSuspendReason] = useState('تجاوز سياسة الاستخدام العادل أو تحت مراجعة الإدارة');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    email: '',
    storeName: '',
    storeSlug: '',
    phone: '',
    callMinutesAllowed: 1000,
  });

  // Agents staff state
  const [agents, setAgents] = useState<AgentStaff[]>([
    { id: 'ag_1', name: 'أحمد التميمي', email: 'ahmed@zadtoo.com', department: 'المبيعات والدعم', isAvailable: true, role: 'agent', callsHandled: 48 },
    { id: 'ag_2', name: 'سارة خالد', email: 'sara@zadtoo.com', department: 'خدمة العملاء', isAvailable: true, role: 'agent', callsHandled: 64 },
    { id: 'ag_3', name: 'الوكيل الذكي AI', email: 'ai.agent@zadtoo.com', department: 'الدعم الفني والرد الآلي', isAvailable: true, role: 'agent', callsHandled: 192 },
  ]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDept, setNewAgentDept] = useState('الدعم الفني');
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);

  // Filtered Call Logs
  const filteredLogs = logs.filter((log) => {
    const matchesSource = filterSource === 'all' || log.callerSource.includes(filterSource);
    const matchesSearch = 
      log.callerName.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.callerSource.toLowerCase().includes(logSearchTerm.toLowerCase()) ||
      log.department.toLowerCase().includes(logSearchTerm.toLowerCase());
    return matchesSource && matchesSearch;
  });

  // Filtered Members
  const filteredMembers = members.filter((m) => {
    const matchesFilter = memberStatusFilter === 'all' || m.status === memberStatusFilter;
    const term = memberSearchTerm.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(term) ||
      m.storeName.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.storeSlug.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['المعرف', 'المتصل', 'المصدر', 'القسم', 'المدة بالثواني', 'التوقيت', 'ملاحظات'];
    const rows = logs.map(l => [l.id, l.callerName, l.callerSource, l.department, l.durationSeconds, l.startTime, l.notes || '']);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Abusalim_Call_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.email || !newMemberForm.storeName) return;
    onAddMember({
      name: newMemberForm.name,
      email: newMemberForm.email,
      storeName: newMemberForm.storeName,
      storeSlug: newMemberForm.storeSlug || newMemberForm.storeName.toLowerCase().replace(/\s+/g, '-'),
      phone: newMemberForm.phone || '0550000000',
      status: 'active',
      callMinutesAllowed: Number(newMemberForm.callMinutesAllowed) || 1000,
    });
    setNewMemberForm({
      name: '',
      email: '',
      storeName: '',
      storeSlug: '',
      phone: '',
      callMinutesAllowed: 1000,
    });
    setIsAddMemberOpen(false);
  };

  const handleToggleAgentAvailability = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, isAvailable: !a.isAvailable } : a));
  };

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    const newStaff: AgentStaff = {
      id: `ag_${Date.now()}`,
      name: newAgentName.trim(),
      email: `${newAgentName.trim().replace(/\s+/g, '').toLowerCase()}@zadtoo.com`,
      department: newAgentDept,
      isAvailable: true,
      role: 'agent',
      callsHandled: 0,
    };
    setAgents(prev => [...prev, newStaff]);
    setNewAgentName('');
    setIsAddAgentOpen(false);
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents(prev => prev.filter(a => a.id !== agentId));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-8 text-right" dir="rtl">
      
      {/* Top Admin Security & Identity Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-950 border border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white">لوحة الإشراف العام والتحكم المركزي</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                جلسة معتمدة
              </span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>المشرف الحالي:</span>
              <span className="font-mono text-emerald-400 font-bold" dir="ltr">thrayanabil2026@gmail.com</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">صلاحيات كاملة على الأعضاء، المكالمات، وإعدادات النظام</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={() => onStartSimulationCall('رابط الموقع (المتصفح)')}
            className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>تجربة مكالمة</span>
          </button>

          <button
            onClick={onAdminLogout}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/40 text-slate-300 font-bold text-xs border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
            title="تسجيل الخروج من صلاحيات المشرف"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>تسجيل خروج المشرف</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'members'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>إدارة المشتركين والأعضاء ({members.length})</span>
          <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[10px]">
            {members.filter(m => m.status === 'active').length} نشط
          </span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'logs'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>سجل المكالمات الواردة ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('agents')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'agents'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>إدارة فريق الوكلاء ({agents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'system'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>صلاحيات وتحكم النظام</span>
          {systemSettings.isMaintenanceMode && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل العمليات والتدقيق ({auditLogs.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: MEMBERS MANAGEMENT ================= */}
      {activeTab === 'members' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Members Stats & Controls Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>صلاحيات إدارة الأعضاء والمشتركين:</span>
                <span className="text-xs font-normal text-slate-400">
                  (تفعيل • تعليق • حجب/حظر • ضبط الدقائق)
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                يمكن للمشرف تغيير حالة أي مشترك بضغطة زر؛ العضو المعلّق أو المحجوب يتم إيقاف مكالماته وأكواد موقعه فوراً.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAddMemberOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>إضافة مشترك جديد</span>
              </button>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ابحث باسم التاجر، المتجر، أو البريد الإلكتروني..."
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pr-9 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute top-2.5 right-3" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 shrink-0">الحالة:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setMemberStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    memberStatusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الكل ({members.length})
                </button>
                <button
                  onClick={() => setMemberStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    memberStatusFilter === 'active' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-emerald-400'
                  }`}
                >
                  نشط ({members.filter(m => m.status === 'active').length})
                </button>
                <button
                  onClick={() => setMemberStatusFilter('suspended')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    memberStatusFilter === 'suspended' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  معلّق ({members.filter(m => m.status === 'suspended').length})
                </button>
                <button
                  onClick={() => setMemberStatusFilter('blocked')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                    memberStatusFilter === 'blocked' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-rose-400'
                  }`}
                >
                  محجوب ({members.filter(m => m.status === 'blocked').length})
                </button>
              </div>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                    <th className="py-3 px-4 font-semibold">المشترك / المتجر</th>
                    <th className="py-3 px-4 font-semibold">البريد والهاتف</th>
                    <th className="py-3 px-4 font-semibold">رابط الاتصال (Slug)</th>
                    <th className="py-3 px-4 font-semibold">حصة الدقائق</th>
                    <th className="py-3 px-4 font-semibold">الحالة الحالية</th>
                    <th className="py-3 px-4 font-semibold text-center">صلاحيات المشرف (إجراء فوري)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{member.storeName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">المالك: {member.name}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-300 text-[11px]">{member.email}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{member.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded text-[11px] border border-orange-500/20" dir="ltr">
                          call.zadtoo.com/@{member.storeSlug}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white">
                            {member.callMinutesAllowed >= 9999 ? 'غير محدود ♾️' : `${member.callMinutesAllowed} دقيقة`}
                          </span>
                          <button
                            onClick={() => {
                              setEditingQuotaMember(member);
                              setQuotaInputValue(member.callMinutesAllowed);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-emerald-400 hover:bg-slate-800 cursor-pointer"
                            title="تعديل حصة الدقائق"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-[10px] text-slate-500 block">
                          استلم {member.totalCallsReceived} مكالمة
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {member.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            نشط ومفعّل
                          </span>
                        )}
                        {member.status === 'suspended' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              <PauseCircle className="w-3 h-3" />
                              معلّق مؤقتاً
                            </span>
                            {member.statusReason && (
                              <span className="block text-[10px] text-amber-300/80 mt-0.5 truncate max-w-[140px]" title={member.statusReason}>
                                {member.statusReason}
                              </span>
                            )}
                          </div>
                        )}
                        {member.status === 'blocked' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              <Ban className="w-3 h-3" />
                              محجوب / محظور
                            </span>
                            {member.statusReason && (
                              <span className="block text-[10px] text-rose-300/80 mt-0.5 truncate max-w-[140px]" title={member.statusReason}>
                                {member.statusReason}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 1. تفعيل (Activate) */}
                          <button
                            onClick={() => onUpdateMemberStatus(member.id, 'active')}
                            disabled={member.status === 'active'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              member.status === 'active'
                                ? 'opacity-30 bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 cursor-pointer'
                            }`}
                            title="تفعيل حساب العضو والسماح باستقبال المكالمات"
                          >
                            <PlayCircle className="w-3 h-3" />
                            <span>تفعيل</span>
                          </button>

                          {/* 2. تعليق (Suspend) */}
                          <button
                            onClick={() => setSuspendingMember(member)}
                            disabled={member.status === 'suspended'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              member.status === 'suspended'
                                ? 'opacity-30 bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white border border-amber-500/30 cursor-pointer'
                            }`}
                            title="تعليق حساب العضو مؤقتاً"
                          >
                            <PauseCircle className="w-3 h-3" />
                            <span>تعليق</span>
                          </button>

                          {/* 3. حجب / حظر (Block) */}
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حجب العضو "${member.storeName}" تماماً وحظر خطوطه؟`)) {
                                onUpdateMemberStatus(member.id, 'blocked', 'حجب نهائي بواسطة المشرف العام');
                              }
                            }}
                            disabled={member.status === 'blocked'}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                              member.status === 'blocked'
                                ? 'opacity-30 bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 cursor-pointer'
                            }`}
                            title="حجب وحظر العضو ومنعه من الخدمة"
                          >
                            <Ban className="w-3 h-3" />
                            <span>حجب</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              if (confirm(`حذف العضو "${member.storeName}" نهائياً من النظام؟`)) {
                                onDeleteMember(member.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer transition-colors"
                            title="حذف المشترك نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: CALL LOGS & INTERACTIVE RESPONSES ================= */}
      {activeTab === 'logs' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>سجل المكالمات الواردة لجميع الأعضاء</span>
                <span className="text-xs font-normal text-slate-400">({filteredLogs.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تتبع مصادر الاتصالات، الأسئلة التفاعلية، مدة المكالمات، والملاحظات المسجلة.
              </p>
            </div>

            {/* Filters, Clear, & Export */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث في السجل..."
                  value={logSearchTerm}
                  onChange={(e) => setLogSearchTerm(e.target.value)}
                  className="px-3 py-1.5 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 right-2.5" />
              </div>

              <select
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">كل المصادر</option>
                <option value="QR">رمز QR</option>
                <option value="رابط">رابط مباشر</option>
                <option value="حملة">حملات إعلانية</option>
              </select>

              <button
                onClick={exportCSV}
                className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 px-3 transition-colors cursor-pointer"
                title="تصدير السجل"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تصدير CSV</span>
              </button>

              {onClearLogs && (
                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من تفريغ كافة سجلات المكالمات؟')) {
                      onClearLogs();
                    }
                  }}
                  className="p-1.5 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-1.5 px-3 cursor-pointer"
                  title="مسح السجلات"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تطهير السجل</span>
                </button>
              )}
            </div>
          </div>

          {/* Table Content */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
            {filteredLogs.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Headphones className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">لا توجد مكالمات مسجلة بعد في هذا التصنيف.</p>
                <button
                  onClick={() => onStartSimulationCall('رابط الموقع (المتصفح)')}
                  className="text-xs text-orange-400 underline font-medium hover:text-orange-300 cursor-pointer"
                >
                  اضغط هنا لتجربة مكالمة جديدة ومشاهدتها في السجل
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                      <th className="py-3 px-4 font-semibold">المتصل</th>
                      <th className="py-3 px-4 font-semibold">مصدر المكالمة</th>
                      <th className="py-3 px-4 font-semibold">المدة</th>
                      <th className="py-3 px-4 font-semibold">الموظف / الوكيل</th>
                      <th className="py-3 px-4 font-semibold">بيانات تفاعلية</th>
                      <th className="py-3 px-4 font-semibold">الحالة</th>
                      <th className="py-3 px-4 font-semibold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className="hover:bg-slate-900/50 transition-colors"
                      >
                        <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedLog(log)}>
                          <div className="font-semibold text-white">{log.callerName}</div>
                          <div className="text-[10px] text-slate-500">{log.startTime}</div>
                        </td>
                        <td className="py-3 px-4 cursor-pointer" onClick={() => setSelectedLog(log)}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                            <Tag className="w-3 h-3" />
                            {log.callerSource}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {log.durationSeconds} ثانية
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {log.agentName}
                        </td>
                        <td className="py-3 px-4">
                          {log.interactiveResponses && log.interactiveResponses.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              {log.interactiveResponses.length} إجابات مسجلة
                            </span>
                          ) : (
                            <span className="text-slate-500">لا يوجد إدخال</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            مكتملة
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => setSelectedLog(log)}
                              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                            >
                              عرض
                            </button>
                            {onDeleteLog && (
                              <button
                                onClick={() => onDeleteLog(log.id)}
                                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 cursor-pointer"
                                title="حذف السجل"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: AGENTS & STAFF MANAGEMENT ================= */}
      {activeTab === 'agents' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>فريق الوكلاء والموظفين المسؤولين عن الرد:</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                إدارة موظفي خدمة العملاء، تعيين الأقسام، وتبديل حالة التوفر (متاح / مشغول).
              </p>
            </div>

            <button
              onClick={() => setIsAddAgentOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة موظف/وكيل جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-white">
                      {agent.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                      <span className="text-[11px] text-slate-400 block">{agent.department}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAgent(agent.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 cursor-pointer"
                    title="حذف الوكيل"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-slate-400">المكالمات المنجزة:</span>
                  <span className="font-bold text-white font-mono">{agent.callsHandled} مكالمة</span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleToggleAgentAvailability(agent.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      agent.isAvailable
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${agent.isAvailable ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                    <span>{agent.isAvailable ? 'متاح للرد على المكالمات' : 'غير متاح (مشغول / خارج الدوام)'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: SYSTEM PERMISSIONS & SETTINGS ================= */}
      {activeTab === 'system' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>صلاحيات وتحكم النظام العامة (Admin Governance):</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              إعدادات الطوارئ، وضع الصيانة، إعلانات المنصة العامة، وضبط مدة المكالمات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Control 1: Maintenance Mode */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">وضع الصيانة العامة للمنصة</h4>
                    <span className="text-[11px] text-slate-400">إيقاف مؤقت لاستقبال المكالمات الجديدة</span>
                  </div>
                </div>

                <button
                  onClick={() => onUpdateSystemSettings({ isMaintenanceMode: !systemSettings.isMaintenanceMode })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    systemSettings.isMaintenanceMode
                      ? 'bg-rose-600 text-white shadow-lg'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {systemSettings.isMaintenanceMode ? 'مفعّل الآن ⚠️' : 'معطّل (طبيعي)'}
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                عند تفعيل هذا الخيار، يتم تنبيه الزوار والأعضاء بوجود أعمال ترقية في الخوادم الصوتية.
              </p>
            </div>

            {/* Control 2: Call Duration Limit */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">الحد الأقصى لمدة المكالمة الواحدة</h4>
                  <span className="text-[11px] text-slate-400">منع استهلاك الخوادم للمكالمات الطويلة</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {[5, 15, 30, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => onUpdateSystemSettings({ maxCallDurationMinutes: mins })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      systemSettings.maxCallDurationMinutes === mins
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mins} دقائق
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Emergency Broadcast Banner */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold text-white">رسالة الإعلان العام / شريط التنبيه للمشتركين</h4>
                  <span className="text-[11px] text-slate-400">تظهر أعلى صفحات المنصة لجميع المستخدمين والزوار</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={systemSettings.announcementBanner}
                  onChange={(e) => onUpdateSystemSettings({ announcementBanner: e.target.value })}
                  placeholder="اكتب رسالة الإعلان العام هنا (مثال: خصم 50% على الباقات المتقدمة أو مرحباً بكم)..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => onUpdateSystemSettings({ announcementBanner: '' })}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer shrink-0"
                >
                  مسح الشريط
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 5: AUDIT LOGS ================= */}
      {activeTab === 'audit' && (
        <div className="space-y-4 animate-fade-in">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>سجل العمليات والتدقيق الإشرافي (Audit Trail):</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              كل إجراء يقوم به المشرف (تفعيل، تعليق، حجب، تغيير إعدادات) يتم أرشفته هنا بالوقت والتاريخ.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden">
            <div className="divide-y divide-slate-800/60 text-xs">
              {auditLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">لا توجد عمليات مسجلة في جلسة اليوم بعد.</div>
              ) : (
                auditLogs.map((audit) => (
                  <div key={audit.id} className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-slate-900/40">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span className="font-bold text-white">{audit.action}</span>
                      <span className="text-slate-400">← {audit.target}</span>
                      {audit.details && (
                        <span className="text-slate-500 text-[11px]">({audit.details})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="font-mono">{audit.adminEmail}</span>
                      <span className="text-slate-600">•</span>
                      <span>{audit.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT QUOTA ================= */}
      {editingQuotaMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">تعديل حصة المكالمات</h3>
              <button onClick={() => setEditingQuotaMember(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              تحديد الحد الأقصى لدقائق المكالمات المسموحة لـ <strong className="text-white">{editingQuotaMember.storeName}</strong>:
            </p>
            <div className="space-y-3">
              <input
                type="number"
                value={quotaInputValue}
                onChange={(e) => setQuotaInputValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                min="0"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setQuotaInputValue(500)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  500 دقيقة
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaInputValue(2000)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  2000 دقيقة
                </button>
                <button
                  type="button"
                  onClick={() => setQuotaInputValue(9999)}
                  className="px-2.5 py-1 rounded bg-slate-800 text-xs text-emerald-400 hover:text-emerald-300 font-bold"
                >
                  غير محدود ♾️
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onUpdateMemberQuota(editingQuotaMember.id, quotaInputValue);
                  setEditingQuotaMember(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
              >
                حفظ التعديل
              </button>
              <button
                onClick={() => setEditingQuotaMember(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: SUSPEND MEMBER WITH REASON ================= */}
      {suspendingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">تعليق حساب المشترك</h3>
              </div>
              <button onClick={() => setSuspendingMember(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300">
              سيتم تعليق خط ومكالمات وأكواد متجر <strong className="text-amber-400">{suspendingMember.storeName}</strong> مؤقتاً.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">سبب التعليق:</label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onUpdateMemberStatus(suspendingMember.id, 'suspended', suspendReason);
                  setSuspendingMember(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
              >
                تأكيد تعليق العضو
              </button>
              <button
                onClick={() => setSuspendingMember(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW MEMBER ================= */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>إضافة مشترك جديد من لوحة المشرف</span>
              </h3>
              <button onClick={() => setIsAddMemberOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">اسم التاجر:</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.name}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="عبدالله الشمري"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">اسم المتجر:</label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.storeName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, storeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    placeholder="متجر العود الملكي"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">البريد الإلكتروني:</label>
                  <input
                    type="email"
                    required
                    value={newMemberForm.email}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
                    dir="ltr"
                    placeholder="store@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">معرف الرابط (Slug):</label>
                  <input
                    type="text"
                    value={newMemberForm.storeSlug}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, storeSlug: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
                    dir="ltr"
                    placeholder="royal-oud"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">رقم الهاتف:</label>
                  <input
                    type="text"
                    value={newMemberForm.phone}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono text-left"
                    dir="ltr"
                    placeholder="0501234567"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">حصة الدقائق:</label>
                  <input
                    type="number"
                    value={newMemberForm.callMinutesAllowed}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, callMinutesAllowed: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  إضافة العضو وتفعيله فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD NEW AGENT ================= */}
      {isAddAgentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إضافة وكيل / موظف رد جديد</h3>
              <button onClick={() => setIsAddAgentOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">اسم الموظف:</label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="محمد العتيبي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 block">القسم:</label>
                <select
                  value={newAgentDept}
                  onChange={(e) => setNewAgentDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="المبيعات والدعم">المبيعات والدعم</option>
                  <option value="خدمة العملاء">خدمة العملاء</option>
                  <option value="الدعم الفني">الدعم الفني</option>
                  <option value="الشكاوى والاقتراحات">الشكاوى والاقتراحات</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-md"
                >
                  حفظ وإضافة الموظف
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddAgentOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Log Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">تفاصيل سجل المكالمة</h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">المتصل:</span>
                <span className="font-semibold text-white">{selectedLog.callerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">المصدر:</span>
                <span className="font-semibold text-orange-400">{selectedLog.callerSource}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">المدة والتوقيت:</span>
                <span className="text-slate-200">{selectedLog.durationSeconds} ثانية في {selectedLog.startTime}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">الموظف / الوكيل:</span>
                <span className="text-slate-200">{selectedLog.agentName}</span>
              </div>

              {selectedLog.interactiveResponses && selectedLog.interactiveResponses.length > 0 && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 mt-2">
                  <span className="font-bold text-orange-400 block">الإجابات والبيانات التي سلمها العميل:</span>
                  {selectedLog.interactiveResponses.map((r, i) => (
                    <div key={i} className="text-slate-300">
                      <div className="text-slate-400 text-[11px]">• {r.question}</div>
                      <div className="font-semibold text-emerald-400 mr-2">← {r.answer}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
              >
                إغلاق التفاصيل
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
