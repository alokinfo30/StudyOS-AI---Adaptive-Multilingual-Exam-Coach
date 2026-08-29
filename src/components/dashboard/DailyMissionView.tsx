import React from 'react';
import {
  Flame,
  Clock,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  BookOpen,
  RotateCcw,
  Zap,
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Shield,
  Award,
  Calendar,
} from 'lucide-react';
import { ConceptMastery, DailyMission, LanguageCode, StudentDNA, UserProfile } from '../../types';
import { getLocalizedText } from '../../data/languages';
import { getStreakModifier } from '../../utils/masteryCalculator';

interface DailyMissionViewProps {
  language: LanguageCode;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
  onNavigateTab: (tab: string) => void;
}

export const DailyMissionView: React.FC<DailyMissionViewProps> = ({
  language,
  profile,
  dna,
  masteries,
  onNavigateTab,
}) => {
  const currentStreakDays = dna.consistencyStreak || profile.streakDays || 7;
  const streakInfo = getStreakModifier(currentStreakDays);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const missionTasks = [
    {
      id: 'task_learn',
      title: {
        en: 'Learn: Ohm’s Law & Resistance Factors',
        hi: 'सीखें: ओम का नियम एवं प्रतिरोध',
        hinglish: "Learn: Ohm's Law & Resistance Scaling",
      },
      durationMin: 20,
      type: 'learn',
      tab: 'learn',
      status: 'In Progress (Step 1 of 3)',
      isCompleted: false,
    },
    {
      id: 'task_practice',
      title: {
        en: 'Adaptive Practice: 15 Targeted Questions',
        hi: 'सटीक अभ्यास: 15 महत्वपूर्ण प्रश्न',
        hinglish: 'Adaptive Practice: 15 Questions',
      },
      durationMin: 25,
      type: 'practice',
      tab: 'practice',
      status: 'Scheduled',
      isCompleted: false,
    },
    {
      id: 'task_revision',
      title: {
        en: 'Spaced Revision: 2 Overdue Concepts',
        hi: 'स्मार्ट पुनरावृत्ति: 2 आवश्यक विषय',
        hinglish: 'Spaced Revision: 2 Due Concepts',
      },
      durationMin: 12,
      type: 'revision',
      tab: 'revision',
      status: 'Due Today (Forgetting Risk >70%)',
      isCompleted: false,
    },
    {
      id: 'task_test',
      title: {
        en: 'Daily 15-Minute Mock Simulation',
        hi: 'दैनिक 15-मिनट मॉक टेस्ट',
        hinglish: 'Daily 15-Min Mock Exam',
      },
      durationMin: 15,
      type: 'mock_exam',
      tab: 'mock_exam',
      status: 'Unlock at 80% completion',
      isCompleted: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Hero Greeting & Today's Priority Mission Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Daily Adaptive AI Mission
              </span>
              <span className="text-xs text-zinc-400 font-mono">Target: {profile.targetScore}% Exam Score</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 font-sans tracking-tight">
              Good Morning, {profile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              StudyOS AI has calculated your retention curve. Focus on high-yield physics and quadratic algebra today to bridge your 12% readiness gap.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 text-center min-w-[100px]">
              <span className="text-[10px] text-zinc-400 block font-mono">Estimated Time</span>
              <span className="text-lg font-bold text-amber-400 font-mono">58 Mins</span>
            </div>
            <div className="p-4 bg-zinc-950/80 rounded-xl border border-zinc-800 text-center min-w-[100px]">
              <span className="text-[10px] text-zinc-400 block font-mono">Exam Readiness</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">78%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Daily Streak Counter & Cognitive Multiplier Card */}
      <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-amber-950/30 border border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-inner relative">
              <Flame className="w-6 h-6 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-100 font-sans flex items-center gap-1.5">
                  <span>{streakInfo.streakDays}-Day Study Streak!</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-mono font-bold border border-orange-500/40">
                    🔥 {streakInfo.streakMultiplier}x Cognitive DNA Boost
                  </span>
                </h3>
              </div>
              <p className="text-xs text-zinc-300">
                You've studied consistently for {streakInfo.streakDays} consecutive days. Your memory retention and speed index receive a <strong className="text-orange-300">+{streakInfo.cognitiveBoostPercent}% modifier</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs font-mono text-zinc-300">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>{streakInfo.freezeShieldsRemaining} Freeze Shield{streakInfo.freezeShieldsRemaining !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* 7-Day Weekly Streak Roadmap Dots */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 no-scrollbar">
            {weekDays.map((day, idx) => {
              const isActive = streakInfo.weeklyDaysActive[idx];
              const isToday = idx === (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
              return (
                <div
                  key={day}
                  className={`flex-1 min-w-[50px] p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    isActive
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-300 shadow-xs'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400'
                  } ${isToday ? 'ring-2 ring-orange-500/60' : ''}`}
                >
                  <span className="text-[10px] font-mono font-bold">{day}</span>
                  {isActive ? (
                    <div className="w-5 h-5 rounded-full bg-orange-500 text-zinc-950 flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px]">
                      •
                    </div>
                  )}
                  <span className="text-[9px] font-mono text-zinc-300">
                    {isToday ? 'Today' : isActive ? 'Done' : 'Upcoming'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 bg-zinc-950/60 px-3 py-2 rounded-lg border border-zinc-800/60">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Next Milestone: {streakInfo.nextMilestoneReward}</span>
            </span>
            <span className="text-zinc-300 hidden sm:inline">Keep going to unlock Diamond Trophy!</span>
          </div>
        </div>
      </div>

      {/* Today's Action Checklist */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <span>Today’s Action Checklist / आज का मिशन</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">4 Targeted Milestones</span>
        </div>

        <div className="space-y-3">
          {missionTasks.map((t, idx) => (
            <div
              key={t.id}
              onClick={() => onNavigateTab(t.tab)}
              className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 hover:border-amber-500/40 hover:bg-zinc-800/60 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono font-bold text-xs text-amber-400 group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-200 group-hover:text-amber-300 transition-colors">
                    {getLocalizedText(t.title, language)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.durationMin} mins
                    </span>
                    <span>•</span>
                    <span className="text-amber-400/80">{t.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 group-hover:text-amber-400 transition-colors">
                <span className="hidden sm:inline">Start Now</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: "What NOT to Study Today" & Cognitive DNA Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CRITICAL FEATURE: "What NOT to Study Today" (Time Saver Engine) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                What NOT to Study Today (Time Saver)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Mastered concepts already exceeding 90% retention threshold.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-200">Linear Equations in Two Variables</p>
                <p className="text-[10px] text-zinc-400 font-mono">Current Mastery: 96% • Retention: Stable</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                Skip Revision
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-200">Series & Parallel Resistor Networks</p>
                <p className="text-[10px] text-zinc-400 font-mono">Current Mastery: 94% • Accuracy: 95%</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                Skip Revision
              </span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 italic pt-1">
            💡 AI Recommendation: Reclaim 35 minutes today by not re-reading topics you have already fully mastered.
          </p>
        </div>

        {/* Priority Weak Topic Recovery Alert */}
        <div className="bg-zinc-900 border border-rose-900/30 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Priority Weak Topics (Action Required)
              </h3>
              <p className="text-[11px] text-zinc-400">
                Concepts with high exam weightage but dropping retention.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-rose-900/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-200">Coulomb’s Law & Dielectric Media</p>
                <p className="text-[10px] text-rose-400 font-mono">Mastery: 58% • High Yield (18% in exam)</p>
              </div>
              <button
                onClick={() => onNavigateTab('practice')}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-rose-500 text-zinc-950 hover:bg-rose-400 font-mono"
              >
                Recover ➔
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-amber-900/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-zinc-200">Quadratic Discriminant & Equal Roots</p>
                <p className="text-[10px] text-amber-400 font-mono">Mastery: 64% • Recurring sign errors</p>
              </div>
              <button
                onClick={() => onNavigateTab('practice')}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-amber-500 text-zinc-950 hover:bg-amber-400 font-mono"
              >
                Practice ➔
              </button>
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              onClick={() => onNavigateTab('readiness')}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View Full Readiness Breakdown</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
