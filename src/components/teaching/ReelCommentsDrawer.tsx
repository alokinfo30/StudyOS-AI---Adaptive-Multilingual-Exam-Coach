import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Ban,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  Heart,
  Pin,
  ThumbsUp,
} from 'lucide-react';
import {
  JudgeRole,
  TeachingReelPost,
  TraineeComment,
  UserModerationRecord,
} from '../../types/teaching';
import {
  checkContentModerationWithAI,
  RESPECTFUL_FEEDBACK_PROMPTS,
} from '../../services/moderationService';
import {
  toggleCommentLike,
  toggleCommentMarkHelpful,
} from '../../services/teachingStorageService';
import { CommunityConductModal, CommunityConductToast } from './CommunityConductModal';

interface ReelCommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reel: TeachingReelPost;
  moderationRecord: UserModerationRecord;
  onAddComment: (comment: TraineeComment) => void;
  onTriggerDisclaimer: () => void;
  onFlagViolation: (blockedText: string, words: string[]) => void;
  onToggleLikeComment?: (commentId: string) => void;
  onToggleMarkHelpful?: (commentId: string) => void;
  currentUserId?: string;
}

export const ReelCommentsDrawer: React.FC<ReelCommentsDrawerProps> = ({
  isOpen,
  onClose,
  reel,
  moderationRecord,
  onAddComment,
  onTriggerDisclaimer,
  onFlagViolation,
  onToggleLikeComment,
  onToggleMarkHelpful,
  currentUserId = 'current_trainee',
}) => {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Pooja Nair');
  const [authorRole, setAuthorRole] = useState<JudgeRole>('colleague_trainee');
  const [authorCollege, setAuthorCollege] = useState(reel.collegeCampus);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleLikeComment = (commentId: string) => {
    if (onToggleLikeComment) {
      onToggleLikeComment(commentId);
    } else {
      toggleCommentLike(reel.id, commentId, currentUserId);
    }
  };

  const handleMarkHelpful = (commentId: string) => {
    if (onToggleMarkHelpful) {
      onToggleMarkHelpful(commentId);
    } else {
      toggleCommentMarkHelpful(reel.id, commentId, authorName);
    }
  };

  // Community Conduct Pre-Submission Modal State
  const [isConductModalOpen, setIsConductModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isBanned = moderationRecord.isBanned;

  const handleFocusOrInputClick = () => {
    if (!moderationRecord.disclaimerAccepted && !isBanned) {
      onTriggerDisclaimer();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBanned || isAnalyzing || !commentText.trim()) return;

    if (!moderationRecord.disclaimerAccepted) {
      onTriggerDisclaimer();
      return;
    }

    // Open Community Conduct Modal before finalizing comment
    setIsConductModalOpen(true);
  };

  const handleConfirmConduct = async () => {
    setIsConductModalOpen(false);
    if (isBanned || isAnalyzing || !commentText.trim()) return;

    setIsAnalyzing(true);

    try {
      // Run AI-driven Automated Abuse & Inappropriateness Content Analysis
      const modResult = await checkContentModerationWithAI(commentText, authorRole);
      if (!modResult.isSafe) {
        setIsAnalyzing(false);
        onFlagViolation(commentText, modResult.flaggedWords);
        return;
      }

      const newComment: TraineeComment = {
        id: `comm_${Date.now()}`,
        authorId: moderationRecord.userId || `user_${Date.now()}`,
        authorName: authorName.trim() || 'Apprentice Colleague',
        authorAvatar:
          authorRole === 'college_teacher'
            ? '👨‍🏫'
            : authorRole === 'certified_judge'
            ? '⚖️'
            : '👩‍🎓',
        authorRole,
        authorCollege: authorCollege.trim() || reel.collegeCampus,
        text: commentText.trim(),
        timestamp: Date.now(),
        likes: 1,
        isConstructiveFeedback: true,
      };

      onAddComment(newComment);
      setCommentText('');
      setToastMessage('Conduct verified: Respectful peer feedback posted successfully.');
    } catch (err) {
      console.error('Comment moderation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    if (!moderationRecord.disclaimerAccepted) {
      onTriggerDisclaimer();
      return;
    }
    setCommentText(prompt);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-900/98 backdrop-blur-xl border-l border-zinc-800 shadow-2xl flex flex-col text-zinc-100 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-950/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Peer & Supervisor Feedback
              <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-normal">
                {reel.comments.length}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400 truncate max-w-[240px]">
              {reel.traineeName} • {reel.topicTitle}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Mandatory Ethics Warning Banner */}
      <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Professional Respect Filter Active</span>
        </div>
        <button
          type="button"
          onClick={onTriggerDisclaimer}
          className="text-[11px] underline text-amber-400 hover:text-amber-200"
        >
          View Ethics Code
        </button>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {reel.comments.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            <GraduationCap className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
            <p className="font-semibold text-zinc-400">No comments yet</p>
            <p className="mt-1">Be the first colleague or teacher to share respectful pedagogical feedback!</p>
          </div>
        ) : (
          reel.comments.map((comm) => {
            const isLiked = comm.likedByUserIds?.includes(currentUserId) || false;
            return (
              <div
                key={comm.id}
                className={`p-3 rounded-2xl space-y-2.5 transition border ${
                  comm.isMarkedHelpful
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-zinc-950/70 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Pinned Helpful Pedagogical Advice Badge */}
                {comm.isMarkedHelpful && (
                  <div className="flex items-center justify-between px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-lg text-[10px] font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <Pin className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Pinned Pedagogical Advice • Marked as Helpful</span>
                    </span>
                    {comm.markedHelpfulBy && (
                      <span className="text-zinc-400 font-normal">by {comm.markedHelpfulBy}</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{comm.authorAvatar}</span>
                    <div>
                      <div className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                        <span>{comm.authorName}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            comm.authorRole === 'college_teacher'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : comm.authorRole === 'certified_judge'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {comm.authorRole === 'college_teacher'
                            ? 'Professor'
                            : comm.authorRole === 'certified_judge'
                            ? 'Judge'
                            : 'Colleague'}
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500">{comm.authorCollege}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(comm.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pl-7">{comm.text}</p>

                {/* Comment Actions: Like Button with Count & Mark as Helpful Pin */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-850/80 text-[11px] pl-7">
                  <button
                    type="button"
                    onClick={() => handleLikeComment(comm.id)}
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
                    <span className="font-mono text-xs">{comm.likes || 0}</span>
                    <span className="text-[10px] opacity-80">{comm.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMarkHelpful(comm.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition text-[11px] font-semibold ${
                      comm.isMarkedHelpful
                        ? 'bg-amber-500/25 border-amber-500/50 text-amber-300 shadow-sm'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-amber-500/40 hover:text-amber-300'
                    }`}
                    title={comm.isMarkedHelpful ? 'Unpin advice' : 'Pin to top as most helpful pedagogical advice'}
                  >
                    <Pin
                      className={`w-3 h-3 ${comm.isMarkedHelpful ? 'fill-amber-400 text-amber-400' : ''}`}
                    />
                    <span>{comm.isMarkedHelpful ? 'Helpful (Pinned)' : 'Mark as Helpful'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Constructive Pedagogical Suggestions Chips */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950/60 shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Respectful Feedback Starters:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {RESPECTFUL_FEEDBACK_PROMPTS.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelectPrompt(prompt)}
              className="text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2.5 py-1.5 rounded-xl whitespace-nowrap border border-zinc-700/60 transition shrink-0"
            >
              {prompt.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Input / Post Form */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
        {isBanned ? (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-rose-300 text-xs">
            <Ban className="w-5 h-5 shrink-0 text-rose-400" />
            <div>
              <strong className="block font-bold">Account Auto-Banned</strong>
              <span>You cannot comment or post due to repeated policy violations.</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-2.5">
            {/* Identity Switcher */}
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name"
                className="w-1/2 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
              <select
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value as JudgeRole)}
                className="w-1/2 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
              >
                <option value="colleague_trainee">👨‍🎓 Colleague Trainee</option>
                <option value="college_teacher">👨‍🏫 Teacher Educator</option>
                <option value="certified_judge">⚖️ Official Judge</option>
              </select>
            </div>

            {/* Comment Textarea */}
            <div className="relative">
              <textarea
                rows={2}
                value={commentText}
                onFocus={handleFocusOrInputClick}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  moderationRecord.disclaimerAccepted
                    ? 'Write constructive, respectful feedback for this apprentice educator...'
                    : 'Click to accept respect disclaimer and comment...'
                }
                className="w-full p-2.5 pr-10 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isAnalyzing}
                className={`absolute right-2.5 bottom-3.5 p-1.5 rounded-lg transition ${
                  commentText.trim() && !isAnalyzing
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-md'
                    : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                }`}
                title={isAnalyzing ? 'AI Content Guard analyzing...' : 'Send comment'}
              >
                {isAnalyzing ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
              <span>{isAnalyzing ? '🤖 AI Content Guard scanning for respectful language...' : '⚠️ Abusive language results in instant strike & auto-ban'}</span>
              <span>{commentText.length}/300</span>
            </div>
          </form>
        )}

        {/* Community Conduct Confirmation Modal before posting comment */}
        <CommunityConductModal
          isOpen={isConductModalOpen}
          actionType="comment"
          contentPreview={commentText ? `"${commentText}"` : undefined}
          onConfirm={handleConfirmConduct}
          onCancel={() => setIsConductModalOpen(false)}
        />

        {/* Community Conduct Verification Feedback Toast */}
        {toastMessage && (
          <CommunityConductToast
            message={toastMessage}
            onClose={() => setToastMessage(null)}
          />
        )}
      </div>
    </div>
  );
};
