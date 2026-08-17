/**
 * Multilingual Engine & Language Metadata Dictionary
 */
import { LanguageCode, LanguageInfo, LocalizedString } from '../types';

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
    description: 'Standard English academic & scientific terminology',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'शुद्ध एवं सरल हिन्दी व्याख्या, मानक सूत्रों सहित',
  },
  {
    code: 'hinglish',
    name: 'Smart Hinglish',
    nativeName: 'मिक्स Hinglish',
    flag: '🇮🇳',
    description: 'Hindi explanation with English technical terms (Most popular)',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    description: 'সহজ বাংলা ব্যাখ্যা এবং সূত্রসহ শিক্ষা',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    description: 'सुलभ मराठी स्पष्टीकरण व संकल्पना',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    description: 'સરળ ગુજરાતી સમજૂતી અને વિભાવનાઓ',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    description: 'எளிய தமிழ் விளக்கம் மற்றும் அறிவியல் கருத்துக்கள்',
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    description: 'సులభమైన తెలుగు వివరణ మరియు భావనలు',
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    description: 'ಸರಳ ಕನ್ನಡ ವಿವರಣೆ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ಸೂತ್ರಗಳು',
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    description: 'ലളിതമായ മലയാളം വിശദീകരണങ്ങൾ',
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    description: 'ਸੌਖੀ ਪੰਜਾਬੀ ਵਿਆਖਿਆ ਅਤੇ ਸਿੱਖਣ ਸਮੱਗਰੀ',
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    flag: '🇮🇳',
    description: 'آسان اردو وضاحت اور سائنسی فارمولے',
    isRTL: true,
  },
];

/**
 * Universal text resolver helper:
 * Resolves localized strings safely across languages with fallback chain
 */
export function getLocalizedText(
  item: LocalizedString | string | undefined,
  lang: LanguageCode
): string {
  if (!item) return '';
  if (typeof item === 'string') return item;

  // 1. Direct language match
  if (item[lang]) return item[lang] as string;

  // 2. Hinglish fallback to Hindi or English
  if (lang === 'hinglish') {
    return item.hinglish || item.hi || item.en || '';
  }

  // 3. Regional language fallback to Hindi then English
  return item.hi || item.en || '';
}

/**
 * UI Translations dictionary for common buttons, headers, and badges
 */
export const UI_TRANSLATIONS: Record<string, LocalizedString> = {
  appName: {
    en: 'StudyOS AI',
    hi: 'स्टडीओएस एआई',
    hinglish: 'StudyOS AI',
  },
  tagline: {
    en: 'Adaptive Multilingual Exam Mastery Engine',
    hi: 'हर चैप्टर पर पकड़, हर क्वेश्चन पर मास्टरी, हर एग्जाम में कॉन्फिडेंस',
    hinglish: 'Adaptive Learning & Exam Mastery Platform',
  },
  navDailyMission: {
    en: "Today's Mission",
    hi: 'आज का मिशन',
    hinglish: "Today's Mission",
    bn: 'আজকের মিশন',
    mr: 'आजचे ध्येय',
    gu: 'આજનું મિશન',
    ta: 'இன்றைய பணி',
    te: 'నేటి లక్ష్యం',
  },
  navLearn: {
    en: 'Interactive Learn',
    hi: 'सीखें (इंटरैक्टिव)',
    hinglish: 'Interactive Learn',
    bn: 'শেখা',
    mr: 'शिका',
    gu: 'શીખો',
    ta: 'கற்க',
    te: 'నేర్చుకోండి',
  },
  navPractice: {
    en: 'Adaptive Practice',
    hi: 'सटीक अभ्यास',
    hinglish: 'Adaptive Practice',
    bn: 'অনুশীলন',
    mr: 'सराव',
    gu: 'અભ્યાસ',
    ta: 'பயிற்சி',
    te: 'సాధన',
  },
  navRevision: {
    en: 'Spaced Revision',
    hi: 'स्मार्ट पुनरावृत्ति',
    hinglish: 'Spaced Revision',
    bn: 'রিভিশন',
    mr: 'उजळणी',
    gu: 'પુનરાવર્તન',
    ta: 'மீள்பார்வை',
    te: 'పునశ్చరణ',
  },
  navMockTest: {
    en: 'Mock Exam Simulator',
    hi: 'मॉक टेस्ट सिमुलेटर',
    hinglish: 'Mock Exam Simulator',
    bn: 'মক টেস্ট',
    mr: 'मॉक परीक्षा',
    gu: 'મોક ટેસ્ટ',
    ta: 'மாதிரித் தேர்வு',
    te: 'మాక్ పరీక్ష',
  },
  navExamReadiness: {
    en: 'Exam Readiness',
    hi: 'एग्जाम रेडीनेस',
    hinglish: 'Exam Readiness',
    bn: 'পরীক্ষার প্রস্তুতি',
    mr: 'परीक्षा तयारी',
    gu: 'પરીક્ષા તૈયારી',
    ta: 'தேர்வுத் தயார்நிலை',
    te: 'పరీక్ష సంసిద్ధత',
  },
  navCareer: {
    en: 'Career Roadmap',
    hi: 'करियर रोडमैप',
    hinglish: 'Career Roadmap',
    bn: 'ক্যারিয়ার রোডম্যাপ',
    mr: 'करिअर मार्ग',
    gu: 'કારકિર્દી રોડમેપ',
    ta: 'தொழில் வழிகாட்டி',
    te: 'కెరీర్ రోడ్‌మ్యాప్',
  },
  navStudentDNA: {
    en: 'Learning DNA',
    hi: 'लर्निंग डीएनए',
    hinglish: 'Learning DNA',
    bn: 'লার্নিং ডিএনএ',
    mr: 'लर्निंग डीएनए',
  },
  navParentView: {
    en: 'Parent Insights',
    hi: 'अभिभावक डैशबोर्ड',
    hinglish: 'Parent View',
  },
  explainDifferently: {
    en: 'Explain Differently',
    hi: 'सरल / अलग तरीके से समझें',
    hinglish: 'Explain Differently',
    bn: 'অন্যভাবে বুঝুন',
    mr: 'वेगळ्या पद्धतीने समजावून सांगा',
    gu: 'અલગ રીતે સમજો',
    ta: 'வேறு முறையில் விளக்கு',
    te: 'మరోలా వివరించండి',
  },
  iUnderstand: {
    en: 'I Understand & Continue ➔',
    hi: 'समझ आ गया, आगे बढ़ें ➔',
    hinglish: 'I Understand & Continue ➔',
    bn: 'বুঝেছি, এগিয়ে চলুন ➔',
    mr: 'समजले, पुढे चला ➔',
    gu: 'સમજાઈ ગયું, આગળ વધો ➔',
    ta: 'புரிந்தது, தொடர்க ➔',
    te: 'అర్థమైంది, కొనసాగండి ➔',
  },
  submitAnswer: {
    en: 'Submit Answer',
    hi: 'उत्तर सबमिट करें',
    hinglish: 'Submit Answer',
    bn: 'উত্তর জমা দিন',
    mr: 'उत्तर सबमिट करा',
    gu: 'જવાબ સબમિટ કરો',
    ta: 'சமர்ப்பிக்கவும்',
    te: 'సమర్పించండి',
  },
  nextQuestion: {
    en: 'Next Question ➔',
    hi: 'अगला प्रश्न ➔',
    hinglish: 'Next Question ➔',
    bn: 'পরবর্তী প্রশ্ন ➔',
    mr: 'पुढील प्रश्न ➔',
    gu: 'આગળનો પ્રશ્ન ➔',
    ta: 'அடுத்த கேள்வி ➔',
    te: 'తర్వాతి ప్రశ్న ➔',
  },
  listenAudio: {
    en: 'Listen',
    hi: 'सुनें (ऑडियो)',
    hinglish: 'Listen Audio',
    bn: 'শুনুন',
    mr: 'ऐका',
    gu: 'સાંભળો',
    ta: 'கேட்க',
    te: 'వినండి',
  },
  whyThisQuestion: {
    en: 'Why am I getting this question?',
    hi: 'मुझे यह प्रश्न क्यों मिला?',
    hinglish: 'Why am I getting this question?',
    bn: 'কেন এই প্রশ্নটি পেলাম?',
    mr: 'मला हा प्रश्न का आला?',
  },
  showHint1: {
    en: '💡 Show Hint 1',
    hi: '💡 संकेत 1 देखें',
    hinglish: '💡 Show Hint 1',
  },
  showHint2: {
    en: '💡 Formula Clue',
    hi: '💡 सूत्र संकेत',
    hinglish: '💡 Formula Clue',
  },
  guidedReasoning: {
    en: '🧠 Guided Step-by-Step',
    hi: '🧠 स्टेप-बाय-स्टेप मार्गदर्शन',
    hinglish: '🧠 Step-by-Step Logic',
  },
  confidencePrompt: {
    en: 'How confident were you in this answer?',
    hi: 'इस उत्तर को लेकर आपका आत्मविश्वास कैसा था?',
    hinglish: 'Aap is answer me kitne confident the?',
  },
  confGuess: {
    en: '😕 Guess (Low Weight)',
    hi: '😕 तुक्का / Guess',
    hinglish: '😕 Guess kiya',
  },
  confSomewhat: {
    en: '😐 Somewhat Confident',
    hi: '😐 थोड़ा आत्मविश्वास',
    hinglish: '😐 Thoda confident',
  },
  confConfident: {
    en: '🙂 Confident',
    hi: '🙂 पूरा विश्वास',
    hinglish: '🙂 Confident',
  },
  confVeryConfident: {
    en: '🔥 Very Confident',
    hi: '🔥 100% पक्का पता था',
    hinglish: '🔥 100% Sure',
  },
  whatNotToStudy: {
    en: 'What NOT to Study Today',
    hi: 'आज क्या नहीं पढ़ना है (समय बचाएं)',
    hinglish: 'What NOT to study today',
  },
  aiTutorTitle: {
    en: 'StudyOS AI Socratic Tutor',
    hi: 'स्टडीओएस एआई पर्सनल ट्यूटर',
    hinglish: 'AI Socratic Coach',
  },
};
