/**
 * Comment Sentiment & Engagement Analysis Service
 * Analyzes peer comments and qualitative reviews on apprentice teaching reels
 */

import { TraineeComment, TraineeEvaluation, TeachingReelPost } from '../types/teaching';

export interface ReelSentimentBreakdown {
  positivePercentage: number;
  constructivePercentage: number;
  inquiryPercentage: number;
  overallSentiment: 'highly_positive' | 'constructive_growth' | 'balanced' | 'emerging';
  sentimentLabel: string;
  sentimentColor: string;
  totalCommentsCount: number;
  highlightComments: {
    text: string;
    authorName: string;
    authorRole: string;
    sentimentType: 'positive' | 'constructive' | 'inquiry';
  }[];
}

const POSITIVE_KEYWORDS = [
  'excellent', 'great', 'brilliant', 'impressive', 'clear', 'well explained',
  'engaging', 'confident', 'outstanding', 'loved', 'awesome', 'good',
  'inspiring', 'superb', 'effective', 'natural', 'strong', 'mastery',
  'creative', 'perfect', 'neat', 'flawless', 'nice', 'helpful', 'wonderful',
  'fantastic', 'shandar', 'badhiya', 'accha', 'sarahniya', 'kamaal'
];

const CONSTRUCTIVE_KEYWORDS = [
  'improve', 'consider', 'suggest', 'try', 'pace', 'blackboard', 'pause',
  'voice', 'question', 'practice', 'next time', 'louder', 'slower', 'clarity',
  'font', 'chalk', 'diagram', 'handwriting', 'eye contact', 'wait time',
  'gesture', 'body language', 'dhyan', 'sudhar', 'behtar'
];

const INQUIRY_KEYWORDS = [
  'how', 'why', 'what if', 'query', 'question', 'can you', 'wondered',
  'doubt', 'curious', 'kya', 'kaise', 'kyun'
];

export function analyzeCommentSentiment(text: string): 'positive' | 'constructive' | 'inquiry' {
  const lower = text.toLowerCase();

  let posScore = 0;
  let constScore = 0;
  let inqScore = 0;

  POSITIVE_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) posScore += 1;
  });

  CONSTRUCTIVE_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) constScore += 1.2; // slight weight to pedagogical advice
  });

  INQUIRY_KEYWORDS.forEach((kw) => {
    if (lower.includes(kw)) inqScore += 1;
  });

  if (inqScore > posScore && inqScore > constScore && lower.includes('?')) {
    return 'inquiry';
  }

  if (constScore > posScore) {
    return 'constructive';
  }

  if (posScore > 0) {
    return 'positive';
  }

  // Default to constructive feedback in teacher training
  return 'constructive';
}

export function computeReelSentiment(reel: TeachingReelPost): ReelSentimentBreakdown {
  const allTexts: { text: string; authorName: string; authorRole: string }[] = [];

  (reel.comments || []).forEach((c) => {
    allTexts.push({
      text: c.text,
      authorName: c.authorName,
      authorRole: c.authorRole,
    });
  });

  (reel.evaluations || []).forEach((e) => {
    if (e.qualitativeFeedback) {
      allTexts.push({
        text: e.qualitativeFeedback,
        authorName: e.evaluatorName,
        authorRole: e.evaluatorRole,
      });
    }
  });

  if (allTexts.length === 0) {
    return {
      positivePercentage: 80,
      constructivePercentage: 20,
      inquiryPercentage: 0,
      overallSentiment: 'emerging',
      sentimentLabel: 'Awaiting Peer Reviews',
      sentimentColor: 'text-zinc-400',
      totalCommentsCount: 0,
      highlightComments: [],
    };
  }

  let posCount = 0;
  let constCount = 0;
  let inqCount = 0;

  const highlights = allTexts.slice(0, 3).map((item) => {
    const sentimentType = analyzeCommentSentiment(item.text);
    if (sentimentType === 'positive') posCount++;
    else if (sentimentType === 'constructive') constCount++;
    else inqCount++;

    return {
      text: item.text,
      authorName: item.authorName,
      authorRole: item.authorRole,
      sentimentType,
    };
  });

  // Calculate percentages
  const total = posCount + constCount + inqCount || 1;
  const positivePercentage = Math.round((posCount / total) * 100);
  const constructivePercentage = Math.round((constCount / total) * 100);
  const inquiryPercentage = 100 - positivePercentage - constructivePercentage;

  let overallSentiment: ReelSentimentBreakdown['overallSentiment'] = 'balanced';
  let sentimentLabel = 'Balanced Constructive Feedback';
  let sentimentColor = 'text-blue-400';

  if (positivePercentage >= 70) {
    overallSentiment = 'highly_positive';
    sentimentLabel = 'High Peer Commendation & Praise';
    sentimentColor = 'text-emerald-400';
  } else if (constructivePercentage >= 50) {
    overallSentiment = 'constructive_growth';
    sentimentLabel = 'Actionable Pedagogical Guidance';
    sentimentColor = 'text-amber-400';
  }

  return {
    positivePercentage,
    constructivePercentage: Math.max(0, constructivePercentage),
    inquiryPercentage: Math.max(0, inquiryPercentage),
    overallSentiment,
    sentimentLabel,
    sentimentColor,
    totalCommentsCount: allTexts.length,
    highlightComments: highlights,
  };
}
