import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';

interface AdminLoginPanelProps {
  onSuccess: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export const AdminLoginPanel: React.FC<AdminLoginPanelProps> = ({
  onSuccess,
  onCancel,
  isModal = false,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    setTimeout(() => {
      // Validate credentials securely against supervisor account
      if (cleanEmail === 'thrayanabil2026@gmail.com' && cleanPass === 'Tr@7177') {
        setIsSuccess(true);
        setIsLoading(false);
        try {
          localStorage.setItem('abusalim_admin_auth', 'true');
          localStorage.setItem('abusalim_admin_auth_time', new Date().toISOString());
        } catch {}
        setTimeout(() => {
          setIsSuccess(false);
          setEmail('');
          setPassword('');
          onSuccess();
        }, 500);
      } else {
        setIsLoading(false);
        if (cleanEmail !== 'thrayanabil2026@gmail.com') {
          setErrorMsg('البريد الإلكتروني للمشرف غير مسجل في النظام.');
        } else {
          setErrorMsg('كلمة المرور غير صحيحة، يرجى إعادة المحاولة.');
        }
      }
    }, 400);
  };

  return (
    <div className={`w-full max-w-lg mx-auto rounded-3xl bg-slate-900/95 border border-emerald-500/30 p-5 sm:p-8 space-y-6 shadow-2xl shadow-emerald-950/40 ${isModal ? '' : 'my-4'}`} dir="rtl">
      
      {/* Top Shield Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>منطقة تحكم المشرف العام المعتمد</span>
        </div>

        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 p-0.5 mx-auto shadow-xl shadow-emerald-600/30">
          <div className="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center">
            <ShieldCheck className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400" />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          لوحة تسجيل دخول المشرف
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          سجل دخولك بالبريد وكلمة المرور المعتمدة للوصول إلى صلاحيات إدارة الأعضاء، مراقبة المكالمات الحية، وحجب أو تعليق الحسابات.
        </p>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success message */}
      {isSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>تم التحقق من بيانات المشرف بنجاح! جاري فتح لوحة التحكم...</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            البريد الإلكتروني المعتمد للمشرف:
          </label>
          <div className="relative">
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="supervisor@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 pr-10 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-left transition-colors"
              dir="ltr"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 sm:top-4 right-3.5" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 block">
            كلمة مرور المشرف:
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 pr-10 pl-10 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-left transition-colors"
              dir="ltr"
            />
            <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 sm:top-4 right-3.5" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 sm:top-3.5 left-3 text-slate-500 hover:text-slate-300 cursor-pointer p-0.5"
              title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>جاري التحقق من الصلاحيات...</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>دخول لوحة تحكم المشرف</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* Supervisor Powers Overview */}
      <div className="pt-2 border-t border-slate-800 space-y-2 text-right">
        <span className="text-[11px] font-bold text-slate-400 block">
          صلاحيات المشرف المتاحة بعد الدخول:
        </span>
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>تفعيل أو تعليق أو حجب الأعضاء</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>تعديل حصص دقائق المكالمات</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>مراقبة المكالمات الحية والوكلاء</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>تفعيل وضع الصيانة والإعلانات</span>
          </div>
        </div>
      </div>

    </div>
  );
};
