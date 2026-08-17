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
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { queryAITutor } from '../../services/geminiService';
import { speakText, stopSpeaking } from '../../utils/speechUtils';

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_0',
      sender: 'ai',
      text: `Namaste! I am your AI Socratic Coach. We are exploring **${activeConceptTitle}**.
      
How can I help you master this concept? You can ask for:
- 💡 Progressive hints without giving away the direct answer
- 🏏 An everyday Indian analogy (Cricket, Chai, Traffic)
- 📐 Step-by-step formula derivation ($V = IR$, $P = V^2/R$)
- 🗣️ Explanation in natural Hindi, Hinglish, or your chosen language!`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
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
              stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

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

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tl-sm text-xs text-amber-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>StudyOS AI Coach is synthesizing Socratic guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request a clue..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-amber-500 text-zinc-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-400 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
