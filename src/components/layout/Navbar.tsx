import React from 'react';
import {
  Flame,
  ChevronDown,
  Wifi,
  WifiOff,
  BookOpen,
  Target,
  Cpu,
  Lock,
  LogOut,
  User,
} from 'lucide-react';
import {
  LanguageCode,
  UserProfile,
  ExamCategory,
  EducationBoard,
} from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onUpdateLanguage: (lang: LanguageCode) => void;
  onToggleRole?: () => void;
  onOpenAITutor: () => void;
  onOpenAccountPrivacy: () => void;
  onToggleOfflineMode?: () => void;
  isOfflineMode?: boolean;
  onOpenGoogleAuth?: () => void;
  onOpenParentReport?: () => void;
  onOpenSocialShare?: () => void;
  isFocusMode?: boolean;
  onToggleFocusMode?: () => void;
  onOpenSelfHealing?: () => void;
  onOpenQuickFormulas?: () => void;
  onOpenPeerMatch?: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  onUpdateLanguage,
  onToggleRole,
  onOpenAITutor,
  onOpenAccountPrivacy,
  onToggleOfflineMode,
  isOfflineMode = false,
  onOpenGoogleAuth,
  onOpenParentReport,
  onOpenSocialShare,
  isFocusMode = false,
  onToggleFocusMode,
  onOpenSelfHealing,
  onOpenQuickFormulas,
  onOpenPeerMatch,
  onSignOut,
}) => {
  const isLoggedIn = profile.authProvider !== 'guest' && Boolean(profile.email);

  // Dynamic Navigation Items based on Goal
  const getNavItems = () => {
    // Menu mission, learn, Mind map, textbook practice, Revision, Mock Exam, Readiness, DNA, Career
    // must be hidden unless student login successfully
    if (!isLoggedIn) {
      return [
        { id: 'home', label: '🎯 Goal & Board' },
      ];
    }

    const goal = profile.goalCategory || 'school_board';

    if (goal === 'teacher_training') {
      return [
        { id: 'practice', label: '📘 Lesson Practice' },
        { id: 'career', label: '🎓 Teacher Career Path' },
        { id: 'home', label: '🎯 Switch Goal' },
      ];
    }

    if (goal === 'dev_interview') {
      return [
        { id: 'home', label: '🎯 Switch Goal' },
        { id: 'dev_prep', label: '💻 Dev Prep Hub', highlight: true },
        { id: 'career', label: '🚀 Tech Careers' },
      ];
    }

    if (goal === 'competitive_entrance') {
      return [
        { id: 'home', label: '🎯 Switch Exam' },
        { id: 'mission', label: 'Mission' },
        { id: 'learn', label: 'Learn' },
        { id: 'mindmap', label: '🧠 Mind Map' },
        { id: 'practice', label: 'Practice' },
        { id: 'revision', label: 'Revision' },
        { id: 'mock_exam', label: 'Mock Exam' },
        { id: 'readiness', label: 'Readiness' },
        { id: 'dna', label: 'DNA' },
        { id: 'career', label: 'Career' },
      ];
    }

    // Default: School & Board Exams (CBSE, ICSE, UP Board)
    return [
      { id: 'home', label: '🎯 Goal & Board' },
      { id: 'mission', label: 'Mission' },
      { id: 'learn', label: 'Learn' },
      { id: 'mindmap', label: '🧠 Mind Map' },
      { id: 'practice', label: '📘 Textbook Practice' },
      { id: 'revision', label: 'Revision' },
      { id: 'mock_exam', label: 'Mock Exam' },
      { id: 'readiness', label: 'Readiness' },
      { id: 'dna', label: 'DNA' },
      { id: 'career', label: 'Career' },
    ];
  };

  const navItems = getNavItems();

  const getGoalBadgeLabel = () => {
    if (profile.goalCategory === 'dev_interview') {
      return `${(profile.selectedTechTrack || 'dev').toUpperCase()} • ${profile.developerLevel || 'Junior'}`;
    }
    if (profile.goalCategory === 'school_board') {
      return `${profile.selectedBoard || 'CBSE'} (NCERT)`;
    }
    return profile.selectedExam.replace('_', ' ');
  };

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4">
          {/* Zone 1: Brand Wordmark & Goal Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
              title="Return to StudyOS Homepage & Goal Selector"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-base shadow-sm">
                S
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-zinc-100 font-sans">
                  StudyOS<span className="text-amber-400">.AI</span>
                </span>
              </div>
            </button>

            {/* Target Board / Exam Badge: Visible ONLY after selection/confirmation by student */}
            {profile.isGoalConfirmed && (
              <button
                onClick={() => onSelectTab('home')}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-zinc-900 text-amber-300 rounded-lg border border-zinc-700/80 hover:border-amber-500/50 transition-all font-mono whitespace-nowrap min-h-[32px] animate-fadeIn"
                title="Click to change target Board, Exam or Developer Track"
              >
                <Target className="w-3 h-3 text-amber-400" />
                <span>{getGoalBadgeLabel()}</span>
              </button>
            )}
          </div>

          {/* Zone 2: Navigation Links (Strictly Filtered by Goal & Auth State) */}
          {isLoggedIn ? (
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px] ${
                      isActive
                        ? item.highlight
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
                        : item.highlight
                        ? 'text-blue-400 hover:text-blue-300 hover:bg-blue-950/40'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectTab('home')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px] ${
                  currentTab === 'home'
                    ? 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                🎯 Goal & Board
              </button>
              {onOpenGoogleAuth && (
                <button
                  type="button"
                  onClick={onOpenGoogleAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
                  title="Sign in with your Google account to unlock Mission, Learn, Practice & Exams"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign in to unlock Mission, Learn, Practice & Exams</span>
                </button>
              )}
            </div>
          )}

          {/* Zone 3: Header Controls (Offline Mode + Role Switcher + Mobile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Offline Mode Indicator & Toggle */}
            <button
              onClick={onToggleOfflineMode}
              className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all min-h-[34px] ${
                isOfflineMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
              title={
                isOfflineMode
                  ? 'Offline Mode Active (Zero network calls required)'
                  : 'Connected • Click to test 100% Offline Mode'
              }
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-[11px]">Offline</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono text-[11px]">Online</span>
                </>
              )}
            </button>

            {/* Self-Healing Auto-Debugging AI SaaS Pipeline Trigger */}
            {onOpenSelfHealing && (
              <button
                onClick={onOpenSelfHealing}
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[34px]"
                title="Open Self-Healing AI Pipeline (Auto-Error Capture, Tri-Agent Debugging & Vitest Verification)"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="whitespace-nowrap font-medium text-emerald-400">Self-Healing</span>
              </button>
            )}

            {/* User Account / Sign Out / Sign In Identity Control */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-800/80">
                <button
                  type="button"
                  onClick={onOpenAccountPrivacy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-amber-500/50 text-xs text-zinc-200 transition-all cursor-pointer group"
                  title="Manage Student Account & Switch User"
                >
                  {profile.googleProfile?.picture ? (
                    <img
                      src={profile.googleProfile.picture}
                      alt={profile.name}
                      className="w-4 h-4 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px] font-bold">
                      {profile.name?.charAt(0) || 'S'}
                    </span>
                  )}
                  <span className="max-w-[90px] sm:max-w-[120px] truncate font-medium text-zinc-200 group-hover:text-amber-300">
                    {profile.name || 'Student'}
                  </span>
                </button>

                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all cursor-pointer"
                    title="Sign Out (Wipe active student session from DOM immediately)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                )}
              </div>
            ) : (
              onOpenGoogleAuth && (
                <button
                  type="button"
                  onClick={onOpenGoogleAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )
            )}
          </div>
        </div>

        {/* Mobile Horizontal Navigation Scroller (Visible when logged in) */}
        {isLoggedIn && (
          <div className="flex lg:hidden items-center justify-start gap-1 px-2 py-1.5 border-t border-zinc-800/80 bg-zinc-950 overflow-x-auto no-scrollbar">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap min-h-[32px] ${
                    isActive
                      ? item.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-800 text-amber-400'
                      : item.highlight
                      ? 'text-blue-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
};
