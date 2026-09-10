/**
 * Apprentice Educator & Teacher Trainee Micro-Teaching Studio & Campus Reels Types
 * Supports B.Ed, BTC / D.El.Ed, and ITI Trainer Practicum Phases
 */

export type TeacherTrainingProgram =
  | 'b_ed' // Bachelor of Education
  | 'btc_deled' // Basic Training Certificate / Diploma in Elementary Education
  | 'iti_trainer' // ITI Craft Instructor Training Scheme (CITS)
  | 'ntt' // Nursery Teacher Training
  | 'm_ed'; // Master of Education

export type TeachingSkillCategory =
  | 'set_induction' // Skill of Introducing a Lesson
  | 'blackboard_skill' // Skill of Blackboard / Smartboard Writing
  | 'probing_questions' // Skill of Probing Questioning & Inquiry
  | 'stimulus_variation' // Skill of Stimulus Variation (Gestures, Pitch, Movement)
  | 'explanation_analogy' // Skill of Explaining with Real-world Analogies
  | 'reinforcement_praise' // Skill of Reinforcement & Student Encouragement
  | 'classroom_management' // Handling spontaneous student questions & engagement
  | 'lesson_closure'; // Skill of Achieving Closure & Recapitulation

export interface VirtualStudent {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  trait: 'curious' | 'hesitant' | 'enthusiastic' | 'thoughtful';
  sampleQuestion: string;
}

export type VideoVisualFilter =
  | 'none'
  | 'clarity'
  | 'bw'
  | 'sepia'
  | 'warm_studio'
  | 'cool_lecture';

export interface ClosedCaptionSegment {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface LoopPracticeTakeComparison {
  takeId: string;
  takeNumber: number;
  recordedAt: number;
  durationSeconds: number;
  speechPaceWpm: number;
  clarityScore: number;
  voiceModulationScore: number;
  keywordsCoveredCount: number;
  pedagogicalKeywords: string[];
  sampleTranscriptSnippet: string;
  isBestLoopTake?: boolean;
}

export type PracticePrivacySetting = 'public' | 'private';

export interface PrivacyAccessConfig {
  privacy: PracticePrivacySetting; // 'public' | 'private'
  allowedPeerIds?: string[]; // peer/instructor user IDs allowed to view if private
  allowedPeerNames?: string[]; // display names e.g. "Prof. Mishra", "Priya Singh"
  targetGroup?: string; // e.g. "Mentor & Direct Cohort Peers", "Faculty Supervisor Only"
}

export interface TeachingTake {
  id: string;
  takeNumber: number;
  durationSeconds: number;
  recordedAt: number;
  videoBlobUrl?: string;
  speechPaceWpm: number; // optimal: 110-140 WPM
  clarityScore: number; // 0-100%
  voiceModulationScore: number; // 0-100%
  studentEngagementScore: number; // 0-100%
  detectedPedagogicalKeywords: string[];
  rubricSelfRatings: {
    setInduction: number;
    blackboardWork: number;
    explanationClarity: number;
    probingQuestions: number;
    bodyLanguage: number;
    lessonClosure: number;
  };
  aiFeedback: {
    strengths: string[];
    improvements: string[];
    pedagogicalTip: string;
  };
  virtualStudentInteractions: {
    studentName: string;
    question: string;
    resolved: boolean;
  }[];
  isBestTake: boolean;
  trimRange?: {
    startSeconds: number;
    endSeconds: number;
  };
  isTrimmed?: boolean;
  closedCaptions?: ClosedCaptionSegment[];
  visualFilter?: VideoVisualFilter;
  isLoopPracticeTake?: boolean;
  privacyConfig?: PrivacyAccessConfig;
  topicTags?: string[];
}

export type JudgeRole =
  | 'colleague_trainee' // Peer trainee / B.Ed classmate
  | 'college_teacher' // College Professor / Practicum Supervisor
  | 'certified_judge'; // External NCTE/NCVT Evaluator

export interface RubricCriteriaScores {
  setInduction: number; // 1 to 10
  blackboardWork: number; // 1 to 10
  explanationClarity: number; // 1 to 10
  probingQuestions: number; // 1 to 10
  voiceAndBodyLanguage: number; // 1 to 10
  lessonClosure: number; // 1 to 10
}

export interface SegmentFeedback {
  id: string;
  timestampSeconds: number; // Specific segment second (e.g., 14 for 00:14)
  segmentLabel: string; // e.g. "Opening Set Induction Hook", "Blackboard Formula Notation"
  rubricCriterion: keyof RubricCriteriaScores | 'general';
  rating: number; // 1 to 10
  feedbackText: string;
  authorRole: JudgeRole;
  authorName: string;
  authorAvatar?: string;
  authorCollege?: string;
  createdAt: number;
  likes?: number;
  likedByUserIds?: string[];
  isMarkedHelpful?: boolean;
  markedHelpfulAt?: number;
  markedHelpfulBy?: string;
}

export interface TraineeEvaluation {
  id: string;
  evaluatorId: string;
  evaluatorName: string;
  evaluatorRole: JudgeRole;
  evaluatorDesignation: string;
  evaluatorAvatar: string;
  evaluatorCollege: string;
  rubricScores: RubricCriteriaScores;
  overallScore: number; // Average / 10
  qualitativeFeedback: string;
  timestamp: number;
  segmentFeedbacks?: SegmentFeedback[];
}

export interface TraineeComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: JudgeRole;
  authorCollege: string;
  text: string;
  timestamp: number;
  likes: number;
  likedByUserIds?: string[];
  isConstructiveFeedback?: boolean;
  isMarkedHelpful?: boolean;
  markedHelpfulAt?: number;
  markedHelpfulBy?: string;
}

export interface TeachingReelPost {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeAvatar: string;
  traineeProgram: TeacherTrainingProgram;
  traineeYear: string;
  collegeCampus: string;
  campusCity: string;
  subject: string;
  topicTitle: string;
  targetClass: string;
  skillFocus: TeachingSkillCategory;
  lessonObjectives: string[];
  blackboardKeyNotes: string[];
  durationSeconds: number;
  videoBlobUrl?: string;
  simulationStyle: 'physics_lab' | 'math_board' | 'iti_workshop' | 'chemistry_reactions' | 'interactive_classroom';
  likesCount: number;
  applauseCount: number;
  viewsCount: number;
  sharesCount: number;
  createdAt: number;
  bestTakeStats: {
    speechPaceWpm: number;
    clarityScore: number;
    takesCount: number;
  };
  rubricAverages: {
    setInduction: number;
    blackboardWork: number;
    explanationClarity: number;
    probingQuestions: number;
    voiceAndBodyLanguage: number;
    lessonClosure: number;
    overallAverage: number;
    totalEvaluationsCount: number;
  };
  evaluations: TraineeEvaluation[];
  comments: TraineeComment[];
  segmentFeedbacks?: SegmentFeedback[];
  closedCaptions?: ClosedCaptionSegment[];
  visualFilter?: VideoVisualFilter;
  privacyConfig?: PrivacyAccessConfig;
  topicTags?: string[];
}

export interface UserModerationRecord {
  userId: string;
  userName: string;
  userRole: JudgeRole;
  collegeCampus: string;
  disclaimerAccepted: boolean;
  disclaimerAcceptedAt?: number;
  violationCount: number; // Max 3 before auto-ban
  isBanned: boolean;
  bannedAt?: number;
  banReason?: string;
  recentViolations: {
    timestamp: number;
    blockedText: string;
    flaggedKeywords: string[];
    violationType: 'abusive_comment' | 'inappropriate_content';
  }[];
}

export interface TeachingSessionDraft {
  id: string;
  userId: string;
  topicTitle: string;
  subject: string;
  targetClass: string;
  program: TeacherTrainingProgram;
  skillFocus: TeachingSkillCategory;
  lessonObjectives: string;
  blackboardKeyNotes: string[];
  take?: TeachingTake;
  rawDurationSeconds: number;
  trimRange: {
    startSeconds: number;
    endSeconds: number;
  };
  isTrimmed: boolean;
  lightingQualityScore?: number;
  audioQualityScore?: number;
  speechPaceWpm?: number;
  savedAt: number;
  updatedAt: number;
  notes?: string;
  simulationStyle?: 'physics_lab' | 'math_board' | 'iti_workshop' | 'chemistry_reactions' | 'interactive_classroom';
  closedCaptions?: ClosedCaptionSegment[];
  visualFilter?: VideoVisualFilter;
  privacyConfig?: PrivacyAccessConfig;
  topicTags?: string[];
}

export interface CampusLeaderboardEntry {
  rank: number;
  previousRank: number;
  traineeId: string;
  traineeName: string;
  traineeAvatar: string;
  traineeProgram: TeacherTrainingProgram;
  traineeYear: string;
  collegeCampus: string;
  campusCity: string;
  peerReviewScore: number; // 1 to 10
  totalEvaluationsCount: number;
  totalEngagementScore: number;
  compositeScore: number;
  totalTakesRecorded: number;
  reelsPublishedCount: number;
  featuredTopicTitle: string;
  featuredReelId?: string;
  likesCount: number;
  applauseCount: number;
  viewsCount: number;
  topSkillBadge: string;
  isCurrentUser?: boolean;
}
