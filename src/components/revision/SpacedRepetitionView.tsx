import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Flame,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  Mic,
  MicOff,
  Volume2,
  Bell,
  BellRing,
  HelpCircle,
  Award,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ConfidenceLevel, LanguageCode, SpacedRevisionItem, UserProfile } from '../../types';
import { loadSpacedRevisionQueue, saveSpacedRevisionQueue } from '../../services/storageService';
import { CURRICULUM_QUESTIONS } from '../../data/curriculum';
import { getLocalizedText } from '../../data/languages';
import { getNextIntervalDays } from '../../utils/masteryCalculator';
import { useVoiceDictation } from '../../hooks/useVoiceDictation';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  isReviewNotificationEnabled,
  setReviewNotificationEnabled,
  sendTestReviewNotification,
  checkAndNotifySpacedRepetitionDue,
} from '../../services/notificationService';

interface SpacedRepetitionViewProps {
  language: LanguageCode;
  profile: UserProfile;
}

interface SpeechComparisonResult {
  matchScore: number;
  matchedKeywords: string[];
  feedback: string;
  suggestedConfidence: ConfidenceLevel;
}

export const SpacedRepetitionView: React.FC<SpacedRepetitionViewProps> = ({
  language,
  profile,
}) => {
  const [queue, setQueue] = useState<SpacedRevisionItem[]>(loadSpacedRevisionQueue());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedConfidence, setSelectedConfidence] = useState<ConfidenceLevel | null>(null);
  const [comparisonResult, setComparisonResult] = useState<SpeechComparisonResult | null>(null);

  // Browser Notification States
  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [testNotifSuccess, setTestNotifSuccess] = useState(false);

  const activeItem = queue[currentIndex] || queue[0];
  const questionData =
    CURRICULUM_QUESTIONS.find((q) => q.id === activeItem?.questionId) || CURRICULUM_QUESTIONS[0];

  // Web Speech API Voice Dictation Hook
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    error: speechError,
    durationSeconds,
  } = useVoiceDictation({
    language: language === 'hi' ? 'hi-IN' : 'en-IN',
    continuous: true,
  });

  // Check notification status on mount
  useEffect(() => {
    const supported = isNotificationSupported();
    setNotifSupported(supported);
    if (supported) {
      setNotifPermission(getNotificationPermission());
      setNotifEnabled(isReviewNotificationEnabled());
      // Trigger background check if enabled
      if (isReviewNotificationEnabled()) {
        checkAndNotifySpacedRepetitionDue(queue, profile);
      }
    }
  }, []);

  // Compare spoken answer with expected answer
  const evaluateSpokenAnswer = (spokenText: string) => {
    if (!spokenText.trim()) return;

    const correctOptionText = getLocalizedText(questionData.options[questionData.correctIndex], language).toLowerCase();
    const explanationText = getLocalizedText(questionData.explanation, language).toLowerCase();
    const correctLetter = String.fromCharCode(65 + questionData.correctIndex).toLowerCase();

    const normalizedSpoken = spokenText.toLowerCase();

    // Extract significant keywords from correct answer and explanation (len > 3)
    const combinedTarget = `${correctOptionText} ${explanationText}`;
    const words = combinedTarget
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'from', 'this', 'that', 'have', 'been', 'which', 'their'].includes(w));

    const uniqueKeywords = Array.from(new Set(words));
    const matched = uniqueKeywords.filter((kw) => normalizedSpoken.includes(kw));

    // Check direct letter mentions: e.g., "option b", "it is b", "answer is b"
    const mentionsLetter =
      normalizedSpoken.includes(`option ${correctLetter}`) ||
      normalizedSpoken.includes(`option ${correctLetter.toUpperCase()}`) ||
      normalizedSpoken.includes(`choice ${correctLetter}`) ||
      new RegExp(`\\b${correctLetter}\\b`).test(normalizedSpoken);

    let score = 0;
    if (uniqueKeywords.length > 0) {
      const keywordRatio = matched.length / Math.min(uniqueKeywords.length, 6);
      score = Math.round(keywordRatio * 75);
    }

    if (mentionsLetter) score += 25;
    if (normalizedSpoken.includes(correctOptionText)) score += 30;

    const finalScore = Math.min(100, Math.max(15, score));

    let suggested: ConfidenceLevel = 'guess';
    let feedback = '';

    if (finalScore >= 80) {
      suggested = 'very_confident';
      feedback = 'Outstanding! You accurately cited the core scientific principle and correct answer.';
    } else if (finalScore >= 60) {
      suggested = 'confident';
      feedback = 'Good recall! Key scientific concepts matched closely with expected textbook solution.';
    } else if (finalScore >= 35) {
      suggested = 'somewhat';
      feedback = 'Partial recall. Some technical terms matched, but essential elements need reinforcement.';
    } else {
      suggested = 'guess';
      feedback = 'Low keyword alignment. Review the detailed textbook breakdown below.';
    }

    setComparisonResult({
      matchScore: finalScore,
      matchedKeywords: matched.slice(0, 5),
      feedback,
      suggestedConfidence: suggested,
    });

    // Auto-reveal explanation when student speaks
    setShowAnswer(true);
  };

  const handleStopSpeakingAndEvaluate = () => {
    stopListening();
    const spoken = (transcript + ' ' + interimTranscript).trim();
    if (spoken) {
      evaluateSpokenAnswer(spoken);
    }
  };

  const handleConfidenceSubmit = (conf: ConfidenceLevel) => {
    setSelectedConfidence(conf);
    const nextDays = getNextIntervalDays(conf);

    const updatedQueue = [...queue];
    updatedQueue[currentIndex] = {
      ...activeItem,
      currentIntervalDays: nextDays,
      scheduledDate: Date.now() + nextDays * 86400000,
      repetitionCount: activeItem.repetitionCount + 1,
      lastConfidence: conf,
      forgettingRiskPercent: conf === 'very_confident' ? 12 : conf === 'confident' ? 24 : 65,
      dueStatus: 'upcoming',
    };

    setQueue(updatedQueue);
    saveSpacedRevisionQueue(updatedQueue);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleNextCard = () => {
    setShowAnswer(false);
    setSelectedConfidence(null);
    setComparisonResult(null);
    resetTranscript();
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      setNotifEnabled(true);
      setReviewNotificationEnabled(true);
      // Run immediate check
      checkAndNotifySpacedRepetitionDue(queue, profile, true);
    }
  };

  const handleTestNotification = () => {
    const conceptName = activeItem?.conceptId.replace('concept_', '').replace(/_/g, ' ') || "Ohm's Law";
    const ok = sendTestReviewNotification(conceptName);
    if (ok) {
      setTestNotifSuccess(true);
      setTimeout(() => setTestNotifSuccess(false), 4000);
    }
  };

  const fullSpokenText = (transcript + ' ' + interimTranscript).trim();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
              Ebbinghaus Spaced Repetition Engine
            </span>
            <span className="text-xs text-zinc-400 font-mono">
              {queue.filter((q) => q.dueStatus === 'due_today').length} Concepts Due Today
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100">
            Voice-Enabled Spaced Revision / स्मार्ट पुनरावृत्ति
          </h1>
          <p className="text-xs text-zinc-400">
            Speak your answer aloud to test verbal recall. Web Speech API compares your response with NCERT criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 block font-mono">Active Interval</span>
            <span className="text-base font-bold text-amber-400 font-mono">
              {activeItem?.currentIntervalDays || 1} Days
            </span>
          </div>
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-center">
            <span className="text-[10px] text-zinc-400 block font-mono">Forgetting Risk</span>
            <span
              className={`text-base font-bold font-mono ${
                activeItem?.forgettingRiskPercent > 60 ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {activeItem?.forgettingRiskPercent || 50}%
            </span>
          </div>
        </div>
      </div>

      {/* Browser Review Reminders Control Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-200">
                Spaced Revision Browser Notifications
              </h3>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                  notifPermission === 'granted'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                }`}
              >
                {notifPermission === 'granted' ? 'Alerts Active' : 'Permission Needed'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Receive automatic desktop alerts exactly when forgetting curve decay triggers review for specific chapters.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {notifPermission !== 'granted' ? (
            <button
              onClick={handleEnableNotifications}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Alerts</span>
            </button>
          ) : (
            <button
              onClick={handleTestNotification}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span>{testNotifSuccess ? 'Alert Dispatched!' : 'Send Test Reminder'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Revision Interactive Flashcard Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span className="font-mono text-xs text-zinc-300 font-semibold">
              Recall Trigger: {activeItem?.conceptId}
            </span>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Repetition #{activeItem?.repetitionCount || 1}
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-zinc-100 leading-relaxed font-sans">
            {getLocalizedText(questionData.prompt, language)}
          </h3>

          {/* Voice Interaction Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isListening
                      ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                      : 'bg-zinc-900 border border-zinc-800 text-amber-400'
                  }`}
                >
                  {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-zinc-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                    <span>Voice Recall Mode (Web Speech API)</span>
                    {isListening && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        Listening {durationSeconds}s
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Speak your answer aloud; we'll evaluate your explanation keywords.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isListening ? (
                  <button
                    onClick={() => {
                      resetTranscript();
                      setComparisonResult(null);
                      startListening();
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Speak Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopSpeakingAndEvaluate}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500 text-white hover:bg-rose-600 transition-all flex items-center gap-1.5 shadow-lg shadow-rose-500/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Stop & Evaluate Speech</span>
                  </button>
                )}

                {fullSpokenText && !isListening && (
                  <button
                    onClick={() => {
                      resetTranscript();
                      setComparisonResult(null);
                    }}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
                    title="Clear transcript"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Speech Transcript Display */}
            {fullSpokenText && (
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-1.5 animate-fadeIn">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">
                  Your Spoken Response:
                </span>
                <p className="text-zinc-200 font-medium italic leading-relaxed">
                  "{fullSpokenText}"
                </p>
              </div>
            )}

            {/* Speech Comparison Result Card */}
            {comparisonResult && (
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-indigo-500/30 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-zinc-200">
                      Speech Similarity Evaluation
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      comparisonResult.matchScore >= 75
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : comparisonResult.matchScore >= 50
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {comparisonResult.matchScore}% Match
                  </span>
                </div>

                <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      comparisonResult.matchScore >= 75
                        ? 'bg-emerald-500'
                        : comparisonResult.matchScore >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${comparisonResult.matchScore}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {comparisonResult.feedback}
                </p>

                {comparisonResult.matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-mono text-zinc-400">Matched Concepts:</span>
                    {comparisonResult.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                )}

                {!selectedConfidence && (
                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Suggested Calibration: <strong>{comparisonResult.suggestedConfidence.replace('_', ' ')}</strong>
                    </span>
                    <button
                      onClick={() => handleConfidenceSubmit(comparisonResult.suggestedConfidence)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all shadow-sm"
                    >
                      Accept Calibration ➔
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {!showAnswer ? (
            <div className="pt-4 text-center">
              <button
                onClick={() => setShowAnswer(true)}
                className="px-8 py-3 rounded-xl font-bold text-xs bg-zinc-800 border border-zinc-700 hover:border-amber-500 text-zinc-200 hover:text-white transition-all shadow-md"
              >
                OR REVEAL SOLUTION MANUALLY ➔
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-4 border-t border-zinc-800 animate-fadeIn">
              {/* Answer & Explanation */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 leading-relaxed">
                <span className="font-bold text-amber-400 block mb-1 font-mono">
                  Correct Answer: Option {String.fromCharCode(65 + questionData.correctIndex)} (
                  {getLocalizedText(questionData.options[questionData.correctIndex], language)})
                </span>
                <p className="text-zinc-300 pt-1">
                  {getLocalizedText(questionData.explanation, language)}
                </p>
              </div>

              {/* 4-Level Confidence Selection Matrix */}
              {!selectedConfidence ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-300 block">
                      How accurately did you recall this concept? (Calibrates spacing interval & memory strength):
                    </label>
                    <span className="text-[10px] font-mono text-amber-400">4-Level Calibration</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      onClick={() => handleConfidenceSubmit('guess')}
                      className={`p-3 rounded-xl bg-zinc-950 border text-left text-xs transition-all hover:bg-rose-950/20 ${
                        comparisonResult?.suggestedConfidence === 'guess'
                          ? 'border-rose-500 ring-2 ring-rose-500/20'
                          : 'border-zinc-800 hover:border-rose-500/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 1 (0.35x)</span>
                      <div className="font-bold text-rose-400 text-sm">😕 Guess / Forgot</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review tomorrow (1 day)</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('somewhat')}
                      className={`p-3 rounded-xl bg-zinc-950 border text-left text-xs transition-all hover:bg-amber-950/20 ${
                        comparisonResult?.suggestedConfidence === 'somewhat'
                          ? 'border-amber-500 ring-2 ring-amber-500/20'
                          : 'border-zinc-800 hover:border-amber-500/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 2 (0.70x)</span>
                      <div className="font-bold text-amber-400 text-sm">😐 Somewhat Unsure</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 2 days</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('confident')}
                      className={`p-3 rounded-xl bg-zinc-950 border text-left text-xs transition-all hover:bg-blue-950/20 ${
                        comparisonResult?.suggestedConfidence === 'confident'
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-zinc-800 hover:border-blue-500/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 3 (1.00x)</span>
                      <div className="font-bold text-blue-400 text-sm">🙂 Confident Recall</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 3 days</div>
                    </button>
                    <button
                      onClick={() => handleConfidenceSubmit('very_confident')}
                      className={`p-3 rounded-xl bg-zinc-950 border text-left text-xs transition-all hover:bg-emerald-950/20 ${
                        comparisonResult?.suggestedConfidence === 'very_confident'
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-zinc-800 hover:border-emerald-500/60'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Level 4 (1.25x)</span>
                      <div className="font-bold text-emerald-400 text-sm">🔥 Mastered (100%)</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">Review in 7 days</div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Interval recalibrated to {activeItem.currentIntervalDays} days based on {selectedConfidence.replace('_', ' ')} recall!</span>
                  </div>

                  <button
                    onClick={handleNextCard}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <span>Next Revision Concept</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
