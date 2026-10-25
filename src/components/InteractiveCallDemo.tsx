import React, { useState } from 'react';
import { 
  HelpCircle, 
  FileText, 
  CheckSquare, 
  Users, 
  Info, 
  Link2, 
  CreditCard, 
  Sparkles, 
  PhoneCall,
  CheckCircle2,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

interface FeatureItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  previewType: 'yes_no' | 'input' | 'options' | 'contact' | 'pricing' | 'link' | 'payment';
  sampleQuestion: string;
}

const features: FeatureItem[] = [
  {
    id: '1',
    title: 'طرح الأسئلة وطلبات التأكيد بنعم أو لا',
    icon: <HelpCircle className="w-5 h-5 text-orange-500" />,
    previewType: 'yes_no',
    sampleQuestion: 'هل ترغب في استلام تفاصيل العرض على واتساب أيضاً؟',
  },
  {
    id: '2',
    title: 'حقول كتابة لرقم الطلب أو البريد أو رقم الهاتف',
    icon: <FileText className="w-5 h-5 text-orange-500" />,
    previewType: 'input',
    sampleQuestion: 'اكتب رقم طلبك للمتابعة الفورية أثناء المكالمة:',
  },
  {
    id: '3',
    title: 'خيارات يختار منها العميل بلمسة واحدة',
    icon: <CheckSquare className="w-5 h-5 text-orange-500" />,
    previewType: 'options',
    sampleQuestion: 'حدد المشكلة التي تواجهك:',
  },
  {
    id: '4',
    title: 'جمع بيانات التواصل وبيانات العميل المنظمة',
    icon: <Users className="w-5 h-5 text-orange-500" />,
    previewType: 'contact',
    sampleQuestion: 'تأكيد اسمك ورقم هاتفك لحجز الموعد:',
  },
  {
    id: '5',
    title: 'عرض الأسعار أو الخطوات أو التفاصيل أثناء المكالمة',
    icon: <Info className="w-5 h-5 text-orange-500" />,
    previewType: 'pricing',
    sampleQuestion: 'تفاصيل باقة الاشتراك المقترحة لك:',
  },
  {
    id: '6',
    title: 'إرسال روابط لصفحات أو ملفات أو خطوات تالية',
    icon: <Link2 className="w-5 h-5 text-orange-500" />,
    previewType: 'link',
    sampleQuestion: 'تصفح كتالوج المنتجات الجديد بنقرة واحدة:',
  },
  {
    id: '7',
    title: 'إرسال رابط دفع أثناء الحديث',
    icon: <CreditCard className="w-5 h-5 text-orange-500" />,
    previewType: 'payment',
    sampleQuestion: 'دفع فاتورة رقم #9821 أثناء استمرار الحديث:',
  },
];

export const InteractiveCallDemo: React.FC<{ onLaunchCall: () => void }> = ({ onLaunchCall }) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem>(features[0]);
  const [demoAnswered, setDemoAnswered] = useState<string | null>(null);
  const [inputVal, setInputVal] = useState('');

  const handleSelect = (f: FeatureItem) => {
    setSelectedFeature(f);
    setDemoAnswered(null);
    setInputVal('');
  };

  return (
    <section className="py-16 border-t border-slate-800/80" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Heading matching screenshot 4 */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المكالمات التفاعلية</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            مش مكالمة صوتية بس؛ <br />
            المكالمة نفسها بتبقى تفاعلية.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            أثناء الحديث، يستطيع موظفك أو وكيلك الذكي أن يعرض على شاشة العميل سؤالاً أو خيارات أو رابطًا. يجيب العميل بلمسة، فتصل الإجابة فورًا، ويستمر الحوار بناءً عليها.
          </p>
        </div>

        {/* Two Column Layout: Features List & Live In-Phone Interactive Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Features Column (Left in RTL = Right in LTR) */}
          <div className="lg:col-span-7 space-y-2.5">
            {features.map((feature) => {
              const isSelected = selectedFeature.id === feature.id;
              return (
                <div
                  key={feature.id}
                  onClick={() => handleSelect(feature)}
                  className={`group p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-l from-orange-950/40 via-slate-900 to-slate-900 border-orange-500/50 shadow-lg text-white'
                      : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' 
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {feature.icon}
                    </div>
                    <span className="text-sm sm:text-base font-semibold">{feature.title}</span>
                  </div>

                  <ChevronLeft className={`w-5 h-5 transition-transform ${
                    isSelected ? 'text-orange-400 -translate-x-1' : 'text-slate-600'
                  }`} />
                </div>
              );
            })}

            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
              💡 <strong className="text-orange-300 font-medium">والوكيل الذكي يستخدمها:</strong> يتفاعل مع إجابات العميل فورياً، ثم يكمل الحوار بذكاء أو يستدعي الموظف المناسب تلقائياً.
            </div>
          </div>

          {/* Interactive Mobile Device Simulator Preview */}
          <div className="lg:col-span-5 flex justify-center sticky top-24">
            <div className="w-full max-w-[340px] rounded-[36px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800">
              {/* Phone Screen */}
              <div className="rounded-[28px] bg-slate-900 border border-slate-800 overflow-hidden min-h-[520px] flex flex-col justify-between p-4">
                
                {/* Simulated Screen Top Status */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>مكالمة جارية 01:24</span>
                  </div>
                  <span className="font-mono text-slate-400 text-[10px]">ABUSALIM Live</span>
                </div>

                {/* Agent Header in simulated screen */}
                <div className="text-center py-4 space-y-1">
                  <div className="w-14 h-14 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 mx-auto flex items-center justify-center font-bold text-lg mb-2 shadow-inner">
                    🎙️
                  </div>
                  <div className="font-bold text-sm text-white">وكيل المبيعات الذكي</div>
                  <div className="text-[11px] text-orange-400">يعرض الآن عنصراً تفاعلياً على شاشتك:</div>
                </div>

                {/* The Interactive In-Call Card Demonstration */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-orange-500/40 shadow-xl space-y-3">
                  <div className="text-xs font-bold text-white leading-snug">
                    {selectedFeature.sampleQuestion}
                  </div>

                  {/* Feature preview rendering */}
                  {selectedFeature.previewType === 'yes_no' && (
                    <div className="space-y-2">
                      {demoAnswered ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-bold">
                          ✓ تم إرسال إجابتك: ({demoAnswered})
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => setDemoAnswered('نعم بالتأكيد')}
                            className="py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all active:scale-95 cursor-pointer"
                          >
                            نعم بالتأكيد 👍
                          </button>
                          <button
                            onClick={() => setDemoAnswered('لا، شكراً')}
                            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all active:scale-95 cursor-pointer"
                          >
                            لا، شكراً
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedFeature.previewType === 'input' && (
                    <div className="space-y-2">
                      {demoAnswered ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-bold">
                          ✓ تم إرسال الرقم: {demoAnswered}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            placeholder="#10492"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none"
                          />
                          <button
                            onClick={() => setDemoAnswered(inputVal || '#10492')}
                            className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold cursor-pointer"
                          >
                            إرسال
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedFeature.previewType === 'options' && (
                    <div className="space-y-1.5">
                      {demoAnswered ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-bold">
                          ✓ تم اختيار: {demoAnswered}
                        </div>
                      ) : (
                        ['تأخير في الشحن', 'تعديل عنوان التسليم', 'استبدال أو إرجاع'].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setDemoAnswered(opt)}
                            className="w-full text-right py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-slate-800 transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span>{opt}</span>
                            <span className="text-[10px] text-orange-400 font-bold">اختر</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}

                  {selectedFeature.previewType === 'contact' && (
                    <div className="space-y-2">
                      {demoAnswered ? (
                        <div className="bg-emerald-500/15 border border-emerald-500/30 p-2.5 rounded-xl text-center text-xs text-emerald-400 font-bold">
                          ✓ تم تأكيد بيانات الاتصال
                        </div>
                      ) : (
                        <button
                          onClick={() => setDemoAnswered('تم التأكيد')}
                          className="w-full py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>تأكيد رقمي الحالي بلمسة</span>
                        </button>
                      )}
                    </div>
                  )}

                  {selectedFeature.previewType === 'pricing' && (
                    <div className="space-y-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-white block">باقة أبوسليم المفتوحة</span>
                          <span className="text-[10px] text-slate-400">مكالمات غير محدودة + كل الميزات</span>
                        </div>
                        <span className="text-emerald-400 font-black text-sm">مجاناً 100%</span>
                      </div>
                      <button
                        onClick={() => setDemoAnswered('تم تفعيل الباقة المجانية')}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                      >
                        {demoAnswered ? '✓ تم التفعيل المجاني بنجاح' : 'تفعيل الخط مجاناً مدى الحياة'}
                      </button>
                    </div>
                  )}

                  {selectedFeature.previewType === 'link' && (
                    <div className="space-y-2">
                      <button
                        onClick={() => setDemoAnswered('تم فتح الرابط')}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold border border-orange-500/30 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                        <span>فتح الكتالوج في المتصفح</span>
                      </button>
                    </div>
                  )}

                  {selectedFeature.previewType === 'payment' && (
                    <div className="space-y-2">
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-slate-300">المبلغ المطلوب:</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">150.00 ر.س</span>
                      </div>
                      <button
                        onClick={() => setDemoAnswered('تم الدفع بنجاح')}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>{demoAnswered ? '✓ تم الدفع' : 'دفع سريع عبر Apple Pay / بطاقة'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Simulated Call Bar */}
                <div className="pt-4 flex items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    🎙️
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                    🔊
                  </div>
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold">
                    ✕
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Bottom CTA to launch full calling test */}
        <div className="text-center pt-6">
          <button
            onClick={onLaunchCall}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl shadow-orange-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
            <span>جرّب المكالمة التفاعلية الحية بنفسك الآن</span>
          </button>
        </div>

      </div>
    </section>
  );
};
