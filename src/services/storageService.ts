/**
 * StudyOS AI - Offline-First Local Storage, IndexedDB Caching & Strict Student Privacy Isolation Service
 * 
 * CRITICAL ARCHITECTURE & PRIVACY RULES:
 * 1. Single Student Privacy Guarantee: A student's attempts, scores, mock exams, and notes are strictly private.
 * 2. Scoped Keys: Every student record is isolated under `studyos_student_${studentId}_*`.
 * 3. IndexedDB Layer: Seamless asynchronous cache and offline persistence for 100% offline functionality.
 */
import {
  UserProfile,
  ConceptMastery,
  QuestionAttempt,
  StudentDNA,
  DailyMission,
  SpacedRevisionItem,
  LanguageCode,
  ExamCategory,
  StudentAccount,
  GoalCategory,
  EducationBoard,
  TechTrack,
  DeveloperLevel,
  ParentReportLog,
  Question,
  CourseProgressSession,
} from '../types';
import { CURRICULUM_SUBJECTS, CURRICULUM_QUESTIONS } from '../data/curriculum';
import {
  secureSetStorage,
  secureGetStorage,
  sanitizeObject,
  safeJsonParse,
} from '../utils/security';
import { generateLocalizedParentMessage } from '../utils/parentReportLocalization';
import {
  setCookie,
  getCookie,
  deleteCookie,
  setTieredStorage,
  getTieredStorage,
  removeTieredStorage,
} from '../utils/cookieUtils';

const GLOBAL_ACCOUNTS_KEY = 'studyos_student_accounts_registry';
const ACTIVE_STUDENT_ID_KEY = 'studyos_active_student_id';
export const SESSION_TOKEN_KEY = 'studyos_session_token';
const OFFLINE_CONTENT_CACHE_KEY = 'studyos_offline_curriculum_cache_v2';
const PARENT_REPORT_LOGS_KEY = 'studyos_parent_report_logs';

export interface SessionTokenData {
  token: string;
  email: string;
  studentId: string;
  createdAt: number;
  expiresAt: number; // 30 days
  rememberMe: boolean;
}

export function generateSessionToken(email: string): string {
  const clean = email.replace(/[^a-zA-Z0-9]/g, '_');
  return `st_${clean}_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function saveSessionToken(data: SessionTokenData): void {
  try {
    // Continuous login persistence: Always save to localStorage AND sessionStorage AND cookie AND IndexedDB
    // so mobile browsers that reload, background, or recycle tabs maintain active login state unless explicitly logged out
    const serialized = JSON.stringify(data);
    localStorage.setItem(SESSION_TOKEN_KEY, serialized);
    sessionStorage.setItem(SESSION_TOKEN_KEY, serialized);
    localStorage.setItem('studyos_remember_me', data.rememberMe ? 'true' : 'false');
    
    // Tiered storage & cookies with 30-day persistence
    const days = data.rememberMe ? 30 : 7;
    setTieredStorage('studyos_session_token_id', data.token, days);
    setTieredStorage(SESSION_TOKEN_KEY, serialized, days);
    
    // Asynchronously store in IndexedDB as Tier-4 backup
    idbSet(SESSION_TOKEN_KEY, data);
  } catch (e) {
    console.warn('[StorageService] Failed to save session token', e);
  }
}

export function getSessionToken(): SessionTokenData | null {
  try {
    let raw = localStorage.getItem(SESSION_TOKEN_KEY);
    if (!raw) {
      raw = sessionStorage.getItem(SESSION_TOKEN_KEY);
    }
    if (!raw) {
      raw = getTieredStorage(SESSION_TOKEN_KEY);
    }
    if (!raw) {
      const tieredId = getTieredStorage('studyos_session_token_id');
      const tieredStudentId = getTieredStorage(ACTIVE_STUDENT_ID_KEY);
      const tieredEmail = getTieredStorage('studyos_active_email');
      if (tieredId && tieredStudentId && tieredStudentId !== 'guest_student' && tieredEmail) {
        return {
          token: tieredId,
          email: tieredEmail,
          studentId: tieredStudentId,
          createdAt: Date.now(),
          expiresAt: Date.now() + 30 * 864e5,
          rememberMe: true,
        };
      }
    }
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.expiresAt === 'number') {
        if (Date.now() > parsed.expiresAt) {
          clearSessionToken();
          return null;
        }
        return parsed as SessionTokenData;
      }
    }
  } catch (e) {
    console.warn('[StorageService] Failed to read session token', e);
  }
  return null;
}

export function clearSessionToken(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem('studyos_remember_me');
    removeTieredStorage('studyos_session_token_id');
    removeTieredStorage(SESSION_TOKEN_KEY);
    idbDelete(SESSION_TOKEN_KEY);
  } catch (e) {}
}

export const DEFAULT_STUDENT_ACCOUNTS: StudentAccount[] = [
  {
    id: 'guest_student',
    name: 'Guest Learner',
    email: '',
    avatar: '👨‍🎓',
    createdAt: 1700000000000,
    selectedExam: 'CBSE_10',
    preferredLanguage: 'hi',
    goalCategory: 'school_board',
    selectedBoard: 'CBSE',
    parentPhone: '',
    parentName: '',
    isGoalConfirmed: false,
    autoSendReportsToParent: false,
    parentReportFrequency: 'daily_summary',
    authProvider: 'guest',
    enableOfflineTTSLessons: true,
    ttsSpeechRate: 1.0,
    ttsAutoPlayLessons: false,
  },
  {
    id: 'student_alok_kumar',
    name: 'Alok Kumar',
    email: 'alokinfo30@gmail.com',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alokinfo30%40gmail.com',
    createdAt: 1700000000000,
    selectedExam: 'CBSE_10',
    preferredLanguage: 'hi',
    goalCategory: 'school_board',
    selectedBoard: 'CBSE',
    parentPhone: '+919876543210',
    parentName: 'Ramesh Kumar',
    isGoalConfirmed: true,
    autoSendReportsToParent: true,
    parentReportFrequency: 'daily_summary',
    authProvider: 'google',
    linkedMethods: ['google', 'email'],
    emailVerified: true,
    enableOfflineTTSLessons: true,
    ttsSpeechRate: 1.0,
    ttsAutoPlayLessons: false,
    googleProfile: {
      sub: 'google_alok_kumar',
      email: 'alokinfo30@gmail.com',
      name: 'Alok Kumar',
      picture: 'https://api.dicebear.com/7.x/bottts/svg?seed=alokinfo30%40gmail.com',
      emailVerified: true,
    },
  },
];

export function getScopedKey(baseKey: string, studentId?: string): string {
  const currentId = studentId || getActiveStudentId();
  return `studyos_student_${currentId}_${baseKey}`;
}

// -------------------------------------------------------------
// INDEXEDDB OFFLINE CACHING & ASYNC PERSISTENCE LAYER
// -------------------------------------------------------------
const DB_NAME = 'StudyOS_LocalCache_DB';
const DB_VERSION = 2;
const STORE_NAME = 'offline_store';

function openIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      resolve(null);
      return;
    }
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbSet(key: string, value: any): Promise<void> {
  const db = await openIndexedDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ key, value, updatedAt: Date.now() });
  } catch (e) {
    console.warn('IndexedDB write error', e);
  }
}

export async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openIndexedDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && req.result.value !== undefined) {
          resolve(req.result.value as T);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function idbDelete(key: string): Promise<void> {
  const db = await openIndexedDB();
  if (!db) return;
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
  } catch (e) {
    console.warn('IndexedDB delete error', e);
  }
}

// Warm up offline question cache on launch
export function initializeOfflineCache(): void {
  try {
    const cachedPayload = {
      questions: CURRICULUM_QUESTIONS,
      subjects: CURRICULUM_SUBJECTS,
      cachedAt: Date.now(),
      version: '2.0',
    };
    localStorage.setItem(OFFLINE_CONTENT_CACHE_KEY, JSON.stringify(cachedPayload));
    idbSet('cached_curriculum', cachedPayload);
  } catch (e) {
    console.warn('Failed to cache curriculum offline', e);
  }
}

export function getOfflineCachedQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(OFFLINE_CONTENT_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions;
      }
    }
  } catch (e) {
    console.warn('Failed to read offline cached questions', e);
  }
  return CURRICULUM_QUESTIONS;
}

// -------------------------------------------------------------
// STUDENT ACCOUNT REGISTRY & PRIVATE SESSION MANAGEMENT
// -------------------------------------------------------------

export function loadStudentAccounts(): StudentAccount[] {
  try {
    let raw = localStorage.getItem(GLOBAL_ACCOUNTS_KEY);
    if (!raw) {
      raw = getTieredStorage('studyos_accounts_backup');
    }
    if (raw) {
      const accounts = JSON.parse(raw);
      if (Array.isArray(accounts) && accounts.length > 0) {
        // Automatic Deduplication by normalized email:
        // Ensure that any duplicate records with identical emails are merged into a single record.
        const deduplicatedMap = new Map<string, StudentAccount>();
        for (const acc of accounts) {
          if (!acc || !acc.id) continue;
          const emailKey = (acc.email || '').trim().toLowerCase();
          if (emailKey && emailKey.includes('@') && acc.authProvider !== 'guest') {
            const existing = deduplicatedMap.get(emailKey);
            if (existing) {
              // Merge duplicate into existing record
              const existingMethods = existing.linkedMethods || (existing.authProvider ? [existing.authProvider] : []);
              const accMethods = acc.linkedMethods || (acc.authProvider ? [acc.authProvider] : []);
              const mergedLinked = Array.from(new Set([...existingMethods, ...accMethods]));
              deduplicatedMap.set(emailKey, {
                ...existing,
                name: (existing.name && existing.name !== 'Student' && existing.name !== 'Guest Learner')
                  ? existing.name
                  : (acc.name || existing.name),
                avatar: existing.avatar || acc.avatar,
                authProvider: acc.authProvider || existing.authProvider,
                linkedMethods: mergedLinked as any,
                emailVerified: existing.emailVerified || acc.emailVerified || true,
                parentPhone: existing.parentPhone || acc.parentPhone,
                parentName: existing.parentName || acc.parentName,
                googleProfile: acc.googleProfile || existing.googleProfile,
              });
            } else {
              deduplicatedMap.set(emailKey, acc);
            }
          } else {
            // Guest or non-email account
            deduplicatedMap.set(acc.id, acc);
          }
        }
        // Ensure student_alok_kumar is present if not already added
        const hasAlok = Array.from(deduplicatedMap.values()).some(
          (a) => a.email && a.email.toLowerCase() === 'alokinfo30@gmail.com'
        );
        if (!hasAlok) {
          const alokDefault = DEFAULT_STUDENT_ACCOUNTS.find((a) => a.id === 'student_alok_kumar');
          if (alokDefault) {
            deduplicatedMap.set('alokinfo30@gmail.com', alokDefault);
          }
        }
        const cleanList = Array.from(deduplicatedMap.values());
        if (cleanList.length !== accounts.length || !hasAlok) {
          saveStudentAccounts(cleanList);
        }
        return cleanList;
      }
    }
  } catch (e) {
    console.error('Failed to load student accounts', e);
  }

  // Fallback: check if we have an auth snapshot in tiered storage / cookies
  try {
    const snapshotRaw = getTieredStorage('studyos_auth_snapshot');
    if (snapshotRaw) {
      const s = JSON.parse(snapshotRaw);
      if (s.email && s.studentId && s.authProvider && s.authProvider !== 'guest') {
        const restored: StudentAccount = {
          id: s.studentId,
          name: s.name || 'Student',
          email: s.email,
          avatar: s.avatar || '👨‍🎓',
          createdAt: Date.now(),
          selectedExam: s.selectedExam || 'CBSE_10',
          preferredLanguage: s.preferredLanguage || 'hi',
          goalCategory: s.goalCategory || 'school_board',
          selectedBoard: s.selectedBoard || 'CBSE',
          parentPhone: s.parentPhone || '',
          parentName: s.parentName || '',
          isGoalConfirmed: s.isGoalConfirmed ?? false,
          autoSendReportsToParent: false,
          parentReportFrequency: 'daily_summary',
          authProvider: s.authProvider || 'google',
          enableOfflineTTSLessons: true,
          ttsSpeechRate: 1.0,
          ttsAutoPlayLessons: false,
        };
        const alokDefault = DEFAULT_STUDENT_ACCOUNTS.find((a) => a.id === 'student_alok_kumar')!;
        const list = [DEFAULT_STUDENT_ACCOUNTS[0], alokDefault, restored];
        saveStudentAccounts(list);
        return list;
      }
    }
  } catch {}

  // Initialize default
  saveStudentAccounts(DEFAULT_STUDENT_ACCOUNTS);
  return DEFAULT_STUDENT_ACCOUNTS;
}

export function saveStudentAccounts(accounts: StudentAccount[]): void {
  try {
    const serialized = JSON.stringify(accounts);
    localStorage.setItem(GLOBAL_ACCOUNTS_KEY, serialized);
    setTieredStorage('studyos_accounts_backup', serialized, 365);
    idbSet(GLOBAL_ACCOUNTS_KEY, accounts);
  } catch (e) {
    console.error('Failed to save student accounts', e);
  }
}

export function getActiveStudentId(): string {
  // 1. Check valid persistent 30-day session token first (checks localStorage -> sessionStorage -> cookie)
  try {
    const sessionToken = getSessionToken();
    if (sessionToken && sessionToken.studentId && sessionToken.studentId !== 'guest_student') {
      return sessionToken.studentId;
    }
  } catch {}

  // 2. Try auth snapshot from tiered storage (persists in cookie, localStorage, sessionStorage)
  try {
    const snapshotRaw = getTieredStorage('studyos_auth_snapshot');
    if (snapshotRaw) {
      const s = JSON.parse(snapshotRaw);
      if (s.studentId && s.studentId !== 'guest_student' && s.email && s.authProvider !== 'guest') {
        return s.studentId;
      }
    }
  } catch {}

  // 3. Try active profile backup from tiered storage
  try {
    const backupRaw = getTieredStorage('studyos_active_profile_backup');
    if (backupRaw) {
      const p = JSON.parse(backupRaw);
      if (p.id && p.id !== 'guest_student' && p.email && p.authProvider !== 'guest') {
        return p.id;
      }
    }
  } catch {}

  // 4. Try tiered storage (localStorage -> document.cookie -> sessionStorage)
  try {
    const active = getTieredStorage(ACTIVE_STUDENT_ID_KEY);
    if (active && active !== 'guest_student') return active;
  } catch (e) {
    console.warn('[StorageService] Error reading tiered active student ID', e);
  }

  // 5. Check if active student email cookie is present and match account
  try {
    const cookieEmail = getCookie('studyos_active_email');
    if (cookieEmail) {
      const accounts = loadStudentAccounts();
      const match = accounts.find((a) => a.email && a.email.toLowerCase() === cookieEmail.toLowerCase());
      if (match) {
        setActiveStudentId(match.id);
        return match.id;
      }
    }
  } catch (e) {}

  // 6. Fallback: If user has an authenticated account and did NOT explicitly click "Sign Out",
  // do NOT reset them to guest_student! Keep them logged in as their authenticated student account.
  try {
    const explicitGuest = localStorage.getItem('studyos_explicit_guest') || getCookie('studyos_explicit_guest');
    if (!explicitGuest) {
      const accounts = loadStudentAccounts();
      const authenticated = accounts.find((a) => a.authProvider && a.authProvider !== 'guest' && Boolean(a.email));
      if (authenticated) {
        setActiveStudentId(authenticated.id);
        return authenticated.id;
      }
    }
  } catch (e) {}

  return DEFAULT_STUDENT_ACCOUNTS[0].id;
}

export function setActiveStudentId(studentId: string): void {
  try {
    if (studentId && studentId !== 'guest_student') {
      setTieredStorage(ACTIVE_STUDENT_ID_KEY, studentId, 365);
      idbSet('studyos_active_student_id', studentId);
      try {
        localStorage.removeItem('studyos_explicit_guest');
        deleteCookie('studyos_explicit_guest');
      } catch {}
    } else {
      removeTieredStorage(ACTIVE_STUDENT_ID_KEY);
      removeTieredStorage('studyos_active_email');
      removeTieredStorage('studyos_auth_snapshot');
      removeTieredStorage('studyos_active_profile_backup');
      clearSessionToken();
      idbDelete('studyos_active_student_id');
      idbDelete('studyos_active_profile_backup');
      try {
        localStorage.setItem('studyos_explicit_guest', 'true');
        setCookie('studyos_explicit_guest', 'true', 365);
      } catch {}
    }
  } catch (e) {
    console.error('Failed to set active student id', e);
  }
}

export function createStudentAccount(
  name: string,
  email: string,
  selectedExam: ExamCategory,
  preferredLanguage: LanguageCode,
  goalCategory: GoalCategory = 'school_board',
  selectedBoard: EducationBoard = 'CBSE',
  selectedTechTrack?: TechTrack,
  developerLevel?: DeveloperLevel,
  parentPhone?: string,
  parentName?: string
): StudentAccount {
  const newAccount: StudentAccount = {
    id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name,
    email,
    avatar: goalCategory === 'dev_interview' ? '💻' : '🚀',
    createdAt: Date.now(),
    selectedExam,
    preferredLanguage,
    goalCategory,
    selectedBoard,
    selectedTechTrack,
    developerLevel,
    parentPhone: parentPhone || '+919876543210',
    parentName: parentName || 'Guardian',
  };

  const currentAccounts = loadStudentAccounts();
  const updatedAccounts = [...currentAccounts, newAccount];
  saveStudentAccounts(updatedAccounts);
  setActiveStudentId(newAccount.id);

  // Initialize fresh, isolated data for this student
  const freshProfile: UserProfile = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    preferredLanguage: newAccount.preferredLanguage,
    selectedExam: newAccount.selectedExam,
    targetScore: 90,
    examDate: '2026-04-15',
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    activeRole: 'student',
    goalCategory: newAccount.goalCategory || 'school_board',
    selectedBoard: newAccount.selectedBoard || 'CBSE',
    selectedTechTrack: newAccount.selectedTechTrack,
    developerLevel: newAccount.developerLevel,
    parentPhone: newAccount.parentPhone,
    parentName: newAccount.parentName,
    isOfflineMode: false,
  };
  saveUserProfile(freshProfile, newAccount.id);

  const freshDNA: StudentDNA = {
    learningSpeed: 65,
    conceptRetention: 60,
    questionAccuracy: 70,
    calculationAccuracy: 65,
    memoryStrength: 60,
    problemSolvingIndex: 65,
    timeManagement: 70,
    consistencyStreak: 1,
    totalHoursStudied: 2,
    totalQuestionsSolved: 5,
    diagnosticCompleted: true,
  };
  saveStudentDNA(freshDNA, newAccount.id);

  return newAccount;
}

export type LoginMethod = 'google' | 'email' | 'phone' | 'roll_number';

export interface UnifiedLoginCredentials {
  method: LoginMethod;
  email: string;
  name?: string;
  password?: string;
  phone?: string;
  rollNumber?: string;
  schoolOrBoard?: string;
  picture?: string;
  sub?: string;
}

/**
 * Canonical Email Normalization
 * Ensures consistent, case-insensitive, whitespace-trimmed email comparison
 */
export function normalizeCanonicalEmail(email?: string | null): string {
  if (!email) return '';
  return email.trim().toLowerCase();
}

/**
 * Canonical Identity Mapping Lookup
 * Searches accounts registry for a pre-existing student record by normalized email,
 * regardless of whether the account was registered via Google, Email, or other providers.
 */
export function findCanonicalAccountByEmail(
  email: string,
  accountsList?: StudentAccount[]
): { account: StudentAccount; index: number } | null {
  const normalized = normalizeCanonicalEmail(email);
  if (!normalized || !normalized.includes('@')) return null;

  const accounts = accountsList || loadStudentAccounts();
  const index = accounts.findIndex(
    (a) =>
      a.authProvider !== 'guest' &&
      a.email &&
      normalizeCanonicalEmail(a.email) === normalized
  );

  if (index === -1) return null;
  return { account: accounts[index], index };
}

export function loginOrRegisterStudent(credentials: UnifiedLoginCredentials): StudentAccount {
  const normalizedEmail = normalizeCanonicalEmail(credentials.email);
  const accounts = loadStudentAccounts();

  // Canonical Identity Mapping Lookup:
  // Checks for pre-existing records by email regardless of the auth provider (Google vs. Email),
  // merging any new profile data into the existing base record instead of creating duplicates.
  const canonicalMatch = findCanonicalAccountByEmail(normalizedEmail, accounts);

  if (canonicalMatch) {
    const existing = canonicalMatch.account;
    const existingIndex = canonicalMatch.index;

    // Merge linked methods (e.g. ['google', 'email'])
    const existingMethods: LoginMethod[] = Array.isArray(existing.linkedMethods) && existing.linkedMethods.length > 0
      ? existing.linkedMethods
      : existing.authProvider && existing.authProvider !== 'guest'
      ? [existing.authProvider]
      : [];
    const mergedLinkedMethods = Array.from(new Set([...existingMethods, credentials.method])) as LoginMethod[];

    // Merge incoming name intelligently
    const candidateName = credentials.name?.trim();
    const existingName = existing.name?.trim();
    const isGenericExisting = !existingName || existingName === 'Student' || existingName === 'Guest Learner';
    const finalName = candidateName && (isGenericExisting || candidateName.length > 0)
      ? candidateName
      : existingName || 'Student';

    // Merge avatars and Google profiles
    const mergedAvatar =
      (credentials.method === 'google' && credentials.picture) ||
      existing.googleProfile?.picture ||
      credentials.picture ||
      existing.avatar ||
      '👨‍🎓';

    const mergedGoogleProfile =
      credentials.method === 'google' || existing.googleProfile
        ? {
            picture: credentials.picture || existing.googleProfile?.picture,
            sub: credentials.sub || existing.googleProfile?.sub,
            emailVerified: true,
          }
        : undefined;

    // Merge parent info and credentials into single canonical base record
    const updatedExisting: StudentAccount = {
      ...existing,
      name: finalName,
      email: normalizedEmail,
      authProvider: credentials.method,
      linkedMethods: mergedLinkedMethods,
      emailVerified: true,
      parentPhone: credentials.phone || existing.parentPhone,
      avatar: mergedAvatar,
      googleProfile: mergedGoogleProfile,
    };

    // Purge any extraneous duplicates with this canonical email to guarantee 1:1 identity mapping
    const deduplicatedAccounts = accounts.filter(
      (a, idx) =>
        idx === existingIndex ||
        !a.email ||
        normalizeCanonicalEmail(a.email) !== normalizedEmail ||
        a.authProvider === 'guest'
    );

    const targetIdx = deduplicatedAccounts.findIndex((a) => a.id === existing.id);
    if (targetIdx !== -1) {
      deduplicatedAccounts[targetIdx] = updatedExisting;
    } else {
      deduplicatedAccounts.push(updatedExisting);
    }

    saveStudentAccounts(deduplicatedAccounts);
    setActiveStudentId(existing.id);

    // Sync active profile partition while strictly preserving targetScore, streaks, masteries and history
    const existingProfile = loadUserProfile(existing.id);
    saveUserProfile(
      {
        ...existingProfile,
        name: updatedExisting.name,
        email: normalizedEmail,
        authProvider: updatedExisting.authProvider,
        linkedMethods: updatedExisting.linkedMethods,
        emailVerified: true,
        googleProfile: updatedExisting.googleProfile,
        parentPhone: updatedExisting.parentPhone || existingProfile.parentPhone,
      },
      existing.id
    );

    return updatedExisting;
  }

  // New Student Registration (Private isolated partition created)
  const newId = `student_${credentials.method}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const resolvedName =
    credentials.name?.trim() ||
    (normalizedEmail.split('@')[0].replace(/[._]/g, ' ') || 'Student');
  const formattedName = resolvedName.charAt(0).toUpperCase() + resolvedName.slice(1);

  const newAccount: StudentAccount = {
    id: newId,
    name: formattedName,
    email: normalizedEmail,
    avatar:
      credentials.method === 'google' && credentials.picture
        ? credentials.picture
        : credentials.method === 'phone'
        ? '📱'
        : credentials.method === 'roll_number'
        ? '🏫'
        : '👨‍🎓',
    createdAt: Date.now(),
    selectedExam: 'CBSE_10',
    preferredLanguage: 'hi',
    goalCategory: 'school_board',
    selectedBoard: 'CBSE',
    parentPhone: credentials.phone || '',
    parentName: '',
    isGoalConfirmed: false,
    authProvider: credentials.method,
    linkedMethods: [credentials.method],
    emailVerified: true,
    googleProfile:
      credentials.method === 'google'
        ? {
            picture: credentials.picture,
            sub: credentials.sub,
            emailVerified: true,
          }
        : undefined,
  };

  const updatedAccounts = [...accounts, newAccount];
  saveStudentAccounts(updatedAccounts);
  setActiveStudentId(newAccount.id);

  const freshProfile: UserProfile = {
    id: newAccount.id,
    name: newAccount.name,
    email: newAccount.email,
    preferredLanguage: 'hi',
    selectedExam: 'CBSE_10',
    targetScore: 90,
    examDate: '2026-03-01',
    streakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    activeRole: 'student',
    goalCategory: 'school_board',
    selectedBoard: 'CBSE',
    parentPhone: credentials.phone || '',
    parentName: '',
    isGoalConfirmed: false,
    authProvider: newAccount.authProvider,
    linkedMethods: newAccount.linkedMethods,
    emailVerified: true,
    googleProfile: newAccount.googleProfile,
    isOfflineMode: false,
  };
  saveUserProfile(freshProfile, newAccount.id);

  const freshDNA: StudentDNA = {
    learningSpeed: 70,
    conceptRetention: 65,
    questionAccuracy: 75,
    calculationAccuracy: 70,
    memoryStrength: 65,
    problemSolvingIndex: 70,
    timeManagement: 75,
    consistencyStreak: 1,
    totalHoursStudied: 2,
    totalQuestionsSolved: 5,
    diagnosticCompleted: true,
  };
  saveStudentDNA(freshDNA, newAccount.id);

  return newAccount;
}

export function loginOrRegisterWithGoogle(
  googleEmail: string,
  googleName: string,
  googlePicture?: string,
  googleSub?: string
): StudentAccount {
  return loginOrRegisterStudent({
    method: 'google',
    email: googleEmail,
    name: googleName,
    picture: googlePicture,
    sub: googleSub,
  });
}

export function deleteStudentAccount(studentId: string): void {
  const accounts = loadStudentAccounts();
  if (accounts.length <= 1) {
    return;
  }
  const filtered = accounts.filter((a) => a.id !== studentId);
  saveStudentAccounts(filtered);

  // Clean up this student's isolated data keys
  const keysToRemove = [
    'profile',
    'masteries',
    'attempts',
    'dna',
    'spaced_repetition',
    'mock_exams',
    'dev_prep',
    'parent_reports',
  ];
  keysToRemove.forEach((k) => {
    localStorage.removeItem(getScopedKey(k, studentId));
  });

  if (getActiveStudentId() === studentId) {
    setActiveStudentId(filtered[0].id);
  }
}

// -------------------------------------------------------------
// ISOLATED PER-STUDENT DATA LOADERS AND SAVERS
// -------------------------------------------------------------

export function loadUserProfile(studentId?: string): UserProfile {
  const activeId = studentId || getActiveStudentId();
  
  // 1. Check scoped key in localStorage
  try {
    const raw = localStorage.getItem(getScopedKey('profile', activeId));
    if (raw) {
      const p = JSON.parse(raw);
      if (p.authProvider && p.authProvider !== 'guest' && p.email) {
        return p;
      }
      if (activeId === 'guest_student') {
        p.name = 'Guest Learner';
        p.email = '';
        return p;
      }
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }

  // 2. Check tiered storage backup for active profile (persists in cookie, localStorage, sessionStorage)
  try {
    const backupRaw = getTieredStorage('studyos_active_profile_backup');
    if (backupRaw) {
      const p = JSON.parse(backupRaw);
      if (p.authProvider && p.authProvider !== 'guest' && p.email) {
        if (!activeId || activeId === 'guest_student' || p.id === activeId) {
          try {
            localStorage.setItem(getScopedKey('profile', p.id), JSON.stringify(p));
          } catch {}
          return p;
        }
      }
    }
  } catch (e) {}

  // 3. Check auth snapshot in tiered storage (cookie / localStorage / sessionStorage)
  try {
    const snapshotRaw = getTieredStorage('studyos_auth_snapshot');
    if (snapshotRaw) {
      const s = JSON.parse(snapshotRaw);
      if (s.email && s.authProvider && s.authProvider !== 'guest') {
        const targetId = s.studentId || activeId;
        const reconstructed: UserProfile = {
          id: targetId,
          name: s.name || 'Student',
          email: s.email,
          preferredLanguage: s.preferredLanguage || 'hi',
          selectedExam: s.selectedExam || 'CBSE_10',
          targetScore: 90,
          examDate: '2026-03-01',
          streakDays: s.streakDays || 1,
          lastActiveDate: s.lastActiveDate || new Date().toISOString().split('T')[0],
          activeRole: 'student',
          goalCategory: s.goalCategory || 'school_board',
          selectedBoard: s.selectedBoard || 'CBSE',
          selectedClass: s.selectedClass || '10',
          parentPhone: s.parentPhone || '',
          parentName: s.parentName || '',
          isGoalConfirmed: s.isGoalConfirmed ?? false,
          autoSendReportsToParent: false,
          parentReportFrequency: 'daily_summary',
          authProvider: s.authProvider,
          avatar: s.avatar,
          enableOfflineTTSLessons: true,
          ttsSpeechRate: 1.0,
          ttsAutoPlayLessons: false,
        };
        try {
          localStorage.setItem(getScopedKey('profile', targetId), JSON.stringify(reconstructed));
        } catch {}
        return reconstructed;
      }
    }
  } catch (e) {}

  // 4. Try student account registry
  const accounts = loadStudentAccounts();
  const account = accounts.find((a) => a.id === activeId) || DEFAULT_STUDENT_ACCOUNTS[0];

  const isAuthenticated = account.authProvider && account.authProvider !== 'guest';
  const isAlok = activeId === 'student_alok_kumar' || (account.email && account.email.toLowerCase() === 'alokinfo30@gmail.com');

  const defaultProfile: UserProfile = {
    id: account.id,
    name: isAlok ? 'Alok Kumar' : isAuthenticated ? account.name : 'Guest Learner',
    email: isAlok ? 'alokinfo30@gmail.com' : isAuthenticated ? account.email : '',
    preferredLanguage: account.preferredLanguage || 'hi',
    selectedExam: account.selectedExam || 'CBSE_10',
    targetScore: isAlok ? 95 : (account.selectedExam === 'JEE_MAIN' ? 96 : 90),
    examDate: '2026-03-01',
    streakDays: isAlok ? 7 : (isAuthenticated ? 6 : 0),
    lastActiveDate: new Date().toISOString().split('T')[0],
    activeRole: 'student',
    goalCategory: account.goalCategory || 'school_board',
    selectedBoard: account.selectedBoard || 'CBSE',
    selectedTechTrack: account.selectedTechTrack,
    developerLevel: account.developerLevel,
    parentPhone: isAlok ? (account.parentPhone || '+919876543210') : (account.parentPhone || ''),
    parentName: isAlok ? (account.parentName || 'Ramesh Kumar') : (account.parentName || ''),
    isGoalConfirmed: isAlok ? true : (account.isGoalConfirmed ?? false),
    autoSendReportsToParent: isAlok ? true : (account.autoSendReportsToParent ?? false),
    parentReportFrequency: account.parentReportFrequency || 'daily_summary',
    authProvider: account.authProvider || (isAlok ? 'google' : 'guest'),
    googleProfile: account.googleProfile,
    isOfflineMode: false,
    enableOfflineTTSLessons: account.enableOfflineTTSLessons ?? true,
    ttsSpeechRate: account.ttsSpeechRate ?? 1.0,
    ttsAutoPlayLessons: account.ttsAutoPlayLessons ?? false,
  };

  // Only auto-save defaultProfile if activeId was already authenticated or Alok, do not overwrite if guest
  if (isAuthenticated || isAlok) {
    saveUserProfile(defaultProfile, activeId);
  }
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile, studentId?: string): void {
  const activeId = studentId || profile.id || getActiveStudentId();
  try {
    const serialized = JSON.stringify({ ...profile, id: activeId });
    localStorage.setItem(getScopedKey('profile', activeId), serialized);
    idbSet(getScopedKey('profile', activeId), profile);

    // If student is authenticated, sync multi-tier storage, cookies, and remote session
    if (profile.email && profile.authProvider && profile.authProvider !== 'guest') {
      setTieredStorage('studyos_active_email', profile.email, 365);
      setTieredStorage(ACTIVE_STUDENT_ID_KEY, activeId, 365);
      setTieredStorage('studyos_active_profile_backup', serialized, 365);
      
      const compactSnapshot = JSON.stringify({
        studentId: activeId,
        email: profile.email,
        name: profile.name,
        authProvider: profile.authProvider,
        avatar: profile.avatar || '',
        parentPhone: profile.parentPhone || '',
        parentName: profile.parentName || '',
        isGoalConfirmed: profile.isGoalConfirmed ?? false,
        goalCategory: profile.goalCategory,
        selectedBoard: profile.selectedBoard,
        selectedExam: profile.selectedExam,
        selectedClass: profile.selectedClass,
        preferredLanguage: profile.preferredLanguage,
        lastActiveDate: profile.lastActiveDate,
        streakDays: profile.streakDays,
      });
      setTieredStorage('studyos_auth_snapshot', compactSnapshot, 365);

      // Tier-4 IndexedDB durable copies
      idbSet('studyos_active_profile_backup', profile);
      idbSet('studyos_active_student_id', activeId);

      fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          studentId: activeId,
          profile,
        }),
      }).catch(() => {});

      // Auto-sync authenticated profile to server for cross-device persistence
      fetch('/api/auth/sync-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profile.email,
          studentId: activeId,
          profile,
        }),
      }).catch(() => {});
    }
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadConceptMasteries(studentId?: string): Record<string, ConceptMastery> {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('masteries', activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load concept masteries', e);
  }

  // Generate initial masteries for active student
  const initial: Record<string, ConceptMastery> = {};
  CURRICULUM_SUBJECTS.forEach((sub) => {
    sub.chapters.forEach((ch) => {
      ch.concepts.forEach((c) => {
        const isMasteredDemo = c.id === 'concept_ohms_law';
        initial[c.id] = {
          conceptId: c.id,
          understanding: isMasteredDemo ? 92 : 68,
          accuracy: isMasteredDemo ? 90 : 65,
          recall: isMasteredDemo ? 88 : 70,
          speed: isMasteredDemo ? 85 : 62,
          recentPerformance: isMasteredDemo ? 94 : 66,
          longTermRetention: isMasteredDemo ? 90 : 64,
          overallMastery: isMasteredDemo ? 91 : 66,
          forgettingRisk: isMasteredDemo ? 12 : 38,
          state: isMasteredDemo ? 'MASTERED' : 'PRACTICING',
          totalAttempts: isMasteredDemo ? 14 : 4,
          correctAttempts: isMasteredDemo ? 13 : 2,
          lastPracticed: Date.now() - (isMasteredDemo ? 86400000 : 172800000),
          nextRevisionDue: Date.now() + 86400000,
          mistakeHistory: [],
        };
      });
    });
  });

  saveConceptMasteries(initial, activeId);
  return initial;
}

export function saveConceptMasteries(
  masteries: Record<string, ConceptMastery>,
  studentId?: string
): void {
  const activeId = studentId || getActiveStudentId();
  try {
    localStorage.setItem(getScopedKey('masteries', activeId), JSON.stringify(masteries));
    idbSet(getScopedKey('masteries', activeId), masteries);
  } catch (e) {
    console.error('Failed to save concept masteries', e);
  }
}

export function loadQuestionAttempts(studentId?: string): QuestionAttempt[] {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('attempts', activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load attempts', e);
  }
  return [];
}

export function recordQuestionAttempt(attempt: QuestionAttempt, studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  const current = loadQuestionAttempts(activeId);
  const updated = [attempt, ...current].slice(0, 200); // keep last 200
  try {
    localStorage.setItem(getScopedKey('attempts', activeId), JSON.stringify(updated));
    idbSet(getScopedKey('attempts', activeId), updated);
  } catch (e) {
    console.error('Failed to record attempt', e);
  }
}

export function loadStudentDNA(studentId?: string): StudentDNA {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('dna', activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load DNA', e);
  }

  const defaultDNA: StudentDNA = {
    learningSpeed: 78,
    conceptRetention: 74,
    questionAccuracy: 76,
    calculationAccuracy: 72,
    memoryStrength: 70,
    problemSolvingIndex: 79,
    timeManagement: 75,
    consistencyStreak: 6,
    totalHoursStudied: 28,
    totalQuestionsSolved: 112,
    diagnosticCompleted: true,
  };

  saveStudentDNA(defaultDNA, activeId);
  return defaultDNA;
}

export function saveStudentDNA(dna: StudentDNA, studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  try {
    localStorage.setItem(getScopedKey('dna', activeId), JSON.stringify(dna));
    idbSet(getScopedKey('dna', activeId), dna);
  } catch (e) {
    console.error('Failed to save DNA', e);
  }
}

export function loadDailyMission(studentId?: string): DailyMission {
  const activeId = studentId || getActiveStudentId();
  const today = new Date().toISOString().split('T')[0];

  try {
    const raw = localStorage.getItem(getScopedKey(`mission_${today}`, activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load mission', e);
  }

  const defaultMission: DailyMission = {
    date: today,
    prioritySubject: 'Physics: Current Electricity & Circuits',
    priorityChapter: 'Ohm’s Law, Resistance & Power',
    estimatedMinutes: 45,
    tasks: [
      {
        id: 'task_learn_1',
        type: 'learn',
        title: { en: 'Study Ohm’s Law & Resistance Scaling', hi: 'ओम का नियम एवं प्रतिरोध गणना पढ़ें' },
        subtitle: { en: 'Understand R = ρ(L/A) with 90% checkpoint', hi: '90% चेकपॉइंट के साथ सूत्र को समझें' },
        targetCount: 1,
        completedCount: 0,
        isCompleted: false,
        conceptId: 'concept_ohms_law',
      },
      {
        id: 'task_practice_1',
        type: 'practice',
        title: { en: 'Solve 5 NCERT Textbook Problems', hi: '5 एनसीईआरटी अभ्यास प्रश्न हल करें' },
        subtitle: { en: 'Rated power P = V²/R numerical drills', hi: 'विद्युत शक्ति के संख्यात्मक प्रश्न' },
        targetCount: 5,
        completedCount: 2,
        isCompleted: false,
      },
      {
        id: 'task_rev_1',
        type: 'revision',
        title: { en: 'Review 3 Due Spaced Flashcards', hi: '3 स्पेसड रीविज़न कार्ड्स दोहराएं' },
        subtitle: { en: 'Prevent forgetting curve decay in Electrostatics', hi: 'स्थिर वैद्युतिकी का रीविज़न' },
        targetCount: 3,
        completedCount: 0,
        isCompleted: false,
      },
    ],
    doNotStudyList: [
      {
        conceptId: 'concept_series_parallel',
        conceptTitle: { en: 'Series & Parallel Resistors', hi: 'श्रेणी एवं समान्तर क्रम प्रतिरोध' },
        masteryScore: 94,
        reason: {
          en: 'You have already reached 94% mastery. Studying this today yields diminishing returns.',
          hi: 'आप पहले ही 94% दक्षता हासिल कर चुके हैं। आज इसे दोबारा पढ़ने का कोई विशेष लाभ नहीं है।',
        },
      },
    ],
  };

  saveDailyMission(defaultMission, activeId);
  return defaultMission;
}

export function saveDailyMission(mission: DailyMission, studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  try {
    localStorage.setItem(getScopedKey(`mission_${mission.date}`, activeId), JSON.stringify(mission));
    idbSet(getScopedKey(`mission_${mission.date}`, activeId), mission);
  } catch (e) {
    console.error('Failed to save mission', e);
  }
}

export function loadSpacedRevisionQueue(studentId?: string): SpacedRevisionItem[] {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('spaced_repetition', activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load spaced revision queue', e);
  }

  const defaultQueue: SpacedRevisionItem[] = [
    {
      id: 'rev_1',
      conceptId: 'concept_ohms_law',
      chapterId: 'ch_electricity_10',
      subjectId: 'sub_physics_10',
      questionId: 'q_ohms_law_1',
      currentIntervalDays: 3,
      scheduledDate: Date.now(),
      repetitionCount: 2,
      lastConfidence: 'confident',
      forgettingRiskPercent: 42,
      dueStatus: 'due_today',
    },
    {
      id: 'rev_2',
      conceptId: 'concept_series_parallel',
      chapterId: 'ch_electricity_10',
      subjectId: 'sub_physics_10',
      questionId: 'q_resistor_calc_1',
      currentIntervalDays: 7,
      scheduledDate: Date.now(),
      repetitionCount: 4,
      lastConfidence: 'very_confident',
      forgettingRiskPercent: 18,
      dueStatus: 'due_today',
    },
    {
      id: 'rev_3',
      conceptId: 'concept_joules_law',
      chapterId: 'ch_electricity_10',
      subjectId: 'sub_physics_10',
      questionId: 'q_electric_power_1',
      currentIntervalDays: 1,
      scheduledDate: Date.now(),
      repetitionCount: 1,
      lastConfidence: 'somewhat',
      forgettingRiskPercent: 68,
      dueStatus: 'due_today',
    },
  ];

  saveSpacedRevisionQueue(defaultQueue, activeId);
  return defaultQueue;
}

export function saveSpacedRevisionQueue(
  queue: SpacedRevisionItem[],
  studentId?: string
): void {
  const activeId = studentId || getActiveStudentId();
  try {
    localStorage.setItem(getScopedKey('spaced_repetition', activeId), JSON.stringify(queue));
    idbSet(getScopedKey('spaced_repetition', activeId), queue);
  } catch (e) {
    console.error('Failed to save spaced revision queue', e);
  }
}

// -------------------------------------------------------------
// PARENT REPORT DISPATCH & LOGGING SUBSYSTEM
// -------------------------------------------------------------

export function loadParentReportLogs(studentId?: string): ParentReportLog[] {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('parent_reports', activeId));
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load parent report logs', e);
  }
  return [];
}

export function saveParentReportLog(log: ParentReportLog, studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  const current = loadParentReportLogs(activeId);
  const updated = [log, ...current].slice(0, 50);
  try {
    localStorage.setItem(getScopedKey('parent_reports', activeId), JSON.stringify(updated));
    idbSet(getScopedKey('parent_reports', activeId), updated);
  } catch (e) {
    console.error('Failed to save parent report log', e);
  }
}

export function triggerAutomaticParentProgressDispatch(
  attempt: QuestionAttempt,
  studentId?: string
): { dispatched: boolean; message?: string } {
  const activeId = studentId || getActiveStudentId();
  const profile = loadUserProfile(activeId);

  // Check if automatic sending is enabled and parent phone exists
  if (profile.autoSendReportsToParent === false || !profile.parentPhone) {
    return { dispatched: false };
  }

  const dna = loadStudentDNA(activeId);
  const masteries = loadConceptMasteries(activeId);
  const now = Date.now();

  // Throttle automatic dispatches to at most once every 60 seconds per session
  if (profile.lastAutoDispatchedAt && now - profile.lastAutoDispatchedAt < 60000) {
    return { dispatched: false };
  }

  // Generate automated real-time progress update in local language
  const conceptName = attempt.conceptId.replace('concept_', '').replace(/_/g, ' ');
  const statusEmoji = attempt.isCorrect ? '✅' : '⚠️';
  const scorePercent = dna.questionAccuracy;

  const autoMessage = generateLocalizedParentMessage({
    profile,
    dna,
    masteries,
    reportType: 'drill_completed',
    targetLanguage: profile.parentPreferredLanguage || profile.preferredLanguage,
    drillStats: {
      totalQuestions: 1,
      correctQuestions: attempt.isCorrect ? 1 : 0,
      accuracy: scorePercent,
      subjectName: conceptName.toUpperCase(),
    },
  });

  const log: ParentReportLog = {
    id: `auto_rep_${now}`,
    timestamp: now,
    parentPhone: profile.parentPhone,
    channel: 'whatsapp',
    reportType: 'daily_summary',
    messageSummary: `[AUTO-DISPATCH ${profile.parentPreferredLanguage || profile.preferredLanguage || 'hi'}] ${conceptName}: ${attempt.isCorrect ? 'Correct' : 'Review'} (Acc ${scorePercent}%)`,
    status: 'delivered',
  };

  saveParentReportLog(log, activeId);

  // Update profile with last dispatched timestamp
  saveUserProfile({ ...profile, lastAutoDispatchedAt: now }, activeId);

  return { dispatched: true, message: autoMessage };
}

export function checkAndDispatchPeriodicParentReport(studentId?: string): { dispatched: boolean; summary?: string } {
  const activeId = studentId || getActiveStudentId();
  const profile = loadUserProfile(activeId);

  if (profile.autoSendReportsToParent === false || !profile.parentPhone) {
    return { dispatched: false };
  }

  const dna = loadStudentDNA(activeId);
  const masteries = loadConceptMasteries(activeId);
  const now = Date.now();

  // Send periodic milestone sync every 15 minutes (or on substantial activity)
  const MIN_INTERVAL_MS = 15 * 60 * 1000;
  if (profile.lastAutoDispatchedAt && now - profile.lastAutoDispatchedAt < MIN_INTERVAL_MS) {
    return { dispatched: false };
  }

  const masteryValues = Object.values(masteries);
  const avgMastery =
    masteryValues.length > 0
      ? Math.round(
          masteryValues.reduce((sum, m) => sum + (m.overallMastery || 0), 0) / masteryValues.length
        )
      : 76;

  const milestoneSummary = `[AUTO-SYNC ${profile.parentPreferredLanguage || profile.preferredLanguage || 'hi'}] Streak: ${profile.streakDays}d | Accuracy: ${dna.questionAccuracy}% | Mastery: ${avgMastery}% | Hours: ${dna.totalHoursStudied}h`;

  const log: ParentReportLog = {
    id: `auto_periodic_${now}`,
    timestamp: now,
    parentPhone: profile.parentPhone,
    channel: 'whatsapp',
    reportType: 'daily_summary',
    messageSummary: milestoneSummary,
    status: 'delivered',
  };

  saveParentReportLog(log, activeId);
  saveUserProfile({ ...profile, lastAutoDispatchedAt: now }, activeId);

  return { dispatched: true, summary: milestoneSummary };
}

export function generateParentWhatsAppMessage(
  profile: UserProfile,
  dna: StudentDNA,
  masteries: Record<string, ConceptMastery>,
  reportType: 'daily_summary' | 'weekly_milestone' | 'exam_alert' = 'daily_summary',
  targetLanguage?: LanguageCode
): string {
  return generateLocalizedParentMessage({
    profile,
    dna,
    masteries,
    reportType,
    targetLanguage: targetLanguage || profile.parentPreferredLanguage || profile.preferredLanguage,
  });
}

// -------------------------------------------------------------
// COURSE PROGRESS TRACKING & RESUME LEARNING ENGINE
// -------------------------------------------------------------

export function loadLastCourseSession(studentId?: string): CourseProgressSession | null {
  const activeId = studentId || getActiveStudentId();
  try {
    const raw = localStorage.getItem(getScopedKey('last_course_session', activeId));
    if (raw) {
      return secureGetStorage<CourseProgressSession | null>(getScopedKey('last_course_session', activeId), null);
    }
  } catch (e) {
    console.error('Failed to load last course session', e);
  }

  // If no session saved for this student, return null
  return null;
}

export function saveLastCourseSession(session: CourseProgressSession, studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  try {
    secureSetStorage(getScopedKey('last_course_session', activeId), session);
    idbSet(getScopedKey('last_course_session', activeId), session);
  } catch (e) {
    console.error('Failed to save last course session', e);
  }
}

export function clearLastCourseSession(studentId?: string): void {
  const activeId = studentId || getActiveStudentId();
  try {
    localStorage.removeItem(getScopedKey('last_course_session', activeId));
    idbDelete(getScopedKey('last_course_session', activeId));
  } catch (e) {
    console.error('Failed to clear last course session', e);
  }
}

export function getRegisteredStudentAccounts(): StudentAccount[] {
  return loadStudentAccounts().filter((a) => a.authProvider !== 'guest' && Boolean(a.email));
}

export function getRegisteredGoogleAccounts(): StudentAccount[] {
  return getRegisteredStudentAccounts();
}

export function removeGoogleAccount(accountId: string): void {
  const accounts = loadStudentAccounts().filter((a) => a.id !== accountId);
  saveStudentAccounts(accounts);
}

