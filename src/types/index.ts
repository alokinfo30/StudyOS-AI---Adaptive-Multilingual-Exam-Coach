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
  title: LocalizedString;
  description: LocalizedString;
  concepts: Concept[];
  targetMastery: number; // e.g. 90%
  highYieldWeightage: number; // e.g. 12% in JEE/Boards
}

export interface Subject {
  id: string;
  name: LocalizedString;
  icon: string;
  color: string;
  exam: ExamCategory;
  chapters: Chapter[];
}

export type GoalCategory =
  | 'school_board' // Class 10/12 Board Exams
  | 'competitive_entrance' // JEE Main, NEET UG, CUET
  | 'dev_interview'; // Developer Tech Interviews (Laravel, Python, JS, AI)

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
  category: 'in_text' | 'exercise' | 'exemplar' | 'board_pyq';
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
  prompt: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  numericalAnswer?: number;
  tolerance?: number;
  explanation: LocalizedString;
  hint1: LocalizedString;
  hint2: LocalizedString;
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
  authProvider?: 'google' | 'guest';
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
  authProvider?: 'google' | 'guest';
  googleProfile?: {
    picture?: string;
    sub?: string;
    emailVerified?: boolean;
  };
}

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

export interface ShareAchievementPayload {
  studentName: string;
  streakDays: number;
  accuracy: number;
  totalQuestions: number;
  examOrBoard: string;
  recentConceptOrChapter?: string;
  shareUrl: string;
}

