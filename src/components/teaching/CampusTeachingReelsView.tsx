import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageSquare,
  Award,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  School,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Users,
  Video,
  ShieldCheck,
  Star,
  Eye,
  Info,
} from 'lucide-react';
import {
  TeachingReelPost,
  TraineeEvaluation,
  TraineeComment,
  UserModerationRecord,
} from '../../types/teaching';
import { ReelRubricJudgeModal } from './ReelRubricJudgeModal';
import { ReelCommentsDrawer } from './ReelCommentsDrawer';
import { CodeOfConductModal } from './CodeOfConductModal';
import { ModerationViolationAlertModal } from './ModerationViolationAlertModal';
import {
  recordModerationViolation,
  acceptCodeOfConductDisclaimer,
  resetModerationRecord,
} from '../../services/moderationService';
import {
  addReelEvaluation,
  addReelComment,
  toggleReelLike,
  toggleReelApplause,
} from '../../services/teachingStorageService';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface CampusTeachingReelsViewProps {
  reels: TeachingReelPost[];
  onUpdateReels: (reels: TeachingReelPost[]) => void;
  moderationRecord: UserModerationRecord;
  onUpdateModerationRecord: (record: UserModerationRecord) => void;
  onOpenStudio: () => void;
}

export const CampusTeachingReelsView: React.FC<CampusTeachingReelsViewProps> = ({
  reels,
  onUpdateReels,
  moderationRecord,
  onUpdateModerationRecord,
  onOpenStudio,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCampusFilter, setSelectedCampusFilter] = useState('all');
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');

  // Modals & Drawers state
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isViolationAlertOpen, setIsViolationAlertOpen] = useState(false);
  const [flaggedWords, setFlaggedWords] = useState<string[]>([]);
  const [violationReason, setViolationReason] = useState('');
  const [isLessonPlanOpen, setIsLessonPlanOpen] = useState(false);
  const [shareSuccessToast, setShareSuccessToast] = useState(false);

  // Playback Progress Simulation
  const [playbackProgress, setPlaybackProgress] = useState(0);

  // Filter reels based on campus or program
  const filteredReels = reels.filter((reel) => {
    const campusMatch =
      selectedCampusFilter === 'all' ||
      reel.collegeCampus.toLowerCase().includes(selectedCampusFilter.toLowerCase());
    const programMatch =
      selectedProgramFilter === 'all' || reel.traineeProgram === selectedProgramFilter;
    return campusMatch && programMatch;
  });

  const activeReel: TeachingReelPost | undefined = filteredReels[currentIndex] || reels[0];

  // Auto playback simulation loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeReel) {
      interval = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            return 0; // loop reel
          }
          return prev + 1.2;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeReel]);

  // Keyboard navigation (ArrowUp, ArrowDown, Space to pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentsOpen || isJudgeModalOpen || isDisclaimerOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNextReel();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrevReel();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredReels.length, isCommentsOpen, isJudgeModalOpen, isDisclaimerOpen]);

  const handleNextReel = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setPlaybackProgress(0);
      setIsPlaying(true);
    } else {
      // Loop back to start
      setCurrentIndex(0);
      setPlaybackProgress(0);
    }
  };

  const handlePrevReel = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setPlaybackProgress(0);
      setIsPlaying(true);
    }
  };

  const handleLike = (reelId: string) => {
    const updated = toggleReelLike(reelId);
    onUpdateReels(updated);
    playMasteryPopSound(true);
  };

  const handleApplause = (reelId: string) => {
    const updated = toggleReelApplause(reelId);
    onUpdateReels(updated);
    playMasteryPopSound(true);
  };

  const handleShare = () => {
    setShareSuccessToast(true);
    setTimeout(() => setShareSuccessToast(false), 3000);
  };

  // Submit formal evaluation from Colleague, Teacher, or Official Judge
  const handleSubmitEvaluation = (evaluation: TraineeEvaluation) => {
    if (!activeReel) return;
    const updated = addReelEvaluation(activeReel.id, evaluation);
    onUpdateReels(updated);
    playMasteryPopSound(true);
  };

  // Submit comment
  const handleAddComment = (comment: TraineeComment) => {
    if (!activeReel) return;
    const updated = addReelComment(activeReel.id, comment);
    onUpdateReels(updated);
    playMasteryPopSound(true);
  };

  // Content Moderation & Abuse Trap Handler
  const handleFlagViolation = (blockedText: string, words: string[]) => {
    const { record, isNowBanned } = recordModerationViolation(
      moderationRecord.userId,
      blockedText,
      words,
      'abusive_comment'
    );
    onUpdateModerationRecord(record);
    setFlaggedWords(words);
    setViolationReason(
      `Your comment contained inappropriate or abusive language. Under campus ethics rules, respect for apprentice educators is mandatory.`
    );
    setIsViolationAlertOpen(true);
  };

  const handleAcceptDisclaimer = () => {
    const record = acceptCodeOfConductDisclaimer(moderationRecord.userId);
    onUpdateModerationRecord(record);
  };

  const handleResetRecordForTesting = () => {
    const record = resetModerationRecord(moderationRecord.userId);
    onUpdateModerationRecord(record);
  };

  if (!activeReel) {
    return (
      <div className="text-center py-20 text-zinc-400 max-w-md mx-auto space-y-4">
        <GraduationCap className="w-12 h-12 mx-auto text-amber-400" />
        <h3 className="text-lg font-bold text-white">No Teaching Reels Found</h3>
        <p className="text-xs">Try resetting your campus or program filters, or record your first micro-teaching take!</p>
        <button
          type="button"
          onClick={onOpenStudio}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs uppercase"
        >
          Open AI Teaching Studio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12">
      {/* Top Header & Campus Filters Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              Campus Micro-Teaching Reels
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                Reel {currentIndex + 1} of {filteredReels.length}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Flowing one-by-one • Evaluated by colleagues, teachers & certified judges
            </p>
          </div>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Program Filter */}
          <select
            value={selectedProgramFilter}
            onChange={(e) => {
              setSelectedProgramFilter(e.target.value);
              setCurrentIndex(0);
            }}
            className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 py-2 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Programs</option>
            <option value="b_ed">👩‍🏫 B.Ed Interns</option>
            <option value="btc_deled">🎒 BTC / D.El.Ed Trainees</option>
            <option value="iti_trainer">👨‍🔧 ITI Instructors</option>
          </select>

          {/* Record CTA */}
          <button
            type="button"
            onClick={onOpenStudio}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20"
          >
            <Video className="w-4 h-4" />
            <span>Record Your Take</span>
          </button>
        </div>
      </div>

      {/* Main Single Reel Vertical Canvas (Flows like Reels) */}
      <div className="relative flex justify-center items-center">
        {/* Navigation Floating Buttons (Desktop) */}
        <div className="hidden md:flex flex-col items-center gap-3 absolute -left-16 top-1/2 -translate-y-1/2 z-20">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevReel}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition border shadow-xl ${
              currentIndex === 0
                ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Previous Teaching Reel (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <span className="text-[11px] font-bold text-zinc-400 font-mono">
            {currentIndex + 1}/{filteredReels.length}
          </span>

          <button
            type="button"
            disabled={currentIndex === filteredReels.length - 1}
            onClick={handleNextReel}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition border shadow-xl ${
              currentIndex === filteredReels.length - 1
                ? 'bg-zinc-900/40 border-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Next Teaching Reel (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Central Vertical Reel Card */}
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative aspect-[9/16] min-h-[580px] max-h-[740px] flex flex-col justify-between">
          {/* Top Reel Header Bar (Overlaid on Video) */}
          <div className="absolute top-0 inset-x-0 p-4 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shadow-md">
                {activeReel.traineeAvatar}
              </span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-tight">
                    {activeReel.traineeName}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    {activeReel.traineeProgram.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-300 truncate max-w-[180px]">
                  {activeReel.collegeCampus}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            </div>
          </div>

          {/* Micro-Teaching Simulation Stage / Video Canvas */}
          <div
            onClick={() => setIsPlaying((prev) => !prev)}
            className="flex-1 w-full h-full relative cursor-pointer flex flex-col justify-center items-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-4 select-none"
          >
            {/* Realistic Blackboard Display */}
            <div className="w-full bg-emerald-950/70 border-2 border-emerald-800/80 rounded-2xl p-4 shadow-2xl mb-4 text-emerald-100">
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 border-b border-emerald-800/60 pb-1 mb-2">
                <span>PRACTICUM SMARTBOARD</span>
                <span>{activeReel.targetClass}</span>
              </div>
              <h5 className="text-sm font-black text-emerald-200">{activeReel.topicTitle}</h5>
              <div className="mt-2 space-y-1 text-xs text-emerald-300/90 font-mono">
                {activeReel.blackboardKeyNotes.slice(0, 3).map((note, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">▶</span>
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Presenter Avatar with Active Mic Ripple */}
            <div className="relative my-auto">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-2xl shadow-amber-500/20">
                <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center text-4xl">
                  {activeReel.traineeAvatar}
                </div>
              </div>
              {isPlaying && (
                <div className="absolute -inset-2 rounded-full border-2 border-amber-400/40 animate-ping pointer-events-none" />
              )}
            </div>

            {/* Live Audio Waveform & Speech Monitor */}
            <div className="flex items-center gap-1 h-5 mt-2">
              {[8, 18, 12, 22, 14, 20, 16, 24, 10, 19, 15].map((h, i) => (
                <span
                  key={i}
                  style={{ height: isPlaying ? `${h}px` : '4px' }}
                  className="w-1 bg-amber-400/80 rounded-full transition-all duration-200"
                />
              ))}
            </div>

            {/* Tap to Pause/Play Centered Indicator */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-10">
                <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl">
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </div>
              </div>
            )}
          </div>

          {/* Right Floating Reels Action Bar */}
          <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-3">
            {/* Like */}
            <button
              type="button"
              onClick={() => handleLike(activeReel.id)}
              className="group flex flex-col items-center gap-1 text-white hover:scale-110 transition"
              title="Applaud / Like"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:border-rose-500 group-hover:bg-rose-500/20 transition shadow-lg">
                <Heart className="w-5 h-5 group-hover:text-rose-400" />
              </div>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.likesCount}</span>
            </button>

            {/* Official Rubrics Judge / Grade */}
            <button
              type="button"
              onClick={() => setIsJudgeModalOpen(true)}
              className="group flex flex-col items-center gap-1 text-white hover:scale-110 transition"
              title="Evaluate Micro-Teaching Rubrics (Colleagues, Teachers & Judges)"
            >
              <div className="w-11 h-11 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center border-2 border-white shadow-xl shadow-amber-500/40">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-amber-300 drop-shadow">
                {activeReel.rubricAverages.overallAverage} ⭐
              </span>
            </button>

            {/* Peer Comments & Feedback */}
            <button
              type="button"
              onClick={() => setIsCommentsOpen(true)}
              className="group flex flex-col items-center gap-1 text-white hover:scale-110 transition"
              title="Peer Comments & Constructive Suggestions"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:border-amber-400 transition shadow-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold drop-shadow">{activeReel.comments.length}</span>
            </button>

            {/* Lesson Plan Info Sheet */}
            <button
              type="button"
              onClick={() => setIsLessonPlanOpen((prev) => !prev)}
              className="group flex flex-col items-center gap-1 text-white hover:scale-110 transition"
              title="Lesson Plan & Objectives"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:border-blue-400 transition shadow-lg">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium drop-shadow">Plan</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="group flex flex-col items-center gap-1 text-white hover:scale-110 transition"
              title="Share Reel Link"
            >
              <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/20 transition shadow-lg">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium drop-shadow">Share</span>
            </button>
          </div>

          {/* Bottom Info Overlay (Trainee details, Skill tag, Objectives) */}
          <div className="absolute bottom-0 inset-x-0 p-4 z-20 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase tracking-wider">
                Skill: {activeReel.skillFocus.replace('_', ' ')}
              </span>
              <span className="text-[10px] text-zinc-300 font-medium">
                {activeReel.subject}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
              {activeReel.topicTitle}
            </h3>

            {/* Rubric Score Pill */}
            <div className="flex items-center gap-3 text-[11px] text-zinc-300 pt-1">
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{activeReel.rubricAverages.overallAverage} / 10 Score</span>
              </div>
              <span>•</span>
              <span>{activeReel.evaluations.length} Evaluations</span>
              <span>•</span>
              <span>{activeReel.bestTakeStats.speechPaceWpm} WPM Pace</span>
            </div>

            {/* Reel Scrub Progress Bar */}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-2">
              <div
                style={{ width: `${playbackProgress}%` }}
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slide-out Lesson Plan Sheet */}
      {isLessonPlanOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-zinc-900/98 backdrop-blur-xl border-r border-zinc-800 p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 text-zinc-100">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white">Lesson Plan Details</h3>
            </div>
            <button
              type="button"
              onClick={() => setIsLessonPlanOpen(false)}
              className="text-zinc-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-zinc-400 block font-semibold mb-1">Topic Title</span>
              <p className="text-zinc-200 font-medium">{activeReel.topicTitle}</p>
            </div>

            <div>
              <span className="text-zinc-400 block font-semibold mb-1">Target Class & Skill</span>
              <p className="text-zinc-200">{activeReel.targetClass} • {activeReel.skillFocus}</p>
            </div>

            <div>
              <span className="text-zinc-400 block font-semibold mb-1">Learning Objectives</span>
              <ul className="list-disc list-inside space-y-1 text-zinc-300">
                {activeReel.lessonObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-zinc-400 block font-semibold mb-1">Blackboard Key Notes</span>
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-emerald-300 font-mono text-[11px]">
                {activeReel.blackboardKeyNotes.map((note, i) => (
                  <div key={i}>• {note}</div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-zinc-400 block font-semibold mb-1">Trainee Best Session Stats</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="text-base font-bold text-amber-400">{activeReel.bestTakeStats.speechPaceWpm}</div>
                  <div className="text-[10px] text-zinc-500">WPM Speech Pace</div>
                </div>
                <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                  <div className="text-base font-bold text-emerald-400">{activeReel.bestTakeStats.clarityScore}%</div>
                  <div className="text-[10px] text-zinc-500">Clarity Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Toast */}
      {shareSuccessToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2 text-xs animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4" />
          <span>Reel link copied to clipboard! Shared with college campus.</span>
        </div>
      )}

      {/* Official Judging Rubrics Modal */}
      <ReelRubricJudgeModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        reel={activeReel}
        onSubmitEvaluation={handleSubmitEvaluation}
        onFlagViolation={handleFlagViolation}
      />

      {/* Peer Comments & Feedback Drawer */}
      <ReelCommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        reel={activeReel}
        moderationRecord={moderationRecord}
        onAddComment={handleAddComment}
        onTriggerDisclaimer={() => setIsDisclaimerOpen(true)}
        onFlagViolation={handleFlagViolation}
      />

      {/* Mandatory Respect & Code of Conduct Disclaimer Modal */}
      <CodeOfConductModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleAcceptDisclaimer}
        moderationRecord={moderationRecord}
      />

      {/* Inappropriate / Abusive Content Violation Alert Modal */}
      <ModerationViolationAlertModal
        isOpen={isViolationAlertOpen}
        onClose={() => setIsViolationAlertOpen(false)}
        flaggedWords={flaggedWords}
        reason={violationReason}
        moderationRecord={moderationRecord}
        onResetRecordForTesting={handleResetRecordForTesting}
      />
    </div>
  );
};
