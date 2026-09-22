export type Dialect = 
  | 'bhojpuri' 
  | 'awadhi' 
  | 'maithili' 
  | 'magahi' 
  | 'bundelkhandi' 
  | 'chhattisgarhi' 
  | 'marwari';

export type StandardLanguage = 'standard_hindi' | 'english';

export type GradeLevel = 1 | 2 | 3;

export type SubjectTrack = 'hindi_fln' | 'math_numeracy' | 'english_letters';

export type TaRLBand = 1 | 2 | 3;

export interface BoundingBoxError {
  label: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  severity: 'critical' | 'moderate' | 'success';
}

export interface SlateDiagnosis {
  id: string;
  studentId?: string;
  childName: string;
  grade: GradeLevel;
  dialect: Dialect;
  subject: SubjectTrack;
  detectedText: string;
  errorType: string;
  errorSubtype: string;
  accuracyScore: number;
  boundingBoxes: BoundingBoxError[];
  rootMisconception: string;
  remediationTip1Min: string;
  recommendedTaRLBand: TaRLBand;
  audioBridgeScript: string;
  timestamp: number;
  imageThumbnail?: string;
  syncStatus: 'synced' | 'pending';
}

export interface StudentProfile {
  id: string;
  name: string;
  rollNumber: number;
  grade: GradeLevel;
  homeDialect: Dialect;
  currentBand: TaRLBand;
  avatar: string;
  phonicsAccuracy: number;
  attendanceToday: boolean;
  peerLeaderEligible: boolean;
  notes?: string;
}

export interface OralBridgeResult {
  detectedDialect: string;
  vernacularPhrasing: string;
  standardEquivalent: string;
  phonemicDifference: string;
  homeDialectPraiseBridge: string;
  classroomPracticeChant: string;
  fluencyScore: number;
}

export interface TaRLActivity {
  title: string;
  duration: string;
  materialsNeeded: string;
  instructions: string;
  peerLeaderRole: string;
}

export interface TaRLPlan {
  band1Activity: TaRLActivity;
  band2Activity: TaRLActivity;
  band3Activity: TaRLActivity;
  blackboardChalkPrompt: string;
  rotationTimerMinutes: number;
}

export interface DecodableStory {
  id: string;
  title: string;
  dialectTitle: string;
  grade: GradeLevel;
  level: number;
  phonemeFocus: string[];
  vocabularyVernacular: { dialect: string; standard: string; meaning: string }[];
  sentences: {
    standard: string;
    dialect: string;
  }[];
  comprehensionQuestions: string[];
}
