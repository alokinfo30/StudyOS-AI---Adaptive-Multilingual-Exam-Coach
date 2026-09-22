import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Play, 
  Square, 
  RefreshCw, 
  MessageSquare, 
  Languages, 
  Award,
  Music,
  CheckCircle,
  HelpCircle,
  VolumeX,
  Volume1
} from 'lucide-react';
import { Dialect, StandardLanguage, OralBridgeResult } from '../../types/akshar';
import { DIALECTS_LIST } from '../../data/aksharData';

interface OralBridgeViewProps {
  currentDialect: Dialect;
  onSelectDialect: (d: Dialect) => void;
  chalkMode: boolean;
  speechRate: number;
}

export const OralBridgeView: React.FC<OralBridgeViewProps> = ({
  currentDialect,
  onSelectDialect,
  chalkMode,
  speechRate,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [targetStandard, setTargetStandard] = useState<StandardLanguage>('standard_hindi');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [bridgeResult, setBridgeResult] = useState<OralBridgeResult | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Audio recording recognition ref
  const recognitionRef = useRef<any>(null);

  // Pre-loaded realistic rural oral prompts in different dialects
  const DIALECT_PRESET_PROMPTS: Record<Dialect, string[]> = {
    bhojpuri: [
      'हमार बस्ता में दू गो किताब बा आ एगो पेंसिल बा।',
      'बकील बाबू आज साइकिल से विद्यालय आइल बाड़न।',
      'हम ई अच्छर ना पहिचानिले, मास्टर जी बतावल जाव।',
      'पानी बहुत जोर से बरसत बा, बाहर कैसे जाईब?',
    ],
    awadhi: [
      'हमार बस्ता मा दुइ किताब अउर एक ठो स्लेट आहि।',
      'मास्साब हमका ई पाठ बहुत नीक लाग, दुबारा पढ़ाव।',
      'वर्षा बहुत तेज होत है, सब लरिका भीगि गयें।',
    ],
    maithili: [
      'हमर पोथी में सुंदर चिड़ै के चित्र अछि।',
      'आइ स्कूल में मास्टर जी दू टा सवाल पूछलथिन।',
      'नदी तीरे भारी मेला लागल अछि।',
    ],
    magahi: [
      'हमरा से गिनती छूट गेलई, दू ठो सेब बचल हे।',
      'मास्टर जी, हम आज पहाड़ा याद कर लेलियई।',
    ],
    bundelkhandi: [
      'हमाओ स्लेट पै लिखो देखो, हमने अच्छर बनाओ।',
      'मास्साब, आज पानी बहुत गिर रओ है।',
    ],
    chhattisgarhi: [
      'हमन आज पहाड़ा याद कर लेहेन, गुरुजी सुनव।',
      'बगइचा मा दू ठो चिरई बइठे हवय।',
    ],
    marwari: [
      'म्हाने ई पाठ समझ आव्यो कोनी, पाछो बतावो।',
      'म्हारै बस्ता मांय दो पोथियां है।',
    ],
  };

  const currentPresets = DIALECT_PRESET_PROMPTS[currentDialect] || DIALECT_PRESET_PROMPTS.bhojpuri;

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setSpokenTranscript(currentText);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setSpokenTranscript('');
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        // Fallback simulated input if microphone blocked in iframe
        const sample = currentPresets[selectedPresetIndex % currentPresets.length];
        setSpokenTranscript(sample);
      }
    }
  };

  // Trigger Oral Bridge Analysis
  const handleAnalyzeOralBridge = async (textToAnalyze?: string) => {
    const queryText = textToAnalyze || spokenTranscript || currentPresets[0];
    setSpokenTranscript(queryText);
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/akshar/oral-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spokenText: queryText,
          dialect: currentDialect,
          targetStandard,
          grade: 1,
        }),
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setBridgeResult(resData.data);
      }
    } catch (err: any) {
      console.error('Oral bridge error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Audio Playback
  const handlePlayAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate || 0.85;
      utterance.lang = 'hi-IN';

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`space-y-6 ${chalkMode ? 'font-sans' : ''}`}>
      {/* Banner */}
      <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <Mic className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-serif">
                बोली-से-मानक मौखिक सेतु (Dialect-to-Standard Oral Bridge)
              </h2>
              <p className="text-xs text-zinc-400">
                ग्रामीण प्राथमिक कक्षाओं में बच्चे अपनी क्षेत्रीय बोली (जैसे भोजपुरी, अवधी, मैथिली) में विचार व्यक्त करते हैं। यह सेतु बच्चे की मातृबोली को सम्मान देते हुए मानक हिंदी/अंग्रेजी से जोड़ता है।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-zinc-800 px-2 py-1 text-[11px] font-mono text-orange-300">
              लक्षित बोली: {currentDialect.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Voice Input & Preset Phrases (6 cols) */}
        <div className="space-y-4 lg:col-span-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                छात्र मौखिक वाणी इनपुट (Child Oral Input)
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span>लक्षित भाषा:</span>
                <button
                  onClick={() => setTargetStandard(targetStandard === 'standard_hindi' ? 'english' : 'standard_hindi')}
                  className="rounded bg-zinc-800 px-2 py-0.5 font-medium text-amber-300 border border-zinc-700 hover:bg-zinc-700"
                >
                  {targetStandard === 'standard_hindi' ? 'मानक हिंदी' : 'English'}
                </button>
              </div>
            </div>

            {/* Microphone Button & Waveform Area */}
            <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950 p-6 text-center">
              <button
                onClick={toggleRecording}
                className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all shadow-xl ${
                  isRecording
                    ? 'bg-rose-600 text-white ring-8 ring-rose-500/20 animate-pulse'
                    : 'bg-gradient-to-tr from-orange-500 to-amber-500 text-zinc-950 hover:scale-105'
                }`}
                title={isRecording ? 'रिकॉर्डिंग रोकें' : 'माइक चालू करें (छात्र से बोलवाएँ)'}
              >
                {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </button>

              <p className="mt-3 text-xs font-medium text-zinc-300">
                {isRecording ? 'छात्र की वाणी सुनी जा रही है...' : 'माइक दबाकर बच्चे से उसकी मातृबोली में बोलने को कहें'}
              </p>
              <span className="text-[11px] text-zinc-500">
                (उदा. "हमार बस्ता में दू गो किताब बा")
              </span>

              {/* Animated Waveform Bars when recording */}
              {isRecording && (
                <div className="mt-3 flex items-center gap-1">
                  {[40, 75, 100, 50, 90, 60, 85, 30].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}%` }}
                      className="inline-block w-1.5 h-6 bg-amber-400 rounded-full animate-bounce"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Transcript Display / Manual Edit */}
            <div>
              <label className="text-[11px] text-zinc-400">पहचाना गया मौखिक वाक्य (Transcript):</label>
              <textarea
                rows={2}
                value={spokenTranscript}
                onChange={(e) => setSpokenTranscript(e.target.value)}
                placeholder="छात्र द्वारा बोला गया वाक्य यहाँ प्रदर्शित होगा..."
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm text-amber-200 focus:border-orange-500 focus:outline-none font-serif"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">
                ध्वनि विश्लेषण दर: {speechRate}x
              </span>

              <button
                onClick={() => handleAnalyzeOralBridge()}
                disabled={isAnalyzing || (!spokenTranscript && !currentPresets.length)}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-orange-400 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-zinc-950" />
                    <span>विश्लेषण हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-zinc-950" />
                    <span>सेतु विश्लेषण करें (Bridge Speech)</span>
                  </>
                )}
              </button>
            </div>

            {/* Rural Multi-Dialect Authentic Presets */}
            <div className="space-y-2 border-t border-zinc-800 pt-3">
              <span className="text-[11px] font-medium text-zinc-400">
                प्राथमिक कक्षा के वास्तविक मौखिक नमूने (Click to Test):
              </span>
              <div className="space-y-1.5">
                {currentPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPresetIndex(idx);
                      setSpokenTranscript(preset);
                      handleAnalyzeOralBridge(preset);
                    }}
                    className={`w-full text-left rounded-lg p-2.5 text-xs border transition ${
                      spokenTranscript === preset
                        ? 'border-orange-500/80 bg-orange-500/10 text-orange-200'
                        : 'border-zinc-800 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif">"{preset}"</span>
                      <span className="text-[10px] text-zinc-500 font-mono">नमूना #{idx + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pedagogical Bridge Output (6 cols) */}
        <div className="space-y-4 lg:col-span-6">
          {bridgeResult ? (
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[10px] font-semibold text-orange-300 border border-orange-500/30">
                    {bridgeResult.detectedDialect}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    ध्वनि प्रवाह शुद्धता: {bridgeResult.fluencyScore}%
                  </span>
                </div>

                <button
                  onClick={() => handlePlayAudio(bridgeResult.homeDialectPraiseBridge)}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-orange-400 transition"
                >
                  {isPlayingAudio ? (
                    <>
                      <Square className="h-3.5 w-3.5 fill-current" />
                      <span>रुकें</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>कक्षा में सुनाएँ</span>
                    </>
                  )}
                </button>
              </div>

              {/* 1. Home Dialect Affirmation & Scaffolding */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span>मातृबोली में प्रोत्साहन व समझ (Home Dialect Affirmation):</span>
                </div>
                <p className="mt-2 text-sm text-amber-100 font-serif leading-relaxed italic bg-zinc-950/40 p-3 rounded-lg border border-amber-500/20">
                  "{bridgeResult.homeDialectPraiseBridge}"
                </p>
              </div>

              {/* 2. Vernacular vs Standard Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    छात्र की क्षेत्रीय बोली (Home Tongue)
                  </span>
                  <p className="mt-1 font-serif text-sm font-semibold text-zinc-200">
                    {bridgeResult.vernacularPhrasing}
                  </p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">
                    मानक पाठ्यपुस्तक समतुल्य (Standard Target)
                  </span>
                  <p className="mt-1 font-serif text-sm font-semibold text-emerald-200">
                    {bridgeResult.standardEquivalent}
                  </p>
                </div>
              </div>

              {/* 3. Phonetic Difference Analysis */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5">
                <span className="text-xs font-semibold text-blue-300">
                  ध्वन्यात्मक भेद व व्याकरणिक लक्षण (Phonetic Analysis):
                </span>
                <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                  {bridgeResult.phonemicDifference}
                </p>
              </div>

              {/* 4. Classroom Call-and-Response Rhythm Chant */}
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
                    <Music className="h-4 w-4 text-purple-400" />
                    <span>कक्षा समूह अभ्यास ताल-गीत (30-Sec Call & Response Chant):</span>
                  </div>
                  <button
                    onClick={() => handlePlayAudio(bridgeResult.classroomPracticeChant)}
                    className="text-xs text-purple-300 hover:text-white underline font-medium"
                  >
                    लय में गाएँ
                  </button>
                </div>
                <p className="mt-2 text-xs text-purple-100 font-serif leading-relaxed bg-zinc-950/40 p-3 rounded-lg border border-purple-500/20">
                  "{bridgeResult.classroomPracticeChant}"
                </p>
                <p className="mt-2 text-[10px] text-zinc-400 italic">
                  * शिक्षक स्वयं पहले पंक्ति बोले, फिर पूरी कक्षा ३८ बच्चे ताली बजाकर दोहराएँ।
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-8 text-center text-zinc-500">
              <Mic className="h-12 w-12 text-zinc-600 mb-3" />
              <h4 className="text-sm font-medium text-zinc-300">
                कोई मौखिक सेतु विश्लेषण अभी सक्रिय नहीं है
              </h4>
              <p className="mt-1 max-w-xs text-xs text-zinc-500">
                बाईं ओर माइक बटन दबाकर छात्र से उसकी बोली में बोलने को कहें या किसी नमूना वाक्य पर क्लिक करें।
              </p>
              <button
                onClick={() => handleAnalyzeOralBridge(currentPresets[0])}
                className="mt-4 flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3.5 py-1.5 text-xs font-medium text-orange-400 hover:bg-zinc-700 transition"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>प्रथम नमूना वाक्य से प्रारंभ करें</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
