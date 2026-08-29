import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Volume2,
  HelpCircle,
  Brain,
  Zap,
  RotateCcw,
  Mic,
  MicOff,
  Radio,
  Globe,
  Activity,
  MessageSquare,
} from 'lucide-react';
import { LanguageCode, VoicePerformanceMetrics } from '../../types';
import { queryAITutor } from '../../services/geminiService';
import { speakText, stopSpeaking } from '../../utils/speechUtils';
import { useVoiceDictation, DICTATION_LANGUAGES } from '../../hooks/useVoiceDictation';
import { analyzeVoicePerformance } from '../../services/voiceAnalyticsService';
import { VoicePerformanceAnalytics } from './VoicePerformanceAnalytics';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  activeConceptTitle?: string;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: number;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  language,
  activeConceptTitle = "Ohm's Law & Circuit Analysis",
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice_analytics'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_0',
      sender: 'ai',
      text: `Namaste! I am your AI Socratic Coach. We are exploring **${activeConceptTitle}**.
      
How can I help you master this concept? You can ask for:
- 💡 Progressive hints without giving away the direct answer
- 🏏 An everyday Indian analogy (Cricket, Chai, Traffic)
- 📐 Step-by-step formula derivation ($V = IR$, $P = V^2/R$)
- 🎙️ Or tap the microphone to speak your question and get instant Voice & Tone Confidence feedback!`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [showVoiceLangMenu, setShowVoiceLangMenu] = useState(false);
  const [latestVoiceMetrics, setLatestVoiceMetrics] = useState<VoicePerformanceMetrics | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Map app language code to speech dictation default language
  const defaultSpeechLang = language === 'hi' || language === 'hinglish' ? 'hi-IN' : 'en-IN';

  // Voice Dictation Hook integration
  const {
    isListening,
    interimTranscript,
    error: voiceError,
    isSupported: isVoiceSupported,
    durationSeconds,
    toggleListening,
    stopListening,
    selectedLang,
    setSelectedLang,
  } = useVoiceDictation({
    language: defaultSpeechLang,
    continuous: true,
    onResult: (chunk, isFinal) => {
      if (chunk) {
        setInput((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${chunk}` : chunk;
        });
      }
    },
  });

  const handleStopListeningAndAnalyze = () => {
    stopListening();
    if (input.trim() || interimTranscript.trim()) {
      const fullSpoken = (input + ' ' + interimTranscript).trim();
      const evaluated = analyzeVoicePerformance(fullSpoken, durationSeconds);
      setLatestVoiceMetrics(evaluated);
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (isListening) {
        stopListening();
      }
      stopSpeaking();
    }
  }, [messages, isOpen, isListening, stopListening]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    if (isListening) {
      stopListening();
    }

    const textToSend = customPrompt || input.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    const tutorRes = await queryAITutor(textToSend, language, activeConceptTitle);

    const aiMsg: Message = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: tutorRes.text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(msgId);
      speakText(text, language, () => setSpeakingMsgId(null));
    }
  };

  const quickPrompts = [
    '🏏 Explain with a cricket analogy',
    '💡 Give me a Socratic hint',
    '⚡ Why does $P = V^2/R$ vs $P = I^2R$ confuse students?',
    '🇮🇳 Explain in Smart Hinglish',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl animate-slideInRight">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-zinc-950 font-bold">
              <Sparkles className="w-4 h-4 fill-zinc-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <span>StudyOS Socratic Coach</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {language.toUpperCase()}
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">{activeConceptTitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isListening) stopListening();
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Close AI Coach"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Header */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/80 px-3 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'chat'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60 rounded-t-lg'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Socratic Tutor</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('voice_analytics')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'voice_analytics'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60 rounded-t-lg'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Voice Tone & Confidence</span>
            {latestVoiceMetrics && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Content Body based on Active Tab */}
        {activeTab === 'voice_analytics' ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <VoicePerformanceAnalytics
              metrics={latestVoiceMetrics}
              onSimulateTestSpeech={(text, dur) => {
                const evaluated = analyzeVoicePerformance(text, dur);
                setLatestVoiceMetrics(evaluated);
              }}
            />
          </div>
        ) : (
          <>
            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-zinc-900/50 border-b border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-zinc-800/80 text-zinc-300 hover:text-amber-300 hover:bg-zinc-800 border border-zinc-700/60 whitespace-nowrap transition-colors"
                >
                  {qp}
                </button>
              ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const isAI = m.sender === 'ai';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} space-y-1`}
                  >
                    <div
                      className={`max-w-[88%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAI
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-sm shadow-sm'
                          : 'bg-amber-500 text-zinc-950 font-medium rounded-tr-sm shadow-md'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.text}</div>
                    </div>

                    {isAI && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          onClick={() => handleToggleSpeak(m.id, m.text)}
                          className={`text-[10px] flex items-center gap-1 font-mono transition-colors ${
                            speakingMsgId === m.id
                              ? 'text-emerald-400 font-bold'
                              : 'text-zinc-400 hover:text-zinc-300'
                          }`}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{speakingMsgId === m.id ? 'Speaking...' : 'Listen'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Real-time Voice Dictation Waveform & Interim Transcription Banner */}
              {isListening && (
                <div className="p-3.5 bg-gradient-to-r from-red-950/70 to-zinc-900 border border-red-500/40 rounded-2xl text-xs text-red-200 animate-pulse space-y-2 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-bold text-red-400 font-mono">
                        Listening ({durationSeconds}s) • {selectedLang}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStopListeningAndAnalyze}
                      className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 hover:bg-red-500/40 text-[10px] font-mono border border-red-500/30 transition-all"
                    >
                      Done & Analyze Tone
                    </button>
                  </div>

                  {interimTranscript ? (
                    <p className="text-zinc-200 italic font-mono text-[11px] bg-zinc-950/60 p-2 rounded-lg border border-red-500/20">
                      "{interimTranscript}..."
                    </p>
                  ) : (
                    <p className="text-zinc-400 text-[11px]">
                      Speak clearly into your microphone (e.g., "Why does current split in parallel circuits?")...
                    </p>
                  )}
                </div>
              )}

              {latestVoiceMetrics && (
                <div className="p-3 bg-zinc-900/90 border border-amber-500/30 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5" />
                      Latest Voice Check: {latestVoiceMetrics.confidenceScore}% Confidence ({latestVoiceMetrics.wpm} WPM)
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('voice_analytics')}
                      className="text-[10px] text-amber-300 underline font-mono"
                    >
                      View Full Analysis &rarr;
                    </button>
                  </div>
                </div>
              )}

              {voiceError && !isListening && (
                <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-300">
                  ⚠️ {voiceError}
                </div>
              )}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm text-xs text-amber-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>StudyOS AI Coach is synthesizing Socratic guidance...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}

        {/* Input Bar with Web Speech Dictation Controls */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/90 space-y-2">
          {/* Voice Language Selector Pill */}
          {showVoiceLangMenu && (
            <div className="p-2 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center gap-1.5 flex-wrap animate-fadeIn text-[11px]">
              <span className="text-zinc-400 font-mono pl-1">Speech Accent:</span>
              {DICTATION_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setShowVoiceLangMenu(false);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                    selectedLang === lang.code
                      ? 'bg-amber-500 text-zinc-950 font-bold'
                      : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-700'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-1.5"
          >
            {/* Voice Dictation Toggle Button */}
            <button
              type="button"
              onClick={() => toggleListening()}
              className={`p-2.5 rounded-xl border transition-all relative flex items-center justify-center shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white border-red-400 animate-pulse shadow-lg shadow-red-500/30'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:text-amber-400 hover:border-amber-500/50 hover:bg-zinc-900'
              }`}
              title={
                isListening
                  ? 'Stop Voice Dictation'
                  : 'Dictate Question (Web Speech API Voice-to-Text)'
              }
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-white" />
              ) : (
                <Mic className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Language Accent Switcher Trigger */}
            <button
              type="button"
              onClick={() => setShowVoiceLangMenu((prev) => !prev)}
              className="hidden sm:flex p-2.5 rounded-xl bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700 text-[10px] font-mono shrink-0"
              title="Change Speech Recognition Accent"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening ? 'Listening to your voice...' : 'Ask a question or dictate via mic...'
              }
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-all shrink-0"
              title="Send to AI Coach"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
