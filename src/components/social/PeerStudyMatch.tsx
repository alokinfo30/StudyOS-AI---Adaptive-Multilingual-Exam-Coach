import React, { useState, useEffect } from 'react';
import {
  Users,
  Timer,
  Sparkles,
  Zap,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Award,
  Share2,
  RefreshCw,
  Send,
  UserCheck,
  ShieldAlert,
  HelpCircle,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  PeerStudent,
  PeerCollaborativeSession,
  PeerChallengeQuestion,
  UserProfile,
} from '../../types';

interface PeerStudyMatchProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  activeChapterId?: string;
  activeChapterTitle?: string;
}

const PEER_POOL: PeerStudent[] = [
  {
    id: 'peer_1',
    name: 'Aarav Sharma',
    avatar: '👨‍🎓',
    city: 'Kota',
    state: 'Rajasthan',
    board: 'CBSE',
    targetExam: 'JEE Main 2026',
    streakDays: 18,
    activeChapterId: 'ch_electricity_fundamentals',
    activeChapterTitle: 'Current Electricity & Circuits',
    accuracy: 91,
    status: 'ready_to_match',
  },
  {
    id: 'peer_2',
    name: 'Priya Nair',
    avatar: '👩‍🎓',
    city: 'Bengaluru',
    state: 'Karnataka',
    board: 'CBSE',
    targetExam: 'Class 10 Boards',
    streakDays: 24,
    activeChapterId: 'ch_electricity_fundamentals',
    activeChapterTitle: 'Current Electricity & Circuits',
    accuracy: 88,
    status: 'ready_to_match',
  },
  {
    id: 'peer_3',
    name: 'Rohan Gupta',
    avatar: '🧑‍💻',
    city: 'Patna',
    state: 'Bihar',
    board: 'Bihar Board',
    targetExam: 'NEET 2026',
    streakDays: 12,
    activeChapterId: 'ch_electricity_fundamentals',
    activeChapterTitle: 'Current Electricity & Circuits',
    accuracy: 84,
    status: 'ready_to_match',
  },
  {
    id: 'peer_4',
    name: 'Ananya Verma',
    avatar: '👩‍🔬',
    city: 'New Delhi',
    state: 'Delhi NCR',
    board: 'CBSE',
    targetExam: 'Class 10 Boards',
    streakDays: 31,
    activeChapterId: 'ch_light_optics',
    activeChapterTitle: 'Light: Reflection & Refraction',
    accuracy: 94,
    status: 'ready_to_match',
  },
];

const COLLABORATIVE_QUESTIONS: PeerChallengeQuestion[] = [
  {
    id: 'pq_1',
    conceptName: "Ohm's Law & Resistance Dependency",
    difficulty: 'medium',
    prompt:
      'A cylindrical copper wire of length L and cross-sectional area A has resistance R. If it is stretched uniformly to double its length (2L), what is its new resistance?',
    options: ['2R', '4R', 'R / 2', 'R / 4'],
    correctIndex: 1,
    explanation:
      'When stretched with constant volume (V = A * L), doubling length (2L) halves cross-sectional area (A/2). Therefore, R_new = rho * (2L) / (A/2) = 4 * (rho * L / A) = 4R.',
  },
  {
    id: 'pq_2',
    conceptName: 'Parallel Circuit Power Dissipation',
    difficulty: 'medium',
    prompt:
      'Two bulbs rated 220V, 60W and 220V, 100W are connected in parallel across 220V mains supply. Which bulb will draw more current and glow brighter?',
    options: [
      '60W bulb glows brighter',
      '100W bulb glows brighter',
      'Both draw equal current',
      'Neither will glow',
    ],
    correctIndex: 1,
    explanation:
      'In parallel circuits, voltage across both is identical (220V). Current I = P / V. The 100W bulb draws 100/220 = 0.45A compared to 60/220 = 0.27A, dissipating more power and glowing brighter.',
  },
  {
    id: 'pq_3',
    conceptName: 'Equivalent Resistance of Combination',
    difficulty: 'hard',
    prompt:
      'Three identical resistors each of 6 Ω are combined. What is the minimum possible equivalent resistance you can obtain?',
    options: ['18 Ω', '9 Ω', '3 Ω', '2 Ω'],
    correctIndex: 3,
    explanation:
      'Minimum resistance is achieved when all 3 resistors are connected in PARALLEL: 1/R_eq = 1/6 + 1/6 + 1/6 = 3/6 = 1/2, giving R_eq = 2 Ω.',
  },
  {
    id: 'pq_4',
    conceptName: 'Joule’s Law of Heating',
    difficulty: 'medium',
    prompt:
      'If electric current through a fixed resistor is doubled while time duration is cut in half, the heat energy produced will:',
    options: ['Double', 'Halve', 'Quadruple', 'Remain constant'],
    correctIndex: 0,
    explanation:
      'Heat H = I² * R * t. When I -> 2I, I² -> 4I². With t -> t/2, new heat H_new = 4I² * R * (t/2) = 2 * (I² R t) = 2H (Doubles).',
  },
];

export const PeerStudyMatch: React.FC<PeerStudyMatchProps> = ({
  isOpen,
  onClose,
  userProfile,
  activeChapterId = 'ch_electricity_fundamentals',
  activeChapterTitle = 'Current Electricity & Circuits',
}) => {
  const [matchState, setMatchState] = useState<'idle' | 'searching' | 'matched' | 'session' | 'summary'>(
    'idle'
  );
  const [matchedPeer, setMatchedPeer] = useState<PeerStudent | null>(null);
  const [session, setSession] = useState<PeerCollaborativeSession | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [newNote, setNewNote] = useState('');

  // Search Match Simulation
  const handleStartSearch = () => {
    setMatchState('searching');
    setTimeout(() => {
      const candidate =
        PEER_POOL.find((p) => p.activeChapterId === activeChapterId) || PEER_POOL[0];
      setMatchedPeer(candidate);
      setMatchState('matched');
    }, 2200);
  };

  // Launch 10-Minute Collaborative Practice Session
  const handleLaunchSession = () => {
    if (!matchedPeer) return;
    const initialSession: PeerCollaborativeSession = {
      id: `peer_sess_${Date.now()}`,
      peer: matchedPeer,
      chapterId: activeChapterId,
      chapterTitle: activeChapterTitle,
      durationSeconds: 600, // 10 Minutes
      remainingSeconds: 600,
      currentQuestionIndex: 0,
      totalQuestions: COLLABORATIVE_QUESTIONS.length,
      questions: COLLABORATIVE_QUESTIONS,
      studentAnswers: {},
      peerAnswers: {},
      studentScore: 0,
      peerScore: 0,
      sharedNotes: [
        `💡 ${matchedPeer.name}: "Hey! Let's solve these 4 board questions together and double-check units!"`,
      ],
      isFinished: false,
    };
    setSession(initialSession);
    setSelectedOption(null);
    setMatchState('session');
  };

  // 10-minute Countdown Timer Effect
  useEffect(() => {
    if (matchState !== 'session' || !session || session.isFinished) return;

    const timer = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          clearInterval(timer);
          setMatchState('summary');
          return { ...prev, remainingSeconds: 0, isFinished: true };
        }
        return { ...prev, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matchState, session?.isFinished]);

  if (!isOpen) return null;

  const currentQIndex = session?.currentQuestionIndex || 0;
  const currentQ = session?.questions[currentQIndex];

  // Submit Answer
  const handleSubmitAnswer = (optIndex: number) => {
    if (!session || !currentQ || selectedOption !== null) return;
    setSelectedOption(optIndex);

    const isCorrect = optIndex === currentQ.correctIndex;
    const peerAnswer = currentQ.correctIndex; // Peer solves correctly after short delay

    const updatedStudentScore = isCorrect ? session.studentScore + 10 : session.studentScore;
    const updatedPeerScore = session.peerScore + 10;

    const updatedStudentAnswers = { ...session.studentAnswers, [currentQIndex]: optIndex };
    const updatedPeerAnswers = { ...session.peerAnswers, [currentQIndex]: peerAnswer };

    setTimeout(() => {
      if (currentQIndex + 1 < session.totalQuestions) {
        setSession({
          ...session,
          currentQuestionIndex: currentQIndex + 1,
          studentAnswers: updatedStudentAnswers,
          peerAnswers: updatedPeerAnswers,
          studentScore: updatedStudentScore,
          peerScore: updatedPeerScore,
        });
        setSelectedOption(null);
      } else {
        setSession({
          ...session,
          studentAnswers: updatedStudentAnswers,
          peerAnswers: updatedPeerAnswers,
          studentScore: updatedStudentScore,
          peerScore: updatedPeerScore,
          isFinished: true,
          peerFeedbackBadge: '🌟 Supercharged Collaborator Badge',
        });
        setMatchState('summary');
      }
    }, 1200);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !session) return;
    setSession({
      ...session,
      sharedNotes: [...session.sharedNotes, `📝 You: "${newNote.trim()}"`],
    });
    setNewNote('');
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">
                  Peer Study Match: 10-Minute Collaborative Room
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Chapter: <strong className="text-zinc-200">{activeChapterTitle}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Close Room"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic State Views */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 bg-zinc-950">
          {/* VIEW 1: IDLE / MATCHMAKING LOBBY */}
          {matchState === 'idle' && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-zinc-100">
                  Find a Study Partner on "{activeChapterTitle}"
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Connect with a verified student across India preparing for the same syllabus. Solve 4 high-yield questions together in a 10-minute timer session to test speed and accuracy!
                </p>
              </div>

              <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-left space-y-3">
                <div className="text-[11px] font-mono uppercase text-zinc-400 font-bold">
                  Active Students in Queue ({PEER_POOL.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PEER_POOL.map((peer) => (
                    <div
                      key={peer.id}
                      className="p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{peer.avatar}</span>
                        <div>
                          <div className="font-bold text-zinc-200">{peer.name}</div>
                          <div className="text-[10px] text-zinc-400">{peer.city}, {peer.board}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {peer.accuracy}% Acc
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleStartSearch}
                className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-zinc-950" />
                <span>Find Peer Study Match</span>
              </button>
            </div>
          )}

          {/* VIEW 2: SEARCHING RADAR */}
          {matchState === 'searching' && (
            <div className="py-12 text-center space-y-4 max-w-md mx-auto">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-ping" />
                <div className="absolute inset-2 rounded-full border-2 border-amber-400/70 animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-amber-500 flex items-center justify-center text-amber-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <h4 className="text-base font-bold text-zinc-100">
                Scanning Active Student Nodes...
              </h4>
              <p className="text-xs text-zinc-400 font-mono">
                Matching student studying {activeChapterTitle} with compatible accuracy index...
              </p>
            </div>
          )}

          {/* VIEW 3: MATCH FOUND MODAL */}
          {matchState === 'matched' && matchedPeer && (
            <div className="space-y-5 text-center max-w-md mx-auto py-2">
              <div className="p-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center justify-center gap-2 font-mono font-bold">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Match Found! Compatible Study Partner Connected</span>
              </div>

              {/* Match Card */}
              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-950 border-2 border-amber-500 text-3xl flex items-center justify-center mx-auto shadow-md">
                  {matchedPeer.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-100">{matchedPeer.name}</h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    {matchedPeer.city}, {matchedPeer.state} • {matchedPeer.board} ({matchedPeer.targetExam})
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase block">Study Streak</span>
                    <span className="text-amber-400 font-bold">🔥 {matchedPeer.streakDays} Days</span>
                  </div>
                  <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-400 uppercase block">Chapter Accuracy</span>
                    <span className="text-emerald-400 font-bold">🎯 {matchedPeer.accuracy}%</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLaunchSession}
                className="w-full py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Start 10-Minute Collaborative Room</span>
              </button>
            </div>
          )}

          {/* VIEW 4: ACTIVE 10-MINUTE COLLABORATIVE SESSION */}
          {matchState === 'session' && session && currentQ && (
            <div className="space-y-4">
              {/* Top Room Banner with 10-min Timer & Scores */}
              <div className="p-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-zinc-200">
                    <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-amber-400">{formatTime(session.remainingSeconds)}</span>
                  </div>
                  <span className="text-xs text-zinc-500">|</span>
                  <span className="text-xs font-mono text-zinc-300">
                    Question {currentQIndex + 1} of {session.totalQuestions}
                  </span>
                </div>

                {/* Score Tracker */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">You:</span>
                    <span className="font-bold text-amber-400">{session.studentScore} pts</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-400">{session.peer.name}:</span>
                    <span className="font-bold text-emerald-400">{session.peerScore} pts</span>
                  </div>
                </div>
              </div>

              {/* Challenge Question Card */}
              <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20">
                    {currentQ.conceptName}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Difficulty: {currentQ.difficulty}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-zinc-100 leading-relaxed">
                  {currentQ.prompt}
                </h4>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {currentQ.options.map((opt, oIdx) => {
                    const isChosen = selectedOption === oIdx;
                    const isCorrect = currentQ.correctIndex === oIdx;

                    let btnStyle =
                      'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700';
                    if (selectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                      } else if (isChosen) {
                        btnStyle = 'bg-red-950/60 border-red-500 text-red-200 font-bold';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={selectedOption !== null}
                        onClick={() => handleSubmitAnswer(oIdx)}
                        className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {selectedOption !== null && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                        )}
                        {selectedOption !== null && isChosen && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1 animate-fadeIn">
                    <div className="font-mono font-bold text-emerald-400">Step Derivation:</div>
                    <p className="leading-relaxed">{currentQ.explanation}</p>
                  </div>
                )}
              </div>

              {/* Shared Collaborative Note Pad */}
              <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl space-y-3">
                <div className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Shared Scratchpad & Live Peer Discussion</span>
                </div>

                <div className="space-y-1.5 max-h-28 overflow-y-auto p-2 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs">
                  {session.sharedNotes.map((note, nIdx) => (
                    <div key={nIdx} className="text-zinc-300 font-sans">
                      {note}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type a collaborative note or question to your peer..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* VIEW 5: POST-SESSION SUMMARY & BADGES */}
          {matchState === 'summary' && session && (
            <div className="space-y-5 text-center max-w-md mx-auto py-4">
              <div className="w-16 h-16 rounded-full bg-amber-500 text-zinc-950 text-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
                🏆
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-zinc-100">
                  Collaborative Session Completed!
                </h3>
                <p className="text-xs text-zinc-400">
                  Great work collaborating with {session.peer.name}!
                </p>
              </div>

              {/* Awarded Badge Card */}
              <div className="p-4 bg-gradient-to-br from-amber-500/20 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-2xl space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-amber-300 font-bold text-xs font-mono">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>TROPHY EARNED</span>
                </div>
                <div className="text-sm font-black text-zinc-100">
                  {session.peerFeedbackBadge || '🌟 Supercharged Collaborator Badge'}
                </div>
                <p className="text-[11px] text-zinc-400">
                  Awarded for completing a 10-minute collaborative chapter review with zero dropouts.
                </p>
              </div>

              {/* Scores Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className="text-zinc-400 text-[10px] block">Your Score</span>
                  <span className="text-amber-400 font-bold text-base">{session.studentScore} pts</span>
                </div>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <span className="text-zinc-400 text-[10px] block">{session.peer.name}'s Score</span>
                  <span className="text-emerald-400 font-bold text-base">{session.peerScore} pts</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMatchState('idle')}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
                >
                  Back to Lobby
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
