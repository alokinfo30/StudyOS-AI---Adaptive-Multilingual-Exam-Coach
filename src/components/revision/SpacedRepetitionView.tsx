import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConfidenceLevel, LanguageCode, SpacedRevisionItem, UserProfile } from '../../types';
import { loadSpacedRevisionQueue, saveSpacedRevisionQueue } from '../../services/storageService';
import { CURRICULUM_QUESTIONS } from '../../data/curriculum';
import { getLocalizedText } from '../../data/languages';
import { getNextIntervalDays } from '../../utils/masteryCalculator';

interface SpacedRepetitionViewProps {
  language: LanguageCode;
  profile: UserProfile;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  language,
}) => {
  const [queue, setQueue] = useState<SpacedRevisionItem[]>(loadSpacedRevisionQueue());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);

  const activeItem = queue[currentIndex] || queue[0];
  const questionData =
    CURRICULUM_QUESTIONS.find((q) => q.id === activeItem?.questionId) || CURRICULUM_QUESTIONS[0];

  const handleConfidenceSubmit = (conf: ConfidenceLevel) => {
    setSelectedConfidence(conf);
    const nextDays = getNextIntervalDays(conf);

    const updatedQueue = [...queue];
    updatedQueue[currentIndex] = {
      ...activeItem,
      currentIntervalDays: nextDays,
      scheduledDate: Date.now() + nextDays * 86400000,
      repetitionCount: activeItem.repetitionCount + 1,
      lastConfidence: conf,
      forgettingRiskPercent: conf === 'very_confident' ? 12 : conf === 'confident' ? 24 : 65,
      dueStatus: 'upcoming',
    };

    setQueue(updatedQueue);
    saveSpacedRevisionQueue(updatedQueue);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setSelectedConfidence(null);
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Ebbinghaus Spaced Repetition Engine
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {queue.filter((q) => q.dueStatus === 'due_today').length} Concepts Due Today
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Interactive Spaced Revision / स्मार्ट पुनरावृत्ति
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 block font-mono">Active Interval</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {activeItem?.currentIntervalDays || 1} Days
            </span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 block font-mono">Forgetting Risk</span>
            <span
              className={`text-base font-bold font-mono ${
                activeItem?.forgettingRiskPercent > 60 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {activeItem?.forgettingRiskPercent || 50}%
            </span>
          </div>
        </div>
      </div>

      {/* Revision Interactive Flashcard Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span className="font-mono text-xs text-zinc-300 font-semibold">
              Recall Trigger: {activeItem?.conceptId}
            </span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Repetition #{activeItem?.repetitionCount || 1}
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed font-sans">
            {getLocalizedText(questionData.prompt, language)}
          </h3>

          {!showAnswer ? (
            <div className="pt-6 text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-3 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-md"
              >
                THINK & REVEAL SOLUTION ➔
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-zinc-800 animate-fadeIn">
              {/* Answer & Explanation */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-1 font-mono">
                  Correct Answer: Option {String.fromCharCode(65 + questionData.correctIndex)} (
                  {getLocalizedText(questionData.options[questionData.correctIndex], language)})
                </span>
                <p className="text-zinc-300 pt-1">
                  {getLocalizedText(questionData.explanation, language)}
                </p>
              </div>

              {/* 4-Level Confidence Selection Matrix */}
              {!selectedConfidence ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      How accurately did you recall this concept? (Calibrates spacing interval & memory strength):
                    </label>
                    <span className="text-[10px] font-mono text-amber-400">4-Level Calibration</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleConfidenceSubmit('guess')}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/60 text-left text-xs transition-all hover:bg-rose-950/20"
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 1 (0.35x)</span>
                      <div className="font-bold text-rose-400 text-sm">😕 Guess / Forgot</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review tomorrow (1 day)</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('somewhat')}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/60 text-left text-xs transition-all hover:bg-amber-950/20"
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 2 (0.70x)</span>
                      <div className="font-bold text-amber-400 text-sm">😐 Somewhat Unsure</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 2 days</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('confident')}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/60 text-left text-xs transition-all hover:bg-blue-950/20"
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 3 (1.00x)</span>
                      <div className="font-bold text-blue-400 text-sm">🙂 Confident Recall</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 3 days</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('very_confident')}
                      className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 text-left text-xs transition-all hover:bg-emerald-950/20"
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 4 (1.25x)</span>
                      <div className="font-bold text-emerald-400 text-sm">🔥 Mastered (100%)</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 7 days</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Interval recalibrated to {activeItem.currentIntervalDays} days based on {selectedConfidence.replace('_', ' ')} recall!</span>
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>Next Revision Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
