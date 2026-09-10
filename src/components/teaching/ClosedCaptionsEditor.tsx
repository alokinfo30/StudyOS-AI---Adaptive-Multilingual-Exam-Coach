import React, { useState } from 'react';
import {
  Subtitles,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  Clock,
  Edit3,
} from 'lucide-react';
import { ClosedCaptionSegment, TeachingSkillCategory, TeacherTrainingProgram } from '../../types/teaching';
import {
  generatePedagogicalCaptions,
  formatTimeSeconds,
  exportSubtitlesAsVtt,
} from '../../services/speechToTextService';

interface ClosedCaptionsEditorProps {
  captions: ClosedCaptionSegment[];
  onChangeCaptions: (captions: ClosedCaptionSegment[]) => void;
  totalDurationSeconds: number;
  currentPlaybackTime: number;
  onSeekTo: (seconds: number) => void;
  topicTitle: string;
  skillFocus: TeachingSkillCategory;
  program: TeacherTrainingProgram;
  showCaptionsOverlay: boolean;
  onToggleCaptionsOverlay: () => void;
}

export const ClosedCaptionsEditor: React.FC<ClosedCaptionsEditorProps> = ({
  captions,
  onChangeCaptions,
  totalDurationSeconds,
  currentPlaybackTime,
  onSeekTo,
  topicTitle,
  skillFocus,
  program,
  showCaptionsOverlay,
  onToggleCaptionsOverlay,
}) => {
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Auto-generate pedagogical captions
  const handleRegenerateCaptions = () => {
    const generated = generatePedagogicalCaptions({
      topicTitle,
      skillFocus,
      durationSeconds: totalDurationSeconds || 60,
      program,
    });
    onChangeCaptions(generated);
  };

  // Add new blank caption segment
  const handleAddSegment = () => {
    const lastSeg = captions[captions.length - 1];
    const newStart = lastSeg ? Math.min(totalDurationSeconds, lastSeg.endSeconds) : 0;
    const newEnd = Math.min(totalDurationSeconds, newStart + 5);

    const newSeg: ClosedCaptionSegment = {
      id: `caption_${Date.now()}`,
      startSeconds: newStart,
      endSeconds: newEnd,
      text: 'Enter lesson dialogue or explanation here...',
    };

    const updated = [...captions, newSeg];
    onChangeCaptions(updated);
    setEditingId(newSeg.id);
  };

  // Update a segment
  const handleUpdateSegment = (
    id: string,
    field: keyof ClosedCaptionSegment,
    value: string | number
  ) => {
    const updated = captions.map((seg) => {
      if (seg.id === id) {
        return {
          ...seg,
          [field]: field === 'startSeconds' || field === 'endSeconds' ? Number(value) : value,
        };
      }
      return seg;
    });
    onChangeCaptions(updated);
  };

  // Delete segment
  const handleDeleteSegment = (id: string) => {
    const updated = captions.filter((seg) => seg.id !== id);
    onChangeCaptions(updated);
  };

  // Download .VTT
  const handleDownloadVtt = () => {
    const vtt = exportSubtitlesAsVtt(captions, topicTitle);
    const blob = new Blob([vtt], { type: 'text/vtt;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}_captions.vtt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy all captions text
  const handleCopyText = () => {
    const fullText = captions.map((c) => `[${formatTimeSeconds(c.startSeconds)} - ${formatTimeSeconds(c.endSeconds)}] ${c.text}`).join('\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Subtitles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-wide">
                Speech-to-Text Closed Captions
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                {captions.length} Segments
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Live transcriptions automatically synchronized to your teaching delivery. Review and edit before campus publishing.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleCaptionsOverlay}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              showCaptionsOverlay
                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
            title="Toggle closed captions subtitle display on video"
          >
            <Subtitles className="w-3.5 h-3.5" />
            <span>[CC] {showCaptionsOverlay ? 'Overlay ON' : 'Overlay OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleRegenerateCaptions}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center gap-1.5"
            title="Re-generate pedagogical captions from lesson objectives"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Re-transcribe</span>
          </button>

          <button
            type="button"
            onClick={handleAddSegment}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Segment</span>
          </button>
        </div>
      </div>

      {/* Captions Segments List */}
      {captions.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/40 rounded-xl border border-zinc-850 border-dashed space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Subtitles className="w-6 h-6" />
          </div>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No closed captions captured yet. You can auto-transcribe pedagogical script synchronized with your take or add custom subtitle lines.
          </p>
          <button
            type="button"
            onClick={handleRegenerateCaptions}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Closed Captions</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
          {captions.map((seg, idx) => {
            const isCurrentlyActive =
              currentPlaybackTime >= seg.startSeconds &&
              currentPlaybackTime <= seg.endSeconds;

            return (
              <div
                key={seg.id}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  isCurrentlyActive
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold flex items-center justify-center">
                      #{idx + 1}
                    </span>

                    {/* Time bounds */}
                    <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <input
                        type="number"
                        min="0"
                        max={totalDurationSeconds}
                        step="0.5"
                        value={seg.startSeconds}
                        onChange={(e) =>
                          handleUpdateSegment(seg.id, 'startSeconds', e.target.value)
                        }
                        className="w-14 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-center text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-zinc-500">→</span>
                      <input
                        type="number"
                        min={seg.startSeconds}
                        max={totalDurationSeconds}
                        step="0.5"
                        value={seg.endSeconds}
                        onChange={(e) =>
                          handleUpdateSegment(seg.id, 'endSeconds', e.target.value)
                        }
                        className="w-14 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-center text-xs text-amber-300 focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-[10px] text-zinc-500">
                        ({Math.round((seg.endSeconds - seg.startSeconds) * 10) / 10}s)
                      </span>
                    </div>

                    {isCurrentlyActive && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 animate-pulse">
                        Active Subtitle
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => onSeekTo(seg.startSeconds)}
                      className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium transition flex items-center gap-1"
                      title="Seek player to start of this caption"
                    >
                      <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Play</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSegment(seg.id)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete this caption segment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtitle text input */}
                <textarea
                  rows={2}
                  value={seg.text}
                  onChange={(e) => handleUpdateSegment(seg.id, 'text', e.target.value)}
                  placeholder="Caption text..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 resize-none transition"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Tools: Export VTT & Copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-850 text-xs text-zinc-400">
        <span className="text-[11px] text-zinc-500">
          Tip: Accurate closed captions improve peer evaluation scores and accessibility in Campus Reels.
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition flex items-center gap-1.5 border border-zinc-800"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied Transcript' : 'Copy All Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadVtt}
            className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition flex items-center gap-1.5 border border-zinc-800"
            title="Download WebVTT subtitle track"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>Export .VTT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
