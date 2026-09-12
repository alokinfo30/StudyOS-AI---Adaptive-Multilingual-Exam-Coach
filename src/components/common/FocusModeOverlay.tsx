import React, { useState, useEffect, useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Shield,
  Clock,
  X,
  Radio,
  Zap,
} from 'lucide-react';
import { FocusModeState, LanguageCode } from '../../types';

interface FocusModeOverlayProps {
  focusState: FocusModeState;
  onUpdateFocusState: (updater: (prev: FocusModeState) => FocusModeState) => void;
  onExitFocusMode: () => void;
  onOpenAICoach: () => void;
  currentConceptTitle?: string;
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({
  focusState,
  onUpdateFocusState,
  onExitFocusMode,
  onOpenAICoach,
  currentConceptTitle = "Ohm's Law & Current Electricity",
}) => {
  const [timerSeconds, setTimerSeconds] = useState(25 * 60); // 25 min default
  const [isRunning, setIsRunning] = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Focus Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
        onUpdateFocusState((prev) => ({
          ...prev,
          activeSessionSeconds: prev.activeSessionSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timerSeconds, onUpdateFocusState]);

  // Synthesize ambient focus audio using Web Audio API (zero external asset dependencies)
  const toggleAmbientSound = () => {
    if (audioPlaying) {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      setAudioPlaying(false);
      onUpdateFocusState((prev) => ({ ...prev, ambientSoundEnabled: false }));
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx || typeof AudioCtx !== 'function') return;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        // Generate Pink/Brown ambient soothing noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Low-pass filter for cozy study atmosphere
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        whiteNoise.start(0);

        noiseNodeRef.current = whiteNoise;
        setAudioPlaying(true);
        onUpdateFocusState((prev) => ({ ...prev, ambientSoundEnabled: true }));
      } catch (e) {
        console.warn('Web Audio synthesis not allowed or restricted', e);
      }
    }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Keyboard shortcut: Escape exits focus mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExitFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExitFocusMode]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/30 px-3 sm:px-6 py-2.5 shadow-2xl transition-all animate-fadeIn select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Focus Mode Badge & Topic */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
            <EyeOff className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
                Distraction-Free Focus
              </span>
              <span className="hidden sm:inline text-xs text-zinc-400 font-mono">
                Sidebar & Nav Dimmed
              </span>
            </div>
            <p className="text-xs font-semibold text-zinc-100 truncate max-w-[200px] sm:max-w-md">
              {currentConceptTitle}
            </p>
          </div>
        </div>

        {/* Center: Pomodoro Focus Timer */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl shrink-0">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-sm font-bold text-zinc-100">
            {formatTimer(timerSeconds)}
          </span>
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="p-1 rounded-md text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 transition-colors"
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => {
              setTimerSeconds(25 * 60);
              setIsRunning(false);
            }}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Reset to 25m"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Actions: Ambient Noise + AI Coach + Exit Focus */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all ${
              audioPlaying
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-xs'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
            title="Toggle Synthesized Binaural / Alpha Focus Waves"
          >
            {audioPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                <span className="hidden md:inline">Alpha Waves ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
                <span className="hidden md:inline">Focus Audio</span>
              </>
            )}
          </button>

          {/* Socratic Hint Trigger */}
          <button
            onClick={onOpenAICoach}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-xs"
            title="Open AI Socratic Coach"
          >
            <Sparkles className="w-3.5 h-3.5 fill-zinc-950" />
            <span className="hidden sm:inline">AI Hint</span>
          </button>

          {/* Exit Focus Mode Button */}
          <button
            onClick={onExitFocusMode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 text-xs font-medium transition-all"
            title="Exit Focus Mode (or press Esc)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Exit Focus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
