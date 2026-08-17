import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  X,
  ArrowRight,
  Eye,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { requestExplainDifferently } from '../../services/geminiService';
import { speakText, stopSpeaking } from '../../utils/speechUtils';
import { FormulaRenderer } from '../common/FormulaRenderer';

export type PedagogicStyle = 'simple' | 'analogy' | 'visual' | 'socratic' | 'hinglish' | 'practice_check';

interface PedagogicStyleOption {
  id: PedagogicStyle;
  label: string;
  sublabel: string;
  icon: string;
  color: string;
  badge: string;
}

export const PEDAGOGIC_STYLES: PedagogicStyleOption[] = [
  {
    id: 'simple',
    label: '5-Min Plain English',
    sublabel: 'Zero jargon, crystal clear',
    icon: '🧒',
    color: 'emerald',
    badge: 'Beginner Friendly',
  },
  {
    id: 'analogy',
    label: 'Everyday Indian Analogy',
    sublabel: 'Cricket, Chai, Traffic examples',
    icon: '🏏',
    color: 'amber',
    badge: 'Intuitive',
  },
  {
    id: 'visual',
    label: 'Visual & Flow Diagram',
    sublabel: 'ASCII schematic & circuit steps',
    icon: '📐',
    color: 'blue',
    badge: 'Visual Learners',
  },
  {
    id: 'socratic',
    label: 'Socratic Discovery',
    sublabel: 'Guided questions that lead to truth',
    icon: '🧠',
    color: 'purple',
    badge: 'Deep Retention',
  },
  {
    id: 'hinglish',
    label: 'Smart Hinglish',
    sublabel: 'Natural Hindi + English mix',
    icon: '🇮🇳',
    color: 'orange',
    badge: 'Native Feel',
  },
  {
    id: 'practice_check',
    label: 'Instant Practice Check',
    sublabel: 'Micro-challenge to verify concept',
    icon: '🎯',
    color: 'rose',
    badge: 'Exam Drill',
  },
];

interface ExplainDifferentlyViewProps {
  conceptTitle: string;
  formula?: string;
  currentExplanation: string;
  language: LanguageCode;
  onClose?: () => void;
  isInline?: boolean;
}

export const ExplainDifferentlyView: React.FC<ExplainDifferentlyViewProps> = ({
  conceptTitle,
  formula,
  currentExplanation,
  language,
  onClose,
  isInline = false,
}) => {
  const [selectedStyle, setSelectedStyle] = useState<PedagogicStyle>('analogy');
  const [explanationText, setExplanationText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [cachedExplanations, setCachedExplanations] = useState<Record<string, string>>({});

  const fetchExplanation = async (style: PedagogicStyle) => {
    const cacheKey = `${conceptTitle}_${style}_${language}`;
    if (cachedExplanations[cacheKey]) {
      setExplanationText(cachedExplanations[cacheKey]);
      return;
    }

    setIsLoading(true);
    stopSpeaking();
    setIsSpeaking(false);

    try {
      const text = await requestExplainDifferently(
        conceptTitle,
        formula,
        currentExplanation,
        style,
        language
      );
      setExplanationText(text);
      setCachedExplanations((prev) => ({ ...prev, [cacheKey]: text }));
    } catch (err) {
      console.error('Error fetching explanation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation(selectedStyle);
  }, [selectedStyle, conceptTitle, language]);

  const handleSelectStyle = (style: PedagogicStyle) => {
    setSelectedStyle(style);
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      // Clean markdown tags for clear speech
      const cleanText = explanationText.replace(/[#*`$]/g, '');
      speakText(cleanText, language, () => setIsSpeaking(false));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(explanationText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              AI Multi-Pedagogy Engine
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              Concept: {conceptTitle}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
            Explain Differently / अलग-अलग तरीकों से समझें
          </h2>
          <p className="text-xs text-zinc-400">
            Switch pedagogic styles instantly to build intuitive neural pathways.
          </p>
        </div>

        {onClose && !isInline && (
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors self-end sm:self-auto"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 6 Pedagogic Style Selector Pills/Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {PEDAGOGIC_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => handleSelectStyle(style.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/50'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-lg">{style.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">{style.label}</p>
                <span className="text-[9px] text-zinc-400 block truncate mt-0.5">
                  {style.sublabel}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Formula Highlight if exists */}
      {formula && (
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold text-zinc-400 uppercase">Governing Equation:</span>
          <FormulaRenderer formula={formula} />
        </div>
      )}

      {/* Explanation Display Surface */}
      <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-5 sm:p-6 space-y-4 shadow-inner relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 backdrop-blur-xs rounded-2xl z-10 space-y-3">
            <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
            <p className="text-xs font-mono text-amber-300">
              Synthesizing {selectedStyle.toUpperCase()} explanation in {language.toUpperCase()}...
            </p>
          </div>
        ) : null}

        {/* Action toolbar inside card */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400">
              Style: {PEDAGOGIC_STYLES.find((s) => s.id === selectedStyle)?.label}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSpeak}
              disabled={isLoading || !explanationText}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              disabled={isLoading || !explanationText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-700 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-zinc-200 text-sm leading-relaxed space-y-3 font-sans">
          {explanationText.split('\n\n').map((para, i) => {
            if (para.startsWith('```')) {
              const codeContent = para.replace(/```[a-z]*\n?/g, '');
              return (
                <pre
                  key={i}
                  className="p-4 bg-zinc-900 rounded-xl font-mono text-xs text-amber-300 overflow-x-auto border border-zinc-800"
                >
                  {codeContent}
                </pre>
              );
            }
            if (para.startsWith('###')) {
              return (
                <h4 key={i} className="text-sm font-bold text-amber-400 mt-2">
                  {para.replace('###', '').trim()}
                </h4>
              );
            }
            return <p key={i}>{para}</p>;
          })}
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl animate-fadeIn">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {content}
      </div>
    </div>
  );
};
