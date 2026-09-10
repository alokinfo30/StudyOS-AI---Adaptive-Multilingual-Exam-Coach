import React from 'react';
import { AlertOctagon, ShieldAlert, Ban, RefreshCw } from 'lucide-react';
import { UserModerationRecord } from '../../types/teaching';

interface ModerationViolationAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  flaggedWords: string[];
  reason: string;
  moderationRecord: UserModerationRecord;
  onResetRecordForTesting?: () => void;
}

export const ModerationViolationAlertModal: React.FC<ModerationViolationAlertModalProps> = ({
  isOpen,
  onClose,
  flaggedWords,
  reason,
  moderationRecord,
  onResetRecordForTesting,
}) => {
  if (!isOpen) return null;

  const isBanned = moderationRecord.isBanned;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div
        className="bg-zinc-900 border-2 border-rose-500/60 rounded-3xl max-w-md w-full p-6 shadow-2xl text-zinc-100 relative animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
      >
        {/* Header Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            {isBanned ? <Ban className="w-7 h-7" /> : <ShieldAlert className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-lg font-black text-rose-400 tracking-tight uppercase">
              {isBanned ? 'Account Auto-Banned' : 'Violation Strike Issued'}
            </h3>
            <p className="text-xs text-zinc-400">
              Campus Professional Ethics & Anti-Abuse System
            </p>
          </div>
        </div>

        {/* Warning Body */}
        <div className="space-y-3 bg-zinc-950/80 p-4 rounded-2xl border border-rose-950/80 mb-5">
          {isBanned ? (
            <div className="space-y-2 text-xs text-zinc-300">
              <p className="text-rose-300 font-semibold leading-relaxed">
                Your account has been automatically suspended due to exceeding the maximum permitted conduct violations ({moderationRecord.violationCount}/3 strikes).
              </p>
              <p className="text-zinc-400">
                Under the National Council for Teacher Education (NCTE) & Apprentice Educator code, abusive language, bullying, and derogatory remarks toward student teachers are strictly prohibited.
              </p>
            </div>
          ) : (
            <div className="space-y-2 text-xs text-zinc-300">
              <p className="leading-relaxed text-zinc-200">{reason}</p>
              {flaggedWords && flaggedWords.length > 0 && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300">
                  <span className="font-semibold block text-[11px] uppercase tracking-wider mb-1 text-rose-400">
                    Prohibited Word(s) Detected:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {flaggedWords.map((w, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-rose-950/80 border border-rose-700/60 rounded text-rose-200 font-mono text-xs"
                      >
                        "{w}"
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Strikes Counter Indicator */}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Your Conduct Status:</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((strikeIndex) => (
                <span
                  key={strikeIndex}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    strikeIndex <= moderationRecord.violationCount
                      ? 'bg-rose-600 text-white font-black animate-pulse shadow-sm shadow-rose-600/50'
                      : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                  }`}
                >
                  {strikeIndex}
                </span>
              ))}
              <span className="text-xs font-semibold text-rose-400 ml-1">
                {moderationRecord.violationCount >= 3 ? 'BANNED' : `${moderationRecord.violationCount}/3 Strikes`}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between gap-3">
          {onResetRecordForTesting && (
            <button
              type="button"
              onClick={() => {
                onResetRecordForTesting();
                onClose();
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition"
              title="Reset strikes for testing / demo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Strikes (Demo)
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="ml-auto px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
          >
            I Understand & Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};
