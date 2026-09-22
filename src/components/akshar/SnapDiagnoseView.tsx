import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Edit3, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  User, 
  GraduationCap,
  Info,
  Clock,
  Zap,
  Play,
  Square,
  RefreshCw
} from 'lucide-react';
import { Dialect, GradeLevel, SubjectTrack, SlateDiagnosis, BoundingBoxError } from '../../types/akshar';
import { SAMPLE_SLATES, SampleSlate } from '../../data/aksharData';
import { KinestheticRemediationModal } from './KinestheticRemediationModal';

interface SnapDiagnoseViewProps {
  currentDialect: Dialect;
  onSaveDiagnosis: (diagnosis: SlateDiagnosis) => void;
  onAssignToBand: (studentName: string, band: 1 | 2 | 3) => void;
  chalkMode: boolean;
  speechRate: number;
}

export const SnapDiagnoseView: React.FC<SnapDiagnoseViewProps> = ({
  currentDialect,
  onSaveDiagnosis,
  onAssignToBand,
  chalkMode,
  speechRate,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<'sample' | 'slate' | 'camera' | 'upload'>('sample');
  const [selectedSample, setSelectedSample] = useState<SampleSlate>(SAMPLE_SLATES[0]);
  const [childName, setChildName] = useState<string>('आरव कुमार');
  const [grade, setGrade] = useState<GradeLevel>(1);
  const [subject, setSubject] = useState<SubjectTrack>('hindi_fln');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeDiagnosis, setActiveDiagnosis] = useState<SlateDiagnosis | null>(null);
  const [activeBoxIndex, setActiveBoxIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isDrillOpen, setIsDrillOpen] = useState<boolean>(false);

  // Canvas drawing ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [chalkColor, setChalkColor] = useState<'white' | 'yellow'>('white');

  // Camera video ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize canvas drawing
  useEffect(() => {
    if (activeInputMode === 'slate' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1c1f24';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw faint guide lines like a village student slate
        ctx.strokeStyle = '#2b303a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = 60; y < canvas.height; y += 70) {
          ctx.moveTo(20, y);
          ctx.lineTo(canvas.width - 20, y);
        }
        ctx.stroke();

        // Draw initial sample chalk stroke for convenience
        ctx.font = 'bold 44px sans-serif';
        ctx.fillStyle = '#fef08a';
        ctx.fillText('बकील बाबू', 60, 110);
        ctx.font = '24px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('^ (छात्र ने वकील के स्थान पर बकील लिखा)', 60, 150);
      }
    }
  }, [activeInputMode]);

  // Handle camera start/stop
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError('कैमरा शुरू नहीं हो सका। कृपया अनुमति दें या नमूना स्लेट चुनें।');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (activeInputMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeInputMode]);

  // Capture canvas drawing as base64
  const getCanvasData = (): string => {
    if (canvasRef.current) {
      return canvasRef.current.toDataURL('image/png');
    }
    return '';
  };

  // Capture frame from live camera
  const captureCameraFrame = (): string => {
    if (videoRef.current) {
      const video = videoRef.current;
      const offscreen = document.createElement('canvas');
      offscreen.width = video.videoWidth || 640;
      offscreen.height = video.videoHeight || 480;
      const ctx = offscreen.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, offscreen.width, offscreen.height);
        return offscreen.toDataURL('image/jpeg', 0.85);
      }
    }
    return '';
  };

  // Main Diagnosis Trigger
  const handleDiagnose = async () => {
    setIsAnalyzing(true);
    setActiveBoxIndex(null);

    let imagePayload = '';
    let currentSampleKey = '';

    if (activeInputMode === 'sample') {
      currentSampleKey = selectedSample.sampleKey;
    } else if (activeInputMode === 'slate') {
      imagePayload = getCanvasData();
    } else if (activeInputMode === 'camera') {
      imagePayload = captureCameraFrame();
    }

    try {
      const response = await fetch('/api/akshar/snap-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imagePayload,
          dialect: currentDialect,
          grade,
          subject,
          childName,
          sampleKey: currentSampleKey,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        const diag: SlateDiagnosis = {
          id: `diag_${Date.now()}`,
          childName: resData.data.childName || childName,
          grade: resData.data.grade || grade,
          dialect: currentDialect,
          subject: resData.data.subject || subject,
          detectedText: resData.data.detectedText,
          errorType: resData.data.errorType,
          errorSubtype: resData.data.errorSubtype,
          accuracyScore: resData.data.accuracyScore,
          boundingBoxes: resData.data.boundingBoxes || [],
          rootMisconception: resData.data.rootMisconception,
          remediationTip1Min: resData.data.remediationTip1Min,
          recommendedTaRLBand: resData.data.recommendedTaRLBand || 1,
          audioBridgeScript: resData.data.audioBridgeScript,
          timestamp: Date.now(),
          syncStatus: 'pending',
        };

        setActiveDiagnosis(diag);
        onSaveDiagnosis(diag);
      }
    } catch (err: any) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio Playback
  const handlePlayAudioBridge = (script: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = speechRate || 0.85;
      utterance.lang = 'hi-IN';

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Canvas drawing handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawOnCanvas(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    drawOnCanvas(e);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const drawOnCanvas = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.strokeStyle = chalkColor === 'white' ? '#f8fafc' : '#fef08a';
    ctx.shadowBlur = 4;
    ctx.shadowColor = chalkColor === 'white' ? 'rgba(255,255,255,0.4)' : 'rgba(254,240,138,0.5)';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1c1f24';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#2b303a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let y = 60; y < canvas.height; y += 70) {
          ctx.moveTo(20, y);
          ctx.lineTo(canvas.width - 20, y);
        }
        ctx.stroke();
      }
    }
  };

  return (
    <div className={`space-y-6 ${chalkMode ? 'font-sans' : ''}`}>
      {/* Top Banner / Guidance */}
      <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-serif">
                स्नैप व निदान (Snap & Diagnose Vision AI)
              </h2>
              <p className="text-xs text-zinc-400">
                विद्यार्थी की स्लेट या कॉपी का फोटो लें। दृष्टि AI तुरंत ध्वन्यात्मक भ्रम (जैसे 'ब' बनाम 'व'), दर्पण पलटाव (d vs b) व गणितीय हासिल की भूल पहचानकर १-मिनट का उपचार बताता है।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-mono text-amber-300">
              मोड: {currentDialect.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left is Slate/Capture Area, Right is Diagnosis & 1-Min Remediation */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Slate Input & Preview (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Input Method Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1.5">
            <button
              onClick={() => {
                setActiveInputMode('sample');
                setChildName(selectedSample.studentName);
                setGrade(selectedSample.grade);
                setSubject(selectedSample.subject);
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeInputMode === 'sample'
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>कक्षा नमूना स्लेट (Sample Slates)</span>
            </button>

            <button
              onClick={() => setActiveInputMode('slate')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeInputMode === 'slate'
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>डिजिटल स्लेट लिखें (Virtual Chalk)</span>
            </button>

            <button
              onClick={() => setActiveInputMode('camera')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                activeInputMode === 'camera'
                  ? 'bg-amber-500 text-zinc-950 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Camera className="h-3.5 w-3.5" />
              <span>लाइव कैमरा (Phone Camera)</span>
            </button>
          </div>

          {/* Student & Subject Context Selector */}
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs">
            <div>
              <label className="text-[11px] text-zinc-400">विद्यार्थी का नाम:</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-200 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-400">कक्षा स्तर:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as GradeLevel)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value={1}>कक्षा १ (Grade 1)</option>
                <option value={2}>कक्षा २ (Grade 2)</option>
                <option value={3}>कक्षा ३ (Grade 3)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-zinc-400">विषय / ट्रैक:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectTrack)}
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-zinc-200 focus:border-amber-500 focus:outline-none"
              >
                <option value="hindi_fln">हिंदी FLN अक्षर / मात्रा</option>
                <option value="math_numeracy">संख्या ज्ञान व जोड़ (Math)</option>
                <option value="english_letters">अंग्रेजी अक्षर (d/b/p/q)</option>
              </select>
            </div>
          </div>

          {/* Slate Canvas / Sample Viewer */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-zinc-800 bg-[#16181d] shadow-2xl">
            {/* Slate Header Frame */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="font-mono text-zinc-300">
                  {activeInputMode === 'sample' && `नमूना: ${selectedSample.title}`}
                  {activeInputMode === 'slate' && 'काली स्लेट • खड़िया से लिखें (Chalk Slate)'}
                  {activeInputMode === 'camera' && 'लाइव कैमरा दृश्य'}
                </span>
              </div>

              {activeInputMode === 'slate' && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setChalkColor('white')}
                      className={`h-4 w-4 rounded-full border ${chalkColor === 'white' ? 'border-amber-400 bg-white ring-2 ring-amber-400' : 'bg-zinc-200 border-zinc-600'}`}
                      title="सफेद खड़िया (White Chalk)"
                    />
                    <button
                      onClick={() => setChalkColor('yellow')}
                      className={`h-4 w-4 rounded-full border ${chalkColor === 'yellow' ? 'border-amber-400 bg-yellow-300 ring-2 ring-amber-400' : 'bg-yellow-200 border-zinc-600'}`}
                      title="पीली खड़िया (Yellow Chalk)"
                    />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-zinc-400 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>साफ करें</span>
                  </button>
                </div>
              )}
            </div>

            {/* Slate Body */}
            <div className="relative aspect-[4/3] w-full bg-[#1c1f24] flex items-center justify-center overflow-hidden">
              {/* Sample Mode View */}
              {activeInputMode === 'sample' && (
                <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#2d333b_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {/* Realistic Chalk Text on Slate */}
                  <div className="relative z-10 max-w-md rounded-xl border border-zinc-700/60 bg-zinc-950/60 p-6 backdrop-blur-sm">
                    <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                      छात्र की हस्तलिखित स्लेट (Handwritten Slate)
                    </span>
                    <div className="my-4 font-serif text-3xl sm:text-4xl font-bold tracking-wide text-amber-200 drop-shadow-[0_2px_4px_rgba(251,191,36,0.3)]">
                      {selectedSample.thumbnailSvg}
                    </div>
                    <p className="text-xs text-zinc-400 italic">
                      लक्षित छात्र: {selectedSample.studentName} • कक्षा {selectedSample.grade} • मातृबोली: {selectedSample.dialect}
                    </p>
                  </div>

                  {/* Visual Bounding Box Overlays (if diagnosis exists) */}
                  {activeDiagnosis && activeDiagnosis.boundingBoxes && activeDiagnosis.boundingBoxes.map((box, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveBoxIndex(idx)}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`,
                      }}
                      className={`absolute cursor-pointer border-2 transition-all rounded ${
                        box.severity === 'critical'
                          ? 'border-rose-500 bg-rose-500/20 ring-4 ring-rose-500/20'
                          : 'border-amber-400 bg-amber-400/20 ring-4 ring-amber-400/20'
                      } ${activeBoxIndex === idx ? 'scale-105 z-30 ring-8' : 'z-20'}`}
                    >
                      <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-zinc-950 px-1.5 py-0.5 text-[10px] font-medium text-white shadow border border-zinc-700">
                        {box.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Digital Canvas Mode */}
              {activeInputMode === 'slate' && (
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="h-full w-full cursor-crosshair touch-none"
                />
              )}

              {/* Camera Mode */}
              {activeInputMode === 'camera' && (
                <div className="relative h-full w-full">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 p-4 text-center text-xs text-rose-300">
                      <AlertTriangle className="mb-2 h-6 w-6 text-rose-400" />
                      <p>{cameraError}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Action Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-950/90 p-3">
              <span className="text-[11px] text-zinc-400">
                {activeInputMode === 'sample' && 'नमूने पर तुरंत क्लिक करें अथवा नया नमूना चुनें'}
                {activeInputMode === 'slate' && 'स्लेट पर अंगुली अथवा माउस से अक्षर लिखें'}
                {activeInputMode === 'camera' && 'स्लेट को फ्रेम में रखें और बटन दबाएँ'}
              </span>

              <button
                onClick={handleDiagnose}
                disabled={isAnalyzing}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-500 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>निदान चल रहा है... (AI Analyzing)</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 text-zinc-950" />
                    <span>स्लेट का निदान करें (Diagnose Slate)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sample Selectors (If sample mode is active) */}
          {activeInputMode === 'sample' && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-zinc-400">
                अन्य बहु-वर्गीय विद्यार्थी नमूने (Select Test Case):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_SLATES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setSelectedSample(sample);
                      setChildName(sample.studentName);
                      setGrade(sample.grade);
                      setSubject(sample.subject);
                      setActiveDiagnosis(null);
                    }}
                    className={`flex flex-col text-left rounded-xl p-3 border transition ${
                      selectedSample.id === sample.id
                        ? 'border-amber-500/80 bg-amber-500/10'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-zinc-200">{sample.studentName}</span>
                      <span className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-400">कक्षा {sample.grade}</span>
                    </div>
                    <span className="mt-1 font-serif text-amber-300 text-sm font-bold">
                      {sample.thumbnailSvg}
                    </span>
                    <span className="mt-1 text-[10px] text-zinc-400 line-clamp-1">
                      {sample.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pedagogical Diagnosis & 1-Minute Action (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {activeDiagnosis ? (
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              {/* Diagnosis Header */}
              <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-300 border border-rose-500/30">
                      {activeDiagnosis.errorType.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-zinc-400">
                      शुद्धता स्कोर: {activeDiagnosis.accuracyScore}%
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-base font-bold text-white font-serif">
                    {activeDiagnosis.errorSubtype}
                  </h3>
                  <p className="text-xs text-zinc-400">
                    छात्र: {activeDiagnosis.childName} • कक्षा {activeDiagnosis.grade} • मातृबोली: {activeDiagnosis.dialect}
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-zinc-500">अनुशंसित TaRL दल</span>
                  <span className="rounded-lg bg-amber-500/20 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
                    दल {activeDiagnosis.recommendedTaRLBand} ({activeDiagnosis.recommendedTaRLBand === 1 ? 'अक्षर' : activeDiagnosis.recommendedTaRLBand === 2 ? 'मात्रा' : 'कहानी'})
                  </span>
                </div>
              </div>

              {/* Detected Text Box */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950 p-3">
                <span className="text-[11px] font-semibold text-zinc-400">स्लेट पर पहचाना गया पाठ:</span>
                <p className="mt-1 font-mono text-sm text-amber-200">
                  {activeDiagnosis.detectedText}
                </p>
              </div>

              {/* Root Misconception Diagnosis */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Info className="h-4 w-4 text-amber-400" />
                  <span>मूल अवधारणा भ्रांति (Root Misconception Diagnosis):</span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-300 leading-relaxed">
                  {activeDiagnosis.rootMisconception}
                </p>
              </div>

              {/* 1-Minute Offline Remediation Tip */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>शिक्षक हेतु १-मिनट का त्वरित उपचार (1-Min Physical Remediation):</span>
                  </div>
                  <button
                    onClick={() => setIsDrillOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 text-zinc-950 font-bold px-2.5 py-1 text-[11px] hover:bg-emerald-400 transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>शारीरिक ड्रिल दिखाएं (Open Drill)</span>
                  </button>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  {activeDiagnosis.remediationTip1Min}
                </p>
              </div>

              {/* Spoken Audio Bridge */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
                    <Volume2 className="h-4 w-4 text-blue-400" />
                    <span>मातृबोली से मानक सेतु ध्वनि (Dialect Audio Bridge):</span>
                  </div>
                  <button
                    onClick={() => handlePlayAudioBridge(activeDiagnosis.audioBridgeScript)}
                    className="flex items-center gap-1 rounded bg-blue-500 px-2 py-1 text-[11px] font-bold text-zinc-950 hover:bg-blue-400 transition"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="h-3 w-3 fill-current" />
                        <span>रुकें</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 fill-current" />
                        <span>बोलकर सुनाएँ</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-blue-100 italic bg-zinc-950/40 p-2.5 rounded-lg border border-blue-500/20">
                  "{activeDiagnosis.audioBridgeScript}"
                </p>
              </div>

              {/* Direct Classroom Action: Assign to TaRL Band */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => onAssignToBand(activeDiagnosis.childName, activeDiagnosis.recommendedTaRLBand)}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-amber-300 border border-zinc-700 hover:bg-zinc-700 transition"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>छात्र को दल {activeDiagnosis.recommendedTaRLBand} में जोड़ें</span>
                </button>

                <span className="text-[11px] text-zinc-500 font-mono">
                  {activeDiagnosis.syncStatus === 'pending' ? 'स्थानीय एज में सुरक्षित ✓' : 'क्लाउड सिंक'}
                </span>
              </div>
            </div>
          ) : (
            /* Empty State when no diagnosis yet */
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center text-zinc-500">
              <Camera className="h-12 w-12 text-zinc-600 mb-3" />
              <h4 className="text-sm font-medium text-zinc-300">
                कोई स्लेट निदान अभी सक्रिय नहीं है
              </h4>
              <p className="mt-1 max-w-xs text-xs text-zinc-500">
                बाईं ओर 'स्लेट का निदान करें' बटन दबाएँ। AI तुरंत स्लेट की त्रुटियों पर मार्कर लगाएगा और १-मिनट का शिक्षण मार्गदर्शन प्रस्तुत करेगा।
              </p>
              <button
                onClick={handleDiagnose}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-amber-400 hover:bg-zinc-700 transition"
              >
                <Zap className="h-3.5 w-3.5" />
                <span>नमूना स्लेट से टेस्ट करें</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Kinesthetic Remediation Modal */}
      {activeDiagnosis && (
        <KinestheticRemediationModal
          isOpen={isDrillOpen}
          onClose={() => setIsDrillOpen(false)}
          studentName={activeDiagnosis.childName}
          drillType={
            activeDiagnosis.errorSubtype.includes('व ➜ ब') || activeDiagnosis.detectedText.includes('व') || activeDiagnosis.detectedText.includes('ब')
              ? 'letter_split'
              : activeDiagnosis.errorSubtype.includes('हासिल') || activeDiagnosis.subject === 'math_numeracy'
              ? 'bead_frame'
              : 'latin_mirror'
          }
        />
      )}
    </div>
  );
};
