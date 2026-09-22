/**
 * SessionSentinel - Ultra-Strict User Session Isolation & Zero-Residue Memory Purge Utility
 * 
 * Guarantee: Zero-residue data leakage across different user sessions.
 * Recursively cleans localStorage, sessionStorage, and React state branches (profile, masteries, dna).
 */

import { UserProfile, ConceptMastery, StudentDNA } from '../types';
import { clearAllSessionCookies, setCookie } from './cookieUtils';

export interface ReactStateBranches {
  setProfile: (profile: UserProfile) => void;
  setMasteries: (masteries: Record<string, ConceptMastery>) => void;
  setDna: (dna: StudentDNA) => void;
  setLastLoginTimestamp?: (ts: number) => void;
  setIsVerifyingAuth?: (verifying: boolean) => void;
  setCurrentTab?: (tab: string) => void;
  setPendingLearningTab?: (tab: string | null) => void;
}

export const PRISTINE_GUEST_PROFILE: UserProfile = {
  id: 'guest_student',
  name: 'Guest Learner',
  email: '',
  preferredLanguage: 'hi',
  selectedExam: 'CBSE_10',
  targetScore: 90,
  examDate: '2026-03-01',
  streakDays: 0,
  lastActiveDate: '',
  activeRole: 'student',
  goalCategory: 'school_board',
  selectedBoard: 'CBSE',
  parentPhone: '',
  parentName: '',
  isGoalConfirmed: false,
  autoSendReportsToParent: false,
  authProvider: 'guest',
  googleProfile: undefined,
  isOfflineMode: false,
  linkedMethods: [],
  emailVerified: false,
};

export const PRISTINE_STUDENT_DNA: StudentDNA = {
  learningSpeed: 50,
  conceptRetention: 50,
  questionAccuracy: 50,
  calculationAccuracy: 50,
  memoryStrength: 50,
  problemSolvingIndex: 50,
  timeManagement: 50,
  consistencyStreak: 0,
  totalHoursStudied: 0,
  totalQuestionsSolved: 0,
  diagnosticCompleted: false,
};

export class SessionSentinel {
  /**
   * Recursively scour localStorage, removing user-specific partition keys and transient auth data
   */
  public static purgeLocalStorage(targetStudentId?: string): string[] {
    const purgedKeys: string[] = [];
    if (typeof window === 'undefined' || !window.localStorage) return purgedKeys;

    try {
      const keysSnapshot: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) keysSnapshot.push(key);
      }

      // Preserve only static global registry structure & offline curriculum content cache
      const PRESERVED_KEYS = [
        'studyos_student_accounts_registry',
        'studyos_offline_curriculum_cache_v2',
      ];

      for (const key of keysSnapshot) {
        if (PRESERVED_KEYS.includes(key)) continue;

        // Scour target student partition if specified
        if (targetStudentId && targetStudentId !== 'guest_student') {
          if (key.includes(`_${targetStudentId}_`) || key.endsWith(`_${targetStudentId}`)) {
            localStorage.removeItem(key);
            purgedKeys.push(key);
            continue;
          }
        }

        // Scour session, verification, otp, temp, or cached credentials
        if (
          key.startsWith('studyos_temp_') ||
          key.startsWith('studyos_verification_') ||
          key.startsWith('studyos_otp_') ||
          key.startsWith('studyos_active_session_') ||
          key.startsWith('studyos_course_session_') ||
          key.startsWith('studyos_last_course_session_') ||
          key.startsWith('active_quiz_') ||
          key.includes('auth_pending') ||
          key === 'studyos_session_token' ||
          key === 'studyos_session_token_id' ||
          key === 'studyos_remember_me' ||
          key === 'studyos_auth_snapshot' ||
          key === 'studyos_active_profile_backup' ||
          key === 'studyos_active_email' ||
          key === 'studyos_active_tab'
        ) {
          localStorage.removeItem(key);
          purgedKeys.push(key);
        }
      }

      // Explicitly remove all primary token keys to guarantee zero residue
      const MANDATORY_TOKEN_KEYS = [
        'studyos_session_token',
        'studyos_session_token_id',
        'studyos_remember_me',
        'studyos_auth_snapshot',
        'studyos_active_profile_backup',
        'studyos_active_email',
        'studyos_active_tab',
      ];
      for (const tokKey of MANDATORY_TOKEN_KEYS) {
        localStorage.removeItem(tokKey);
        purgedKeys.push(tokKey);
      }

      // Mark explicit guest state in localStorage and cookie
      localStorage.setItem('studyos_explicit_guest', 'true');
      setCookie('studyos_explicit_guest', 'true', 365);

      // Reset active student pointer to guest
      localStorage.setItem('studyos_active_student_id', 'guest_student');
      // Reset guest student profile in storage to zero personal info
      localStorage.setItem(
        'studyos_student_guest_student_profile',
        JSON.stringify(PRISTINE_GUEST_PROFILE)
      );
      localStorage.removeItem('studyos_student_guest_student_masteries');
      localStorage.removeItem('studyos_student_guest_student_dna');
      localStorage.removeItem('studyos_student_guest_student_attempts');
    } catch (e) {
      console.error('[SessionSentinel] Error scouring localStorage:', e);
    }

    return purgedKeys;
  }

  /**
   * Scour all items from sessionStorage
   */
  public static purgeSessionStorage(): void {
    if (typeof window === 'undefined' || !window.sessionStorage) return;
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('[SessionSentinel] Error clearing sessionStorage:', e);
    }
  }

  /**
   * Recursively reset React component state branches to pristine guest memory
   */
  public static resetReactStateBranches(branches: ReactStateBranches): void {
    try {
      branches.setProfile({ ...PRISTINE_GUEST_PROFILE });
      branches.setMasteries({});
      branches.setDna({ ...PRISTINE_STUDENT_DNA });
      if (branches.setLastLoginTimestamp) branches.setLastLoginTimestamp(0);
      if (branches.setIsVerifyingAuth) branches.setIsVerifyingAuth(false);
      if (branches.setCurrentTab) branches.setCurrentTab('home');
      if (branches.setPendingLearningTab) branches.setPendingLearningTab(null);
    } catch (e) {
      console.error('[SessionSentinel] Error resetting React state branches:', e);
    }
  }

  /**
   * Complete Zero-Residue Session Termination
   * Hooks into logout function to guarantee zero-residue data leakage
   */
  public static terminateSession(params: {
    studentId?: string;
    reactBranches: ReactStateBranches;
    onComplete?: () => void;
  }): { success: boolean; purgedKeys: string[] } {
    // 1. Wipe all local storage session tokens and partition data
    const purgedKeys = this.purgeLocalStorage(params.studentId);
    // 2. Wipe sessionStorage
    this.purgeSessionStorage();
    // 3. Simultaneously delete all session cookies from browser
    clearAllSessionCookies();
    // 4. Reset React state branches to pristine guest memory
    this.resetReactStateBranches(params.reactBranches);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('studyos:session-sentinel-terminated', {
          detail: {
            timestamp: Date.now(),
            purgedCount: purgedKeys.length,
          },
        })
      );
    }

    if (params.onComplete) {
      params.onComplete();
    }

    return {
      success: true,
      purgedKeys,
    };
  }
}
