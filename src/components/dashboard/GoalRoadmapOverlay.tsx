import React from 'react';
import {
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { ConceptMastery, StudentDNA, UserProfile } from '../../types';

interface GoalRoadmapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
}

export const GoalRoadmapOverlay: React.FC<GoalRoadmapOverlayProps> = ({
  isOpen,
  onClose,
  profile,
  dna,
  masteries,
}) => {
  if (!isOpen) return null;

  const examGoal = profile.selectedBoard
    ? `${profile.selectedBoard} Board Exam`
    : profile.selectedExam.replace('_', ' ');

  const currentStreak = dna.consistencyStreak || profile.streakDays || 7;

  // Calculate days remaining to exam target
  const targetDate = new Date(profile.examDate || '2027-02-25');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const milestones = [
    {
      id: 'm1',
      title: 'NCERT Foundation Coverage',
      phase: 'Phase 1: Conceptual Foundations',
      description: 'Comprehensive study of standard definitions, diagrams, and fundamental laws.',
      status: 'completed',
      completionPercent: 100,
      targetDateLabel: 'Completed Aug 2026',
      icon: CheckCircle2,
      badge: '100% Completed',
      deliverables: ['All Chapter Outlines Reviewed', 'Base Formulas Documented'],
    },
    {
      id: 'm2',
      title: 'Formula Mastery & Derivations',
      phase: 'Phase 2: Mathematical Precision',
      description: 'Mastering numerical problem derivations, unit conversions, and formula variations.',
      status: 'active',
      completionPercent: 82,
      targetDateLabel: 'In Progress (Active Sprint)',
      icon: Zap,
      badge: '82% Active',
      deliverables: ["Ohm's Law & Circuit Power", 'Snell’s Law & Lens Coordinates', 'Stoichiometry Mass Equations'],
    },
    {
      id: 'm3',
      title: 'Previous Years Questions (PYQ) Marathon',
      phase: 'Phase 3: Exam Pattern Mastery',
      description: '10 years of solved CBSE/Board question papers with step-marking criteria.',
      status: 'upcoming',
      completionPercent: 25,
      targetDateLabel: 'Oct 2026 Milestone',
      icon: Target,
      badge: 'Unlocks Next',
      deliverables: ['15 High-Yield Question Sets', 'Case-Based Analytical Questions'],
    },
    {
      id: 'm4',
      title: 'Full-Length Timed Mock Simulations',
      phase: 'Phase 4: Test Stamina & Speed',
      description: '3-hour official simulation conditions with automatic grading and error logs.',
      status: 'upcoming',
      completionPercent: 0,
      targetDateLabel: 'Dec 2026 Milestone',
      icon: Clock,
      badge: 'Sprint 4',
      deliverables: ['5 Full-Length Proctored Mocks', 'Time-per-Question Calibration'],
    },
    {
      id: 'm5',
      title: 'Final 30-Day Rapid Revision & Error Rectification',
      phase: 'Phase 5: Peak Performance Sprint',
      description: 'Spaced repetition flashcards only on high forgetting-risk weak spots.',
      status: 'upcoming',
      completionPercent: 0,
      targetDateLabel: 'Jan 2027 Sprint',
      icon: Flame,
      badge: 'Final Lap',
      deliverables: ['Zero Calculation Errors Target', 'Personalized Cheat-Sheet Review'],
    },
    {
      id: 'm6',
      title: 'Board Exam Day / Apex Performance',
      phase: 'Target D-Day',
      description: 'Enter the examination center with 95%+ projected readiness score.',
      status: 'target',
      completionPercent: 0,
      targetDateLabel: `${profile.examDate || 'Feb 2027'} Target Date`,
      icon: Flag,
      badge: 'D-Day Goal',
      deliverables: ['Verified 90%+ Target Score Achievement'],
    },
  ];

  // Consistency-based velocity projection
  const projectedBufferDays = Math.min(24, Math.max(8, Math.round(currentStreak * 1.8)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-zinc-400 hover:text-zinc-200 p-2 rounded-xl hover:bg-zinc-800 transition-all text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono flex items-center gap-1">
                <Target className="w-3 h-3" />
                Adaptive Exam Journey
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {daysRemaining} Days Remaining
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans">
              Goal Roadmap: {examGoal}
            </h2>
            <p className="text-xs text-zinc-400">
              Personalized trajectory aligned with your {profile.targetScore}% target score.
            </p>
          </div>

          {/* Consistency Velocity Banner */}
          <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">
                Pacing Forecast
              </span>
              <span className="text-xs font-bold text-emerald-400">
                +{projectedBufferDays} Days Ahead of Schedule
              </span>
            </div>
          </div>
        </div>

        {/* Study Consistency Trajectory Insight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-300">
              Consistency Multiplier: {currentStreak}-Day Unbroken Practice Streak
            </h4>
            <p className="text-zinc-300 leading-relaxed">
              Based on your active study velocity (averaging ~1.2 chapters/week with {dna.questionAccuracy}% question accuracy), you are projected to complete full syllabus revision and first-pass PYQs <strong>{projectedBufferDays} days before the board exams</strong>, granting ample time for mock exam simulations.
            </p>
          </div>
        </div>

        {/* Visual Progress Line & Milestones */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-amber-500 before:to-zinc-700">
          {milestones.map((m, idx) => {
            const isCompleted = m.status === 'completed';
            const isActive = m.status === 'active';
            const isTarget = m.status === 'target';

            return (
              <div key={m.id} className="relative group">
                {/* Node Circle on the Progress Line */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center text-xs transition-all shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 ring-4 ring-emerald-500/20'
                      : isActive
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 ring-4 ring-amber-500/30 animate-pulse'
                      : isTarget
                      ? 'bg-rose-500 text-zinc-950 border-rose-400'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <span className="font-mono text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Milestone Details Card */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-zinc-950 border-amber-500/50 shadow-lg shadow-amber-500/5'
                      : isCompleted
                      ? 'bg-zinc-950/80 border-emerald-500/30'
                      : 'bg-zinc-950/40 border-zinc-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                        {m.phase}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-bold ${
                          isActive ? 'text-amber-300' : isCompleted ? 'text-zinc-100' : 'text-zinc-400'
                        }`}
                      >
                        {m.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isActive
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                        }`}
                      >
                        {m.badge}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400">
                        {m.targetDateLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                    {m.description}
                  </p>

                  {/* Progress Line for the Milestone */}
                  {m.completionPercent > 0 && (
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                        <span>Milestone Mastery Progress</span>
                        <span className="font-bold text-zinc-200">{m.completionPercent}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${m.completionPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Key Deliverables Chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.deliverables.map((item, dIdx) => (
                      <span
                        key={dIdx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Action */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Exam Target: {targetDate.toLocaleDateString()}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-md"
          >
            Continue Today’s Mission
          </button>
        </div>
      </div>
    </div>
  );
};
