import React, { useState } from 'react';
import {
  Zap,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  Flame,
  Lock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  FileCheck,
  TrendingUp,
  Target,
  Layers,
  Calculator,
  Users,
  Network,
  Play,
  Square,
  Pause,
  VolumeX,
  Gauge,
  Sliders,
  Settings,
  GraduationCap,
  Building2,
  Search,
  X,
  ChevronRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, Concept, LanguageCode, UserProfile, ConceptMastery, EducationBoard } from '../../types';
import { CURRICULUM_SUBJECTS } from '../../data/curriculum';
import {
  getCurriculumForBoardAndClass,
  getBoardCurriculumInfo,
} from '../../data/boardCurriculumService';
import { ALL_INDIAN_BOARDS } from '../../data/allStateBoards';
import { getLocalizedText } from '../../data/languages';
import { FormulaRenderer } from '../common/FormulaRenderer';
import { ExplainDifferentlyView } from './ExplainDifferentlyView';
import { ConceptVoiceMemoRecorder } from './ConceptVoiceMemoRecorder';
import {
  speakText,
  stopSpeaking,
  isWebSpeechSupported,
  setOfflineTTSLessonsGloballyEnabled,
  setOfflineTTSSpeechRate,
} from '../../utils/speechUtils';
import { saveLastCourseSession } from '../../services/storageService';

interface InteractiveLessonViewProps {
  language: LanguageCode;
  profile: UserProfile;
  masteries?: Record<string, ConceptMastery>;
  onNavigateToPractice: (chapterId: string) => void;
  onNavigateToRevision?: () => void;
  onOpenQuickFormulas?: () => void;
  onOpenPeerMatch?: () => void;
  onOpenMindMap?: () => void;
  onOpenLanguageSettings?: () => void;
  onToggleOfflineTTS?: (enabled: boolean) => void;
  onUpdateProfile?: (updatedProfile: UserProfile) => void;
}

export const InteractiveLessonView: React.FC<InteractiveLessonViewProps> = ({
  language,
  profile,
  masteries = {},
  onNavigateToPractice,
  onNavigateToRevision,
  onOpenQuickFormulas,
  onOpenPeerMatch,
  onOpenMindMap,
  onOpenLanguageSettings,
  onToggleOfflineTTS,
  onUpdateProfile,
}) => {
  // Dynamic Board and Class state from User Profile
  const [selectedBoard, setSelectedBoard] = useState<EducationBoard>(profile.selectedBoard || 'CBSE');
  const [selectedClass, setSelectedClass] = useState<string>(
    profile.selectedClass || (String(profile.selectedExam || '').includes('12') ? '12' : '10')
  );
  const [isBoardClassModalOpen, setIsBoardClassModalOpen] = useState(false);
  const [boardSearchTerm, setBoardSearchTerm] = useState('');

  // Keep state in sync if profile updates
  React.useEffect(() => {
    if (profile.selectedBoard && profile.selectedBoard !== selectedBoard) {
      setSelectedBoard(profile.selectedBoard);
    }
    const resolvedClass = profile.selectedClass || (String(profile.selectedExam || '').includes('12') ? '12' : '10');
    if (resolvedClass !== selectedClass) {
      setSelectedClass(resolvedClass);
    }
  }, [profile.selectedBoard, profile.selectedClass, profile.selectedExam]);

  // Dynamically resolve curriculum subjects for selected board and class
  const availableSubjects = React.useMemo(() => {
    return getCurriculumForBoardAndClass(selectedBoard, selectedClass, language, profile.goalCategory);
  }, [selectedBoard, selectedClass, language, profile.goalCategory]);

  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const safeSubjectIndex = Math.min(activeSubjectIndex, Math.max(0, availableSubjects.length - 1));
  const currentSubject = availableSubjects[safeSubjectIndex] || availableSubjects[0] || CURRICULUM_SUBJECTS[0];

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const safeChapterIndex = Math.min(activeChapterIndex, Math.max(0, currentSubject.chapters.length - 1));
  const activeChapter: Chapter = currentSubject.chapters[safeChapterIndex] || currentSubject.chapters[0];

  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const safeConceptIndex = Math.min(currentConceptIndex, Math.max(0, activeChapter.concepts.length - 1));
  const currentConcept: Concept = activeChapter.concepts[safeConceptIndex] || activeChapter.concepts[0];

  const boardInfo = React.useMemo(() => {
    return getBoardCurriculumInfo(selectedBoard, selectedClass);
  }, [selectedBoard, selectedClass]);

  const handleSelectBoard = (newBoard: EducationBoard) => {
    setSelectedBoard(newBoard);
    setActiveSubjectIndex(0);
    setActiveChapterIndex(0);
    setCurrentConceptIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsBoardClassModalOpen(false);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        selectedBoard: newBoard,
        selectedExam: newBoard === 'UP_BOARD'
          ? (selectedClass === '10' ? 'UP_BOARD_10' : 'UP_BOARD_12')
          : (selectedClass === '10' ? 'CBSE_10' : 'CBSE_12'),
      });
    }
  };

  const handleSelectClass = (newClass: '10' | '12') => {
    setSelectedClass(newClass);
    setActiveSubjectIndex(0);
    setActiveChapterIndex(0);
    setCurrentConceptIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsBoardClassModalOpen(false);
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        selectedClass: newClass,
        selectedExam: selectedBoard === 'UP_BOARD'
          ? (newClass === '10' ? 'UP_BOARD_10' : 'UP_BOARD_12')
          : (newClass === '10' ? 'CBSE_10' : 'CBSE_12'),
      });
    }
  };

  const handleSelectSubject = (idx: number) => {
    setActiveSubjectIndex(idx);
    setActiveChapterIndex(0);
    setCurrentConceptIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const handleSelectChapter = (idx: number) => {
    setActiveChapterIndex(idx);
    setCurrentConceptIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  // Mandatory 'I Understand' Checkpoint States for Explanation Blocks:
  // Block 1: Principle & Intuition
  // Block 2: Mathematical Formulation & Law Equations
  // Block 3: Key Exam Traps & High-Yield Rules
  const [understoodBlocks, setUnderstoodBlocks] = useState<Record<string, { block1: boolean; block2: boolean; block3: boolean }>>({
    [currentConcept.id]: { block1: false, block2: false, block3: false },
  });

  // Step 2 checkpoint quiz states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedConceptIds, setCompletedConceptIds] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Offline-first Web Speech API TTS Lesson States
  const [isOfflineTTSEnabled, setIsOfflineTTSEnabled] = useState<boolean>(
    profile.enableOfflineTTSLessons ?? true
  );
  const [speechRate, setSpeechRate] = useState<number>(
    profile.ttsSpeechRate ?? 1.0
  );
  const [autoPlayLessons, setAutoPlayLessons] = useState<boolean>(
    profile.ttsAutoPlayLessons ?? false
  );
  const [activeBlockSpeaking, setActiveBlockSpeaking] = useState<
    'concept' | 'block1' | 'block2' | 'block3' | 'checkpoint' | 'full' | null
  >(null);

  // Sync profile changes
  React.useEffect(() => {
    if (profile.enableOfflineTTSLessons !== undefined) {
      setIsOfflineTTSEnabled(profile.enableOfflineTTSLessons);
    }
  }, [profile.enableOfflineTTSLessons]);

  React.useEffect(() => {
    if (profile.ttsSpeechRate !== undefined) {
      setSpeechRate(profile.ttsSpeechRate);
    }
  }, [profile.ttsSpeechRate]);

  React.useEffect(() => {
    if (profile.ttsAutoPlayLessons !== undefined) {
      setAutoPlayLessons(profile.ttsAutoPlayLessons);
    }
  }, [profile.ttsAutoPlayLessons]);

  // Modal for Explain Differently
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  // Chapter finished state
  const [isChapterFinishedCelebrated, setIsChapterFinishedCelebrated] = useState(false);

  // Current concept's block completion status
  const currentBlocks = understoodBlocks[currentConcept.id] || { block1: false, block2: false, block3: false };
  const allBlocksUnderstood = currentBlocks.block1 && currentBlocks.block2 && currentBlocks.block3;

  // Calculate Chapter Mastery metrics from masteries record
  const chapterConceptIds = activeChapter.concepts.map((c) => c.id);
  const chapterMasteryScores = chapterConceptIds.map(
    (id) => masteries[id]?.overallMastery || 70
  );
  const chapterAverageMastery = Math.round(
    chapterMasteryScores.reduce((acc, score) => acc + score, 0) / chapterMasteryScores.length
  );

  const targetMastery = activeChapter.targetMastery || 90;
  const isAllConceptsCompleted = activeChapter.concepts.every((c) => completedConceptIds.includes(c.id));
  const isMasteryThresholdMet = isAllConceptsCompleted && chapterAverageMastery >= targetMastery;
  const isLastConcept = currentConceptIndex === activeChapter.concepts.length - 1;

  // Handle toggling understood state for each explanation block
  const handleToggleBlockUnderstood = (blockKey: 'block1' | 'block2' | 'block3') => {
    setUnderstoodBlocks((prev) => ({
      ...prev,
      [currentConcept.id]: {
        ...(prev[currentConcept.id] || { block1: false, block2: false, block3: false }),
        [blockKey]: true,
      },
    }));
  };

  const handleToggleOfflineTTS = (val: boolean) => {
    setIsOfflineTTSEnabled(val);
    setOfflineTTSLessonsGloballyEnabled(val);
    if (onToggleOfflineTTS) {
      onToggleOfflineTTS(val);
    }
    if (!val && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveBlockSpeaking(null);
    }
  };

  const handleChangeRate = (rate: number) => {
    setSpeechRate(rate);
    setOfflineTTSSpeechRate(rate);
  };

  const handleSpeakSection = (
    sectionKey: 'concept' | 'block1' | 'block2' | 'block3' | 'checkpoint' | 'full',
    text: string
  ) => {
    if (!isOfflineTTSEnabled) return;
    if (activeBlockSpeaking === sectionKey && isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      setActiveBlockSpeaking(null);
      return;
    }
    stopSpeaking();
    setIsSpeaking(true);
    setActiveBlockSpeaking(sectionKey);
    speakText(
      text,
      language,
      speechRate,
      () => {
        setIsSpeaking(false);
        setActiveBlockSpeaking(null);
      },
      () => {
        setIsSpeaking(false);
        setActiveBlockSpeaking(null);
      }
    );
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setActiveBlockSpeaking(null);
  };

  const handleSpeakConcept = () => {
    const textToRead = `${getLocalizedText(currentConcept.title, language)}. ${getLocalizedText(
      currentConcept.summary,
      language
    )}`;
    handleSpeakSection('concept', textToRead);
  };

  const handleSpeakFullLesson = () => {
    const title = getLocalizedText(currentConcept.title, language);
    const summary = getLocalizedText(currentConcept.summary, language);
    const formulaText = currentConcept.formula ? `Mathematical formulation: ${currentConcept.formula}.` : '';
    const traps = currentConcept.keyPoints.map((p) => getLocalizedText(p, language)).join('. ');
    const fullText = `${title}. ${summary}. ${formulaText} Key exam traps: ${traps}`;
    handleSpeakSection('full', fullText);
  };

  // Auto-play lesson narration when navigating to a new concept card if configured
  React.useEffect(() => {
    if (isOfflineTTSEnabled && autoPlayLessons) {
      const timer = setTimeout(() => {
        const textToRead = `${getLocalizedText(currentConcept.title, language)}. ${getLocalizedText(
          currentConcept.summary,
          language
        )}`;
        handleSpeakSection('concept', textToRead);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentConceptIndex, isOfflineTTSEnabled, autoPlayLessons, language]);

  const handleSubmitCheckpoint = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = selectedOption === currentConcept.checkpointQuestion.correctIndex;
    if (isCorrect && !completedConceptIds.includes(currentConcept.id)) {
      const updated = [...completedConceptIds, currentConcept.id];
      setCompletedConceptIds(updated);

      if (updated.length === activeChapter.concepts.length) {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleNextStep = () => {
    if (!isLastConcept) {
      const nextIndex = currentConceptIndex + 1;
      const nextConcept = activeChapter.concepts[nextIndex];
      setCurrentConceptIndex(nextIndex);
      setSelectedOption(null);
      setIsSubmitted(false);
      stopSpeaking();
      setIsSpeaking(false);

      if (!understoodBlocks[nextConcept.id]) {
        setUnderstoodBlocks((prev) => ({
          ...prev,
          [nextConcept.id]: { block1: false, block2: false, block3: false },
        }));
      }

      // Automatically store and persist progress location for continuous resume
      saveLastCourseSession({
        targetTab: 'learn',
        subjectId: currentSubject.id,
        subjectName: getLocalizedText(currentSubject.name, language),
        chapterId: activeChapter.id,
        chapterTitle: getLocalizedText(activeChapter.title, language),
        conceptId: nextConcept.id,
        conceptTitle: getLocalizedText(nextConcept.title, language),
        questionIndex: 0,
        progressPercent: Math.round(((nextIndex + 1) / activeChapter.concepts.length) * 100),
        lastVisitedTimestamp: Date.now(),
        totalCheckpointsCompleted: completedConceptIds.length,
      }, profile.id);
    }
  };

  const handleFinishChapter = () => {
    if (!isMasteryThresholdMet) return;
    setIsChapterFinishedCelebrated(true);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleRestartChapter = () => {
    setCurrentConceptIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setIsChapterFinishedCelebrated(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* 1. Dynamic Board & Class Syllabus Context Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-mono">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>{boardInfo.board}</span>
                <span className="text-zinc-500">•</span>
                <span>Class {selectedClass}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700">
                {boardInfo.syllabusEdition}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{boardInfo.boardFullName}</span>
            </h2>
            <p className="text-xs text-zinc-400 font-sans">
              <span className="text-zinc-300 font-medium">{boardInfo.textbookStandard}</span>
              <span className="mx-1.5 text-zinc-600">|</span>
              <span className="text-amber-400/90 font-mono text-[11px]">{boardInfo.examPatternSummary}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBoardClassModalOpen(true)}
            className="self-start sm:self-center px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-2 transition-all shrink-0 shadow-sm"
            title="Switch your educational board or class standard"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Change Board / Class</span>
          </button>
        </div>

        {/* Dynamic Subject Selector Tabs for Selected Board and Class */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Syllabus Subjects for Class {selectedClass}</span>
            <span className="text-zinc-500">{availableSubjects.length} Subjects Configured</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {availableSubjects.map((sub, idx) => {
              const isSelected = safeSubjectIndex === idx;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubject(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md'
                      : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-100'
                  }`}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-950' : 'text-amber-400'}`} />
                  <span>{getLocalizedText(sub.name, language)}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-zinc-950/20 text-zinc-950' : 'bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    {sub.chapters.length} Ch
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Chapter Context Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                Interactive Learning Unit
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Concept {safeConceptIndex + 1} of {activeChapter.concepts.length}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans tracking-tight">
              {getLocalizedText(activeChapter.title, language)}
            </h1>
            {activeChapter.textbookRef && (
              <p className="text-xs text-zinc-400 font-mono">
                📖 {activeChapter.textbookRef}
              </p>
            )}
          </div>

          {/* Quick Chapter Selector & Study Mode Shortcuts */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {onOpenQuickFormulas && (
              <button
                type="button"
                onClick={onOpenQuickFormulas}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all"
                title="Open Quick Formula Sheet for this chapter"
              >
                <Calculator className="w-3.5 h-3.5 text-amber-400" />
                <span>Formulas</span>
              </button>
            )}

            {onOpenPeerMatch && (
              <button
                type="button"
                onClick={onOpenPeerMatch}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
                title="Connect with a peer studying this chapter"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Peer Match</span>
              </button>
            )}

            {onOpenMindMap && (
              <button
                type="button"
                onClick={onOpenMindMap}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-all"
                title="Inspect Concept Mind Map Hierarchy"
              >
                <Network className="w-3.5 h-3.5 text-blue-400" />
                <span>Mind Map</span>
              </button>
            )}

            <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

            {currentSubject.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => handleSelectChapter(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  safeChapterIndex === idx
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
                title={getLocalizedText(ch.title, language)}
              >
                Ch {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Checkpoints Bar */}
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {activeChapter.concepts.map((concept, idx) => {
            const isCompleted = completedConceptIds.includes(concept.id);
            const isCurrent = safeConceptIndex === idx;
            return (
              <div
                key={concept.id}
                onClick={() => {
                  setCurrentConceptIndex(idx);
                  setSelectedOption(null);
                  setIsSubmitted(false);
                }}
                className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-zinc-800 border-amber-500/50 shadow-sm ring-1 ring-amber-500/30'
                    : isCompleted
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-zinc-300'
                    : 'bg-zinc-950/40 border-zinc-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[11px] text-zinc-400">Concept {idx + 1}</span>
                  <div className="flex items-center gap-1">
                    {typeof localStorage !== 'undefined' && localStorage.getItem(`studyos_voice_memo_${activeChapter.id}_${concept.id}`) && (
                      <span title="Voice memo saved for this concept" className="text-xs">🎙️</span>
                    )}
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                </div>
                <p className="text-xs font-semibold truncate text-zinc-200">
                  {getLocalizedText(concept.title, language)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Interactive Concept Breakdown with Mandatory 'I Understand' Checkpoints */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wide">
                Step 1: Guided Concept Breakdown
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                3 Mandatory Engagement Checkpoints
              </span>
            </div>
            <h2 className="text-xl font-bold text-zinc-100">
              {getLocalizedText(currentConcept.title, language)}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Listen Audio Button */}
            <button
              onClick={handleSpeakConcept}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSpeaking && activeBlockSpeaking === 'concept'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-700'
              }`}
              title="Listen to this concept summary using offline Web Speech API"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking && activeBlockSpeaking === 'concept' ? 'animate-pulse text-emerald-400' : ''}`} />
              <span className="whitespace-nowrap">
                {isSpeaking && activeBlockSpeaking === 'concept' ? 'Stop' : '🔊 Listen'}
              </span>
            </button>

            {/* Explain Differently Button */}
            <button
              onClick={() => setIsExplainModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="whitespace-nowrap">Explain Differently</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFLINE WEB SPEECH API AUDIO CONTROLLER BAR */}
        {/* ========================================================================= */}
        <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-3 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isSpeaking
                    ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/40 animate-pulse'
                    : isOfflineTTSEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-500'
                }`}
              >
                {isSpeaking ? (
                  <Volume2 className="w-4 h-4 animate-bounce" />
                ) : isOfflineTTSEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-200">
                    Offline Web Speech API Synthesizer
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      isOfflineTTSEnabled
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {isOfflineTTSEnabled ? '100% Offline' : 'Paused'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {isSpeaking
                    ? `Narrating ${
                        activeBlockSpeaking === 'full'
                          ? 'Full Lesson'
                          : activeBlockSpeaking === 'concept'
                          ? 'Concept Overview'
                          : activeBlockSpeaking === 'block1'
                          ? 'Block 1 Intuition'
                          : activeBlockSpeaking === 'block2'
                          ? 'Block 2 Equations'
                          : activeBlockSpeaking === 'block3'
                          ? 'Block 3 Exam Traps'
                          : 'Checkpoint Quiz'
                      } in ${language.toUpperCase()}...`
                    : isOfflineTTSEnabled
                    ? 'Browser speech synthesis active for all lessons.'
                    : 'Offline lesson speech is currently paused.'}
                </p>
              </div>
            </div>

            {/* Quick Master Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {isOfflineTTSEnabled ? (
                <>
                  {/* Master Play/Stop Button */}
                  <button
                    type="button"
                    onClick={isSpeaking ? handleStopSpeaking : handleSpeakFullLesson}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                      isSpeaking
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Speech</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Read Lesson Aloud</span>
                      </>
                    )}
                  </button>

                  {/* Speech Rate Selector */}
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5 text-[10px] font-mono">
                    {[0.8, 1.0, 1.25].map((rateVal) => (
                      <button
                        key={rateVal}
                        type="button"
                        onClick={() => handleChangeRate(rateVal)}
                        className={`px-2 py-1 rounded-lg transition-all ${
                          speechRate === rateVal
                            ? 'bg-amber-500 text-zinc-950 font-bold'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                        title={`Set speech speed to ${rateVal}x`}
                      >
                        {rateVal}x
                      </button>
                    ))}
                  </div>

                  {/* Settings Link */}
                  {onOpenLanguageSettings && (
                    <button
                      type="button"
                      onClick={onOpenLanguageSettings}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
                      title="Open Language & Speech Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleOfflineTTS(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Enable Offline TTS</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Segment Jump Pills */}
          {isOfflineTTSEnabled && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-zinc-850 text-xs">
              <span className="text-[10px] font-mono text-zinc-500 shrink-0 uppercase">Jump & Speak:</span>
              <button
                type="button"
                onClick={handleSpeakConcept}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all shrink-0 ${
                  activeBlockSpeaking === 'concept'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSpeakSection(
                    'block1',
                    `Block 1: Physical intuition. ${getLocalizedText(currentConcept.summary, language)}`
                  )
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all shrink-0 ${
                  activeBlockSpeaking === 'block1'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold ring-1 ring-amber-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Block 1: Intuition
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSpeakSection(
                    'block2',
                    `Block 2: Mathematical formulation. ${
                      currentConcept.formula ? currentConcept.formula : ''
                    }. Potential difference V equals electric current I multiplied by resistance R.`
                  )
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all shrink-0 ${
                  activeBlockSpeaking === 'block2'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold ring-1 ring-blue-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Block 2: Formulas
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSpeakSection(
                    'block3',
                    `Block 3: Key exam traps and high-yield rules. ${currentConcept.keyPoints
                      .map((p, i) => `Point ${i + 1}: ${getLocalizedText(p, language)}`)
                      .join('. ')}`
                  )
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all shrink-0 ${
                  activeBlockSpeaking === 'block3'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-bold ring-1 ring-purple-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                Block 3: Exam Traps
              </button>
              {allBlocksUnderstood && (
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakSection(
                      'checkpoint',
                      `Step 2: Checkpoint question. ${getLocalizedText(
                        currentConcept.checkpointQuestion.prompt,
                        language
                      )}. Options: ${currentConcept.checkpointQuestion.options
                        .map(
                          (opt, i) =>
                            `Option ${String.fromCharCode(65 + i)}: ${getLocalizedText(opt, language)}`
                        )
                        .join('. ')}`
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all shrink-0 ${
                    activeBlockSpeaking === 'checkpoint'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold ring-1 ring-emerald-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  Step 2 Quiz
                </button>
              )}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* EXPLANATION BLOCK 1: Physical Intuition & Summary */}
        {/* ========================================================================= */}
        <div
          className={`p-5 rounded-xl bg-zinc-950/70 border transition-all space-y-3 ${
            activeBlockSpeaking === 'block1'
              ? 'border-amber-500/80 ring-2 ring-amber-500/30 bg-amber-950/10'
              : 'border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">1</span>
              Physical Intuition & Definition
            </span>
            <div className="flex items-center gap-2">
              {isOfflineTTSEnabled && (
                <button
                  type="button"
                  onClick={() =>
                    handleSpeakSection(
                      'block1',
                      `Block 1: Physical intuition. ${getLocalizedText(currentConcept.summary, language)}`
                    )
                  }
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
                    activeBlockSpeaking === 'block1'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 ring-1 ring-amber-500/40'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-amber-300'
                  }`}
                  title="Listen to physical intuition"
                >
                  <Volume2 className={`w-3 h-3 ${activeBlockSpeaking === 'block1' ? 'animate-pulse text-amber-400' : ''}`} />
                  <span>{activeBlockSpeaking === 'block1' ? 'Stop' : 'Listen Block 1'}</span>
                </button>
              )}
              {currentBlocks.block1 && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                </span>
              )}
            </div>
          </div>

          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-sans">
            {getLocalizedText(currentConcept.summary, language)}
          </p>

          {!currentBlocks.block1 ? (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => handleToggleBlockUnderstood('block1')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>I Understand the Physical Intuition ✓</span>
              </button>
            </div>
          ) : (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Intuition confirmed. Block 2 formula derivation unlocked below.</span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* EXPLANATION BLOCK 2: Governing Equations & Units (Unlocked after Block 1) */}
        {/* ========================================================================= */}
        {currentBlocks.block1 ? (
          <div
            className={`p-5 rounded-xl bg-zinc-950/70 border transition-all space-y-3 animate-fadeIn ${
              activeBlockSpeaking === 'block2'
                ? 'border-blue-500/80 ring-2 ring-blue-500/30 bg-blue-950/10'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                Mathematical Formulation & Units
              </span>
              <div className="flex items-center gap-2">
                {isOfflineTTSEnabled && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakSection(
                        'block2',
                        `Block 2: Mathematical formulation. ${
                          currentConcept.formula ? currentConcept.formula : ''
                        }. Potential difference V equals electric current I multiplied by resistance R.`
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
                      activeBlockSpeaking === 'block2'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 ring-1 ring-blue-500/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-blue-300'
                    }`}
                    title="Listen to equations and variables"
                  >
                    <Volume2 className={`w-3 h-3 ${activeBlockSpeaking === 'block2' ? 'animate-pulse text-blue-400' : ''}`} />
                    <span>{activeBlockSpeaking === 'block2' ? 'Stop' : 'Listen Formulas'}</span>
                  </button>
                )}
                {currentBlocks.block2 && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                  </span>
                )}
              </div>
            </div>

            {currentConcept.formula && (
              <div className="py-2">
                <FormulaRenderer formula={currentConcept.formula} />
              </div>
            )}

            <div className="text-xs text-zinc-300 space-y-1 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
              <p className="font-semibold text-zinc-200 font-mono">Standard Variable Breakdown & SI Units:</p>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-400">
                <li>V = Potential Difference (Volts, V)</li>
                <li>I = Electric Current (Amperes, A)</li>
                <li>R = Resistance (Ohms, Ω) where R = ρ(L / A)</li>
              </ul>
            </div>

            {!currentBlocks.block2 ? (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleToggleBlockUnderstood('block2')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 text-zinc-950 hover:bg-blue-400 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>I Understand the Equation & Units ✓</span>
                </button>
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Equations confirmed. Block 3 exam insights unlocked below.</span>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/40 text-xs text-zinc-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            <span>Confirm understanding of Block 1 above to unlock Mathematical Formulation.</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EXPLANATION BLOCK 3: High-Yield Exam Traps (Unlocked after Block 2) */}
        {/* ========================================================================= */}
        {currentBlocks.block2 ? (
          <div
            className={`p-5 rounded-xl bg-zinc-950/70 border transition-all space-y-3 animate-fadeIn ${
              activeBlockSpeaking === 'block3'
                ? 'border-purple-500/80 ring-2 ring-purple-500/30 bg-purple-950/10'
                : 'border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                High-Yield Exam Insights & Traps
              </span>
              <div className="flex items-center gap-2">
                {isOfflineTTSEnabled && (
                  <button
                    type="button"
                    onClick={() =>
                      handleSpeakSection(
                        'block3',
                        `Block 3: Key exam traps and high-yield rules. ${currentConcept.keyPoints
                          .map((p, i) => `Point ${i + 1}: ${getLocalizedText(p, language)}`)
                          .join('. ')}`
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all ${
                      activeBlockSpeaking === 'block3'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 ring-1 ring-purple-500/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-purple-300'
                    }`}
                    title="Listen to high-yield exam rules"
                  >
                    <Volume2 className={`w-3 h-3 ${activeBlockSpeaking === 'block3' ? 'animate-pulse text-purple-400' : ''}`} />
                    <span>{activeBlockSpeaking === 'block3' ? 'Stop' : 'Listen Traps'}</span>
                  </button>
                )}
                {currentBlocks.block3 && (
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                  </span>
                )}
              </div>
            </div>

            <ul className="space-y-2">
              {currentConcept.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                  <span>{getLocalizedText(pt, language)}</span>
                </li>
              ))}
            </ul>

            {!currentBlocks.block3 ? (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleToggleBlockUnderstood('block3')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 text-zinc-950 hover:bg-purple-400 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>I Understand Exam Traps & Key Rules ✓</span>
                </button>
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">All explanation checkpoints completed! Step 2 quiz unlocked below.</span>
              </div>
            )}
          </div>
        ) : currentBlocks.block1 ? (
          <div className="p-4 rounded-xl bg-zinc-950/30 border border-zinc-800/40 text-xs text-zinc-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-zinc-400" />
            <span>Confirm understanding of Block 2 above to unlock High-Yield Exam Traps.</span>
          </div>
        ) : null}
      </div>

      {/* ========================================================================= */}
      {/* CONCEPT VOICE MEMO RECORDER & LOCAL STORAGE NATIVE AUDIO PLAYER */}
      {/* ========================================================================= */}
      <ConceptVoiceMemoRecorder
        chapterId={activeChapter.id}
        conceptId={currentConcept.id}
        conceptTitle={getLocalizedText(currentConcept.title, language)}
        language={language}
      />

      {/* ========================================================================= */}
      {/* STEP 2: Understanding Checkpoint Question (Unlocked only when all 3 blocks checked) */}
      {/* ========================================================================= */}
      {allBlocksUnderstood ? (
        <div
          className={`bg-zinc-900 border rounded-2xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn transition-all ${
            activeBlockSpeaking === 'checkpoint'
              ? 'border-emerald-500/80 ring-2 ring-emerald-500/30 bg-zinc-900/95'
              : 'border-zinc-800'
          }`}
        >
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide">
                Step 2: Understanding Checkpoint (Mandatory Interaction)
              </span>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                {getLocalizedText(currentConcept.checkpointQuestion.prompt, language)}
              </h3>
            </div>
            {isOfflineTTSEnabled && (
              <button
                type="button"
                onClick={() =>
                  handleSpeakSection(
                    'checkpoint',
                    `Step 2 checkpoint question: ${getLocalizedText(
                      currentConcept.checkpointQuestion.prompt,
                      language
                    )}. Options: ${currentConcept.checkpointQuestion.options
                      .map(
                        (opt, i) =>
                          `Option ${String.fromCharCode(65 + i)}: ${getLocalizedText(opt, language)}`
                      )
                      .join('. ')}`
                  )
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all ${
                  activeBlockSpeaking === 'checkpoint'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 ring-1 ring-emerald-500/40'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-emerald-300 hover:border-zinc-700'
                }`}
                title="Listen to question and choices"
              >
                <Volume2 className={`w-3.5 h-3.5 ${activeBlockSpeaking === 'checkpoint' ? 'animate-pulse text-emerald-400' : ''}`} />
                <span>{activeBlockSpeaking === 'checkpoint' ? 'Stop Audio' : 'Listen Quiz'}</span>
              </button>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentConcept.checkpointQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentConcept.checkpointQuestion.correctIndex;
              let optionStyle = 'bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800';

              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                } else {
                  optionStyle = 'bg-zinc-950/30 border-zinc-900 text-zinc-500 opacity-50';
                }
              } else if (isSelected) {
                optionStyle = 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all text-sm ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-mono font-bold flex items-center justify-center">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{getLocalizedText(option, language)}</span>
                  </div>
                  {isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit or Feedback Controls */}
          {!isSubmitted ? (
            <div className="flex justify-end pt-2">
              <button
                disabled={selectedOption === null}
                onClick={handleSubmitCheckpoint}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                SUBMIT CHECKPOINT
              </button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {/* Feedback box */}
              <div
                className={`p-4 rounded-xl border text-sm leading-relaxed ${
                  selectedOption === currentConcept.checkpointQuestion.correctIndex
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {selectedOption === currentConcept.checkpointQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>✓ Correct! Concept Mastery Verified</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-4 h-4 text-rose-400" />
                      <span>Incorrect. Review Solution:</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-zinc-300 mt-1">
                  {getLocalizedText(currentConcept.checkpointQuestion.explanation, language)}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                {!isLastConcept ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-2"
                  >
                    <span>Next Concept ➔</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigateToPractice(activeChapter.id)}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg"
                  >
                    <Award className="w-4 h-4" />
                    <span>Launch Adaptive Practice ➔</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 text-center space-y-2">
          <Lock className="w-6 h-6 text-amber-400/80 mx-auto" />
          <h4 className="text-sm font-bold text-zinc-300">Checkpoint Quiz Locked</h4>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Please complete and confirm each of the 3 interaction checkpoints above to unlock this concept’s verification challenge.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHAPTER COMPLETE CHECK SUMMARY & PROGRESS METRICS */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${isMasteryThresholdMet ? 'bg-emerald-500 text-zinc-950' : 'bg-amber-500/20 text-amber-400'}`}>
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400">
                  Chapter Complete Check
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isMasteryThresholdMet
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {isMasteryThresholdMet ? 'TARGET MET' : 'THRESHOLD PENDING'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                Chapter Completion & Mastery Gate
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-zinc-400 block uppercase">Required Chapter Target</span>
            <span className="text-sm font-bold font-mono text-amber-400">{targetMastery}% Mastery</span>
          </div>
        </div>

        {/* 4 Core Chapter Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Concept Checkpoints</span>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold text-zinc-100 font-mono">
                {completedConceptIds.length} / {activeChapter.concepts.length}
              </p>
              <span className={`text-[10px] font-bold ${isAllConceptsCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isAllConceptsCompleted ? '100%' : `${Math.round((completedConceptIds.length / activeChapter.concepts.length) * 100)}%`}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Current Chapter Mastery</span>
            <div className="flex items-baseline justify-between">
              <p className={`text-lg font-bold font-mono ${chapterAverageMastery >= targetMastery ? 'text-emerald-400' : 'text-amber-400'}`}>
                {chapterAverageMastery}%
              </p>
              <span className="text-[10px] text-zinc-400 font-mono">Goal: {targetMastery}%</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Interactive Checkpoints</span>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold text-zinc-100 font-mono">
                {Object.values(understoodBlocks).filter((b: { block1: boolean; block2: boolean; block3: boolean }) => b && b.block1 && b.block2 && b.block3).length} / {activeChapter.concepts.length}
              </p>
              <span className="text-[10px] text-emerald-400 font-mono">Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[10px] font-mono text-zinc-400 uppercase">Board Weightage</span>
            <div className="flex items-baseline justify-between">
              <p className="text-lg font-bold text-indigo-400 font-mono">
                {activeChapter.highYieldWeightage}%
              </p>
              <span className="text-[10px] text-zinc-400 font-mono">High Yield</span>
            </div>
          </div>
        </div>

        {/* Remaining Tasks Checklist (if Incomplete) or Congratulations (if Complete) */}
        {!isMasteryThresholdMet ? (
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Remaining Tasks to Unlock "Finish Chapter":</span>
            </div>
            <div className="space-y-2 text-xs">
              {!isAllConceptsCompleted && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-300">
                    • Complete checkpoint verification on {activeChapter.concepts.length - completedConceptIds.length} pending concept(s).
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">Pending</span>
                </div>
              )}
              {chapterAverageMastery < targetMastery && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-300">
                    • Boost Chapter Mastery from <strong className="text-amber-400">{chapterAverageMastery}%</strong> to <strong className="text-emerald-400">{targetMastery}%</strong> by solving adaptive practice questions.
                  </span>
                  <button
                    onClick={() => onNavigateToPractice(activeChapter.id)}
                    className="px-2.5 py-1 rounded bg-amber-500 text-zinc-950 font-bold text-[10px] hover:bg-amber-400 transition-colors"
                  >
                    Solve Practice ➔
                  </button>
                </div>
              )}
              {onNavigateToRevision && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-800">
                  <span className="text-zinc-300">
                    • Review Spaced Repetition Flashcards to reinforce long-term memory.
                  </span>
                  <button
                    onClick={onNavigateToRevision}
                    className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 font-semibold text-[10px] hover:bg-zinc-700 transition-colors"
                  >
                    Review Cards ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-emerald-300 font-semibold">
                  All Mastery Criteria Satisfied! ({chapterAverageMastery}% ≥ {targetMastery}%)
                </strong>
                <span>You can now officially finish this chapter and unlock the chapter mastery badge.</span>
              </div>
            </div>
          </div>
        )}

        {/* Final Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleRestartChapter}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all w-full sm:w-auto"
          >
            Review Concepts from Start
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => onNavigateToPractice(activeChapter.id)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 text-amber-300 border border-amber-500/30 hover:bg-zinc-700 transition-all"
            >
              Adaptive Practice
            </button>

            {/* FINISH CHAPTER ACTION (Strictly enabled only when threshold met) */}
            <button
              disabled={!isMasteryThresholdMet}
              onClick={handleFinishChapter}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
                isMasteryThresholdMet
                  ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 cursor-pointer shadow-emerald-500/20'
                  : 'bg-zinc-800 text-zinc-500 border border-zinc-700/50 cursor-not-allowed opacity-60'
              }`}
              title={
                !isMasteryThresholdMet
                  ? `Locked: Needs all checkpoints completed & ≥${targetMastery}% mastery (Currently ${chapterAverageMastery}%)`
                  : 'Complete chapter and claim mastery certificate'
              }
            >
              {!isMasteryThresholdMet && <Lock className="w-3.5 h-3.5" />}
              {isMasteryThresholdMet && <Award className="w-3.5 h-3.5" />}
              <span>{isChapterFinishedCelebrated ? 'Chapter Certified 🏆' : 'Finish Chapter ➔'}</span>
            </button>
          </div>
        </div>

        {isChapterFinishedCelebrated && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2 animate-fadeIn">
            <p className="text-sm font-bold text-emerald-300">
              🎉 Congratulations {profile.name}! You have mastered {getLocalizedText(activeChapter.title, language)}!
            </p>
            <p className="text-xs text-zinc-400">
              Chapter mastery recorded at {chapterAverageMastery}%. Your exam readiness index has increased!
            </p>
          </div>
        )}
      </div>

      {/* Explain Differently Multi-Pedagogy Modal */}
      {isExplainModalOpen && (
        <ExplainDifferentlyView
          conceptTitle={getLocalizedText(currentConcept.title, language)}
          formula={currentConcept.formula}
          currentExplanation={getLocalizedText(currentConcept.summary, language)}
          language={language}
          onClose={() => setIsExplainModalOpen(false)}
        />
      )}

      {/* 3. Dynamic Board & Class Syllabus Selector Modal */}
      {isBoardClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-100">
                    Syllabus Customization: Board & Class
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Select your official examination board and class standard to adjust syllabus units
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBoardClassModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Step A: Select Class Standard */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Step 1: Choose Class Standard
                  </label>
                  <span className="text-xs text-zinc-400 font-mono">
                    Currently Selected: <strong className="text-zinc-200">Class {selectedClass}</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectClass('10')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedClass === '10'
                        ? 'bg-amber-500/15 border-amber-500 text-zinc-100 ring-2 ring-amber-500/30 shadow-md'
                        : 'bg-zinc-800/60 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-amber-400 font-mono">Class 10 (Secondary)</span>
                      {selectedClass === '10' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-zinc-300 font-sans">
                      Science (Physics, Chemistry, Biology) & Mathematics (Algebra, Trigonometry)
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-zinc-400">
                      Standard: Matric / High School (10th Board)
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectClass('12')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedClass === '12'
                        ? 'bg-amber-500/15 border-amber-500 text-zinc-100 ring-2 ring-amber-500/30 shadow-md'
                        : 'bg-zinc-800/60 border-zinc-700/80 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-amber-400 font-mono">Class 12 (Sr. Secondary)</span>
                      {selectedClass === '12' && <CheckCircle className="w-4 h-4 text-amber-400" />}
                    </div>
                    <p className="text-xs text-zinc-300 font-sans">
                      Physics Parts 1 & 2, Chemistry Parts 1 & 2 & Mathematics Parts 1 & 2
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-zinc-400">
                      Standard: Intermediate / Higher Secondary (12th Board)
                    </div>
                  </button>
                </div>
              </div>

              {/* Step B: Select Education Board */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                    Step 2: Choose Examination Board
                  </label>
                  <span className="text-xs text-zinc-400 font-mono">
                    Currently Selected: <strong className="text-zinc-200">{selectedBoard}</strong>
                  </span>
                </div>

                {/* Quick Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={boardSearchTerm}
                    onChange={(e) => setBoardSearchTerm(e.target.value)}
                    placeholder="Search board name, state (e.g., UP, CBSE, ICSE, Bihar, Maharashtra)..."
                    className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                {/* Prominent Boards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {ALL_INDIAN_BOARDS.filter((b) => {
                    if (!boardSearchTerm.trim()) return true;
                    const q = boardSearchTerm.toLowerCase();
                    return (
                      b.name.toLowerCase().includes(q) ||
                      b.state.toLowerCase().includes(q) ||
                      b.nativeName.toLowerCase().includes(q) ||
                      b.id.toLowerCase().includes(q)
                    );
                  }).map((b) => {
                    const isSelected = selectedBoard === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBoard(b.id as EducationBoard)}
                        className={`p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                          isSelected
                            ? 'bg-amber-500/15 border-amber-500 text-zinc-100 shadow-sm ring-1 ring-amber-500/30'
                            : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs text-zinc-200">{b.name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                              {b.state}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {b.nativeName}
                          </p>
                        </div>
                        {isSelected ? (
                          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between text-xs text-zinc-400">
              <span>Selected syllabus immediately reflects in interactive lessons</span>
              <button
                type="button"
                onClick={() => setIsBoardClassModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
