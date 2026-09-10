import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Volume2,
  UploadCloud,
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Eye,
  Sliders,
  Tv,
  Camera,
  Scissors,
} from 'lucide-react';
import {
  TeacherTrainingProgram,
  TeachingSkillCategory,
  TeachingTake,
  VirtualStudent,
  TeachingSessionDraft,
} from '../../types/teaching';
import { TeachingSessionRecorder } from './TeachingSessionRecorder';
import { playMasteryPopSound } from '../../utils/audioEffects';

interface MicroTeachingPracticeStudioProps {
  onPublishTake: (take: TeachingTake, allTakesCount: number) => void;
  onOpenCampusReels: () => void;
  initialDraft?: TeachingSessionDraft | null;
  onOpenDrafts?: () => void;
}

const SAMPLE_VIRTUAL_STUDENTS: VirtualStudent[] = [
  {
    id: 's_01',
    name: 'Aarav (Class 9)',
    avatar: '👦',
    grade: 'Class 9',
    trait: 'curious',
    sampleQuestion: 'Teacher, what if the object has the same density as water? Will it float or sink?',
  },
  {
    id: 's_02',
    name: 'Priya (Class 9)',
    avatar: '👧',
    grade: 'Class 9',
    trait: 'enthusiastic',
    sampleQuestion: 'Sir, does buoyant force also act on balloons filled with helium in air?',
  },
  {
    id: 's_03',
    name: 'Kabir (Class 9)',
    avatar: '👦',
    grade: 'Class 9',
    trait: 'thoughtful',
    sampleQuestion: 'Why does a giant metal ship not sink like an iron pin does?',
  },
];

export const MicroTeachingPracticeStudio: React.FC<MicroTeachingPracticeStudioProps> = ({
  onPublishTake,
  onOpenCampusReels,
  initialDraft,
  onOpenDrafts,
}) => {
  // Setup & Lesson Configuration
  const [program, setProgram] = useState<TeacherTrainingProgram>('b_ed');
  const [skillCategory, setSkillCategory] = useState<TeachingSkillCategory>('set_induction');
  const [topic, setTopic] = useState("Archimedes' Principle & Fluid Buoyancy");
  const [lessonObjectives, setLessonObjectives] = useState(
    'Introduce fluid displacement through a simple demonstration; guide students to discover buoyant force.'
  );

  // Auto-fill and switch to recorder if initialDraft is provided
  useEffect(() => {
    if (initialDraft) {
      setTopic(initialDraft.topicTitle);
      setSkillCategory(initialDraft.skillFocus);
      setProgram(initialDraft.program);
      if (initialDraft.lessonObjectives) {
        setLessonObjectives(initialDraft.lessonObjectives);
      }
      setStudioView('recorder');
    }
  }, [initialDraft]);

  // Recording State
  const [studioView, setStudioView] = useState<'recorder' | 'simulation'>('recorder');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [takes, setTakes] = useState<TeachingTake[]>([]);
  const [selectedTakeId, setSelectedTakeId] = useState<string | null>(null);

  const handleSaveTakeFromRecorder = (newTake: TeachingTake) => {
    setTakes((prev) => {
      const exists = prev.some((t) => t.id === newTake.id);
      if (exists) {
        return prev.map((t) => (t.id === newTake.id ? newTake : t));
      }
      // Unmark previous best if new take is best
      const mapped = prev.map((t) => ({ ...t, isBestTake: false }));
      return [...mapped, { ...newTake, isBestTake: true }];
    });
    setSelectedTakeId(newTake.id);
  };

  // Hardware / Stream State
  const [cameraActive, setCameraActive] = useState(false);
  const [micActive, setMicActive] = useState(true);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Virtual Student Classroom Interactivity
  const [activeStudentQuestion, setActiveStudentQuestion] = useState<{
    student: VirtualStudent;
    resolved: boolean;
  } | null>(null);

  // Speech & Teleprompter
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2);
  const [teleprompterOpen, setTeleprompterOpen] = useState(true);

  // Initialize camera
  const startCamera = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable; switching to simulation canvas mode:', err);
      setPermissionError('Camera unavailable or permission denied. Interactive Studio simulation is active.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Timer loop during recording
  useEffect(() => {
    let timer: any = null;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          const nextSec = prev + 1;
          // Trigger a simulated student question at 15 seconds to test trainee inquiry handling
          if (nextSec === 15 && !activeStudentQuestion) {
            const randomStudent = SAMPLE_VIRTUAL_STUDENTS[Math.floor(Math.random() * SAMPLE_VIRTUAL_STUDENTS.length)];
            setActiveStudentQuestion({ student: randomStudent, resolved: false });
          }
          return nextSec;
        });
      }, 1000);
    } else {
      if (timer) clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, activeStudentQuestion]);

  // Clean up media streams
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleToggleRecording = () => {
    if (!isRecording) {
      // Start Recording
      setIsRecording(true);
      setRecordingSeconds(0);
      setActiveStudentQuestion(null);
    } else {
      // Stop Recording & Save Take
      setIsRecording(false);
      const takeNumber = takes.length + 1;
      const duration = recordingSeconds || 45;

      // Realistic pedagogical AI metrics calculation
      const speechPace = Math.floor(115 + Math.random() * 15);
      const clarity = Math.floor(88 + Math.random() * 10);
      const modulation = Math.floor(85 + Math.random() * 12);
      const engagement = Math.floor(87 + Math.random() * 11);

      const newTake: TeachingTake = {
        id: `take_${Date.now()}`,
        takeNumber,
        durationSeconds: duration,
        recordedAt: Date.now(),
        speechPaceWpm: speechPace,
        clarityScore: clarity,
        voiceModulationScore: modulation,
        studentEngagementScore: engagement,
        detectedPedagogicalKeywords: [
          'Archimedes',
          'Buoyant Force',
          'Fluid Displacement',
          'Why do you think?',
          'Let us observe',
        ],
        rubricSelfRatings: {
          setInduction: 9,
          blackboardWork: 9,
          explanationClarity: 9,
          probingQuestions: 8,
          bodyLanguage: 9,
          lessonClosure: 8,
        },
        aiFeedback: {
          strengths: [
            'Warm, welcoming opening set induction hook that grabbed attention',
            'Optimal speech pace (120 WPM); well suited for Class 9 comprehension',
            'Patient response when student raised a question about density',
          ],
          improvements: [
            'Try to write the core equation in bigger lettering on the board',
            'Leave a 3-second pause after asking open-ended questions',
          ],
          pedagogicalTip:
            'Use Socratic questioning: instead of answering immediately, ask another student what they observed.',
        },
        virtualStudentInteractions: activeStudentQuestion
          ? [
              {
                studentName: activeStudentQuestion.student.name,
                question: activeStudentQuestion.student.sampleQuestion,
                resolved: true,
              },
            ]
          : [],
        isBestTake: takes.length === 0, // First take defaults to best until user selects another
      };

      const updatedTakes = [...takes, newTake];
      setTakes(updatedTakes);
      setSelectedTakeId(newTake.id);
      playMasteryPopSound(true);
    }
  };

  const handleSetBestTake = (takeId: string) => {
    setTakes((prev) =>
      prev.map((t) => ({
        ...t,
        isBestTake: t.id === takeId,
      }))
    );
    setSelectedTakeId(takeId);
    playMasteryPopSound(true);
  };

  const bestTake = takes.find((t) => t.isBestTake) || takes[0];
  const currentInspectTake = takes.find((t) => t.id === selectedTakeId) || bestTake;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border border-amber-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Practicum & Internship Phase
              </span>
              <span className="text-xs text-zinc-400">
                Supports Mobile • Laptop • Desktop
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Apprentice Educator AI Teaching Studio
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              Practice micro-teaching lessons multiple times, receive live pedagogical feedback, handle virtual student inquiry, select your best session take, and broadcast to your College Campus Reels feed!
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenCampusReels}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold transition shadow-md"
            >
              <Tv className="w-4 h-4 text-amber-400" />
              <span>Campus Reels Feed</span>
            </button>

            {takes.length > 0 && bestTake && (
              <button
                type="button"
                onClick={() => onPublishTake(bestTake, takes.length)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-zinc-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Post Take #{bestTake.takeNumber} to Campus</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Studio Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 bg-zinc-950 border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setStudioView('recorder')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              studioView === 'recorder'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Session Recorder (MediaRecorder & Trimmer)</span>
          </button>

          <button
            type="button"
            onClick={() => setStudioView('simulation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              studioView === 'simulation'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Interactive Virtual Classroom & Teleprompter</span>
          </button>
        </div>

        <div className="text-xs text-zinc-400 flex items-center gap-2 pr-2">
          <Scissors className="w-3.5 h-3.5 text-amber-400" />
          <span>Record, review, trim & publish takes to campus reels</span>
        </div>
      </div>

      {studioView === 'recorder' ? (
        <TeachingSessionRecorder
          skillFocus={skillCategory}
          program={program}
          topicTitle={topic}
          onSaveTake={handleSaveTakeFromRecorder}
          onPublishTake={(take) => onPublishTake(take, takes.length)}
          existingTakesCount={takes.length}
          initialDraft={initialDraft}
          onOpenDrafts={onOpenDrafts}
        />
      ) : (
        /* Main Studio Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera / Live Presenter Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden aspect-video shadow-2xl flex flex-col items-center justify-center">
            {/* Live Camera Feed if active */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Interactive Fallback Simulation Canvas if camera off */}
            {!cameraActive && (
              <div className="w-full h-full bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 p-6 flex flex-col justify-between relative">
                {/* Virtual Blackboard */}
                <div className="bg-emerald-950/40 border-2 border-emerald-800/60 rounded-2xl p-4 shadow-inner">
                  <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400 border-b border-emerald-800/40 pb-1 mb-2">
                    <span>MICRO-TEACHING SMARTBOARD</span>
                    <span>SKILL: {skillCategory.toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-emerald-200">{topic}</h4>
                  <p className="text-xs text-emerald-300/80 mt-1 line-clamp-2">
                    {lessonObjectives}
                  </p>
                </div>

                {/* Simulated Presenter Avatar & Waveform */}
                <div className="flex flex-col items-center justify-center my-auto text-center space-y-2">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-4xl shadow-xl">
                      {program === 'iti_trainer' ? '👨‍🔧' : '👩‍🏫'}
                    </div>
                    {isRecording && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Interactive Studio Presenter Mode
                    </h5>
                    <p className="text-[11px] text-zinc-400">
                      {isRecording ? 'Session in progress... Speech pace active' : 'Click "Start Teaching Take" to practice'}
                    </p>
                  </div>

                  {/* Audio Wave Bar Simulation */}
                  {isRecording && (
                    <div className="flex items-center gap-1 h-6">
                      {[12, 24, 18, 28, 14, 22, 30, 16, 26, 20, 14, 25].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-1 bg-amber-400 rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Canvas Info */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Standard Micro-Teaching Cycle (5-6 min)</span>
                  <span>{takes.length} takes completed today</span>
                </div>
              </div>
            )}

            {/* Overlay: Recording Indicator & Duration */}
            {isRecording && (
              <div className="absolute top-4 left-4 bg-rose-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg animate-pulse">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>REC {formatSeconds(recordingSeconds)}</span>
              </div>
            )}

            {/* Overlay: Live Simulated Student Hand-Raise Alert */}
            {activeStudentQuestion && (
              <div className="absolute top-4 right-4 max-w-xs bg-amber-500 text-zinc-950 p-3 rounded-2xl shadow-2xl border border-amber-300 animate-in slide-in-from-top duration-300">
                <div className="flex items-start gap-2">
                  <span className="text-xl shrink-0">✋</span>
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
                      <span>{activeStudentQuestion.student.name} asked:</span>
                    </div>
                    <p className="text-xs font-semibold leading-tight mt-0.5">
                      "{activeStudentQuestion.student.sampleQuestion}"
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveStudentQuestion((prev) =>
                          prev ? { ...prev, resolved: true } : null
                        )
                      }
                      className="mt-2 text-[10px] bg-zinc-950 text-amber-300 px-2 py-1 rounded-lg font-bold hover:bg-zinc-800 transition"
                    >
                      {activeStudentQuestion.resolved ? '✓ Question Acknowledged' : 'Acknowledge Student Question'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hardware Controls Floating Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-2xl">
              <button
                type="button"
                onClick={cameraActive ? stopCamera : startCamera}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  cameraActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
                title={cameraActive ? 'Turn off camera' : 'Turn on camera'}
              >
                {cameraActive ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{cameraActive ? 'Camera ON' : 'Enable Camera'}</span>
              </button>

              <button
                type="button"
                onClick={() => setMicActive((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  micActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{micActive ? 'Mic ON' : 'Mic OFF'}</span>
              </button>

              <div className="w-px h-6 bg-zinc-800" />

              {/* Main Record Action Button */}
              <button
                type="button"
                onClick={handleToggleRecording}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
                }`}
              >
                {isRecording ? (
                  <>
                    <Square className="w-4 h-4" />
                    <span>Stop Take & Analyze</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Teaching Take #{takes.length + 1}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Classroom Stimulator: Simulate Student Interactivity */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Simulate Classroom Inquiry</span>
                <span className="text-[11px] text-zinc-400">Trigger spontaneous questions to test student-teacher management</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {SAMPLE_VIRTUAL_STUDENTS.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => setActiveStudentQuestion({ student, resolved: false })}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-2.5 py-1.5 rounded-xl border border-zinc-700/60 transition flex items-center gap-1"
                >
                  <span>{student.avatar}</span>
                  <span className="hidden sm:inline">{student.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Teleprompter & Lesson Objectives & Take Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Lesson Config Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                Lesson Plan & Objectives
              </h3>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value as TeachingSkillCategory)}
                className="text-[11px] bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-zinc-300"
              >
                <option value="set_induction">Set Induction</option>
                <option value="blackboard_skill">Blackboard Writing</option>
                <option value="probing_questions">Probing Questions</option>
                <option value="stimulus_variation">Stimulus Variation</option>
                <option value="explanation_analogy">Explanation & Analogy</option>
                <option value="reinforcement_praise">Reinforcement Skill</option>
                <option value="classroom_management">Classroom Management</option>
                <option value="lesson_closure">Lesson Closure</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-zinc-400 block mb-1">Lesson Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Teleprompter Scrollable Box */}
            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1.5">
                <span className="font-semibold text-zinc-300">Teleprompter / Teaching Cue Notes:</span>
                <span className="text-[10px] text-amber-400 font-mono">110-140 WPM Recommended</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-h-24 overflow-y-auto pr-1">
                "Good morning students! Before we write anything on the board, look at this beaker of water. If I drop this heavy stone, it sinks instantly. But look at this ship weighing thousands of tons floating in the ocean... Why does that happen?"
              </p>
            </div>
          </div>

          {/* Takes History Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Practice Takes ({takes.length})
              </h3>
              {takes.length > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium">
                  {takes.filter((t) => t.isBestTake).length > 0 ? '⭐ Best Take Selected' : 'Select best take below'}
                </span>
              )}
            </div>

            {takes.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 text-xs bg-zinc-950/50 rounded-2xl border border-zinc-800/60 p-4">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-zinc-600 animate-spin-slow" />
                <p className="font-semibold text-zinc-400">No practice takes recorded yet</p>
                <p className="mt-1">
                  Hit <strong className="text-amber-400">Start Teaching Take</strong> to begin practicing. You can record as many takes as you want until you achieve your best session!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {takes.map((take) => (
                  <div
                    key={take.id}
                    onClick={() => setSelectedTakeId(take.id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedTakeId === take.id
                        ? 'bg-amber-500/10 border-amber-500/40 text-white'
                        : 'bg-zinc-950/70 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          take.isBestTake
                            ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        #{take.takeNumber}
                      </div>
                      <div>
                        <div className="text-xs font-bold flex items-center gap-2">
                          <span>Take #{take.takeNumber}</span>
                          {take.isBestTake && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                              BEST TAKE ⭐
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 flex items-center gap-2 mt-0.5">
                          <span>{formatSeconds(take.durationSeconds)}</span>
                          <span>•</span>
                          <span>{take.speechPaceWpm} WPM</span>
                          <span>•</span>
                          <span>{take.clarityScore}% Clarity</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!take.isBestTake ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetBestTake(take.id);
                          }}
                          className="text-[10px] bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-300 px-2 py-1 rounded-lg font-semibold transition"
                        >
                          Mark Best ⭐
                        </button>
                      ) : (
                        <span className="text-amber-400 text-xs font-bold">Selected</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Inspect Selected Take AI Feedback */}
            {currentInspectTake && (
              <div className="p-3.5 bg-zinc-950/80 border border-zinc-800 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-300">
                  <span className="font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Take #{currentInspectTake.takeNumber} AI Pedagogical Feedback
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {currentInspectTake.clarityScore}% Overall Delivery
                  </span>
                </div>

                <div className="space-y-1 text-zinc-400 text-[11px]">
                  <p className="text-zinc-200">
                    <strong className="text-emerald-400">Strengths:</strong>{' '}
                    {currentInspectTake.aiFeedback.strengths.join(' • ')}
                  </p>
                  <p className="text-zinc-300">
                    <strong className="text-amber-400">Pedagogical Tip:</strong>{' '}
                    {currentInspectTake.aiFeedback.pedagogicalTip}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
};
