import React, { useState } from 'react';
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
  Trophy,
  Crown,
  ShieldCheck,
  Star,
  CheckCircle2,
  Lock,
  Filter,
  Download,
  FileText,
  Table,
  Check,
} from 'lucide-react';
import { ChapterTrophyBadge, LanguageCode, StudentDNA, UserProfile, ConceptMastery } from '../../types';
import { getLocalizedText } from '../../data/languages';
import { getStreakModifier } from '../../utils/masteryCalculator';
import { exportStudyProgressCSV, exportStudyProgressPDF } from '../../utils/exportUtils';
import { AchievementBadges } from '../profile/AchievementBadges';

interface StudentDNAViewProps {
  language: LanguageCode;
  profile: UserProfile;
  dna: StudentDNA;
  masteries?: Record<string, ConceptMastery>;
}

export const StudentDNAView: React.FC<StudentDNAViewProps> = ({
  language,
  profile,
  dna,
  masteries = {},
}) => {
  const [selectedTrophyFilter, setSelectedTrophyFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const handleExportPDF = () => {
    exportStudyProgressPDF(profile, dna, masteries);
    setExportFeedback('PDF report generated & downloaded successfully!');
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const handleExportCSV = () => {
    exportStudyProgressCSV(profile, dna, masteries);
    setExportFeedback('CSV study data backup downloaded successfully!');
    setTimeout(() => setExportFeedback(null), 4000);
  };

  const streakInfo = getStreakModifier(dna.consistencyStreak || profile.streakDays || 7);

  // Core Chapter Mastery Trophies Database
  const CHAPTER_TROPHIES: ChapterTrophyBadge[] = [
    {
      id: 'trophy_electricity_ohms_law',
      chapterId: 'ch_electricity_fundamentals',
      chapterTitle: {
        en: "Ohm's Law, Resistance & Joule Heating",
        hi: 'ओम का नियम, प्रतिरोध एवं विद्युत शक्ति',
        hinglish: "Ohm's Law, Resistance aur Heating",
      },
      subjectName: 'Physics (Class 10)',
      subjectColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      iconName: 'zap',
      tier: 'diamond',
      tierLabel: 'Diamond Master Trophy',
      masteryPercent: 96,
      unlockedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      criteriaDescription: 'Achieved ≥90% checkpoint mastery and 0 calculation errors in series-parallel circuit problems.',
      streakRequirementDays: 5,
    },
    {
      id: 'trophy_light_reflection_refraction',
      chapterId: 'ch_light_reflection_refraction',
      chapterTitle: {
        en: 'Light: Reflection, Refraction & Lens Power',
        hi: 'प्रकाश: परावर्तन, अपवर्तन एवं लेंस क्षमता',
        hinglish: 'Light: Ray Optics & Lens Formula',
      },
      subjectName: 'Physics (Class 10)',
      subjectColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      iconName: 'trophy',
      tier: 'platinum',
      tierLabel: 'Platinum Scholar Trophy',
      masteryPercent: 92,
      unlockedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
      criteriaDescription: 'Mastered Mirror formula 1/f = 1/v + 1/u, Cartesian sign convention, and Snell’s law.',
    },
    {
      id: 'trophy_chemical_reactions_equations',
      chapterId: 'ch_chemical_reactions',
      chapterTitle: {
        en: 'Chemical Reactions, Balancing & Redox',
        hi: 'रासायनिक अभिक्रियाएँ, समीकरण एवं रेडॉक्स',
        hinglish: 'Chemical Reactions & Redox Reactions',
      },
      subjectName: 'Chemistry (Class 10)',
      subjectColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      iconName: 'crown',
      tier: 'gold',
      tierLabel: 'Gold Mastery Trophy',
      masteryPercent: 90,
      unlockedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
      criteriaDescription: 'Exemplary stoichiometric mass balancing and oxidation-reduction classification.',
    },
    {
      id: 'trophy_quadratic_equations_roots',
      chapterId: 'ch_quadratic_equations',
      chapterTitle: {
        en: 'Quadratic Equations & Discriminant Nature',
        hi: 'द्विघात समीकरण एवं विविक्तकर (D)',
        hinglish: 'Quadratic Roots & Discriminant Analysis',
      },
      subjectName: 'Mathematics (Class 10)',
      subjectColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      iconName: 'award',
      tier: 'gold',
      tierLabel: 'Gold Mastery Trophy',
      masteryPercent: 91,
      unlockedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      criteriaDescription: 'Successfully derived and solved 20+ board exam quadratic problems with D ≥ 0.',
    },
    {
      id: 'trophy_life_processes_nutrition',
      chapterId: 'ch_life_processes',
      chapterTitle: {
        en: 'Life Processes: Nutrition, Respiration & Transport',
        hi: 'जैव प्रक्रम: पोषण, श्वसन एवं वहन तंत्र',
        hinglish: 'Life Processes: Human Physiology',
      },
      subjectName: 'Biology (Class 10)',
      subjectColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      iconName: 'shield_check',
      tier: 'in_progress',
      tierLabel: 'In-Progress (78%)',
      masteryPercent: 78,
      criteriaDescription: 'Target: Reach ≥90% checkpoint accuracy in Human Circulatory & Excretory System to unlock Gold Trophy.',
    },
    {
      id: 'trophy_laravel_architecture_eloquent',
      chapterId: 'ch_laravel_eloquent_architecture',
      chapterTitle: {
        en: 'Laravel Architecture, Service Providers & Eloquent N+1',
        hi: 'लारवेल आर्किटेक्चर एवं डेटाबेस अनुकूलन',
        hinglish: 'Laravel Architecture & Eloquent Optimization',
      },
      subjectName: 'Dev Prep (Full Stack)',
      subjectColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      iconName: 'star',
      tier: 'platinum',
      tierLabel: 'Staff-Architect Trophy',
      masteryPercent: 94,
      unlockedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      criteriaDescription: 'Achieved top marks in Staff Engineer system design and high-throughput query optimization.',
    },
  ];

  const filteredTrophies = CHAPTER_TROPHIES.filter((t) => {
    if (selectedTrophyFilter === 'unlocked') return t.tier !== 'in_progress';
    if (selectedTrophyFilter === 'in_progress') return t.tier === 'in_progress';
    return true;
  });

  const getTrophyIcon = (name: string, tier: string) => {
    const isUnlocked = tier !== 'in_progress';
    switch (name) {
      case 'zap':
        return <Zap className={`w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-zinc-500'}`} />;
      case 'crown':
        return <Crown className={`w-6 h-6 ${isUnlocked ? 'text-amber-300' : 'text-zinc-500'}`} />;
      case 'award':
        return <Award className={`w-6 h-6 ${isUnlocked ? 'text-purple-400' : 'text-zinc-500'}`} />;
      case 'shield_check':
        return <ShieldCheck className={`w-6 h-6 ${isUnlocked ? 'text-emerald-400' : 'text-zinc-500'}`} />;
      case 'star':
        return <Star className={`w-6 h-6 ${isUnlocked ? 'text-teal-300' : 'text-zinc-500'}`} />;
      case 'trophy':
      default:
        return <Trophy className={`w-6 h-6 ${isUnlocked ? 'text-yellow-400' : 'text-zinc-500'}`} />;
    }
  };

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

        {/* Data Portability & Export Controls */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export study progress, concept masteries & StudentDNA for offline backups or tutors:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 flex items-center gap-1.5 transition-all shadow-sm"
              title="Download print-friendly PDF report"
            >
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              <span>Export PDF Report</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/80 flex items-center gap-1.5 transition-all shadow-sm"
              title="Download CSV raw metrics table"
            >
              <Table className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV (Excel)</span>
            </button>
          </div>
        </div>

        {exportFeedback && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportFeedback}</span>
          </div>
        )}
      </div>

      {/* Daily Streak Cognitive Multiplier Boost Card */}
      <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-amber-950/30 border border-orange-500/30 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100">
                Active Streak Modifier: <span className="text-orange-400">{streakInfo.streakMultiplier}x Applied</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {streakInfo.streakDays} Days Consecutive
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Consistent daily practice has raised your Problem Solving Index and reduced your forgetting curve by <strong className="text-orange-300">+{streakInfo.cognitiveBoostPercent}%</strong>.
            </p>
          </div>
        </div>

        <div className="text-xs font-mono text-amber-300 bg-zinc-950/80 px-3.5 py-2 rounded-xl border border-zinc-800 self-start sm:self-center shrink-0">
          Shields: {streakInfo.freezeShieldsRemaining} Protected
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

      {/* Dynamic Achievement Badges (Mastery Thresholds & Consistency Milestones) */}
      <AchievementBadges
        profile={profile}
        dna={dna}
        masteries={masteries}
      />

      {/* Chapter Mastery Trophy Vault & Digital Badges Section */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Chapter Mastery Trophy Vault / विशिष्ट अध्याय ट्रॉफ़ी</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Digital trophies awarded when students cross the rigorous ≥90% checkpoint mastery threshold.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedTrophyFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedTrophyFilter === 'all'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({CHAPTER_TROPHIES.length})
            </button>
            <button
              onClick={() => setSelectedTrophyFilter('unlocked')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedTrophyFilter === 'unlocked'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unlocked (5)
            </button>
            <button
              onClick={() => setSelectedTrophyFilter('in_progress')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                selectedTrophyFilter === 'in_progress'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              In-Progress (1)
            </button>
          </div>
        </div>

        {/* Trophies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrophies.map((trophy) => {
            const isUnlocked = trophy.tier !== 'in_progress';
            return (
              <div
                key={trophy.id}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-amber-500/40 hover:border-amber-400 shadow-md'
                    : 'bg-zinc-950/60 border-zinc-800/80 opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner ${
                      isUnlocked
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-amber-500/10'
                        : 'bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    {getTrophyIcon(trophy.iconName, trophy.tier)}
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        trophy.tier === 'diamond'
                          ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                          : trophy.tier === 'platinum'
                          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                          : trophy.tier === 'gold'
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}
                    >
                      {trophy.tierLabel}
                    </span>
                    <span className="block text-xs font-mono font-bold text-zinc-300 mt-1">
                      {trophy.masteryPercent}% Mastery
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${trophy.subjectColor}`}>
                    {trophy.subjectName}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-100 leading-snug">
                    {getLocalizedText(trophy.chapterTitle, language)}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {trophy.criteriaDescription}
                  </p>
                </div>

                {/* Footer status */}
                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono">
                  {isUnlocked ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked Trophy</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Need ≥90% Mastery</span>
                    </span>
                  )}
                  {trophy.unlockedAt && (
                    <span className="text-zinc-500 text-[10px]">
                      {new Date(trophy.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
