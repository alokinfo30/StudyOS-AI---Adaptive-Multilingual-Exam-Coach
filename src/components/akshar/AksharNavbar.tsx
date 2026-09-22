import React from 'react';
import { 
  Camera, 
  Mic, 
  Users, 
  BookOpen, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  SunMedium, 
  Volume2, 
  Sparkles,
  School,
  Database,
  ArrowLeft,
  Activity,
  Presentation,
  Compass
} from 'lucide-react';
import { Dialect, AksharTabType } from '../../types/akshar';
import { DIALECTS_LIST } from '../../data/aksharData';

interface AksharNavbarProps {
  activeTab: AksharTabType;
  onSelectTab: (tab: AksharTabType) => void;
  selectedDialect: Dialect;
  onSelectDialect: (d: Dialect) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  pendingSyncCount: number;
  onSyncNow: () => void;
  isSyncing: boolean;
  chalkMode: boolean;
  onToggleChalkMode: () => void;
  speechRate: number;
  onToggleSpeechRate: () => void;
  onBackToStudyOS?: () => void;
}

export const AksharNavbar: React.FC<AksharNavbarProps> = ({
  activeTab,
  onSelectTab,
  selectedDialect,
  onSelectDialect,
  isOnline,
  onToggleOnline,
  pendingSyncCount,
  onSyncNow,
  isSyncing,
  chalkMode,
  onToggleChalkMode,
  speechRate,
  onToggleSpeechRate,
  onBackToStudyOS,
}) => {
  const currentDialectMeta = DIALECTS_LIST.find((d) => d.id === selectedDialect) || DIALECTS_LIST[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      {/* Top Classroom & Edge Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/50 px-3 py-1.5 text-xs text-zinc-400 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-emerald-400 border border-emerald-500/20 font-medium">
            <School className="h-3.5 w-3.5 text-emerald-400" />
            <span>प्राथमिक विद्यालय पिपरही</span>
            <span className="hidden sm:inline text-zinc-500">•</span>
            <span className="hidden sm:inline text-zinc-300">कक्षा १, २ व ३ (संयुक्त वर्ग • ३८ विद्यार्थी)</span>
          </div>
          <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] font-mono text-zinc-300">
            NIPUN FLN Mission
          </span>
        </div>

        {/* Connectivity & Sync Control */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSpeechRate}
            title="ध्वनि गति (Audio Speed for Phonics)"
            className="flex items-center gap-1 rounded bg-zinc-900 px-2 py-0.5 text-zinc-300 hover:bg-zinc-800 border border-zinc-800 transition"
          >
            <Volume2 className="h-3 w-3 text-amber-400" />
            <span>ध्वनि गति: {speechRate}x</span>
          </button>

          <button
            onClick={onToggleChalkMode}
            title="धूप व चौक मोड (High-Contrast Outdoor Blackboard Mode)"
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs transition border ${
              chalkMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <SunMedium className="h-3 w-3" />
            <span className="hidden md:inline">ब्लैकबोर्ड मोड</span>
          </button>

          <button
            onClick={onToggleOnline}
            title={isOnline ? 'इंटरनेट चालू है (Online)' : 'ऑफलाइन मोड सक्रिय है (Offline Simulation)'}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
              isOnline
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 text-emerald-400 animate-pulse" />
                <span>एज सक्रिय (Cloud)</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-amber-400" />
                <span>ऑफलाइन मोड (Local Edge)</span>
              </>
            )}
          </button>

          {pendingSyncCount > 0 && (
            <button
              onClick={onSyncNow}
              disabled={isSyncing}
              className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[11px] font-medium text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition disabled:opacity-60"
            >
              <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
              <span>{pendingSyncCount} सिंक बाकी</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex flex-col gap-3 px-3 py-2.5 sm:px-6 md:flex-row md:items-center md:justify-between">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToStudyOS && (
              <button
                onClick={onBackToStudyOS}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-amber-300 border border-zinc-700 hover:bg-zinc-800 hover:border-amber-500/50 transition mr-1"
                title="Return to StudyOS Dashboard"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">StudyOS</span>
              </button>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-rose-600 shadow-lg shadow-orange-500/20">
              <span className="font-serif text-xl font-bold text-white">अ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white font-serif">
                  अक्षरसेतु <span className="text-xs font-sans font-normal text-amber-400/90 ml-1">AksharSetu</span>
                </h1>
                <span className="rounded-full bg-orange-500/20 px-2 py-0.2 text-[10px] font-semibold text-orange-300 border border-orange-500/30">
                  Multigrade AI
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                बहुभाषी बोली व स्लेट दृष्टि सहायक • शिक्षक साथी
              </p>
            </div>
          </div>

          {/* Dialect Selector Mobile */}
          <div className="md:hidden">
            <select
              value={selectedDialect}
              onChange={(e) => onSelectDialect(e.target.value as Dialect)}
              className="rounded-lg bg-zinc-900 border border-zinc-700 px-2.5 py-1 text-xs text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {DIALECTS_LIST.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nameNative} ({d.nameEnglish})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dialect Selector Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-xs text-zinc-400">मातृबोली:</span>
          <div className="relative">
            <select
              value={selectedDialect}
              onChange={(e) => onSelectDialect(e.target.value as Dialect)}
              className="appearance-none rounded-lg bg-zinc-900 border border-zinc-700/80 px-3 py-1.5 pr-8 text-xs font-medium text-amber-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer shadow-inner"
            >
              {DIALECTS_LIST.map((d) => (
                <option key={d.id} value={d.id} className="bg-zinc-900 text-zinc-100">
                  {d.nameNative} ({d.nameEnglish})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[10px]">
              ▼
            </div>
          </div>
          <span className="text-[11px] text-zinc-500 max-w-[180px] truncate" title={currentDialectMeta.region}>
            {currentDialectMeta.nameNative} क्षेत्र
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => onSelectTab('snap')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'snap'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>स्लेट निदान (Vision)</span>
          </button>

          <button
            onClick={() => onSelectTab('oral')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'oral'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
            <span>बोली सेतु (Voice)</span>
          </button>

          <button
            onClick={() => onSelectTab('tarl')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'tarl'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span>TaRL समूह (3 Bands)</span>
          </button>

          <button
            onClick={() => onSelectTab('heatmap')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'heatmap'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>निपुण हीटमैप (FLN)</span>
          </button>

          <button
            onClick={() => onSelectTab('journey')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'journey'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>दैनिक कक्षा (4 Stages)</span>
          </button>

          <button
            onClick={() => onSelectTab('readers')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'readers'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>पठन कार्ड (Readers)</span>
          </button>

          <button
            onClick={() => onSelectTab('deck')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'deck'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>प्रस्तुति स्लाइड (Deck 0-9)</span>
          </button>

          <button
            onClick={() => onSelectTab('sync')}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              activeTab === 'sync'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-md shadow-amber-500/20'
                : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>एज सिंक {pendingSyncCount > 0 && `(${pendingSyncCount})`}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
