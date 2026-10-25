import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid, 
  CheckCircle2, 
  Sparkles, 
  User, 
  MessageSquare, 
  ArrowRight, 
  ExternalLink,
  ChevronDown,
  CreditCard,
  Send,
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { HotlineyLogo } from './HotlineyLogo';
import { CallStatus, InteractiveWidget, CallLog } from '../types/call';
import { callSounds, speakArabic } from '../utils/audioSound';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  department?: string;
  source?: string;
  onCallCompleted?: (log: CallLog) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  department = 'الدعم والمبيعات',
  source = 'رابط الموقع المباشر (Hotlink)',
  onCallCompleted,
}) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('calling');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');
  
  // Interactive in-call widgets
  const [widgets, setWidgets] = useState<InteractiveWidget[]>([]);
  const [textInputValue, setTextInputValue] = useState('');
  const [agentMessage, setAgentMessage] = useState('مرحباً بك! جاري توصيلك بمسؤول خدمة العملاء...');
  
  // Web Audio microphone visualizer state
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(16).fill(15));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize and handle call stages
  useEffect(() => {
    if (!isOpen) {
      setCallStatus('idle');
      setCallDuration(0);
      setWidgets([]);
      return;
    }

    setCallStatus('calling');
    setCallDuration(0);
    callSounds.startRinging();

    // Stage 1: Ringing for 2.5s
    const ringTimer = setTimeout(() => {
      setCallStatus('ringing');
    }, 1200);

    // Stage 2: Connected after 3.2s
    const connectTimer = setTimeout(() => {
      callSounds.stopRinging();
      callSounds.playConnectedChime();
      setCallStatus('connected');
      setAgentMessage('أهلاً بك في أبوسليم (ABUSALIM)! معك فريق الاستشارات. كيف يمكنني مساعدتك؟');
      speakArabic('أهلاً بك في خدمة اتصالات أبوسليم. كيف أقدر أساعدك؟');

      // Stage 3: Send first interactive widget after 2.5 seconds of connection
      setTimeout(() => {
        setWidgets((prev) => [
          ...prev,
          {
            id: 'w1',
            type: 'yes_no',
            title: 'هل تريد تفعيل خط المكالمات المجاني لمتجر إلكتروني أم لشركة؟',
            description: 'اختر لنوجه لك الخبير المناسب فوراً أثناء المحادثة مجاناً',
            timestamp: new Date().toLocaleTimeString('ar-EG'),
          },
        ]);
      }, 2500);

    }, 3500);

    return () => {
      clearTimeout(ringTimer);
      clearTimeout(connectTimer);
      callSounds.stopRinging();
    };
  }, [isOpen]);

  // Duration Timer
  useEffect(() => {
    let interval: number;
    if (callStatus === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Real microphone visualizer
  useEffect(() => {
    if (callStatus !== 'connected' || isMuted) {
      // Use subtle animated wave fallback
      const simInterval = setInterval(() => {
        setAudioLevel(Array.from({ length: 16 }, () => Math.floor(Math.random() * 40) + 10));
      }, 120);
      return () => clearInterval(simInterval);
    }

    let isSubscribed = true;

    async function initMic() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isSubscribed) return;
        mediaStreamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const sourceNode = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        sourceNode.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVisuals = () => {
          if (!isSubscribed) return;
          analyser.getByteFrequencyData(dataArray);

          // Sample 16 frequency points
          const bars: number[] = [];
          for (let i = 0; i < 16; i++) {
            const val = dataArray[i * 2] || 0;
            // Map 0-255 to height percentage between 10% and 95%
            const height = Math.max(12, Math.min(95, Math.round((val / 255) * 100)));
            bars.push(height);
          }
          setAudioLevel(bars);
          animationFrameRef.current = requestAnimationFrame(updateVisuals);
        };

        updateVisuals();
      } catch {
        // Fallback simulation if user denies mic permission
        const simInterval = setInterval(() => {
          setAudioLevel(Array.from({ length: 16 }, () => Math.floor(Math.random() * 65) + 15));
        }, 120);
        return () => clearInterval(simInterval);
      }
    }

    initMic();

    return () => {
      isSubscribed = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [callStatus, isMuted]);

  // Handle Interactive Widget Submissions
  const handleWidgetAnswer = (widgetId: string, answer: string | Record<string, string>) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === widgetId ? { ...w, submitted: true, response: answer } : w))
    );

    // Provide immediate realistic response from agent
    if (widgetId === 'w1') {
      const choiceStr = typeof answer === 'string' ? answer : '';
      setAgentMessage(`ممتاز! تم التحديد: (${choiceStr}). والآن، هل تحب نرسل لك رابط التجربة المخصص برسالة نصية؟`);
      speakArabic(`ممتاز، تم تسجيل اختيارك: ${choiceStr}`);

      // Push next widget: text input for phone
      setTimeout(() => {
        setWidgets((prev) => [
          ...prev,
          {
            id: 'w2',
            type: 'text_input',
            title: 'أدخل رقم هاتفك أو بريدك الإلكتروني',
            description: 'سيصلك كود التفعيل ورابط الـ Hotlink الخاص بك مباشرة',
            fields: [{ name: 'contact', placeholder: 'مثال: 05XXXXXXXX أو name@domain.com', label: 'بيانات التواصل' }],
            timestamp: new Date().toLocaleTimeString('ar-EG'),
          },
        ]);
      }, 1500);
    } else if (widgetId === 'w2') {
      setAgentMessage('تم استلام بياناتك بنجاح! تم تطبيق خصم خاص 20% لك.');
      speakArabic('شكراً لك، تم حفظ بيانات التواصل بنجاح');

      // Push pricing card or free activation link
      setTimeout(() => {
        setWidgets((prev) => [
          ...prev,
          {
            id: 'w3',
            type: 'pricing',
            title: 'تفعيل باقة أبوسليم (ABUSALIM) المجانية',
            description: 'مكالمات غير محدودة + وكيل ذكي + ربط بـ QR كود (مجاناً 100% الآن)',
            price: { amount: '0', currency: 'مجاناً بالكامل', planName: 'باقة أبوسليم المفتوحة (Free Forever)' },
            linkLabel: 'تفعيل الخط مجاناً الآن',
            linkUrl: '#',
            timestamp: new Date().toLocaleTimeString('ar-EG'),
          },
        ]);
      }, 1500);
    }
  };

  const handleHangup = () => {
    callSounds.stopRinging();
    callSounds.playHangupTone();
    setCallStatus('ended');

    // Create log
    const responses = widgets
      .filter((w) => w.submitted && w.response)
      .map((w) => ({
        question: w.title,
        answer: typeof w.response === 'string' ? w.response : JSON.stringify(w.response),
      }));

    const log: CallLog = {
      id: 'call_' + Math.random().toString(36).substring(2, 9),
      callerName: 'زائر تجريبي عبر المتصفح',
      callerSource: source,
      startTime: new Date().toLocaleTimeString('ar-EG'),
      durationSeconds: callDuration,
      status: 'completed',
      agentName: 'أحمد التميمي (مستشار Hotliney)',
      department,
      interactiveResponses: responses,
      notes: responses.length > 0 ? 'تفاعل العميل مع خيارات المكالمة وأدخل بياناته' : 'مكالمة استفسار عامة',
    };

    if (onCallCompleted) {
      onCallCompleted(log);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (digit: string) => {
    callSounds.playKeypadBeep(500 + parseInt(digit || '1', 10) * 80);
    setKeypadInput((prev) => prev + digit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" dir="rtl">
      {/* Main Calling Box */}
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HotlineyLogo size="sm" />
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-xs text-slate-400 font-medium">مكالمة متصفح آمنة</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
              callStatus === 'connected' 
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                : callStatus === 'ringing' 
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                callStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'
              }`}></span>
              {callStatus === 'calling' && 'جاري الاتصال...'}
              {callStatus === 'ringing' && 'رنين عند الطرف الآخر...'}
              {callStatus === 'connected' && `متصل (${formatTimer(callDuration)})`}
              {callStatus === 'ended' && 'انتهت المكالمة'}
            </span>
          </div>
        </div>

        {/* Call Stage Body */}
        {callStatus !== 'ended' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            
            {/* Caller & Agent info */}
            <div className="text-center space-y-3 pt-2">
              <div className="relative inline-block">
                {/* Glowing avatar waves */}
                <div className={`absolute -inset-2.5 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 opacity-30 blur-md transition-all duration-300 ${
                  callStatus === 'connected' ? 'scale-110 opacity-50' : 'animate-pulse'
                }`}></div>
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-orange-500/40 p-1 flex items-center justify-center shadow-xl">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                    <User className="w-12 h-12 text-orange-400" />
                  </div>
                </div>

                {/* Online indicator */}
                <span className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {callStatus === 'connected' ? 'أحمد التميمي (مستشار أبوسليم ABUSALIM)' : 'جاري توصيل مكالمتك...'}
                </h3>
                <p className="text-xs text-orange-400 font-medium mt-1">
                  قسم: {department} • مصدر: {source}
                </p>
              </div>

              {/* Agent live voice balloon */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-200 max-w-md mx-auto shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{agentMessage}</span>
              </div>
            </div>

            {/* Audio Waveform Visualizer */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-between w-full text-[11px] text-slate-400 px-2">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Radio className="w-3.5 h-3.5" />
                  صوت نقي بتقنية WebRTC عالية الوضوح
                </span>
                <span>{isMuted ? 'الميكروفون مكتوم' : 'الميكروفون نشط'}</span>
              </div>

              <div className="h-16 flex items-center justify-center gap-1.5 w-full px-4">
                {audioLevel.map((height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className={`w-2 rounded-full transition-all duration-100 ${
                      isMuted 
                        ? 'bg-slate-700' 
                        : idx % 2 === 0 
                        ? 'bg-gradient-to-t from-orange-600 to-amber-400' 
                        : 'bg-gradient-to-t from-orange-500 to-rose-500'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Interactive In-Call Widgets Container (المكالمات التفاعلية) */}
            {widgets.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-orange-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    المكالمة التفاعلية (على شاشتك أثناء الحديث)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">أجب بلمسة واحدة</span>
                </div>

                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {widgets.map((widget) => (
                    <div 
                      key={widget.id}
                      className="p-4 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850 border border-orange-500/30 shadow-lg text-right animate-slide-up"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-white">{widget.title}</h4>
                        <span className="text-[10px] text-slate-400">{widget.timestamp}</span>
                      </div>
                      {widget.description && (
                        <p className="text-xs text-slate-300 mb-3">{widget.description}</p>
                      )}

                      {/* Type 1: Yes / No / Choice Buttons */}
                      {widget.type === 'yes_no' && (
                        <div>
                          {widget.submitted ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>تمت الإجابة: {typeof widget.response === 'string' ? widget.response : ''}</span>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleWidgetAnswer(widget.id, 'متجر إلكتروني')}
                                className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                              >
                                متجر إلكتروني 🛍️
                              </button>
                              <button
                                onClick={() => handleWidgetAnswer(widget.id, 'شركة وخدمات أعمال')}
                                className="py-2.5 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs transition-all active:scale-95 cursor-pointer"
                              >
                                شركة وخدمات أعمال 🏢
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Type 2: Text / Phone Input */}
                      {widget.type === 'text_input' && (
                        <div>
                          {widget.submitted ? (
                            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>تم الإرسال: {typeof widget.response === 'string' ? widget.response : ''}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={textInputValue}
                                onChange={(e) => setTextInputValue(e.target.value)}
                                placeholder={widget.fields?.[0]?.placeholder || 'اكتب هنا...'}
                                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                              />
                              <button
                                onClick={() => {
                                  if (textInputValue.trim()) {
                                    handleWidgetAnswer(widget.id, textInputValue);
                                  }
                                }}
                                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                              >
                                <span>إرسال</span>
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Type 3: Pricing & Action Card */}
                      {widget.type === 'pricing' && (
                        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/80 flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-slate-400 block">{widget.price?.planName}</span>
                            <div className="text-base font-black text-white">
                              {widget.price?.amount} <span className="text-xs text-orange-400 font-normal">{widget.price?.currency}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              handleWidgetAnswer(widget.id, 'تم طلب الحجز');
                              alert('تم تأكيد حجز الباقة التجريبية بنجاح!');
                            }}
                            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{widget.linkLabel || 'تأكيد الحجز'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Dialpad View */}
            {showKeypad && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 animate-slide-up">
                <div className="text-center font-mono text-lg font-bold text-white mb-3 tracking-widest min-h-7">
                  {keypadInput || '—'}
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto" dir="ltr">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((btn) => (
                    <button
                      key={btn}
                      onClick={() => handleKeypadPress(btn)}
                      className="h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-base flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Call Control Buttons Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-center gap-4">
                {/* Mute button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    isMuted 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الميكروفون'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Keypad toggle */}
                <button
                  onClick={() => setShowKeypad(!showKeypad)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    showKeypad 
                      ? 'bg-orange-600/20 text-orange-400 border border-orange-500/40' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title="لوحة الأرقام"
                >
                  <Grid className="w-5 h-5" />
                </button>

                {/* Speaker toggle */}
                <button
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    !isSpeakerOn 
                      ? 'bg-slate-800 text-slate-500' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                  title={isSpeakerOn ? 'مكبر الصوت شغال' : 'مكبر الصوت مطفأ'}
                >
                  {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>

                {/* End call red button */}
                <button
                  onClick={handleHangup}
                  className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all active:scale-95 cursor-pointer"
                  title="إنهاء المكالمة"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* Post-Call Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">اكتملت المكالمة بنجاح!</h3>
              <p className="text-xs text-slate-400">
                مدة المكالمة: {formatTimer(callDuration)} • تم حفظ البيانات في سجل الفريق
              </p>
            </div>

            {/* Collected answers review */}
            {widgets.filter((w) => w.submitted).length > 0 && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-right space-y-2">
                <span className="text-xs font-semibold text-orange-400 block mb-1">
                  البيانات التي تم جمعها خلال المكالمة التفاعلية:
                </span>
                {widgets
                  .filter((w) => w.submitted)
                  .map((w) => (
                    <div key={w.id} className="text-xs flex items-center justify-between text-slate-300 border-b border-slate-800/80 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-slate-400">{w.title}</span>
                      <span className="font-bold text-white">{typeof w.response === 'string' ? w.response : JSON.stringify(w.response)}</span>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setCallStatus('calling');
                  setCallDuration(0);
                  setWidgets([]);
                  callSounds.startRinging();
                  setTimeout(() => setCallStatus('connected'), 2500);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>إجراء مكالمة تجريبية أخرى</span>
              </button>
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
              >
                إغلاق والعودة للموقع
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
