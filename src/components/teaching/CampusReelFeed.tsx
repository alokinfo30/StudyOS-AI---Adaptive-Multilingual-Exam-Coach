import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageSquare,
  Share2,
  Award,
  ChevronUp,
  ChevronDown,
  Sparkles,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Building2,
  SlidersHorizontal,
  Clock,
  ExternalLink,
  Flame,
  ThumbsUp,
  Filter,
  Tag,
  Search,
  Lock,
  Globe,
} from 'lucide-react';
import {
  TeachingReelPost,
  TeacherTrainingProgram,
  JudgeRole,
  TraineeEvaluation,
  TraineeComment,
  SegmentFeedback,
  UserModerationRecord,
} from '../../types/teaching';
import {
  loadCampusReels,
  saveCampusReels,
  toggleReelLike,
  toggleReelApplause,
  addReelComment,
  addReelSegmentFeedback,
  toggleCommentLike,
  toggleCommentMarkHelpful,
  toggleSegmentFeedbackLike,
  toggleSegmentFeedbackHelpful,
} from '../../services/teachingStorageService';
import {
  getUserModerationRecord,
  recordModerationViolation,
  acceptCodeOfConductDisclaimer,
} from '../../services/moderationService';
import { playMasteryPopSound } from '../../utils/audioEffects';
import { ReelCommentsDrawer } from './ReelCommentsDrawer';
import { PeerEvaluation } from './PeerEvaluation';
import { CodeOfConductModal } from './CodeOfConductModal';
import { ModerationViolationAlertModal } from './ModerationViolationAlertModal';
import { ReelSentimentOverlay } from './ReelSentimentOverlay';
import { analyzeReelSentiment } from '../../services/reelSentimentService';

interface CampusReelFeedProps {
  initialReels?: TeachingReelPost[];
  onOpenStudio?: () => void;
}

export const CampusReelFeed: React.FC<CampusReelFeedProps> = ({
  initialReels,
  onOpenStudio,
}) => {
  // Reels Data
  const [reels, setReels] = useState<TeachingReelPost[]>(() => {
    return initialReels && initialReels.length > 0 ? initialReels : loadCampusReels();
  });

  // Active Reel Index in vertical snap scroll
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter by Program
  const [programFilter, setProgramFilter] = useState<'all' | TeacherTrainingProgram>('all');

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const reelContainerRef = useRef<HTMLDivElement | null>(null);

  // Modals & Drawers
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isPeerEvaluationOpen, setIsPeerEvaluationOpen] = useState(false);
  const [isLessonPlanOpen, setIsLessonPlanOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);
  const [isSentimentOverlayOpen, setIsSentimentOverlayOpen] = useState(false);
  const [violationAlert, setViolationAlert] = useState<{
    isOpen: boolean;
    text: string;
    words: string[];
    record: UserModerationRecord;
  } | null>(null);

  // Share Toast
  const [shareToast, setShareToast] = useState<string | null>(null);

  // User Moderation Record
  const [moderationRecord, setModerationRecord] = useState<UserModerationRecord>(() =>
    getUserModerationRecord()
  );

  // Topic Tag Filter & Search
  const [topicFilter, setTopicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract all distinct topic tags across reels
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    reels.forEach((r) => {
      if (r.topicTags) {
        r.topicTags.forEach((t) => set.add(t));
      }
      if (r.subject) set.add(r.subject);
    });
    return Array.from(set);
  }, [reels]);

  // Filtered Reels by Program, Topic Tag, and Search
  const filteredReels = reels.filter((r) => {
    if (programFilter !== 'all' && r.traineeProgram !== programFilter) return false;
    if (topicFilter !== 'all') {
      const matchTag =
        r.topicTags?.some((t) => t.toLowerCase() === topicFilter.toLowerCase()) ||
        r.subject.toLowerCase() === topicFilter.toLowerCase();
      if (!matchTag) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        r.topicTitle.toLowerCase().includes(q) ||
        r.traineeName.toLowerCase().includes(q) ||
        r.subject.toLowerCase().includes(q) ||
        r.collegeCampus.toLowerCase().includes(q) ||
        r.topicTags?.some((t) => t.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }
    return true;
  });

  const activeReel = filteredReels[currentIndex] || filteredReels[0];

  // Refresh reels when initialReels changes
  useEffect(() => {
    if (initialReels && initialReels.length > 0) {
      setReels(initialReels);
    }
  }, [initialReels]);

  // Handle scroll snap detection
  const handleScroll = () => {
    if (!reelContainerRef.current) return;
    const { scrollTop, clientHeight } = reelContainerRef.current;
    const newIdx = Math.round(scrollTop / clientHeight);
    if (newIdx !== currentIndex && newIdx >= 0 && newIdx < filteredReels.length) {
      setCurrentIndex(newIdx);
      setCurrentPlaybackTime(0);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation for Up/Down arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentsOpen || isPeerEvaluationOpen) return;

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        scrollToIndex(currentIndex + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        scrollToIndex(currentIndex - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm') {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCommentsOpen, isPeerEvaluationOpen, filteredReels.length]);

  const scrollToIndex = (idx: number) => {
    if (idx < 0 || idx >= filteredReels.length) return;
    if (reelContainerRef.current) {
      const targetScroll = idx * reelContainerRef.current.clientHeight;
      reelContainerRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setCurrentIndex(idx);
      setCurrentPlaybackTime(0);
      setIsPlaying(true);
    }
  };

  // Play / Pause active reel video
  const togglePlayPause = () => {
    if (!activeReel) return;
    const videoEl = videoRefs.current[activeReel.id];
    if (videoEl) {
      if (isPlaying) {
        videoEl.pause();
        setIsPlaying(false);
      } else {
        videoEl.play();
        setIsPlaying(true);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  // Simulation timer for reels without real video blob
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && activeReel && !activeReel.videoBlobUrl) {
      interval = setInterval(() => {
        setCurrentPlaybackTime((prev) => {
          if (prev >= activeReel.durationSeconds) {
            return 0; // loop
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeReel]);

  // Video timeupdate
  const handleVideoTimeUpdate = (reelId: string) => {
    const videoEl = videoRefs.current[reelId];
    if (videoEl) {
      setCurrentPlaybackTime(videoEl.currentTime);
    }
  };

  // Seek video to specific timestamp (from PeerEvaluation)
  const handleSeekToTimestamp = (seconds: number) => {
    if (!activeReel) return;
    const videoEl = videoRefs.current[activeReel.id];
    if (videoEl) {
      videoEl.currentTime = seconds;
      videoEl.play();
      setIsPlaying(true);
    }
    setCurrentPlaybackTime(seconds);
  };

  // Likes & Applause
  const handleLike = (reelId: string) => {
    const updated = toggleReelLike(reelId);
    setReels(updated);
    playMasteryPopSound(true);
  };

  const handleApplause = (reelId: string) => {
    const updated = toggleReelApplause(reelId);
    setReels(updated);
    playMasteryPopSound(true);
  };

  // Comments
  const handleAddComment = (comment: TraineeComment) => {
    if (!activeReel) return;
    const updated = addReelComment(activeReel.id, comment);
    setReels(updated);
  };

  // Segment Feedback
  const handleAddSegmentFeedback = (feedback: SegmentFeedback) => {
    if (!activeReel) return;
    const updated = addReelSegmentFeedback(activeReel.id, feedback);
    setReels(updated);
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (!activeReel) return;
    const updated = toggleCommentLike(activeReel.id, commentId, moderationRecord.userId);
    setReels(updated);
  };

  const handleToggleCommentMarkHelpful = (commentId: string) => {
    if (!activeReel) return;
    const updated = toggleCommentMarkHelpful(activeReel.id, commentId, 'Student Teacher');
    setReels(updated);
  };

  const handleToggleSegmentLike = (segmentId: string) => {
    if (!activeReel) return;
    const updated = toggleSegmentFeedbackLike(activeReel.id, segmentId, moderationRecord.userId);
    setReels(updated);
  };

  const handleToggleSegmentHelpful = (segmentId: string) => {
    if (!activeReel) return;
    const updated = toggleSegmentFeedbackHelpful(activeReel.id, segmentId, 'Student Teacher');
    setReels(updated);
  };

  // Violation flagging
  const handleFlagViolation = (text: string, words: string[]) => {
    const { record } = recordModerationViolation(
      moderationRecord.userId,
      text,
      words,
      'abusive_comment'
    );
    setModerationRecord(record);
    setViolationAlert({
      isOpen: true,
      text,
      words,
      record,
    });
  };

  // Share
  const handleShare = (reel: TeachingReelPost) => {
    const shareUrl = `${window.location.origin}/apprentice-hub?reel=${reel.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setShareToast(`Copied campus reel link for ${reel.traineeName}!`);
    setTimeout(() => setShareToast(null), 3500);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Feed Filter & Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900/90 border border-zinc-800 rounded-3xl backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Campus Micro-Teaching Reels
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Peer Review Feed
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Vertical snap feed of apprentice practice sessions • Rated by peers, mentor teachers & judges
            </p>
          </div>
        </div>

        {/* Program Filter Pills */}
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setProgramFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              programFilter === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Tracks ({reels.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setProgramFilter('b_ed');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              programFilter === 'b_ed'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            B.Ed Interns
          </button>
          <button
            type="button"
            onClick={() => {
              setProgramFilter('btc_deled');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              programFilter === 'btc_deled'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            BTC / D.El.Ed
          </button>
          <button
            type="button"
            onClick={() => {
              setProgramFilter('iti_trainer');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              programFilter === 'iti_trainer'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            ITI Instructors
          </button>
        </div>
      </div>

      {/* Search & Topic Tag Discovery Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl backdrop-blur-md">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search topic, trainee, subject, or #tag..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-7 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Topic Tag Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <span className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1 shrink-0 mr-1">
            <Tag className="w-3 h-3 text-amber-400" />
            Topic Tags:
          </span>
          <button
            type="button"
            onClick={() => {
              setTopicFilter('all');
              setCurrentIndex(0);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              topicFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Topics
          </button>
          {['Algebra', 'Physics', 'Pedagogy', 'Electrician', 'Set Induction', ...availableTags.filter(t => !['Algebra', 'Physics', 'Pedagogy', 'Electrician', 'Set Induction'].includes(t))].slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                setTopicFilter(topicFilter.toLowerCase() === tag.toLowerCase() ? 'all' : tag);
                setCurrentIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                topicFilter.toLowerCase() === tag.toLowerCase()
                  ? 'bg-amber-500 text-zinc-950 font-bold border border-amber-400 shadow-sm'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reels Snap Container */}
      <div className="relative flex justify-center">
        {/* Vertical Snap Viewport */}
        <div
          ref={reelContainerRef}
          onScroll={handleScroll}
          className="w-full max-w-xl h-[calc(100vh-210px)] min-h-[600px] max-h-[840px] overflow-y-scroll snap-y snap-mandatory scroll-smooth rounded-3xl border border-zinc-800 shadow-2xl bg-black relative select-none scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {filteredReels.map((reel, idx) => {
            const isThisActive = idx === currentIndex;
            const hasVideo = !!reel.videoBlobUrl;
            const segmentsCount = (reel.segmentFeedbacks || []).length;
            const sentimentData = analyzeReelSentiment(reel);

            return (
              <div
                key={reel.id}
                className="w-full h-full snap-start snap-always relative overflow-hidden flex flex-col justify-between bg-zinc-950"
              >
                {/* 1. VIDEO OR SIMULATED CANVAS BACKGROUND */}
                <div
                  onClick={togglePlayPause}
                  className="absolute inset-0 cursor-pointer flex items-center justify-center bg-zinc-950"
                >
                  {hasVideo ? (
                    <video
                      ref={(el) => (videoRefs.current[reel.id] = el)}
                      src={reel.videoBlobUrl}
                      loop
                      playsInline
                      muted={isMuted}
                      onTimeUpdate={() => handleVideoTimeUpdate(reel.id)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    /* High-Fidelity Simulation Classroom Canvas */
                    <div className="w-full h-full flex flex-col justify-between p-8 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black relative">
                      {/* Blackboard Header */}
                      <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-left space-y-2 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                            Smartboard Lesson Canvas
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                            {reel.targetClass}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white tracking-wide">
                          {reel.topicTitle}
                        </h3>
                        <div className="text-xs text-zinc-300 line-clamp-2">
                          {reel.lessonObjectives[0]}
                        </div>
                      </div>

                      {/* Animated Central Pedagogy Stage */}
                      <div className="flex flex-col items-center justify-center space-y-4 my-auto">
                        <div className="relative">
                          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-zinc-950 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/20">
                            {reel.traineeAvatar}
                          </div>
                          {isPlaying && isThisActive && (
                            <span className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-bold shadow-lg animate-bounce">
                              Teaching Live
                            </span>
                          )}
                        </div>

                        {/* Interactive audio/speech pacing wave */}
                        <div className="flex items-center gap-1.5 h-10">
                          {[16, 28, 42, 24, 38, 52, 34, 48, 20, 36, 50, 22, 30].map((h, i) => (
                            <span
                              key={i}
                              style={{
                                height: isPlaying && isThisActive ? `${h}px` : '6px',
                              }}
                              className="w-1.5 bg-amber-400/80 rounded-full transition-all duration-200"
                            />
                          ))}
                        </div>

                        <div className="text-center">
                          <span className="text-xs font-mono text-amber-300 font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
                            Speech Pace: {reel.bestTakeStats.speechPaceWpm} WPM • Clarity:{' '}
                            {reel.bestTakeStats.clarityScore}%
                          </span>
                        </div>
                      </div>

                      {/* Blackboard Key Formulas Footer */}
                      <div className="p-3 bg-black/60 border border-white/10 rounded-2xl text-left backdrop-blur-md space-y-1">
                        <div className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                          Key Concept Formulation:
                        </div>
                        <div className="text-xs text-amber-200 font-mono truncate">
                          {reel.blackboardKeyNotes[0] || 'Observe, Question, Hypothesize, Conclude'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Play / Pause overlay if user paused */}
                  {!isPlaying && isThisActive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center shadow-2xl scale-110 transition">
                        <Play className="w-8 h-8 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. TOP OVERLAY: Trainee Details & Badges */}
                <div className="relative z-20 p-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-start justify-between gap-4 pointer-events-none">
                  <div className="flex items-center gap-3 pointer-events-auto">
                    <span className="text-3xl">{reel.traineeAvatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {reel.traineeName}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-bold border border-amber-500/40">
                          {reel.traineeProgram.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-300 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[210px]">{reel.collegeCampus}</span>
                      </p>
                    </div>
                  </div>

                  {/* Audio Mute & Evaluation Score Pill */}
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setIsMuted((prev) => !prev)}
                      className="p-2 rounded-xl bg-black/60 text-white backdrop-blur-md border border-white/10 hover:bg-black/80 transition"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <div className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>{reel.rubricAverages.overallAverage.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                {/* 3. RIGHT FLOATING INTERACTION SIDEBAR */}
                <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-4">
                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-rose-500/20 group-hover:text-rose-400 group-hover:border-rose-500/40 transition shadow-lg">
                      <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      {reel.likesCount}
                    </span>
                  </button>

                  {/* Applause / Clapping */}
                  <button
                    type="button"
                    onClick={() => handleApplause(reel.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:text-amber-400 group-hover:border-amber-500/40 transition shadow-lg">
                      <ThumbsUp className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      {reel.applauseCount}
                    </span>
                  </button>

                  {/* Peer Evaluation Button (Timestamped Segments) */}
                  <button
                    type="button"
                    onClick={() => setIsPeerEvaluationOpen(true)}
                    className="flex flex-col items-center gap-1 group"
                    title="Open Peer & Judge Segment Evaluation"
                  >
                    <div className="w-11 h-11 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center group-hover:scale-110 transition shadow-xl shadow-amber-500/30">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 drop-shadow">
                      Evaluate
                    </span>
                  </button>

                  {/* Peer Sentiment Radar Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setIsSentimentOverlayOpen(true)}
                    className="flex flex-col items-center gap-1 group"
                    title="Peer Feedback Sentiment & Common Themes"
                  >
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/20 to-teal-500/20 backdrop-blur-md border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:border-amber-400 transition shadow-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-300 drop-shadow">
                      Sentiment
                    </span>
                  </button>

                  {/* Comments Drawer Button */}
                  <button
                    type="button"
                    onClick={() => setIsCommentsOpen(true)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-zinc-800 transition shadow-lg">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow">
                      {reel.comments.length}
                    </span>
                  </button>

                  {/* Lesson Plan Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsLessonPlanOpen((prev) => !prev)}
                    className="flex flex-col items-center gap-1 group"
                    title="View Micro-Teaching Lesson Plan"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-zinc-800 transition shadow-lg">
                      <BookOpen className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-300 drop-shadow">
                      Plan
                    </span>
                  </button>

                  {/* Share Button */}
                  <button
                    type="button"
                    onClick={() => handleShare(reel)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-zinc-800 transition shadow-lg">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-white drop-shadow">Share</span>
                  </button>
                </div>

                {/* 4. BOTTOM OVERLAY: Topic, Skill Focus, and Scrubber Bar */}
                <div className="relative z-20 p-5 bg-gradient-to-t from-black/95 via-black/70 to-transparent space-y-3">
                  <div className="text-left space-y-1.5 max-w-[80%]">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {reel.subject}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                        Skill: {reel.skillFocus.replace('_', ' ')}
                      </span>
                      {reel.privacyConfig?.privacy === 'private' ? (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 flex items-center gap-1"
                          title={`Private peer session: restricted to ${reel.privacyConfig.allowedPeerNames.join(', ')}`}
                        >
                          <Lock className="w-2.5 h-2.5" />
                          <span>Private ({reel.privacyConfig.targetGroup || 'Restricted Peers'})</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                          <Globe className="w-2.5 h-2.5" />
                          <span>Public Reel</span>
                        </span>
                      )}
                      {segmentsCount > 0 && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {segmentsCount} Segment Feedback
                        </span>
                      )}
                    </div>

                    {/* Topic Tags Badges */}
                    {reel.topicTags && reel.topicTags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        {reel.topicTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setTopicFilter(tag);
                            }}
                            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-900/90 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 transition flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5 text-amber-400" />
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <h3 className="text-base font-bold text-white leading-snug drop-shadow-md">
                      {reel.topicTitle}
                    </h3>

                    {/* Common Feedback Themes Sentiment Pill */}
                    {sentimentData.commonThemes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsSentimentOverlayOpen(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-[11px] text-zinc-200 hover:bg-black/90 hover:border-amber-400 transition shadow-lg group text-left max-w-full"
                        title="Click to inspect Peer Feedback Sentiment Analysis"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform shrink-0" />
                        <span className="text-amber-300 font-bold">Feedback Themes:</span>
                        <span className="text-white font-medium truncate max-w-[180px] sm:max-w-[240px]">
                          {sentimentData.commonThemes.slice(0, 2).map((t) => t.theme).join(' • ')}
                        </span>
                        <span className="text-zinc-500">•</span>
                        <span className="text-emerald-400 font-bold font-mono">
                          {sentimentData.overallSentimentScore}% Positive
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Interactive Scrubber & Timestamp Markers Bar */}
                  <div className="space-y-1">
                    <div className="relative w-full h-2 bg-white/20 rounded-full overflow-visible flex items-center">
                      <div
                        style={{
                          width: `${(currentPlaybackTime / reel.durationSeconds) * 100}%`,
                        }}
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative"
                      >
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md" />
                      </div>

                      {/* Segment dots on scrubber */}
                      {(reel.segmentFeedbacks || []).map((seg) => {
                        const pct = (seg.timestampSeconds / reel.durationSeconds) * 100;
                        return (
                          <button
                            key={seg.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSeekToTimestamp(seg.timestampSeconds);
                            }}
                            style={{ left: `${pct}%` }}
                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 border border-white shadow hover:scale-150 transition z-10"
                            title={`Jump to ${seg.segmentLabel} (${formatSeconds(seg.timestampSeconds)})`}
                          />
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{formatSeconds(currentPlaybackTime)}</span>
                      <span>{formatSeconds(reel.durationSeconds)}</span>
                    </div>
                  </div>
                </div>

                {/* SLIDE-OUT LESSON PLAN DRAWER */}
                {isLessonPlanOpen && isThisActive && (
                  <div className="absolute inset-x-4 bottom-24 z-30 p-4 bg-zinc-900/98 backdrop-blur-xl border border-zinc-700 rounded-2xl shadow-2xl text-left space-y-3 animate-in slide-in-from-bottom duration-200">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Micro-Teaching Lesson Plan
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsLessonPlanOpen(false)}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        ✕ Close
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-zinc-300 block mb-1">Lesson Objectives:</strong>
                        <ul className="space-y-1 pl-4 list-disc text-zinc-400 text-[11px]">
                          {reel.lessonObjectives.map((obj, i) => (
                            <li key={i}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <strong className="text-zinc-300 block mb-1">Blackboard Notation:</strong>
                        <ul className="space-y-1 pl-4 list-disc text-amber-300/80 text-[11px]">
                          {reel.blackboardKeyNotes.map((note, i) => (
                            <li key={i}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Vertical Pagination Dots & Quick Up/Down Navigation */}
        <div className="hidden md:flex flex-col items-center gap-2 ml-4 self-center">
          <button
            type="button"
            onClick={() => scrollToIndex(currentIndex - 1)}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Previous Reel (Up Arrow)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center gap-1.5 py-2">
            {filteredReels.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={`w-2 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'h-6 bg-amber-500 shadow-md shadow-amber-500/40'
                    : 'h-2 bg-zinc-700 hover:bg-zinc-500'
                }`}
                title={`Jump to Reel ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(currentIndex + 1)}
            disabled={currentIndex === filteredReels.length - 1}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            title="Next Reel (Down Arrow)"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PEER EVALUATION MODAL / DRAWER */}
      {isPeerEvaluationOpen && activeReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl">
            <PeerEvaluation
              reel={activeReel}
              currentVideoTime={currentPlaybackTime}
              onSeekToTimestamp={(sec) => {
                handleSeekToTimestamp(sec);
                setIsPeerEvaluationOpen(false);
              }}
              onAddSegmentFeedback={handleAddSegmentFeedback}
              onClose={() => setIsPeerEvaluationOpen(false)}
              currentUserName="Apprentice Colleague"
              currentUserCollege={activeReel.collegeCampus}
              onToggleSegmentLike={handleToggleSegmentLike}
              onToggleSegmentHelpful={handleToggleSegmentHelpful}
              currentUserId={moderationRecord.userId}
            />
          </div>
        </div>
      )}

      {/* COMMENTS DRAWER WITH AI MODERATION */}
      {activeReel && (
        <ReelCommentsDrawer
          isOpen={isCommentsOpen}
          onClose={() => setIsCommentsOpen(false)}
          reel={activeReel}
          moderationRecord={moderationRecord}
          onAddComment={handleAddComment}
          onTriggerDisclaimer={() => setIsDisclaimerModalOpen(true)}
          onFlagViolation={handleFlagViolation}
          onToggleLikeComment={handleToggleCommentLike}
          onToggleMarkHelpful={handleToggleCommentMarkHelpful}
        />
      )}

      {/* PEER FEEDBACK SENTIMENT ANALYSIS OVERLAY */}
      {activeReel && (
        <ReelSentimentOverlay
          reel={activeReel}
          isOpen={isSentimentOverlayOpen}
          onClose={() => setIsSentimentOverlayOpen(false)}
          onOpenComments={() => setIsCommentsOpen(true)}
        />
      )}

      {/* CODE OF CONDUCT DISCLAIMER MODAL */}
      <CodeOfConductModal
        isOpen={isDisclaimerModalOpen}
        onAccept={() => {
          const updated = acceptCodeOfConductDisclaimer(moderationRecord.userId);
          setModerationRecord(updated);
          setIsDisclaimerModalOpen(false);
        }}
        onClose={() => setIsDisclaimerModalOpen(false)}
        moderationRecord={moderationRecord}
      />

      {/* VIOLATION / STRIKE ALERT MODAL */}
      {violationAlert && (
        <ModerationViolationAlertModal
          isOpen={violationAlert.isOpen}
          flaggedWords={violationAlert.words}
          reason={
            violationAlert.record.isBanned
              ? 'Your account has been automatically suspended due to repeated violations of respectful conduct standards.'
              : 'Your comment contained derogatory or inappropriate words violating educator professional ethics.'
          }
          moderationRecord={violationAlert.record}
          onClose={() => setViolationAlert(null)}
        />
      )}

      {/* SHARE TOAST */}
      {shareToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
};
