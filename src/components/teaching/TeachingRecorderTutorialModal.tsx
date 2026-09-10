import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Sun,
  Scissors,
  Save,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  X,
  Sliders,
  Volume2,
  Award,
  Video,
  Lightbulb,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface TeachingRecorderTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDrafts?: () => void;
}

export const TeachingRecorderTutorialModal: React.FC<TeachingRecorderTutorialModalProps> = ({
  isOpen,
  onClose,
  onOpenDrafts,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleFinish = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('studyos_recorder_tutorial_dismissed', 'true');
      } catch (e) {
        // ignore
      }
    }
    onClose();
  };

  const TUTORIAL_STEPS = [
    {
      id: 'audio_check',
      title: '1. Checking Microphone & Voice Audio Level',
      subtitle: 'NCTE Micro-Teaching Audio Standard: 60 to 78 dB',
      icon: <Mic className="w-6 h-6 text-emerald-400" />,
      badge: 'Step 1 of 5',
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Before hitting record, test your voice. Clear articulation and vocal projection are the foundation of effective classroom instruction.
          </p>
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-zinc-400">Microphone Input Level</span>
              <span className="text-emerald-400 font-bold">68 dB • Optimal Speech</span>
            </div>
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden flex">
              <div className="w-2/3 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>Quiet (&lt;50 dB)</span>
              <span className="text-emerald-400 font-bold">Target (60-78 dB)</span>
              <span>Clipping (&gt;85 dB)</span>
            </div>
          </div>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Position your microphone:</strong> Keep 15–30 cm distance from your mouth to avoid popping breath sounds.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Watch for clipping:</strong> If the meter flashes red, slightly reduce input volume or back away from the mic.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'lighting_check',
      title: '2. Lighting & Blackboard Visibility',
      subtitle: 'Frontal Diffused Light: 180 to 350 Lux Target',
      icon: <Sun className="w-6 h-6 text-amber-400" />,
      badge: 'Step 2 of 5',
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Virtual students and campus peer reviewers need to clearly see your facial expressions, lip movement, and blackboard writing.
          </p>
          <div className="grid grid-cols-2 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="text-emerald-400 font-bold text-sm mb-1">Recommended</div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Face the window or lamp directly. Illuminates your gestures and blackboard text without harsh shadows.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <div className="text-rose-400 font-bold text-sm mb-1">Avoid Backlight</div>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Never place bright windows directly behind you; it silhouettes your face and makes board notes unreadable.
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="text-[11px] text-zinc-300">
              <span className="font-bold text-amber-300">Quality Monitor Pill:</span> In the top right corner, verify that the <strong>Lighting Diagnostic</strong> shows a green badge before starting your take.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'pacing_check',
      title: '3. Micro-Teaching Duration & WPM Pacing',
      subtitle: 'Optimal Speed: 110 to 140 Words Per Minute',
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      badge: 'Step 3 of 5',
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Micro-teaching focuses on <strong>one specific skill</strong> (e.g., Set Induction Hook or Blackboard Diagramming) in a concise 2 to 4 minute duration.
          </p>
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-zinc-400 font-mono">Speech Pace Range</span>
              <span className="text-cyan-300 font-bold font-mono">120 WPM (Ideal Pacing)</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">&lt;100 WPM Too Slow</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">110-140 WPM Balanced</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">&gt;150 WPM Rushed</span>
            </div>
          </div>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Use the Teleprompter / Key Notes:</strong> Keep your lesson objective pinned on screen to stay on topic.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span><strong>Interactive Questions:</strong> Expect a simulated student question during the take. Acknowledge and resolve it with positive reinforcement.</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      id: 'trim_slider',
      title: '4. Precision Video Trimming with the Visual Slider',
      subtitle: 'Snip Awkward Pauses & Dead Time',
      icon: <Scissors className="w-6 h-6 text-amber-400" />,
      badge: 'Step 4 of 5',
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            Almost every raw recording has a few seconds of dead time at the start (pressing record) and at the end (reaching to stop). Trimming keeps your campus reel dynamic and engaging.
          </p>
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <div className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
              <span>Interactive Trim Handles Demo</span>
              <span className="font-mono text-zinc-400 text-[10px]">Trimmed: 00:04 ➔ 01:25</span>
            </div>
            {/* Visual Representation of Trim Bar */}
            <div className="relative h-9 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 flex items-center px-1">
              <div className="absolute inset-y-0 left-0 w-[15%] bg-black/60 border-r-2 border-cyan-400 flex items-center justify-center text-[9px] font-mono text-cyan-300">
                [ Cut Start ]
              </div>
              <div className="absolute inset-y-0 left-[15%] right-[15%] bg-amber-500/20 border-y border-amber-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-amber-300">
                ✨ Active Reel Take (Snappy Delivery)
              </div>
              <div className="absolute inset-y-0 right-0 w-[15%] bg-black/60 border-l-2 border-rose-400 flex items-center justify-center text-[9px] font-mono text-rose-300">
                [ Cut End ]
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
              <div>
                <strong className="text-cyan-300">Left Handle:</strong> Drag right to cut initial clearing of throat or setup delay.
              </div>
              <div>
                <strong className="text-rose-300">Right Handle:</strong> Drag left to cut trailing silence or reaching for the mouse.
              </div>
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">
            Click <strong>"Preview Trimmed Window"</strong> to watch only your selected snippet before finalizing.
          </p>
        </div>
      ),
    },
    {
      id: 'drafts_publish',
      title: '5. Saving Drafts vs. Publishing to Campus',
      subtitle: 'Never Lose Work — Resume Anytime',
      icon: <Save className="w-6 h-6 text-teal-400" />,
      badge: 'Step 5 of 5',
      content: (
        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          <p>
            You don't have to publish immediately! StudyOS provides a complete <strong>Drafts Engine</strong> for your micro-teaching takes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                <Save className="w-4 h-4 text-teal-400" />
                <span>Save to Drafts</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Saves your raw take, custom trim positions, audio/lighting diagnostics, and notes locally. You can resume anytime from the <strong>Drafts</strong> tab in the hub.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Publish to Campus</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Applies trimming, binds lesson notes, runs anti-abuse compliance filters, and submits your take to the campus feed for peer rubric reviews and leaderboard ranking!
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-200">
            💡 <strong>Pro-Tip:</strong> Take 2 or 3 quick takes of the same concept. Save the best one as a draft, test different trim boundaries, and publish when you are 100% satisfied.
          </div>
        </div>
      ),
    },
  ];

  const activeStep = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              {activeStep.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold font-mono uppercase tracking-wider">
                  {activeStep.badge}
                </span>
                <span className="text-[11px] text-zinc-400">Novice Studio Guide</span>
              </div>
              <h3 className="text-base font-bold text-zinc-100 mt-0.5">
                {activeStep.title}
              </h3>
              <p className="text-[11px] text-zinc-400">{activeStep.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
            title="Close Tutorial"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Body Content */}
        <div className="min-h-[220px]">
          {activeStep.content}
        </div>

        {/* Step Indicators & Navigation */}
        <div className="space-y-4 pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {TUTORIAL_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentStep === idx
                      ? 'w-6 bg-amber-500'
                      : 'w-2 bg-zinc-700 hover:bg-zinc-600'
                  }`}
                  title={`Go to ${step.title}`}
                />
              ))}
            </div>

            {/* Checkbox */}
            <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-700 text-amber-500 focus:ring-amber-500 bg-zinc-950"
              />
              <span>Don't show automatically</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                currentStep === 0
                  ? 'border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep < TUTORIAL_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(TUTORIAL_STEPS.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-zinc-950 transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ready to Practice!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
