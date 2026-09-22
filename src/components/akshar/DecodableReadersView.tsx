import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Play, 
  Square, 
  Sparkles, 
  CheckCircle, 
  HelpCircle, 
  Languages,
  Printer,
  ChevronRight,
  Layers
} from 'lucide-react';
import { DecodableStory, Dialect } from '../../types/akshar';
import { DECODABLE_STORIES } from '../../data/aksharData';

interface DecodableReadersViewProps {
  currentDialect: Dialect;
  chalkMode: boolean;
  speechRate: number;
}

export const DecodableReadersView: React.FC<DecodableReadersViewProps> = ({
  currentDialect,
  chalkMode,
  speechRate,
}) => {
  const [selectedStory, setSelectedStory] = useState<DecodableStory>(DECODABLE_STORIES[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDialectComparison, setShowDialectComparison] = useState(true);

  // Audio Playback
  const handlePlaySentence = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio && activeSentenceIndex === index) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        setActiveSentenceIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate || 0.85;
      utterance.lang = 'hi-IN';

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActiveSentenceIndex(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveSentenceIndex(null);
      };

      setActiveSentenceIndex(index);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`space-y-6 ${chalkMode ? 'font-sans' : ''}`}>
      {/* Banner */}
      <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white font-serif">
                श्रेणीबद्ध डिकोडेबल पठन पुस्तिकाएँ (NIPUN FLN Decodable Readers)
              </h2>
              <p className="text-xs text-zinc-400">
                ग्रामीण संदर्भों से जुड़ी छोटी कहानियाँ। मानक हिंदी के साथ मातृबोली समतुल्य वाक्य, शब्दावली कार्ड, और छात्र साथियों के लिए मौखिक प्रश्नोत्तरी।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDialectComparison(!showDialectComparison)}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-amber-300 border border-zinc-700 hover:bg-zinc-700"
            >
              <Languages className="h-3.5 w-3.5" />
              <span>{showDialectComparison ? 'बोली तुलना चालू' : 'केवल मानक हिंदी'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Story Selector Sidebar (4 cols) */}
        <div className="space-y-3 lg:col-span-4">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            कहानियाँ (Select Storycard):
          </span>
          <div className="space-y-2">
            {DECODABLE_STORIES.map((story) => (
              <button
                key={story.id}
                onClick={() => {
                  setSelectedStory(story);
                  setActiveSentenceIndex(null);
                }}
                className={`w-full text-left rounded-xl p-3.5 border transition ${
                  selectedStory.id === story.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                    स्तर {story.level} • कक्षा {story.grade}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    लक्ष्य वर्ण: {story.phonemeFocus.join(', ')}
                  </span>
                </div>
                <h3 className="mt-1.5 font-serif text-base font-bold text-white">
                  {story.title}
                </h3>
                <p className="text-xs text-amber-400/90 font-serif italic">
                  बोली नाम: "{story.dialectTitle}"
                </p>
              </button>
            ))}
          </div>

          {/* Vernacular Vocabulary Bridge Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-zinc-300">
              क्षेत्रीय ग्रामीण शब्दावली कोष (Vernacular Lexicon):
            </span>
            <div className="space-y-2">
              {selectedStory.vocabularyVernacular.map((vocab, i) => (
                <div key={i} className="rounded-lg bg-zinc-950 p-2.5 text-xs border border-zinc-800">
                  <div className="flex items-center justify-between font-serif font-bold">
                    <span className="text-amber-300">{vocab.dialect}</span>
                    <span className="text-zinc-500 text-[10px]">➜</span>
                    <span className="text-emerald-300">{vocab.standard}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    अर्थ: {vocab.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Reader Presentation (8 cols) */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border-2 border-zinc-800 bg-[#16181d] p-6 shadow-2xl space-y-6">
            {/* Story Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-800 pb-4">
              <div>
                <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-300">
                  स्तर {selectedStory.level} FLN कार्ड
                </span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-white">
                  {selectedStory.title}
                </h2>
                <p className="text-xs text-amber-400 italic font-serif">
                  ({selectedStory.dialectTitle})
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                <span className="font-mono">कक्षा {selectedStory.grade} लक्षित</span>
              </div>
            </div>

            {/* Sentences List with Audio Playback */}
            <div className="space-y-4">
              {selectedStory.sentences.map((sent, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 border transition ${
                    activeSentenceIndex === idx
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-zinc-800/80 bg-zinc-950/70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      {/* Standard Hindi line */}
                      <p className="font-serif text-lg font-bold text-zinc-100 leading-relaxed">
                        {sent.standard}
                      </p>

                      {/* Vernacular Dialect line */}
                      {showDialectComparison && (
                        <p className="font-serif text-sm text-amber-300/90 italic leading-relaxed">
                          "{sent.dialect}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlaySentence(sent.standard, idx)}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                        activeSentenceIndex === idx && isPlayingAudio
                          ? 'bg-amber-400 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }`}
                      title="वाक्य बोलकर सुनाएँ"
                    >
                      {activeSentenceIndex === idx && isPlayingAudio ? (
                        <Square className="h-3.5 w-3.5 fill-current" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Oral Comprehension Questions for Student Buddy Leaders */}
            <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <HelpCircle className="h-4 w-4 text-purple-400" />
                <span>दल नायक मौखिक समझ प्रश्न (Peer Captain Questions):</span>
              </div>
              <ul className="space-y-1.5 text-xs text-purple-100 list-disc list-inside">
                {selectedStory.comprehensionQuestions.map((q, i) => (
                  <li key={i} className="font-serif">{q}</li>
                ))}
              </ul>
              <p className="text-[10px] text-zinc-400 italic">
                * दल ३ के नायक बच्चे अपने साथी बच्चों से यह प्रश्न बिना पुस्तक देखे पूछेंगे।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
