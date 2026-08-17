import React, { useState } from 'react';
import {
  Code,
  Cpu,
  Terminal,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Lightbulb,
  Zap,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Send,
  Sliders,
  Flame,
  Mic,
  MicOff,
  Wand2,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  TechTrack,
  DeveloperLevel,
  DevInterviewQuestion,
  DevCodeChallenge,
  LanguageCode,
  UserProfile,
} from '../../types';
import {
  TECH_TRACKS,
  DEVELOPER_LEVELS,
  DEV_INTERVIEW_QUESTIONS,
  DEV_CODE_CHALLENGES,
} from '../../data/devCurriculum';
import {
  evaluateDevInterviewResponse,
  reviewDevCodeSubmission,
  DevInterviewEvaluationResult,
  DevCodeReviewResponse,
} from '../../services/geminiService';
import { speakText, stopSpeaking } from '../../utils/speechUtils';
import { useVoiceDictation, DICTATION_LANGUAGES } from '../../hooks/useVoiceDictation';
import { VoiceAnswerGeneratorModal } from './VoiceAnswerGeneratorModal';

interface TechInterviewPrepViewProps {
  language: LanguageCode;
  profile: UserProfile;
}

export const TechInterviewPrepView: React.FC<TechInterviewPrepViewProps> = ({
  language,
  profile,
}) => {
  // Active Tech Track & Knowledge Level
  const [activeTrack, setActiveTrack] = useState<TechTrack>('laravel');
  const [activeLevel, setActiveLevel] = useState<DeveloperLevel>('beginner');
  const [activeMode, setActiveMode] = useState<'interview' | 'challenge' | 'roadmap'>('interview');

  // Mode A: Mock Interview States
  const filteredQuestions = DEV_INTERVIEW_QUESTIONS.filter(
    (q) => q.track === activeTrack && q.level === activeLevel
  );
  // Fallback to all for track if none for level
  const availableQuestions =
    filteredQuestions.length > 0
      ? filteredQuestions
      : DEV_INTERVIEW_QUESTIONS.filter((q) => q.track === activeTrack);

  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion: DevInterviewQuestion =
    availableQuestions[questionIdx] || DEV_INTERVIEW_QUESTIONS[0];

  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [interviewResult, setInterviewResult] = useState<DevInterviewEvaluationResult | null>(null);
  const [showExpectedAnswer, setShowExpectedAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeakingFeedback, setIsSpeakingFeedback] = useState(false);

  // Voice to Text & AI Generator States
  const [isVoiceGeneratorModalOpen, setIsVoiceGeneratorModalOpen] = useState(false);

  // Direct Answer Voice Dictation Hook
  const {
    isListening: isAnswerDictating,
    interimTranscript: answerInterimTranscript,
    error: answerMicError,
    durationSeconds: answerDictationSeconds,
    startListening: startAnswerDictating,
    stopListening: stopAnswerDictating,
    toggleListening: toggleAnswerDictating,
    selectedLang: answerDictationLang,
    setSelectedLang: setAnswerDictationLang,
  } = useVoiceDictation({
    language: 'en-IN',
    continuous: true,
    onResult: (chunk, isFinal) => {
      if (isFinal) {
        setCandidateAnswer((prev) => (prev ? `${prev.trim()} ${chunk.trim()}` : chunk.trim()));
      }
    },
  });

  // Mode B: Code Challenge States
  const filteredChallenges = DEV_CODE_CHALLENGES.filter((c) => c.track === activeTrack);
  const activeChallenge: DevCodeChallenge =
    filteredChallenges[0] || DEV_CODE_CHALLENGES[0];

  const [codeDraft, setCodeDraft] = useState(activeChallenge.starterCode);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [isReviewingCode, setIsReviewingCode] = useState(false);
  const [codeReviewResult, setCodeReviewResult] = useState<DevCodeReviewResponse['review'] | null>(
    null
  );
  const [showSolutionCode, setShowSolutionCode] = useState(false);

  // Active track info
  const trackInfo = TECH_TRACKS.find((t) => t.id === activeTrack) || TECH_TRACKS[0];
  const levelInfo = DEVELOPER_LEVELS.find((l) => l.id === activeLevel) || DEVELOPER_LEVELS[0];

  // Handle Track change
  const handleTrackChange = (track: TechTrack) => {
    setActiveTrack(track);
    setQuestionIdx(0);
    setCandidateAnswer('');
    setInterviewResult(null);
    setShowExpectedAnswer(false);
    stopSpeaking();
    setIsSpeaking(false);
    setIsSpeakingFeedback(false);
    if (isAnswerDictating) stopAnswerDictating();

    const chal = DEV_CODE_CHALLENGES.find((c) => c.track === track) || DEV_CODE_CHALLENGES[0];
    setCodeDraft(chal.starterCode);
    setCodeReviewResult(null);
    setShowSolutionCode(false);
    setHintsRevealed(0);
  };

  // Handle Level change
  const handleLevelChange = (lvl: DeveloperLevel) => {
    setActiveLevel(lvl);
    setQuestionIdx(0);
    setCandidateAnswer('');
    setInterviewResult(null);
    setShowExpectedAnswer(false);
    stopSpeaking();
    setIsSpeaking(false);
    setIsSpeakingFeedback(false);
    if (isAnswerDictating) stopAnswerDictating();
  };

  // Speak question
  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      stopSpeaking();
      setIsSpeaking(true);
      setIsSpeakingFeedback(false);
      speakText(`${currentQuestion.title}. ${currentQuestion.prompt}`, 'en', () =>
        setIsSpeaking(false)
      );
    }
  };

  // Speak evaluation feedback
  const handleSpeakFeedback = () => {
    if (isSpeakingFeedback) {
      stopSpeaking();
      setIsSpeakingFeedback(false);
    } else if (interviewResult) {
      stopSpeaking();
      setIsSpeakingFeedback(true);
      setIsSpeaking(false);
      const text = `Score: ${interviewResult.score} out of 100. Rating: ${interviewResult.rating}. ${interviewResult.feedback}. Follow up question: ${interviewResult.followUpQuestion}`;
      speakText(text, 'en', () => setIsSpeakingFeedback(false));
    }
  };

  // Format mm:ss
  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // Submit interview answer
  const handleSubmitInterviewAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateDevInterviewResponse(
        currentQuestion.prompt,
        candidateAnswer,
        trackInfo.name,
        activeLevel,
        currentQuestion.expectedAnswerSummary
      );
      setInterviewResult(res);

      if (res.score >= 80) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  // Submit code for review
  const handleSubmitCodeReview = async () => {
    if (!codeDraft.trim()) return;
    setIsReviewingCode(true);
    try {
      const res = await reviewDevCodeSubmission(
        codeDraft,
        activeChallenge.language,
        activeChallenge.title,
        activeLevel,
        activeChallenge.testCases
      );
      setCodeReviewResult(res.review);

      if (res.review.score >= 80) {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
        });
      }
    } finally {
      setIsReviewingCode(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-16">
      {/* Top Banner: Developer Tech Interview Platform */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-amber-400" />
                Developer Technical Interview Prep
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                Junior to Staff/Architect
              </span>
              <span className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-800 rounded">
                Candidate: {profile.name}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-100 font-sans tracking-tight">
              Master Coding & System Architecture Interviews
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl">
              Knowledge-calibrated technical interviews for lowest-knowledge beginners to top-class staff architects across Laravel (PHP), Python, JavaScript/React, AI/ML Transformers & Scalable System Design.
            </p>
          </div>

          {/* Navigation Modes: Interview vs Code Challenge vs Roadmap */}
          <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800 shrink-0 self-start lg:self-auto">
            <button
              onClick={() => setActiveMode('interview')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'interview'
                  ? 'bg-amber-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Mock Interview</span>
            </button>

            <button
              onClick={() => setActiveMode('challenge')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'challenge'
                  ? 'bg-blue-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Live Code Review</span>
            </button>

            <button
              onClick={() => setActiveMode('roadmap')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeMode === 'roadmap'
                  ? 'bg-purple-500 text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Career Roadmap</span>
            </button>
          </div>
        </div>

        {/* TECH TRACK SELECTOR PILLS */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
            Select Technology Track:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {TECH_TRACKS.map((t) => {
              const isSelected = activeTrack === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTrackChange(t.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-zinc-800 border-amber-500 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="font-bold text-xs text-zinc-100 truncate">{t.name}</div>
                  <div className="text-[10px] text-zinc-400 truncate mt-0.5">{t.badge}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* KNOWLEDGE LEVEL CALIBRATOR (Beginner / Lowest Knowledge to Staff / Top-Class) */}
        <div className="pt-3 border-t border-zinc-800/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Knowledge Depth Level:
            </span>
            <span className="text-[10px] font-mono text-amber-400 font-bold">
              {levelInfo.label.split(':')[0]}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {DEVELOPER_LEVELS.map((lvl) => {
              const isSelected = activeLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => handleLevelChange(lvl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                    isSelected
                      ? 'bg-zinc-800 border-amber-400 text-zinc-100 shadow-sm ring-1 ring-amber-400/20'
                      : 'bg-zinc-950/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="font-bold text-zinc-200 text-xs mb-0.5">{lvl.label}</div>
                  <div className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {lvl.sub}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE A: LIVE AI TECHNICAL MOCK INTERVIEWER */}
      {/* ========================================================================= */}
      {activeMode === 'interview' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Question Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {currentQuestion.topic}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                    {activeLevel.replace('_', ' ')}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-100 font-sans">
                  {currentQuestion.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleSpeakQuestion}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSpeaking
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-700'
                  }`}
                  title="Listen to interviewer prompt"
                >
                  <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-pulse text-emerald-400' : ''}`} />
                  <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
                </button>

                <button
                  onClick={() => setShowExpectedAnswer(!showExpectedAnswer)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-amber-300 border border-amber-500/30 hover:bg-zinc-700 transition-all flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showExpectedAnswer ? 'Hide Benchmarks' : 'Peek Benchmark'}</span>
                </button>
              </div>
            </div>

            {/* Prompt Statement */}
            <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                Technical Interviewer Prompt:
              </span>
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-sans font-medium">
                {currentQuestion.prompt}
              </p>

              {currentQuestion.exampleSolution && (
                <div className="mt-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                  <div className="text-[10px] text-zinc-500 mb-1 uppercase">Sample Reference Snippet:</div>
                  <pre>{currentQuestion.exampleSolution}</pre>
                </div>
              )}
            </div>

            {/* Benchmark Peek Box */}
            {showExpectedAnswer && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-zinc-300 space-y-2 animate-fadeIn">
                <div className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Senior/Staff Benchmark Summary:</span>
                </div>
                <p className="leading-relaxed">{currentQuestion.expectedAnswerSummary}</p>
                <div className="pt-2 border-t border-amber-500/20">
                  <strong className="text-amber-300 block mb-1">Common Candidate Pitfalls:</strong>
                  <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                    {currentQuestion.commonMisconceptions.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Candidate Answer Input Header & Voice Tools */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
                  <span>Your Technical Explanation / Code / Architectural Defense:</span>
                </label>

                {/* Voice-to-Text & AI Generation Control Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Language selector for speech recognition */}
                  <select
                    value={answerDictationLang}
                    onChange={(e) => setAnswerDictationLang(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-amber-500"
                    title="Voice Recognition Language"
                  >
                    {DICTATION_LANGUAGES.map((dl) => (
                      <option key={dl.code} value={dl.code}>
                        {dl.label}
                      </option>
                    ))}
                  </select>

                  {/* Direct Voice Dictation Toggle */}
                  <button
                    onClick={() => toggleAnswerDictating()}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isAnswerDictating
                        ? 'bg-rose-500 text-white animate-pulse shadow-md'
                        : 'bg-zinc-800 text-amber-300 border border-amber-500/30 hover:bg-zinc-700'
                    }`}
                    title="Speak your answer using microphone"
                  >
                    {isAnswerDictating ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Mic ({formatSeconds(answerDictationSeconds)})</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-amber-400" />
                        <span>🎙️ Speak Answer (Voice-to-Text)</span>
                      </>
                    )}
                  </button>

                  {/* Open Voice AI Answer Generator Modal */}
                  <button
                    onClick={() => setIsVoiceGeneratorModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-950 hover:from-amber-400 hover:to-amber-300 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-zinc-950" />
                    <span>✨ Voice-to-Text AI Answer Generator</span>
                  </button>
                </div>
              </div>

              {/* Interim Live Speech Stream Preview */}
              {isAnswerDictating && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2 animate-fadeIn">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="font-mono text-zinc-400">Live Voice Transcription:</span>
                  <span className="font-sans italic text-amber-200">{answerInterimTranscript || 'Listening to your voice...'}</span>
                </div>
              )}

              {/* Mic Error Notice */}
              {answerMicError && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{answerMicError}</span>
                </div>
              )}

              <textarea
                rows={7}
                value={candidateAnswer}
                onChange={(e) => setCandidateAnswer(e.target.value)}
                placeholder={`Speak or write how you would solve this in ${trackInfo.name} for a ${activeLevel.replace('_', ' ')} role (e.g. Big-O, concurrency, memory overhead & failure modes)...`}
                className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm font-sans focus:outline-none focus:border-amber-500 leading-relaxed"
              />
            </div>

            {/* Evaluation Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-500 font-mono">
                Questions in track: {questionIdx + 1} / {availableQuestions.length}
              </div>

              <div className="flex items-center gap-2">
                {candidateAnswer && (
                  <button
                    onClick={() => setCandidateAnswer('')}
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-800 border border-zinc-700 transition-all"
                  >
                    Clear Text
                  </button>
                )}

                <button
                  disabled={isEvaluating || !candidateAnswer.trim()}
                  onClick={handleSubmitInterviewAnswer}
                  className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
                >
                  {isEvaluating ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>AI Reviewing Rubric...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT TO TECHNICAL INTERVIEWER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI EVALUATION RUBRIC RESULTS */}
            {interviewResult && (
              <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg ${
                        interviewResult.score >= 80
                          ? 'bg-emerald-500 text-zinc-950'
                          : interviewResult.score >= 60
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-rose-500 text-zinc-950'
                      }`}
                    >
                      {interviewResult.score}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-zinc-400 uppercase">
                        AI Rubric Evaluation Score
                      </div>
                      <div className="text-base font-bold text-zinc-100">
                        Rating: <span className="text-amber-400">{interviewResult.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSpeakFeedback}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSpeakingFeedback
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:text-zinc-100 hover:bg-zinc-700'
                      }`}
                      title="Listen to interviewer evaluation"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${isSpeakingFeedback ? 'animate-pulse text-emerald-400' : ''}`} />
                      <span>{isSpeakingFeedback ? 'Stop Audio' : '🔊 Listen to Feedback'}</span>
                    </button>

                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300">
                      Calibrated: {activeLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Feedback Body */}
                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                  {interviewResult.feedback}
                </div>

                {/* Socratic Deep Dive Follow-Up */}
                {interviewResult.followUpQuestion && (
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-purple-300 font-mono">
                      <HelpCircle className="w-4 h-4" />
                      <span>Interviewer Follow-Up Probe:</span>
                    </div>
                    <p className="leading-relaxed">{interviewResult.followUpQuestion}</p>
                  </div>
                )}

                {/* Strengths & Areas to Improve */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs text-zinc-300 space-y-1">
                    <strong className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Key Strengths
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                      {interviewResult.strengths?.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-zinc-300 space-y-1">
                    <strong className="text-rose-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Areas to Tighten
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-zinc-400 text-[11px]">
                      {interviewResult.areasToImprove?.map((a, idx) => (
                        <li key={idx}>{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Top 1% Insider Tip */}
                {interviewResult.topTierTip && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      <strong>Staff Developer Tip:</strong> {interviewResult.topTierTip}
                    </span>
                  </div>
                )}

                {/* Next Question Navigation */}
                <div className="flex justify-end pt-3 border-t border-zinc-800">
                  <button
                    onClick={() => {
                      if (questionIdx < availableQuestions.length - 1) {
                        setQuestionIdx((prev) => prev + 1);
                      } else {
                        setQuestionIdx(0);
                      }
                      setCandidateAnswer('');
                      setInterviewResult(null);
                      setShowExpectedAnswer(false);
                      stopSpeaking();
                      setIsSpeaking(false);
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all flex items-center gap-2 shadow-md"
                  >
                    <span>Next Technical Question ➔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE B: LIVE CODE CHALLENGE & AI CODE REVIEWER */}
      {/* ========================================================================= */}
      {activeMode === 'challenge' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            {/* Challenge Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {activeChallenge.language.toUpperCase()} Challenge
                  </span>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Difficulty: {activeChallenge.difficulty}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    ⏱️ {activeChallenge.expectedTimeMinutes} mins
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-100 font-sans">
                  {activeChallenge.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {hintsRevealed < activeChallenge.hints.length && (
                  <button
                    onClick={() => setHintsRevealed((prev) => prev + 1)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-amber-300 border border-amber-500/30 hover:bg-zinc-700 transition-all flex items-center gap-1"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Show Hint {hintsRevealed + 1}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowSolutionCode(!showSolutionCode)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 transition-all"
                >
                  {showSolutionCode ? 'Hide Solution' : 'Peek Solution'}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase">Problem Brief:</span>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans">
                {activeChallenge.description}
              </p>
            </div>

            {/* Hints Display */}
            {hintsRevealed > 0 && (
              <div className="space-y-2">
                {activeChallenge.hints.slice(0, hintsRevealed).map((h, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 animate-fadeIn"
                  >
                    <strong className="font-mono mr-1.5">💡 Hint {idx + 1}:</strong>
                    {h}
                  </div>
                ))}
              </div>
            )}

            {/* Solution Peek */}
            {showSolutionCode && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>Production Reference Solution:</span>
                  <span>
                    Time: {activeChallenge.complexity.time} | Space: {activeChallenge.complexity.space}
                  </span>
                </div>
                <pre className="p-3 rounded-lg bg-zinc-900 text-xs font-mono text-zinc-200 overflow-x-auto">
                  {activeChallenge.solutionCode}
                </pre>
              </div>
            )}

            {/* Interactive Code Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Interactive Editor ({activeChallenge.language}):
                </span>
                <button
                  onClick={() => setCodeDraft(activeChallenge.starterCode)}
                  className="text-zinc-500 hover:text-zinc-300 text-[11px] flex items-center gap-1 font-mono"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Starter Code
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs">
                <div className="bg-zinc-900 px-4 py-2 text-[11px] text-zinc-400 border-b border-zinc-800 flex items-center justify-between">
                  <span>solution.{activeChallenge.language === 'php' ? 'php' : 'py'}</span>
                  <span>UTF-8 • {codeDraft.split('\n').length} lines</span>
                </div>
                <textarea
                  rows={14}
                  value={codeDraft}
                  onChange={(e) => setCodeDraft(e.target.value)}
                  className="w-full p-4 bg-zinc-950 text-zinc-100 font-mono text-xs focus:outline-none leading-relaxed resize-y selection:bg-amber-500/30"
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Code Review Submission */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-zinc-500 font-mono">
                Target: {activeChallenge.complexity.time}
              </div>

              <button
                disabled={isReviewingCode || !codeDraft.trim()}
                onClick={handleSubmitCodeReview}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-blue-500 text-zinc-950 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
              >
                {isReviewingCode ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>AI Reviewing Code Quality & Big-O...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-zinc-950" />
                    <span>RUN AI CODE REVIEW & OPTIMIZER</span>
                  </>
                )}
              </button>
            </div>

            {/* CODE REVIEW RESULTS */}
            {codeReviewResult && (
              <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-5 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-black text-lg ${
                        codeReviewResult.score >= 80
                          ? 'bg-emerald-500 text-zinc-950'
                          : 'bg-amber-500 text-zinc-950'
                      }`}
                    >
                      {codeReviewResult.score}
                    </div>
                    <div>
                      <div className="text-xs font-mono text-zinc-400 uppercase">
                        Code Quality Rating
                      </div>
                      <div className="text-base font-bold text-zinc-100">
                        {codeReviewResult.codeQualityRating}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-amber-300">
                      Time: {codeReviewResult.timeComplexity}
                    </span>
                    <span className="px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-blue-300">
                      Space: {codeReviewResult.spaceComplexity}
                    </span>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans">
                  {codeReviewResult.architectureFeedback}
                </div>

                {/* Strengths & Bugs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-xs space-y-1">
                    <strong className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Code Strengths
                    </strong>
                    <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
                      {codeReviewResult.strengths?.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs space-y-1">
                    <strong className="text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> Bottlenecks & Edge Cases
                    </strong>
                    <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-0.5">
                      {codeReviewResult.bottlenecksOrBugs?.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Production Refactored Code Snippet */}
                {codeReviewResult.optimizedCodeSnippet && (
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="text-xs font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      AI Refactored Production-Grade Code:
                    </div>
                    <pre className="p-4 rounded-xl bg-zinc-900 text-xs font-mono text-zinc-200 overflow-x-auto border border-zinc-800">
                      {codeReviewResult.optimizedCodeSnippet}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE C: DEVELOPER CAREER ROADMAP & TECH STACK PROGRESS */}
      {/* ========================================================================= */}
      {activeMode === 'roadmap' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="border-b border-zinc-800 pb-4 space-y-1">
              <span className="text-xs font-mono font-bold text-purple-400 uppercase">
                Progressive Mastery Roadmap
              </span>
              <h2 className="text-xl font-bold text-zinc-100">
                From Zero Knowledge to Staff Engineer in {trackInfo.name}
              </h2>
            </div>

            <div className="space-y-4">
              {DEVELOPER_LEVELS.map((lvl, idx) => (
                <div
                  key={lvl.id}
                  className={`p-5 rounded-xl border space-y-2.5 transition-all ${
                    activeLevel === lvl.id
                      ? 'bg-purple-950/20 border-purple-500/60 ring-1 ring-purple-500/20'
                      : 'bg-zinc-950/60 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h3 className="font-bold text-sm text-zinc-100">{lvl.label}</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${lvl.badgeColor}`}>
                      {lvl.id.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">{lvl.sub}</p>

                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      Core focus: {trackInfo.keyTopics[idx] || 'System Performance'}
                    </span>
                    <button
                      onClick={() => {
                        setActiveLevel(lvl.id);
                        setActiveMode('interview');
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-bold bg-zinc-800 text-amber-300 hover:bg-zinc-700 flex items-center gap-1"
                    >
                      <span>Practice Level {idx + 1} ➔</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Voice-to-Text Answer Generator Studio Modal */}
      <VoiceAnswerGeneratorModal
        isOpen={isVoiceGeneratorModalOpen}
        onClose={() => setIsVoiceGeneratorModalOpen(false)}
        question={currentQuestion}
        track={activeTrack}
        trackName={trackInfo.name}
        level={activeLevel}
        onApplyAnswer={(answerText) => {
          setCandidateAnswer(answerText);
          setIsVoiceGeneratorModalOpen(false);
        }}
        initialSpokenNotes={candidateAnswer}
      />
    </div>
  );
};
