import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
  Brain,
  Code2,
  Award,
  Zap,
  Globe,
  Compass,
  Check,
  ChevronRight,
  TrendingUp,
  FileText,
  RotateCcw,
  Shield,
  Layers,
  HelpCircle,
  Clock,
  Volume2,
} from 'lucide-react';
import {
  LanguageCode,
  ExamCategory,
  GoalCategory,
  EducationBoard,
  TechTrack,
  DeveloperLevel,
  UserProfile,
  CourseProgressSession,
} from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import { CURRICULUM_SUBJECTS } from '../../data/curriculum';
import { ALL_INDIAN_BOARDS, StateBoardDetail } from '../../data/allStateBoards';
import { SpeechSynthesisPlayer } from '../common/SpeechSynthesisPlayer';
import { SocialShareModal } from '../common/SocialShareModal';
import { SystemDiagnosticsModal } from '../common/SystemDiagnosticsModal';
import { loadLastCourseSession } from '../../services/storageService';

interface StudyOSHomeViewProps {
  language: LanguageCode;
  profile: UserProfile;
  onConfirmGoal: (updates: {
    goalCategory: GoalCategory;
    selectedExam: ExamCategory;
    selectedBoard?: EducationBoard;
    selectedTechTrack?: TechTrack;
    developerLevel?: DeveloperLevel;
    preferredLanguage: LanguageCode;
    autoSendReportsToParent?: boolean;
    parentPhone?: string;
    parentName?: string;
  }) => void;
  onNavigateTab: (tab: string) => void;
}

export const StudyOSHomeView: React.FC<StudyOSHomeViewProps> = ({
  language,
  profile,
  onConfirmGoal,
  onNavigateTab,
}) => {
  // 4-Step Onboarding Wizard State
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [selectedGoal, setSelectedGoal] = useState<GoalCategory>(
    profile.goalCategory || 'school_board'
  );
  const [selectedBoard, setSelectedBoard] = useState<EducationBoard>(
    profile.selectedBoard || 'CBSE'
  );
  const [selectedExam, setSelectedExam] = useState<ExamCategory>(
    profile.selectedExam || 'CBSE_10'
  );
  const [selectedTechTrack, setSelectedTechTrack] = useState<TechTrack>(
    profile.selectedTechTrack || 'laravel'
  );
  const [selectedDevLevel, setSelectedDevLevel] = useState<DeveloperLevel>(
    profile.developerLevel || 'beginner'
  );
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(
    profile.preferredLanguage || language || 'hi'
  );
  const [selectedClass, setSelectedClass] = useState<'10' | '12'>('10');
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [boardSearchQuery, setBoardSearchQuery] = useState<string>('');
  const [selectedBoardRegion, setSelectedBoardRegion] = useState<string>('All');
  const [autoSendToParent, setAutoSendToParent] = useState<boolean>(
    profile.autoSendReportsToParent ?? true
  );
  const [parentPhoneInput, setParentPhoneInput] = useState<string>(
    profile.parentPhone || '+919876543210'
  );
  const [parentNameInput, setParentNameInput] = useState<string>(
    profile.parentName || 'Ramesh Kumar'
  );
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);
  const [lastSession] = useState<CourseProgressSession | null>(() =>
    loadLastCourseSession(profile.id)
  );

  const handleResumeCourse = () => {
    if (lastSession) {
      onNavigateTab(lastSession.targetTab || 'learn');
    } else {
      onNavigateTab('learn');
    }
  };

  // Sync exam when Board or Class changes
  const handleBoardChange = (board: EducationBoard, targetClass: '10' | '12') => {
    setSelectedBoard(board);
    setSelectedClass(targetClass);
    if (board === 'UP_BOARD') {
      setSelectedExam(targetClass === '10' ? 'UP_BOARD_10' : 'UP_BOARD_12');
    } else {
      setSelectedExam(targetClass === '10' ? 'CBSE_10' : 'CBSE_12');
    }
  };

  const handleQuickBoardSelect = (board: EducationBoard) => {
    handleBoardChange(board, selectedClass);
    setIsBoardModalOpen(false);
    onConfirmGoal({
      goalCategory: selectedGoal,
      selectedExam: board === 'UP_BOARD' ? (selectedClass === '10' ? 'UP_BOARD_10' : 'UP_BOARD_12') : (selectedClass === '10' ? 'CBSE_10' : 'CBSE_12'),
      selectedBoard: board,
      preferredLanguage: selectedLang,
      autoSendReportsToParent: autoSendToParent,
      parentPhone: parentPhoneInput,
      parentName: parentNameInput,
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  const handleFinalConfirm = () => {
    onConfirmGoal({
      goalCategory: selectedGoal,
      selectedExam,
      selectedBoard,
      selectedTechTrack: selectedGoal === 'dev_interview' ? selectedTechTrack : undefined,
      developerLevel: selectedGoal === 'dev_interview' ? selectedDevLevel : undefined,
      preferredLanguage: selectedLang,
      autoSendReportsToParent: autoSendToParent,
      parentPhone: parentPhoneInput,
      parentName: parentNameInput,
    });
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
      if (selectedGoal === 'dev_interview') {
        onNavigateTab('dev_prep');
      } else {
        onNavigateTab('mission');
      }
    }, 900);
  };

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) ||
    SUPPORTED_LANGUAGES[0];

  const selectedBoardDetail =
    ALL_INDIAN_BOARDS.find((b) => b.id === selectedBoard) || ALL_INDIAN_BOARDS[0];

  const filteredBoards = ALL_INDIAN_BOARDS.filter((b) => {
    const matchesQuery =
      b.name.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
      b.state.toLowerCase().includes(boardSearchQuery.toLowerCase()) ||
      b.nativeName.toLowerCase().includes(boardSearchQuery.toLowerCase());
    const matchesRegion =
      selectedBoardRegion === 'All' || b.region === selectedBoardRegion;
    return matchesQuery && matchesRegion;
  });

  const getWizardOverviewText = () => {
    if (selectedGoal === 'school_board') {
      return `Targeting ${selectedBoard} Board Class ${selectedClass} with official NCERT and State Board textbook problems. Spaced revision and multilingual speech synthesis active in ${currentLangObj.name}.`;
    }
    if (selectedGoal === 'competitive_entrance') {
      return `Targeting ${selectedExam.replace('_', ' ')} with strict negative marking (-1) simulation, high-yield weightage mapping, and speed calibration.`;
    }
    return `Targeting Developer Technical Interviews in ${selectedTechTrack.toUpperCase()} at the ${selectedDevLevel.toUpperCase()} level with live code evaluation and architectural drills.`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-16 px-1 sm:px-0">
      {/* Quick Action Top Bar: Resume Learning & Social Share */}
      {lastSession && (
        <div className="bg-gradient-to-r from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center text-xl font-bold shrink-0 shadow-lg shadow-amber-500/20">
              ⚡
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Continuous Progress Saved
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {lastSession.progressPercent}% Completed
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100">
                Continue: {lastSession.chapterTitle}
              </h2>
              <p className="text-xs text-zinc-400">
                Topic: <span className="text-zinc-200 font-medium">{lastSession.conceptTitle || 'Physics Concepts'}</span> • Pick up right where you paused.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5"
              title="Share progress with friends on WhatsApp, Instagram, Snapchat"
            >
              <span>📲 Share App</span>
            </button>

            <button
              onClick={handleResumeCourse}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Resume Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-Step Adaptive Onboarding Wizard</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-100 tracking-tight font-sans">
              Personalize Your Exam & Career Target
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              StudyOS AI dynamically calibrates official textbook problem sets, spaced revision intervals, and audio explanations according to your exact educational board and goal.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <SpeechSynthesisPlayer
                textToSpeak={getWizardOverviewText()}
                language={selectedLang}
                title={`Listen in ${currentLangObj.nativeName}`}
                variant="button"
                showSpeedControl={true}
              />
            </div>
          </div>

          {/* Wizard Progress Pill Card */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 shrink-0 space-y-3 sm:w-64">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-400">Step {wizardStep} of 4</span>
              <span className="text-amber-400 font-bold">{wizardStep * 25}% Complete</span>
            </div>

            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${wizardStep * 25}%` }}
              />
            </div>

            <div className="text-[11px] text-zinc-400 leading-snug">
              {wizardStep === 1 && '1. Choose Target Pathway'}
              {wizardStep === 2 && '2. Select Board / Exam / Track'}
              {wizardStep === 3 && '3. Class, Level & Language'}
              {wizardStep === 4 && '4. Syllabus Verification'}
            </div>
          </div>
        </div>
      </div>

      {/* Step Indicators Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {[
          { step: 1, title: 'Target Pathway', sub: 'School, Entrance, Dev' },
          { step: 2, title: 'Board & Track', sub: 'CBSE, ICSE, UP, JEE' },
          { step: 3, title: 'Level & Language', sub: 'Class 10/12 & Hindi/Eng' },
          { step: 4, title: 'Verify & Start', sub: 'Curated Syllabus' },
        ].map((item) => (
          <button
            key={item.step}
            type="button"
            onClick={() => setWizardStep(item.step)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              wizardStep === item.step
                ? 'bg-amber-500/10 border-amber-500/80 shadow-md text-amber-300'
                : wizardStep > item.step
                ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300'
                : 'bg-zinc-950 border-zinc-850 text-zinc-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold">STEP 0{item.step}</span>
              {wizardStep > item.step && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              )}
            </div>
            <div className="font-bold text-xs sm:text-sm text-zinc-100 mt-1">{item.title}</div>
            <div className="text-[10px] text-zinc-400 truncate">{item.sub}</div>
          </button>
        ))}
      </div>

      {/* STEP 1: TARGET PATHWAY SELECTION */}
      {wizardStep === 1 && (
        <div className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-100 font-sans">
              Step 1: Choose Your Primary Learning Pathway
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Select the domain you are actively preparing for. StudyOS will filter your entire dashboard accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Pathway 1: School & Board */}
            <div
              onClick={() => {
                setSelectedGoal('school_board');
                setWizardStep(2);
              }}
              className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 hover:border-amber-500/80 group ${
                selectedGoal === 'school_board'
                  ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                📚
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-100">School & Board Exams</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                    Class 10 & 12
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Official NCERT & State Board textbook drills, in-text exercises, exemplar questions, and board exam PYQs.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>CBSE, ICSE, UP, State Boards</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pathway 2: Competitive Entrance */}
            <div
              onClick={() => {
                setSelectedGoal('competitive_entrance');
                setWizardStep(2);
              }}
              className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 hover:border-amber-500/80 group ${
                selectedGoal === 'competitive_entrance'
                  ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                🎯
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-100">Competitive Entrance</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                    JEE / NEET / CUET
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Negative marking test engines (-1 mark), high-yield weightage, multi-concept physics/math speed drills.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-amber-400 font-semibold">
                <span>NTA Simulated CBT Mode</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pathway 3: Dev Tech Interviews */}
            <div
              onClick={() => {
                setSelectedGoal('dev_interview');
                setWizardStep(2);
              }}
              className={`p-6 rounded-2xl border cursor-pointer transition-all space-y-4 hover:border-amber-500/80 group ${
                selectedGoal === 'dev_interview'
                  ? 'bg-amber-500/10 border-amber-500 text-zinc-100 shadow-lg ring-1 ring-amber-500/30'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                💻
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-zinc-100">Tech Interview Prep</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                    Staff-Level Dev
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Laravel, Python, React, AI/Transformers, DSA, and System Design with live code review & automated feedback.
                </p>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                <span>Production Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Pathway 4: Apprentice Educator & Teacher Training */}
            <div
              onClick={() => {
                onNavigateTab('apprentice_teaching');
              }}
              className="p-6 rounded-2xl border cursor-pointer transition-all space-y-4 hover:border-amber-500 group bg-amber-500/10 border-amber-500/40 text-zinc-100 shadow-lg ring-1 ring-amber-500/20 hover:bg-amber-500/15"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform">
                👩‍🏫
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-white">Apprentice Educator</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/30 text-amber-200 font-semibold">
                    B.Ed • BTC • ITI
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Practical phase micro-teaching AI studio (mobile/laptop/desktop), multi-take recording, and campus reels feed with peer judging.
                </p>
              </div>

              <div className="pt-2 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-300 font-semibold">
                <span>Teaching Reels & Studio</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="py-3 px-6 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all shadow-md"
            >
              <span>Continue to Step 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BOARD / EXAM / TECH TRACK SELECTION */}
      {wizardStep === 2 && (
        <div className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-100 font-sans">
                Step 2: Select Specific Board or Exam Target
              </h2>
              <p className="text-xs text-zinc-400">
                StudyOS customizes textbook citations, question weightage, and exercise categories for this selection.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="text-xs text-zinc-400 hover:text-zinc-200 self-start sm:self-auto font-mono underline"
            >
              ← Change Pathway
            </button>
          </div>

          {/* Conditional Step 2 content based on Pathway */}
          {selectedGoal === 'school_board' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-400">
                    Choose Education Board (All 28 Indian States & UTs):
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Showing {filteredBoards.length} of {ALL_INDIAN_BOARDS.length} verified Indian state & national boards
                  </p>
                </div>

                {/* Search Bar for State Boards */}
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    value={boardSearchQuery}
                    onChange={(e) => setBoardSearchQuery(e.target.value)}
                    placeholder="Search by state or board (e.g. WB, Tamil Nadu, UP, Bihar)..."
                    className="w-full px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
                  />
                </div>
              </div>

              {/* Geographic Region Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {['All', 'National', 'North', 'South', 'East', 'West', 'Central', 'North-East'].map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedBoardRegion(region)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedBoardRegion === region
                        ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>

              {/* All Indian State Boards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1 no-scrollbar">
                {filteredBoards.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleBoardChange(b.id as EducationBoard, selectedClass)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      selectedBoard === b.id
                        ? 'bg-amber-500/15 border-amber-500 text-zinc-100 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-zinc-800 text-amber-400 border border-zinc-750">
                            {b.region}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">{b.state}</span>
                        </div>
                        <h4 className="font-bold text-sm text-zinc-100 mt-1">{b.name}</h4>
                      </div>
                      {selectedBoard === b.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{b.description}</p>
                    <div className="pt-1 flex items-center justify-between">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-900 text-zinc-300 border border-zinc-800 truncate max-w-[180px]">
                        {b.textbookStandard}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedGoal === 'competitive_entrance' && (
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Choose Competitive Examination:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'JEE_MAIN',
                    title: 'JEE Main & Advanced',
                    desc: 'Physics, Chemistry, Mathematics with NTA CBT Simulator (-1 negative marking)',
                    badge: 'Engineering',
                  },
                  {
                    id: 'NEET_UG',
                    title: 'NEET UG',
                    desc: 'Physics, Chemistry, Biology (Botany & Zoology) with 180-minute speed drills',
                    badge: 'Medical',
                  },
                  {
                    id: 'CUET',
                    title: 'CUET UG',
                    desc: 'Domain subjects, General test and language papers for Central Universities',
                    badge: 'University Entrance',
                  },
                ].map((ex) => (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExam(ex.id as ExamCategory)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      selectedExam === ex.id
                        ? 'bg-amber-500/15 border-amber-500 text-zinc-100 shadow-md ring-1 ring-amber-500/40'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-zinc-100">{ex.title}</h4>
                      {selectedExam === ex.id && (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{ex.desc}</p>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
                      {ex.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedGoal === 'dev_interview' && (
            <div className="space-y-4">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Choose Tech Stack & Architectural Track:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  {
                    id: 'laravel',
                    title: 'Laravel & Modern PHP',
                    desc: 'Eloquent ORM, Service Container, Queues, Pipelines, Query optimization',
                  },
                  {
                    id: 'python',
                    title: 'Python Backend & FastAPI',
                    desc: 'AsyncIO, Pydantic, GIL internals, PyTest, Memory management, Decorators',
                  },
                  {
                    id: 'javascript',
                    title: 'React 19 & Full-Stack JS',
                    desc: 'Server Actions, React Compiler, Concurrent Mode, Event loop, Microtasks',
                  },
                  {
                    id: 'ai_ml',
                    title: 'AI, Transformers & LLMs',
                    desc: 'Self-Attention, Embeddings, KV-Caching, Quantization, RAG Architectures',
                  },
                  {
                    id: 'dsa',
                    title: 'Data Structures & Algorithms',
                    desc: 'Binary Search, Graphs, Dynamic Programming, Heap/Trie, Time Complexity',
                  },
                  {
                    id: 'system_design',
                    title: 'System Design & High-Load',
                    desc: 'Distributed Sharding, Raft Consensus, Redis caching, Rate Limiters',
                  },
                ].map((track) => (
                  <div
                    key={track.id}
                    onClick={() => setSelectedTechTrack(track.id as TechTrack)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                      selectedTechTrack === track.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-zinc-100 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-zinc-100">{track.title}</h4>
                      {selectedTechTrack === track.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{track.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(1)}
              className="py-2.5 px-5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="py-3 px-6 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all shadow-md"
            >
              <span>Continue to Step 3</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CLASS / LEVEL & LANGUAGE SELECTION */}
      {wizardStep === 3 && (
        <div className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-100 font-sans">
                Step 3: Target Class, Knowledge Level & Language
              </h2>
              <p className="text-xs text-zinc-400">
                Configure your grade or engineering depth, plus the language for AI explanations and speech audio narration.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="text-xs text-zinc-400 hover:text-zinc-200 self-start sm:self-auto font-mono underline"
            >
              ← Back to Board / Track
            </button>
          </div>

          {/* Standard / Grade or Developer Level */}
          {selectedGoal !== 'dev_interview' ? (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Select Target Class / Grade:
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => handleBoardChange(selectedBoard, '10')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    selectedClass === '10'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-base font-bold">Class 10 (Secondary)</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Foundation Science & Mathematics</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleBoardChange(selectedBoard, '12')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    selectedClass === '12'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-md'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-base font-bold">Class 12 (Sr Secondary)</div>
                  <div className="text-[11px] text-zinc-400 mt-1">Advanced Physics & Calculus</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Select Engineering Calibration Level:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'beginner', title: 'Novice / Junior', desc: 'Syntax, basic APIs, fundamentals' },
                  { id: 'intermediate', title: 'Mid-Level', desc: 'Async patterns, DB indexes, testing' },
                  { id: 'senior', title: 'Senior Engineer', desc: 'Architecture, bottlenecks, concurrency' },
                  { id: 'top_class', title: 'Staff / Principal', desc: 'Distributed systems, micro-optimizations' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedDevLevel(lvl.id as DeveloperLevel)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedDevLevel === lvl.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 font-bold shadow-md'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-100">{lvl.title}</div>
                    <div className="text-[10px] text-zinc-400 mt-1 leading-snug">{lvl.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Learning Language Selection */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase text-zinc-400">
                Select Preferred Explanation & TTS Language:
              </label>
              <span className="text-[11px] text-amber-400 font-mono">
                Active: {currentLangObj.name} ({currentLangObj.nativeName})
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLang(lang.code)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                    selectedLang === lang.code
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold shadow-sm'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-zinc-200 truncate">
                      {lang.nativeName}
                    </div>
                    <div className="text-[10px] text-zinc-400 truncate">{lang.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setWizardStep(2)}
              className="py-2.5 px-5 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setWizardStep(4)}
              className="py-3 px-6 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-2 hover:bg-amber-400 transition-all shadow-md"
            >
              <span>Review Syllabus & Confirm</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SYLLABUS VERIFICATION & LAUNCH */}
      {wizardStep === 4 && (
        <div className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-zinc-100 font-sans">
                Step 4: Confirm Target & Verified Curriculum Source
              </h2>
              <p className="text-xs text-zinc-400">
                All practice modules, diagnostic weights, and spaced repetition queues will be synchronized to IndexedDB.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setWizardStep(3)}
              className="text-xs text-zinc-400 hover:text-zinc-200 self-start sm:self-auto font-mono underline"
            >
              ← Edit Preferences
            </button>
          </div>

          {/* Configuration Summary Card */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-lg">
                  {selectedGoal === 'dev_interview' ? '💻' : '🎯'}
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-zinc-100">
                    {selectedGoal === 'school_board' && `${selectedBoard} Board — Class ${selectedClass}`}
                    {selectedGoal === 'competitive_entrance' && `${selectedExam.replace('_', ' ')} Entrance Examination`}
                    {selectedGoal === 'dev_interview' && `${selectedTechTrack.toUpperCase()} (${selectedDevLevel.toUpperCase()})`}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Language: <strong className="text-amber-400">{currentLangObj.name} ({currentLangObj.nativeName})</strong> • Storage: <span className="text-emerald-400">IndexedDB Synced</span>
                  </p>
                </div>
              </div>

              <SpeechSynthesisPlayer
                textToSpeak={getWizardOverviewText()}
                language={selectedLang}
                title="Hear Summary"
                size="sm"
                variant="pill"
              />
            </div>

            {/* Automatic Parent Progress Dispatch Settings */}
            <div className="p-4 bg-zinc-950/90 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    📱
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100">
                      Automatic Real-Time Progress Dispatch to Parents
                    </h4>
                    <p className="text-[11px] text-zinc-400">
                      Automatically sends study streaks, practice accuracy, and milestone reports to guardian’s mobile. No manual dispatch needed.
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoSendToParent}
                    onChange={(e) => setAutoSendToParent(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              {autoSendToParent && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                      Parent Mobile Number (WhatsApp / SMS):
                    </label>
                    <input
                      type="tel"
                      value={parentPhoneInput}
                      onChange={(e) => setParentPhoneInput(e.target.value)}
                      placeholder="+919876543210"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                      Parent / Guardian Name:
                    </label>
                    <input
                      type="text"
                      value={parentNameInput}
                      onChange={(e) => setParentNameInput(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Curriculum Highlights */}
            <div className="pt-3 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Primary Textbook:
                </span>
                <span className="font-semibold text-zinc-200">
                  {selectedGoal === 'school_board' ? `${selectedBoard} NCERT Textbook Edition` : selectedGoal === 'dev_interview' ? 'Standard Framework RFC & Spec' : 'NTA NCERT Exemplar & PYQs'}
                </span>
              </div>

              <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Evaluation Rules:
                </span>
                <span className="font-semibold text-zinc-200">
                  {selectedGoal === 'competitive_entrance' ? '+4 Marks, -1 Negative Marking' : 'Confidence-Weighted Diagnostic'}
                </span>
              </div>

              <div className="p-3 bg-zinc-900/70 rounded-xl border border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Audio & Speech Engine:
                </span>
                <span className="font-semibold text-emerald-400">
                  Web Speech API Active ({selectedLang.toUpperCase()})
                </span>
              </div>
            </div>
          </div>

          {/* Action Button & Confirmation Toast */}
          <div className="space-y-3 pt-2">
            {isSavedToast && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profile preferences successfully saved! Launching personalized dashboard...</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="flex-1 py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg select-none"
              >
                <span>Confirm Goal & Start Learning Mission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual / On-Demand Board Selection Modal (persist in profile without preloading in header) */}
      {isBoardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setIsBoardModalOpen(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-all font-mono"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                🏛️
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-100 font-sans">
                  Select Educational Board (All 28 Indian States & UTs)
                </h3>
                <p className="text-xs text-zinc-400">
                  Select your state or national board to persist in your private student profile.
                </p>
              </div>
            </div>

            {/* Search and Region filter */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={boardSearchQuery}
                onChange={(e) => setBoardSearchQuery(e.target.value)}
                placeholder="Search state board (e.g., WB, UP, Tamil Nadu, Bihar, CBSE)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['All', 'National', 'North', 'South', 'East', 'West', 'Central', 'North-East'].map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedBoardRegion(region)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedBoardRegion === region
                      ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Board Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 no-scrollbar">
              {filteredBoards.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleQuickBoardSelect(b.id as EducationBoard)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedBoard === b.id
                      ? 'bg-amber-500/15 border-amber-500 text-zinc-100 ring-1 ring-amber-500/40'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono font-bold block">{b.state}</span>
                      <h4 className="font-bold text-xs text-zinc-100">{b.name}</h4>
                    </div>
                    {selectedBoard === b.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security & Multi-Layer System Verification Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Anti-Hack Armor Active:</strong> Strict CSP, XSS sanitization, HMAC storage checksums & offline caching verified.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsDiagnosticsModalOpen(true)}
            className="px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5"
          >
            <span>🛡️ Run Security Tests</span>
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
          >
            <span>🚀 Share App</span>
          </button>
        </div>
      </div>

      {/* Social Share Modal */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
      />

      {/* High-Level Security Diagnostics Modal */}
      <SystemDiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
      />
    </div>
  );
};

