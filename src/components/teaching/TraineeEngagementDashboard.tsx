import React, { useState, useMemo } from 'react';
import {
  Eye,
  Heart,
  ThumbsUp,
  MessageSquare,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  Filter,
  GraduationCap,
  Building2,
  Clock,
  ChevronRight,
  Smile,
  Lightbulb,
  HelpCircle,
  BarChart3,
  SlidersHorizontal,
  CheckCircle2,
  Tv,
} from 'lucide-react';
import {
  TeachingReelPost,
  TeacherTrainingProgram,
} from '../../types/teaching';
import { computeReelSentiment, ReelSentimentBreakdown } from '../../services/sentimentService';

interface TraineeEngagementDashboardProps {
  reels: TeachingReelPost[];
  onSelectReelToWatch?: (reelId: string) => void;
}

export const TraineeEngagementDashboard: React.FC<TraineeEngagementDashboardProps> = ({
  reels,
  onSelectReelToWatch,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<'all' | TeacherTrainingProgram>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'views' | 'likes' | 'rubric' | 'comments'>('views');
  const [expandedReelId, setExpandedReelId] = useState<string | null>(null);

  // Compute sentiment breakdown for all reels
  const reelsWithSentiment = useMemo(() => {
    return reels.map((reel) => {
      const sentiment = computeReelSentiment(reel);
      return {
        ...reel,
        sentiment,
      };
    });
  }, [reels]);

  // Filtered & Sorted reels
  const filteredReels = useMemo(() => {
    return reelsWithSentiment
      .filter((r) => {
        if (selectedProgram !== 'all' && r.traineeProgram !== selectedProgram) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.traineeName.toLowerCase().includes(q);
          const matchTopic = r.topicTitle.toLowerCase().includes(q);
          const matchCampus = r.collegeCampus.toLowerCase().includes(q);
          const matchSubject = r.subject.toLowerCase().includes(q);
          return matchName || matchTopic || matchCampus || matchSubject;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'views') return b.viewsCount - a.viewsCount;
        if (sortBy === 'likes') return (b.likesCount + b.applauseCount) - (a.likesCount + a.applauseCount);
        if (sortBy === 'rubric') return b.rubricAverages.overallAverage - a.rubricAverages.overallAverage;
        if (sortBy === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0);
        return 0;
      });
  }, [reelsWithSentiment, selectedProgram, searchQuery, sortBy]);

  // Aggregate Totals
  const aggregateMetrics = useMemo(() => {
    let totalViews = 0;
    let totalLikes = 0;
    let totalApplause = 0;
    let totalComments = 0;
    let totalPositiveSum = 0;
    let totalConstructiveSum = 0;

    reelsWithSentiment.forEach((r) => {
      totalViews += r.viewsCount || 0;
      totalLikes += r.likesCount || 0;
      totalApplause += r.applauseCount || 0;
      totalComments += (r.comments?.length || 0) + (r.evaluations?.length || 0);
      totalPositiveSum += r.sentiment.positivePercentage;
      totalConstructiveSum += r.sentiment.constructivePercentage;
    });

    const count = reelsWithSentiment.length || 1;
    const avgPositive = Math.round(totalPositiveSum / count);
    const avgConstructive = Math.round(totalConstructiveSum / count);

    return {
      totalViews,
      totalLikes,
      totalApplause,
      totalComments,
      totalReels: reels.length,
      avgPositive,
      avgConstructive,
    };
  }, [reelsWithSentiment, reels.length]);

  return (
    <div className="space-y-6">
      {/* Dashboard Header Banner */}
      <div className="p-6 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/30 flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                Teaching Analytics Hub
              </span>
              <span className="text-xs text-zinc-400">• Practicum Peer Engagement</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Student Teacher Engagement & Sentiment Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Real-time video reach, colleague feedback reaction volume, and automated sentiment analysis
              tracking professional growth across published micro-teaching takes.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] text-zinc-400 font-medium">Campus Sentiment Health</div>
              <div className="text-sm font-bold text-emerald-400">
                {aggregateMetrics.avgPositive}% Positive Commendation
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate KPI Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Total Video Views</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {aggregateMetrics.totalViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>Across {aggregateMetrics.totalReels} published recordings</span>
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Peer Reactions</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <Heart className="w-4 h-4 fill-rose-500/20" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {(aggregateMetrics.totalLikes + aggregateMetrics.totalApplause).toLocaleString()}
          </div>
          <div className="text-[11px] text-zinc-400">
            {aggregateMetrics.totalLikes} Likes • {aggregateMetrics.totalApplause} Applause
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Peer & Mentor Comments</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {aggregateMetrics.totalComments}
          </div>
          <div className="text-[11px] text-amber-300 font-medium">
            Active pedagogical reviews
          </div>
        </div>

        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-medium">Constructive Growth Ratio</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-300">
            {aggregateMetrics.avgConstructive}%
          </div>
          <div className="text-[11px] text-zinc-400">
            Actionable teaching adjustments
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Program Filters */}
          <button
            type="button"
            onClick={() => setSelectedProgram('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProgram === 'all'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            All Tracks ({reels.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedProgram('b_ed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProgram === 'b_ed'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            B.Ed Interns
          </button>
          <button
            type="button"
            onClick={() => setSelectedProgram('btc_deled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProgram === 'btc_deled'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            BTC / D.El.Ed
          </button>
          <button
            type="button"
            onClick={() => setSelectedProgram('iti_trainer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedProgram === 'iti_trainer'
                ? 'bg-amber-500 text-zinc-950 font-bold'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            ITI Instructors
          </button>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search trainee, topic, campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 text-xs text-white pl-9 pr-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-zinc-950 text-xs text-zinc-300 px-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-amber-500"
          >
            <option value="views">Sort by Views</option>
            <option value="likes">Sort by Reactions</option>
            <option value="rubric">Sort by Rubric Score</option>
            <option value="comments">Sort by Comments</option>
          </select>
        </div>
      </div>

      {/* Individual Student Teacher Recording Cards */}
      <div className="space-y-4">
        {filteredReels.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/60 border border-zinc-800 rounded-3xl text-zinc-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No published recordings found</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Try adjusting your track filter or search terms, or record a new session in the practice studio.
            </p>
          </div>
        ) : (
          filteredReels.map((reel) => {
            const isExpanded = expandedReelId === reel.id;
            const sentiment = reel.sentiment;

            return (
              <div
                key={reel.id}
                className="p-5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl transition duration-200 space-y-4 shadow-lg"
              >
                {/* Top Row: Trainee Info & Key Stats */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Trainee Details */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
                      {reel.traineeAvatar}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {reel.traineeName}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {reel.traineeProgram.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-zinc-400 hidden sm:inline">
                          • {reel.traineeYear}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-zinc-500 shrink-0" />
                        <span className="truncate max-w-[280px]">{reel.collegeCampus}</span>
                      </p>
                    </div>
                  </div>

                  {/* High-Level Numbers Badge Bar */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <strong className="text-white">{reel.viewsCount}</strong>
                      <span className="text-[10px] text-zinc-500">views</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/20" />
                      <strong className="text-white">{reel.likesCount}</strong>
                      <span className="text-[10px] text-zinc-500">likes</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <ThumbsUp className="w-3.5 h-3.5 text-amber-400" />
                      <strong className="text-white">{reel.applauseCount}</strong>
                      <span className="text-[10px] text-zinc-500">applause</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                      <strong className="text-white">{reel.comments?.length || 0}</strong>
                      <span className="text-[10px] text-zinc-500">comments</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300">
                      <Award className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      <span>{reel.rubricAverages.overallAverage.toFixed(1)} / 10</span>
                    </div>
                  </div>
                </div>

                {/* Lesson & Topic Description */}
                <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-amber-300 font-semibold text-[10px]">
                        {reel.subject}
                      </span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400">{reel.targetClass}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-zinc-400 capitalize">
                        Skill: {reel.skillFocus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {reel.topicTitle}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setExpandedReelId(isExpanded ? null : reel.id)}
                      className="text-xs px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                    >
                      {isExpanded ? 'Hide Sentiment Details' : 'View Sentiment & Feedback'}
                    </button>

                    {onSelectReelToWatch && (
                      <button
                        type="button"
                        onClick={() => onSelectReelToWatch(reel.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition shadow"
                      >
                        <Tv className="w-3.5 h-3.5" />
                        <span>Watch Reel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Sentiment Analysis Bar & Label */}
                <div className="space-y-2 p-3.5 bg-zinc-950/90 border border-zinc-850 rounded-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="font-semibold text-white">Comment Sentiment Distribution:</span>
                      <span className={`font-bold ${sentiment.sentimentColor}`}>
                        {sentiment.sentimentLabel}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{sentiment.positivePercentage}% Praise</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400" />
                        <span>{sentiment.constructivePercentage}% Constructive Tips</span>
                      </span>
                      {sentiment.inquiryPercentage > 0 && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span>{sentiment.inquiryPercentage}% Questions</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Multi-color Sentiment Meter */}
                  <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${sentiment.positivePercentage}%` }}
                      className="h-full bg-emerald-500 transition-all duration-500"
                      title={`${sentiment.positivePercentage}% Positive Feedback`}
                    />
                    <div
                      style={{ width: `${sentiment.constructivePercentage}%` }}
                      className="h-full bg-blue-500 transition-all duration-500"
                      title={`${sentiment.constructivePercentage}% Constructive Advice`}
                    />
                    <div
                      style={{ width: `${sentiment.inquiryPercentage}%` }}
                      className="h-full bg-amber-500 transition-all duration-500"
                      title={`${sentiment.inquiryPercentage}% Inquiry Questions`}
                    />
                  </div>
                </div>

                {/* Expanded Detailed Comments & Evaluator Insights */}
                {isExpanded && (
                  <div className="pt-2 border-t border-zinc-800/80 space-y-3 animate-in fade-in">
                    <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>Peer & Evaluator Qualitative Remarks ({sentiment.highlightComments.length})</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sentiment.highlightComments.length === 0 ? (
                        <div className="p-3 rounded-xl bg-zinc-950 text-zinc-500 text-xs italic">
                          No written feedback comments posted yet for this take.
                        </div>
                      ) : (
                        sentiment.highlightComments.map((comment, i) => (
                          <div
                            key={i}
                            className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">
                                {comment.authorName}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  comment.sentimentType === 'positive'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : comment.sentimentType === 'constructive'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}
                              >
                                {comment.sentimentType === 'positive'
                                  ? '🟢 Positive Affirmation'
                                  : comment.sentimentType === 'constructive'
                                  ? '🔵 Constructive Tip'
                                  : '🟡 Clarification Inquiry'}
                              </span>
                            </div>
                            <p className="text-zinc-300 leading-relaxed italic">
                              "{comment.text}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Rubric Breakdown Grid */}
                    <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                      <div className="text-[11px] font-bold text-zinc-400 uppercase">
                        NCTE Rubric Assessment Performance
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-xs">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Set Induction</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.setInduction.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Blackboard</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.blackboardWork.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Explanation</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.explanationClarity.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Questioning</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.probingQuestions.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Voice & Body</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.voiceAndBodyLanguage.toFixed(1)}
                          </div>
                        </div>
                        <div className="p-2 bg-zinc-900 rounded-xl">
                          <div className="text-[10px] text-zinc-400">Closure</div>
                          <div className="text-sm font-bold text-amber-300">
                            {reel.rubricAverages.lessonClosure.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
