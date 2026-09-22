import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  Clock, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Play, 
  Pause, 
  RefreshCw,
  Search,
  Filter,
  GraduationCap,
  Award,
  BookOpen
} from 'lucide-react';
import { StudentProfile, TaRLBand, TaRLPlan, Dialect } from '../../types/akshar';
import { INITIAL_TARL_PLAN } from '../../data/aksharData';

interface TaRLGroupingViewProps {
  students: StudentProfile[];
  onMoveStudent: (studentId: string, newBand: TaRLBand) => void;
  currentDialect: Dialect;
  chalkMode: boolean;
}

export const TaRLGroupingView: React.FC<TaRLGroupingViewProps> = ({
  students,
  onMoveStudent,
  currentDialect,
  chalkMode,
}) => {
  const [tarlPlan, setTarlPlan] = useState<TaRLPlan>(INITIAL_TARL_PLAN);
  const [activeInstructionBand, setActiveInstructionBand] = useState<TaRLBand>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterGrade, setFilterGrade] = useState<number | 'all'>('all');

  // Rotation Timer State (12 minutes standard TaRL micro-station cycle)
  const [timerSeconds, setTimerSeconds] = useState<number>(12 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
      // Play station chime alert if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
      } catch {}
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRotateStation = () => {
    setActiveInstructionBand((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
    setTimerSeconds(12 * 60);
    setIsTimerRunning(true);
  };

  // Generate fresh TaRL Activities from AI
  const handleRegenerateActivities = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/akshar/tarl-generate-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeBand: activeInstructionBand,
          classroomSize: students.length,
          dialect: currentDialect,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setTarlPlan(resData.data);
      }
    } catch (err: any) {
      console.error('TaRL generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Group partition
  const band1Students = students.filter((s) => s.currentBand === 1);
  const band2Students = students.filter((s) => s.currentBand === 2);
  const band3Students = students.filter((s) => s.currentBand === 3);

  // Filtered view
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNumber.toString().includes(searchQuery);
    const matchesGrade = filterGrade === 'all' || s.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className={`space-y-6 ${chalkMode ? 'font-sans' : ''}`}>
      {/* Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-serif">
                स्वायत्त TaRL सूक्ष्म-समूह विभाजन (Autonomous Teaching at the Right Level)
              </h2>
              <p className="text-xs text-zinc-400">
                एकल शिक्षक कक्षा १-३ के ३८ छात्रों को ३ गतिशील शिक्षण दलों में बाँटकर समानांतर चलाएँ। जब आप दल १ को सीधे पढ़ाएँ, तब दल २ व दल ३ कंकड़ व साथी-वाचन से स्वयं सीखते हैं।
              </p>
            </div>
          </div>

          {/* Micro-Station Timer Controller */}
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-amber-400 font-bold text-sm">
              <Clock className="h-4 w-4 text-amber-400" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="rounded bg-zinc-800 p-1 text-zinc-300 hover:bg-zinc-700"
              title={isTimerRunning ? 'घड़ी रोकें' : 'समय शुरू करें'}
            >
              {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={handleRotateStation}
              className="flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-zinc-950 hover:bg-emerald-500 transition"
              title="अगले समूह पर जाएँ"
            >
              <RotateCw className="h-3 w-3" />
              <span>चक्र बदलें</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Active TaRL Learning Bands Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Band 1 Card */}
        <div
          className={`rounded-2xl border p-4 transition ${
            activeInstructionBand === 1
              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
              : 'border-zinc-800 bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
                १
              </span>
              <h3 className="text-xs font-bold text-zinc-200">दल १: अक्षर व मात्रा साधक</h3>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-amber-300">
              {band1Students.length} बच्चे
            </span>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            लक्ष्य: वर्ण पहचान, आकृति-ध्वनि संबंध, हस्तलेखन ग्रिप व 'ब' बनाम 'व' ध्वन्यात्मक अंतर।
          </p>

          <div className="mt-3 rounded-lg border border-amber-500/20 bg-zinc-950/60 p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
              <span>वर्तमान गतिविधि:</span>
              <span className="text-zinc-500">{tarlPlan.band1Activity.duration}</span>
            </div>
            <p className="mt-1 font-medium text-zinc-200">{tarlPlan.band1Activity.title}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{tarlPlan.band1Activity.instructions}</p>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              {activeInstructionBand === 1 ? '★ शिक्षक प्रत्यक्ष मार्गदर्शन में' : 'साथी निगरानी में'}
            </span>
            <button
              onClick={() => setActiveInstructionBand(1)}
              className="text-amber-400 hover:underline font-medium"
            >
              शिक्षक ध्यान चुनें
            </button>
          </div>
        </div>

        {/* Band 2 Card */}
        <div
          className={`rounded-2xl border p-4 transition ${
            activeInstructionBand === 2
              ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
              : 'border-zinc-800 bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                २
              </span>
              <h3 className="text-xs font-bold text-zinc-200">दल २: शब्द व संयोजन खोजी</h3>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-emerald-300">
              {band2Students.length} बच्चे
            </span>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            लक्ष्य: २-३ अक्षर शब्द पठन, सरल मात्रा संयोजन, और १० तक वस्तुओं के साथ जोड़।
          </p>

          <div className="mt-3 rounded-lg border border-emerald-500/20 bg-zinc-950/60 p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
              <span>वर्तमान गतिविधि:</span>
              <span className="text-zinc-500">{tarlPlan.band2Activity.duration}</span>
            </div>
            <p className="mt-1 font-medium text-zinc-200">{tarlPlan.band2Activity.title}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{tarlPlan.band2Activity.instructions}</p>
            <p className="mt-1.5 text-[10px] text-emerald-400 italic">
              साथी नायक: {tarlPlan.band2Activity.peerLeaderRole}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              {activeInstructionBand === 2 ? '★ शिक्षक प्रत्यक्ष मार्गदर्शन में' : 'स्वायत्त साथी खेल'}
            </span>
            <button
              onClick={() => setActiveInstructionBand(2)}
              className="text-emerald-400 hover:underline font-medium"
            >
              शिक्षक ध्यान चुनें
            </button>
          </div>
        </div>

        {/* Band 3 Card */}
        <div
          className={`rounded-2xl border p-4 transition ${
            activeInstructionBand === 3
              ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
              : 'border-zinc-800 bg-zinc-900/40'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-bold text-blue-400">
                ३
              </span>
              <h3 className="text-xs font-bold text-zinc-200">दल ३: कहानी व धाराप्रवाह पाठक</h3>
            </div>
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] font-mono text-blue-300">
              {band3Students.length} बच्चे
            </span>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            लक्ष्य: ग्रामीण डिकोडेबल कहानी वाचन, मौखिक समझ प्रश्नोत्तरी, व २-अंक जोड़।
          </p>

          <div className="mt-3 rounded-lg border border-blue-500/20 bg-zinc-950/60 p-2.5 text-xs">
            <div className="flex items-center justify-between text-[11px] font-semibold text-blue-300">
              <span>वर्तमान गतिविधि:</span>
              <span className="text-zinc-500">{tarlPlan.band3Activity.duration}</span>
            </div>
            <p className="mt-1 font-medium text-zinc-200">{tarlPlan.band3Activity.title}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{tarlPlan.band3Activity.instructions}</p>
            <p className="mt-1.5 text-[10px] text-blue-400 italic">
              साथी नायक: {tarlPlan.band3Activity.peerLeaderRole}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px]">
            <span className="text-zinc-500">
              {activeInstructionBand === 3 ? '★ शिक्षक प्रत्यक्ष मार्गदर्शन में' : 'जोड़ी वाचन चक्र'}
            </span>
            <button
              onClick={() => setActiveInstructionBand(3)}
              className="text-blue-400 hover:underline font-medium"
            >
              शिक्षक ध्यान चुनें
            </button>
          </div>
        </div>
      </div>

      {/* Blackboard Quick-Copy Chalkboard Prompt Section */}
      <div className="rounded-2xl border-2 border-zinc-800 bg-[#16181d] p-5 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-serif">
              ब्लैकबोर्ड त्वरित-लेखन प्राम्प्ट (30-Second Blackboard Chalk Guide)
            </h3>
          </div>
          <button
            onClick={handleRegenerateActivities}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-amber-400 hover:bg-zinc-700 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>नया खेल तैयार हो रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>नयी मौखिक गतिविधियाँ बनाएँ</span>
              </>
            )}
          </button>
        </div>

        {/* Chalkboard Display Area */}
        <div className="mt-4 rounded-xl border border-zinc-700/60 bg-[#1c1f24] p-4 font-mono text-sm leading-relaxed text-yellow-200/90 whitespace-pre overflow-x-auto shadow-inner">
          {tarlPlan.blackboardChalkPrompt}
        </div>
        <p className="mt-2 text-[11px] text-zinc-400 italic">
          * शिक्षक ब्लैकबोर्ड को खड़िया से तीन खानों में बाँटकर इसे लिख दें, जिससे सभी दल स्वतंत्र रूप से कार्य कर सकें।
        </p>
      </div>

      {/* Full Classroom Roster & Dynamic Band Reallocation */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              कक्षा १-३ विद्यार्थी सूची व दल प्रबंधन (38 Students Roster)
            </h3>
            <p className="text-xs text-zinc-400">
              किसी भी विद्यार्थी का प्रगति स्तर बदलने पर उसका दल १-क्लिक में बदलें।
            </p>
          </div>

          {/* Search & Grade Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                placeholder="छात्र का नाम / रोल..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg border border-zinc-700 bg-zinc-950 pl-8 pr-3 py-1 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-300 focus:border-amber-500 focus:outline-none"
            >
              <option value="all">सभी कक्षाएं</option>
              <option value={1}>कक्षा १</option>
              <option value={2}>कक्षा २</option>
              <option value={3}>कक्षा ३</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 flex flex-col justify-between hover:border-zinc-700 transition"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{st.avatar}</span>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-200">{st.name}</h4>
                      <p className="text-[10px] text-zinc-500">
                        रोल: {st.rollNumber} • कक्षा {st.grade}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      st.currentBand === 1
                        ? 'bg-amber-500/20 text-amber-300'
                        : st.currentBand === 2
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    दल {st.currentBand}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-400">शुद्धता स्कोर:</span>
                  <span className="font-mono text-zinc-200 font-semibold">{st.phonicsAccuracy}%</span>
                </div>

                {st.notes && (
                  <p className="mt-1 text-[10px] text-amber-400/80 italic line-clamp-1">
                    * {st.notes}
                  </p>
                )}
              </div>

              {/* Move to another band controls */}
              <div className="mt-3 flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[10px]">
                <span className="text-zinc-500">दल बदलें:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3].map((b) => (
                    <button
                      key={b}
                      onClick={() => onMoveStudent(st.id, b as TaRLBand)}
                      className={`h-5 w-5 rounded font-bold transition ${
                        st.currentBand === b
                          ? 'bg-zinc-700 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
