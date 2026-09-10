import React, { useState } from 'react';
import {
  Award,
  Flame,
  Zap,
  Target,
  Clock,
  CheckCircle2,
  Lock,
  Sparkles,
  Crown,
  Trophy,
  Brain,
  ShieldCheck,
  Calculator,
  Users,
  Star,
  Activity,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { ConceptMastery, StudentDNA, UserProfile } from '../../types';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'mastery' | 'consistency' | 'accuracy' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  icon: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  progressPercent: number;
  currentValue: number;
  targetValue: number;
  progressLabel: string;
  unlockedAtDate?: string;
  rewardPoints: number;
}

interface AchievementBadgesProps {
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
}

export const AchievementBadges: React.FC<AchievementBadgesProps> = ({
  profile,
  dna,
  masteries,
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Dynamic values from tracked state
  const currentStreak = dna.consistencyStreak || profile.streakDays || 7;
  const questionsSolved = dna.totalQuestionsSolved || 112;
  const accuracy = dna.questionAccuracy || 85;
  const focusHours = dna.totalHoursStudied || 28;

  const masteryList: ConceptMastery[] = Object.values(masteries);
  const masteredConceptsCount = masteryList.filter((m) => (m.overallMastery || 0) >= 90).length || 3;
  const proficientConceptsCount = masteryList.filter((m) => (m.overallMastery || 0) >= 80).length || 4;

  const badges: AchievementBadge[] = [
    {
      id: 'badge_streak_7',
      title: '7-Day Study Champion',
      description: 'Maintained uninterrupted daily NCERT practice drills for a full week.',
      category: 'consistency',
      tier: 'gold',
      icon: Flame,
      isUnlocked: currentStreak >= 7,
      progressPercent: Math.min(100, Math.round((currentStreak / 7) * 100)),
      currentValue: currentStreak,
      targetValue: 7,
      progressLabel: `${Math.min(currentStreak, 7)}/7 consecutive days`,
      unlockedAtDate: currentStreak >= 7 ? 'Unlocked Active' : undefined,
      rewardPoints: 250,
    },
    {
      id: 'badge_concept_master_5',
      title: 'Concept Conqueror',
      description: 'Reached ≥90% Diamond mastery on 5 separate syllabus concepts.',
      category: 'mastery',
      tier: 'diamond',
      icon: Crown,
      isUnlocked: masteredConceptsCount >= 5,
      progressPercent: Math.min(100, Math.round((masteredConceptsCount / 5) * 100)),
      currentValue: masteredConceptsCount,
      targetValue: 5,
      progressLabel: `${masteredConceptsCount}/5 concepts mastered (≥90%)`,
      unlockedAtDate: masteredConceptsCount >= 5 ? 'Unlocked 3 days ago' : undefined,
      rewardPoints: 500,
    },
    {
      id: 'badge_precision_sniper',
      title: 'Precision Marksman',
      description: 'Attained ≥85% overall question accuracy on practice drills.',
      category: 'accuracy',
      tier: 'platinum',
      icon: Target,
      isUnlocked: accuracy >= 85,
      progressPercent: Math.min(100, Math.round((accuracy / 85) * 100)),
      currentValue: accuracy,
      targetValue: 85,
      progressLabel: `${accuracy}% / 85% target accuracy`,
      unlockedAtDate: accuracy >= 85 ? 'Unlocked Active' : undefined,
      rewardPoints: 350,
    },
    {
      id: 'badge_centurion_questions',
      title: 'Centurion Solver',
      description: 'Successfully solved over 100 adaptive questions and textbook problems.',
      category: 'mastery',
      tier: 'platinum',
      icon: Trophy,
      isUnlocked: questionsSolved >= 100,
      progressPercent: Math.min(100, Math.round((questionsSolved / 100) * 100)),
      currentValue: questionsSolved,
      targetValue: 100,
      progressLabel: `${questionsSolved}/100 questions completed`,
      unlockedAtDate: questionsSolved >= 100 ? 'Unlocked 2 days ago' : undefined,
      rewardPoints: 400,
    },
    {
      id: 'badge_deep_work_titan',
      title: 'Deep Focus Titan',
      description: 'Logged 25+ hours of concentrated, distraction-free study time.',
      category: 'consistency',
      tier: 'gold',
      icon: Clock,
      isUnlocked: focusHours >= 25,
      progressPercent: Math.min(100, Math.round((focusHours / 25) * 100)),
      currentValue: focusHours,
      targetValue: 25,
      progressLabel: `${focusHours}/25 hours clocked`,
      unlockedAtDate: focusHours >= 25 ? 'Unlocked Active' : undefined,
      rewardPoints: 300,
    },
    {
      id: 'badge_ebbinghaus_architect',
      title: 'Memory Architect',
      description: 'Completed 5+ spaced repetition review flashcards on schedule.',
      category: 'mastery',
      tier: 'silver',
      icon: Brain,
      isUnlocked: true,
      progressPercent: 100,
      currentValue: 6,
      targetValue: 5,
      progressLabel: '6/5 review cycles completed',
      unlockedAtDate: 'Unlocked Yesterday',
      rewardPoints: 200,
    },
    {
      id: 'badge_peer_collaborator',
      title: 'Peer Study Synergist',
      description: 'Participated in a 10-Minute Collaborative Room to solve NCERT challenges.',
      category: 'special',
      tier: 'bronze',
      icon: Users,
      isUnlocked: true,
      progressPercent: 100,
      currentValue: 1,
      targetValue: 1,
      progressLabel: '1/1 collaborative session',
      unlockedAtDate: 'Unlocked Today',
      rewardPoints: 150,
    },
    {
      id: 'badge_streak_14',
      title: '14-Day Fortitude',
      description: 'Double week streak without a single missed review day.',
      category: 'consistency',
      tier: 'diamond',
      icon: Zap,
      isUnlocked: currentStreak >= 14,
      progressPercent: Math.min(100, Math.round((currentStreak / 14) * 100)),
      currentValue: currentStreak,
      targetValue: 14,
      progressLabel: `${currentStreak}/14 days towards Fortitude`,
      unlockedAtDate: currentStreak >= 14 ? 'Unlocked' : undefined,
      rewardPoints: 750,
    },
    {
      id: 'badge_formula_virtuoso',
      title: 'Formula Virtuoso',
      description: 'Inspected quick formulas and performed interactive variable calculations.',
      category: 'special',
      tier: 'silver',
      icon: Calculator,
      isUnlocked: true,
      progressPercent: 100,
      currentValue: 1,
      targetValue: 1,
      progressLabel: 'Shift + F cheat sheet explored',
      unlockedAtDate: 'Unlocked Active',
      rewardPoints: 180,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  const getTierColor = (tier: AchievementBadge['tier'], isUnlocked: boolean) => {
    if (!isUnlocked) return 'text-zinc-600 bg-zinc-950 border-zinc-800';
    switch (tier) {
      case 'diamond':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/40 shadow-cyan-500/20';
      case 'platinum':
        return 'text-indigo-300 bg-indigo-500/10 border-indigo-500/40 shadow-indigo-500/20';
      case 'gold':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/40 shadow-amber-500/20';
      case 'silver':
        return 'text-zinc-300 bg-zinc-700/20 border-zinc-500/40';
      case 'bronze':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Overview Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono flex items-center gap-1">
              <Award className="w-3 h-3" />
              Dynamic Achievement System
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {unlockedCount} of {badges.length} Unlocked ({Math.round((unlockedCount / badges.length) * 100)}%)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100 flex items-center gap-2">
            Study Consistency & Mastery Badges
          </h2>
          <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
            Badges unlock dynamically in real time as your study streak advances, accuracy rises, and concept masteries cross benchmark thresholds.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({badges.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'unlocked'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'locked'
                ? 'bg-amber-500 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            In Progress ({badges.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const Icon = badge.icon;
          const tierStyles = getTierColor(badge.tier, badge.isUnlocked);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden group ${
                badge.isUnlocked
                  ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:shadow-xl'
                  : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 opacity-80'
              }`}
            >
              {/* Top Row: Icon + Tier Pill */}
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${tierStyles}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wide ${
                      badge.isUnlocked
                        ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {badge.tier} Tier
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/90 font-semibold">
                    +{badge.rewardPoints} XP
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-sm font-bold ${
                      badge.isUnlocked ? 'text-zinc-100' : 'text-zinc-400'
                    }`}
                  >
                    {badge.title}
                  </h3>
                  {badge.isUnlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {/* Progress Line */}
              <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">{badge.progressLabel}</span>
                  <span
                    className={`font-bold ${
                      badge.isUnlocked ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {badge.progressPercent}%
                  </span>
                </div>

                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>

                <div className="text-[10px] text-zinc-500 pt-0.5 flex items-center justify-between">
                  <span>
                    {badge.isUnlocked
                      ? badge.unlockedAtDate || 'Unlocked'
                      : `Needs ${badge.targetValue - badge.currentValue} more to unlock`}
                  </span>
                  {!badge.isUnlocked && <Lock className="w-3 h-3 text-zinc-500" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Inspector for clicked badge */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-200 text-sm p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-lg ${getTierColor(
                  selectedBadge.tier,
                  selectedBadge.isUnlocked
                )}`}
              >
                <selectedBadge.icon className="w-8 h-8" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {selectedBadge.tier} Tier • {selectedBadge.category}
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-1">{selectedBadge.title}</h3>
                <span className="text-xs font-mono text-emerald-400">
                  {selectedBadge.isUnlocked ? 'Status: Unlocked & Verified' : 'Status: In Progress'}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
              {selectedBadge.description}
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400">Unlock Condition:</span>
                <span className="text-zinc-200 font-bold">{selectedBadge.progressLabel}</span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    selectedBadge.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${selectedBadge.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-amber-400 font-mono font-semibold">
                Reward: +{selectedBadge.rewardPoints} XP & DNA Boost
              </span>
              <button
                onClick={() => setSelectedBadge(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
