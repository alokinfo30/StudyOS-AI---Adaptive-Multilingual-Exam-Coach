/**
 * StudyOS AI - Theme & Accent Color Utilities
 */
import { CustomAccentColor } from '../types';

export interface AccentColorConfig {
  id: CustomAccentColor;
  name: string;
  hex: string;
  rgb: string;
  glow: string;
  bgSubtle: string;
  borderSubtle: string;
  badgeBg: string;
  badgeText: string;
  buttonClass: string;
  textClass: string;
  borderClass: string;
}

export const ACCENT_COLOR_PALETTES: Record<CustomAccentColor, AccentColorConfig> = {
  amber: {
    id: 'amber',
    name: 'Amber Gold (Classic)',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.35)',
    bgSubtle: 'rgba(245, 158, 11, 0.12)',
    borderSubtle: 'rgba(245, 158, 11, 0.30)',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    buttonClass: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/50',
  },
  blue: {
    id: 'blue',
    name: 'Electric Blue',
    hex: '#3b82f6',
    rgb: '59, 130, 246',
    glow: 'rgba(59, 130, 246, 0.35)',
    bgSubtle: 'rgba(59, 130, 246, 0.12)',
    borderSubtle: 'rgba(59, 130, 246, 0.30)',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    buttonClass: 'bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/20',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500/50',
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Green',
    hex: '#10b981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.35)',
    bgSubtle: 'rgba(16, 185, 129, 0.12)',
    borderSubtle: 'rgba(16, 185, 129, 0.30)',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/50',
  },
  rose: {
    id: 'rose',
    name: 'Rose Pink',
    hex: '#f43f5e',
    rgb: '244, 63, 94',
    glow: 'rgba(244, 63, 94, 0.35)',
    bgSubtle: 'rgba(244, 63, 94, 0.12)',
    borderSubtle: 'rgba(244, 63, 94, 0.30)',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-300',
    buttonClass: 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500/50',
  },
  purple: {
    id: 'purple',
    name: 'Violet Purple',
    hex: '#8b5cf6',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.35)',
    bgSubtle: 'rgba(139, 92, 246, 0.12)',
    borderSubtle: 'rgba(139, 92, 246, 0.30)',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    buttonClass: 'bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/20',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/50',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.35)',
    bgSubtle: 'rgba(6, 182, 212, 0.12)',
    borderSubtle: 'rgba(6, 182, 212, 0.30)',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-300',
    buttonClass: 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-cyan-500/20',
    textClass: 'text-cyan-400',
    borderClass: 'border-cyan-500/50',
  },
};

/**
 * Dynamically applies the chosen accent color to HTML document root CSS variables
 */
export function applyAccentColorToDocument(accentColor: CustomAccentColor = 'amber') {
  const palette = ACCENT_COLOR_PALETTES[accentColor] || ACCENT_COLOR_PALETTES.amber;
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.style.setProperty('--app-accent-color', palette.hex);
    root.style.setProperty('--app-accent-rgb', palette.rgb);
    root.style.setProperty('--app-accent-glow', palette.glow);
    root.style.setProperty('--app-accent-bg-subtle', palette.bgSubtle);
    root.style.setProperty('--app-accent-border-subtle', palette.borderSubtle);
    root.setAttribute('data-accent-theme', accentColor);
  }
}
