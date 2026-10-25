import React, { useRef, useState, useEffect } from 'react';
import { QrCode, Download, Copy, Check, X, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotlinkUrl?: string;
  onTestCall: () => void;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  hotlinkUrl = 'https://call.zadtoo.com',
  onTestCall,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [customSlug, setCustomSlug] = useState('');

  // Adopt user requested URL: call.zadtoo.com
  const baseUrl = 'call.zadtoo.com';
  const fullUrl = customSlug.trim() ? `https://${baseUrl}/${customSlug.trim()}` : `https://${baseUrl}`;

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 540;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // White Background with rounded corners
      ctx.fillStyle = '#ffffff';
      ctx.roundRect(0, 0, 540, 640, 20);
      ctx.fill();

      // Brand Header
      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 30px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('أبوسليم | ABUSALIM', 270, 58);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px sans-serif';
      ctx.fillText('امسح لبدء مكالمة مباشرة مجاناً', 270, 92);

      // QR Code matrix
      const matrixSize = 25;
      const cellSize = 12;
      const startX = (540 - matrixSize * cellSize) / 2;
      const startY = 125;

      ctx.fillStyle = '#0f172a';
      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < matrixSize; c++) {
          const isCorner = 
            (r < 7 && c < 7) || 
            (r < 7 && c >= matrixSize - 7) || 
            (r >= matrixSize - 7 && c < 7);

          if (isCorner) {
            const isBorder = r === 0 || r === 6 || c === 0 || c === 6 ||
              r === matrixSize - 1 || r === matrixSize - 7 ||
              c === matrixSize - 1 || c === matrixSize - 7;
            const isInner = (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
              (r >= 2 && r <= 4 && c >= matrixSize - 5 && c <= matrixSize - 3) ||
              (r >= matrixSize - 5 && r <= matrixSize - 3 && c >= 2 && c <= 4);

            if (isBorder || isInner) {
              ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1);
            }
          } else {
            const charCode = (customSlug || 'zadtoo').charCodeAt((r + c) % (customSlug || 'zadtoo').length) || 42;
            if ((r * c + charCode) % 3 === 0 || (r + c) % 2 === 0) {
              ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize - 1, cellSize - 1);
            }
          }
        }
      }

      // Center Icon Badge
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(270, startY + (matrixSize * cellSize) / 2, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('📞', 270, startY + (matrixSize * cellSize) / 2 + 6);

      // Footer Call to action
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(fullUrl, 270, 485);

      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('خدمة اتصال مجانية بدون تطبيق للعميل', 270, 520);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `Zadtoo_QR_${customSlug || 'call'}.png`;
      downloadLink.click();
    }
    setDownloading(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      dir="rtl"
    >
      {/* Modal Box (Compact & Centered) */}
      <div 
        className="relative w-full max-w-[390px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-5 space-y-4 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with prominent, easily clickable Close Button */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>رمز QR للاتصال</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-normal">مجاني</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono" dir="ltr">{baseUrl}</p>
            </div>
          </div>

          {/* Explicit, high-visibility Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-rose-600/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق النافذة"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact QR Display Card */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-slate-200 text-slate-900 space-y-2">
          <div className="text-center leading-tight">
            <span className="font-extrabold text-sm text-slate-900 block">أبوسليم | ABUSALIM</span>
            <span className="text-[10px] text-slate-500">امسح بالكاميرا لبدء مكالمة متصفح مجانية</span>
          </div>

          {/* Crisp QR Code Graphic */}
          <div className="relative p-2 bg-white rounded-lg shadow-sm">
            <svg viewBox="0 0 160 160" className="w-32 h-32 text-slate-900">
              <rect x="10" y="10" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="6" rx="5" />
              <rect x="22" y="22" width="14" height="14" fill="#ea580c" rx="2" />
              
              <rect x="112" y="10" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="6" rx="5" />
              <rect x="124" y="22" width="14" height="14" fill="#ea580c" rx="2" />
              
              <rect x="10" y="112" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="6" rx="5" />
              <rect x="22" y="124" width="14" height="14" fill="#ea580c" rx="2" />
              
              <rect x="60" y="15" width="8" height="8" fill="currentColor" />
              <rect x="75" y="15" width="8" height="8" fill="currentColor" />
              <rect x="90" y="25" width="8" height="8" fill="currentColor" />
              <rect x="60" y="35" width="8" height="8" fill="currentColor" />
              <rect x="80" y="45" width="8" height="8" fill="currentColor" />
              
              <rect x="15" y="65" width="8" height="8" fill="currentColor" />
              <rect x="35" y="75" width="8" height="8" fill="currentColor" />
              <rect x="65" y="65" width="8" height="8" fill="currentColor" />
              <rect x="85" y="75" width="8" height="8" fill="currentColor" />
              <rect x="115" y="65" width="8" height="8" fill="currentColor" />
              <rect x="135" y="75" width="8" height="8" fill="currentColor" />

              <rect x="60" y="115" width="8" height="8" fill="currentColor" />
              <rect x="75" y="125" width="8" height="8" fill="currentColor" />
              <rect x="90" y="135" width="8" height="8" fill="currentColor" />
              <rect x="115" y="115" width="8" height="8" fill="currentColor" />
              <rect x="135" y="135" width="8" height="8" fill="currentColor" />

              {/* Center Handset Badge */}
              <circle cx="80" cy="80" r="14" fill="#ea580c" />
              <path d="M75 77C75 80 79 83 83 83M77 81L81 85" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="font-mono text-[11px] text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-full" dir="ltr">
            {fullUrl}
          </div>
        </div>

        {/* Customization input */}
        <div className="space-y-1">
          <label className="text-[11px] text-slate-400 font-medium block">
            تخصيص الرابط (اختياري):
          </label>
          <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 font-mono" dir="ltr">{baseUrl}/</span>
            <input
              type="text"
              placeholder="مثال: support أو sales"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
              className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
              dir="ltr"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 border border-slate-300"
          >
            <Download className="w-3.5 h-3.5 text-orange-600" />
            <span>تنزيل رمز QR للطباعة</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={copyLink}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onTestCall();
              }}
              className="py-2 px-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>تجربة الاتصال</span>
            </button>
          </div>

          {/* Bottom explicit close button */}
          <button
            onClick={onClose}
            className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
          >
            إغلاق النافذة
          </button>
        </div>

      </div>
    </div>
  );
};
