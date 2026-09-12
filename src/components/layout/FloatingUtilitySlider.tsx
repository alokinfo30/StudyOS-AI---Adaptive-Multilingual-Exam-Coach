import React, { useState } from 'react';
import {
  Globe,
  Share2,
  EyeOff,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { SUPPORTED_LANGUAGES } from '../../data/languages';

interface FloatingUtilitySliderProps {
  currentLanguage: LanguageCode;
  onOpenLanguageModal: () => void;
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
  onOpenSocialShare: () => void;
}

export const FloatingUtilitySlider: React.FC<FloatingUtilitySliderProps> = ({
  currentLanguage,
  onOpenLanguageModal,
  isFocusMode,
  onToggleFocusMode,
  onOpenSocialShare,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  return (
    <aside
      aria-label="Study tools dock"
      className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-transform duration-300 select-none ${
        isExpanded ? 'translate-x-0' : 'translate-x-[calc(100%-14px)]'
      }`}
    >
      <div className="flex items-center">
        {/* Collapse / Expand Slider Handle Tab */}
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="bg-zinc-900/95 border-y border-l border-zinc-750 text-zinc-400 hover:text-amber-400 p-1.5 rounded-l-xl shadow-xl backdrop-blur-md transition-colors flex flex-col items-center justify-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          title={isExpanded ? 'Collapse toolbar' : 'Expand utilities'}
          aria-label={isExpanded ? 'Collapse floating utility slider' : 'Expand floating utility slider'}
        >
          {isExpanded ? (
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-400 group-hover:text-amber-400" />
          )}
          <span className="text-[9px] font-mono [writing-mode:vertical-lr] tracking-wider text-zinc-400 font-semibold py-0.5">
            TOOLS
          </span>
        </button>

        {/* Floating Utility Slider Dock */}
        <div className="bg-zinc-900/95 border-y border-l border-zinc-750/90 rounded-l-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-2.5">
          {/* 1. Universal Language & Speech Settings Change Button */}
          <button
            type="button"
            onClick={onOpenLanguageModal}
            className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-750/80 hover:border-amber-500/60 hover:bg-zinc-800 text-zinc-200 transition-all flex flex-col items-center justify-center group relative shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title={`Language & Speech Settings: Currently ${currentLangObj.name} (${currentLangObj.nativeName})`}
          >
            <Globe className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono font-bold text-amber-300 leading-none mt-0.5">
              {currentLangObj.code.toUpperCase()}
            </span>
            {/* Tooltip hint on hover */}
            <span className="absolute right-12 px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-xl flex items-center gap-1.5">
              <span>{currentLangObj.nativeName}</span>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400 font-mono text-[10px]">TTS Settings</span>
            </span>
          </button>

          {/* 2. Distraction-Free Focus Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleFocusMode}
            className={`w-10 h-10 rounded-xl border transition-all flex flex-col items-center justify-center group relative shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isFocusMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/70 shadow-amber-500/20 shadow-md ring-2 ring-amber-500/30'
                : 'bg-zinc-950 border-zinc-750/80 hover:border-amber-500/60 hover:bg-zinc-800 text-zinc-300'
            }`}
            title={
              isFocusMode
                ? 'Focus Mode Active • Click to exit'
                : 'Toggle Distraction-Free Focus Mode'
            }
          >
            <EyeOff
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isFocusMode ? 'text-amber-400' : 'text-zinc-400'
              }`}
            />
            <span
              className={`text-[9px] font-mono font-bold leading-none mt-0.5 ${
                isFocusMode ? 'text-amber-400 animate-pulse' : 'text-zinc-400'
              }`}
            >
              {isFocusMode ? 'ON' : 'FOCUS'}
            </span>
            {/* Tooltip hint on hover */}
            <span className="absolute right-12 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
              {isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
            </span>
          </button>

          {/* 3. Social Share Button */}
          <button
            type="button"
            onClick={onOpenSocialShare}
            className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-750/80 hover:border-amber-500/60 hover:bg-zinc-800 text-zinc-200 transition-all flex flex-col items-center justify-center group relative shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            title="Share StudyOS AI on WhatsApp, Instagram, Snapchat, Telegram"
          >
            <Share2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono font-bold text-zinc-400 group-hover:text-amber-300 leading-none mt-0.5">
              SHARE
            </span>
            {/* Tooltip hint on hover */}
            <span className="absolute right-12 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-700 text-zinc-200 text-[11px] font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
              Share StudyOS.AI
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
