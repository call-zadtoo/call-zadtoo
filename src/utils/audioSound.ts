// Web Audio API Synthesizer for telephone sounds & ringtones

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export class CallSoundPlayer {
  private ringInterval: number | null = null;
  private isRinging = false;

  startRinging() {
    if (this.isRinging) return;
    this.isRinging = true;

    const playOneRing = () => {
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        // Dual frequencies for standard phone ring (440Hz + 480Hz)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gainNode.gain.setValueAtTime(0, now);
        // Fade in
        gainNode.gain.linearRampToValueAtTime(0.12, now + 0.1);
        // Play ring burst for 1.4 seconds
        gainNode.gain.setValueAtTime(0.12, now + 1.4);
        gainNode.gain.linearRampToValueAtTime(0, now + 1.6);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.7);
        osc2.stop(now + 1.7);
      } catch (e) {
        console.warn('AudioContext ring error:', e);
      }
    };

    playOneRing();
    this.ringInterval = window.setInterval(() => {
      if (this.isRinging) {
        playOneRing();
      }
    }, 3000);
  }

  stopRinging() {
    this.isRinging = false;
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }

  playConnectedChime() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.12); // A5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  playHangupTone() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(425, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.setValueAtTime(0, now + 0.18);
      gain.gain.setValueAtTime(0.12, now + 0.28);
      gain.gain.setValueAtTime(0, now + 0.46);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn('Hangup tone error:', e);
    }
  }

  playKeypadBeep(freq = 697) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Beep error:', e);
    }
  }
}

export const callSounds = new CallSoundPlayer();

// Text to speech helper for Arabic voice greeting
export function speakArabic(text: string) {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find(v => v.lang.startsWith('ar') || v.name.includes('Arabic'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }
}
