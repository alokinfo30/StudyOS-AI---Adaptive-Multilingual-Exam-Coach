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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Chapter, Concept, LanguageCode, UserProfile, ConceptMastery } from '../../types';
import { CURRICULUM_SUBJECTS } from '../../data/curriculum';
import { getLocalizedText } from '../../data/languages';
import { FormulaRenderer } from '../common/FormulaRenderer';
import { ExplainDifferentlyView } from './ExplainDifferentlyView';
import { speakText, stopSpeaking } from '../../utils/speechUtils';
import { saveLastCourseSession } from '../../services/storageService';

interface InteractiveLessonViewProps {
  language: LanguageCode;
  profile: UserProfile;
  masteries?: Record<string, ConceptMastery>;
  onNavigateToPractice: (chapterId: string) => void;
  onNavigateToRevision?: () => void;
}

export const InteractiveLessonView: React.FC<InteractiveLessonViewProps> = ({
  language,
  profile,
  masteries = {},
  onNavigateToPractice,
  onNavigateToRevision,
}) => {
  // Select active chapter (default: Ohm's Law & Electricity)
  const currentSubject = CURRICULUM_SUBJECTS[0];
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter: Chapter = currentSubject.chapters[activeChapterIndex] || currentSubject.chapters[0];

  // Concept interaction steps
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const currentConcept: Concept = activeChapter.concepts[currentConceptIndex] || activeChapter.concepts[0];

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

  const handleSpeakConcept = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const textToRead = `${getLocalizedText(currentConcept.title, language)}. ${getLocalizedText(
        currentConcept.summary,
        language
      )}`;
      speakText(textToRead, language, () => setIsSpeaking(false));
    }
  };

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
      {/* Chapter Context Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                Interactive Learning Unit
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Concept {currentConceptIndex + 1} of {activeChapter.concepts.length}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans tracking-tight">
              {getLocalizedText(activeChapter.title, language)}
            </h1>
          </div>

          {/* Quick Chapter Selector */}
          <div className="flex items-center gap-2">
            {currentSubject.chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setCurrentConceptIndex(0);
                  setSelectedOption(null);
                  setIsSubmitted(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  activeChapterIndex === idx
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                Ch {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Checkpoints Bar */}
        <div className="grid grid-cols-3 gap-2">
          {activeChapter.concepts.map((concept, idx) => {
            const isCompleted = completedConceptIds.includes(concept.id);
            const isCurrent = currentConceptIndex === idx;
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
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
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
                isSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-700'
              }`}
              title="Listen to this concept in selected language"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-emerald-400' : ''}`} />
              <span className="whitespace-nowrap">{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
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
        {/* EXPLANATION BLOCK 1: Physical Intuition & Summary */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">1</span>
              Physical Intuition & Definition
            </span>
            {currentBlocks.block1 && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Checked
              </span>
            )}
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
          <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-400 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">2</span>
                Mathematical Formulation & Units
              </span>
              {currentBlocks.block2 && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                </span>
              )}
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
          <div className="p-5 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                High-Yield Exam Insights & Traps
              </span>
              {currentBlocks.block3 && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                </span>
              )}
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
      {/* STEP 2: Understanding Checkpoint Question (Unlocked only when all 3 blocks checked) */}
      {/* ========================================================================= */}
      {allBlocksUnderstood ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6 animate-fadeIn">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wide">
              Step 2: Understanding Checkpoint (Mandatory Interaction)
            </span>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100">
              {getLocalizedText(currentConcept.checkpointQuestion.prompt, language)}
            </h3>
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
    </div>
  );
};
