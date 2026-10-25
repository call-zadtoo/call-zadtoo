export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export interface InteractiveWidget {
  id: string;
  type: 'yes_no' | 'text_input' | 'options' | 'pricing' | 'payment_link' | 'info_card';
  title: string;
  description?: string;
  options?: string[];
  fields?: { name: string; placeholder: string; label: string }[];
  price?: { amount: string; currency: string; planName: string };
  linkUrl?: string;
  linkLabel?: string;
  submitted?: boolean;
  response?: string | Record<string, string>;
  timestamp: string;
}

export interface CallLog {
  id: string;
  callerName: string;
  callerSource: string;
  startTime: string;
  durationSeconds: number;
  status: 'completed' | 'missed' | 'transferred';
  agentName: string;
  department: string;
  gatheredData?: Record<string, string>;
  interactiveResponses?: {
    question: string;
    answer: string;
  }[];
  recordingUrl?: string;
  notes?: string;
}
