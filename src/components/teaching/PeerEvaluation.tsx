import React, { useState } from 'react';
import {
  Award,
  Clock,
  Star,
  CheckCircle2,
  Sliders,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Send,
  X,
  UserCheck,
  GraduationCap,
  Play,
  CornerDownRight,
  Info,
  Heart,
  Pin,
  ThumbsUp,
} from 'lucide-react';
import {
  TeachingReelPost,
  JudgeRole,
  SegmentFeedback,
  RubricCriteriaScores,
  TraineeEvaluation,
} from '../../types/teaching';
import { playMasteryPopSound } from '../../utils/audioEffects';
import {
  toggleSegmentFeedbackLike,
  toggleSegmentFeedbackHelpful,
} from '../../services/teachingStorageService';

interface PeerEvaluationProps {
  reel: TeachingReelPost;
  currentVideoTime?: number;
  onSeekToTimestamp?: (seconds: number) => void;
  onAddSegmentFeedback: (feedback: SegmentFeedback) => void;
  onAddFullEvaluation?: (evaluation: TraineeEvaluation) => void;
  onClose?: () => void;
  defaultRole?: JudgeRole;
  currentUserName?: string;
  currentUserCollege?: string;
  onToggleSegmentLike?: (feedbackId: string) => void;
  onToggleSegmentHelpful?: (feedbackId: string) => void;
  currentUserId?: string;
}

const CONSTRUCTIVE_SUGGESTION_CHIPS = [
  'Crisp set induction hook; immediately grabbed student attention.',
  'Well-proportioned blackboard diagram with clear labels.',
  'Excellent wait-time after asking the open-ended inquiry question.',
  'Voice modulation effectively highlighted key formula constants.',
  'Good stimulus variation between demonstration and student questioning.',
  'Consider pausing 3 seconds before providing the answer directly.',
];

const CRITERION_LABELS: Record<keyof RubricCriteriaScores | 'general', string> = {
  setInduction: 'Set Induction & Hook',
  blackboardWork: 'Blackboard & Smartboard Work',
  explanationClarity: 'Explanation Clarity',
  probingQuestions: 'Probing & Inquiry Questions',
  voiceAndBodyLanguage: 'Voice Modulation & Posture',
  lessonClosure: 'Lesson Closure & Summary',
  general: 'General Pedagogical Observation',
};

export const PeerEvaluation: React.FC<PeerEvaluationProps> = ({
  reel,
  currentVideoTime = 0,
  onSeekToTimestamp,
  onAddSegmentFeedback,
  onAddFullEvaluation,
  onClose,
  defaultRole = 'colleague_trainee',
  currentUserName = 'Trainee Colleague',
  currentUserCollege = 'DIET / College of Education',
  onToggleSegmentLike,
  onToggleSegmentHelpful,
  currentUserId = 'current_trainee',
}) => {
  // Evaluator Role & Identity
  const [evaluatorRole, setEvaluatorRole] = useState<JudgeRole>(defaultRole);
  const [evaluatorName, setEvaluatorName] = useState(currentUserName);
  const [evaluatorCollege, setEvaluatorCollege] = useState(currentUserCollege);

  const handleLikeSegment = (segmentId: string) => {
    if (onToggleSegmentLike) {
      onToggleSegmentLike(segmentId);
    } else {
      toggleSegmentFeedbackLike(reel.id, segmentId, currentUserId);
    }
  };

  const handleHelpfulSegment = (segmentId: string) => {
    if (onToggleSegmentHelpful) {
      onToggleSegmentHelpful(segmentId);
    } else {
      toggleSegmentFeedbackHelpful(reel.id, segmentId, evaluatorName);
    }
  };

  // New Segment Feedback Form State
  const [timestampSec, setTimestampSec] = useState(Math.floor(currentVideoTime) || 15);
  const [segmentLabel, setSegmentLabel] = useState('Set Induction Observation');
  const [rubricCriterion, setRubricCriterion] = useState<keyof RubricCriteriaScores | 'general'>('setInduction');
  const [segmentRating, setSegmentRating] = useState<number>(9);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Active highlighted segment
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSyncCurrentPlayhead = () => {
    setTimestampSec(Math.floor(currentVideoTime));
  };

  const handleSubmitSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);

    const newSegment: SegmentFeedback = {
      id: `seg_${Date.now()}`,
      timestampSeconds: Math.max(0, Math.min(reel.durationSeconds, timestampSec)),
      segmentLabel: segmentLabel.trim() || 'Pedagogical Segment',
      rubricCriterion,
      rating: segmentRating,
      feedbackText: feedbackText.trim(),
      authorRole: evaluatorRole,
      authorName: evaluatorName.trim() || 'Peer Evaluator',
      authorAvatar: evaluatorRole === 'college_teacher' ? '👨‍🏫' : evaluatorRole === 'certified_judge' ? '👨‍💼' : '👩‍🎓',
      authorCollege: evaluatorCollege,
      createdAt: Date.now(),
    };

    onAddSegmentFeedback(newSegment);
    playMasteryPopSound(true);

    setIsSubmitting(false);
    setSubmissionSuccess(true);
    setFeedbackText('');

    setTimeout(() => {
      setSubmissionSuccess(false);
    }, 3000);
  };

  const allSegments: SegmentFeedback[] = (reel.segmentFeedbacks || []).slice().sort(
    (a, b) => a.timestampSeconds - b.timestampSeconds
  );

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Award className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Peer & Judge Rubric Evaluation</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              Timestamped Feedback
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Provide timestamped pedagogical critique on specific lesson segments for{' '}
            <strong className="text-zinc-200">{reel.traineeName}</strong> ({reel.topicTitle})
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Evaluator Role Picker */}
      <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Evaluating as:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
          <button
            type="button"
            onClick={() => setEvaluatorRole('colleague_trainee')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              evaluatorRole === 'colleague_trainee'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Colleague Trainee
          </button>
          <button
            type="button"
            onClick={() => setEvaluatorRole('college_teacher')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              evaluatorRole === 'college_teacher'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            College Teacher / Mentor
          </button>
          <button
            type="button"
            onClick={() => setEvaluatorRole('certified_judge')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
              evaluatorRole === 'certified_judge'
                ? 'bg-amber-500 text-zinc-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Certified Judge
          </button>
        </div>
      </div>

      {/* SECTION 1: EXISTING TIMESTAMPED SEGMENTS TIMELINE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Annotated Lesson Segments ({allSegments.length})</span>
          </div>
          <span className="text-[11px] text-zinc-400">Click any timestamp to seek video</span>
        </div>

        {allSegments.length === 0 ? (
          <div className="p-6 bg-zinc-950/60 border border-dashed border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
            No segment evaluations recorded yet. Be the first colleague or supervisor to timestamp this session!
          </div>
        ) : (
          <div className="space-y-2.5">
            {allSegments.map((seg) => {
              const isSelected = activeSegmentId === seg.id;
              const isLiked = seg.likedByUserIds?.includes(currentUserId) || false;
              return (
                <div
                  key={seg.id}
                  className={`p-3.5 rounded-2xl border transition text-left space-y-2.5 ${
                    seg.isMarkedHelpful
                      ? 'bg-amber-950/25 border-amber-500/60 shadow-lg shadow-amber-500/10'
                      : isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 shadow-lg'
                      : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Pinned Pedagogical Advice Banner */}
                  {seg.isMarkedHelpful && (
                    <div className="flex items-center justify-between px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-lg text-[10px] font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Pin className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Pinned Pedagogical Advice • Marked as Helpful</span>
                      </span>
                      {seg.markedHelpfulBy && (
                        <span className="text-zinc-400 font-normal">by {seg.markedHelpfulBy}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveSegmentId(seg.id);
                          if (onSeekToTimestamp) {
                            onSeekToTimestamp(seg.timestampSeconds);
                          }
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-zinc-950 font-mono text-xs font-bold border border-amber-500/30 transition group"
                        title="Seek video to this timestamp"
                      >
                        <Play className="w-3 h-3 fill-current group-hover:scale-110 transition" />
                        <span>{formatTime(seg.timestampSeconds)}</span>
                      </button>

                      <span className="text-xs font-bold text-white">{seg.segmentLabel}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {seg.rating}/10
                      </span>

                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          seg.authorRole === 'certified_judge'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : seg.authorRole === 'college_teacher'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {seg.authorRole === 'certified_judge'
                          ? 'Judge'
                          : seg.authorRole === 'college_teacher'
                          ? 'Supervisor'
                          : 'Peer Trainee'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 pl-1">{seg.feedbackText}</p>

                  <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-850/60 pl-1">
                    <span>
                      {seg.authorName} • {seg.authorCollege || 'Campus Colleague'}
                    </span>
                    <span className="text-zinc-400 font-medium">
                      Skill: {CRITERION_LABELS[seg.rubricCriterion]}
                    </span>
                  </div>

                  {/* Likes Count & Mark as Helpful Pin Controls */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-850/60 text-xs pl-1">
                    <button
                      type="button"
                      onClick={() => handleLikeSegment(seg.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                        isLiked
                          ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                      }`}
                      title="Like this peer feedback"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                          isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                        }`}
                      />
                      <span className="font-mono text-xs">{seg.likes || 0}</span>
                      <span className="text-[10px] opacity-80">{seg.likes === 1 ? 'Like' : 'Likes'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleHelpfulSegment(seg.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition text-xs font-semibold ${
                        seg.isMarkedHelpful
                          ? 'bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-amber-300'
                      }`}
                      title={seg.isMarkedHelpful ? 'Unpin advice' : 'Pin to top as most helpful pedagogical advice'}
                    >
                      <Pin
                        className={`w-3.5 h-3.5 ${seg.isMarkedHelpful ? 'fill-amber-400 text-amber-400' : ''}`}
                      />
                      <span>{seg.isMarkedHelpful ? 'Helpful (Pinned)' : 'Mark as Helpful'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: ADD TIMESTAMPED SEGMENT FEEDBACK FORM */}
      <form onSubmit={handleSubmitSegment} className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Add Timestamped Segment Rating</span>
          </h4>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSyncCurrentPlayhead}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 transition"
          >
            <span>Sync to Playhead ({formatTime(Math.floor(currentVideoTime))})</span>
          </button>
        </div>

        {/* Timestamp & Label Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Timestamp (Seconds)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={reel.durationSeconds}
                value={timestampSec}
                onChange={(e) => setTimestampSec(Number(e.target.value))}
                className="w-24 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <span className="text-xs font-mono text-amber-400">
                formatted: {formatTime(timestampSec)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Segment Title / Action</label>
            <input
              type="text"
              value={segmentLabel}
              onChange={(e) => setSegmentLabel(e.target.value)}
              placeholder="e.g. Set Induction Hook, Board Formula"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
              required
            />
          </div>
        </div>

        {/* Criterion & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400">Rubric Skill Area</label>
            <select
              value={rubricCriterion}
              onChange={(e) =>
                setRubricCriterion(e.target.value as keyof RubricCriteriaScores | 'general')
              }
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:border-amber-500 focus:outline-none"
            >
              <option value="setInduction">Set Induction & Hook</option>
              <option value="blackboardWork">Blackboard & Smartboard Work</option>
              <option value="explanationClarity">Explanation Clarity</option>
              <option value="probingQuestions">Probing & Inquiry Questions</option>
              <option value="voiceAndBodyLanguage">Voice Modulation & Posture</option>
              <option value="lessonClosure">Lesson Closure & Summary</option>
              <option value="general">General Observation</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Segment Score</span>
              <span className="font-bold text-amber-400">{segmentRating} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={segmentRating}
              onChange={(e) => setSegmentRating(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-zinc-400">Pedagogical Suggestion Quick-Chips:</span>
          <div className="flex flex-wrap gap-1.5">
            {CONSTRUCTIVE_SUGGESTION_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFeedbackText(chip)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-500/50 transition text-left"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div className="space-y-1">
          <label className="text-xs text-zinc-400">Observation & Recommendation</label>
          <textarea
            rows={3}
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Describe what the student teacher did well during this segment and how they can sharpen classroom impact..."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none resize-none"
            required
          />
        </div>

        {/* Ethics & Respect Notice */}
        <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-2 text-[11px] text-amber-300">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Feedback is subject to the Apprentice Educator Code of Conduct. Please provide supportive, professional critique.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          {submissionSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Segment rating recorded on campus reel!
            </span>
          ) : (
            <span className="text-[11px] text-zinc-500">
              Evaluations are visible to all college peers & faculty supervisors
            </span>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !feedbackText.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Segment Rating</span>
          </button>
        </div>
      </form>
    </div>
  );
};
