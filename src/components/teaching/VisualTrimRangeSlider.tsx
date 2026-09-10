import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Scissors, Play, RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface VisualTrimRangeSliderProps {
  rawDuration: number;
  trimStart: number;
  trimEnd: number;
  currentTime: number;
  onTrimChange: (start: number, end: number, seekTo?: number) => void;
  onSeek: (time: number) => void;
  formatTime: (seconds: number) => string;
}

export const VisualTrimRangeSlider: React.FC<VisualTrimRangeSliderProps> = ({
  rawDuration,
  trimStart,
  trimEnd,
  currentTime,
  onTrimChange,
  onSeek,
  formatTime,
}) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeDragging, setActiveDragging] = useState<'start' | 'end' | 'middle' | null>(null);
  const dragStartOffsetRef = useRef<{ clientX: number; initialStart: number; initialEnd: number }>({
    clientX: 0,
    initialStart: 0,
    initialEnd: 0,
  });

  const duration = Math.max(1, rawDuration);
  const minWindow = Math.min(3, Math.max(1, Math.floor(duration * 0.05)));

  const getPercentage = (time: number) => Math.min(100, Math.max(0, (time / duration) * 100));

  const startPercent = getPercentage(trimStart);
  const endPercent = getPercentage(trimEnd);
  const playheadPercent = getPercentage(currentTime);
  const windowPercent = Math.max(0, endPercent - startPercent);

  // Convert mouse/touch clientX to seconds on the track
  const getSecondsFromEvent = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = Math.min(Math.max(0, clientX - rect.left), rect.width);
      const ratio = relativeX / rect.width;
      return Math.round(ratio * duration);
    },
    [duration]
  );

  // Global mousemove and mouseup handlers for smooth dragging
  useEffect(() => {
    if (!activeDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentSeconds = getSecondsFromEvent(e.clientX);

      if (activeDragging === 'start') {
        const newStart = Math.min(currentSeconds, trimEnd - minWindow);
        const clampedStart = Math.max(0, newStart);
        onTrimChange(clampedStart, trimEnd, clampedStart);
      } else if (activeDragging === 'end') {
        const newEnd = Math.max(currentSeconds, trimStart + minWindow);
        const clampedEnd = Math.min(duration, newEnd);
        onTrimChange(trimStart, clampedEnd, clampedEnd);
      } else if (activeDragging === 'middle') {
        const deltaX = e.clientX - dragStartOffsetRef.current.clientX;
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const deltaSeconds = Math.round((deltaX / rect.width) * duration);
        const windowDuration = dragStartOffsetRef.current.initialEnd - dragStartOffsetRef.current.initialStart;

        let newStart = dragStartOffsetRef.current.initialStart + deltaSeconds;
        let newEnd = dragStartOffsetRef.current.initialEnd + deltaSeconds;

        if (newStart < 0) {
          newStart = 0;
          newEnd = windowDuration;
        } else if (newEnd > duration) {
          newEnd = duration;
          newStart = duration - windowDuration;
        }

        onTrimChange(newStart, newEnd, newStart);
      }
    };

    const handleMouseUp = () => {
      setActiveDragging(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handleMouseMove({ clientX: e.touches[0].clientX } as MouseEvent);
      }
    });
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeDragging, trimStart, trimEnd, duration, minWindow, getSecondsFromEvent, onTrimChange]);

  const handleTrackClick = (e: React.MouseEvent) => {
    // If clicking on track directly, seek to clicked point
    const clickedSeconds = getSecondsFromEvent(e.clientX);
    onSeek(clickedSeconds);
  };

  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartOffsetRef.current = {
      clientX,
      initialStart: trimStart,
      initialEnd: trimEnd,
    };
    setActiveDragging('start');
  };

  const handleEndDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartOffsetRef.current = {
      clientX,
      initialStart: trimStart,
      initialEnd: trimEnd,
    };
    setActiveDragging('end');
  };

  const handleMiddleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartOffsetRef.current = {
      clientX,
      initialStart: trimStart,
      initialEnd: trimEnd,
    };
    setActiveDragging('middle');
  };

  // Steppers for fine adjustments
  const stepStart = (delta: number) => {
    const newStart = Math.max(0, Math.min(trimStart + delta, trimEnd - minWindow));
    onTrimChange(newStart, trimEnd, newStart);
  };

  const stepEnd = (delta: number) => {
    const newEnd = Math.min(duration, Math.max(trimEnd + delta, trimStart + minWindow));
    onTrimChange(trimStart, newEnd, newEnd);
  };

  return (
    <div className="space-y-3 select-none">
      {/* Visual Waveform and Dual Slider Track */}
      <div className="relative pt-6 pb-6">
        {/* Track Container */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative w-full h-12 bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 cursor-pointer shadow-inner flex items-center"
        >
          {/* Simulated Audio Waveform Bar Background */}
          <div className="absolute inset-0 flex items-center justify-between px-2 opacity-25 pointer-events-none">
            {Array.from({ length: 60 }).map((_, i) => {
              const heightPercent = 20 + Math.abs(Math.sin(i * 0.4) * 60) + ((i % 5) * 4);
              return (
                <span
                  key={i}
                  style={{ height: `${heightPercent}%` }}
                  className="w-1 bg-zinc-400 rounded-full mx-[1px]"
                />
              );
            })}
          </div>

          {/* Left Excluded Region (Dimmed & Hatched) */}
          <div
            style={{ width: `${startPercent}%` }}
            className="h-full bg-black/80 backdrop-blur-[2px] border-r-2 border-amber-500/40 relative z-10 flex items-center justify-center overflow-hidden"
          >
            <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 opacity-70">
              <Scissors className="w-3 h-3" />
              <span className="hidden sm:inline">Cut</span>
            </div>
          </div>

          {/* Active Retained Window (Vibrant & Draggable) */}
          <div
            style={{
              left: `${startPercent}%`,
              width: `${windowPercent}%`,
            }}
            onMouseDown={handleMiddleDrag}
            onTouchStart={handleMiddleDrag}
            className="absolute top-0 bottom-0 bg-gradient-to-r from-amber-500/25 via-yellow-400/20 to-amber-500/25 border-y-2 border-amber-400 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center px-2 group shadow-lg shadow-amber-500/10"
          >
            <div className="text-[11px] font-mono font-bold text-amber-300 bg-zinc-950/80 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1.5 shadow">
              <span>Kept: {formatTime(trimEnd - trimStart)}</span>
            </div>
          </div>

          {/* Right Excluded Region (Dimmed & Hatched) */}
          <div
            style={{
              left: `${endPercent}%`,
              width: `${100 - endPercent}%`,
            }}
            className="absolute top-0 bottom-0 bg-black/80 backdrop-blur-[2px] border-l-2 border-amber-500/40 z-10 flex items-center justify-center overflow-hidden"
          >
            <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1 opacity-70">
              <Scissors className="w-3 h-3" />
              <span className="hidden sm:inline">Cut</span>
            </div>
          </div>

          {/* Current Video Playhead Indicator */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="absolute top-0 bottom-0 w-1 bg-white z-30 pointer-events-none shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            <div className="w-3 h-3 bg-white rotate-45 -translate-x-1 -translate-y-1 rounded-sm shadow" />
          </div>
        </div>

        {/* Start Handle Thumb (Draggable with Tooltip) */}
        <div
          style={{ left: `${startPercent}%` }}
          onMouseDown={handleStartDrag}
          onTouchStart={handleStartDrag}
          className="absolute top-1 -translate-x-1/2 z-40 cursor-ew-resize flex flex-col items-center group"
        >
          {/* Badge Label */}
          <div className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold whitespace-nowrap shadow-md mb-1">
            Start {formatTime(trimStart)}
          </div>
          {/* Handle Grip */}
          <div className="w-5 h-12 rounded-lg bg-amber-400 border border-amber-200 shadow-xl flex items-center justify-center hover:scale-110 active:scale-105 transition group-hover:bg-yellow-300">
            <div className="w-0.5 h-6 bg-zinc-950/70 rounded-full mx-[1px]" />
            <div className="w-0.5 h-6 bg-zinc-950/70 rounded-full mx-[1px]" />
          </div>
        </div>

        {/* End Handle Thumb (Draggable with Tooltip) */}
        <div
          style={{ left: `${endPercent}%` }}
          onMouseDown={handleEndDrag}
          onTouchStart={handleEndDrag}
          className="absolute top-1 -translate-x-1/2 z-40 cursor-ew-resize flex flex-col items-center group"
        >
          {/* Badge Label */}
          <div className="px-2 py-0.5 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-mono font-bold whitespace-nowrap shadow-md mb-1">
            End {formatTime(trimEnd)}
          </div>
          {/* Handle Grip */}
          <div className="w-5 h-12 rounded-lg bg-amber-400 border border-amber-200 shadow-xl flex items-center justify-center hover:scale-110 active:scale-105 transition group-hover:bg-yellow-300">
            <div className="w-0.5 h-6 bg-zinc-950/70 rounded-full mx-[1px]" />
            <div className="w-0.5 h-6 bg-zinc-950/70 rounded-full mx-[1px]" />
          </div>
        </div>
      </div>

      {/* Stepper Fine-Tuning Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-zinc-950/90 rounded-2xl border border-zinc-800 text-xs">
        {/* Start Trimmer Stepper */}
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <div className="text-[11px] text-zinc-400">Trim Start Boundary</div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {formatTime(trimStart)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => stepStart(-1)}
              disabled={trimStart <= 0}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
              title="Step Back 1 Second"
            >
              -1s
            </button>
            <button
              type="button"
              onClick={() => stepStart(1)}
              disabled={trimStart >= trimEnd - minWindow}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
              title="Step Forward 1 Second"
            >
              +1s
            </button>
          </div>
        </div>

        {/* End Trimmer Stepper */}
        <div className="flex items-center justify-between gap-2 sm:border-l sm:border-zinc-850 sm:pl-4">
          <div className="space-y-0.5">
            <div className="text-[11px] text-zinc-400">Trim End Boundary</div>
            <div className="text-xs font-mono font-bold text-amber-300">
              {formatTime(trimEnd)}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => stepEnd(-1)}
              disabled={trimEnd <= trimStart + minWindow}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
              title="Step Back 1 Second"
            >
              -1s
            </button>
            <button
              type="button"
              onClick={() => stepEnd(1)}
              disabled={trimEnd >= duration}
              className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-30 text-zinc-300 border border-zinc-800"
              title="Step Forward 1 Second"
            >
              +1s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
