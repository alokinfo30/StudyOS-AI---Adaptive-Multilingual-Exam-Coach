import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Mic, 
  Camera, 
  Users, 
  RefreshCw, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { DAILY_JOURNEY_STEPS } from '../../data/aksharData';
import { DailyJourneyStep } from '../../types/akshar';

interface DailyClassroomJourneyRunnerProps {
  onJumpToTab?: (tab: 'snap' | 'oral' | 'tarl' | 'heatmap' | 'sync') => void;
}

export const DailyClassroomJourneyRunner: React.FC<DailyClassroomJourneyRunnerProps> = ({
  onJumpToTab,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [timerSeconds, setTimerSeconds] = useState<number>(120); // 2 mins for Stage 1
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // When step changes, set initial timer
  useEffect(() => {
    const stepObj = DAILY_JOURNEY_STEPS.find((s) => s.stepNumber === activeStep);
    if (stepObj) {
      setTimerSeconds(stepObj.timeEstimateSeconds);
      setIsTimerRunning(false);
    }
  }, [activeStep]);

  // Countdown timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (!completedSteps.includes(activeStep)) {
              setCompletedSteps((c) => [...c, activeStep]);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds, activeStep, completedSteps]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentStepData: DailyJourneyStep =
    DAILY_JOURNEY_STEPS.find((s) => s.stepNumber === activeStep) || DAILY_JOURNEY_STEPS[0];

  const handleNextStep = () => {
    if (!completedSteps.includes(activeStep)) {
      setCompletedSteps((prev) => [...prev, activeStep]);
    }
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const getStepIcon = (num: number) => {
    switch (num) {
      case 1:
        return <Mic className="h-5 w-5" />;
      case 2:
        return <Camera className="h-5 w-5" />;
      case 3:
        return <Users className="h-5 w-5" />;
      case 4:
        return <RefreshCw className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/30">
                Slide 5: Users Journey Map
              </span>
              <span className="text-xs text-zinc-400">सुमन देवी (प्राथमिक शिक्षिका) दैनिक समय-चक्र</span>
            </div>
            <h2 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight font-serif">
              दैनिक 4-चरणीय घर्षण-मुक्त कक्षा प्रवाह (Frictionless Daily Workflow)
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1">
              बिना किसी अतिरिक्त प्रशासनिक कागजी काम के: 2 मिनट मौखिक वार्म-अप ➔ 90 सेकंड स्लेट स्नैप ➔ 3 मिनट दल विभाजन ➔ स्वचालित सिंक।
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-zinc-950 border border-zinc-800 p-2 text-xs text-zinc-300">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>प्रति कक्षा केवल 1 फोन • शून्य छात्र हार्डवेयर</span>
          </div>
        </div>

        {/* 4-Stage Horizontal Stepper */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
          {DAILY_JOURNEY_STEPS.map((step) => {
            const isActive = activeStep === step.stepNumber;
            const isDone = completedSteps.includes(step.stepNumber);
            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(step.stepNumber)}
                className={`relative flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-zinc-300'
                    : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isActive
                        ? 'bg-amber-500 text-zinc-950'
                        : isDone
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : step.stepNumber}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">
                    {step.durationLabel}
                  </span>
                </div>
                <div className="font-bold text-xs text-white leading-tight">
                  {step.title}
                </div>
                <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                  {step.titleHindi}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Execution Box */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-800 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              {getStepIcon(currentStepData.stepNumber)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  चरण {currentStepData.stepNumber} / 4
                </span>
                <span className="text-xs text-zinc-500">•</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {currentStepData.durationLabel}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {currentStepData.title} ({currentStepData.titleHindi})
              </h3>
            </div>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="flex items-center gap-3 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-800 self-start sm:self-auto">
            <Clock className="h-5 w-5 text-amber-400" />
            <div className="font-mono text-2xl font-black text-white min-w-[70px]">
              {formatTime(timerSeconds)}
            </div>
            <div className="flex items-center gap-1 border-l border-zinc-800 pl-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-1.5 rounded-lg bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400 transition"
                title={isTimerRunning ? 'विराम (Pause)' : 'शुरू करें (Start)'}
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(currentStepData.timeEstimateSeconds);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white transition"
                title="पुनः रीसेट"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stage Content & Teacher Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-xl bg-zinc-950 p-4 border border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              कक्षा संचालन निर्देश (Classroom Execution)
            </h4>
            <p className="text-sm text-zinc-200 leading-relaxed">
              {currentStepData.description}
            </p>
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>{currentStepData.hardwareConstraint}</span>
            </div>
          </div>

          {/* Contextual Action & Launcher */}
          <div className="space-y-3 rounded-xl bg-zinc-950 p-4 border border-zinc-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                संबद्ध AI मॉड्यूल (Connected AI Agent)
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {activeStep === 1 && 'ध्वनि सेतु: परिवेशीय बहु-बोली संकलन व 30-सेकंड तालबद्ध छंद।'}
                {activeStep === 2 && 'दृष्टि निदान: 10-15 स्लेटों का बैच कैप्चर व संज्ञानात्मक त्रुटि वर्गीकरण।'}
                {activeStep === 3 && 'टीएआरएल समूह: 38 छात्रों का 3 शिक्षण वृत्तों में स्वायत्त विभाजन।'}
                {activeStep === 4 && 'एज सिंक: बीईओ व्हाट्सऐप रिपोर्ट व स्थानीय डेटाबेस समक्रमण।'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {activeStep === 1 && (
                <button
                  onClick={() => onJumpToTab?.('oral')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  <Mic className="h-3.5 w-3.5" />
                  <span>बोली सेतु मॉड्यूल खोलें (Open Oral Bridge)</span>
                </button>
              )}
              {activeStep === 2 && (
                <button
                  onClick={() => onJumpToTab?.('snap')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>स्लेट जाँच मॉड्यूल खोलें (Open Snap & Diagnose)</span>
                </button>
              )}
              {activeStep === 3 && (
                <button
                  onClick={() => onJumpToTab?.('tarl')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>दल विभाजन मॉड्यूल खोलें (Open TaRL Groups)</span>
                </button>
              )}
              {activeStep === 4 && (
                <button
                  onClick={() => onJumpToTab?.('sync')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>सिंक केंद्र खोलें (Open Sync Center)</span>
                </button>
              )}

              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-800 text-zinc-200 font-semibold text-xs hover:bg-zinc-700 transition"
              >
                <span>अगला चरण ➔</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
