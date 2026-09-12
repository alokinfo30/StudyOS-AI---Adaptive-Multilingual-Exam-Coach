/**
 * StudyOS AI - Core Type Definitions
 */

export type LanguageCode =
  | 'en'
  | 'hi'
  | 'hinglish'
  | 'bn'
  | 'mr'
  | 'gu'
  | 'ta'
  | 'te'
  | 'kn'
  | 'ml'
  | 'pa'
  | 'ur';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  isRTL?: boolean;
}

export type MasteryState =
  | 'NOT_STARTED'
  | 'LEARNING'
  | 'WEAK'
  | 'IMPROVING'
  | 'PRACTICING'
  | 'MASTERED'
  | 'AT_RISK'
  | 'FORGOTTEN';

export type ErrorType =
  | 'CONCEPT_ERROR'
  | 'CALCULATION_ERROR'
  | 'READING_ERROR'
  | 'CARELESS_ERROR'
  | 'MEMORY_ERROR'
  | 'TIME_PRESSURE'
  | 'GUESSING'
  | 'MISCONCEPTION'
  | 'FORMULA_ERROR'
  | 'QUESTION_INTERPRETATION_ERROR';

export type ConfidenceLevel = 'guess' | 'somewhat' | 'confident' | 'very_confident';

export type QuestionType =
  | 'MCQ'
  | 'NUMERICAL'
  | 'ASSERTION_REASON'
  | 'TRUE_FALSE'
  | 'MATCH_FOLLOWING';

export type ExamCategory =
  | 'CBSE_10'
  | 'CBSE_12'
  | 'UP_BOARD_10'
  | 'UP_BOARD_12'
  | 'JEE_MAIN'
  | 'NEET_UG'
  | 'CUET';

export interface LocalizedString {
  en: string;
  hi?: string;
  hinglish?: string;
  bn?: string;
  mr?: string;
  gu?: string;
  ta?: string;
  te?: string;
  kn?: string;
  ml?: string;
  pa?: string;
  ur?: string;
}

export interface Concept {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  formula?: string;
  keyPoints: LocalizedString[];
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  checkpointQuestion: {
    prompt: LocalizedString;
    options: LocalizedString[];
    correctIndex: number;
    explanation: LocalizedString;
  };
}

export interface Chapter {
  id: string;
  subjectId: string;
  chapterNo?: number;
  title: LocalizedString;
  description: LocalizedString;
  concepts: Concept[];
  targetMastery: number; // e.g. 90%
  highYieldWeightage: number; // e.g. 12% in JEE/Boards
  textbookRef?: string;
  board?: EducationBoard;
  classLevel?: '9' | '10' | '11' | '12' | string;
}

export interface Subject {
  id: string;
  name: LocalizedString;
  icon: string;
  color: string;
  exam: ExamCategory;
  board?: EducationBoard;
  classLevel?: '9' | '10' | '11' | '12' | string;
  textbookStandard?: string;
  chapters: Chapter[];
}

export type GoalCategory =
  | 'school_board' // Class 10/12 Board Exams
  | 'competitive_entrance' // JEE Main, NEET UG, CUET
  | 'dev_interview' // Developer Tech Interviews (Laravel, Python, JS, AI)
  | 'teacher_training'; // B.Ed, BTC, ITI Trainer Apprentice Teaching & Practicum

export type EducationBoard =
  | 'CBSE'
  | 'ICSE_ISC'
  | 'UP_BOARD'
  | 'MAHARASHTRA_STATE'
  | 'BIHAR_BOARD'
  | 'STATE_BOARD_WB'
  | 'STATE_BOARD_RAJASTHAN'
  | 'STATE_BOARD_MP'
  | 'STATE_BOARD_TAMILNADU'
  | 'STATE_BOARD_KARNATAKA'
  | 'STATE_BOARD_ANDHRA'
  | 'STATE_BOARD_TELANGANA'
  | 'STATE_BOARD_KERALA'
  | 'STATE_BOARD_GUJARAT'
  | 'STATE_BOARD_PUNJAB'
  | 'STATE_BOARD_HARYANA'
  | 'STATE_BOARD_ODISHA'
  | 'STATE_BOARD_JHARKHAND'
  | 'STATE_BOARD_CHHATTISGARH'
  | 'STATE_BOARD_ASSAM'
  | 'STATE_BOARD_UTTARAKHAND'
  | 'STATE_BOARD_HIMACHAL'
  | 'STATE_BOARD_JAMMU_KASHMIR'
  | 'STATE_BOARD_GOA'
  | 'STATE_BOARD_TRIPURA'
  | 'STATE_BOARD_MANIPUR'
  | 'STATE_BOARD_MEGHALAYA'
  | 'STATE_BOARD_NAGALAND'
  | 'STATE_BOARD_MIZORAM'
  | 'STATE_BOARD_SIKKIM'
  | 'STATE_BOARD_ARUNACHAL'
  | 'STATE_BOARD';

export interface TextbookSource {
  board: EducationBoard;
  bookTitle: string; // e.g. "NCERT Science Class 10", "NCERT Mathematics Exemplar", "UP Board Rasayan Vigyan"
  chapterNo: number;
  chapterName: string;
  exercise?: string; // e.g. "Exercise 12.1", "In-Text Page 209", "NCERT Exemplar Section B"
  questionNo: string; // e.g. "Q3", "Example 12.4"
  pageNo?: number;
  category: 'in_text' | 'exercise' | 'exemplar' | 'board_pyq' | 'competitive_pyq' | 'example';
}

export interface Question {
  id: string;
  conceptId: string;
  chapterId: string;
  subjectId: string;
  type: QuestionType;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  negativeMarks?: number;
  expectedTimeSec: number;
  classLevel?: '10' | '11' | '12' | 'competitive' | 'dev';
  targetExam?: ExamCategory | string;
  targetBoard?: EducationBoard | string;
  isPYQ?: boolean;
  pyqExam?: string;
  pyqYear?: number;
  prompt: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  numericalAnswer?: number;
  tolerance?: number;
  explanation: LocalizedString;
  hint1: LocalizedString;
  hint2?: LocalizedString;
  guidedReasoning: LocalizedString;
  commonMisconception?: LocalizedString;
  whyReason?: LocalizedString; // Dynamic reason why student was served this question
  textbookSource?: TextbookSource;
}

export interface ConceptMastery {
  conceptId: string;
  understanding: number; // 0 - 100
  accuracy: number; // 0 - 100
  recall: number; // 0 - 100
  speed: number; // 0 - 100
  recentPerformance: number; // 0 - 100
  longTermRetention: number; // 0 - 100
  overallMastery: number; // 0 - 100
  forgettingRisk: number; // 0 - 100 (high = urgent revision)
  state: MasteryState;
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed: number;
  nextRevisionDue: number;
  mistakeHistory: ErrorType[];
}

export interface StudentDNA {
  learningSpeed: number; // 0 - 100
  conceptRetention: number; // 0 - 100
  questionAccuracy: number; // 0 - 100
  calculationAccuracy: number; // 0 - 100
  memoryStrength: number; // 0 - 100
  problemSolvingIndex: number; // 0 - 100
  timeManagement: number; // 0 - 100
  consistencyStreak: number; // days
  totalHoursStudied: number;
  totalQuestionsSolved: number;
  diagnosticCompleted: boolean;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  conceptId: string;
  chapterId: string;
  subjectId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSec: number;
  confidence: ConfidenceLevel;
  hintsUsed: number;
  errorType?: ErrorType;
  timestamp: number;
}

export interface SpacedRevisionItem {
  id: string;
  conceptId: string;
  chapterId: string;
  subjectId: string;
  questionId: string;
  currentIntervalDays: number;
  scheduledDate: number;
  repetitionCount: number;
  lastConfidence: ConfidenceLevel;
  forgettingRiskPercent: number;
  dueStatus: 'due_today' | 'overdue' | 'upcoming' | 'mastered';
}

export interface DailyMission {
  date: string;
  prioritySubject: string;
  priorityChapter: string;
  estimatedMinutes: number;
  tasks: {
    id: string;
    type: 'learn' | 'practice' | 'revision' | 'failure_recovery' | 'daily_test';
    title: LocalizedString;
    subtitle: LocalizedString;
    targetCount: number;
    completedCount: number;
    isCompleted: boolean;
    conceptId?: string;
    chapterId?: string;
  }[];
  doNotStudyList: {
    conceptId: string;
    conceptTitle: LocalizedString;
    masteryScore: number;
    reason: LocalizedString;
  }[];
}

export interface ExamReadiness {
  exam: ExamCategory;
  targetScorePercent: number;
  overallReadiness: number; // 0 - 100
  predictedScoreRange: { min: number; max: number };
  confidence: 'Low' | 'Medium' | 'High';
  metrics: {
    conceptMastery: number;
    questionAccuracy: number;
    recallStrength: number;
    speedScore: number;
    mockTestScore: number;
    consistencyScore: number;
  };
  weakestTopics: {
    conceptId: string;
    title: LocalizedString;
    subject: string;
    mastery: number;
    weightage: string;
  }[];
  strongestTopics: {
    conceptId: string;
    title: LocalizedString;
    subject: string;
    mastery: number;
  }[];
  gapPercent: number;
  recommendedAction: LocalizedString;
}

export interface MockExamQuestionState {
  questionId: string;
  selectedOption: number | null;
  status: 'not_visited' | 'not_answered' | 'answered' | 'marked_for_review' | 'answered_and_marked';
  timeSpentSec: number;
}

export interface MockExamSession {
  id: string;
  examId: string;
  title: string;
  durationMinutes: number;
  totalMarks: number;
  questions: Question[];
  sections: { id: string; name: string; questionIds: string[] }[];
  currentQuestionIndex: number;
  currentSectionId: string;
  answers: Record<string, MockExamQuestionState>;
  startTime: number;
  isSubmitted: boolean;
  score?: {
    totalScore: number;
    maxScore: number;
    accuracy: number;
    correctCount: number;
    incorrectCount: number;
    unattemptedCount: number;
    percentileEstimate: number;
    errorBreakdown: Record<ErrorType, number>;
  };
}

export interface CareerMilestone {
  stage: string;
  ageOrClass: string;
  title: LocalizedString;
  description: LocalizedString;
  exams: string[];
  keySubjects: string[];
  selectionRate: string;
  topInstitutes: string[];
}

export interface CareerRoadmap {
  id: string;
  title: LocalizedString;
  category: string;
  icon: string;
  shortDescription: LocalizedString;
  recommendedStream: string;
  avgStartingSalaryIndia: string;
  milestones: CareerMilestone[];
  skillsRequired: string[];
}

export interface ParentReportLog {
  id: string;
  timestamp: number;
  parentPhone: string;
  channel: 'whatsapp' | 'sms';
  reportType: 'daily_summary' | 'weekly_milestone' | 'exam_alert';
  messageSummary: string;
  status: 'sent' | 'delivered';
}

export interface StudentAccount {
  id: string;
  name: string;
  avatar: string;
  email: string;
  createdAt: number;
  selectedExam: ExamCategory;
  preferredLanguage: LanguageCode;
  goalCategory?: GoalCategory;
  selectedBoard?: EducationBoard;
  selectedTechTrack?: TechTrack;
  developerLevel?: DeveloperLevel;
  parentPhone?: string;
  parentName?: string;
  parentPreferredLanguage?: LanguageCode;
  parentMobileVerified?: boolean;
  isGoalConfirmed?: boolean;
  autoSendReportsToParent?: boolean;
  parentReportFrequency?: 'realtime_each_progress' | 'daily_summary' | 'milestones_only';
  lastAutoDispatchedAt?: number;
  authProvider?: 'google' | 'email' | 'phone' | 'roll_number' | 'guest';
  linkedMethods?: ('google' | 'email' | 'phone' | 'roll_number')[];
  emailVerified?: boolean;
  enableOfflineTTSLessons?: boolean; // Offline-first text-to-speech synthesis using browser's Web Speech API for all lessons
  ttsSpeechRate?: number; // Offline speech rate (0.8x, 1.0x, 1.25x)
  ttsAutoPlayLessons?: boolean; // Auto-narrate concept explanation blocks
  googleProfile?: {
    picture?: string;
    sub?: string;
    emailVerified?: boolean;
  };
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  preferredLanguage: LanguageCode;
  selectedExam: ExamCategory;
  targetScore: number;
  examDate: string;
  streakDays: number;
  lastActiveDate: string;
  activeRole: 'student' | 'parent';
  goalCategory?: GoalCategory;
  selectedBoard?: EducationBoard;
  selectedClass?: '9' | '10' | '11' | '12' | string;
  selectedTechTrack?: TechTrack;
  developerLevel?: DeveloperLevel;
  isOfflineMode?: boolean;
  parentPhone?: string;
  parentName?: string;
  parentPreferredLanguage?: LanguageCode;
  parentMobileVerified?: boolean;
  isGoalConfirmed?: boolean; // Set true ONLY when explicitly selected by student in wizard
  autoSendReportsToParent?: boolean; // Automatic background progress dispatch to parents mobile
  parentReportFrequency?: 'realtime_each_progress' | 'daily_summary' | 'milestones_only';
  lastAutoDispatchedAt?: number;
  authProvider?: 'google' | 'email' | 'phone' | 'roll_number' | 'guest';
  linkedMethods?: ('google' | 'email' | 'phone' | 'roll_number')[];
  emailVerified?: boolean;
  accentColor?: CustomAccentColor;
  enableOfflineTTSLessons?: boolean; // Offline-first text-to-speech synthesis using browser's Web Speech API for all lessons
  ttsSpeechRate?: number; // Offline speech rate (0.8x, 1.0x, 1.25x)
  ttsAutoPlayLessons?: boolean; // Auto-narrate concept explanation blocks
  googleProfile?: {
    picture?: string;
    sub?: string;
    emailVerified?: boolean;
  };
}

export type CustomAccentColor =
  | 'amber' // Amber Gold (Default)
  | 'blue' // Electric Blue
  | 'emerald' // Emerald Green
  | 'rose' // Rose Pink
  | 'purple' // Violet Purple
  | 'cyan'; // Cyber Cyan

export type TechTrack =
  | 'laravel'
  | 'python'
  | 'javascript'
  | 'ai_ml'
  | 'dsa'
  | 'system_design';

export type DeveloperLevel =
  | 'beginner' // Lowest in knowledge / Junior
  | 'intermediate' // Mid-Level Developer
  | 'senior' // Senior Engineer
  | 'top_class'; // Staff / Principal / Architect

export interface DevInterviewQuestion {
  id: string;
  track: TechTrack;
  level: DeveloperLevel;
  title: string;
  topic: string;
  prompt: string;
  codeSnippet?: string;
  codeLanguage?: string;
  expectedAnswerSummary: string;
  deepDiveFollowUps: string[];
  commonMisconceptions: string[];
  keyArchitecturePoints: string[];
  exampleSolution?: string;
}

export interface DevCodeChallenge {
  id: string;
  track: TechTrack;
  level: DeveloperLevel;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Staff-Architect';
  description: string;
  starterCode: string;
  language: string;
  expectedTimeMinutes: number;
  testCases: { input: string; expected: string; description: string }[];
  hints: string[];
  solutionCode: string;
  complexity: { time: string; space: string };
  bestPractices: string[];
}

export interface DevCodeReviewResult {
  score: number; // 0-100
  timeComplexity: string;
  spaceComplexity: string;
  codeQualityRating: 'Needs Improvement' | 'Acceptable' | 'Good' | 'Top-Class / Production-Ready';
  strengths: string[];
  bottlenecksOrBugs: string[];
  optimizedCodeSnippet?: string;
  architectureFeedback: string;
}

export type DevAnswerStyle =
  | 'senior_architecture' // Deep technical architecture, trade-offs & scale
  | 'star_method' // Situation, Task, Action, Result
  | 'concise_executive' // 60-second high-impact bullet summary
  | 'code_and_complexity'; // Algorithm logic, time/space complexity & code walkthrough

export interface DevGeneratedAnswerResult {
  structuredAnswer: string;
  keyTalkingPoints: string[];
  timeAndSpaceComplexity?: string;
  tradeOffs: string[];
  codeOrDiagramSnippet?: string;
  topPitfallsAvoided: string[];
  suggestedFollowUpPrep: string[];
  style: DevAnswerStyle;
  fallback?: boolean;
}

export interface CourseProgressSession {
  targetTab: string; // 'learn' | 'practice' | 'revision' | 'mock_exam' | 'dev_prep'
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterTitle: string;
  conceptId?: string;
  conceptTitle?: string;
  questionIndex?: number;
  progressPercent: number;
  lastVisitedTimestamp: number;
  totalCheckpointsCompleted?: number;
}

export interface ChapterTrophyBadge {
  id: string;
  chapterId: string;
  chapterTitle: LocalizedString;
  subjectName: string;
  subjectColor: string;
  iconName: 'trophy' | 'crown' | 'award' | 'flame' | 'zap' | 'shield_check' | 'star';
  tier: 'gold' | 'platinum' | 'diamond' | 'in_progress';
  tierLabel: string;
  masteryPercent: number;
  unlockedAt?: number;
  criteriaDescription: string;
  streakRequirementDays?: number;
  perfectRecallScore?: number;
}

export interface StreakModifierInfo {
  streakDays: number;
  streakMultiplier: number; // e.g. 1.35x
  cognitiveBoostPercent: number; // e.g. +35%
  freezeShieldsRemaining: number;
  weeklyDaysActive: boolean[]; // Mon-Sun
  nextMilestoneReward: string;
}

export interface ShareAchievementPayload {
  title: string;
  description: string;
  streakDays: number;
  accuracy: number;
  hoursStudied: number;
  targetExam?: string;
  board?: string;
  badgeEarned?: string;
}

export interface FocusModeState {
  isActive: boolean;
  activeSessionSeconds: number;
  targetTopic?: string;
  pomodoroMinutes: number;
  ambientSoundEnabled: boolean;
  ambientSoundType: 'rain' | 'whitenoise' | 'binaural_alpha' | 'off';
  blockedDistractionCount: number;
}

// Self-Healing (Auto-Debugging) Agentic Pipeline Types
export type SelfHealingPipelineStage =
  | 'idle'
  | 'error_intercepted'
  | 'agent1_root_cause_analysis'
  | 'agent2_patch_generation'
  | 'agent3_security_test_runner'
  | 'patch_auto_deployed'
  | 'quarantined_test_failed';

export interface SelfHealingErrorPayload {
  id: string;
  timestamp: number;
  type: 'frontend_runtime' | 'unhandled_rejection' | 'console_error' | 'backend_crash' | 'network_timeout';
  message: string;
  file?: string;
  line?: number;
  col?: number;
  stack?: string;
  componentStack?: string;
  environment: 'development' | 'production';
  url?: string;
  userAgent?: string;
  resolved?: boolean;
}

export interface SelfHealingPatchRecord {
  id: string;
  errorId: string;
  timestamp: number;
  rootCauseAnalysis: {
    diagnosis: string;
    vulnerabilityLevel: 'low' | 'medium' | 'high' | 'critical';
    affectedFile: string;
    affectedFunction?: string;
    identifiedBugPattern: string;
  };
  patchDiff: {
    originalSnippet: string;
    repairedSnippet: string;
    patchExplanation: string;
  };
  securityAndTestResults: {
    astSyntaxValid: boolean;
    authBypassCheckPassed: boolean;
    secretLeakCheckPassed: boolean;
    unitTestsExecuted: number;
    unitTestsPassed: number;
    testSuitePassed: boolean;
    executionTimeMs: number;
  };
  status: 'applied_and_verified' | 'quarantined_tests_failed' | 'rolled_back';
  deployedAt?: number;
}

export interface SelfHealingStatus {
  isInterceptorActive: boolean;
  totalErrorsCaptured: number;
  totalPatchesApplied: number;
  autoResolutionRate: number; // e.g. 96.5%
  recentErrors: SelfHealingErrorPayload[];
  patchHistory: SelfHealingPatchRecord[];
  activePipelineStage: SelfHealingPipelineStage;
  currentActiveError?: SelfHealingErrorPayload;
}

// ----------------------------------------------------
// 1. Quick Formula Cheat Sheet Types
// ----------------------------------------------------
export interface FormulaVariable {
  symbol: string;
  meaning: string;
  unit?: string;
  typicalValue?: string;
}

export interface FormulaEntry {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  chapterId: string;
  chapterName: string;
  latex: string;
  plainText: string;
  explanation: string;
  variables: FormulaVariable[];
  applications: string[];
  boardPyqFrequency?: 'High' | 'Very High' | 'Crucial';
  commonMistakes?: string[];
  tags: string[];
}

// ----------------------------------------------------
// 2. Voice Performance & Tone Analytics Types
// ----------------------------------------------------
export interface VoicePerformanceMetrics {
  durationSeconds: number;
  totalWords: number;
  wpm: number; // Words Per Minute (ideal 110-150)
  pacingRating: 'too_slow' | 'ideal' | 'too_fast';
  confidenceScore: number; // 0 - 100
  clarityScore: number; // 0 - 100
  hesitationCount: number; // Frequency of filler words / hesitation
  detectedFillers: string[];
  vocalPitchDynamic: 'monotone' | 'balanced' | 'enthusiastic';
  toneQuality: 'hesitant' | 'cautious' | 'confident_assertive' | 'mastery_level';
  keyInsights: string[];
  speechImprovementPlan: string[];
  evaluatedAt: number;
}

// ----------------------------------------------------
// 3. Peer Study Match Types
// ----------------------------------------------------
export interface PeerStudent {
  id: string;
  name: string;
  avatar: string;
  city: string;
  state: string;
  board: string;
  targetExam: string;
  streakDays: number;
  activeChapterId: string;
  activeChapterTitle: string;
  accuracy: number;
  status: 'online' | 'ready_to_match' | 'in_challenge';
}

export interface PeerChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  conceptName: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PeerCollaborativeSession {
  id: string;
  peer: PeerStudent;
  chapterId: string;
  chapterTitle: string;
  durationSeconds: number; // 600s = 10 minutes
  remainingSeconds: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: PeerChallengeQuestion[];
  studentAnswers: Record<number, number>; // questionIndex -> selectedOption
  peerAnswers: Record<number, number>;
  studentScore: number;
  peerScore: number;
  sharedNotes: string[];
  peerFeedbackBadge?: string;
  isFinished: boolean;
}

// ----------------------------------------------------
// 4. D3 Concept Mind Map & Hierarchy Graph Types
// ----------------------------------------------------
export interface MindMapNode {
  id: string;
  name: string;
  category: 'subject' | 'chapter' | 'core_concept' | 'sub_concept' | 'formula';
  masteryScore?: number; // 0 - 100
  difficulty?: 'easy' | 'medium' | 'hard';
  description?: string;
  formula?: string;
  prerequisites?: string[];
  children?: MindMapNode[];
  // D3 layout properties
  x?: number;
  y?: number;
  depth?: number;
  height?: number;
  data?: any;
}

export interface MindMapLink {
  source: string;
  target: string;
  relationship: 'belongs_to' | 'prerequisite' | 'derives_formula' | 'related_concept';
}

export interface MindMapGraphData {
  root: MindMapNode;
  totalConcepts: number;
  masteredCount: number;
  learningCount: number;
}


