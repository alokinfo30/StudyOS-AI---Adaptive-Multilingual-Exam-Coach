/**
 * Content Moderation & Educator Code of Conduct Service
 * Automated filter for abusive, inappropriate, and derogatory language
 * Enforces respect policies and automated strike/ban management.
 */

import { UserModerationRecord } from '../types/teaching';

// Curated list of prohibited, abusive, derogatory, and inappropriate terms (English, Hindi, Hinglish)
const BLOCKED_PATTERNS: RegExp[] = [
  // Obscene & Profane terms
  /\b(fuck|shit|bitch|bastard|asshole|dick|piss|crap|cunt|slut|whore)\b/i,
  // Toxic Harassment & Insults
  /\b(idiot|stupid|moron|dumb|retard|loser|trash|garbage|clown|scam|hate you|get lost|shut up)\b/i,
  // Demeaning educator attacks
  /\b(worst teacher|pathetic teacher|don't teach|quit teaching|horrible teaching|useless teacher)\b/i,
  // Hindi/Hinglish abusive terms
  /\b(chutiya|saala|kamina|kutta|harami|bhenchod|madarchod|gandu|bewakoof|pagal|bakwaas|nalayak)\b/i,
  /\b(ghanta|tatti|chirkut|lallu|dhat teri|bhadwe|ullu ke pathe)\b/i,
  // Hate speech & discrimination
  /\b(kill yourself|die|suicide|disgusting|ugly)\b/i,
];

const MODERATION_STORAGE_KEY_PREFIX = 'studyos_moderation_trainee_';

export interface ModerationResult {
  isSafe: boolean;
  flaggedWords: string[];
  reason: string;
  toxicityScore?: number;
  flaggedCategories?: string[];
  constructiveAlternative?: string;
}

/**
 * Validates text against abusive, derogatory, and inappropriate terms (Instant local regex)
 */
export function checkContentModeration(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return { isSafe: true, flaggedWords: [], reason: '' };
  }

  const normalized = text.toLowerCase().trim();
  const flaggedWords: string[] = [];

  for (const regex of BLOCKED_PATTERNS) {
    const match = normalized.match(regex);
    if (match) {
      flaggedWords.push(match[0]);
    }
  }

  if (flaggedWords.length > 0) {
    const uniqueWords = Array.from(new Set(flaggedWords));
    return {
      isSafe: false,
      flaggedWords: uniqueWords,
      toxicityScore: 0.9,
      flaggedCategories: ['abusive_language', 'disrespectful_insult'],
      reason: `Your input contains prohibited or disrespectful terms: "${uniqueWords.join(', ')}". Apprentice educator campus spaces require mutual academic respect and professional decorum.`,
    };
  }

  return { isSafe: true, flaggedWords: [], reason: '' };
}

/**
 * AI-driven Content Moderation Analysis (queries /api/ai/moderate-comment, falls back safely)
 */
export async function checkContentModerationWithAI(
  text: string,
  authorRole: string = 'colleague_trainee',
  context: string = 'Apprentice Teaching Reel Review'
): Promise<ModerationResult> {
  // First run instant local check to catch overt violations fast
  const localResult = checkContentModeration(text);
  if (!localResult.isSafe) {
    return localResult;
  }

  try {
    const res = await fetch('/api/ai/moderate-comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, authorRole, context }),
    });

    if (!res.ok) {
      return localResult;
    }

    const data = await res.json();
    if (data && typeof data.isSafe === 'boolean') {
      return {
        isSafe: data.isSafe,
        flaggedWords: data.flaggedWords || [],
        reason: data.reason || (data.isSafe ? '' : 'Violates teacher trainee community standards.'),
        toxicityScore: data.toxicityScore || 0,
        flaggedCategories: data.flaggedCategories || [],
        constructiveAlternative: data.constructiveAlternative || '',
      };
    }
  } catch (err) {
    console.warn('AI moderation API check offline or failed; relying on local heuristics:', err);
  }

  return localResult;
}

/**
 * Loads current user's moderation and strike status
 */
export function getUserModerationRecord(
  userId: string = 'current_trainee',
  userName: string = 'Apprentice Trainee'
): UserModerationRecord {
  try {
    const stored = localStorage.getItem(`${MODERATION_STORAGE_KEY_PREFIX}${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error('Failed to parse moderation record:', err);
  }

  const defaultRecord: UserModerationRecord = {
    userId,
    userName,
    userRole: 'colleague_trainee',
    collegeCampus: 'District Institute of Education & Training (DIET)',
    disclaimerAccepted: false,
    violationCount: 0,
    isBanned: false,
    recentViolations: [],
  };

  saveUserModerationRecord(defaultRecord);
  return defaultRecord;
}

/**
 * Persists moderation record
 */
export function saveUserModerationRecord(record: UserModerationRecord): void {
  try {
    localStorage.setItem(
      `${MODERATION_STORAGE_KEY_PREFIX}${record.userId}`,
      JSON.stringify(record)
    );
  } catch (err) {
    console.error('Failed to save moderation record:', err);
  }
}

/**
 * Records disclaimer acceptance
 */
export function acceptCodeOfConductDisclaimer(userId: string): UserModerationRecord {
  const record = getUserModerationRecord(userId);
  record.disclaimerAccepted = true;
  record.disclaimerAcceptedAt = Date.now();
  saveUserModerationRecord(record);
  return record;
}

/**
 * Records an abusive violation, increments strikes, and auto-bans if limit reached (3 strikes)
 */
export function recordModerationViolation(
  userId: string,
  blockedText: string,
  flaggedKeywords: string[],
  violationType: 'abusive_comment' | 'inappropriate_content' = 'abusive_comment'
): { record: UserModerationRecord; isNowBanned: boolean; strikesRemaining: number } {
  const record = getUserModerationRecord(userId);

  record.violationCount += 1;
  record.recentViolations.unshift({
    timestamp: Date.now(),
    blockedText: blockedText.slice(0, 100),
    flaggedKeywords,
    violationType,
  });

  const MAX_STRIKES = 3;
  let isNowBanned = false;

  if (record.violationCount >= MAX_STRIKES) {
    record.isBanned = true;
    record.bannedAt = Date.now();
    record.banReason = `Auto-banned due to ${record.violationCount} consecutive violations of the Apprentice Educator Respect & Anti-Abuse Policy.`;
    isNowBanned = true;
  }

  saveUserModerationRecord(record);

  return {
    record,
    isNowBanned,
    strikesRemaining: Math.max(0, MAX_STRIKES - record.violationCount),
  };
}

/**
 * Unbans or resets user for demonstration / testing purposes
 */
export function resetModerationRecord(userId: string): UserModerationRecord {
  const record: UserModerationRecord = {
    userId,
    userName: 'Apprentice Trainee',
    userRole: 'colleague_trainee',
    collegeCampus: 'District Institute of Education & Training (DIET)',
    disclaimerAccepted: true,
    violationCount: 0,
    isBanned: false,
    recentViolations: [],
  };
  saveUserModerationRecord(record);
  return record;
}

/**
 * Respectful Constructive Feedback Starters to scaffold positive peer appraisal
 */
export const RESPECTFUL_FEEDBACK_PROMPTS = [
  '🌟 Commendable Set Induction! The opening real-world hook instantly engaged curiosity.',
  '📐 Very structured blackboard work with clean headings and legible handwriting.',
  '❓ Thoughtful probing questions that encouraged deep thinking from student trainees.',
  '🗣️ Great voice modulation and eye contact across all sections of the room.',
  '💡 The analogy used to explain the core concept made it very relatable.',
  '⏳ Excellent time management; pacing between explanation and student check was balanced.',
  '🤝 Consider providing a bit more pause time after asking high-order questions.',
  '🎯 Clear lesson closure and recapitulation summarizing all key takeaways.',
];
