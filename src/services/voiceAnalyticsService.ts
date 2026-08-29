/**
 * StudyOS AI - Voice Performance & Tone Analytics Service
 * Evaluates speech rate (WPM), confidence index, hesitation markers, and vocal clarity
 */
import { VoicePerformanceMetrics } from '../types';

const FILLER_WORDS = [
  'um',
  'umm',
  'uh',
  'uhh',
  'er',
  'err',
  'ah',
  'like',
  'you know',
  'i mean',
  'actually',
  'basically',
  'sort of',
  'kind of',
  'maybe',
  'i think',
  'probably',
  'matlab',
  'shayad',
  'shyd',
  'toh',
  'woh',
  'aisa',
];

/**
 * Analyzes spoken text and audio/duration parameters to generate vocal performance analytics
 */
export function analyzeVoicePerformance(
  spokenText: string,
  durationSeconds: number
): VoicePerformanceMetrics {
  const cleanText = spokenText.trim().toLowerCase();
  const rawWords = cleanText.split(/\s+/).filter(Boolean);
  const totalWords = rawWords.length;

  const validDurationSec = Math.max(durationSeconds, 2); // Avoid division by zero
  const durationMin = validDurationSec / 60;
  const wpm = Math.round(totalWords / durationMin);

  // 1. Pacing rating
  let pacingRating: 'too_slow' | 'ideal' | 'too_fast' = 'ideal';
  if (wpm < 100) pacingRating = 'too_slow';
  else if (wpm > 160) pacingRating = 'too_fast';

  // 2. Filler words & Hesitation detection
  const detectedFillers: string[] = [];
  let hesitationCount = 0;

  FILLER_WORDS.forEach((filler) => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = cleanText.match(regex);
    if (matches && matches.length > 0) {
      hesitationCount += matches.length;
      detectedFillers.push(`${filler} (${matches.length}x)`);
    }
  });

  // 3. Confidence Score (0 - 100)
  // Penalize for high filler density & very slow or rushed speech
  const fillerRatio = totalWords > 0 ? hesitationCount / totalWords : 0;
  let rawConfidence = 90 - fillerRatio * 150;

  // Bonus for clear assertion keywords
  const assertiveKeywords = [
    'because',
    'therefore',
    'proportional',
    'formula',
    'equals',
    'law',
    'constant',
    'increases',
    'decreases',
    'derived',
    'defined',
    'circuit',
    'voltage',
    'current',
    'resistance',
  ];
  let assertiveMatches = 0;
  assertiveKeywords.forEach((kw) => {
    if (cleanText.includes(kw)) assertiveMatches++;
  });
  rawConfidence += Math.min(assertiveMatches * 2.5, 15);

  if (pacingRating === 'ideal') rawConfidence += 5;
  else rawConfidence -= 8;

  const confidenceScore = Math.min(Math.max(Math.round(rawConfidence), 42), 98);

  // 4. Clarity Score (0 - 100)
  const averageWordLength =
    totalWords > 0 ? rawWords.reduce((acc, w) => acc + w.length, 0) / totalWords : 0;
  let rawClarity = 75 + Math.min(averageWordLength * 3, 15) - Math.min(hesitationCount * 4, 20);
  const clarityScore = Math.min(Math.max(Math.round(rawClarity), 50), 96);

  // 5. Pitch Dynamic & Tone Quality
  let vocalPitchDynamic: 'monotone' | 'balanced' | 'enthusiastic' = 'balanced';
  if (totalWords > 25 && assertiveMatches >= 3) {
    vocalPitchDynamic = 'enthusiastic';
  } else if (hesitationCount > 3 || wpm < 85) {
    vocalPitchDynamic = 'monotone';
  }

  let toneQuality: 'hesitant' | 'cautious' | 'confident_assertive' | 'mastery_level' =
    'confident_assertive';
  if (confidenceScore >= 88) toneQuality = 'mastery_level';
  else if (confidenceScore >= 75) toneQuality = 'confident_assertive';
  else if (confidenceScore >= 60) toneQuality = 'cautious';
  else toneQuality = 'hesitant';

  // 6. Actionable Insights
  const keyInsights: string[] = [];
  if (pacingRating === 'ideal') {
    keyInsights.push(`🎯 Excellent speech cadence at ${wpm} WPM (target: 110–150 WPM).`);
  } else if (pacingRating === 'too_slow') {
    keyInsights.push(`⏱️ Speech rate is deliberate (${wpm} WPM). Increasing tempo slightly helps board viva / interview fluidity.`);
  } else {
    keyInsights.push(`⚡ Speech rate is rapid (${wpm} WPM). Take structured pauses between core equations to enhance articulation.`);
  }

  if (hesitationCount === 0) {
    keyInsights.push('✨ Zero verbal filler words detected — clean, articulate explanation.');
  } else {
    keyInsights.push(`⚠️ Detected ${hesitationCount} hesitation filler(s) [${detectedFillers.slice(0, 3).join(', ')}].`);
  }

  if (assertiveMatches >= 2) {
    keyInsights.push('📚 Strong conceptual vocabulary and scientific linking words used.');
  }

  // 7. Speech Improvement Plan
  const speechImprovementPlan: string[] = [];
  if (hesitationCount > 0) {
    speechImprovementPlan.push('Replace filler words like "um" or "matlab" with a silent 1-second pause while thinking.');
  }
  if (pacingRating !== 'ideal') {
    speechImprovementPlan.push('Practice stating definition statements at 125 WPM with distinct emphasis on physical units.');
  }
  speechImprovementPlan.push('Structure spoken answers: 1. Core Law Statement $\\to$ 2. Formula $\\to$ 3. Real-world example.');

  return {
    durationSeconds: validDurationSec,
    totalWords,
    wpm,
    pacingRating,
    confidenceScore,
    clarityScore,
    hesitationCount,
    detectedFillers,
    vocalPitchDynamic,
    toneQuality,
    keyInsights,
    speechImprovementPlan,
    evaluatedAt: Date.now(),
  };
}
