import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Plus,
  Minus,
  FastForward,
  Flag,
} from 'lucide-react';
import { playExamTimerAlert } from '../../utils/audioEffects';

export type ExamTimerPreset =
  | 'jee_main'
  | 'neet_ug'
  | 'cbse_board'
  | 'speed_drill'
  | 'power_practice'
  | 'custom';

interface ExamPresetConfig {
  id: ExamTimerPreset;
  label: string;
  subLabel: string;
  durationSec: number;
  targetSecPerQ: number;
  totalQuestions: number;
}

export const EXAM_PRESETS: Record<ExamTimerPreset, ExamPresetConfig> = {
  jee_main: {
    id: 'jee_main',
    label: 'JEE Main',
    subLabel: '3 Hours • 75 Qs (~144s/Q)',
    durationSec: 180 * 60,
    targetSecPerQ: 144,
    totalQuestions: 75,
  },
  neet_ug: {
    id: 'neet_ug',
    label: 'NEET UG',
    subLabel: '3h 20m • 180 Qs (~66s/Q)',
    durationSec: 200 * 60,
    targetSecPerQ: 66,
    totalQuestions: 180,
  },
  cbse_board: {
    id: 'cbse_board',
    label: 'CBSE / Board',
    subLabel: '3 Hours • 38 Qs (~210s/Q)',
    durationSec: 180 * 60,
    targetSecPerQ: 210,
    totalQuestions: 38,
  },
  power_practice: {
    id: 'power_practice',
    label: '30m Power Drill',
    subLabel: '30 Mins • 20 Qs (~90s/Q)',
    durationSec: 30 * 60,
    targetSecPerQ: 90,
    totalQuestions: 20,
  },
  speed_drill: {
    id: 'speed_drill',
    label: '15m Speed Sprint',
    subLabel: '15 Mins • 15 Qs (60s/Q)',
    durationSec: 15 * 60,
    targetSecPerQ: 60,
    totalQuestions: 15,
  },
  custom: {
    id: 'custom',
    label: 'Custom Timer',
    subLabel: 'User-specified time',
    durationSec: 60 * 60,
    targetSecPerQ: 120,
    totalQuestions: 30,
  },
};

interface ExamCountdownTimerWidgetProps {
  initialPreset?: ExamTimerPreset;
  targetExam?: string;
  currentQuestionIndex?: number;
  onTimeUp?: () => void;
  embedded?: boolean;
  className?: string;
  onSyncTimeLeft?: (timeLeftSec: number) => void;
}

const STORAGE_KEY = 'studyos_exam_timer_settings_v2';

export const ExamCountdownTimerWidget: React.FC<ExamCountdownTimerWidgetProps> = ({
  initialPreset = 'jee_main',
  targetExam,
  currentQuestionIndex,
  onTimeUp,
  embedded = false,
  className = '',
  onSyncTimeLeft,
}) => {
  // Determine starting preset based on user profile or props
  const getStartingPreset = (): ExamTimerPreset => {
    if (targetExam?.toLowerCase().includes('neet')) return 'neet_ug';
    if (targetExam?.toLowerCase().includes('jee')) return 'jee_main';
    if (targetExam?.toLowerCase().includes('cbse') || targetExam?.toLowerCase().includes('board')) return 'cbse_board';
    if (initialPreset && initialPreset in EXAM_PRESETS) return initialPreset as ExamTimerPreset;
    return 'jee_main';
  };

  const [preset, setPreset] = useState<ExamTimerPreset>(getStartingPreset());
  const [timeLeftSec, setTimeLeftSec] = useState<number>(EXAM_PRESETS[getStartingPreset()].durationSec);
  const [totalDurationSec, setTotalDurationSec] = useState<number>(EXAM_PRESETS[getStartingPreset()].durationSec);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(!embedded);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [questionTimeSec, setQuestionTimeSec] = useState<number>(0);
  const [customMinutesInput, setCustomMinutesInput] = useState<number>(45);

  const warned5mRef = useRef<boolean>(false);
  const warned1mRef = useRef<boolean>(false);
  const lastQuestionIndexRef = useRef<number | undefined>(currentQuestionIndex);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.preset && EXAM_PRESETS[parsed.preset as ExamTimerPreset]) {
          setPreset(parsed.preset);
        }
        if (typeof parsed.timeLeftSec === 'number' && parsed.timeLeftSec > 0) {
          setTimeLeftSec(parsed.timeLeftSec);
        }
        if (typeof parsed.totalDurationSec === 'number' && parsed.totalDurationSec > 0) {
          setTotalDurationSec(parsed.totalDurationSec);
        }
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
        }
        if (!embedded && typeof parsed.isMinimized === 'boolean') {
          setIsMinimized(parsed.isMinimized);
        }
      }
    } catch {
      // ignore
    }
  }, [embedded]);

  // Persist state to localStorage periodically
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          preset,
          timeLeftSec,
          totalDurationSec,
          soundEnabled,
          isMinimized,
        })
      );
    } catch {
      // ignore
    }
  }, [preset, timeLeftSec, totalDurationSec, soundEnabled, isMinimized]);

  // Sync with currentQuestionIndex: reset question lap timer when question changes
  useEffect(() => {
    if (currentQuestionIndex !== undefined && currentQuestionIndex !== lastQuestionIndexRef.current) {
      lastQuestionIndexRef.current = currentQuestionIndex;
      setQuestionTimeSec(0);
    }
  }, [currentQuestionIndex]);

  // Main 1-second interval timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeftSec((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          if (soundEnabled) {
            playExamTimerAlert('time_up');
          }
          if (onTimeUp) onTimeUp();
          return 0;
        }

        // Acoustic warnings
        if (soundEnabled) {
          if (prev === 300 && !warned5mRef.current) {
            warned5mRef.current = true;
            playExamTimerAlert('warning_5m');
          }
          if (prev === 60 && !warned1mRef.current) {
            warned1mRef.current = true;
            playExamTimerAlert('warning_1m');
          }
        }

        if (onSyncTimeLeft) {
          onSyncTimeLeft(prev - 1);
        }

        return prev - 1;
      });

      setQuestionTimeSec((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, soundEnabled, onTimeUp, onSyncTimeLeft]);

  const handleSelectPreset = (newPreset: ExamTimerPreset) => {
    setPreset(newPreset);
    const config = EXAM_PRESETS[newPreset];
    const newDuration = newPreset === 'custom' ? customMinutesInput * 60 : config.durationSec;
    setTotalDurationSec(newDuration);
    setTimeLeftSec(newDuration);
    setQuestionTimeSec(0);
    warned5mRef.current = false;
    warned1mRef.current = false;
  };

  const handleApplyCustomMinutes = () => {
    const mins = Math.max(1, Math.min(360, customMinutesInput));
    setTotalDurationSec(mins * 60);
    setTimeLeftSec(mins * 60);
    setQuestionTimeSec(0);
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    setTimeLeftSec((prev) => Math.max(0, prev + deltaSeconds));
    setTotalDurationSec((prev) => Math.max(0, prev + deltaSeconds));
  };

  const handleReset = () => {
    setIsRunning(false);
    const dur = preset === 'custom' ? customMinutesInput * 60 : EXAM_PRESETS[preset].durationSec;
    setTimeLeftSec(dur);
    setTotalDurationSec(dur);
    setQuestionTimeSec(0);
    warned5mRef.current = false;
    warned1mRef.current = false;
  };

  const handleLapNextQuestion = () => {
    setQuestionTimeSec(0);
  };

  // Format seconds into HH:MM:SS or MM:SS
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPresetConfig = EXAM_PRESETS[preset];
  const targetSec = currentPresetConfig.targetSecPerQ;
  const isQuestionPaceExceeded = questionTimeSec > targetSec;
  const isQuestionPaceNear = questionTimeSec > targetSec * 0.8 && !isQuestionPaceExceeded;

  const isLowTime = timeLeftSec < 300; // Under 5 mins
  const isCriticalTime = timeLeftSec < 60; // Under 1 min
  const progressPercent = totalDurationSec > 0 ? ((totalDurationSec - timeLeftSec) / totalDurationSec) * 100 : 0;

  // Unobtrusive Minimized Floating Pill
  if (!embedded && isMinimized) {
    return (
      <div
        className={`fixed bottom-5 right-5 z-40 animate-fadeIn select-none ${className}`}
        id="exam-timer-minimized-pill"
      >
        <div
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border shadow-2xl backdrop-blur-md transition-all ${
            isCriticalTime
              ? 'bg-rose-950/90 border-rose-500/80 text-rose-200 ring-2 ring-rose-500/40 animate-pulse'
              : isLowTime
              ? 'bg-amber-950/90 border-amber-500/80 text-amber-200 ring-1 ring-amber-500/30'
              : 'bg-zinc-900/95 border-zinc-700/80 text-zinc-100'
          }`}
        >
          {/* Main Countdown Display */}
          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold">
            <Clock
              className={`w-3.5 h-3.5 ${
                isRunning ? 'text-amber-400 animate-spin-slow' : 'text-zinc-400'
              }`}
            />
            <span className="tabular-nums tracking-wide">{formatTime(timeLeftSec)}</span>
          </div>

          {/* Question Lap indicator */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-zinc-950/70 text-[11px] font-mono border border-zinc-800"
            title={`Time spent on current question: ${formatTime(questionTimeSec)} (Target: ${formatTime(targetSec)})`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isQuestionPaceExceeded
                  ? 'bg-rose-500 animate-ping'
                  : isQuestionPaceNear
                  ? 'bg-amber-400'
                  : 'bg-emerald-400'
              }`}
            />
            <span className="text-zinc-400 text-[10px]">Q:</span>
            <span
              className={`tabular-nums font-semibold ${
                isQuestionPaceExceeded
                  ? 'text-rose-400'
                  : isQuestionPaceNear
                  ? 'text-amber-300'
                  : 'text-zinc-200'
              }`}
            >
              {formatTime(questionTimeSec)}
            </span>
          </div>

          {/* Play/Pause Quick Control */}
          <button
            type="button"
            onClick={() => setIsRunning((prev) => !prev)}
            className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-sm'
            }`}
            title={isRunning ? 'Pause Exam Timer' : 'Start Exam Countdown'}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-zinc-950" />}
          </button>

          {/* Lap next button */}
          <button
            type="button"
            onClick={handleLapNextQuestion}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Reset question pace lap timer"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>

          {/* Expand Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-300 hover:bg-zinc-800 transition-colors ml-0.5"
            title="Open Exam Time Pacing Control Dashboard"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded Exam Time Management Dashboard
  return (
    <div
      className={`rounded-2xl border shadow-2xl transition-all ${
        embedded
          ? 'bg-zinc-950/80 border-zinc-800 p-4 sm:p-5'
          : 'fixed bottom-5 right-5 z-40 w-80 sm:w-96 bg-zinc-900/95 border-zinc-700/80 backdrop-blur-xl p-5 shadow-2xl'
      } ${className}`}
      id="exam-timer-expanded-panel"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isCriticalTime
                ? 'bg-rose-500 text-zinc-950'
                : isLowTime
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-zinc-800 text-amber-400'
            }`}
          >
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <span>Exam Pacing Simulator</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {currentPresetConfig.label}
              </span>
            </h4>
            <p className="text-[10px] text-zinc-400 font-mono">
              Target: ~{currentPresetConfig.targetSecPerQ}s per question
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Sound Mute Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-1.5 rounded-lg text-xs transition-colors ${
              soundEnabled
                ? 'text-amber-400 hover:bg-zinc-800'
                : 'text-zinc-500 hover:bg-zinc-800'
            }`}
            title={soundEnabled ? 'Acoustic warnings enabled (5m & 1m)' : 'Acoustic warnings muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {!embedded && (
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              title="Minimize to unobtrusive floating pill"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Countdown Digital Display */}
      <div className="py-4 text-center space-y-2">
        <div
          className={`font-mono font-extrabold text-3xl sm:text-4xl tracking-wider tabular-nums transition-colors ${
            isCriticalTime
              ? 'text-rose-400 animate-pulse'
              : isLowTime
              ? 'text-amber-400'
              : 'text-zinc-100'
          }`}
        >
          {formatTime(timeLeftSec)}
        </div>

        {/* Total Progress Bar */}
        <div className="w-full bg-zinc-800/80 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isCriticalTime
                ? 'bg-rose-500'
                : isLowTime
                ? 'bg-amber-500'
                : 'bg-gradient-to-r from-emerald-500 to-amber-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>00:00</span>
          <span>{Math.round(progressPercent)}% elapsed</span>
          <span>{formatTime(totalDurationSec)}</span>
        </div>
      </div>

      {/* Current Question Pacing Card */}
      <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>This Question Lap Time:</span>
          </span>
          <span
            className={`font-mono font-bold tabular-nums text-xs ${
              isQuestionPaceExceeded
                ? 'text-rose-400'
                : isQuestionPaceNear
                ? 'text-amber-300'
                : 'text-emerald-400'
            }`}
          >
            {formatTime(questionTimeSec)} / {formatTime(targetSec)}
          </span>
        </div>

        {/* Pacing Advice status badge */}
        <div
          className={`p-2 rounded-lg text-[11px] flex items-center justify-between gap-2 border ${
            isQuestionPaceExceeded
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : isQuestionPaceNear
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {isQuestionPaceExceeded ? (
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            )}
            <span>
              {isQuestionPaceExceeded
                ? 'Exceeded target pace! Mark & move ahead.'
                : isQuestionPaceNear
                ? 'Approaching pace limit. Wrap up calculation.'
                : 'Great pace! On track for exam completion.'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleLapNextQuestion}
            className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono border border-zinc-700 text-zinc-300 whitespace-nowrap transition-colors"
            title="Reset this question timer"
          >
            Lap Next Q
          </button>
        </div>
      </div>

      {/* Primary Action Buttons: Start/Pause, Reset, Adjust */}
      <div className="flex items-center gap-2 pt-3">
        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${
            isRunning
              ? 'bg-zinc-800 hover:bg-zinc-750 text-amber-300 border border-zinc-700'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Timer</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-zinc-950" />
              <span>Start Countdown</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="p-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
          title="Reset timer to preset duration"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Quick adjustments */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleAdjustTime(60)}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            title="Add 1 minute"
          >
            +1m
          </button>
          <button
            type="button"
            onClick={() => handleAdjustTime(300)}
            className="px-2 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            title="Add 5 minutes"
          >
            +5m
          </button>
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="pt-3 space-y-1.5 border-t border-zinc-800/80 mt-3">
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
          Board & Competitive Exam Presets:
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {(['jee_main', 'neet_ug', 'cbse_board', 'power_practice', 'speed_drill'] as ExamTimerPreset[]).map(
            (pKey) => {
              const cfg = EXAM_PRESETS[pKey];
              const isSelected = preset === pKey;
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => handleSelectPreset(pKey)}
                  className={`p-1.5 rounded-lg text-left text-[11px] border transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/70 text-amber-300 font-bold'
                      : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  <div className="truncate">{cfg.label}</div>
                  <div className="text-[9px] text-zinc-500 truncate">{cfg.subLabel}</div>
                </button>
              );
            }
          )}
          <button
            type="button"
            onClick={() => handleSelectPreset('custom')}
            className={`p-1.5 rounded-lg text-left text-[11px] border transition-all ${
              preset === 'custom'
                ? 'bg-amber-500/15 border-amber-500/70 text-amber-300 font-bold'
                : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
            }`}
          >
            <div className="truncate">Custom Minutes</div>
            <div className="text-[9px] text-zinc-500 truncate">Enter custom time</div>
          </button>
        </div>

        {preset === 'custom' && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="number"
              min={1}
              max={360}
              value={customMinutesInput}
              onChange={(e) => setCustomMinutesInput(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-xs font-mono text-zinc-100"
              placeholder="Minutes"
            />
            <span className="text-xs text-zinc-400">minutes</span>
            <button
              type="button"
              onClick={handleApplyCustomMinutes}
              className="px-2.5 py-1 rounded bg-amber-500 text-zinc-950 text-xs font-bold"
            >
              Set
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
