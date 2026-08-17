import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  RefreshCw,
  Lightbulb,
  Compass,
  LayoutGrid,
  HelpCircle,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { requestExplainDifferently } from '../../services/geminiService';
import { speakText, stopSpeaking } from '../../utils/speechUtils';

interface ExplainDifferentlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  conceptTitle: string;
  formula?: string;
  currentExplanation: string;
  language: LanguageCode;
}

type ModeKey = 'analogy' | 'simple' | 'visual' | 'socratic' | 'hinglish' | 'practice_check';

interface ModeOption {
  key: ModeKey;
  label: string;
  icon: React.ElementType;
  description: string;
}

const MODES: ModeOption[] = [
  {
    key: 'analogy',
    label: 'Real-Life Analogy',
    icon: Lightbulb,
    description: 'Indian everyday situations (cricket, water pipes, kitchen)',
  },
  {
    key: 'simple',
    label: 'Simple (ELI10)',
    icon: Compass,
    description: 'Zero jargon, high intuition, pure fundamentals',
  },
  {
    key: 'visual',
    label: 'Visual Breakdown',
    icon: LayoutGrid,
    description: 'ASCII schematics, flowcharts & spatial diagrams',
  },
  {
    key: 'socratic',
    label: 'Socratic Discovery',
    icon: HelpCircle,
    description: '3 guided questions to discover the rule yourself',
  },
  {
    key: 'hinglish',
    label: 'Smart Hinglish',
    icon: Languages,
    description: 'Conversational Hindi with English technical terms',
  },
  {
    key: 'practice_check',
    label: 'Quick Practice Check',
    icon: CheckCircle2,
    description: 'Rapid diagnostic question to test your grip immediately',
  },
];

export const ExplainDifferentlyModal: React.FC<ExplainDifferentlyModalProps> = ({
  isOpen,
  onClose,
  conceptTitle,
  formula,
  currentExplanation,
  language,
}) => {
  const [activeMode, setActiveMode] = useState<ModeKey>('analogy');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadContent(activeMode);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
    }
  }, [isOpen, activeMode, language]);

  const loadContent = async (mode: ModeKey) => {
    setIsLoading(true);
    stopSpeaking();
    setIsSpeaking(false);
    try {
      const text = await requestExplainDifferently(
        conceptTitle,
        formula,
        currentExplanation,
        mode,
        language
      );
      setContent(text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(content, language, () => setIsSpeaking(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100">
                Explain Differently / अलग तरीके से समझें
              </h3>
              <p className="text-xs text-zinc-400 font-medium">{conceptTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1 p-2 bg-zinc-950 border-b border-zinc-800/80">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.key;
            return (
              <button
                key={mode.key}
                onClick={() => setActiveMode(mode.key)}
                className={`flex flex-col items-center justify-center text-center p-2.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-amber-300 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span className="truncate w-full">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-900 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
              <p className="text-sm text-zinc-400">Generating tailored explanation...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none text-zinc-200 text-sm leading-relaxed whitespace-pre-line bg-zinc-950/70 p-5 rounded-xl border border-zinc-800 font-sans">
              {content}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              disabled={isLoading || !content}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen Aloud'}</span>
            </button>
            <button
              onClick={() => loadContent(activeMode)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            I Understand This Now ➔
          </button>
        </div>
      </div>
    </div>
  );
};
