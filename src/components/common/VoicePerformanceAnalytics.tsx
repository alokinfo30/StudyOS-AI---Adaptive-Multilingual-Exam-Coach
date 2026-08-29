import React, { useState } from 'react';
import {
  Mic,
  Activity,
  Award,
  Zap,
  TrendingUp,
  Sparkles,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  BarChart3,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import { VoicePerformanceMetrics } from '../../types';
import { analyzeVoicePerformance } from '../../services/voiceAnalyticsService';

interface VoicePerformanceAnalyticsProps {
  metrics: VoicePerformanceMetrics | null;
  onSimulateTestSpeech?: (sampleText: string, sampleDuration: number) => void;
  isOpenInModal?: boolean;
}

const SAMPLE_SPEECHES = [
  {
    title: 'High Confidence Viva Answer',
    text: "Ohm's law states that current flowing through a conductor is directly proportional to the potential difference across its ends, provided temperature remains constant. Therefore, V equals I times R.",
    duration: 9,
  },
  {
    title: 'Hesitant / Thinking Aloud',
    text: "Um, basically, when you increase the wire length, uh, resistance increases because electrons collide more, like, with the lattice ions, you know.",
    duration: 12,
  },
  {
    title: 'Fast-Paced Derivation',
    text: "For resistors in parallel, voltage is identical across every branch. Current splits such that total current equals I1 plus I2 plus I3, leading to one over R equivalent equals one over R1 plus one over R2.",
    duration: 8,
  },
];

export const VoicePerformanceAnalytics: React.FC<VoicePerformanceAnalyticsProps> = ({
  metrics: initialMetrics,
  onSimulateTestSpeech,
}) => {
  const [currentMetrics, setCurrentMetrics] = useState<VoicePerformanceMetrics | null>(
    initialMetrics || analyzeVoicePerformance(SAMPLE_SPEECHES[0].text, SAMPLE_SPEECHES[0].duration)
  );
  const [activeSampleIndex, setActiveSampleIndex] = useState(0);

  const handleRunSample = (index: number) => {
    setActiveSampleIndex(index);
    const sample = SAMPLE_SPEECHES[index];
    const evaluated = analyzeVoicePerformance(sample.text, sample.duration);
    setCurrentMetrics(evaluated);
    if (onSimulateTestSpeech) {
      onSimulateTestSpeech(sample.text, sample.duration);
    }
  };

  const metrics = initialMetrics || currentMetrics;

  if (!metrics) {
    return (
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-center space-y-2">
        <Mic className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
        <h4 className="text-xs font-bold text-zinc-200">Voice Performance Analytics</h4>
        <p className="text-[11px] text-zinc-400">
          Dictate your answer using the microphone to analyze your vocal pace, tone confidence, and hesitation markers.
        </p>
      </div>
    );
  }

  // Color mapping based on score
  const getConfidenceBadge = (score: number) => {
    if (score >= 85) return { bg: 'bg-emerald-500/15', text: 'text-emerald-300', label: 'Mastery Level' };
    if (score >= 70) return { bg: 'bg-blue-500/15', text: 'text-blue-300', label: 'Confident & Assertive' };
    if (score >= 55) return { bg: 'bg-amber-500/15', text: 'text-amber-300', label: 'Moderate / Cautious' };
    return { bg: 'bg-rose-500/15', text: 'text-rose-300', label: 'Hesitant / Practice Needed' };
  };

  const badge = getConfidenceBadge(metrics.confidenceScore);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
              <span>Voice Tone & Confidence Analytics</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/30 ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </h4>
            <p className="text-[10px] text-zinc-400">Real-time speech cadence, hesitation index & verbal clarity evaluation</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Metric 1: Confidence Score */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
            <span>Confidence</span>
            <Award className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-lg font-black text-amber-400 font-mono">
            {metrics.confidenceScore}%
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-500"
              style={{ width: `${metrics.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Cadence / WPM */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
            <span>Speech Pace</span>
            <Clock className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-lg font-black text-blue-400 font-mono">
            {metrics.wpm} <span className="text-[10px] font-normal text-zinc-400">WPM</span>
          </div>
          <div className="text-[10px] text-zinc-400 capitalize">
            {metrics.pacingRating === 'ideal' ? '✨ Ideal Cadence' : metrics.pacingRating === 'too_slow' ? '⏱️ Deliberate' : '⚡ Rapid'}
          </div>
        </div>

        {/* Metric 3: Clarity Score */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
            <span>Articulation</span>
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {metrics.clarityScore}%
          </div>
          <div className="text-[10px] text-zinc-400 capitalize">
            {metrics.vocalPitchDynamic} pitch
          </div>
        </div>

        {/* Metric 4: Hesitations */}
        <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center justify-between">
            <span>Filler Words</span>
            <AlertTriangle className="w-3 h-3 text-rose-400" />
          </div>
          <div className="text-lg font-black text-rose-400 font-mono">
            {metrics.hesitationCount} <span className="text-[10px] font-normal text-zinc-400">fillers</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            {metrics.hesitationCount === 0 ? '✨ Zero hesitation' : 'Needs smoothing'}
          </div>
        </div>
      </div>

      {/* Spoken Voice Insights */}
      <div className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-2">
        <div className="text-[11px] font-bold font-mono text-zinc-200 uppercase flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Speech Delivery Diagnosis</span>
        </div>
        <ul className="space-y-1.5 text-xs text-zinc-300">
          {metrics.keyInsights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-amber-400 shrink-0">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actionable Speech Improvement Plan */}
      <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
        <div className="text-[11px] font-bold font-mono text-amber-300 uppercase flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Personalized Vocal Coaching Suggestions</span>
        </div>
        <ul className="space-y-1 text-xs text-amber-100/90">
          {metrics.speechImprovementPlan.map((plan, idx) => (
            <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-amber-400 font-bold shrink-0">{idx + 1}.</span>
              <span>{plan}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Try Sample Speech Buttons */}
      <div className="pt-1 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Benchmark speech samples:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_SPEECHES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleRunSample(idx)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                activeSampleIndex === idx
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
