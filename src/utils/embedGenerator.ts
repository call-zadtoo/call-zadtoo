import { MultiChannelConfig } from '../types/widget';

export function getCleanPhoneNumber(num: string): string {
  return num.replace(/[^0-9]/g, '');
}

export function getCleanTelegramUser(username: string): string {
  return username.replace(/^@/, '').trim();
}

export function generateDirectLinks(config: MultiChannelConfig) {
  const callUrl = config.slug ? `https://call.zadtoo.com/${config.slug}` : `https://call.zadtoo.com`;
  
  const cleanPhone = getCleanPhoneNumber(config.whatsappNumber);
  const encodedMsg = encodeURIComponent(config.whatsappMessage || 'مرحباً، أود التواصل معكم');
  const whatsappUrl = `https://wa.me/${cleanPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
  
  const cleanTele = getCleanTelegramUser(config.telegramUsername);
  const telegramUrl = `https://t.me/${cleanTele}`;
  
  const cleanDirect = config.directPhoneNumber.replace(/\s+/g, '');
  const phoneUrl = `tel:${cleanDirect}`;

  return {
    callUrl,
    whatsappUrl,
    telegramUrl,
    phoneUrl,
  };
}

/**
 * Universal JavaScript snippet that mounts a responsive floating multi-channel widget
 */
export function generateUniversalJsEmbed(config: MultiChannelConfig): string {
  const links = generateDirectLinks(config);
  const isRight = config.position === 'bottom-right';
  const posCss = isRight ? 'right: 24px;' : 'left: 24px;';
  
  // Theme colors
  const colorMap: Record<string, { bg: string; hover: string; shadow: string }> = {
    orange: { bg: '#ea580c', hover: '#f97316', shadow: 'rgba(234, 88, 12, 0.4)' },
    emerald: { bg: '#059669', hover: '#10b981', shadow: 'rgba(5, 150, 105, 0.4)' },
    sky: { bg: '#0284c7', hover: '#38bdf8', shadow: 'rgba(2, 132, 199, 0.4)' },
    violet: { bg: '#7c3aed', hover: '#8b5cf6', shadow: 'rgba(124, 58, 237, 0.4)' },
  };

  const theme = colorMap[config.themeColor] || colorMap.orange;

  return `<!-- بداية كود أبوسليم (ABUSALIM) للتواصل المتعدد المجاني -->
<script>
(function() {
  if (window.AbusalimWidgetLoaded) return;
  window.AbusalimWidgetLoaded = true;

  var config = {
    brandName: "${config.brandName.replace(/"/g, '\\"')}",
    callUrl: "${links.callUrl}",
    whatsappUrl: "${links.whatsappUrl}",
    telegramUrl: "${links.telegramUrl}",
    phoneUrl: "${links.phoneUrl}",
    callEnabled: ${config.callEnabled},
    whatsappEnabled: ${config.whatsappEnabled},
    telegramEnabled: ${config.telegramEnabled},
    directPhoneEnabled: ${config.directPhoneEnabled},
    isZadWhatsapp: ${config.isZadWhatsapp},
    welcomeMessage: "${(config.welcomeMessage || '').replace(/"/g, '\\"')}",
    buttonLabel: "${(config.buttonLabel || 'تواصل معنا').replace(/"/g, '\\"')}",
    position: "${config.position}",
    displayMode: "${config.displayMode}"
  };

  var container = document.createElement('div');
  container.id = 'abusalim-floating-suite';
  container.setAttribute('dir', 'rtl');
  container.style.cssText = 'position:fixed; bottom:24px; ${posCss} z-index:999999; font-family:system-ui,-apple-system,sans-serif; text-align:right;';

  var style = document.createElement('style');
  style.innerHTML = \`
    #abusalim-floating-suite * { box-sizing: border-box; margin:0; padding:0; }
    .abusalim-btn {
      display: flex; align-items: center; gap: 10px;
      background: linear-gradient(135deg, ${theme.bg}, ${theme.hover});
      color: #ffffff; padding: 12px 18px; border-radius: 9999px;
      box-shadow: 0 10px 25px -5px ${theme.shadow}, 0 8px 10px -6px rgba(0,0,0,0.1);
      cursor: pointer; border: 1px solid rgba(255,255,255,0.25);
      font-size: 14px; font-weight: 700; transition: all 0.25s ease;
      user-select: none; text-decoration: none;
    }
    .abusalim-btn:hover { transform: translateY(-3px) scale(1.02); filter: brightness(1.08); }
    .abusalim-badge {
      position: absolute; top: -3px; right: -3px;
      width: 12px; height: 12px; background: #10b981;
      border: 2px solid #ffffff; border-radius: 50%;
      animation: abusalim-pulse 2s infinite;
    }
    .abusalim-menu {
      display: none; position: absolute; bottom: 65px; ${isRight ? 'right: 0;' : 'left: 0;'}
      width: 310px; background: #0f172a; border: 1px solid #334155;
      border-radius: 20px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.6);
      overflow: hidden; padding: 14px; flex-direction: column; gap: 10px;
      animation: abusalim-fade-up 0.25s ease;
    }
    .abusalim-menu.open { display: flex; }
    .abusalim-header {
      padding-bottom: 8px; border-bottom: 1px solid #1e293b;
      color: #94a3b8; font-size: 12px; line-height: 1.4;
    }
    .abusalim-brand { color: #ffffff; font-weight: 800; font-size: 14px; display: block; margin-bottom: 2px; }
    .abusalim-channel-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 12px; border-radius: 12px; text-decoration: none;
      transition: all 0.2s ease; border: 1px solid transparent;
    }
    .abusalim-channel-item:hover { transform: translateX(-4px); }
    .abusalim-channel-call { background: rgba(234, 88, 12, 0.12); border-color: rgba(234, 88, 12, 0.3); color: #fdba74; }
    .abusalim-channel-call:hover { background: rgba(234, 88, 12, 0.22); }
    .abusalim-channel-wa { background: rgba(16, 185, 129, 0.12); border-color: rgba(16, 185, 129, 0.3); color: #6ee7b7; }
    .abusalim-channel-wa:hover { background: rgba(16, 185, 129, 0.22); }
    .abusalim-channel-tg { background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.3); color: #7dd3fc; }
    .abusalim-channel-tg:hover { background: rgba(56, 189, 248, 0.22); }
    .abusalim-channel-phone { background: rgba(148, 163, 184, 0.12); border-color: rgba(148, 163, 184, 0.3); color: #cbd5e1; }
    .abusalim-channel-phone:hover { background: rgba(148, 163, 184, 0.22); }
    .abusalim-icon-box {
      width: 34px; height: 34px; border-radius: 10px; display: flex;
      align-items: center; justify-content: center; font-size: 18px; shrink: 0;
    }
    .abusalim-info { flex: 1; margin-right: 10px; }
    .abusalim-title { font-size: 13px; font-weight: 700; }
    .abusalim-sub { font-size: 11px; opacity: 0.8; }
    @keyframes abusalim-pulse { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }
    @keyframes abusalim-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  \`;
  document.head.appendChild(style);

  // If single standalone mode
  if (config.displayMode === 'whatsapp_only') {
    container.innerHTML = '<a href="' + config.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-btn" style="background:#25D366; box-shadow:0 10px 25px -5px rgba(37,211,102,0.4);"><span class="abusalim-badge"></span><span style="font-size:18px;">💬</span><span>واتساب ' + (config.isZadWhatsapp ? 'زاد' : '') + '</span></a>';
    document.body.appendChild(container);
    return;
  }

  if (config.displayMode === 'telegram_only') {
    container.innerHTML = '<a href="' + config.telegramUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-btn" style="background:#0088cc; box-shadow:0 10px 25px -5px rgba(0,136,204,0.4);"><span class="abusalim-badge"></span><span style="font-size:18px;">✈️</span><span>دردشة تلجرام</span></a>';
    document.body.appendChild(container);
    return;
  }

  if (config.displayMode === 'call_only') {
    container.innerHTML = '<a href="' + config.callUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-btn"><span class="abusalim-badge"></span><span style="font-size:18px;">📞</span><span>اتصال صوتي مجاني</span></a>';
    document.body.appendChild(container);
    return;
  }

  // All-in-one Multi-Channel Menu
  var menuHtml = '<div class="abusalim-menu" id="abusalim-menu">';
  menuHtml += '<div class="abusalim-header">';
  menuHtml += '<span class="abusalim-brand">' + config.brandName + '</span>';
  menuHtml += '<span>' + config.welcomeMessage + '</span>';
  menuHtml += '</div>';

  if (config.callEnabled) {
    menuHtml += '<a href="' + config.callUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-channel-item abusalim-channel-call">';
    menuHtml += '<div class="abusalim-icon-box">📞</div>';
    menuHtml += '<div class="abusalim-info"><div class="abusalim-title">مكالمة صوتية مجانية</div><div class="abusalim-sub">تحدث مباشرة من المتصفح عبر أبوسليم</div></div>';
    menuHtml += '<span style="font-size:12px; font-weight:800; background:rgba(234,88,12,0.2); padding:3px 8px; border-radius:6px;">مجاناً</span>';
    menuHtml += '</a>';
  }

  if (config.whatsappEnabled) {
    menuHtml += '<a href="' + config.whatsappUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-channel-item abusalim-channel-wa">';
    menuHtml += '<div class="abusalim-icon-box">💬</div>';
    menuHtml += '<div class="abusalim-info"><div class="abusalim-title">' + (config.isZadWhatsapp ? 'واتساب زاد الفوري' : 'واتساب مباشر') + '</div><div class="abusalim-sub">دردشة سريعة مع خدمة العملاء</div></div>';
    menuHtml += '<span style="font-size:14px;">←</span>';
    menuHtml += '</a>';
  }

  if (config.telegramEnabled) {
    menuHtml += '<a href="' + config.telegramUrl + '" target="_blank" rel="noopener noreferrer" class="abusalim-channel-item abusalim-channel-tg">';
    menuHtml += '<div class="abusalim-icon-box">✈️</div>';
    menuHtml += '<div class="abusalim-info"><div class="abusalim-title">دردشة تلجرام</div><div class="abusalim-sub">فتح المحادثة الفورية بلمسة واحدة</div></div>';
    menuHtml += '<span style="font-size:14px;">←</span>';
    menuHtml += '</a>';
  }

  if (config.directPhoneEnabled) {
    menuHtml += '<a href="' + config.phoneUrl + '" class="abusalim-channel-item abusalim-channel-phone">';
    menuHtml += '<div class="abusalim-icon-box">📱</div>';
    menuHtml += '<div class="abusalim-info"><div class="abusalim-title">اتصال هاتفي مباشر</div><div class="abusalim-sub">تحويل لمسؤول خدمة العملاء</div></div>';
    menuHtml += '<span style="font-size:14px;">←</span>';
    menuHtml += '</a>';
  }

  menuHtml += '<div style="text-align:center; padding-top:6px; font-size:10px; color:#64748b; border-top:1px solid #1e293b;">مدعوم بتقنية أبوسليم ABUSALIM مجاناً 100%</div>';
  menuHtml += '</div>';

  var buttonHtml = '<div class="abusalim-btn" id="abusalim-main-toggle" role="button" tabindex="0">';
  buttonHtml += '<span class="abusalim-badge"></span>';
  buttonHtml += '<span style="font-size:18px;">✨</span>';
  buttonHtml += '<span>' + config.buttonLabel + '</span>';
  buttonHtml += '</div>';

  container.innerHTML = menuHtml + buttonHtml;
  document.body.appendChild(container);

  var toggleBtn = document.getElementById('abusalim-main-toggle');
  var menu = document.getElementById('abusalim-menu');
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    document.addEventListener('click', function(e) {
      if (!container.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }
})();
</script>
<!-- نهاية كود أبوسليم للتواصل -->`;
}

/**
 * Dedicated Abusalim Voice Call Floating Button Embed Code (Standalone)
 */
export function generateAbusalimCallOnlyEmbed(
  slug: string,
  brandName: string = 'أبوسليم',
  position: 'bottom-right' | 'bottom-left' = 'bottom-right',
  themeColor: string = 'orange',
  buttonLabel: string = 'اتصال صوتي مجاني'
): string {
  const callUrl = slug ? `https://call.zadtoo.com/${slug}` : `https://call.zadtoo.com`;
  const posCss = position === 'bottom-right' ? 'right: 24px;' : 'left: 24px;';
  
  const colorMap: Record<string, { bg: string; hover: string; shadow: string }> = {
    orange: { bg: '#ea580c', hover: '#f97316', shadow: 'rgba(234, 88, 12, 0.45)' },
    emerald: { bg: '#059669', hover: '#10b981', shadow: 'rgba(5, 150, 105, 0.45)' },
    sky: { bg: '#0284c7', hover: '#38bdf8', shadow: 'rgba(2, 132, 199, 0.45)' },
    violet: { bg: '#7c3aed', hover: '#8b5cf6', shadow: 'rgba(124, 58, 237, 0.45)' },
  };

  const theme = colorMap[themeColor] || colorMap.orange;

  return `<!-- كود زر مكالمات أبوسليم الصوتية المجاني المستقل -->
<script>
(function() {
  if (document.getElementById('abusalim-call-float')) return;
  var btn = document.createElement('a');
  btn.id = 'abusalim-call-float';
  btn.href = '${callUrl}';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.title = '${brandName} - مكالمة صوتية مجانية';
  btn.style.cssText = 'position:fixed; bottom:24px; ${posCss} z-index:999999; display:inline-flex; align-items:center; gap:10px; padding:12px 20px; background:linear-gradient(135deg, ${theme.bg}, ${theme.hover}); color:#ffffff; border-radius:9999px; box-shadow:0 10px 25px ${theme.shadow}; cursor:pointer; text-decoration:none; font-family:system-ui,-apple-system,sans-serif; font-size:14px; font-weight:700; transition:all 0.25s ease; border:1px solid rgba(255,255,255,0.25);';
  btn.setAttribute('dir', 'rtl');
  btn.onmouseover = function() { btn.style.transform = 'translateY(-3px) scale(1.03)'; };
  btn.onmouseout = function() { btn.style.transform = 'translateY(0) scale(1)'; };
  btn.innerHTML = '<span style="width:10px; height:10px; background:#10b981; border:2px solid #ffffff; border-radius:50%; display:inline-block; animation:abusalim-pulse 1.8s infinite;"></span>' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>' +
    '<span>${buttonLabel}</span>';

  var style = document.createElement('style');
  style.innerHTML = '@keyframes abusalim-pulse { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.7); } 70% { box-shadow: 0 0 0 7px rgba(16,185,129,0); } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); } }';
  document.head.appendChild(style);
  document.body.appendChild(btn);
})();
</script>`;
}

/**
 * Dedicated Telegram-only Floating Button Embed Code
 */
export function generateTelegramOnlyEmbed(username: string, position: 'bottom-right' | 'bottom-left' = 'bottom-right'): string {
  const cleanTele = getCleanTelegramUser(username);
  const posCss = position === 'bottom-right' ? 'right: 24px;' : 'left: 24px;';
  
  return `<!-- كود زر التلجرام العائم المجاني من أبوسليم -->
<script>
(function() {
  if (document.getElementById('abusalim-telegram-float')) return;
  var btn = document.createElement('a');
  btn.id = 'abusalim-telegram-float';
  btn.href = 'https://t.me/${cleanTele}';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.title = 'تواصل معنا عبر تلجرام';
  btn.style.cssText = 'position:fixed; bottom:24px; ${posCss} z-index:999999; display:flex; align-items:center; justify-content:center; width:56px; height:56px; background:#0088cc; border-radius:50%; box-shadow:0 10px 25px rgba(0,136,204,0.45); cursor:pointer; text-decoration:none; transition:transform 0.2s ease;';
  btn.onmouseover = function() { btn.style.transform = 'scale(1.1)'; };
  btn.onmouseout = function() { btn.style.transform = 'scale(1)'; };
  btn.innerHTML = '<svg width="30" height="30" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.17 3.35-1.37 3.73-1.38.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/></svg>';
  document.body.appendChild(btn);
})();
</script>`;
}

/**
 * Dedicated WhatsApp / Zad WhatsApp Floating Button Embed Code
 */
export function generateWhatsAppOnlyEmbed(phone: string, defaultMessage: string = 'مرحباً، أود التواصل معكم', isZadWhatsapp: boolean = true, position: 'bottom-right' | 'bottom-left' = 'bottom-right'): string {
  const cleanPhone = getCleanPhoneNumber(phone);
  const encodedMsg = encodeURIComponent(defaultMessage);
  const posCss = position === 'bottom-right' ? 'right: 24px;' : 'left: 24px;';
  
  return `<!-- كود زر الواتساب ${isZadWhatsapp ? '(واتساب زاد)' : ''} العائم المجاني من أبوسليم -->
<script>
(function() {
  if (document.getElementById('abusalim-whatsapp-float')) return;
  var btn = document.createElement('a');
  btn.id = 'abusalim-whatsapp-float';
  btn.href = 'https://wa.me/${cleanPhone}?text=${encodedMsg}';
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.title = '${isZadWhatsapp ? 'تواصل عبر واتساب زاد' : 'تواصل عبر واتساب'}';
  btn.style.cssText = 'position:fixed; bottom:24px; ${posCss} z-index:999999; display:flex; align-items:center; justify-content:center; width:56px; height:56px; background:#25D366; border-radius:50%; box-shadow:0 10px 25px rgba(37,211,102,0.45); cursor:pointer; text-decoration:none; transition:transform 0.2s ease;';
  btn.onmouseover = function() { btn.style.transform = 'scale(1.1)'; };
  btn.onmouseout = function() { btn.style.transform = 'scale(1)'; };
  btn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="#ffffff"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/></svg>';
  document.body.appendChild(btn);
})();
</script>`;
}

/**
 * HTML Button Embed
 */
export function generateHtmlButtonsEmbed(config: MultiChannelConfig): string {
  const links = generateDirectLinks(config);
  return `<div style="display:flex; flex-wrap:wrap; gap:10px; align-items:center; font-family:sans-serif;" dir="rtl">
  <a href="${links.callUrl}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:#ea580c; color:#fff; padding:10px 18px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:13px;">
    <span>📞</span>
    <span>اتصل مجاناً عبر أبوسليم</span>
  </a>
  <a href="${links.whatsappUrl}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:#25D366; color:#fff; padding:10px 18px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:13px;">
    <span>💬</span>
    <span>واتساب ${config.isZadWhatsapp ? 'زاد' : ''}</span>
  </a>
  <a href="${links.telegramUrl}" target="_blank" style="display:inline-flex; align-items:center; gap:8px; background:#0088cc; color:#fff; padding:10px 18px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:13px;">
    <span>✈️</span>
    <span>محادثة تلجرام</span>
  </a>
</div>`;
}
