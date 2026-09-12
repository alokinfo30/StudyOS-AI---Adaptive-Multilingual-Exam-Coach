import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  ConceptMastery,
  StudentDNA,
  LanguageCode,
  ExamCategory,
  StudentAccount,
  GoalCategory,
  EducationBoard,
  TechTrack,
  DeveloperLevel,
  FocusModeState,
} from './types';
import {
  loadStudentAccounts,
  getActiveStudentId,
  setActiveStudentId,
  createStudentAccount,
  deleteStudentAccount,
  loadUserProfile,
  saveUserProfile,
  loadConceptMasteries,
  saveConceptMasteries,
  loadStudentDNA,
  saveStudentDNA,
  loadQuestionAttempts,
  initializeOfflineCache,
  loginOrRegisterWithGoogle,
  loginOrRegisterStudent,
  LoginMethod,
  checkAndDispatchPeriodicParentReport,
  clearLastCourseSession,
} from './services/storageService';
import { calculateConfidenceWeightedAccuracy } from './utils/masteryCalculator';
import { Navbar } from './components/layout/Navbar';
import { FloatingUtilitySlider } from './components/layout/FloatingUtilitySlider';
import { LanguageSelectorModal } from './components/layout/LanguageSelectorModal';
import { StudyOSHomeView } from './components/home/StudyOSHomeView';
import { DailyMissionView } from './components/dashboard/DailyMissionView';
import { InteractiveLessonView } from './components/learning/InteractiveLessonView';
import { InteractivePracticeView } from './components/practice/InteractivePracticeView';
import { SpacedRepetitionView } from './components/revision/SpacedRepetitionView';
import { MockTestSimulator } from './components/exam/MockTestSimulator';
import { ExamReadinessView } from './components/exam/ExamReadinessView';
import { StudentDNAView } from './components/dashboard/StudentDNAView';
import { CareerRoadmapView } from './components/career/CareerRoadmapView';
import { ParentDashboardView } from './components/parent/ParentDashboardView';
import { TechInterviewPrepView } from './components/devprep/TechInterviewPrepView';
import { AICoachDrawer } from './components/common/AICoachDrawer';
import { GoogleAuthModal } from './components/auth/GoogleAuthModal';
import { AccountPrivacyModal } from './components/auth/AccountPrivacyModal';
import { ParentMobileReportModal } from './components/parent/ParentMobileReportModal';
import { ParentMobileRequiredModal } from './components/parent/ParentMobileRequiredModal';
import { SocialShareModal } from './components/common/SocialShareModal';
import { FocusModeOverlay } from './components/common/FocusModeOverlay';
import { SelfHealingDashboardModal } from './components/devprep/SelfHealingDashboardModal';
import { initializeSelfHealingInterceptor } from './services/selfHealingService';
import { QuickFormulaOverlay } from './components/learning/QuickFormulaOverlay';
import { PeerStudyMatch } from './components/social/PeerStudyMatch';
import { ConceptMindMapView } from './components/learning/ConceptMindMapView';
import { ApprenticeEducatorHub } from './components/teaching/ApprenticeEducatorHub';
import { applyAccentColorToDocument } from './utils/themeUtils';
import { playMasteryPopSound } from './utils/audioEffects';
import { SessionSentinel } from './utils/sessionSentinel';
import { WifiOff, Zap } from 'lucide-react';

export default function App() {
  // Private Student ID & Active Session
  const [activeStudentId, setActiveId] = useState<string>(() => getActiveStudentId());

  // Isolated Per-Student Data States
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile(activeStudentId));
  const [masteries, setMasteries] = useState<Record<string, ConceptMastery>>(() =>
    loadConceptMasteries(activeStudentId)
  );
  const [dna, setDna] = useState<StudentDNA>(() => loadStudentDNA(activeStudentId));
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState<boolean>(false);
  const [isVerifyingAuth, setIsVerifyingAuth] = useState<boolean>(false);
  const [isAccountPrivacyOpen, setIsAccountPrivacyOpen] = useState<boolean>(false);
  const [isParentReportOpen, setIsParentReportOpen] = useState<boolean>(false);
  const [isParentMobileRequiredOpen, setIsParentMobileRequiredOpen] = useState<boolean>(false);
  const [pendingLearningTab, setPendingLearningTab] = useState<string | null>(null);
  const [isSocialShareOpen, setIsSocialShareOpen] = useState<boolean>(false);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [isSelfHealingOpen, setIsSelfHealingOpen] = useState<boolean>(false);
  const [isFormulaOverlayOpen, setIsFormulaOverlayOpen] = useState<boolean>(false);
  const [isPeerMatchOpen, setIsPeerMatchOpen] = useState<boolean>(false);
  const [masteryPopAlert, setMasteryPopAlert] = useState<{
    conceptName: string;
    delta: number;
    newScore: number;
  } | null>(null);
  const [lastLoginTimestamp, setLastLoginTimestamp] = useState<number>(0);
  const [focusModeState, setFocusModeState] = useState<FocusModeState>({
    isActive: false,
    sessionStartTime: 0,
    activeSessionSeconds: 0,
    pomodoroMinutes: 25,
    ambientSoundEnabled: false,
    ambientSoundType: 'binaural_alpha',
    blockedDistractionCount: 0,
  });

  // Apply custom UI accent color across the app dynamically
  useEffect(() => {
    applyAccentColorToDocument(profile.accentColor || 'amber');
  }, [profile.accentColor]);

  // Global keyboard shortcut for Quick Formula Cheat-Sheet (Shift + F) - Only when logged in & goal confirmed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'F' || e.key === 'f')) {
        const isStudentLoggedIn = profile.authProvider !== 'guest' && Boolean(profile.email);
        if (!isStudentLoggedIn) {
          e.preventDefault();
          setIsGoogleAuthOpen(true);
          return;
        }
        if (profile.isGoalConfirmed) {
          e.preventDefault();
          setIsFormulaOverlayOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile.isGoalConfirmed, profile.authProvider, profile.email]);

  const toggleFocusMode = () => {
    setFocusModeState((prev) => ({
      ...prev,
      isActive: !prev.isActive,
      sessionStartTime: !prev.isActive ? Date.now() : prev.sessionStartTime,
    }));
  };

  // Initialize offline content caching & monitor browser online/offline status
  useEffect(() => {
    initializeOfflineCache();
    initializeSelfHealingInterceptor();

    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOfflineMode(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Background Service: Automated periodic performance reporting to registered parent phone
  useEffect(() => {
    // Non-intrusive periodic background worker every 60 seconds
    const interval = setInterval(() => {
      if (profile.autoSendReportsToParent && profile.parentPhone) {
        checkAndDispatchPeriodicParentReport(activeStudentId);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [profile.autoSendReportsToParent, profile.parentPhone, activeStudentId]);

  // Unified Student Login Integration (Google, Email, Phone, Roll Number)
  const handleGoogleLoginSuccess = (
    email: string,
    name: string,
    picture?: string,
    method: LoginMethod = 'google',
    phone?: string
  ) => {
    const account = loginOrRegisterStudent({
      method,
      email,
      name,
      picture,
      phone,
    });
    setActiveId(account.id);
    setActiveStudentId(account.id);
    const nextProfile = loadUserProfile(account.id);
    const nextMasteries = loadConceptMasteries(account.id);
    const nextDna = loadStudentDNA(account.id);

    setProfile(nextProfile);
    setMasteries(nextMasteries);
    setDna(nextDna);
    setLastLoginTimestamp(Date.now());
    setCurrentTab('home');
  };

  const handleSignOutGoogle = () => {
    setActiveId('guest_student');
    SessionSentinel.terminateSession({
      studentId: activeStudentId,
      reactBranches: {
        setProfile,
        setMasteries,
        setDna,
        setLastLoginTimestamp,
        setIsVerifyingAuth,
        setCurrentTab,
        setPendingLearningTab,
      },
      onComplete: () => {
        setIsGoogleAuthOpen(false);
        setIsAccountPrivacyOpen(false);
      },
    });
  };

  // Sync state changes to storage for active student
  const handleUpdateLanguage = (lang: LanguageCode) => {
    const updated = { ...profile, preferredLanguage: lang };
    setProfile(updated);
    saveUserProfile(updated, activeStudentId);
  };

  // Goal & Board confirmation from Homepage Wizard
  const handleConfirmGoal = (updates: {
    goalCategory: GoalCategory;
    selectedExam: ExamCategory;
    selectedBoard?: EducationBoard;
    selectedClass?: '9' | '10' | '11' | '12' | string;
    selectedTechTrack?: TechTrack;
    developerLevel?: DeveloperLevel;
    preferredLanguage: LanguageCode;
    autoSendReportsToParent?: boolean;
    parentPhone?: string;
    parentName?: string;
  }) => {
    const updated: UserProfile = {
      ...profile,
      goalCategory: updates.goalCategory,
      selectedExam: updates.selectedExam,
      selectedBoard: updates.selectedBoard,
      selectedClass: updates.selectedClass || (updates.selectedExam?.includes('12') ? '12' : '10'),
      selectedTechTrack: updates.selectedTechTrack,
      developerLevel: updates.developerLevel,
      preferredLanguage: updates.preferredLanguage,
      isGoalConfirmed: true, // Mark goal as explicitly selected and confirmed by student
      autoSendReportsToParent: updates.autoSendReportsToParent ?? profile.autoSendReportsToParent ?? true,
      parentPhone: updates.parentPhone || profile.parentPhone,
      parentName: updates.parentName || profile.parentName,
    };
    setProfile(updated);
    saveUserProfile(updated, activeStudentId);
  };

  const handleUpdateMasteries = (updatedMasteries: Record<string, ConceptMastery>) => {
    // Retrieve question attempts to calculate 4-level confidence-weighted accuracy
    const attempts = loadQuestionAttempts(activeStudentId);
    
    // Evaluate mastery state based on high-confidence correctness
    const processedMasteries: Record<string, ConceptMastery> = {};
    for (const [conceptId, mastery] of Object.entries(updatedMasteries)) {
      const conceptAttempts = attempts.filter((a) => a.conceptId === conceptId);
      const highConfidenceCorrect = conceptAttempts.filter(
        (a) => a.isCorrect && (a.confidence === 'very_confident' || a.confidence === 'confident')
      ).length;

      // Ensure that a concept reaches 'MASTERED' (>= 90%) only when validated by high-confidence correct answers
      let refinedState = mastery.state;
      let refinedMastery = mastery.overallMastery;

      if (refinedMastery >= 90) {
        if (highConfidenceCorrect >= 1 || conceptAttempts.length === 0) {
          refinedState = 'MASTERED';
        } else {
          // If 90% reached only by low confidence/guessing, cap at 85% until high-confidence test passed
          refinedMastery = 85;
          refinedState = 'IMPROVING';
        }
      }

      processedMasteries[conceptId] = {
        ...mastery,
        overallMastery: refinedMastery,
        state: refinedState,
      };
    }

    // Trigger subtle pop animation and sound effect whenever mastery level updates
    let highestGain = 0;
    let gainedId = '';
    let gainedNewScore = 0;

    for (const [cId, newM] of Object.entries(processedMasteries)) {
      const prevM = masteries[cId];
      if (prevM && newM.overallMastery > prevM.overallMastery) {
        const gain = newM.overallMastery - prevM.overallMastery;
        if (gain > highestGain) {
          highestGain = gain;
          gainedId = cId;
          gainedNewScore = newM.overallMastery;
        }
      }
    }

    if (highestGain > 0) {
      playMasteryPopSound(gainedNewScore >= 90);
      setMasteryPopAlert({
        conceptName: gainedId.replace(/^c_|^ch_/, '').replace(/_/g, ' '),
        delta: highestGain,
        newScore: gainedNewScore,
      });
      setTimeout(() => setMasteryPopAlert(null), 3500);
    }

    setMasteries(processedMasteries);
    saveConceptMasteries(processedMasteries, activeStudentId);

    // Calculate confidence-weighted accuracy using 4-level confidence weights
    const allAttemptsCount = Object.values(processedMasteries).reduce(
      (sum, m) => sum + m.totalAttempts,
      0
    );
    const correctAttemptsCount = Object.values(processedMasteries).reduce(
      (sum, m) => sum + m.correctAttempts,
      0
    );

    const confidenceWeightedAccuracy =
      attempts.length > 0
        ? calculateConfidenceWeightedAccuracy(attempts)
        : allAttemptsCount > 0
        ? Math.round((correctAttemptsCount / allAttemptsCount) * 100)
        : dna.questionAccuracy;

    // High-confidence accuracy ratio specifically for student cognitive DNA
    const highConfAttempts = attempts.filter(
      (a) => a.confidence === 'very_confident' || a.confidence === 'confident'
    );
    const highConfAccuracy =
      highConfAttempts.length > 0
        ? Math.round(
            (highConfAttempts.filter((a) => a.isCorrect).length / highConfAttempts.length) * 100
          )
        : confidenceWeightedAccuracy;

    const updatedDna: StudentDNA = {
      ...dna,
      totalQuestionsSolved: Math.max(dna.totalQuestionsSolved, allAttemptsCount),
      questionAccuracy: confidenceWeightedAccuracy,
      conceptRetention: Math.round(
        (confidenceWeightedAccuracy * 0.6 + highConfAccuracy * 0.4 + dna.memoryStrength) / 2
      ),
      examReadiness: Math.min(
        100,
        Math.round(confidenceWeightedAccuracy * 0.5 + highConfAccuracy * 0.3 + (dna.examReadiness || 75) * 0.2)
      ),
    };
    setDna(updatedDna);
    saveStudentDNA(updatedDna, activeStudentId);
  };

  // Enforce Student Login and Parent Mobile Number check before starting learning modules
  const handleNavigateWithParentCheck = (targetTab: string) => {
    if (profile.activeRole === 'parent' && targetTab !== 'parent') {
      const updated = { ...profile, activeRole: 'student' as const };
      setProfile(updated);
      saveUserProfile(updated, activeStudentId);
    }

    const isStudentLoggedIn = profile.authProvider !== 'guest' && Boolean(profile.email);
    const protectedTabs = [
      'mission',
      'learn',
      'mindmap',
      'practice',
      'revision',
      'mock_exam',
      'readiness',
      'dna',
      'career',
      'dev_prep',
      'parent',
    ];

    if (!isStudentLoggedIn && protectedTabs.includes(targetTab)) {
      setIsGoogleAuthOpen(true);
      return;
    }

    const learningTabs = ['learn', 'practice', 'revision', 'mock_exam', 'dev_prep', 'mission'];
    const cleanDigits = (profile.parentPhone || '').replace(/\D/g, '');
    const hasValidParentPhone = cleanDigits.length >= 10;

    if (learningTabs.includes(targetTab) && !hasValidParentPhone) {
      setPendingLearningTab(targetTab);
      setIsParentMobileRequiredOpen(true);
      return;
    }

    setCurrentTab(targetTab);
  };

  const handleConfirmParentMobile = (
    phone: string,
    name: string,
    language: LanguageCode
  ) => {
    const updated: UserProfile = {
      ...profile,
      parentPhone: phone,
      parentName: name,
      parentPreferredLanguage: language,
      parentMobileVerified: true,
      autoSendReportsToParent: true,
    };
    setProfile(updated);
    saveUserProfile(updated, activeStudentId);
    setIsParentMobileRequiredOpen(false);

    // Transition immediately to the learning tab student wanted to open
    const target = pendingLearningTab || 'learn';
    setPendingLearningTab(null);
    setCurrentTab(target);
  };

  const handleToggleRole = () => {
    const isStudentLoggedIn = profile.authProvider !== 'guest' && Boolean(profile.email);
    if (!isStudentLoggedIn) {
      setIsGoogleAuthOpen(true);
      return;
    }
    const nextRole = profile.activeRole === 'student' ? 'parent' : 'student';
    const updated = { ...profile, activeRole: nextRole };
    setProfile(updated);
    saveUserProfile(updated, activeStudentId);
    if (nextRole === 'parent') {
      setCurrentTab('parent');
    } else {
      setCurrentTab('mission');
    }
  };

  const handleSwitchToStudentMode = () => {
    const updated: UserProfile = { ...profile, activeRole: 'student' };
    setProfile(updated);
    saveUserProfile(updated, activeStudentId);
    setCurrentTab('mission');
  };

  const toggleOfflineSimulation = () => {
    setIsOfflineMode((prev) => !prev);
  };

  const isStudentLoggedIn = profile.authProvider !== 'guest' && Boolean(profile.email);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 text-amber-300 px-4 py-1.5 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>Offline Mode Active:</strong> NCERT textbook problems, flashcards, diagnostic checks & TTS run locally with zero latency.
            </span>
          </div>
          <button
            onClick={toggleOfflineSimulation}
            className="text-[11px] underline hover:text-amber-200 shrink-0 ml-2"
          >
            Online Mode
          </button>
        </div>
      )}

      {/* Universal Top Navigation Header (or Minimal Focus Mode Header) */}
      {focusModeState.isActive ? (
        <FocusModeOverlay
          focusState={focusModeState}
          onUpdateFocusState={setFocusModeState}
          onExitFocusMode={() => setFocusModeState((prev) => ({ ...prev, isActive: false }))}
          onOpenAICoach={() => setIsAICoachOpen(true)}
          currentConceptTitle={
            currentTab === 'learn'
              ? "Mastering Ohm's Law & Circuit Calculations"
              : currentTab === 'practice'
              ? 'NCERT Exemplar Problem Drill'
              : currentTab === 'revision'
              ? 'Spaced Repetition Flashcards'
              : currentTab === 'dev_prep'
              ? 'Technical Interview Preparation'
              : 'StudyOS Active Learning Focus'
          }
        />
      ) : (
        <Navbar
          currentTab={currentTab}
          onSelectTab={handleNavigateWithParentCheck}
          profile={profile}
          onUpdateLanguage={handleUpdateLanguage}
          onToggleRole={handleToggleRole}
          onOpenAITutor={() => {
            if (!isStudentLoggedIn) {
              setIsGoogleAuthOpen(true);
              return;
            }
            setIsAICoachOpen(true);
          }}
          onOpenAccountPrivacy={() => setIsAccountPrivacyOpen(true)}
          onToggleOfflineMode={toggleOfflineSimulation}
          isOfflineMode={isOfflineMode}
          onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
          onOpenParentReport={() => setIsParentReportOpen(true)}
          onOpenSocialShare={() => setIsSocialShareOpen(true)}
          isFocusMode={focusModeState.isActive}
          onToggleFocusMode={toggleFocusMode}
          onOpenSelfHealing={() => setIsSelfHealingOpen(true)}
          onOpenQuickFormulas={() => {
            if (!isStudentLoggedIn) {
              setIsGoogleAuthOpen(true);
              return;
            }
            setIsFormulaOverlayOpen(true);
          }}
          onOpenPeerMatch={() => {
            if (!isStudentLoggedIn) {
              setIsGoogleAuthOpen(true);
              return;
            }
            setIsPeerMatchOpen(true);
          }}
          onSignOut={handleSignOutGoogle}
        />
      )}

      {/* Main Content Workspace (Adaptive across Mobile, Tablet, Desktop) */}
      <main className={`flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 transition-all duration-300 ${
        focusModeState.isActive ? 'bg-zinc-950/90 rounded-2xl my-2 shadow-2xl ring-1 ring-amber-500/20' : ''
      } ${
        isVerifyingAuth ? 'opacity-25 pointer-events-none filter blur-[1.5px] select-none scale-[0.99]' : ''
      }`}>
        {isStudentLoggedIn && (profile.activeRole === 'parent' || currentTab === 'parent') ? (
          <ParentDashboardView
            language={profile.preferredLanguage}
            profile={profile}
            dna={dna}
            masteries={masteries}
            onSwitchToStudentMode={handleSwitchToStudentMode}
            onUpdateProfile={(up) => {
              setProfile(up);
              saveUserProfile(up, activeStudentId);
            }}
          />
        ) : (
          <>
            {(!isStudentLoggedIn || currentTab === 'home') && (
              <StudyOSHomeView
                language={profile.preferredLanguage}
                profile={profile}
                onConfirmGoal={handleConfirmGoal}
                onNavigateTab={handleNavigateWithParentCheck}
                onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
                onOpenPeerRoom={() => {
                  if (!isStudentLoggedIn) {
                    setIsGoogleAuthOpen(true);
                    return;
                  }
                  setIsPeerMatchOpen(true);
                }}
                onOpenFormulas={() => {
                  if (!isStudentLoggedIn) {
                    setIsGoogleAuthOpen(true);
                    return;
                  }
                  setIsFormulaOverlayOpen(true);
                }}
                onOpenExamCoach={() => {
                  if (!isStudentLoggedIn) {
                    setIsGoogleAuthOpen(true);
                    return;
                  }
                  setIsAICoachOpen(true);
                }}
                onOpenUserProfile={() => setIsAccountPrivacyOpen(true)}
                onToggleRole={handleToggleRole}
                loginTimestamp={lastLoginTimestamp}
              />
            )}

            {isStudentLoggedIn && currentTab === 'mission' && (
              <DailyMissionView
                language={profile.preferredLanguage}
                profile={profile}
                dna={dna}
                masteries={masteries}
                onNavigateTab={handleNavigateWithParentCheck}
              />
            )}

            {isStudentLoggedIn && currentTab === 'learn' && (
              <InteractiveLessonView
                language={profile.preferredLanguage}
                profile={profile}
                masteries={masteries}
                onNavigateToPractice={(chapterId) => handleNavigateWithParentCheck('practice')}
                onNavigateToRevision={() => handleNavigateWithParentCheck('revision')}
                onOpenQuickFormulas={() => setIsFormulaOverlayOpen(true)}
                onOpenPeerMatch={() => setIsPeerMatchOpen(true)}
                onOpenMindMap={() => handleNavigateWithParentCheck('mindmap')}
                onOpenLanguageSettings={() => setIsLangModalOpen(true)}
                onToggleOfflineTTS={(enabled) => {
                  const updated: UserProfile = { ...profile, enableOfflineTTSLessons: enabled };
                  setProfile(updated);
                  saveUserProfile(updated, activeStudentId);
                }}
                onUpdateProfile={(updatedProfile) => {
                  setProfile(updatedProfile);
                  saveUserProfile(updatedProfile, activeStudentId);
                }}
              />
            )}

            {isStudentLoggedIn && currentTab === 'mindmap' && (
              <div className="space-y-6">
                <ConceptMindMapView
                  masteries={masteries}
                  onSelectConcept={(cid, cname) => {
                    // Quick inspection or jump
                  }}
                />
              </div>
            )}

            {isStudentLoggedIn && currentTab === 'practice' && (
              <InteractivePracticeView
                language={profile.preferredLanguage}
                profile={profile}
                masteries={masteries}
                onUpdateMasteries={handleUpdateMasteries}
              />
            )}

            {isStudentLoggedIn && currentTab === 'revision' && (
              <SpacedRepetitionView
                language={profile.preferredLanguage}
                profile={profile}
              />
            )}

            {isStudentLoggedIn && currentTab === 'mock_exam' && (
              <MockTestSimulator
                language={profile.preferredLanguage}
                profile={profile}
              />
            )}

            {isStudentLoggedIn && currentTab === 'readiness' && (
              <ExamReadinessView
                language={profile.preferredLanguage}
                profile={profile}
                dna={dna}
                masteries={masteries}
                onNavigateToPractice={() => handleNavigateWithParentCheck('practice')}
              />
            )}

            {isStudentLoggedIn && currentTab === 'dev_prep' && (
              <TechInterviewPrepView
                language={profile.preferredLanguage}
                profile={profile}
              />
            )}

            {isStudentLoggedIn && currentTab === 'dna' && (
              <StudentDNAView
                language={profile.preferredLanguage}
                profile={profile}
                dna={dna}
                masteries={masteries}
              />
            )}

            {isStudentLoggedIn && currentTab === 'apprentice_teaching' && (
              <ApprenticeEducatorHub />
            )}

            {isStudentLoggedIn && currentTab === 'career' && (
              <CareerRoadmapView language={profile.preferredLanguage} />
            )}
          </>
        )}
      </main>

      {/* AI Socratic Coach Floating Drawer */}
      {isStudentLoggedIn && (
        <AICoachDrawer
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          language={profile.preferredLanguage}
        />
      )}

      {/* Student Private Account & Data Isolation Modal */}
      <AccountPrivacyModal
        isOpen={isAccountPrivacyOpen}
        onClose={() => setIsAccountPrivacyOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          setProfile(updated);
          saveUserProfile(updated, activeStudentId);
        }}
        onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
        onSignOut={handleSignOutGoogle}
      />

      {/* Google / Gmail Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        profile={profile}
        onGoogleLoginSuccess={handleGoogleLoginSuccess}
        onSignOut={handleSignOutGoogle}
        onVerificationStateChange={setIsVerifyingAuth}
      />

      {/* Loading-on-Verify State Overlay: visually dims dashboard while auth codes are pending verification */}
      {isVerifyingAuth && (
        <div
          id="loading-on-verify-overlay"
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none animate-fadeIn"
        >
          <div className="p-5 rounded-2xl bg-zinc-900/95 border border-amber-500/40 shadow-2xl max-w-sm w-full mx-4 text-center space-y-3 pointer-events-auto">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center justify-center gap-1.5">
                <span>Verification Code Pending</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Dashboard is visually dimmed and interaction is locked while your 6-digit authentication code is pending verification.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Parent Mobile Report Dispatch Modal */}
      <ParentMobileReportModal
        isOpen={isParentReportOpen}
        onClose={() => setIsParentReportOpen(false)}
        profile={profile}
        dna={dna}
        masteries={masteries}
        onUpdateParentPhone={(phone, name, language) => {
          const up: UserProfile = {
            ...profile,
            parentPhone: phone,
            parentName: name,
            parentPreferredLanguage: language || profile.parentPreferredLanguage || profile.preferredLanguage,
            parentMobileVerified: true,
          };
          setProfile(up);
          saveUserProfile(up, activeStudentId);
        }}
      />

      {/* Mandatory Parent Mobile Registration Before Learning */}
      <ParentMobileRequiredModal
        isOpen={isParentMobileRequiredOpen}
        onClose={() => {
          setIsParentMobileRequiredOpen(false);
          if (pendingLearningTab) {
            setCurrentTab(pendingLearningTab);
            setPendingLearningTab(null);
          }
        }}
        onConfirm={handleConfirmParentMobile}
        profile={profile}
        dna={dna}
        masteries={masteries}
        targetActionLabel={
          pendingLearningTab === 'learn'
            ? 'Interactive Lesson'
            : pendingLearningTab === 'practice'
            ? 'NCERT Practice Drill'
            : pendingLearningTab === 'revision'
            ? 'Spaced Revision'
            : pendingLearningTab === 'mock_exam'
            ? 'Mock Test'
            : 'Learning Modules'
        }
      />

      {/* Multi-Platform Social Share Modal */}
      <SocialShareModal
        isOpen={isSocialShareOpen}
        onClose={() => setIsSocialShareOpen(false)}
        profile={profile}
        dna={dna}
      />

      {/* Self-Healing Auto-Debugging Pipeline Modal */}
      <SelfHealingDashboardModal
        isOpen={isSelfHealingOpen}
        onClose={() => setIsSelfHealingOpen(false)}
      />

      {/* Global Quick Formula Cheat-Sheet Overlay (Shift + F) */}
      {isStudentLoggedIn && (
        <QuickFormulaOverlay
          isOpen={isFormulaOverlayOpen}
          onClose={() => setIsFormulaOverlayOpen(false)}
        />
      )}

      {/* 10-Minute Peer Study Match Collaborative Room */}
      {isStudentLoggedIn && (
        <PeerStudyMatch
          isOpen={isPeerMatchOpen}
          onClose={() => setIsPeerMatchOpen(false)}
          userProfile={profile}
        />
      )}

      {/* Gamified Mastery Pop Level-Up Toast */}
      {masteryPopAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-zinc-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce border-2 border-amber-200">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-amber-400 flex items-center justify-center font-black text-sm font-mono shadow-inner">
            +{masteryPopAlert.delta}%
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-wider flex items-center gap-1">
              <span>Mastery Progress Pop!</span>
              <span>🎉</span>
            </div>
            <div className="text-[11px] font-bold text-zinc-900 capitalize">
              {masteryPopAlert.conceptName} • {masteryPopAlert.newScore}% Mastery
            </div>
          </div>
        </div>
      )}
      {/* Floating Right Overflow Utility Slider (Language, Focus, Share) */}
      <FloatingUtilitySlider
        currentLanguage={profile.preferredLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        isFocusMode={focusModeState.isActive}
        onToggleFocusMode={toggleFocusMode}
        onOpenSocialShare={() => setIsSocialShareOpen(true)}
      />

      {/* Universal Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={profile.preferredLanguage}
        onSelectLanguage={handleUpdateLanguage}
      />
    </div>
  );
}
