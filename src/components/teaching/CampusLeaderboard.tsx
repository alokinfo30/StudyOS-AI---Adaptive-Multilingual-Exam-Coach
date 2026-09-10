import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Heart,
  Eye,
  MessageSquare,
  Users,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Radio,
  Tv,
  ArrowUpRight,
  Flame,
  Star,
  RefreshCw,
} from 'lucide-react';
import {
  CampusLeaderboardEntry,
  TeacherTrainingProgram,
  TeachingReelPost,
} from '../../types/teaching';
import { calculateCampusLeaderboard } from '../../services/teachingStorageService';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface CampusLeaderboardProps {
  currentUserId: string;
  currentUserName?: string;
  onViewReel?: (reelId: string) => void;
  onStartPractice?: () => void;
}

export const CampusLeaderboard: React.FC<CampusLeaderboardProps> = ({
  currentUserId,
  currentUserName = 'Apprentice Trainee',
  onViewReel,
  onStartPractice,
}) => {
  const [leaderboard, setLeaderboard] = useState<CampusLeaderboardEntry[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'composite' | 'peer_review' | 'engagement' | 'takes'>('composite');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshedTime, setLastRefreshedTime] = useState<number>(Date.now());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadLeaderboardData = () => {
    setIsRefreshing(true);
    const data = calculateCampusLeaderboard(currentUserId, currentUserName);
    setLeaderboard(data);
    setLastRefreshedTime(Date.now());
    setTimeout(() => setIsRefreshing(false), 300);
  };

  useEffect(() => {
    loadLeaderboardData();

    // Listen to real-time storage events or custom feed events
    const handleReelsUpdated = () => {
      loadLeaderboardData();
    };

    window.addEventListener('storage', handleReelsUpdated);
    window.addEventListener('studyos_campus_reels_updated', handleReelsUpdated);
    window.addEventListener('studyos_teaching_takes_updated', handleReelsUpdated);

    // Periodic live-sync polling every 15s to keep engagement scores fresh
    const timer = setInterval(() => {
      const data = calculateCampusLeaderboard(currentUserId, currentUserName);
      setLeaderboard(data);
    }, 15000);

    return () => {
      window.removeEventListener('storage', handleReelsUpdated);
      window.removeEventListener('studyos_campus_reels_updated', handleReelsUpdated);
      window.removeEventListener('studyos_teaching_takes_updated', handleReelsUpdated);
      clearInterval(timer);
    };
  }, [currentUserId, currentUserName]);

  // Filter and sort entries
  const filteredEntries = leaderboard
    .filter((entry) => {
      const matchesProgram =
        selectedProgram === 'all' || entry.traineeProgram === selectedProgram;
      const matchesSearch =
        entry.traineeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.collegeCampus.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.campusCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.featuredTopicTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesProgram && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'peer_review') {
        return b.peerReviewScore - a.peerReviewScore || b.compositeScore - a.compositeScore;
      }
      if (sortBy === 'engagement') {
        return b.totalEngagementScore - a.totalEngagementScore;
      }
      if (sortBy === 'takes') {
        return b.totalTakesRecorded - a.totalTakesRecorded;
      }
      return b.compositeScore - a.compositeScore;
    });

  // Re-rank filtered entries for display
  const rankedDisplayEntries = filteredEntries.map((entry, idx) => ({
    ...entry,
    displayRank: idx + 1,
  }));

  // Current user standing
  const currentUserEntry = leaderboard.find((e) => e.traineeId === currentUserId);
  const currentUserRank = currentUserEntry?.rank || leaderboard.length;

  const topThree = rankedDisplayEntries.slice(0, 3);
  const remainingEntries = rankedDisplayEntries.slice(3);

  return (
    <div className="space-y-6">
      {/* Leaderboard Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/20 border border-zinc-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time Campus Rankings</span>
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-400 font-mono">
              B.Ed, BTC & ITI Practicum Network
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <span>Campus Apprentice Educator Leaderboard</span>
            <Trophy className="w-6 h-6 text-amber-400" />
          </h2>

          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Ranked based on <strong>NCTE/NCVT Peer Rubric Evaluations</strong> (65%) and <strong>Total Classroom Engagement</strong> (35% applause, constructive feedback & student inquiry mastery).
          </p>
        </div>

        {/* Live Status & Quick Action */}
        <div className="flex flex-wrap items-center gap-3 z-10 shrink-0">
          <button
            type="button"
            onClick={loadLeaderboardData}
            disabled={isRefreshing}
            className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {onStartPractice && (
            <button
              type="button"
              onClick={onStartPractice}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Record Take to Climb Rank</span>
            </button>
          )}
        </div>
      </div>

      {/* Trainee's Standing Card */}
      {currentUserEntry && (
        <div className="p-4 sm:p-5 rounded-3xl bg-zinc-900/90 border border-amber-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-base shrink-0">
              #{currentUserRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide font-mono">
                  Your Campus Standing
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-[11px] text-zinc-400">
                  Top {Math.max(5, Math.round((currentUserRank / Math.max(1, leaderboard.length)) * 100))}% in Network
                </span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100">
                {currentUserEntry.traineeName} ({currentUserEntry.collegeCampus})
              </h3>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-mono">
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-400 block">Peer Review Average</span>
              <span className="text-emerald-400 font-bold text-sm">
                ⭐ {currentUserEntry.peerReviewScore.toFixed(1)} / 10
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-400 block">Total Engagement</span>
              <span className="text-amber-400 font-bold text-sm">
                🔥 {currentUserEntry.totalEngagementScore} pts
              </span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-400 block">Composite Score</span>
              <span className="text-zinc-100 font-bold text-sm">
                {currentUserEntry.compositeScore.toFixed(1)} / 100
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-800">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trainee, college, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Program Filter & Metric Sort Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Program Select */}
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Teacher Programs</option>
            <option value="b_ed">B.Ed (Secondary Pedagogy)</option>
            <option value="btc_deled">BTC / D.El.Ed (Elementary)</option>
            <option value="iti_trainer">ITI CITS (Technical Craft)</option>
            <option value="ntt">NTT (Early Childhood)</option>
            <option value="m_ed">M.Ed (Master of Education)</option>
          </select>

          {/* Metric Sort Tabs */}
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setSortBy('composite')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                sortBy === 'composite'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Overall Rank
            </button>
            <button
              type="button"
              onClick={() => setSortBy('peer_review')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                sortBy === 'peer_review'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Peer Score
            </button>
            <button
              type="button"
              onClick={() => setSortBy('engagement')}
              className={`px-3 py-1 rounded-lg font-bold transition text-[11px] ${
                sortBy === 'engagement'
                  ? 'bg-amber-500 text-zinc-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Engagement
            </button>
          </div>
        </div>
      </div>

      {/* Top 3 Podium Showcase (Gold, Silver, Bronze) */}
      {topThree.length >= 3 && selectedProgram === 'all' && !searchQuery && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place - Silver */}
          <div className="order-2 md:order-1 bg-zinc-900/70 border border-zinc-700/80 rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-zinc-400 to-zinc-200" />
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-600 text-2xl mx-auto shadow-md">
                🥈
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block">
                  Rank #2 • Silver Honor
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">
                  {topThree[1].traineeName}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate max-w-full">
                  {topThree[1].collegeCampus}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Peer Review Score:</span>
                <span className="text-emerald-400 font-bold">⭐ {topThree[1].peerReviewScore.toFixed(1)}/10</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Engagement:</span>
                <span className="text-amber-400 font-bold">🔥 {topThree[1].totalEngagementScore} pts</span>
              </div>
              <div className="pt-1 border-t border-zinc-800 text-[10px] text-zinc-400">
                Specialty: <strong className="text-zinc-200">{topThree[1].topSkillBadge}</strong>
              </div>
            </div>

            {topThree[1].featuredReelId && onViewReel && (
              <button
                type="button"
                onClick={() => onViewReel(topThree[1].featuredReelId!)}
                className="w-full py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Teaching Reel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 1st Place - Gold (Elevated Podium) */}
          <div className="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center space-y-4 relative overflow-hidden shadow-2xl flex flex-col justify-between md:-translate-y-2">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-3xl mx-auto shadow-lg relative">
                🥇
                <Crown className="w-4 h-4 text-amber-300 absolute -top-2 -right-2" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  Rank #1 • Campus Laureate
                </span>
                <h3 className="text-lg font-bold text-zinc-100 mt-0.5">
                  {topThree[0].traineeName}
                </h3>
                <p className="text-xs text-zinc-400 truncate max-w-full">
                  {topThree[0].collegeCampus}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950 border border-amber-500/30 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Peer Review Score:</span>
                <span className="text-emerald-400 font-bold text-sm">⭐ {topThree[0].peerReviewScore.toFixed(1)}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Engagement:</span>
                <span className="text-amber-400 font-bold text-sm">🔥 {topThree[0].totalEngagementScore} pts</span>
              </div>
              <div className="pt-1.5 border-t border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between">
                <span>Top Skill:</span>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  {topThree[0].topSkillBadge}
                </span>
              </div>
            </div>

            {topThree[0].featuredReelId && onViewReel && (
              <button
                type="button"
                onClick={() => onViewReel(topThree[0].featuredReelId!)}
                className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-1"
              >
                <span>View #1 Teaching Reel</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 3rd Place - Bronze */}
          <div className="order-3 md:order-3 bg-zinc-900/70 border border-amber-900/40 rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-lg flex flex-col justify-between">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-700 to-amber-600" />
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-800 border border-amber-800 text-2xl mx-auto shadow-md">
                🥉
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider block">
                  Rank #3 • Bronze Honor
                </span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">
                  {topThree[2].traineeName}
                </h3>
                <p className="text-[11px] text-zinc-400 truncate max-w-full">
                  {topThree[2].collegeCampus}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Peer Review Score:</span>
                <span className="text-emerald-400 font-bold">⭐ {topThree[2].peerReviewScore.toFixed(1)}/10</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-zinc-400">Engagement:</span>
                <span className="text-amber-400 font-bold">🔥 {topThree[2].totalEngagementScore} pts</span>
              </div>
              <div className="pt-1 border-t border-zinc-800 text-[10px] text-zinc-400">
                Specialty: <strong className="text-zinc-200">{topThree[2].topSkillBadge}</strong>
              </div>
            </div>

            {topThree[2].featuredReelId && onViewReel && (
              <button
                type="button"
                onClick={() => onViewReel(topThree[2].featuredReelId!)}
                className="w-full py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <span>View Teaching Reel</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Complete Ranked List Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Ranked Student Teachers ({rankedDisplayEntries.length})</span>
          </h3>
          <span className="text-[11px] text-zinc-400 font-mono">
            Synced {Math.floor((Date.now() - lastRefreshedTime) / 1000)}s ago
          </span>
        </div>

        {rankedDisplayEntries.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs">
            No student teachers match the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/80">
            {rankedDisplayEntries.map((entry) => {
              const isTopThree = entry.displayRank <= 3;
              const isMe = entry.isCurrentUser;

              return (
                <div
                  key={entry.traineeId}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    isMe
                      ? 'bg-amber-500/10 border-l-4 border-amber-500'
                      : 'hover:bg-zinc-850/50'
                  }`}
                >
                  {/* Left: Rank & Trainee Details */}
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center w-10 shrink-0">
                      <span
                        className={`text-base font-bold font-mono ${
                          entry.displayRank === 1
                            ? 'text-amber-400'
                            : entry.displayRank === 2
                            ? 'text-zinc-300'
                            : entry.displayRank === 3
                            ? 'text-amber-600'
                            : 'text-zinc-400'
                        }`}
                      >
                        #{entry.displayRank}
                      </span>
                      {/* Rank Trend */}
                      {entry.previousRank > entry.displayRank ? (
                        <span className="text-[10px] text-emerald-400 flex items-center font-mono">
                          <TrendingUp className="w-3 h-3" />
                        </span>
                      ) : entry.previousRank < entry.displayRank ? (
                        <span className="text-[10px] text-rose-400 flex items-center font-mono">
                          <TrendingDown className="w-3 h-3" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-600 flex items-center font-mono">
                          <Minus className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl shrink-0">
                      {entry.traineeAvatar}
                    </div>

                    {/* Details */}
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                          <span>{entry.traineeName}</span>
                          {isMe && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-mono text-[9px] font-bold">
                              YOU
                            </span>
                          )}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 font-mono">
                          {entry.traineeProgram.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">
                        {entry.collegeCampus} • <span className="text-zinc-500">{entry.campusCity}</span>
                      </p>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">
                        Topic: <strong className="text-zinc-300">{entry.featuredTopicTitle}</strong>
                      </p>
                    </div>
                  </div>

                  {/* Right: Scores & Engagement */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-13 sm:pl-0">
                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs font-bold text-emerald-400 flex items-center sm:justify-end gap-1">
                        <Star className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>{entry.peerReviewScore.toFixed(1)} / 10</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 block">
                        {entry.totalEvaluationsCount} Peer Reviews
                      </span>
                    </div>

                    <div className="text-left sm:text-right font-mono">
                      <div className="text-xs font-bold text-amber-300 flex items-center sm:justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{entry.totalEngagementScore} pts</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                        <span>👏 {entry.applauseCount}</span>
                        <span>❤️ {entry.likesCount}</span>
                      </div>
                    </div>

                    <div className="hidden lg:block text-right">
                      <span className="px-2.5 py-1 rounded-xl bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-zinc-300">
                        {entry.topSkillBadge}
                      </span>
                    </div>

                    {entry.featuredReelId && onViewReel && (
                      <button
                        type="button"
                        onClick={() => onViewReel(entry.featuredReelId!)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center gap-1"
                        title="View Trainee's Micro-Teaching Reel"
                      >
                        <Tv className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">View Reel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
