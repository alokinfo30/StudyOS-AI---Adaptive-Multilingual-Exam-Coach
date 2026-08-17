import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  AlertCircle,
  HelpCircle,
  FileCode,
  CheckCircle2,
  X,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import {
  DevInterviewQuestion,
  DeveloperLevel,
  TechTrack,
  DevGeneratedAnswerResult,
  DevAnswerStyle,
} from '../../types';
import { generateDevInterviewAnswer } from '../../services/geminiService';
import { useVoiceDictation, DICTATION_LANGUAGES } from '../../hooks/useVoiceDictation';
import { speakText, stopSpeaking } from '../../utils/speechUtils';

interface VoiceAnswerGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: DevInterviewQuestion;
  track: TechTrack;
  trackName: string;
  level: DeveloperLevel;
  onApplyAnswer: (answerText: string) => void;
  initialSpokenNotes?: string;
}

const ANSWER_STYLES: {
  id: DevAnswerStyle;
  label: string;
  tag: string;
  description: string;
  icon: string;
}[] = [
  {
    id: 'senior_architecture',
    label: 'Senior Architecture & Scale',
    tag: 'Staff / Architect',
    description: 'High-throughput scalability, memory profiling, concurrency hazards & production trade-offs.',
    icon: '🏛️',
  },
  {
    id: 'star_method',
    label: 'STAR Method Delivery',
    tag: 'Behavioral & Tech',
    description: 'Situation, Task, Technical Action taken, and Quantified Business/System Results.',
    icon: '🎯',
  },
  {
    id: 'concise_executive',
    label: '60-Sec Executive Summary',
    tag: 'Crisp Soundbites',
    description: 'Punchy 30-60 second elevator pitch with key soundbites and zero fluff.',
    icon: '⚡',
  },
  {
    id: 'code_and_complexity',
    label: 'Code & Big-O Walkthrough',
    tag: 'Live Coding / DSA',
    description: 'Algorithmic breakdown, step-by-step logic, Big-O time/space proof & edge-cases.',
    icon: '💻',
  },
];

export const VoiceAnswerGeneratorModal: React.FC<VoiceAnswerGeneratorModalProps> = ({
  isOpen,
  onClose,
  question,
  track,
  trackName,
  level,
  onApplyAnswer,
  initialSpokenNotes = '',
}) => {
  const [selectedStyle, setSelectedStyle] = useState<DevAnswerStyle>('senior_architecture');
  const [calibratedLevel, setCalibratedLevel] = useState<DeveloperLevel>(level);
  const [spokenNotes, setSpokenNotes] = useState(initialSpokenNotes);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<DevGeneratedAnswerResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'voice_studio' | 'generated_answer'>('voice_studio');

  // Voice dictation hook
  const {
    isListening,
    interimTranscript,
    error: micError,
    isSupported: isMicSupported,
    durationSeconds,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    selectedLang,
    setSelectedLang,
  } = useVoiceDictation({
    language: 'en-IN',
    continuous: true,
    onResult: (chunk, isFinal) => {
      if (isFinal) {
        setSpokenNotes((prev) => (prev ? `${prev.trim()} ${chunk.trim()}` : chunk.trim()));
      }
    },
  });

  // Sync initial notes if modal opens with new prompt
  useEffect(() => {
    if (isOpen) {
      if (initialSpokenNotes && !spokenNotes) {
        setSpokenNotes(initialSpokenNotes);
      }
      setCalibratedLevel(level);
    } else {
      stopSpeaking();
      setIsPlayingAudio(false);
      if (isListening) stopListening();
    }
  }, [isOpen, level, initialSpokenNotes]);

  if (!isOpen) return null;

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Generate Answer handler
  const handleGenerateAnswer = async () => {
    if (isListening) {
      stopListening();
    }
    setIsGenerating(true);
    try {
      const res = await generateDevInterviewAnswer(
        question.prompt,
        spokenNotes,
        trackName,
        calibratedLevel,
        selectedStyle,
        question.expectedAnswerSummary
      );
      setGeneratedResult(res);
      setActiveTab('generated_answer');
    } catch (e) {
      console.error('Failed to generate dev answer', e);
    } finally {
      setIsGenerating(false);
    }
  };

  // TTS Speech Handler
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else if (generatedResult) {
      setIsPlayingAudio(true);
      const textToRead = `${generatedResult.structuredAnswer}. Key soundbites to say aloud: ${generatedResult.keyTalkingPoints.join(
        '. '
      )}`;
      speakText(textToRead, 'en', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.structuredAnswer);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Apply to candidate answer box
  const handleApplyToAnswer = () => {
    if (!generatedResult) return;
    onApplyAnswer(generatedResult.structuredAnswer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Voice to Text Answer Generator
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                  {trackName} • {calibratedLevel.toUpperCase()}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-100 font-sans truncate max-w-md sm:max-w-xl">
                {question.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              if (isListening) stopListening();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header Tabs */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-zinc-900/50 border-b border-zinc-800/80 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('voice_studio')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'voice_studio'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>1. Record & Prompt Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('generated_answer')}
              disabled={!generatedResult && !isGenerating}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'generated_answer'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : generatedResult
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>2. Expert Model Answer {generatedResult && '✓'}</span>
            </button>
          </div>

          {/* Calibrate Level Selector */}
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <span className="text-[11px] font-mono">Calibrated Depth:</span>
            <select
              value={calibratedLevel}
              onChange={(e) => setCalibratedLevel(e.target.value as DeveloperLevel)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="beginner">Junior (Fundamentals)</option>
              <option value="intermediate">Mid-Level (Practical)</option>
              <option value="senior">Senior (Architecture & Concurrency)</option>
              <option value="top_class">Staff/Principal (Scale & Trade-Offs)</option>
            </select>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeTab === 'voice_studio' ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Question Context Card */}
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800/80 space-y-2">
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Technical Interview Question:
                </span>
                <p className="text-sm font-medium text-zinc-200 leading-relaxed font-sans">
                  {question.prompt}
                </p>
              </div>

              {/* Answering Framework Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    Select Answering Framework:
                  </label>
                  <span className="text-[11px] font-mono text-amber-400">
                    {ANSWER_STYLES.find((s) => s.id === selectedStyle)?.tag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ANSWER_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                            : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base mr-2">{style.icon}</span>
                          <span className="text-xs font-bold text-zinc-100 flex-1 truncate">
                            {style.label}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                            {style.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                          {style.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice-to-Text Recording Panel */}
              <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                        <Mic className="w-4 h-4 text-amber-400" />
                        Voice-to-Text Dictation Studio
                      </h3>
                      {isListening && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          RECORDING • {formatTime(durationSeconds)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">
                      Speak your rough thoughts, design ideas, or code logic. The AI will elevate it into a Staff-level answer.
                    </p>
                  </div>

                  {/* Dictation Language Selector */}
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
                    >
                      {DICTATION_LANGUAGES.map((dl) => (
                        <option key={dl.code} value={dl.code}>
                          {dl.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Mic Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => toggleListening()}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md ${
                      isListening
                        ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>STOP RECORDING</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>START SPEAKING (VOICE-TO-TEXT)</span>
                      </>
                    )}
                  </button>

                  {spokenNotes && (
                    <button
                      onClick={() => {
                        setSpokenNotes('');
                        resetTranscript();
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Notes</span>
                    </button>
                  )}
                </div>

                {/* Mic Error Notice */}
                {micError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{micError}</span>
                  </div>
                )}

                {/* Interim Live Speech Stream */}
                {isListening && (
                  <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2 animate-fadeIn">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                    <span className="font-mono text-zinc-400">Listening:</span>
                    <span className="font-sans italic">{interimTranscript || 'Speak into microphone...'}</span>
                  </div>
                )}

                {/* Editable Transcript Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Your Spoken Notes & Bullet Ideas:</span>
                    <span className="text-zinc-500">
                      {spokenNotes.length} characters • Editable
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={spokenNotes}
                    onChange={(e) => setSpokenNotes(e.target.value)}
                    placeholder="E.g., I would use Redis caching with LRU eviction, handle race conditions via atomic locks, and partition the database table by user_id to prevent write bottlenecks..."
                    className="w-full p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Action Button: Generate Model Tech Answer */}
              <div className="pt-2 flex justify-end">
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateAnswer}
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 transition-all shadow-lg flex items-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Synthesizing Staff-Level Tech Answer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-zinc-950" />
                      <span>GENERATE COMPLETE TECH INTERVIEW ANSWER ➔</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Tab 2: Generated Expert Model Answer */
            <div className="space-y-6 animate-fadeIn">
              {generatedResult ? (
                <div className="space-y-6">
                  {/* Top Bar Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {calibratedLevel.toUpperCase()} Model Answer
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          Style: {selectedStyle.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-300">
                        Tailored for <strong>{trackName}</strong> with Big-O analysis and trade-offs.
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Read Out Aloud (TTS) */}
                      <button
                        onClick={handleToggleAudio}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isPlayingAudio
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-700'
                        }`}
                        title="Listen to model voice delivery"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-emerald-400' : ''}`} />
                        <span>{isPlayingAudio ? 'Stop Audio' : '🔊 Listen Delivery'}</span>
                      </button>

                      {/* Copy */}
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-all flex items-center gap-1.5"
                      >
                        {hasCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 30-Second Key Soundbites (What to say out loud) */}
                  {generatedResult.keyTalkingPoints?.length > 0 && (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                        <Zap className="w-4 h-4" />
                        <span>30-Second Opening Soundbites (Say These First):</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-200">
                        {generatedResult.keyTalkingPoints.map((pt, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-zinc-950/60 p-2.5 rounded-lg border border-amber-500/20">
                            <span className="text-amber-400 font-bold shrink-0">#{idx + 1}</span>
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Complexity & Trade-Offs Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedResult.timeAndSpaceComplexity && (
                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                        <div className="font-mono text-zinc-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          Algorithmic Complexity & Bounds:
                        </div>
                        <div className="font-mono text-zinc-200 font-semibold">
                          {generatedResult.timeAndSpaceComplexity}
                        </div>
                      </div>
                    )}

                    {generatedResult.tradeOffs?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1">
                        <div className="font-mono text-zinc-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-purple-400" />
                          Architecture Trade-Offs Evaluated:
                        </div>
                        <ul className="text-zinc-300 text-[11px] list-disc list-inside space-y-0.5">
                          {generatedResult.tradeOffs.map((t, idx) => (
                            <li key={idx} className="truncate">{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Structured Full Written/Spoken Answer */}
                  <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                      Complete Articulated Response:
                    </span>
                    <div className="text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans space-y-2">
                      {generatedResult.structuredAnswer}
                    </div>
                  </div>

                  {/* Code Snippet / ASCII Flow */}
                  {generatedResult.codeOrDiagramSnippet && (
                    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-zinc-400 uppercase flex items-center gap-1.5">
                          <FileCode className="w-3.5 h-3.5 text-amber-400" />
                          Implementation / Architecture Reference:
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{track}</span>
                      </div>
                      <pre className="p-3.5 rounded-lg bg-zinc-950 font-mono text-xs text-emerald-300 overflow-x-auto border border-zinc-800/80 leading-relaxed">
                        {generatedResult.codeOrDiagramSnippet}
                      </pre>
                    </div>
                  )}

                  {/* Pitfalls Avoided & Follow-Up Prep */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {generatedResult.topPitfallsAvoided?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-800/40 text-xs space-y-1.5">
                        <strong className="text-rose-400 flex items-center gap-1.5 text-[11px] uppercase font-mono">
                          <ShieldCheck className="w-3.5 h-3.5" /> Common Candidate Pitfalls Avoided:
                        </strong>
                        <ul className="text-zinc-400 text-[11px] list-disc list-inside space-y-1">
                          {generatedResult.topPitfallsAvoided.map((p, idx) => (
                            <li key={idx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {generatedResult.suggestedFollowUpPrep?.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 text-xs space-y-1.5">
                        <strong className="text-purple-400 flex items-center gap-1.5 text-[11px] uppercase font-mono">
                          <HelpCircle className="w-3.5 h-3.5" /> Likely Interviewer Follow-Ups:
                        </strong>
                        <ul className="text-zinc-400 text-[11px] list-disc list-inside space-y-1">
                          {generatedResult.suggestedFollowUpPrep.map((f, idx) => (
                            <li key={idx}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-zinc-800">
                    <button
                      onClick={() => setActiveTab('voice_studio')}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Adjust Spoken Notes & Style</span>
                    </button>

                    <button
                      onClick={handleApplyToAnswer}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>INSERT INTO MY INTERVIEW ANSWER BOX</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-zinc-500 space-y-3">
                  <Sparkles className="w-8 h-8 mx-auto text-zinc-600 animate-pulse" />
                  <p className="text-sm">No answer generated yet. Go back to Record Studio and click generate!</p>
                  <button
                    onClick={() => setActiveTab('voice_studio')}
                    className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-xl text-xs font-bold hover:bg-zinc-700"
                  >
                    Go to Voice Studio
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
