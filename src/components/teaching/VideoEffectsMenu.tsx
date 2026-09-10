import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  Check,
  Eye,
  SunMedium,
  Palette,
  Layers,
} from 'lucide-react';
import { VideoVisualFilter } from '../../types/teaching';

export interface VisualFilterOption {
  id: VideoVisualFilter;
  label: string;
  badge: string;
  cssFilter: string;
  description: string;
  previewGradient: string;
}

export const VISUAL_FILTER_OPTIONS: VisualFilterOption[] = [
  {
    id: 'none',
    label: 'Natural (No Filter)',
    badge: 'Raw Feed',
    cssFilter: 'none',
    description: 'Natural true-to-life camera feed without digital color altering.',
    previewGradient: 'from-zinc-700 to-zinc-800',
  },
  {
    id: 'clarity',
    label: 'Clarity Boost',
    badge: 'High Contrast',
    cssFilter: 'contrast(1.25) saturate(1.3) brightness(1.05)',
    description: 'Sharpens blackboard writing and boosts facial expressiveness under dim classroom lights.',
    previewGradient: 'from-amber-600 to-orange-700',
  },
  {
    id: 'bw',
    label: 'Monochrome (B&W)',
    badge: 'Black & White',
    cssFilter: 'grayscale(1) contrast(1.25)',
    description: 'Classic documentary lecture style. Removes distracting background wall hues.',
    previewGradient: 'from-zinc-900 via-zinc-600 to-zinc-200',
  },
  {
    id: 'sepia',
    label: 'Chalkboard Sepia',
    badge: 'Warm Vintage',
    cssFilter: 'sepia(0.85) contrast(1.1) brightness(0.96)',
    description: 'Warm nostalgic academic lecture tone resembling classic university amphitheaters.',
    previewGradient: 'from-amber-800 to-yellow-900',
  },
  {
    id: 'warm_studio',
    label: 'Warm Practicum',
    badge: 'Gentle Glow',
    cssFilter: 'sepia(0.25) saturate(1.22) contrast(1.12) brightness(1.02)',
    description: 'Soft warm illumination flattering for trainee skin tones and indoor classroom fluorescent lights.',
    previewGradient: 'from-rose-600 to-amber-700',
  },
  {
    id: 'cool_lecture',
    label: 'Cool Smartboard',
    badge: 'Crisp HD',
    cssFilter: 'contrast(1.18) saturate(1.1) hue-rotate(15deg) brightness(1.02)',
    description: 'Cool high-definition color profile emphasizing blue inks, formulas, and digital slides.',
    previewGradient: 'from-cyan-700 to-blue-800',
  },
];

export function getCssFilterString(filterId?: VideoVisualFilter): string {
  const match = VISUAL_FILTER_OPTIONS.find((f) => f.id === filterId);
  return match ? match.cssFilter : 'none';
}

interface VideoEffectsMenuProps {
  selectedFilter: VideoVisualFilter;
  onSelectFilter: (filter: VideoVisualFilter) => void;
  compact?: boolean;
}

export const VideoEffectsMenu: React.FC<VideoEffectsMenuProps> = ({
  selectedFilter,
  onSelectFilter,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const activeOption =
    VISUAL_FILTER_OPTIONS.find((f) => f.id === selectedFilter) || VISUAL_FILTER_OPTIONS[0];

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border shadow-sm ${
          selectedFilter !== 'none'
            ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 text-amber-300 border-amber-500/40 hover:border-amber-400'
            : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:text-white hover:border-zinc-700'
        }`}
        title="Apply visual color filters and clarity boosts to your video"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Video Effects:</span>
        <span className="font-semibold text-white truncate max-w-[90px] sm:max-w-[120px]">
          {activeOption.badge}
        </span>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-2 sm:mb-0 sm:mt-2 w-72 sm:w-80 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-2.5 border-b border-zinc-850 px-1">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wide">
                Video Visual Effects & Filters
              </span>
            </div>
            {selectedFilter !== 'none' && (
              <button
                type="button"
                onClick={() => {
                  onSelectFilter('none');
                  setIsOpen(false);
                }}
                className="text-[10px] text-zinc-400 hover:text-amber-300 transition"
              >
                Reset to None
              </button>
            )}
          </div>

          <div className="space-y-1.5 pt-2 max-h-72 overflow-y-auto pr-0.5">
            {VISUAL_FILTER_OPTIONS.map((opt) => {
              const isSelected = selectedFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onSelectFilter(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-3 border ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/60 ring-1 ring-amber-500/30'
                      : 'bg-zinc-900/50 border-zinc-850 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  {/* Visual Color Preview Swatch */}
                  <div
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${opt.previewGradient} border border-white/20 shrink-0 flex items-center justify-center text-white shadow-sm mt-0.5`}
                  >
                    {isSelected ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Layers className="w-3.5 h-3.5 opacity-60" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {opt.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mt-0.5">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-zinc-850 px-1 flex items-center justify-between text-[10px] text-zinc-500">
            <span>Visual filters apply in real-time to both preview and final campus reels.</span>
          </div>
        </div>
      )}
    </div>
  );
};
