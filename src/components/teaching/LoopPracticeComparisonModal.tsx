import React from 'react';
import {
  Repeat,
  Trophy,
  Sparkles,
  Play,
  CheckCircle2,
  X,
  Gauge,
  Zap,
  TrendingUp,
  Volume2,
} from 'lucide-react';
import { LoopPracticeTakeComparison } from '../../types/teaching';

interface LoopPracticeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  loopTakes: LoopPracticeTakeComparison[];
  onSelectTakeAsBest: (takeId: string) => void;
  onRecordNextLoopTake: () => void;
  currentBestTakeId?: string;
  topicTitle: string;
}

export const LoopPracticeComparisonModal: React.FC<LoopPracticeComparisonModalProps> = ({
  isOpen,
  onClose,
  loopTakes,
  onSelectTakeAsBest,
  onRecordNextLoopTake,
  currentBestTakeId,
  topicTitle,
}) => {
  if (!isOpen) return null;

  // Calculate improvement delta between first and latest take
  const firstTake = loopTakes[0];
  const latestTake = loopTakes[loopTakes.length - 1];

  const paceDelta = latestTake && firstTake ? latestTake.speechPaceWpm - firstTake.speechPaceWpm : 0;
  const clarityDelta = latestTake && firstTake ? latestTake.clarityScore - firstTake.clarityScore : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Loop Practice Comparison (30-Second Drills)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                  {loopTakes.length} Takes Recorded
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Compare speech pacing, articulation clarity, and keyword coverage across repeated 30-second explanation drills for &quot;{topicTitle}&quot;.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Improvement Summary Banner */}
        {loopTakes.length > 1 && (
          <div className="px-6 py-3 bg-zinc-950/80 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>
                Iteration Progress (Take 1 vs Take {loopTakes.length}):
              </span>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-zinc-300">
                Pacing:{' '}
                <strong
                  className={
                    paceDelta > 0
                      ? 'text-emerald-400'
                      : paceDelta < 0
                      ? 'text-amber-400'
                      : 'text-zinc-400'
                  }
                >
                  {paceDelta > 0 ? `+${paceDelta}` : paceDelta} WPM
                </strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">
                Clarity:{' '}
                <strong
                  className={
                    clarityDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }
                >
                  {clarityDelta > 0 ? `+${clarityDelta}%` : `${clarityDelta}%`}
                </strong>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-300 font-sans font-bold">
                {clarityDelta >= 3
                  ? '🎯 Remarkable pedagogical sharpening!'
                  : 'Consistent delivery rhythm!'}
              </span>
            </div>
          </div>
        )}

        {/* Takes Comparative Cards Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loopTakes.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950/60 rounded-2xl border border-zinc-800 border-dashed space-y-3">
              <p className="text-xs text-zinc-400">
                No 30-second loop practice takes recorded yet. Enable Loop Practice and hit Record to drill your 30s explanation.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loopTakes.map((take, idx) => {
                const isSelectedBest = currentBestTakeId === take.takeId;
                const isOptimalPace =
                  take.speechPaceWpm >= 115 && take.speechPaceWpm <= 135;

                return (
                  <div
                    key={take.takeId}
                    className={`p-4 rounded-2xl border transition-all duration-200 space-y-3 ${
                      isSelectedBest
                        ? 'bg-amber-500/10 border-amber-500/70 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                        : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Card Top */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-zinc-800 text-amber-300 font-mono text-xs font-bold flex items-center justify-center">
                          #{take.takeNumber}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">
                            Take #{take.takeNumber} (30s Drill)
                          </h4>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            Duration: {take.durationSeconds}s
                          </span>
                        </div>
                      </div>

                      {isSelectedBest ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px] flex items-center gap-1 shadow-md shadow-amber-500/20">
                          <Trophy className="w-3 h-3" />
                          <span>Selected Best Take</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onSelectTakeAsBest(take.takeId)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold transition"
                        >
                          Set as Best Take
                        </button>
                      )}
                    </div>

                    {/* Performance Metrics Rows */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-850">
                      {/* Speech Pace */}
                      <div className="space-y-0.5 text-center">
                        <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                          <Gauge className="w-3 h-3 text-amber-400" />
                          <span>Pace</span>
                        </div>
                        <div
                          className={`text-sm font-bold font-mono ${
                            isOptimalPace ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {take.speechPaceWpm} <span className="text-[10px] font-normal text-zinc-500">WPM</span>
                        </div>
                        <div className="text-[9px] text-zinc-500">
                          {isOptimalPace ? 'Ideal Pace' : 'Fast/Slow'}
                        </div>
                      </div>

                      {/* Clarity Score */}
                      <div className="space-y-0.5 text-center border-x border-zinc-800 px-1">
                        <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-400" />
                          <span>Clarity</span>
                        </div>
                        <div className="text-sm font-bold font-mono text-white">
                          {take.clarityScore}%
                        </div>
                        <div className="text-[9px] text-emerald-400 font-medium">
                          {take.clarityScore >= 90 ? 'Crisp Enunciation' : 'Clear'}
                        </div>
                      </div>

                      {/* Voice Modulation */}
                      <div className="space-y-0.5 text-center">
                        <div className="text-[10px] text-zinc-400 flex items-center justify-center gap-1">
                          <Volume2 className="w-3 h-3 text-purple-400" />
                          <span>Modulation</span>
                        </div>
                        <div className="text-sm font-bold font-mono text-white">
                          {take.voiceModulationScore}%
                        </div>
                        <div className="text-[9px] text-zinc-500">
                          Stimulus Variation
                        </div>
                      </div>
                    </div>

                    {/* Keywords Covered */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span>Keywords Articulated:</span>
                        <span className="font-mono text-amber-300 font-semibold">
                          {take.keywordsCoveredCount} detected
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {take.pedagogicalKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 text-[10px] font-medium border border-zinc-700/50"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Transcript snippet */}
                    {take.sampleTranscriptSnippet && (
                      <div className="p-2 rounded-lg bg-black/40 border border-zinc-850 text-[11px] text-zinc-400 italic">
                        &quot;{take.sampleTranscriptSnippet}&quot;
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            NCTE micro-teaching cycles recommend 3-5 loop iterations to cement habituated stimulus variation.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition"
            >
              Close Comparison
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onRecordNextLoopTake();
              }}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Zap className="w-4 h-4" />
              <span>Record Next 30s Loop Take</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
