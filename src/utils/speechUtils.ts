/**
 * Multilingual Speech Synthesis & Universal TTS Engine for StudyOS.AI
 * Supports Indian multilingual pronunciations and speed calibration
 */
import { LanguageCode } from '../types';

const LANG_TO_BCP47: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  hinglish: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  gu: 'gu-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  pa: 'pa-IN',
  ur: 'ur-IN',
};

export function detectBrowserLanguage(fallback: LanguageCode = 'hi'): LanguageCode {
  if (typeof navigator === 'undefined') return fallback;
  const navLangs = navigator.languages || [navigator.language || ''];
  for (const raw of navLangs) {
    const code = raw.toLowerCase();
    if (code.startsWith('hi')) return 'hi';
    if (code.startsWith('bn')) return 'bn';
    if (code.startsWith('mr')) return 'mr';
    if (code.startsWith('gu')) return 'gu';
    if (code.startsWith('ta')) return 'ta';
    if (code.startsWith('te')) return 'te';
    if (code.startsWith('kn')) return 'kn';
    if (code.startsWith('ml')) return 'ml';
    if (code.startsWith('pa')) return 'pa';
    if (code.startsWith('ur')) return 'ur';
    if (code.startsWith('en')) return 'en';
  }
  return fallback;
}

export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/```[\s\S]*?```/g, 'Code snippet omitted for audio narration.')
    .replace(/[#*`_~]/g, '')
    .replace(/\\cdot/g, ' multiplied by ')
    .replace(/\\times/g, ' multiplied by ')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1 divided by $2')
    .replace(/\\sqrt\{([^}]+)\}/g, 'square root of $1')
    .replace(/\\Omega/g, ' ohms')
    .replace(/\\mu/g, ' micro ')
    .replace(/\\alpha/g, ' alpha ')
    .replace(/\\beta/g, ' beta ')
    .replace(/\\theta/g, ' theta ')
    .replace(/\\pi/g, ' pi ')
    .replace(/\\varepsilon_0/g, ' epsilon naught ')
    .replace(/\\propto/g, ' is directly proportional to ')
    .replace(/\\approx/g, ' approximately equals ')
    .replace(/\\to/g, ' tends to ')
    .replace(/\\ge/g, ' greater than or equal to ')
    .replace(/\\le/g, ' less than or equal to ')
    .replace(/[$]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  langCode: LanguageCode,
  rateOrOnEnd?: number | (() => void),
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  stopSpeaking(); // stop any ongoing speech

  const clean = cleanTextForSpeech(text);
  if (!clean) return false;

  let effectiveRate = 0.95;
  let effectiveOnEnd = onEnd;
  let effectiveOnError = onError;

  if (typeof rateOrOnEnd === 'function') {
    effectiveOnEnd = rateOrOnEnd;
  } else if (typeof rateOrOnEnd === 'number') {
    effectiveRate = rateOrOnEnd;
  }

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = Math.max(0.7, Math.min(1.5, effectiveRate));
  utterance.pitch = 1.0;

  const targetBcp47 = LANG_TO_BCP47[langCode] || 'en-IN';
  utterance.lang = targetBcp47;

  // Try to find the best matched regional voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang === targetBcp47 ||
      v.lang.replace('_', '-').toLowerCase() === targetBcp47.toLowerCase() ||
      (targetBcp47.startsWith('hi') && v.lang.includes('hi')) ||
      (targetBcp47.startsWith('en') && (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en')))
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    activeUtterance = null;
    if (effectiveOnEnd) effectiveOnEnd();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    activeUtterance = null;
    if (effectiveOnError) effectiveOnError();
  };

  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function pauseSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}
