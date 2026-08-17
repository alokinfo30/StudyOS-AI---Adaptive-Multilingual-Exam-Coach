import React from 'react';
import {
  Award,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import { ConceptMastery, ExamReadiness, LanguageCode, StudentDNA, UserProfile } from '../../types';
import { calculateExamReadiness } from '../../utils/masteryCalculator';
import { getLocalizedText } from '../../data/languages';

interface ExamReadinessViewProps {
  language: LanguageCode;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
  onNavigateToPractice: () => void;
}

export const ExamReadinessView: React.FC<ExamReadinessViewProps> = ({
  language,
  profile,
  dna,
  masteries,
  onNavigateToPractice,
}) => {
  const readiness: ExamReadiness = calculateExamReadiness(
    profile.selectedExam,
    profile.targetScore,
    Object.values(masteries),
    dna,
    [76, 82]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Exam Readiness Engine
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Target: {readiness.targetScorePercent}% • Exam Date: {profile.examDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Exam Readiness Index / परीक्षा तैयारी सूचकांक
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Composite diagnostic model measuring concept mastery, numerical speed, retention stability, and mock exam percentiles.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-center min-w-[130px]">
              <span className="text-[10px] text-zinc-400 block font-mono">Readiness Score</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {readiness.overallReadiness}%
              </span>
            </div>
            <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-center min-w-[130px]">
              <span className="text-[10px] text-zinc-400 block font-mono">Target Gap</span>
              <span className="text-3xl font-extrabold text-rose-400 font-mono">
                {readiness.gapPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Probabilistic Prediction Box (Never Fake Guaranteed 100%) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">Estimated Exam Preparation Range</h3>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-zinc-800 text-zinc-300 font-mono">
            Confidence: {readiness.confidence}
          </span>
        </div>
        <p className="text-xs text-zinc-300">
          Based on your recent 84 question attempts and 2 mock simulations, your current estimated scoring range is{' '}
          <strong className="text-amber-400 font-mono">
            {readiness.predictedScoreRange.min}% – {readiness.predictedScoreRange.max}%
          </strong>
          .
        </p>
      </div>

      {/* 6 Core Readiness Pillar Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Concept Mastery</span>
          <span className="text-base font-bold text-zinc-200 font-mono">
            {readiness.metrics.conceptMastery}%
          </span>
        </div>
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Question Accuracy</span>
          <span className="text-base font-bold text-emerald-400 font-mono">
            {readiness.metrics.questionAccuracy}%
          </span>
        </div>
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Recall Strength</span>
          <span className="text-base font-bold text-indigo-400 font-mono">
            {readiness.metrics.recallStrength}%
          </span>
        </div>
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Speed Score</span>
          <span className="text-base font-bold text-teal-400 font-mono">
            {readiness.metrics.speedScore}%
          </span>
        </div>
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Mock Score</span>
          <span className="text-base font-bold text-purple-400 font-mono">
            {readiness.metrics.mockTestScore}%
          </span>
        </div>
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-mono">Consistency</span>
          <span className="text-base font-bold text-orange-400 font-mono">
            {readiness.metrics.consistencyScore}%
          </span>
        </div>
      </div>

      {/* Weakest vs Strongest Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="bg-zinc-900 border border-rose-900/30 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-bold text-zinc-100">Priority Weak Areas (Gap Drivers)</h3>
          </div>
          <div className="space-y-3">
            {readiness.weakestTopics.map((topic) => (
              <div
                key={topic.conceptId}
                className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-200">
                    {getLocalizedText(topic.title, language)}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">
                    {topic.subject} • {topic.weightage}
                  </p>
                </div>
                <span className="text-xs font-bold text-rose-400 font-mono">{topic.mastery}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Areas */}
        <div className="bg-zinc-900 border border-emerald-900/30 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-zinc-100">Mastered High-Yield Concepts</h3>
          </div>
          <div className="space-y-3">
            {readiness.strongestTopics.map((topic) => (
              <div
                key={topic.conceptId}
                className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-200">
                    {getLocalizedText(topic.title, language)}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono">{topic.subject} • Stable Recall</p>
                </div>
                <span className="text-xs font-bold text-emerald-400 font-mono">{topic.mastery}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Action Plan */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-amber-400 uppercase">
            Recommended Action to Close Gap
          </span>
          <p className="text-xs sm:text-sm text-zinc-200 font-medium">
            {getLocalizedText(readiness.recommendedAction, language)}
          </p>
        </div>
        <button
          onClick={onNavigateToPractice}
          className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shrink-0 shadow-md"
        >
          Launch Targeted Practice ➔
        </button>
      </div>
    </div>
  );
};
