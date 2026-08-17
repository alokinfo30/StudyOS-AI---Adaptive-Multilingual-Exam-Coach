import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, FastForward, Sparkles } from 'lucide-react';
import { LanguageCode } from '../../types';
import { speakText, stopSpeaking, isSpeaking, detectBrowserLanguage } from '../../utils/speechUtils';

interface SpeechSynthesisPlayerProps {
  textToSpeak: string;
  language?: LanguageCode;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'button' | 'pill' | 'card';
  className?: string;
  showSpeedControl?: boolean;
}

export const SpeechSynthesisPlayer: React.FC<SpeechSynthesisPlayerProps> = ({
  textToSpeak,
  language,
  title = 'Read Aloud (TTS)',
  size = 'sm',
  variant = 'button',
  className = '',
  showSpeedControl = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  // Auto-detect browser language if not explicitly provided or defaulted
  const effectiveLanguage = language || detectBrowserLanguage('hi');

  useEffect(() => {
    return () => {
      if (isPlaying) {
        stopSpeaking();
      }
    };
  }, [isPlaying]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      const success = speakText(
        textToSpeak,
        effectiveLanguage,
        speechRate,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
      if (!success) {
        setIsPlaying(false);
      }
    }
  };

  const handleCycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRate = speechRate === 0.8 ? 1.0 : speechRate === 1.0 ? 1.25 : 0.8;
    setSpeechRate(nextRate);
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(true);
      speakText(
        textToSpeak,
        effectiveLanguage,
        nextRate,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  // Inline Icon Mode (Minimal footprint)
  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`inline-flex items-center justify-center p-1.5 rounded-md text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${className}`}
        title={isPlaying ? 'Stop Audio' : `Listen in ${effectiveLanguage.toUpperCase()}`}
        aria-label={isPlaying ? 'Stop Audio' : 'Play Audio'}
      >
        {isPlaying ? (
          <span className="relative flex items-center justify-center">
            <VolumeX className="w-4 h-4 text-amber-400 animate-pulse" />
          </span>
        ) : (
          <Volume2 className="w-4 h-4 text-zinc-400 hover:text-amber-400" />
        )}
      </button>
    );
  }

  // Pill / Tag Mode
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
          isPlaying
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
            : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border-zinc-700/60 hover:border-amber-500/40'
        } ${className}`}
      >
        {isPlaying ? (
          <>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            <VolumeX className="w-3 h-3 text-amber-400" />
            <span className="font-mono text-[10px]">Speaking...</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3 h-3 text-amber-400" />
            <span className="text-[11px]">{title}</span>
          </>
        )}
      </button>
    );
  }

  // Standard Button Mode with Optional Speed Controls
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleTogglePlay}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
          isPlaying
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
            : 'bg-zinc-900/90 text-zinc-300 hover:text-zinc-100 border-zinc-700/80 hover:border-amber-500/40 hover:bg-zinc-800'
        }`}
        title={isPlaying ? 'Stop Reading' : `Listen with Speech Synthesis (${effectiveLanguage.toUpperCase()})`}
      >
        {isPlaying ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-300">Stop Audio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">{title}</span>
          </>
        )}
      </button>

      {showSpeedControl && (
        <button
          type="button"
          onClick={handleCycleSpeed}
          className="px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold bg-zinc-900 border border-zinc-700/80 text-zinc-400 hover:text-amber-400 transition-colors"
          title="Toggle narration speed"
        >
          {speechRate}x
        </button>
      )}
    </div>
  );
};
