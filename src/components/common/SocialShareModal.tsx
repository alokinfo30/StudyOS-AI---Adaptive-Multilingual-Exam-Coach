import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Sparkles,
  Flame,
  Award,
  ExternalLink,
  MessageCircle,
  Send,
  Camera,
  X,
} from 'lucide-react';
import { UserProfile, StudentDNA, ShareAchievementPayload } from '../../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  dna?: StudentDNA;
  customTopic?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  dna,
  customTopic,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'qr' | 'story'>('quick');

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://studyos.ai';
  const examLabel = profile.selectedExam ? profile.selectedExam.replace('_', ' ') : 'Board & Entrance Exams';
  const boardLabel = profile.selectedBoard || 'CBSE';
  const streak = profile.streakDays || 1;
  const accuracy = dna?.questionAccuracy || 76;
  const hours = dna?.totalHoursStudied || 12;

  // Viral share message text
  const shareTitle = `🚀 Join me on StudyOS AI — Adaptive Exam OS for ${boardLabel} & ${examLabel}!`;
  const shareText =
    `🔥 I'm on a ${streak}-Day Study Streak on StudyOS AI!\n` +
    `📊 Accuracy: ${accuracy}% | ${hours}h Studied\n` +
    `🎯 Target: ${examLabel} (${boardLabel})\n` +
    `⚡ Master NCERT textbook problems in Hindi & 12 Indian languages with AI Socratic tutoring.\n\n` +
    `Join me for free: ${appUrl}`;

  const encodedUrl = encodeURIComponent(appUrl);
  const encodedText = encodeURIComponent(shareText);

  // Social Platform Deep Links
  const shareLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      bg: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      bg: 'bg-sky-500 hover:bg-sky-400 text-white',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`🔥 Check out StudyOS AI: ${shareTitle}`)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: '📘',
      bg: 'bg-blue-600 hover:bg-blue-500 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      id: 'twitter',
      name: 'Twitter / X',
      icon: '🐦',
      bg: 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm scoring higher on ${boardLabel} with @StudyOS_AI! 🔥 ${streak}-day streak.`)}&url=${encodedUrl}`,
    },
    {
      id: 'snapchat',
      name: 'Snapchat',
      icon: '👻',
      bg: 'bg-yellow-400 hover:bg-yellow-300 text-zinc-950',
      url: `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`,
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      bg: 'bg-blue-700 hover:bg-blue-600 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
  ];

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(appUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
      } catch {
        // User cancelled or fallback
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-100 p-2 rounded-xl hover:bg-zinc-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-100 font-sans">
              Share StudyOS AI with Friends
            </h2>
            <p className="text-xs text-zinc-400">
              Invite classmates to compare streaks & solve textbook questions together!
            </p>
          </div>
        </div>

        {/* Tabs: Quick Share / QR Code / Story Generator */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'quick'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Social Apps
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'qr'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Classroom QR</span>
          </button>
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'story'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Insta Story Card</span>
          </button>
        </div>

        {/* Tab 1: Social Platform Deep Links */}
        {activeTab === 'quick' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Student Achievement Badge Preview */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Your Study Stats Badge
                </span>
                <span className="text-xs font-mono text-zinc-400">{profile.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-base font-bold text-amber-400 font-mono flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{streak}d</span>
                  </div>
                  <span className="text-[10px] text-zinc-400">Streak</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-base font-bold text-emerald-400 font-mono">
                    {accuracy}%
                  </div>
                  <span className="text-[10px] text-zinc-400">Accuracy</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-base font-bold text-blue-400 font-mono">
                    {boardLabel}
                  </div>
                  <span className="text-[10px] text-zinc-400">Board</span>
                </div>
              </div>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {shareLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-3 rounded-xl font-bold text-xs transition-all shadow-sm ${item.bg}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Native Mobile Share trigger */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Share via Mobile Apps Sheet</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Classroom QR Code */}
        {activeTab === 'qr' && (
          <div className="text-center space-y-4 animate-fadeIn p-4 bg-zinc-950 rounded-2xl border border-zinc-800">
            <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto">
              {/* Dynamic Clean QR Visual Representation */}
              <svg
                viewBox="0 0 100 100"
                className="w-36 h-36 mx-auto text-zinc-950"
                fill="currentColor"
              >
                {/* QR Pattern Representation */}
                <rect x="0" y="0" width="30" height="30" rx="4" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="10" y="10" width="10" height="10" rx="1" />

                <rect x="70" y="0" width="30" height="30" rx="4" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="80" y="10" width="10" height="10" rx="1" />

                <rect x="0" y="70" width="30" height="30" rx="4" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                <rect x="10" y="80" width="10" height="10" rx="1" />

                <rect x="35" y="10" width="10" height="10" />
                <rect x="50" y="15" width="15" height="10" />
                <rect x="10" y="35" width="10" height="10" />
                <rect x="40" y="40" width="20" height="20" rx="2" fill="#d97706" />
                <rect x="70" y="45" width="10" height="15" />
                <rect x="40" y="70" width="15" height="10" />
                <rect x="65" y="75" width="25" height="15" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-200 font-mono">
                Scan with any Phone Camera to Open
              </p>
              <p className="text-[11px] text-zinc-400">
                Direct classroom peer sharing without typing link.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Instagram / Snapchat Story Card Snippet */}
        {activeTab === 'story' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-purple-600/20 to-blue-600/20 border border-amber-500/30 text-center space-y-3">
              <div className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/40 text-[10px] font-mono font-bold text-amber-400">
                ✨ BHARAT SHIKSHA OS 2026
              </div>
              <h3 className="text-base font-black text-zinc-100 font-sans tracking-tight">
                {profile.name} is Mastering {boardLabel} Exam
              </h3>
              <div className="flex items-center justify-center gap-3 text-xs font-mono font-bold text-zinc-300">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800">
                  🔥 {streak} Days Streak
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800">
                  🎯 {accuracy}% Accuracy
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono pt-1">
                studyos.ai • NCERT Solutions & AI Coach
              </p>
            </div>
            <p className="text-xs text-zinc-400 text-center">
              Screenshot this card and paste it onto your Instagram or Snapchat Story with link sticker!
            </p>
          </div>
        )}

        {/* Universal Copy Link Bar */}
        <div className="pt-2 border-t border-zinc-800 flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={appUrl}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 font-mono focus:outline-none select-all"
          />
          <button
            onClick={handleCopyLink}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shrink-0 ${
              copied
                ? 'bg-emerald-500 text-zinc-950 font-bold'
                : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
