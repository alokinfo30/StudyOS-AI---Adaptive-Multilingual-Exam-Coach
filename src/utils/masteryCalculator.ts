/**
 * StudyOS AI - Adaptive Mastery & Cognitive Algorithm Engine
 * Deterministic calculation of Mastery, Spaced Repetition, DNA & Exam Readiness
 */
import {
  ConceptMastery,
  ConfidenceLevel,
  ErrorType,
  MasteryState,
  QuestionAttempt,
  StudentDNA,
  ExamReadiness,
  ExamCategory,
  SpacedRevisionItem,
} from '../types';

/**
 * Calculates updated Concept Mastery after a single question attempt
 */
export function calculateConceptMasteryDelta(
  current: ConceptMastery,
  isCorrect: boolean,
  confidence: ConfidenceLevel,
  timeSpentSec: number,
  expectedTimeSec: number,
  errorType?: ErrorType
): ConceptMastery {
  const totalAttempts = current.totalAttempts + 1;
  const correctAttempts = current.correctAttempts + (isCorrect ? 1 : 0);
  
  // Calculate confidence-weighted raw accuracy
  const rawAccuracy = Math.round((correctAttempts / totalAttempts) * 100);

  // Speed factor: Ratio of expected time vs actual time (capped between 40% and 100%)
  const speedRatio = expectedTimeSec / Math.max(timeSpentSec, 10);
  const speed = Math.round(Math.min(Math.max(speedRatio * 80, 40), 100));

  // Confidence weighting multiplier on mastery score
  let delta = 0;
  if (isCorrect) {
    switch (confidence) {
      case 'very_confident':
        delta = 7;
        break;
      case 'confident':
        delta = 4.5;
        break;
      case 'somewhat':
        delta = 2.5;
        break;
      case 'guess':
        delta = 0.5; // Guessing does NOT yield high mastery
        break;
    }
  } else {
    // Incorrect answer reduces mastery and increases forgetting risk
    // Heavy penalty for overconfident misconceptions
    delta = confidence === 'very_confident' ? -9 : confidence === 'confident' ? -5 : -3;
  }

  const rawMastery = Math.min(Math.max(current.overallMastery + delta, 10), 100);
  const recentPerformance = isCorrect
    ? Math.min(current.recentPerformance + (confidence === 'very_confident' ? 7 : 4), 100)
    : Math.max(current.recentPerformance - (confidence === 'very_confident' ? 12 : 7), 15);

  // Recall and Retention calibrated by confidence
  const recallBonus = confidence === 'very_confident' ? 6 : confidence === 'confident' ? 4 : 1.5;
  const recall = isCorrect
    ? Math.min(current.recall + recallBonus, 100)
    : Math.max(current.recall - 8, 20);

  const forgettingRisk = isCorrect
    ? Math.max(current.forgettingRisk - (confidence === 'very_confident' ? 20 : 10), 5)
    : Math.min(current.forgettingRisk + (confidence === 'very_confident' ? 30 : 15), 95);

  // Determine state
  let state: MasteryState = 'LEARNING';
  if (rawMastery >= 90) {
    state = 'MASTERED';
  } else if (forgettingRisk > 70) {
    state = 'AT_RISK';
  } else if (rawMastery < 50) {
    state = 'WEAK';
  } else if (delta > 0) {
    state = 'IMPROVING';
  } else {
    state = 'PRACTICING';
  }

  const mistakeHistory = [...current.mistakeHistory];
  if (!isCorrect && errorType) {
    mistakeHistory.push(errorType);
  }

  // Calculate next revision due timestamp (in ms) based on interval
  const nextIntervalDays = isCorrect ? getNextIntervalDays(confidence) : 1;
  const nextRevisionDue = Date.now() + nextIntervalDays * 24 * 60 * 60 * 1000;

  return {
    ...current,
    totalAttempts,
    correctAttempts,
    accuracy: rawAccuracy,
    speed,
    recentPerformance,
    recall,
    longTermRetention: Math.round((recall + rawAccuracy) / 2),
    overallMastery: Math.round(rawMastery),
    forgettingRisk: Math.round(forgettingRisk),
    state,
    lastPracticed: Date.now(),
    nextRevisionDue,
    mistakeHistory: mistakeHistory.slice(-10), // keep last 10
  };
}

/**
 * Calculates confidence-weighted accuracy for an array of question attempts
 */
export function calculateConfidenceWeightedAccuracy(
  attempts: Array<{ isCorrect: boolean; confidence: ConfidenceLevel }>
): number {
  if (attempts.length === 0) return 0;

  let weightedPoints = 0;
  let maxWeight = 0;

  for (const attempt of attempts) {
    let weight = 1.0;
    switch (attempt.confidence) {
      case 'very_confident':
        weight = 1.25;
        break;
      case 'confident':
        weight = 1.0;
        break;
      case 'somewhat':
        weight = 0.7;
        break;
      case 'guess':
        weight = 0.35;
        break;
    }

    maxWeight += 1.0;

    if (attempt.isCorrect) {
      weightedPoints += weight;
    } else {
      if (attempt.confidence === 'very_confident') {
        weightedPoints = Math.max(0, weightedPoints - 0.2); // Overconfidence penalty
      }
    }
  }

  const res = Math.round((weightedPoints / maxWeight) * 100);
  return Math.min(Math.max(res, 0), 100);
}

/**
 * Spaced Repetition Interval Scheduler
 */
export function getNextIntervalDays(confidence: ConfidenceLevel): number {
  switch (confidence) {
    case 'very_confident':
      return 7;
    case 'confident':
      return 3;
    case 'somewhat':
      return 2;
    case 'guess':
    default:
      return 1;
  }
}

/**
 * Classifies an error type based on timing, confidence and answer patterns
 */
export function classifyErrorType(
  timeSpentSec: number,
  expectedTimeSec: number,
  confidence: ConfidenceLevel,
  usedHints: number
): ErrorType {
  if (timeSpentSec < expectedTimeSec * 0.35) {
    return 'READING_ERROR'; // Rushed without reading carefully
  }
  if (timeSpentSec > expectedTimeSec * 1.8) {
    return 'TIME_PRESSURE';
  }
  if (confidence === 'guess') {
    return 'GUESSING';
  }
  if (confidence === 'very_confident') {
    return 'MISCONCEPTION'; // Strong belief in a wrong concept
  }
  if (usedHints >= 2) {
    return 'CONCEPT_ERROR';
  }
  return 'CALCULATION_ERROR';
}

/**
 * Updates Student Learning DNA from all recorded attempts
 */
export function calculateStudentDNA(
  attempts: QuestionAttempt[],
  existingDNA: StudentDNA
): StudentDNA {
  if (attempts.length === 0) return existingDNA;

  const total = attempts.length;
  const correctCount = attempts.filter((a) => a.isCorrect).length;
  const accuracy = Math.round((correctCount / total) * 100);

  const calcErrorCount = attempts.filter((a) => a.errorType === 'CALCULATION_ERROR').length;
  const calcAccuracy = Math.round(Math.max(100 - (calcErrorCount / total) * 150, 40));

  const confidentAttempts = attempts.filter((a) => a.confidence === 'very_confident' || a.confidence === 'confident');
  const memoryStrength = Math.round(
    confidentAttempts.length > 0
      ? (confidentAttempts.filter((a) => a.isCorrect).length / confidentAttempts.length) * 100
      : 70
  );

  const speedRatios = attempts.map((a) => (a.timeSpentSec <= 75 ? 90 : 60));
  const timeManagement = Math.round(speedRatios.reduce((acc, v) => acc + v, 0) / attempts.length);

  return {
    ...existingDNA,
    questionAccuracy: accuracy,
    calculationAccuracy: calcAccuracy,
    memoryStrength,
    conceptRetention: Math.round((accuracy + memoryStrength) / 2),
    learningSpeed: Math.min(Math.max(timeManagement, 50), 95),
    problemSolvingIndex: Math.round(accuracy * 0.9 + 8),
    timeManagement,
    totalQuestionsSolved: total,
    diagnosticCompleted: true,
  };
}

/**
 * Calculates Composite Exam Readiness Index
 */
export function calculateExamReadiness(
  exam: ExamCategory,
  targetScore: number,
  masteryList: ConceptMastery[],
  dna: StudentDNA,
  mockExamScores: number[]
): ExamReadiness {
  const avgMastery =
    masteryList.length > 0
      ? Math.round(masteryList.reduce((sum, m) => sum + m.overallMastery, 0) / masteryList.length)
      : 65;

  const avgMock =
    mockExamScores.length > 0
      ? Math.round(mockExamScores.reduce((sum, s) => sum + s, 0) / mockExamScores.length)
      : avgMastery - 5;

  const overall = Math.round(
    avgMastery * 0.35 +
      dna.questionAccuracy * 0.25 +
      dna.memoryStrength * 0.15 +
      dna.timeManagement * 0.1 +
      avgMock * 0.15
  );

  const minRange = Math.max(overall - 6, 30);
  const maxRange = Math.min(overall + 7, 99);
  const gap = Math.max(targetScore - overall, 0);

  return {
    exam,
    targetScorePercent: targetScore,
    overallReadiness: overall,
    predictedScoreRange: { min: minRange, max: maxRange },
    confidence: masteryList.length > 5 ? 'High' : 'Medium',
    metrics: {
      conceptMastery: avgMastery,
      questionAccuracy: dna.questionAccuracy,
      recallStrength: dna.memoryStrength,
      speedScore: dna.timeManagement,
      mockTestScore: avgMock,
      consistencyScore: Math.min(dna.consistencyStreak * 10 + 40, 95),
    },
    weakestTopics: [
      {
        conceptId: 'concept_coulombs_law',
        title: {
          en: "Coulomb's Law & Dielectrics",
          hi: 'कूलॉम का नियम एवं परावैद्युतांक',
          hinglish: "Coulomb's Law & Dielectric Medium",
        },
        subject: 'Physics',
        mastery: 58,
        weightage: 'High Yield (18%)',
      },
      {
        conceptId: 'concept_discriminant_nature_roots',
        title: {
          en: 'Quadratic Discriminant & Equal Roots',
          hi: 'द्विघात विविक्तकर एवं समान मूल',
          hinglish: 'Quadratic Discriminant (D) Sign Rules',
        },
        subject: 'Mathematics',
        mastery: 64,
        weightage: 'Medium Yield (12%)',
      },
    ],
    strongestTopics: [
      {
        conceptId: 'concept_series_parallel',
        title: {
          en: 'Series & Parallel Resistors',
          hi: 'श्रेणीक्रम एवं समान्तर क्रम प्रतिरोध',
          hinglish: 'Series & Parallel Resistors',
        },
        subject: 'Physics',
        mastery: 94,
      },
    ],
    gapPercent: gap,
    recommendedAction: {
      en: 'Complete 10-minute targeted Failure Recovery in Coulomb’s Law, followed by 1 full timed mock test.',
      hi: 'कूलॉम के नियम में 10 मिनट का सुधार अभ्यास करें, तत्पश्चात 1 टाइमर युक्त मॉक टेस्ट दें।',
      hinglish: "Coulomb's law ka 10-min weakness recovery session pura karein, fir 1 mock test dein.",
    },
  };
}
