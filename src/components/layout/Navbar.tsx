import React, { useState } from 'react';
import {
  Globe,
  Flame,
  UserCheck,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Lock,
  Wifi,
  WifiOff,
  BookOpen,
  Target,
  User,
  Menu,
  X,
  Share2,
  EyeOff,
  Maximize2,
  Cpu,
  Calculator,
  Users,
  Network,
} from 'lucide-react';
import {
  LanguageCode,
  UserProfile,
  ExamCategory,
  EducationBoard,
} from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { LanguageSelectorModal } from './LanguageSelectorModal';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  profile: UserProfile;
  onUpdateLanguage: (lang: LanguageCode) => void;
  onToggleRole: () => void;
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
}) => {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === profile.preferredLanguage) ||
    SUPPORTED_LANGUAGES[0];

  // Dynamic Navigation Items based on Goal
  const getNavItems = () => {
    const goal = profile.goalCategory || 'school_board';

    if (goal === 'teacher_training') {
      return [
        { id: 'apprentice_teaching', label: '👩‍🏫 Teaching Reels & Studio', highlight: true },
        { id: 'practice', label: '📘 Lesson Practice' },
        { id: 'career', label: '🎓 Teacher Career Path' },
        { id: 'home', label: '🎯 Switch Goal' },
      ];
    }

    if (goal === 'dev_interview') {
      return [
        { id: 'home', label: '🎯 Switch Goal' },
        { id: 'dev_prep', label: '💻 Dev Prep Hub', highlight: true },
        { id: 'apprentice_teaching', label: '👩‍🏫 Teaching Reels' },
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
        { id: 'apprentice_teaching', label: '👩‍🏫 Teaching Reels', highlight: true },
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
      { id: 'apprentice_teaching', label: '👩‍🏫 Teaching Reels & Studio', highlight: true },
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
    setIsMobileMenuOpen(false);
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

          {/* Zone 2: Navigation Links (Strictly Filtered by Goal) */}
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

          {/* Zone 3: Primary Actions (Private Account + Language + AI Coach + Mobile Menu Toggle) */}
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

            {/* Student Private Account & Data Privacy Action */}
            <button
              onClick={onOpenAccountPrivacy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px]"
              title="My Private Account & Security Settings"
            >
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
              </div>
              <span className="max-w-[80px] sm:max-w-[100px] truncate font-medium">
                {profile.name.split(' ')[0]}
              </span>
            </button>

            {/* Universal Language Switcher */}
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-200 hover:border-amber-500/50 hover:bg-zinc-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px]"
              title="Change Learning Language (TTS & Explanations)"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap hidden md:inline">{currentLangObj.nativeName}</span>
            </button>

            {/* Global Quick Formula Overlay Trigger */}
            {onOpenQuickFormulas && (
              <button
                onClick={onOpenQuickFormulas}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-amber-300 hover:border-amber-500/50 hover:bg-zinc-800 transition-all min-h-[34px]"
                title="Global Quick Formula Cheat Sheet (Shift + F)"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium whitespace-nowrap">Formulas</span>
              </button>
            )}

            {/* Peer Study Match 10-Min Room Trigger */}
            {onOpenPeerMatch && (
              <button
                onClick={onOpenPeerMatch}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500/50 hover:bg-zinc-800 transition-all min-h-[34px]"
                title="Peer Study Match: 10-Minute Collaborative Room"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium whitespace-nowrap">Peer Room</span>
              </button>
            )}

            {/* Distraction-Free Focus Mode Trigger */}
            {onToggleFocusMode && (
              <button
                onClick={onToggleFocusMode}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px] ${
                  isFocusMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-inner'
                    : 'bg-zinc-900 border-zinc-700/80 text-zinc-300 hover:text-amber-300 hover:border-amber-500/50 hover:bg-zinc-800'
                }`}
                title="Toggle Distraction-Free Focus Mode (Dims Background, Hides Non-Essentials)"
              >
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="whitespace-nowrap font-medium">Focus</span>
              </button>
            )}

            {/* Social Share Button */}
            {onOpenSocialShare && (
              <button
                onClick={onOpenSocialShare}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700/80 text-zinc-300 hover:text-amber-300 hover:border-amber-500/50 hover:bg-zinc-800 transition-all min-h-[34px]"
                title="Share StudyOS AI on WhatsApp, Instagram, Snapchat, Telegram"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium whitespace-nowrap">Share</span>
              </button>
            )}

            {/* Self-Healing Auto-Debugging AI SaaS Pipeline Trigger */}
            {onOpenSelfHealing && (
              <button
                onClick={onOpenSelfHealing}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 min-h-[34px]"
                title="Open Self-Healing AI Pipeline (Auto-Error Capture, Tri-Agent Debugging & Vitest Verification)"
              >
                <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="whitespace-nowrap font-medium text-emerald-400">Self-Healing</span>
              </button>
            )}

            {/* AI Personal Coach Drawer Trigger */}
            <button
              onClick={onOpenAITutor}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 min-h-[34px]"
            >
              <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
              <span className="whitespace-nowrap font-bold">AI Coach</span>
            </button>

            {/* Role Switcher (Student / Parent) */}
            <button
              onClick={onToggleRole}
              className={`p-1.5 rounded-lg border text-xs font-medium transition-all min-h-[34px] min-w-[34px] flex items-center justify-center ${
                profile.activeRole === 'parent'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title={profile.activeRole === 'parent' ? 'Parent Mode Active' : 'Switch to Parent View'}
            >
              <UserCheck className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Drawer Button */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-zinc-200 bg-zinc-900 min-h-[34px] min-w-[34px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Navigation Scroller */}
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
      </header>

      {/* Mobile Drawer Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-24 z-30 bg-zinc-900/95 border-b border-zinc-800 p-4 space-y-3 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="text-xs font-mono text-zinc-400 uppercase">Quick Actions</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setIsLangModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Language: {currentLangObj.name}</span>
            </button>

            <button
              onClick={() => {
                onOpenAccountPrivacy();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Private Account</span>
            </button>

            {onToggleOfflineMode && (
              <button
                onClick={() => {
                  onToggleOfflineMode();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 col-span-2"
              >
                {isOfflineMode ? (
                  <WifiOff className="w-4 h-4 text-amber-400" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                )}
                <span>{isOfflineMode ? 'Switch to Online Mode' : 'Simulate Offline Mode'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        currentLanguage={profile.preferredLanguage}
        onSelectLanguage={onUpdateLanguage}
      />
    </>
  );
};
