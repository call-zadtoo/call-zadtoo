import React, { useState } from 'react';
import { 
  PhoneIncoming, 
  PhoneOff, 
  PhoneCall, 
  User, 
  Clock, 
  Tag, 
  Send, 
  HelpCircle, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  Search, 
  Download,
  Filter,
  Sparkles,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { CallLog } from '../types/call';

interface AgentDashboardProps {
  logs: CallLog[];
  onStartSimulationCall: (source: string) => void;
  onClearLogs?: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  logs,
  onStartSimulationCall,
  onClearLogs,
}) => {
  const [agentStatus, setAgentStatus] = useState<'available' | 'busy'>('available');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSource = filterSource === 'all' || log.callerSource.includes(filterSource);
    const matchesSearch = 
      log.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.callerSource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSource && matchesSearch;
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

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-8 text-right" dir="rtl">
      {/* Header bar of Agent Console */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              لوحة تحكم الفريق: الرد من المتصفح
            </h2>
            <span className="px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/20">
              Web Agent Console
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            استقبل المكالمات الواردة مباشرة، تفاعل مع العميل بلمسة، وتتبع مصادر الحملات
          </p>
        </div>

        {/* Status indicator & Test Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">حالة الموظف:</span>
            <button
              onClick={() => setAgentStatus(agentStatus === 'available' ? 'busy' : 'available')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                agentStatus === 'available'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}
            >
              {agentStatus === 'available' ? '● متاح للرد' : '○ مشغول'}
            </button>
          </div>

          <button
            onClick={() => onStartSimulationCall('رابط الموقع (المتصفح)')}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>تجربة مكالمة كعميل الآن</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">إجمالي المكالمات</span>
          <span className="text-2xl font-black text-white">{logs.length}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">نسبة الرد 100%</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">متوسط مدة المحادثة</span>
          <span className="text-2xl font-black text-orange-400">
            {logs.length > 0
              ? Math.round(logs.reduce((acc, c) => acc + c.durationSeconds, 0) / logs.length)
              : 0}{' '}
            ثانية
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">بدون تطبيق للعميل</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">التفاعل أثناء المكالمة</span>
          <span className="text-2xl font-black text-violet-400">
            {logs.filter(l => l.interactiveResponses && l.interactiveResponses.length > 0).length}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">استجابوا للأسئلة بلمسة</span>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">المصادر الأكثر تحويلاً</span>
          <span className="text-base font-bold text-emerald-400 truncate block">رمز QR والروابط</span>
          <span className="text-[10px] text-slate-400 block mt-1">تتبع دقيق لمصدر الحملة</span>
        </div>
      </div>

      {/* Interactive Agent Capabilities Showcase */}
      <div className="bg-gradient-to-r from-orange-950/30 via-slate-950 to-slate-950 border border-orange-500/20 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h3 className="text-sm font-bold text-white">
              أدوات التفاعل الحي (ما يرسله الموظف لشاشة العميل أثناء التحدث):
            </h3>
          </div>
          <span className="text-xs text-slate-400">تظهر بضغطة زر على شاشة العميل</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-orange-400 shrink-0" />
            <span>طلب تأكيد (نعم/لا)</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-400 shrink-0" />
            <span>طلب رقم الهاتف/الطلب</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>إرسال رابط دفع فوري</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400 shrink-0" />
            <span>خيارات يختارها بلمسة</span>
          </div>
        </div>
      </div>

      {/* Call History Table (سجل المكالمات) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span>سجل المكالمات الواردة</span>
              <span className="text-xs font-normal text-slate-400">({filteredLogs.length})</span>
            </h3>
          </div>

          {/* Filters & Export */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="بحث في السجل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 right-2.5" />
            </div>

            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-orange-500"
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
                    <th className="py-3 px-4 font-semibold">مصدر المكالمة (Campaign)</th>
                    <th className="py-3 px-4 font-semibold">المدة</th>
                    <th className="py-3 px-4 font-semibold">المسؤول</th>
                    <th className="py-3 px-4 font-semibold">بيانات تفاعلية</th>
                    <th className="py-3 px-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-900/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{log.callerName}</div>
                        <div className="text-[10px] text-slate-500">{log.startTime}</div>
                      </td>
                      <td className="py-3 px-4">
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
                            <CheckCircle className="w-3 h-3" />
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Selected Log Drawer/Modal */}
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
