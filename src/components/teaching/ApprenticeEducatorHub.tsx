import React, { useState, useEffect } from 'react';
import {
  Video,
  Tv,
  Award,
  BookOpen,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Users,
  AlertOctagon,
  RotateCcw,
  BarChart3,
  Trophy,
  FolderOpen,
} from 'lucide-react';
import {
  TeachingReelPost,
  TeachingTake,
  UserModerationRecord,
  TeachingSessionDraft,
} from '../../types/teaching';
import { MicroTeachingPracticeStudio } from './MicroTeachingPracticeStudio';
import { CampusReelFeed } from './CampusReelFeed';
import { CampusPublishModal } from './CampusPublishModal';
import { CodeOfConductModal } from './CodeOfConductModal';
import { ModerationViolationAlertModal } from './ModerationViolationAlertModal';
import { TraineeEngagementDashboard } from './TraineeEngagementDashboard';
import { PracticeGoalTracker } from './PracticeGoalTracker';
import { CampusLeaderboard } from './CampusLeaderboard';
import { TeachingDraftsManager } from './TeachingDraftsManager';
import {
  loadCampusReels,
  saveCampusReels,
  publishReelPost,
  loadTeachingDrafts,
} from '../../services/teachingStorageService';
import {
  getUserModerationRecord,
  saveUserModerationRecord,
  acceptCodeOfConductDisclaimer,
  recordModerationViolation,
  resetModerationRecord,
} from '../../services/moderationService';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface ApprenticeEducatorHubProps {
  initialSubTab?: 'studio' | 'reels' | 'analytics' | 'leaderboard' | 'drafts';
}

export const ApprenticeEducatorHub: React.FC<ApprenticeEducatorHubProps> = ({
  initialSubTab = 'reels',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'studio' | 'reels' | 'analytics' | 'leaderboard' | 'drafts'
  >(initialSubTab);
  const [reels, setReels] = useState<TeachingReelPost[]>([]);
  const [draftsCount, setDraftsCount] = useState<number>(0);
  const [selectedDraftForStudio, setSelectedDraftForStudio] = useState<TeachingSessionDraft | null>(null);
  const [moderationRecord, setModerationRecord] = useState<UserModerationRecord>(
    getUserModerationRecord('current_trainee', 'Apprentice Trainee')
  );

  // Publish Modal State
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [takeToPublish, setTakeToPublish] = useState<TeachingTake | undefined>(undefined);
  const [allTakesCount, setAllTakesCount] = useState<number>(1);

  // Code of Conduct & Violation Modal States
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isViolationAlertOpen, setIsViolationAlertOpen] = useState(false);
  const [flaggedWords, setFlaggedWords] = useState<string[]>([]);
  const [violationReason, setViolationReason] = useState('');

  // Load campus reels and moderation records on mount
  useEffect(() => {
    const loadedReels = loadCampusReels();
    setReels(loadedReels);
    const mod = getUserModerationRecord('current_trainee', 'Apprentice Trainee');
    setModerationRecord(mod);
    const loadedDrafts = loadTeachingDrafts(mod.userId);
    setDraftsCount(loadedDrafts.length);

    const handleDraftsSync = (e: any) => {
      if (e.detail) {
        setDraftsCount(e.detail.length);
      }
    };
    window.addEventListener('studyos_teaching_drafts_updated', handleDraftsSync);
    return () => {
      window.removeEventListener('studyos_teaching_drafts_updated', handleDraftsSync);
    };
  }, []);

  const handlePublishTakeRequest = (take: TeachingTake, count: number) => {
    setTakeToPublish(take);
    setAllTakesCount(count);
    setIsPublishModalOpen(true);
  };

  const handleResumeDraft = (draft: TeachingSessionDraft) => {
    setSelectedDraftForStudio(draft);
    setActiveSubTab('studio');
    playMasteryPopSound();
  };

  const handlePublishDraft = (draft: TeachingSessionDraft) => {
    setTakeToPublish(draft.take);
    setAllTakesCount(1);
    setIsPublishModalOpen(true);
  };

  const handleStartNewSession = () => {
    setSelectedDraftForStudio(null);
    setActiveSubTab('studio');
  };

  const handlePublishReel = (newPost: TeachingReelPost) => {
    const updated = publishReelPost(newPost);
    setReels(updated);
    setIsPublishModalOpen(false);
    setActiveSubTab('reels'); // Switch to reels feed so trainee sees their post
    playMasteryPopSound(true);
  };

  const handleFlagViolation = (blockedText: string, words: string[]) => {
    const { record, isNowBanned } = recordModerationViolation(
      moderationRecord.userId,
      blockedText,
      words,
      'abusive_comment'
    );
    setModerationRecord(record);
    setFlaggedWords(words);
    setViolationReason(
      'Your text contained inappropriate or abusive language. Under campus ethics rules, respectful professional conduct is mandatory.'
    );
    setIsViolationAlertOpen(true);
  };

  const handleAcceptDisclaimer = () => {
    const record = acceptCodeOfConductDisclaimer(moderationRecord.userId);
    setModerationRecord(record);
  };

  const handleResetRecordForTesting = () => {
    const record = resetModerationRecord(moderationRecord.userId);
    setModerationRecord(record);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Navigation Sub-Tabs Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex flex-wrap items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 self-start">
          <button
            type="button"
            onClick={() => setActiveSubTab('reels')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'reels'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Campus Reels ({reels.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'studio'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>AI Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('leaderboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'leaderboard'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Campus Leaderboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('drafts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'drafts'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>
              Drafts{' '}
              {draftsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono border border-teal-500/30">
                  {draftsCount}
                </span>
              )}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === 'analytics'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Conduct Status Pill & Ethics Code Launcher */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDisclaimerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 transition"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Educator Ethics Policy</span>
          </button>

          {moderationRecord.violationCount > 0 && (
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 ${
                moderationRecord.isBanned
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>
                {moderationRecord.isBanned
                  ? 'Account Auto-Banned'
                  : `${moderationRecord.violationCount}/3 Strikes`}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Practice Goal Status Tracker (Weekly Micro-Teaching Practicum Target) */}
      <PracticeGoalTracker
        userId={moderationRecord.userId}
        onStartPractice={() => setActiveSubTab('studio')}
      />

      {/* View Content Switcher */}
      {activeSubTab === 'reels' && (
        <CampusReelFeed
          initialReels={reels}
          onOpenStudio={() => setActiveSubTab('studio')}
        />
      )}

      {activeSubTab === 'studio' && (
        <MicroTeachingPracticeStudio
          onPublishTake={handlePublishTakeRequest}
          onOpenCampusReels={() => setActiveSubTab('reels')}
          initialDraft={selectedDraftForStudio}
          onOpenDrafts={() => setActiveSubTab('drafts')}
        />
      )}

      {activeSubTab === 'leaderboard' && (
        <CampusLeaderboard
          currentUserId={moderationRecord.userId}
          currentUserName={moderationRecord.userName || 'Apprentice Trainee'}
          onViewReel={() => setActiveSubTab('reels')}
          onStartPractice={() => {
            setSelectedDraftForStudio(null);
            setActiveSubTab('studio');
          }}
        />
      )}

      {activeSubTab === 'drafts' && (
        <TeachingDraftsManager
          userId={moderationRecord.userId}
          onResumeDraft={handleResumeDraft}
          onPublishDraft={handlePublishDraft}
          onStartNewSession={handleStartNewSession}
        />
      )}

      {activeSubTab === 'analytics' && (
        <TraineeEngagementDashboard
          reels={reels}
          currentTraineeId={moderationRecord.userId}
          onViewReel={() => setActiveSubTab('reels')}
        />
      )}

      {/* Campus Publishing Modal */}
      <CampusPublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        bestTake={takeToPublish}
        allTakesCount={allTakesCount}
        moderationRecord={moderationRecord}
        onPublish={handlePublishReel}
        onFlagViolation={handleFlagViolation}
        onTriggerDisclaimer={() => setIsDisclaimerOpen(true)}
      />

      {/* Code of Conduct Modal */}
      <CodeOfConductModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleAcceptDisclaimer}
        moderationRecord={moderationRecord}
      />

      {/* Violation Alert Modal */}
      <ModerationViolationAlertModal
        isOpen={isViolationAlertOpen}
        onClose={() => setIsViolationAlertOpen(false)}
        flaggedWords={flaggedWords}
        reason={violationReason}
        moderationRecord={moderationRecord}
        onResetRecordForTesting={handleResetRecordForTesting}
      />
    </div>
  );
};
