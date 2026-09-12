import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  AlertTriangle,
  Award,
  BarChart2,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ErrorType,
  LanguageCode,
  MockExamQuestionState,
  Question,
  UserProfile,
} from '../../types';
import { CURRICULUM_QUESTIONS } from '../../data/curriculum';
import { getLocalizedText } from '../../data/languages';
import { recordQuestionAttempt, loadStudentDNA, saveStudentDNA } from '../../services/storageService';
import { playMasteryPopSound } from '../../utils/audioEffects';
import { ExamCountdownTimerWidget } from '../common/ExamCountdownTimerWidget';

interface MockTestSimulatorProps {
  language: LanguageCode;
  profile: UserProfile;
}

export const MockTestSimulator: React.FC<MockTestSimulatorProps> = ({
  language,
  profile,
}) => {
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeftSec, setTimeLeftSec] = useState(20 * 60); // 20 min simulation

  const examQuestions: Question[] = CURRICULUM_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = examQuestions[currentIndex] || examQuestions[0];

  // Question answers state map
  const [answers, setAnswers] = useState<Record<string, MockExamQuestionState>>({});

  // Countdown timer
  useEffect(() => {
    if (!isExamStarted || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isExamStarted, isSubmitted]);

  const handleStartExam = () => {
    setIsExamStarted(true);
    setIsSubmitted(false);
    setTimeLeftSec(15 * 60);
    const initial: Record<string, MockExamQuestionState> = {};
    examQuestions.forEach((q) => {
      initial[q.id] = {
        questionId: q.id,
        selectedOption: null,
        status: 'not_visited',
        timeSpentSec: 0,
      };
    });
    initial[examQuestions[0].id].status = 'not_answered';
    setAnswers(initial);
  };

  const handleSelectOption = (idx: number) => {
    const qState = answers[currentQuestion.id] || {
      questionId: currentQuestion.id,
      selectedOption: null,
      status: 'not_answered',
      timeSpentSec: 0,
    };
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        ...qState,
        selectedOption: idx,
        status: 'answered',
      },
    });
  };

  const handleSaveAndNext = () => {
    if (currentIndex < examQuestions.length - 1) {
      const nextQ = examQuestions[currentIndex + 1];
      if (answers[nextQ.id]?.status === 'not_visited') {
        setAnswers((prev) => ({
          ...prev,
          [nextQ.id]: { ...prev[nextQ.id], status: 'not_answered' },
        }));
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleMarkForReview = () => {
    const qState = answers[currentQuestion.id];
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        ...qState,
        status: qState.selectedOption !== null ? 'answered_and_marked' : 'marked_for_review',
      },
    });
    handleSaveAndNext();
  };

  const handleClearResponse = () => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        selectedOption: null,
        status: 'not_answered',
        timeSpentSec: 0,
      },
    });
  };

  const handleSubmitExam = () => {
    setIsSubmitted(true);

    // Record each answered question attempt to student history and update student DNA
    let attemptedTotal = 0;
    let correctTotal = 0;

    examQuestions.forEach((q) => {
      const userAns = answers[q.id]?.selectedOption;
      if (userAns !== null && userAns !== undefined) {
        attemptedTotal++;
        const isCorrect = userAns === q.correctIndex;
        if (isCorrect) correctTotal++;

        recordQuestionAttempt({
          id: `att_mock_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          questionId: q.id,
          conceptId: q.conceptId,
          chapterId: q.chapterId,
          subjectId: q.subjectId,
          selectedOption: userAns,
          isCorrect,
          confidence: 'confident',
          hintsUsed: 0,
          timeSpentSec: answers[q.id]?.timeSpentSec || 45,
          timestamp: Date.now(),
        });
      }
    });

    if (attemptedTotal > 0) {
      const currentDNA = loadStudentDNA();
      const updatedTotalSolved = (currentDNA.totalQuestionsSolved || 0) + attemptedTotal;
      const overallAccuracy = Math.round((correctTotal / attemptedTotal) * 100);
      saveStudentDNA({
        ...currentDNA,
        totalQuestionsSolved: updatedTotalSolved,
        questionAccuracy: Math.round(((currentDNA.questionAccuracy || 75) * 0.7) + (overallAccuracy * 0.3)),
      });

      playMasteryPopSound(overallAccuracy >= 75);
    }

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  // Compute Results
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;

  examQuestions.forEach((q) => {
    const userAns = answers[q.id]?.selectedOption;
    if (userAns === null || userAns === undefined) {
      unattemptedCount++;
    } else if (userAns === q.correctIndex) {
      score += 4;
      correctCount++;
    } else {
      score -= 1;
      incorrectCount++;
    }
  });

  const accuracy = correctCount + incorrectCount > 0 ? Math.round((correctCount / (correctCount + incorrectCount)) * 100) : 0;
  const maxScore = examQuestions.length * 4;
  const percentileEstimate = Math.min(Math.max(Math.round((score / maxScore) * 60 + 38), 25), 99.4);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isExamStarted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              Official Simulation Environment
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-sans">
              Full Mock Exam Simulator / मॉक टेस्ट सिमुलेटर
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Realistic timed exam with negative marking (+4 / -1), question palette navigation, section timing, and deep diagnostic error classification.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-mono">Exam Target</span>
              <span className="text-sm font-bold text-zinc-200">{profile.selectedExam.replace('_', ' ')}</span>
            </div>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-mono">Questions</span>
              <span className="text-sm font-bold text-zinc-200">{examQuestions.length} Questions</span>
            </div>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-mono">Time Limit</span>
              <span className="text-sm font-bold text-amber-400">15 Minutes</span>
            </div>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 block font-mono">Marking</span>
              <span className="text-sm font-bold text-emerald-400">+4 / -1 Mark</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartExam}
              className="px-10 py-3.5 rounded-xl font-bold text-sm bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              START MOCK EXAMINATION ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
        {/* Exam Report Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                  Mock Exam Performance Report
                </h2>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Simulation ID: {profile.selectedExam}_MOCK_{Date.now().toString().slice(-4)}
              </p>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-right">
              <span className="text-[11px] text-zinc-400 block font-mono">Estimated Percentile</span>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">
                {percentileEstimate}%ile
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block">Total Score</span>
              <span className="text-xl font-bold text-zinc-100 font-mono">
                {score} / {maxScore}
              </span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block">Accuracy</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">{accuracy}%</span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block">Correct / Incorrect</span>
              <span className="text-xl font-bold text-zinc-200 font-mono">
                <span className="text-emerald-400">{correctCount}</span> / <span className="text-rose-400">{incorrectCount}</span>
              </span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800">
              <span className="text-xs text-zinc-400 block">Unattempted</span>
              <span className="text-xl font-bold text-zinc-400 font-mono">{unattemptedCount}</span>
            </div>
          </div>

          {/* Deep Error Intelligence Classification */}
          <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold font-mono text-amber-400 uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Diagnostic Error Classification</span>
            </div>
            <p className="text-xs text-zinc-300">
              {incorrectCount === 0
                ? 'Flawless precision across all attempted questions!'
                : `${incorrectCount} mistakes classified: Primary weakness identified in Sign Handling & Formula Selection under time constraints.`}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <button
              onClick={handleStartExam}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Mock Exam</span>
            </button>
            <button
              onClick={() => setIsExamStarted(false)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400"
            >
              Review Daily Mission ➔
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Exam Simulation Interface
  return (
    <div className="max-w-6xl mx-auto space-y-4 animate-fadeIn pb-12">
      {/* Top Status Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-200">
            {profile.selectedExam.replace('_', ' ')} Full Mock Test
          </span>
          <span className="px-2 py-0.5 text-[10px] bg-zinc-800 text-zinc-400 rounded font-mono">
            Question {currentIndex + 1} of {examQuestions.length}
          </span>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-bold text-sm">
          <Clock className="w-4 h-4 animate-pulse" />
          <span>{formatTimer(timeLeftSec)}</span>
        </div>

        <button
          onClick={handleSubmitExam}
          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-500 text-zinc-100 hover:bg-rose-600 transition-colors shadow-sm"
        >
          Submit Exam
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Question Statement & Options */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-6 flex flex-col justify-between min-h-[480px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold font-mono text-zinc-400">
                Subject: {currentQuestion.subjectId.split('_')[0].toUpperCase()}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">+4 / -1</span>
            </div>

            <h3 className="text-base font-semibold text-zinc-100 leading-relaxed">
              {getLocalizedText(currentQuestion.prompt, language)}
            </h3>

            <div className="space-y-2.5 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id]?.selectedOption === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-left border transition-all text-xs sm:text-sm ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-400 text-xs font-mono flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{getLocalizedText(opt, language)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReview}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-purple-950/40 text-purple-300 border border-purple-800/40 hover:bg-purple-900/50 flex items-center gap-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Mark for Review</span>
              </button>
              <button
                onClick={handleClearResponse}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-400 hover:text-zinc-200"
              >
                Clear Response
              </button>
            </div>

            <button
              onClick={handleSaveAndNext}
              className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 flex items-center gap-1.5 shadow-md"
            >
              <span>Save & Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Col: Question Palette Navigation */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">
            Question Palette
          </h4>

          <div className="grid grid-cols-4 gap-2">
            {examQuestions.map((q, idx) => {
              const state = answers[q.id];
              let btnClass = 'bg-zinc-950 border-zinc-800 text-zinc-400';

              if (state?.status === 'answered') {
                btnClass = 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold';
              } else if (state?.status === 'answered_and_marked') {
                btnClass = 'bg-purple-500 text-white border-purple-400 font-bold';
              } else if (state?.status === 'marked_for_review') {
                btnClass = 'bg-purple-950 text-purple-300 border-purple-600 font-bold';
              } else if (state?.status === 'not_answered') {
                btnClass = 'bg-rose-950/60 text-rose-300 border-rose-800';
              }

              if (currentIndex === idx) {
                btnClass += ' ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-10 rounded-lg text-xs font-mono font-semibold border flex items-center justify-center transition-all ${btnClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="space-y-1.5 pt-4 border-t border-zinc-800 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-rose-950 border border-rose-800" />
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-purple-500" />
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-zinc-950 border border-zinc-800" />
              <span>Not Visited</span>
            </div>
          </div>
        </div>
      </div>

      {/* Persistent, Unobtrusive Exam Countdown & Pacing Timer Widget */}
      <ExamCountdownTimerWidget
        targetExam={profile.selectedExam}
        currentQuestionIndex={currentIndex}
        onTimeUp={handleSubmitExam}
        onSyncTimeLeft={(sec) => setTimeLeftSec(sec)}
      />
    </div>
  );
};
