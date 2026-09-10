import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Scale, CheckCircle2, UserX, BookOpen } from 'lucide-react';
import { UserModerationRecord } from '../../types/teaching';

interface CodeOfConductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  moderationRecord: UserModerationRecord;
}

export const CodeOfConductModal: React.FC<CodeOfConductModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  moderationRecord,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="bg-zinc-900 border border-amber-500/30 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-zinc-100 relative my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Apprentice Educator Ethics & Respect Policy
            </h3>
            <p className="text-xs text-amber-400 font-medium">
              National Teacher Training Practicum Standard • Zero-Tolerance Anti-Abuse
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="space-y-3 text-sm text-zinc-300 mb-5 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/80">
          <div className="flex items-start gap-3">
            <BookOpen className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong className="text-white">Dignity of the Teaching Profession:</strong> Whether you are a B.Ed, BTC / D.El.Ed trainee, or ITI technical instructor, our campus is a sanctuary of mutual encouragement, constructive peer review, and academic decorum.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Scale className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong className="text-white">Constructive Pedagogical Feedback:</strong> Comments, peer appraisals, and judging remarks must be respectful, objective, and aimed at helping trainees improve their classroom craft.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
            <div className="text-xs leading-relaxed">
              <strong className="text-rose-300">Automated Content Moderation & Auto-Ban:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-400">
                <li>Strictly prohibits vulgarity, cuss words, personal insults, or demeaning attacks.</li>
                <li>Every comment and post is filtered by our automated AI moderation system in real-time.</li>
                <li>
                  <span className="text-rose-400 font-semibold">Violation Strikes Policy:</span> Inappropriate words result in an instant violation strike. Receiving 3 strikes triggers an <strong className="text-rose-400">Automated Account Ban</strong> from all campus commenting and publishing.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Account Status */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/50 rounded-xl mb-5 text-xs">
          <div className="flex items-center gap-2">
            <UserX className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-400">Your Disciplinary Record:</span>
          </div>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full ${
              moderationRecord.violationCount === 0
                ? 'bg-emerald-500/20 text-emerald-400'
                : moderationRecord.violationCount >= 3
                ? 'bg-rose-500/20 text-rose-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}
          >
            {moderationRecord.violationCount} / 3 Strikes
            {moderationRecord.isBanned && ' (BANNED)'}
          </span>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-start gap-3 p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-2xl cursor-pointer hover:bg-amber-500/10 transition mb-6">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500/30 border-zinc-700 bg-zinc-800"
          />
          <span className="text-xs text-zinc-200 leading-snug">
            I understand and pledge to uphold the <strong className="text-amber-300">Teacher Trainee Professional Respect Code</strong>. I acknowledge that posting abusive or inappropriate language will result in an immediate strike and automated account ban.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!hasAgreed}
            onClick={() => {
              if (hasAgreed) {
                onAccept();
                onClose();
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
              hasAgreed
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-amber-500/20'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
