import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Lightbulb,
  MessageSquare,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
  ChevronRight,
  BarChart2,
} from 'lucide-react';
import { TeachingReelPost } from '../../types/teaching';
import { analyzeReelSentiment, FeedbackTheme, ReelSentimentAnalysis } from '../../services/reelSentimentService';

interface ReelSentimentOverlayProps {
  reel: TeachingReelPost;
  isOpen: boolean;
  onClose: () => void;
  onOpenComments?: () => void;
}

export const ReelSentimentOverlay: React.FC<ReelSentimentOverlayProps> = ({
  reel,
  isOpen,
  onClose,
  onOpenComments,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<FeedbackTheme | null>(null);

  if (!isOpen) return null;

  const analysis: ReelSentimentAnalysis = analyzeReelSentiment(reel);

  const getSentimentBadge = (sentiment: 'positive' | 'constructive' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Strength / Commendation',
        };
      case 'constructive':
        return {
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: <Lightbulb className="w-3.5 h-3.5 text-amber-400" />,
          label: 'Growth Opportunity',
        };
      default:
        return {
          bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          icon: <HelpCircle className="w-3.5 h-3.5 text-blue-400" />,
          label: 'Observation',
        };
    }
  };

  return (
    <div
      className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-auto bg-zinc-900 border border-amber-500/30 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Peer Feedback Sentiment Analysis</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  AI Synthesized
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Common feedback themes extracted from peer comments & faculty reviews
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Sentiment Meter */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-300">Overall Sentiment Tone</span>
              <span className="text-xs font-bold text-amber-300">
                {analysis.sentimentLabel}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{analysis.overallSentimentScore}% Positive</span>
            </div>
          </div>

          {/* Segmented sentiment progress bar */}
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden flex border border-zinc-800">
            <div
              style={{ width: `${analysis.sentimentBreakdown.positivePercent}%` }}
              className="h-full bg-emerald-500 transition-all"
              title={`Praise: ${analysis.sentimentBreakdown.positivePercent}%`}
            />
            <div
              style={{ width: `${analysis.sentimentBreakdown.constructivePercent}%` }}
              className="h-full bg-amber-500 transition-all"
              title={`Constructive: ${analysis.sentimentBreakdown.constructivePercent}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Commendation & Praise ({analysis.sentimentBreakdown.positivePercent}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Coaching & Tips ({analysis.sentimentBreakdown.constructivePercent}%)</span>
            </div>
          </div>
        </div>

        {/* Common Feedback Themes List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-semibold text-zinc-200">Common Peer Feedback Themes</span>
            <span>Tap theme to view peer excerpt</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {analysis.commonThemes.map((theme) => {
              const badge = getSentimentBadge(theme.sentiment);
              const isSelected = selectedTheme?.id === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(isSelected ? null : theme)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-800/90 border-amber-500/50 shadow-md'
                      : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${badge.bg}`}>
                        {badge.icon}
                        <span className="font-bold">{theme.theme}</span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">
                        Mentioned {theme.mentionCount}×
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                          {theme.category}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-zinc-400 transition-transform ${
                          isSelected ? 'rotate-90 text-amber-400' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Sample Peer Quote & Context */}
                  <div className="mt-2 text-xs text-zinc-300 pl-1 border-l-2 border-amber-500/40 italic">
                    "{theme.sampleQuote}"
                  </div>

                  {/* Expanded Inspector */}
                  {isSelected && (
                    <div className="mt-2.5 pt-2.5 border-t border-zinc-800 text-[11px] flex flex-wrap items-center justify-between gap-2 text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Source: Verified {theme.authorRoles.join(', ').replace(/_/g, ' ')}</span>
                      </div>
                      <span className="font-mono text-amber-400 font-semibold">
                        Relevance Confidence: {theme.relevanceScore}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-zinc-800">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
            <span>{reel.comments?.length || 0} Total Peer Comments Analyzed</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenComments && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenComments();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
              >
                View Full Discussion
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
