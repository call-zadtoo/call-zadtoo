export type WidgetPosition = 'bottom-right' | 'bottom-left';
export type WidgetThemeColor = 'orange' | 'emerald' | 'sky' | 'violet';
export type WidgetDisplayMode = 'all_in_one' | 'call_only' | 'whatsapp_only' | 'telegram_only';

export interface MultiChannelConfig {
  id?: string;
  userId?: string;
  brandName: string;
  slug: string;
  
  // Channels
  callEnabled: boolean;
  responderType: 'team' | 'ai' | 'hybrid';
  
  whatsappEnabled: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  isZadWhatsapp: boolean;
  zadWhatsappWebhook?: string;
  
  telegramEnabled: boolean;
  telegramUsername: string;
  
  directPhoneEnabled: boolean;
  directPhoneNumber: string;
  
  emailEnabled: boolean;
  emailAddress: string;

  // Customization
  position: WidgetPosition;
  themeColor: WidgetThemeColor;
  displayMode: WidgetDisplayMode;
  welcomeMessage: string;
  buttonLabel: string;
  showPulseBadge: boolean;
  
  createdAt?: string;
}

export const DEFAULT_WIDGET_CONFIG: MultiChannelConfig = {
  brandName: 'متجري',
  slug: 'my-brand',
  callEnabled: true,
  responderType: 'hybrid',
  whatsappEnabled: true,
  whatsappNumber: '966500000000',
  whatsappMessage: 'مرحباً، أود الاستفسار عن خدماتكم عبر أبوسليم',
  isZadWhatsapp: true,
  telegramEnabled: true,
  telegramUsername: 'zadtoo',
  directPhoneEnabled: true,
  directPhoneNumber: '+966500000000',
  emailEnabled: false,
  emailAddress: 'info@zadtoo.com',
  position: 'bottom-right',
  themeColor: 'orange',
  displayMode: 'all_in_one',
  welcomeMessage: 'مرحباً بك! تواصل معنا مجاناً بالطريقة الأنسب لك',
  buttonLabel: 'تواصل مع أبوسليم',
  showPulseBadge: true,
};
