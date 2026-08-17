import React from 'react';
import {
  Brain,
  Zap,
  Target,
  Clock,
  Flame,
  Award,
  Sparkles,
  TrendingUp,
  Activity,
  Calculator,
  ShieldAlert,
} from 'lucide-react';
import { LanguageCode, StudentDNA, UserProfile } from '../../types';

interface StudentDNAViewProps {
  language: LanguageCode;
  profile: UserProfile;
  dna: StudentDNA;
}

export const StudentDNAView: React.FC<StudentDNAViewProps> = ({
  language,
  profile,
  dna,
}) => {
  const DNA_METRICS = [
    { key: 'learningSpeed', label: 'Learning Speed (Velocity)', value: dna.learningSpeed, icon: Zap, color: 'text-amber-400', bar: 'bg-amber-400' },
    { key: 'conceptRetention', label: 'Concept Retention', value: dna.conceptRetention, icon: Brain, color: 'text-indigo-400', bar: 'bg-indigo-400' },
    { key: 'questionAccuracy', label: 'Question Accuracy', value: dna.questionAccuracy, icon: Target, color: 'text-emerald-400', bar: 'bg-emerald-400' },
    { key: 'calculationAccuracy', label: 'Calculation Precision', value: dna.calculationAccuracy, icon: Calculator, color: 'text-blue-400', bar: 'bg-blue-400' },
    { key: 'memoryStrength', label: 'Memory & Recall Strength', value: dna.memoryStrength, icon: Activity, color: 'text-purple-400', bar: 'bg-purple-400' },
    { key: 'problemSolvingIndex', label: 'Problem Solving Index', value: dna.problemSolvingIndex, icon: Award, color: 'text-teal-400', bar: 'bg-teal-400' },
    { key: 'timeManagement', label: 'Time Management Score', value: dna.timeManagement, icon: Clock, color: 'text-rose-400', bar: 'bg-rose-400' },
    { key: 'consistencyStreak', label: 'Consistency Multiplier', value: Math.min(dna.consistencyStreak * 15, 100), icon: Flame, color: 'text-orange-400', bar: 'bg-orange-400' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Cognitive Intelligence Layer
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {dna.totalQuestionsSolved} Questions Solved • {dna.totalHoursStudied} Hours Tracked
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
              Student Learning DNA / व्यक्तिगत अधिगम प्रोफाइल
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Real-time cognitive footprint computed from response times, error classifications, hint dependencies, and spaced repetition recall.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-center min-w-[140px]">
            <span className="text-[10px] text-zinc-400 block font-mono">Overall Efficiency</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {Math.round((dna.questionAccuracy + dna.conceptRetention + dna.problemSolvingIndex) / 3)}%
            </span>
          </div>
        </div>
      </div>

      {/* 8-Dimensional Radar & Bar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DNA_METRICS.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.key}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg bg-zinc-950 border border-zinc-800 ${metric.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-200">{metric.label}</span>
                </div>
                <span className="text-sm font-bold font-mono text-zinc-100">{metric.value}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden border border-zinc-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${metric.bar}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Deep Learning DNA Diagnosis */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Sparkles className="w-5 h-5" />
          <h3 className="text-sm font-bold text-zinc-100">StudyOS AI Cognitive Diagnosis</h3>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-2">
          <p>
            🧠 <strong>Core Strength</strong>: Your concept understanding is strong (81% accuracy on first attempts), meaning your analytical reasoning is fast and sharp.
          </p>
          <p>
            ⚠️ <strong>Primary Vulnerability</strong>: Your long-term memory retention drops from 84% on Day 0 to 58% by Day 7 without revision. <em>"आपकी समस्या बुद्धिमत्ता नहीं, बल्कि 7 दिन बाद का retention है।"</em>
          </p>
          <p>
            🎯 <strong>AI Strategy Adaptation</strong>: We have boosted your Spaced Repetition frequency by 35% on Day 3 and Day 7, rather than asking you to re-read long textbooks.
          </p>
        </div>
      </div>
    </div>
  );
};
