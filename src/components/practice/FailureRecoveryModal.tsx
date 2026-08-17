import React, { useState } from 'react';
import { X, ShieldAlert, Sparkles, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import { LanguageCode } from '../../types';

interface FailureRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  conceptTitle: string;
  language: LanguageCode;
}

export const FailureRecoveryModal: React.FC<FailureRecoveryModalProps> = ({
  isOpen,
  onClose,
  conceptTitle,
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-rose-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Failure Recovery Engine / कमजोरी सुधार सत्र
              </h3>
              <p className="text-xs text-rose-300">
                Recurring difficulty detected in: <span className="font-semibold">{conceptTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-step Remediation Sequence */}
        <div className="p-6 overflow-y-auto space-y-5 bg-zinc-900">
          {/* Step indicator */}
          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-3">
            <span className="text-amber-400 font-bold">Remediation Step {step} of 4</span>
            <span className="text-zinc-400">Target: Eliminate Root Misconception</span>
          </div>

          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 font-mono">1. Root Misconception Breakdown</span>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Students often mix up <strong>Series</strong> (current is uniform everywhere) and <strong>Parallel</strong> (voltage is uniform across each individual branch).
                </p>
                <div className="p-3 bg-zinc-900 rounded-lg text-xs font-mono text-amber-300 border border-zinc-800">
                  Rule of Thumb: In Parallel, each component receives the exact full battery voltage (220V).
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 font-mono">2. Unforgettable Real-Life Metaphor</span>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Think of a 4-lane Highway Toll Plaza vs a Single-lane Mountain Pass:
                  <br />
                  - <strong>Parallel Toll Gates</strong>: Adding more gates <em>reduces</em> the overall traffic jam (Req drops).
                  <br />
                  - <strong>Series Checkpoints</strong>: Adding more checkpoints <em>increases</em> total delay (Req increases).
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <span className="text-xs font-bold text-blue-400 font-mono">3. Rapid Diagnostic Check</span>
                <p className="text-sm text-zinc-200">
                  If two 10-ohm resistors are connected in parallel, what is their equivalent resistance?
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700">
                    A) 20 ohms
                  </button>
                  <button className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500 text-emerald-300">
                    B) 5 ohms (Correct: 10 / 2 = 5)
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 animate-fadeIn text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-zinc-100">Recovery Concept Re-Calibrated!</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Your mastery score is recalibrated. We have scheduled 2 spaced-repetition practice questions over the next 48 hours to lock in long-term retention.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
          >
            Close Recovery
          </button>
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1.5"
            >
              <span>Next Recovery Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all"
            >
              Resume Adaptive Practice ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
