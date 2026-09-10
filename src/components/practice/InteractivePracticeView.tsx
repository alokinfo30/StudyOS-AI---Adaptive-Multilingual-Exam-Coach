import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
  Target,
  Info,
  Award,
  Zap,
  BookOpen,
  Volume2,
  Filter,
  WifiOff,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ConfidenceLevel,
  ErrorType,
  LanguageCode,
  Question,
  UserProfile,
  ConceptMastery,
} from '../../types';
import { CURRICULUM_QUESTIONS } from '../../data/curriculum';
import { getQuestionsForProfile } from '../../data/questionBank';
import { getLocalizedText } from '../../data/languages';
import {
  calculateConceptMasteryDelta,
  classifyErrorType,
} from '../../utils/masteryCalculator';
import {
  recordQuestionAttempt,
  triggerAutomaticParentProgressDispatch,
  saveLastCourseSession,
} from '../../services/storageService';
import { diagnoseStudentError } from '../../services/geminiService';
import { FailureRecoveryModal } from './FailureRecoveryModal';
import { TTSButton } from '../common/TTSButton';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface InteractivePracticeViewProps {
  language: LanguageCode;
  profile: UserProfile;
  masteries: Record<string, ConceptMastery>;
  onUpdateMasteries: (updated: Record<string, ConceptMastery>) => void;
}

export const InteractivePracticeView: React.FC<InteractivePracticeViewProps> = ({
  language,
  profile,
  masteries,
  onUpdateMasteries,
}) => {
  // Category Filter state
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in_text' | 'exercise' | 'exemplar'>('all');

  // Context-aware questions filtering based on user profile (Class 10 vs 12, Board, and Competitive PYQs)
  const profileQuestions = useMemo(() => {
    return getQuestionsForProfile(profile);
  }, [profile.selectedExam, profile.selectedBoard, profile.goalCategory]);

  // Filtered Questions according to active filter
  const filteredQuestions = useMemo(() => {
    if (selectedFilter === 'all') return profileQuestions;
    return profileQuestions.filter((q) => q.textbookSource?.category === selectedFilter);
  }, [selectedFilter, profileQuestions]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const currentQuestion: Question =
    filteredQuestions[questionIndex] || filteredQuestions[0] || profileQuestions[0] || CURRICULUM_QUESTIONS[0];

  // User input states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel>('confident');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);

  // Evaluation & Diagnostics
  const [evaluatedErrorType, setEvaluatedErrorType] = useState<ErrorType | null>(null);
  const [aiDiagnosis, setAiDiagnosis] = useState<string>('');
  const [masteryDeltaDisplay, setMasteryDeltaDisplay] = useState<string>('');
  const [masteryPopNotification, setMasteryPopNotification] = useState<{ score: number; delta: number } | null>(null);

  const isCorrect = selectedOption === currentQuestion.correctIndex;
  const isLastQuestion = questionIndex === filteredQuestions.length - 1;

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const answeredCorrectly = selectedOption === currentQuestion.correctIndex;
    let detectedError: ErrorType | undefined = undefined;

    if (!answeredCorrectly) {
      detectedError = classifyErrorType(55, currentQuestion.expectedTimeSec, confidence, hintsRevealed);
      setEvaluatedErrorType(detectedError);

      // Request AI Diagnostic (works offline or online)
      const diag = await diagnoseStudentError(
        getLocalizedText(currentQuestion.prompt, language),
        getLocalizedText(currentQuestion.options[selectedOption], language),
        getLocalizedText(currentQuestion.options[currentQuestion.correctIndex], language),
        currentQuestion.conceptId,
        detectedError,
        language
      );
      setAiDiagnosis(diag);
    } else {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    // Record attempt
    const attemptData = {
      id: `att_${Date.now()}`,
      questionId: currentQuestion.id,
      conceptId: currentQuestion.conceptId,
      chapterId: currentQuestion.chapterId,
      subjectId: currentQuestion.subjectId,
      selectedOption,
      isCorrect: answeredCorrectly,
      timeSpentSec: 55,
      confidence,
      hintsUsed: hintsRevealed,
      errorType: detectedError,
      timestamp: Date.now(),
    };
    recordQuestionAttempt(attemptData);

    // Automatically dispatch progress report to parent's mobile in real time
    triggerAutomaticParentProgressDispatch(attemptData, profile.id);

    // Update Concept Mastery
    const currentConceptMastery = masteries[currentQuestion.conceptId] || {
      conceptId: currentQuestion.conceptId,
      understanding: 70,
      accuracy: 70,
      recall: 70,
      speed: 70,
      recentPerformance: 70,
      longTermRetention: 70,
      overallMastery: 70,
      forgettingRisk: 30,
      state: 'PRACTICING',
      totalAttempts: 0,
      correctAttempts: 0,
      lastPracticed: Date.now(),
      nextRevisionDue: Date.now() + 86400000,
      mistakeHistory: [],
    };

    const updatedMastery = calculateConceptMasteryDelta(
      currentConceptMastery,
      answeredCorrectly,
      confidence,
      55,
      currentQuestion.expectedTimeSec,
      detectedError
    );

    const deltaScore = updatedMastery.overallMastery - currentConceptMastery.overallMastery;
    setMasteryDeltaDisplay(deltaScore >= 0 ? `+${deltaScore}%` : `${deltaScore}%`);

    // Gamified mastery pop animation & sound effect
    if (deltaScore > 0) {
      playMasteryPopSound(updatedMastery.overallMastery >= 90);
      setMasteryPopNotification({
        score: updatedMastery.overallMastery,
        delta: deltaScore,
      });
      setTimeout(() => setMasteryPopNotification(null), 3200);
    }

    onUpdateMasteries({
      ...masteries,
      [currentQuestion.conceptId]: updatedMastery,
    });
  };

  const handleNextQuestion = () => {
    const nextIdx = !isLastQuestion ? questionIndex + 1 : 0;
    setQuestionIndex(nextIdx);
    setSelectedOption(null);
    setIsSubmitted(false);
    setHintsRevealed(0);
    setEvaluatedErrorType(null);
    setAiDiagnosis('');

    // Persist continuous progress
    const nextQ = filteredQuestions[nextIdx];
    if (nextQ) {
      saveLastCourseSession({
        targetTab: 'practice',
        subjectId: nextQ.subjectId,
        subjectName: 'Science & Mathematics NCERT Practice',
        chapterId: nextQ.chapterId,
        chapterTitle: 'NCERT In-Text & Exemplar Problems',
        conceptId: nextQ.conceptId,
        conceptTitle: `Question #${nextIdx + 1} (${nextQ.difficulty})`,
        questionIndex: nextIdx,
        progressPercent: Math.round(((nextIdx + 1) / filteredQuestions.length) * 100),
        lastVisitedTimestamp: Date.now(),
      }, profile.id);
    }
  };

  // Compile audio speech narration string for question + options
  const questionSpeechText = `${getLocalizedText(currentQuestion.prompt, language)}. Options: Option A: ${getLocalizedText(
    currentQuestion.options[0],
    language
  )}. Option B: ${getLocalizedText(currentQuestion.options[1], language)}. Option C: ${getLocalizedText(
    currentQuestion.options[2],
    language
  )}. Option D: ${getLocalizedText(currentQuestion.options[3], language)}.`;

  const solutionSpeechText = `Detailed Solution: ${getLocalizedText(
    currentQuestion.explanation,
    language
  )}. Key takeaway: ${getLocalizedText(currentQuestion.guidedReasoning, language)}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Textbook Filter Toolbar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wide font-mono">
            {profile.selectedBoard || 'CBSE'} Official Textbook Practice:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Textbook Problems' },
            { id: 'in_text', label: '📖 In-Text Examples' },
            { id: 'exercise', label: '📝 End Exercises' },
            { id: 'exemplar', label: '⭐ Exemplar & PYQs' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFilter(f.id as any);
                setQuestionIndex(0);
                setSelectedOption(null);
                setIsSubmitted(false);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedFilter === f.id
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-6">
        {/* Textbook Source Banner & Question Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="space-y-1.5">
            {currentQuestion.isPYQ && (
              <div className="flex items-center gap-2 flex-wrap pb-1">
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono flex items-center gap-1">
                  🎯 {currentQuestion.pyqExam || 'Official Exam'} {currentQuestion.pyqYear} PYQ (Past 10 Years)
                </span>
                {currentQuestion.classLevel && (
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    Class {currentQuestion.classLevel}
                  </span>
                )}
              </div>
            )}

            {currentQuestion.textbookSource && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono flex items-center gap-1">
                  <BookOpen className="w-3 h-3" />
                  {currentQuestion.textbookSource.bookTitle}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                  {currentQuestion.textbookSource.exercise} • {currentQuestion.textbookSource.questionNo}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-800 text-zinc-400">
                Problem {questionIndex + 1} of {filteredQuestions.length}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                +{currentQuestion.marks} / -{currentQuestion.negativeMarks || 0}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono">
                {currentQuestion.difficulty.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-zinc-800 text-zinc-400 font-mono flex items-center gap-1">
                <WifiOff className="w-2.5 h-2.5" /> Offline Ready
              </span>
            </div>
          </div>

          {/* Action Tools: TTS Speaker & "Why Question?" Trigger */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <TTSButton
              textToSpeak={questionSpeechText}
              language={language}
              label="Listen Question (TTS)"
              size="sm"
              variant="secondary"
            />

            <button
              onClick={() => setShowWhyModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
              title="Why am I getting this question?"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Why this?</span>
            </button>
          </div>
        </div>

        {/* Question Statement */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-semibold text-zinc-100 leading-relaxed font-sans">
            {getLocalizedText(currentQuestion.prompt, language)}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOption = idx === currentQuestion.correctIndex;
              let style = 'bg-zinc-950/60 border-zinc-800 text-zinc-200 hover:bg-zinc-800';

              if (isSubmitted) {
                if (isCorrectOption) {
                  style = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  style = 'bg-rose-950/40 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-zinc-950/30 border-zinc-900 text-zinc-500 opacity-50';
                }
              } else if (isSelected) {
                style = 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold ring-1 ring-amber-500/50';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-left border transition-all text-sm ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-sans leading-normal">
                      {getLocalizedText(option, language)}
                    </span>
                  </div>
                  {isSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                  )}
                  {isSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-LEVEL CONFIDENCE SELECTOR */}
        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Confidence Level (Cognitive Mastery Calibration):</span>
            </label>
            <span className="text-[10px] font-mono text-zinc-400">
              Selected: <strong className="text-amber-400 uppercase">{confidence.replace('_', ' ')}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(
              [
                {
                  key: 'guess',
                  label: '😕 Guess',
                  level: 'Level 1',
                  sub: 'Low weight (0.35x)',
                  border: 'hover:border-rose-500/60',
                  active: 'bg-rose-950/30 border-rose-500 text-rose-300',
                },
                {
                  key: 'somewhat',
                  label: '😐 Somewhat',
                  level: 'Level 2',
                  sub: 'Cautious (0.70x)',
                  border: 'hover:border-amber-500/60',
                  active: 'bg-amber-950/30 border-amber-500 text-amber-300',
                },
                {
                  key: 'confident',
                  label: '🙂 Confident',
                  level: 'Level 3',
                  sub: 'Standard (1.00x)',
                  border: 'hover:border-blue-500/60',
                  active: 'bg-blue-950/30 border-blue-500 text-blue-300',
                },
                {
                  key: 'very_confident',
                  label: '🔥 Very Confident',
                  level: 'Level 4',
                  sub: 'Max boost (1.25x)',
                  border: 'hover:border-emerald-500/60',
                  active: 'bg-emerald-950/30 border-emerald-500 text-emerald-300',
                },
              ] as const
            ).map((c) => {
              const isSelected = confidence === c.key;
              return (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setConfidence(c.key)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all relative ${c.border} ${
                    isSelected ? `${c.active} font-bold shadow-md` : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-400">{c.level}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </div>
                  <div className="font-bold text-sm text-zinc-100">{c.label}</div>
                  <div className="text-[10px] text-zinc-400 font-normal mt-0.5">{c.sub}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progressive Hints & Clues */}
        <div className="pt-4 border-t border-zinc-800/60 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {hintsRevealed === 0 && (
              <button
                onClick={() => setHintsRevealed(1)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>💡 Show Textbook Hint 1</span>
              </button>
            )}

            {hintsRevealed >= 1 && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 w-full animate-fadeIn">
                <span className="font-bold text-amber-400 mr-2 font-mono">Textbook Clue 1:</span>
                {getLocalizedText(currentQuestion.hint1, language)}
              </div>
            )}

            {hintsRevealed === 1 && (
              <button
                onClick={() => setHintsRevealed(2)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 flex items-center gap-1.5"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>💡 Show Formula Derivation Clue (Hint 2)</span>
              </button>
            )}

            {hintsRevealed >= 2 && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 w-full animate-fadeIn">
                <span className="font-bold text-amber-400 mr-2 font-mono">Formula Clue:</span>
                {getLocalizedText(currentQuestion.hint2, language)}
              </div>
            )}
          </div>
        </div>

        {/* Submit Action */}
        {!isSubmitted ? (
          <div className="flex justify-end pt-4">
            <button
              disabled={selectedOption === null}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2"
            >
              <span>SUBMIT TEXTBOOK ANSWER ({confidence.toUpperCase()})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Post-Submission Evaluation */
          <div className="space-y-4 pt-6 border-t border-zinc-800 animate-fadeIn">
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                isCorrect
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          ✓ Correct!
                        </span>
                        {masteryPopNotification && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 text-xs font-black font-mono shadow-lg animate-bounce ring-2 ring-emerald-300">
                            <span>+{masteryPopNotification.delta}% Level Up!</span>
                            <span>({masteryPopNotification.score}% Mastery)</span>
                          </span>
                        )}
                        {!masteryPopNotification && (
                          <span className="text-zinc-300">
                            Mastery {masteryDeltaDisplay}
                          </span>
                        )}
                        <span className="text-zinc-400 font-normal text-xs">
                          (Weighted by {confidence.replace('_', ' ')})
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>
                        Incorrect Attempt ({evaluatedErrorType} | Confidence: {confidence})
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <TTSButton
                    textToSpeak={solutionSpeechText}
                    language={language}
                    label="Listen Solution (TTS)"
                    size="sm"
                    variant="ghost"
                  />

                  {!isCorrect && (
                    <button
                      onClick={() => setShowRecoveryModal(true)}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Launch Failure Recovery</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Step-by-step textbook solution */}
              <div className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800/80">
                <span className="font-bold text-zinc-100 block mb-1 font-mono">
                  Official Textbook Solution & Derivation:
                </span>
                {getLocalizedText(currentQuestion.explanation, language)}
              </div>

              {/* Guided Reasoning */}
              {currentQuestion.guidedReasoning && (
                <div className="p-3 bg-zinc-950/80 rounded-lg border border-zinc-800 text-xs text-zinc-300 whitespace-pre-line">
                  <span className="font-bold text-amber-400 block mb-1 font-mono">
                    Step-by-Step Problem Solving Breakdown:
                  </span>
                  {getLocalizedText(currentQuestion.guidedReasoning, language)}
                </div>
              )}

              {/* AI Error Diagnosis (if wrong) */}
              {!isCorrect && aiDiagnosis && (
                <div className="mt-2 p-3 rounded-lg bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-300 whitespace-pre-line">
                  {aiDiagnosis}
                </div>
              )}
            </div>

            {/* Explicit Next Question Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setIsSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all"
              >
                Re-solve Question
              </button>

              <button
                onClick={handleNextQuestion}
                className="px-8 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>NEXT TEXTBOOK PROBLEM ➔</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* "Why am I getting this question?" Modal */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Target className="w-5 h-5" />
                <h3 className="font-bold text-sm text-zinc-100">Why was this textbook problem selected for you?</h3>
              </div>
              <button onClick={() => setShowWhyModal(false)} className="text-zinc-400 hover:text-zinc-200">
                ✕
              </button>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {getLocalizedText(currentQuestion.whyReason, language) ||
                'Selected from your board textbook based on high frequency in past examinations and your current mastery stage.'}
            </p>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 font-mono">
              <div>Board: {currentQuestion.textbookSource?.board || 'CBSE'}</div>
              <div>Source: {currentQuestion.textbookSource?.bookTitle}</div>
              <div>Exercise: {currentQuestion.textbookSource?.exercise} ({currentQuestion.textbookSource?.questionNo})</div>
              <div>Retention Schedule: Active Revision Schedule</div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowWhyModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950"
              >
                Got It ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Failure Recovery Engine Modal */}
      <FailureRecoveryModal
        isOpen={showRecoveryModal}
        onClose={() => setShowRecoveryModal(false)}
        conceptTitle={currentQuestion.conceptId}
        language={language}
      />
    </div>
  );
};
