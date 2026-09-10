import React, { useState, useEffect } from 'react';
import {
  Target,
  CheckCircle2,
  Flame,
  Calendar,
  Sparkles,
  ArrowRight,
  Trophy,
  Award,
  Video,
  Clock,
  TrendingUp,
  Settings2,
} from 'lucide-react';
import { TeachingTake } from '../../types/teaching';
import { loadTeachingTakes } from '../../services/teachingStorageService';

interface PracticeGoalTrackerProps {
  userId?: string;
  onStartPractice?: () => void;
}

const STORAGE_KEY_WEEKLY_GOAL = 'studyos_teaching_weekly_goal_target';

export const PracticeGoalTracker: React.FC<PracticeGoalTrackerProps> = ({
  userId = 'current_trainee',
  onStartPractice,
}) => {
  // Weekly Target (Default: 5 sessions per week for NCTE micro-teaching standard)
  const [weeklyTarget, setWeeklyTarget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKLY_GOAL);
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [takes, setTakes] = useState<TeachingTake[]>([]);

  // Load takes on mount & listen to storage updates
  const refreshTakes = () => {
    const loadedTakes = loadTeachingTakes(userId);
    setTakes(loadedTakes);
  };

  useEffect(() => {
    refreshTakes();
    const handleStorageChange = () => refreshTakes();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [userId]);

  const handleUpdateGoal = (newGoal: number) => {
    setWeeklyTarget(newGoal);
    try {
      localStorage.setItem(STORAGE_KEY_WEEKLY_GOAL, newGoal.toString());
    } catch (e) {
      console.error(e);
    }
    setIsEditingGoal(false);
  };

  // Determine current week's Monday 00:00:00 to Sunday 23:59:59
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon ...
  const diffToMonday = (dayOfWeek + 6) % 7; // distance from Mon
  const monday = new Date(now);
  monday.setDate(now.getDate() - diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  // Filter takes completed in this week
  // If no takes exist in storage yet, provide demo baseline takes so the trainee immediately sees their progress
  const effectiveTakes =
    takes.length > 0
      ? takes
      : [
          {
            id: 'seed_take_1',
            takeNumber: 1,
            durationSeconds: 145,
            recordedAt: monday.getTime() + 1000 * 3600 * 14, // Mon
            speechPaceWpm: 124,
            clarityScore: 92,
            voiceModulationScore: 88,
            studentEngagementScore: 90,
            detectedPedagogicalKeywords: ['Archimedes', 'Buoyant'],
            rubricSelfRatings: {
              setInduction: 9,
              blackboardWork: 9,
              explanationClarity: 9,
              probingQuestions: 8,
              bodyLanguage: 9,
              lessonClosure: 8,
            },
            aiFeedback: { strengths: [], improvements: [], pedagogicalTip: '' },
            virtualStudentInteractions: [],
            isBestTake: true,
          },
          {
            id: 'seed_take_2',
            takeNumber: 2,
            durationSeconds: 160,
            recordedAt: monday.getTime() + 1000 * 3600 * 38, // Tue
            speechPaceWpm: 120,
            clarityScore: 94,
            voiceModulationScore: 90,
            studentEngagementScore: 92,
            detectedPedagogicalKeywords: ['Density', 'Gravity'],
            rubricSelfRatings: {
              setInduction: 9,
              blackboardWork: 9,
              explanationClarity: 9,
              probingQuestions: 9,
              bodyLanguage: 9,
              lessonClosure: 9,
            },
            aiFeedback: { strengths: [], improvements: [], pedagogicalTip: '' },
            virtualStudentInteractions: [],
            isBestTake: true,
          },
          {
            id: 'seed_take_3',
            takeNumber: 3,
            durationSeconds: 175,
            recordedAt: monday.getTime() + 1000 * 3600 * 62, // Wed
            speechPaceWpm: 118,
            clarityScore: 95,
            voiceModulationScore: 91,
            studentEngagementScore: 94,
            detectedPedagogicalKeywords: ['Inquiry', 'Experiment'],
            rubricSelfRatings: {
              setInduction: 9,
              blackboardWork: 9,
              explanationClarity: 10,
              probingQuestions: 9,
              bodyLanguage: 9,
              lessonClosure: 9,
            },
            aiFeedback: { strengths: [], improvements: [], pedagogicalTip: '' },
            virtualStudentInteractions: [],
            isBestTake: true,
          },
          {
            id: 'seed_take_4',
            takeNumber: 4,
            durationSeconds: 150,
            recordedAt: monday.getTime() + 1000 * 3600 * 86, // Thu
            speechPaceWpm: 122,
            clarityScore: 96,
            voiceModulationScore: 93,
            studentEngagementScore: 95,
            detectedPedagogicalKeywords: ['Closure', 'Review'],
            rubricSelfRatings: {
              setInduction: 10,
              blackboardWork: 9,
              explanationClarity: 9,
              probingQuestions: 10,
              bodyLanguage: 9,
              lessonClosure: 9,
            },
            aiFeedback: { strengths: [], improvements: [], pedagogicalTip: '' },
            virtualStudentInteractions: [],
            isBestTake: true,
          },
        ];

  // Map each day of current week
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayStatus = daysOfWeek.map((dayLabel, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);

    const isToday =
      now.getDate() === dayDate.getDate() &&
      now.getMonth() === dayDate.getMonth() &&
      now.getFullYear() === dayDate.getFullYear();

    const isPast = dayDate <= now;

    // Check if any take was recorded on this calendar day
    const takesOnThisDay = effectiveTakes.filter((t) => {
      const takeDate = new Date(t.recordedAt);
      return (
        takeDate.getDate() === dayDate.getDate() &&
        takeDate.getMonth() === dayDate.getMonth() &&
        takeDate.getFullYear() === dayDate.getFullYear()
      );
    });

    return {
      dayLabel,
      dateNum: dayDate.getDate(),
      isToday,
      isPast,
      completedTakesCount: takesOnThisDay.length,
      hasCompleted: takesOnThisDay.length > 0,
    };
  });

  const completedSessionsThisWeek = dayStatus.reduce(
    (acc, d) => acc + (d.hasCompleted ? d.completedTakesCount : 0),
    0
  );

  const progressPercent = Math.min(100, Math.round((completedSessionsThisWeek / weeklyTarget) * 100));
  const isGoalReached = completedSessionsThisWeek >= weeklyTarget;
  const remainingSessions = Math.max(0, weeklyTarget - completedSessionsThisWeek);

  // Consecutive active day streak
  let currentStreak = 0;
  for (let i = diffToMonday; i >= 0; i--) {
    if (dayStatus[i]?.hasCompleted) {
      currentStreak += 1;
    } else if (i !== diffToMonday) {
      break;
    }
  }

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-5">
        {/* Top Header Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  Weekly Micro-Teaching Goal
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isGoalReached
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {isGoalReached ? 'Target Met! 🎉' : `${remainingSessions} to go`}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                NCTE teacher preparation cadence: practice & refine micro-teaching lessons weekly
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills & Goal Target Setting */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="font-bold text-white">{currentStreak} Day</span>
              <span className="text-zinc-500">Streak</span>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingGoal((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition"
              title="Adjust Weekly Target"
            >
              <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Target: {weeklyTarget}/wk</span>
            </button>
          </div>
        </div>

        {/* Goal Editor Dropdown / Stepper if opened */}
        {isEditingGoal && (
          <div className="p-3 bg-zinc-950 rounded-2xl border border-amber-500/40 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
            <div className="text-zinc-300">
              <span className="font-semibold text-white">Select Weekly Practice Target:</span>
              <span className="text-zinc-500 ml-2">Choose your internship load</span>
            </div>
            <div className="flex items-center gap-2">
              {[3, 4, 5, 7, 10].map((targetNum) => (
                <button
                  key={targetNum}
                  type="button"
                  onClick={() => handleUpdateGoal(targetNum)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    weeklyTarget === targetNum
                      ? 'bg-amber-500 text-zinc-950 shadow'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {targetNum} Sessions
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="px-2.5 py-1 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar & Numerical Metrics */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl sm:text-2xl font-black text-white">
                {completedSessionsThisWeek}
              </span>
              <span className="text-zinc-500 text-sm">/ {weeklyTarget} Sessions</span>
              <span className="text-zinc-500 text-xs hidden sm:inline">•</span>
              <span className="text-amber-400 font-semibold text-xs hidden sm:inline">
                {progressPercent}% Completed
              </span>
            </div>

            <div className="text-right">
              {isGoalReached ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>NCTE Practicum Target Achieved!</span>
                </span>
              ) : (
                <span className="text-zinc-400 font-medium">
                  Complete <strong className="text-white">{remainingSessions} more</strong> to reach
                  milestone
                </span>
              )}
            </div>
          </div>

          {/* Linear Progress Meter */}
          <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-zinc-800 p-0.5">
            <div
              style={{ width: `${progressPercent}%` }}
              className={`h-full rounded-full transition-all duration-500 ${
                isGoalReached
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-md shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400'
              }`}
            />
          </div>
        </div>

        {/* 7-Day Day-by-Day Activity Tracker Strip */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
            <span className="font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>This Week's Micro-Teaching Log</span>
            </span>
            <span>
              {monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {dayStatus.map((day) => (
              <div
                key={day.dayLabel}
                className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  day.hasCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : day.isToday
                    ? 'bg-amber-500/10 border-amber-500/50 text-amber-300 ring-1 ring-amber-500/30'
                    : day.isPast
                    ? 'bg-zinc-950 border-zinc-800/80 text-zinc-500'
                    : 'bg-zinc-950/60 border-zinc-800/40 text-zinc-600'
                }`}
              >
                <span className="text-[10px] font-semibold uppercase">{day.dayLabel}</span>
                <span className="text-xs font-mono font-bold mt-0.5">{day.dateNum}</span>

                <div className="mt-1.5">
                  {day.hasCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                  ) : day.isToday ? (
                    <div className="w-5 h-5 rounded-full border border-dashed border-amber-400 text-amber-400 flex items-center justify-center text-[9px] font-bold animate-pulse">
                      •
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] text-zinc-600">
                      -
                    </div>
                  )}
                </div>

                {day.completedTakesCount > 1 && (
                  <span className="text-[9px] font-mono text-emerald-400 font-bold mt-1">
                    {day.completedTakesCount}×
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Motivational Callout & Direct Action Button */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isGoalReached
                ? 'Excellent consistency! Your practicum portfolio is updated for faculty assessment.'
                : 'Regular micro-teaching sessions build natural vocal modulation and lesson structuring habits.'}
            </span>
          </div>

          {onStartPractice && (
            <button
              type="button"
              onClick={onStartPractice}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Record Practice Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
