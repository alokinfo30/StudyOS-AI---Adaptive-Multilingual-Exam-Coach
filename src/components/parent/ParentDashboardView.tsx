import React, { useState } from 'react';
import {
  UserCheck,
  Flame,
  Clock,
  Target,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  HeartHandshake,
  Brain,
  Smartphone,
  Send,
  Sparkles,
} from 'lucide-react';
import { ConceptMastery, LanguageCode, StudentDNA, UserProfile } from '../../types';
import { ParentMobileReportModal } from './ParentMobileReportModal';

interface ParentDashboardViewProps {
  language: LanguageCode;
  profile: UserProfile;
  dna: StudentDNA;
  masteries: Record<string, ConceptMastery>;
  onSwitchToStudentMode: () => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const ParentDashboardView: React.FC<ParentDashboardViewProps> = ({
  profile,
  dna,
  masteries,
  onSwitchToStudentMode,
  onUpdateProfile,
}) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleUpdatePhone = (phone: string, name: string) => {
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        parentPhone: phone,
        parentName: name,
      });
    }
  };

  const masteryArray = Object.values(masteries) as ConceptMastery[];
  const avgMastery =
    masteryArray.length > 0
      ? Math.round(
          masteryArray.reduce((acc, m) => acc + (m.overallMastery || 0), 0) / masteryArray.length
        )
      : 78;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-purple-900/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold uppercase rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Parent Transparency Mode / अभिभावक डैशबोर्ड
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 font-sans">
              {profile.name}’s Learning Analytics & Progress
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
              Objective cognitive data on consistency, concept mastery, and exam readiness for {profile.selectedExam.replace('_', ' ')} ({profile.selectedBoard || 'CBSE'} Board).
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Direct Mobile Report Trigger */}
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center gap-2 shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Send Report to Mobile 📲</span>
            </button>

            <button
              onClick={onSwitchToStudentMode}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-purple-500 text-zinc-950 hover:bg-purple-400 transition-all self-start sm:self-auto"
            >
              Switch to Student Workspace ➔
            </button>
          </div>
        </div>
      </div>

      {/* Consistency Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Study Streak</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 font-mono">{profile.streakDays} Consecutive Days</p>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Total Study Time</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100 font-mono">{dna.totalHoursStudied} Hours</p>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Question Accuracy</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-mono">{dna.questionAccuracy}%</p>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            <span>Average Mastery</span>
          </div>
          <p className="text-2xl font-bold text-amber-400 font-mono">{avgMastery}% / 90%</p>
        </div>
      </div>

      {/* Quick Mobile Report Dispatch Strip */}
      <div className="p-4 bg-zinc-900 border border-emerald-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            📱
          </div>
          <div>
            <div className="text-xs font-bold text-zinc-100">
              Direct Parent WhatsApp / SMS Notification Active
            </div>
            <div className="text-[11px] text-zinc-400">
              Linked phone: <strong className="text-emerald-400 font-mono">{profile.parentPhone || '+919876543210'}</strong> ({profile.parentName || 'Guardian'})
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Dispatch Instant Report</span>
        </button>
      </div>

      {/* Parent Guidance & Actionable Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Constructive Advice */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-purple-400">
            <HeartHandshake className="w-5 h-5" />
            <h3 className="text-sm font-bold text-zinc-100">AI Parenting Recommendations</h3>
          </div>
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
              <span className="font-bold text-zinc-200 block">✨ What to Praise:</span>
              <p>{profile.name} has maintained a steady {profile.streakDays}-day consistency streak and solves physics questions with {dna.questionAccuracy}% accuracy on first attempt.</p>
            </div>
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 space-y-1">
              <span className="font-bold text-zinc-200 block">💡 How to Support at Home:</span>
              <p>Rather than asking for 4 hours of extra textbook reading, ensure he spends 15 uninterrupted minutes on spaced recall flashcards every evening.</p>
            </div>
          </div>
        </div>

        {/* Priority Focus Areas */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-bold text-zinc-100">Subject Health Check</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Physics (Electricity & Circuits)</p>
                <p className="text-[10px] text-emerald-400 font-mono">Strong Grip (92% Mastery)</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">Excellent</span>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Electrostatics & Charges</p>
                <p className="text-[10px] text-rose-400 font-mono">Needs revision on Coulomb’s Law</p>
              </div>
              <span className="text-xs font-bold text-rose-400 font-mono">Attention</span>
            </div>

            <div className="p-3.5 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-zinc-200">Mathematics (Quadratic Equations)</p>
                <p className="text-[10px] text-amber-400 font-mono">Good understanding, minor sign errors</p>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">Moderate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Parent Report Dispatch Modal */}
      <ParentMobileReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        profile={profile}
        dna={dna}
        masteries={masteries}
        onUpdateParentPhone={handleUpdatePhone}
      />
    </div>
  );
};
