import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartHandshake,
  MessageSquareHeart,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

interface CommunityConductModalProps {
  isOpen: boolean;
  actionType: 'comment' | 'post';
  targetTitle?: string;
  authorName?: string;
  previewText?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const CommunityConductModal: React.FC<CommunityConductModalProps> = ({
  isOpen,
  actionType,
  targetTitle,
  authorName,
  previewText,
  onConfirm,
  onClose,
}) => {
  const [pledgeAccepted, setPledgeAccepted] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl text-zinc-100 relative space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
              Campus Peer Space
            </span>
            <h3 className="text-base font-bold text-white leading-tight">
              Community Conduct Reminder
            </h3>
          </div>
        </div>

        {/* Context description */}
        <div className="p-3 bg-zinc-950/80 rounded-2xl border border-zinc-800 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-semibold text-zinc-300">
              {actionType === 'comment' ? 'Pending Peer Comment' : 'Pending Campus Post'}
            </span>
            {authorName && <span className="text-amber-300">For {authorName}</span>}
          </div>
          {previewText && (
            <p className="text-zinc-200 italic line-clamp-2 bg-black/40 p-2 rounded-xl border border-white/5">
              "{previewText}"
            </p>
          )}
          {targetTitle && (
            <p className="text-zinc-400 font-medium truncate">
              Topic: <span className="text-zinc-200">{targetTitle}</span>
            </p>
          )}
        </div>

        {/* Respectful Guidelines Box */}
        <div className="space-y-2.5 text-xs text-zinc-300 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
          <div className="flex items-start gap-2.5">
            <MessageSquareHeart className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white">Constructive & Growth-Oriented:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Focus on classroom delivery, voice pacing, student engagement, and board work.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white">Supportive Colleague Tone:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Acknowledge what the apprentice did well before proposing adjustments.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <GraduationCap className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white">Professional Educator Decorum:</strong>
              <p className="text-zinc-400 text-[11px] mt-0.5">
                Zero tolerance for derogatory insults, harassment, or non-academic remarks.
              </p>
            </div>
          </div>
        </div>

        {/* Pledge Checkbox */}
        <label className="flex items-center gap-3 p-3 bg-zinc-950 rounded-xl border border-zinc-800 cursor-pointer hover:border-zinc-700 transition">
          <input
            type="checkbox"
            checked={pledgeAccepted}
            onChange={(e) => setPledgeAccepted(e.target.checked)}
            className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 bg-zinc-900 border-zinc-700 accent-amber-500 cursor-pointer"
          />
          <span className="text-xs text-zinc-300 select-none">
            I pledge my {actionType === 'comment' ? 'comment' : 'recording'} adheres to the{' '}
            <strong className="text-white">National Educator Code of Conduct</strong>.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
          >
            Review & Edit
          </button>

          <button
            type="button"
            disabled={!pledgeAccepted}
            onClick={() => {
              if (pledgeAccepted) {
                onConfirm();
              }
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Submit {actionType === 'comment' ? 'Comment' : 'Post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface CommunityConductToastProps {
  message: string;
  onClose: () => void;
}

export const CommunityConductToast: React.FC<CommunityConductToastProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 text-white shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="space-y-0.5 flex-1 pr-1">
        <h5 className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Community Conduct Verified</span>
        </h5>
        <p className="text-xs text-zinc-300">{message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-zinc-500 hover:text-zinc-300 text-sm"
      >
        ✕
      </button>
    </div>
  );
};
