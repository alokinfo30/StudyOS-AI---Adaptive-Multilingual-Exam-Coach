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
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  try {
    if (typeof window.speechSynthesis?.getVoices === 'function') {
      cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        try {
          cachedVoices = window.speechSynthesis.getVoices();
        } catch {
          // ignore
        }
      };
    }
  } catch (e) {
    console.warn('Could not initialize voices listener', e);
  }
}

/**
 * Checks whether the browser's Web Speech API SpeechSynthesis is available offline.
 * Crucially verifies that SpeechSynthesisUtterance is constructible to prevent "TypeError: Illegal constructor".
 */
export function isWebSpeechSupported(): boolean {
  if (
    typeof window === 'undefined' ||
    !('speechSynthesis' in window) ||
    typeof window.SpeechSynthesisUtterance === 'undefined'
  ) {
    return false;
  }

  try {
    // Defensive verification: ensure SpeechSynthesisUtterance can actually be instantiated
    // In restricted sandbox/iframe environments, calling `new SpeechSynthesisUtterance()` can throw "TypeError: Illegal constructor"
    const UtteranceConstructor = window.SpeechSynthesisUtterance;
    if (typeof UtteranceConstructor !== 'function') return false;
    const testUtterance = new UtteranceConstructor('');
    return Boolean(testUtterance);
  } catch {
    return false;
  }
}

/**
 * Returns currently available local/browser speech synthesis voices.
 */
export function getWebSpeechVoices(): SpeechSynthesisVoice[] {
  if (!isWebSpeechSupported()) return [];
  try {
    if (cachedVoices.length === 0 && typeof window.speechSynthesis?.getVoices === 'function') {
      cachedVoices = window.speechSynthesis.getVoices();
    }
  } catch {
    return [];
  }
  return cachedVoices;
}

/**
 * Diagnostics for Web Speech API offline synthesis for a particular language
 */
export function getWebSpeechDiagnostics(langCode: LanguageCode): {
  isSupported: boolean;
  voicesCount: number;
  matchingVoice: SpeechSynthesisVoice | null;
  targetBcp47: string;
  isOfflineCapable: boolean;
} {
  const supported = isWebSpeechSupported();
  if (!supported) {
    return {
      isSupported: false,
      voicesCount: 0,
      matchingVoice: null,
      targetBcp47: 'en-IN',
      isOfflineCapable: false,
    };
  }

  const targetBcp47 = LANG_TO_BCP47[langCode] || 'en-IN';
  const voices = getWebSpeechVoices();
  const matchedVoice = voices.find(
    (v) =>
      v.lang === targetBcp47 ||
      v.lang.replace('_', '-').toLowerCase() === targetBcp47.toLowerCase() ||
      (targetBcp47.startsWith('hi') && v.lang.includes('hi')) ||
      (targetBcp47.startsWith('en') && (v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.lang.includes('en')))
  ) || null;

  return {
    isSupported: true,
    voicesCount: voices.length,
    matchingVoice: matchedVoice,
    targetBcp47,
    isOfflineCapable: true,
  };
}

/**
 * Multilingual sample test phrases for speech synthesis verification
 */
export function getLanguageSampleText(langCode: LanguageCode): string {
  switch (langCode) {
    case 'hi':
      return 'नमस्ते! स्टडी ओएस में आपका स्वागत है। ओम का नियम कहता है कि विभवांतर, धारा के समानुपाती होता है।';
    case 'hinglish':
      return 'Hello! Ohm ka law kehta hai ki potential difference, current ke directly proportional hota hai. V equals I into R.';
    case 'bn':
      return 'নমস্কার! ওহমের সূত্র বলে যে বিভব পার্থক্য তড়িৎ প্রবাহের সমানুপাতিক। ভি সমান আই গুণ আর।';
    case 'mr':
      return 'नमस्कार! ओहमच्या नियमानुसार विभवांतर हे विद्युत प्रवाहाच्या थेट प्रमाणात असते. व्ही बरोबर आय गुणिले आर.';
    case 'gu':
      return 'નમસ્તે! ઓહ્મનો નિયમ જણાવે છે કે વિદ્યુત સ્થિતિમાનનો તફાવત વિદ્યુત પ્રવાહના સમપ્રમાણમાં હોય છે.';
    case 'ta':
      return 'வணக்கம்! ஓம் விதிப்படி மின்னழுத்த வேறுபாடு மின்னோட்டத்திற்கு நேர்விகிதத்தில் இருக்கும்.';
    case 'te':
      return 'నమస్కారం! ఓమ్ నియమం ప్రకారం పొటెన్షియల్ తేడా విద్యుత్ ప్రవాహానికి అనులోమానుపాతంలో ఉంటుంది.';
    case 'kn':
      return 'ನಮಸ್ಕಾರ! ಓಮ್‌ನ ನಿಯಮದ ಪ್ರಕಾರ ವಿಭವ ವ್ಯತ್ಯಾಸವು ವಿದ್ಯುತ್ ಪ್ರವಾಹಕ್ಕೆ ನೇರ ಅನುಪಾತದಲ್ಲಿರುತ್ತದೆ.';
    case 'ml':
      return 'നമസ്കാരം! ഓം നിയമം അനുസരിച്ച് പൊട്ടൻഷ്യൽ വ്യത്യാസം വൈദ്യുത പ്രവാഹത്തിന് നേർ അനുപാതത്തിലാണ്.';
    case 'pa':
      return 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਓਹਮ ਦੇ ਨਿਯਮ ਅਨੁਸਾਰ ਪੋਟੈਂਸ਼ੀਅਲ ਅੰਤਰ ਕਰੰਟ ਦੇ ਸਿੱਧੇ ਅਨੁਪਾਤੀ ਹੁੰਦਾ ਹੈ।';
    case 'ur':
      return 'آداب! اوہم کے قانون کے مطابق پوٹینشل کا فرق کرنٹ کے براہ راست متناسب ہوتا ہے۔';
    case 'en':
    default:
      return 'Hello! Welcome to StudyOS. Ohm\'s law states that potential difference is directly proportional to electric current. V equals I times R.';
  }
}

// Local storage key for offline TTS toggle
export const OFFLINE_TTS_STORAGE_KEY = 'studyos_offline_tts_lessons_enabled';
export const OFFLINE_TTS_SPEED_KEY = 'studyos_offline_tts_speed';
export const OFFLINE_TTS_AUTOPLAY_KEY = 'studyos_offline_tts_autoplay';

export function isOfflineTTSLessonsGloballyEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(OFFLINE_TTS_STORAGE_KEY);
    if (val === null) return true; // Enabled by default
    return val === 'true';
  } catch {
    return true;
  }
}

export function setOfflineTTSLessonsGloballyEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_TTS_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save offline TTS preference', e);
  }
}

export function getOfflineTTSSpeechRate(): number {
  if (typeof window === 'undefined') return 1.0;
  try {
    const val = localStorage.getItem(OFFLINE_TTS_SPEED_KEY);
    if (val) {
      const num = parseFloat(val);
      if (!isNaN(num) && num >= 0.7 && num <= 1.5) return num;
    }
  } catch {
    // fallback
  }
  return 1.0;
}

export function setOfflineTTSSpeechRate(rate: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_TTS_SPEED_KEY, rate.toString());
  } catch (e) {
    console.warn('Failed to save speech rate', e);
  }
}

export function getOfflineTTSAutoPlay(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(OFFLINE_TTS_AUTOPLAY_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOfflineTTSAutoPlay(autoPlay: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(OFFLINE_TTS_AUTOPLAY_KEY, autoPlay ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save autoplay preference', e);
  }
}

export function speakText(
  text: string,
  langCode: LanguageCode,
  rateOrOnEnd?: number | (() => void),
  onEnd?: () => void,
  onError?: () => void
): boolean {
  if (!isWebSpeechSupported()) {
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

  try {
    const UtteranceConstructor = window.SpeechSynthesisUtterance;
    if (typeof UtteranceConstructor !== 'function') {
      if (effectiveOnError) effectiveOnError();
      return false;
    }

    const utterance = new UtteranceConstructor(clean);
    utterance.rate = Math.max(0.7, Math.min(1.5, effectiveRate));
    utterance.pitch = 1.0;

    const targetBcp47 = LANG_TO_BCP47[langCode] || 'en-IN';
    utterance.lang = targetBcp47;

    // Try to find the best matched regional voice
    const voices = getWebSpeechVoices();
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
  } catch (err) {
    console.warn('Speech synthesis utterance execution failed safely:', err);
    activeUtterance = null;
    if (effectiveOnError) effectiveOnError();
    return false;
  }
}

export function pauseSpeaking(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  } catch {
    // ignore
  }
}

export function resumeSpeaking(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  } catch {
    // ignore
  }
}

export function stopSpeaking(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  } finally {
    activeUtterance = null;
  }
}

export function isSpeaking(): boolean {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return Boolean(window.speechSynthesis.speaking);
  } catch {
    return false;
  }
}
