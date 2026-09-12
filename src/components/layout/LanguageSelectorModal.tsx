import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Globe,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Gauge,
  Play,
  Square,
  Radio,
  Sliders,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';
import {
  isWebSpeechSupported,
  getWebSpeechDiagnostics,
  getLanguageSampleText,
  speakText,
  stopSpeaking,
  isSpeaking,
} from '../../utils/speechUtils';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  enableOfflineTTS?: boolean;
  onToggleOfflineTTS?: (enabled: boolean) => void;
  speechRate?: number;
  onChangeSpeechRate?: (rate: number) => void;
  autoPlayLessons?: boolean;
  onToggleAutoPlayLessons?: (enabled: boolean) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
  enableOfflineTTS = true,
  onToggleOfflineTTS,
  speechRate = 1.0,
  onChangeSpeechRate,
  autoPlayLessons = false,
  onToggleAutoPlayLessons,
}) => {
  const [activeTab, setActiveTab] = useState<'language' | 'speech'>('language');
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [internalTTSActive, setInternalTTSActive] = useState<boolean>(enableOfflineTTS);
  const [internalRate, setInternalRate] = useState<number>(speechRate);
  const [internalAutoPlay, setInternalAutoPlay] = useState<boolean>(autoPlayLessons);

  useEffect(() => {
    setInternalTTSActive(enableOfflineTTS);
  }, [enableOfflineTTS]);

  useEffect(() => {
    setInternalRate(speechRate);
  }, [speechRate]);

  useEffect(() => {
    setInternalAutoPlay(autoPlayLessons);
  }, [autoPlayLessons]);

  // Clean up speech when modal closes
  useEffect(() => {
    if (!isOpen && isTestingVoice) {
      stopSpeaking();
      setIsTestingVoice(false);
    }
  }, [isOpen, isTestingVoice]);

  if (!isOpen) return null;

  const diagnostics = getWebSpeechDiagnostics(currentLanguage);
  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const handleToggleTTS = (val: boolean) => {
    setInternalTTSActive(val);
    if (onToggleOfflineTTS) {
      onToggleOfflineTTS(val);
    }
  };

  const handleChangeRate = (rate: number) => {
    setInternalRate(rate);
    if (onChangeSpeechRate) {
      onChangeSpeechRate(rate);
    }
  };

  const handleToggleAutoPlay = (val: boolean) => {
    setInternalAutoPlay(val);
    if (onToggleAutoPlayLessons) {
      onToggleAutoPlayLessons(val);
    }
  };

  const handleTestVoice = () => {
    if (isTestingVoice) {
      stopSpeaking();
      setIsTestingVoice(false);
    } else {
      setIsTestingVoice(true);
      const testPhrase = getLanguageSampleText(currentLanguage);
      speakText(
        testPhrase,
        currentLanguage,
        internalRate,
        () => setIsTestingVoice(false),
        () => setIsTestingVoice(false)
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-sans">
                  Language & Speech Settings
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ⚡ Web Speech API
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Configure curriculum language, explanations, and offline Web Speech TTS for all lessons.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isTestingVoice) stopSpeaking();
              onClose();
            }}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-zinc-800 bg-zinc-950/40 px-6 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'language'
                ? 'border-amber-500 text-amber-300 bg-zinc-900/90'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Learning Language ({currentLangObj.name})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('speech')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-b-2 ${
              activeTab === 'speech'
                ? 'border-amber-500 text-amber-300 bg-zinc-900/90'
                : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Offline Web Speech TTS</span>
            {internalTTSActive ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-zinc-600" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-zinc-900 space-y-5">
          {activeTab === 'language' && (
            <div className="space-y-4">
              {/* Quick Offline TTS status card */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      internalTTSActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-200">
                      Offline Lesson Voice Synthesis
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      {internalTTSActive
                        ? 'Enabled for all lessons via browser Web Speech API'
                        : 'Currently disabled'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('speech')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                >
                  Configure Audio →
                </button>
              </div>

              {/* Language Selection Grid */}
              <div>
                <div className="text-xs font-mono text-zinc-400 uppercase mb-2">
                  Select Language / भाषा चुनें:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = currentLanguage === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onSelectLanguage(lang.code);
                        }}
                        className={`flex items-start justify-between p-3.5 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                            : 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-800/80 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            <span className="font-semibold text-sm text-zinc-100">
                              {lang.nativeName}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                              ({lang.name})
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 line-clamp-1">
                            {lang.description}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="p-1 rounded-full bg-amber-500 text-zinc-950 shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'speech' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Main Offline-First Text-to-Speech Toggle Card */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-100">
                        Offline Web Speech API Synthesis for All Lessons
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        100% Offline
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Enables natural browser-native speech synthesis (using{' '}
                      <code className="text-zinc-300 font-mono bg-zinc-900 px-1 py-0.5 rounded">
                        window.speechSynthesis
                      </code>
                      ) to narrate concepts, intuition blocks, formula derivations, and checkpoint quizzes across all lessons without requiring internet data or cloud credits.
                    </p>
                  </div>

                  {/* Accessible Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={internalTTSActive}
                      onChange={(e) => handleToggleTTS(e.target.checked)}
                      className="sr-only peer"
                      aria-label="Toggle offline-first text-to-speech for all lessons"
                    />
                    <div className="w-12 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                  </label>
                </div>

                {/* Web Speech API Engine Status */}
                <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        diagnostics.isSupported ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'
                      }`}
                    />
                    <span className="font-mono text-zinc-300">
                      Engine:{' '}
                      <strong className="text-zinc-100">
                        {diagnostics.isSupported ? 'Browser Web Speech API Ready' : 'Unsupported Browser'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-zinc-400 text-[11px]">
                    <span>
                      Target Lang:{' '}
                      <strong className="text-amber-400">{diagnostics.targetBcp47}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Voices:{' '}
                      <strong className="text-zinc-200">{diagnostics.voicesCount} available</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* TTS Speech Rate & Pacing Controls */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300 font-bold">
                    <Gauge className="w-4 h-4 text-amber-400" />
                    <span>Narration Pace & Speed</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {internalRate.toFixed(2)}x
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: '0.8x Calm & Clarified', val: 0.8 },
                    { label: '1.0x Standard', val: 1.0 },
                    { label: '1.25x Rapid Revision', val: 1.25 },
                  ].map((rateOption) => (
                    <button
                      key={rateOption.val}
                      type="button"
                      disabled={!internalTTSActive}
                      onClick={() => handleChangeRate(rateOption.val)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                        internalRate === rateOption.val && internalTTSActive
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                      } ${!internalTTSActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      {rateOption.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-play Lesson Setting */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-zinc-200">
                    Auto-Read Concept Summaries
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Automatically speak physical intuition when navigating between concept cards in lessons.
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    disabled={!internalTTSActive}
                    checked={internalAutoPlay}
                    onChange={(e) => handleToggleAutoPlay(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                </label>
              </div>

              {/* Live Web Speech Test Button */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-zinc-800 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Browser Speech Output</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    Hear sample narration in {currentLangObj.name} ({currentLangObj.nativeName})
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!internalTTSActive}
                  onClick={handleTestVoice}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                    isTestingVoice
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950'
                  } ${!internalTTSActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isTestingVoice ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Test Voice (Web Speech)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300">Offline Assurance:</span>{' '}
            Browser Web Speech synthesis runs 100% locally on device hardware with zero network telemetry.
          </p>
          <button
            onClick={() => {
              if (isTestingVoice) stopSpeaking();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors shadow-sm"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
