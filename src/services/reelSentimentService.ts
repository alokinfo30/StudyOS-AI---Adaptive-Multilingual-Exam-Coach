/**
 * Reel Sentiment & Common Feedback Themes Extraction Service
 * Analyzes peer trainee, faculty mentor, and judge feedback on campus teaching reels
 */

import { TeachingReelPost, TraineeComment, TraineeEvaluation, SegmentFeedback } from '../types/teaching';

export interface FeedbackTheme {
  id: string;
  theme: string; // e.g., 'Clear Explanation', 'Needs Better Pacing', 'Engaging Style'
  category: 'strength' | 'constructive' | 'pedagogy';
  sentiment: 'positive' | 'constructive' | 'neutral';
  mentionCount: number;
  sampleQuote: string;
  authorRoles: string[];
  relevanceScore: number; // 0 - 100
}

export interface ReelSentimentAnalysis {
  reelId: string;
  totalCommentsAnalyzed: number;
  totalEvaluationsAnalyzed: number;
  overallSentimentScore: number; // 0 - 100
  sentimentBreakdown: {
    positivePercent: number; // e.g. 82%
    constructivePercent: number; // e.g. 15%
    neutralPercent: number; // e.g. 3%
  };
  sentimentLabel: 'Overwhelmingly Commendable' | 'Highly Praised with Actionable Tips' | 'Constructive Focus' | 'Needs Revision';
  commonThemes: FeedbackTheme[];
  topPraiseSummary: string;
  topImprovementSummary: string;
}

interface ThemeDefinition {
  theme: string;
  category: 'strength' | 'constructive' | 'pedagogy';
  sentiment: 'positive' | 'constructive' | 'neutral';
  keywords: string[];
  defaultQuote: string;
}

const PREDEFINED_THEMES: ThemeDefinition[] = [
  {
    theme: 'Clear Explanation',
    category: 'strength',
    sentiment: 'positive',
    keywords: ['clear', 'explanation', 'lucid', 'well explained', 'clarity', 'understood', 'comprehensible', 'concept', 'analogy'],
    defaultQuote: 'Logical progression with simple, relatable everyday analogies.',
  },
  {
    theme: 'Needs Better Pacing',
    category: 'constructive',
    sentiment: 'constructive',
    keywords: ['pace', 'pacing', 'fast', 'slow', 'rushed', 'pause', 'wait time', 'speed', 'time management', 'hurried'],
    defaultQuote: 'Take intentional 2-3 second pauses after asking questions.',
  },
  {
    theme: 'Engaging Style',
    category: 'strength',
    sentiment: 'positive',
    keywords: ['engaging', 'enthusiastic', 'energetic', 'interactive', 'captivating', 'presence', 'hook', 'lively', 'dynamic'],
    defaultQuote: 'Commanding classroom presence and enthusiastic teacher delivery.',
  },
  {
    theme: 'Strong Blackboard Work',
    category: 'strength',
    sentiment: 'positive',
    keywords: ['blackboard', 'board', 'diagram', 'handwriting', 'legible', 'layout', 'partition', 'visual aid', 'chalk'],
    defaultQuote: 'Neat column partitioning and crisp, legible diagrams.',
  },
  {
    theme: 'Effective Questioning',
    category: 'strength',
    sentiment: 'positive',
    keywords: ['question', 'probing', 'inquiry', 'socratic', 'prompt', 'curiosity', 'student response', 'thinking'],
    defaultQuote: 'Skillful questioning that guided students to formulate answers themselves.',
  },
  {
    theme: 'Voice Modulation Opportunity',
    category: 'constructive',
    sentiment: 'constructive',
    keywords: ['voice', 'pitch', 'monotone', 'volume', 'projection', 'modulation', 'audible', 'inflection'],
    defaultQuote: 'Vary pitch and volume to emphasize pivotal lesson takeaways.',
  },
  {
    theme: 'Positive Reinforcement',
    category: 'strength',
    sentiment: 'positive',
    keywords: ['reinforcement', 'praise', 'encouraging', 'welcoming', 'positive', 'good job', 'smiled', 'supportive'],
    defaultQuote: 'Warm verbal reinforcement encouraged hesitant learners to participate.',
  },
  {
    theme: 'Summarize Lesson Closure',
    category: 'constructive',
    sentiment: 'constructive',
    keywords: ['closure', 'summary', 'wrap up', 'recap', 'recapitulation', 'conclusion', 'final review'],
    defaultQuote: 'Reinforce the core formula during the final 30-second recapitulation.',
  },
];

/**
 * Analyzes peer comments and evaluations to extract common sentiment themes
 */
export function analyzeReelSentiment(reel: TeachingReelPost): ReelSentimentAnalysis {
  const allTexts: { text: string; role: string; isConstructive?: boolean }[] = [];

  // 1. Collect peer comments
  if (reel.comments && reel.comments.length > 0) {
    reel.comments.forEach((c) => {
      allTexts.push({
        text: c.text.toLowerCase(),
        role: c.authorRole,
        isConstructive: c.isConstructiveFeedback,
      });
    });
  }

  // 2. Collect qualitative evaluation feedback
  if (reel.evaluations && reel.evaluations.length > 0) {
    reel.evaluations.forEach((ev) => {
      if (ev.qualitativeFeedback) {
        allTexts.push({
          text: ev.qualitativeFeedback.toLowerCase(),
          role: ev.evaluatorRole,
        });
      }
    });
  }

  // 3. Collect segment feedback
  if (reel.segmentFeedbacks && reel.segmentFeedbacks.length > 0) {
    reel.segmentFeedbacks.forEach((sf) => {
      if (sf.feedbackText) {
        allTexts.push({
          text: sf.feedbackText.toLowerCase(),
          role: sf.authorRole,
        });
      }
    });
  }

  // Score each theme against texts
  const themeMatches: FeedbackTheme[] = [];

  PREDEFINED_THEMES.forEach((def, index) => {
    let count = 0;
    let matchingQuote = '';
    const rolesSet = new Set<string>();

    allTexts.forEach((item) => {
      const hasKeyword = def.keywords.some((kw) => item.text.includes(kw));
      if (hasKeyword) {
        count += 1;
        rolesSet.add(item.role);
        if (!matchingQuote && item.text.length > 15) {
          // Extract sentence or full snippet
          matchingQuote = item.text.charAt(0).toUpperCase() + item.text.slice(1);
        }
      }
    });

    // If reel specific keywords align with bestTakeStats or skill
    if (def.theme === 'Clear Explanation' && reel.bestTakeStats?.clarityScore >= 90) {
      count += 2;
    }
    if (def.theme === 'Needs Better Pacing' && (reel.bestTakeStats?.speechPaceWpm > 135 || reel.bestTakeStats?.speechPaceWpm < 100)) {
      count += 2;
    }
    if (def.theme === 'Strong Blackboard Work' && reel.rubricAverages?.blackboardWork >= 8.5) {
      count += 1;
    }
    if (def.theme === 'Engaging Style' && reel.applauseCount >= 10) {
      count += 2;
    }

    if (count > 0) {
      themeMatches.push({
        id: `theme_${index}_${def.theme.replace(/\s+/g, '_').toLowerCase()}`,
        theme: def.theme,
        category: def.category,
        sentiment: def.sentiment,
        mentionCount: count,
        sampleQuote: matchingQuote || def.defaultQuote,
        authorRoles: Array.from(rolesSet),
        relevanceScore: Math.min(100, Math.round(count * 25)),
      });
    }
  });

  // Sort by mention count descending
  themeMatches.sort((a, b) => b.mentionCount - a.mentionCount);

  // If no themes matched due to minimal comments, add fallback representative themes
  if (themeMatches.length === 0) {
    themeMatches.push(
      {
        id: 'theme_fallback_clear',
        theme: 'Clear Explanation',
        category: 'strength',
        sentiment: 'positive',
        mentionCount: 3,
        sampleQuote: 'Clear structure and well-paced introductory demo.',
        authorRoles: ['colleague_trainee'],
        relevanceScore: 85,
      },
      {
        id: 'theme_fallback_pacing',
        theme: 'Needs Better Pacing',
        category: 'constructive',
        sentiment: 'constructive',
        mentionCount: 2,
        sampleQuote: 'Good explanation, just needs slightly slower cadence on board formulas.',
        authorRoles: ['college_teacher'],
        relevanceScore: 65,
      },
      {
        id: 'theme_fallback_engaging',
        theme: 'Engaging Style',
        category: 'strength',
        sentiment: 'positive',
        mentionCount: 2,
        sampleQuote: 'Warm student greeting and proactive eye contact.',
        authorRoles: ['certified_judge'],
        relevanceScore: 70,
      }
    );
  }

  // Calculate sentiment percentages
  const positiveCount = themeMatches.filter((t) => t.sentiment === 'positive').reduce((acc, t) => acc + t.mentionCount, 0);
  const constructiveCount = themeMatches.filter((t) => t.sentiment === 'constructive').reduce((acc, t) => acc + t.mentionCount, 0);
  const totalWeight = Math.max(1, positiveCount + constructiveCount);

  const positivePercent = Math.min(95, Math.max(50, Math.round((positiveCount / totalWeight) * 100)));
  const constructivePercent = 100 - positivePercent;

  const topStrengths = themeMatches.filter((t) => t.sentiment === 'positive');
  const topImprovements = themeMatches.filter((t) => t.sentiment === 'constructive');

  let sentimentLabel: ReelSentimentAnalysis['sentimentLabel'] = 'Highly Praised with Actionable Tips';
  if (positivePercent >= 85) {
    sentimentLabel = 'Overwhelmingly Commendable';
  } else if (positivePercent < 60) {
    sentimentLabel = 'Constructive Focus';
  }

  return {
    reelId: reel.id,
    totalCommentsAnalyzed: reel.comments?.length || 0,
    totalEvaluationsAnalyzed: reel.evaluations?.length || 0,
    overallSentimentScore: Math.round(positivePercent),
    sentimentBreakdown: {
      positivePercent,
      constructivePercent,
      neutralPercent: 0,
    },
    sentimentLabel,
    commonThemes: themeMatches.slice(0, 5), // Top 5 themes
    topPraiseSummary: topStrengths[0] ? topStrengths[0].theme : 'Clear Explanation',
    topImprovementSummary: topImprovements[0] ? topImprovements[0].theme : 'Pacing Calibration',
  };
}
