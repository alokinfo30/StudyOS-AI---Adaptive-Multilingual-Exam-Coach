import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Presentation, 
  FileText, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Calendar, 
  Award,
  Globe,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { SLIDE_DECK_CONTENT, SlideDeckItem } from '../../data/aksharData';

interface AksharPitchDeckViewProps {
  onJumpToTab?: (tab: 'snap' | 'oral' | 'tarl' | 'heatmap' | 'journey') => void;
}

export const AksharPitchDeckView: React.FC<AksharPitchDeckViewProps> = ({
  onJumpToTab,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const currentSlide: SlideDeckItem = SLIDE_DECK_CONTENT[currentSlideIndex];

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < SLIDE_DECK_CONTENT.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Navigation & Bar */}
      <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Presentation className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                प्रतियोगिता प्रस्तुति व मूल्यांकन स्लाइड डेक
              </span>
              <span className="text-xs text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">
                स्लाइड {currentSlide.slideNumber} / {SLIDE_DECK_CONTENT.length - 1}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              AksharSetu (अक्षरसेतु) Slide-by-Slide Submission Deck
            </h2>
          </div>
        </div>

        {/* Stepper Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-700 bg-zinc-900 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40 transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>पिछला</span>
          </button>

          <span className="font-mono text-xs font-bold px-2 text-amber-400">
            {currentSlideIndex + 1} / {SLIDE_DECK_CONTENT.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentSlideIndex === SLIDE_DECK_CONTENT.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/20 text-xs font-semibold text-amber-300 hover:bg-amber-500/30 disabled:opacity-40 transition"
          >
            <span>अगला</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Quick Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SLIDE_DECK_CONTENT.map((slide, idx) => (
          <button
            key={slide.slideNumber}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition border ${
              currentSlideIndex === idx
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold shadow-md'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            {slide.slideCode.split(':')[0]}
          </button>
        ))}
      </div>

      {/* Slide Canvas */}
      <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Slide Header & Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-800 gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs font-mono font-bold text-amber-400 border border-zinc-700">
              {currentSlide.slideCode}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {currentSlide.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Foundational Literacy & Numeracy Track (FLN)</span>
          </div>
        </div>

        {/* Slide Title & Headline */}
        <div className="my-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-serif">
            {currentSlide.title}
          </h1>
          <p className="text-base sm:text-lg font-medium text-amber-300">
            {currentSlide.headline}
          </p>
        </div>

        {/* Slide Specific Visual Layouts */}

        {/* Slide 0: Title Page Visual */}
        {currentSlide.slideNumber === 0 && (
          <div className="my-6 rounded-2xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  Ambient Multi-Dialect AI Co-Teacher
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white font-serif tracking-tight">
                  अक्षरसेतु (AksharSetu)
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  Transforming multigrade primary classrooms through single-device ambient multimodal vision diagnostics, dialect-to-standard phonetic bridges, and autonomous TaRL micro-grouping.
                </p>
                <div className="text-xs text-zinc-400 space-y-1">
                  <div><strong>Lead System Architect:</strong> Alok Srivastava & Collaborators</div>
                  <div><strong>Track:</strong> Classroom Complexity & Teacher Support</div>
                  <div><strong>Date:</strong> September 2026</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-2xl font-black text-amber-400 font-mono">1</div>
                  <div className="text-xs text-zinc-300 font-bold mt-1">शिक्षक फोन</div>
                  <div className="text-[10px] text-zinc-500">100% शून्य छात्र टैबलेट</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-2xl font-black text-emerald-400 font-mono">7+</div>
                  <div className="text-xs text-zinc-300 font-bold mt-1">क्षेत्रीय बोलियाँ</div>
                  <div className="text-[10px] text-zinc-500">भोजपुरी, अवधी, मैथिली...</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-2xl font-black text-blue-400 font-mono">3</div>
                  <div className="text-xs text-zinc-300 font-bold mt-1">TaRL दक्षता दल</div>
                  <div className="text-[10px] text-zinc-500">स्वायत्त 5-मिनट खेल</div>
                </div>
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div className="text-2xl font-black text-purple-400 font-mono">0</div>
                  <div className="text-xs text-zinc-300 font-bold mt-1">इंटरनेट बाधा</div>
                  <div className="text-[10px] text-zinc-500">100% ऑफलाइन एज-फर्स्ट</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: Personas & Ground Environment */}
        {currentSlide.slideNumber === 4 && (
          <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">प्राथमिक शिक्षिका: सुमन देवी</h4>
                  <p className="text-xs text-zinc-400">कक्षा १ और २ की संयुक्त कक्षा संचालिका</p>
                </div>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
                <li>38 छात्रों को एक ही कमरे में विभिन्न अधिगम स्तरों पर पढ़ाना।</li>
                <li>मध्यम बजट का एंड्रॉइड स्मार्टफोन, जिसमें अक्सर 3G/4G नेटवर्क गायब रहता है।</li>
                <li>कागजी काम या जटिल ऐप मेनू में समय गंवाने का शून्य अवसर।</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">कठोर जमीनी बाधाएं (Ground Constraints)</h4>
                  <p className="text-xs text-zinc-400">ग्रामीण प्राथमिक विद्यालय वास्तविकता</p>
                </div>
              </div>
              <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside">
                <li><strong>हार्डवेयर सीमा:</strong> प्रति कक्षा केवल 1 स्मार्टफोन (शिक्षक का)।</li>
                <li><strong>कनेक्टिविटी:</strong> कक्षा घंटों में अक्सर नेटवर्क ब्लैकआउट।</li>
                <li><strong>शोर का स्तर:</strong> 40 बच्चों का निरंतर परिवेशीय कोलाहल।</li>
              </ul>
            </div>
          </div>
        )}

        {/* Slide 7: Competitive Differentiation Table */}
        {currentSlide.slideNumber === 7 && (
          <div className="my-6 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400">
                    <th className="p-3 font-bold">सुविधा व मानक (Metric)</th>
                    <th className="p-3 font-semibold text-zinc-400">पारंपरिक EdTech (टैबलेट लैब)</th>
                    <th className="p-3 font-semibold text-zinc-400">जेनेरिक GenAI चैटबॉट्स</th>
                    <th className="p-3 font-bold text-amber-400 bg-amber-500/10 border-l border-r border-amber-500/20">
                      AksharSetu (हमारा समाधान)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">हार्डवेयर निर्भरता</td>
                    <td className="p-3 text-red-400">उच्च (1:1 छात्र टैबलेट / $200+)</td>
                    <td className="p-3 text-amber-400">स्क्रीन टाइपिंग आवश्यक</td>
                    <td className="p-3 text-emerald-400 font-bold bg-amber-500/5 border-l border-r border-amber-500/20">
                      शून्य छात्र हार्डवेयर (1 फोन/कक्षा)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">बोली समावेशिता</td>
                    <td className="p-3 text-red-400">केवल मानक भाषा (Hindi/Eng)</td>
                    <td className="p-3 text-red-400">गैर-मानक बोलियों पर विफल</td>
                    <td className="p-3 text-emerald-400 font-bold bg-amber-500/5 border-l border-r border-amber-500/20">
                      अनुकूली बोली-से-मानक ध्वनि सेतु (7+ बोलियाँ)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">मूल्यांकन दृष्टिकोण</td>
                    <td className="p-3 text-zinc-400">बाइनरी बहुविकल्पीय / सही-गलत</td>
                    <td className="p-3 text-zinc-400">केवल टेक्स्ट प्राम्प्टिंग</td>
                    <td className="p-3 text-emerald-400 font-bold bg-amber-500/5 border-l border-r border-amber-500/20">
                      स्लेट लिखावट संज्ञानात्मक त्रुटि निदान
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">कक्षा गतिकी</td>
                    <td className="p-3 text-red-400">व्यक्तिगत बच्चे को अलग-थलग करता है</td>
                    <td className="p-3 text-zinc-400">बहु-कक्षा के लिए अनुपयुक्त</td>
                    <td className="p-3 text-emerald-400 font-bold bg-amber-500/5 border-l border-r border-amber-500/20">
                      टीएआरएल दल विभाजन व सहपाठी खेल
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">इंटरनेट आवश्यकता</td>
                    <td className="p-3 text-red-400">निरंतर हाई-स्पीड स्ट्रीमिंग</td>
                    <td className="p-3 text-red-400">निरंतर क्लाउड विलंबता</td>
                    <td className="p-3 text-emerald-400 font-bold bg-amber-500/5 border-l border-r border-amber-500/20">
                      एज-फर्स्ट, पूर्ण ऑफलाइन कतार सिंक
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Slide 8: Technology Stack Diagram */}
        {currentSlide.slideNumber === 8 && (
          <div className="my-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Cpu className="h-4 w-4" />
                <span>Frontier AI Engine</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5">
                <li>• <strong>Vision:</strong> Gemini 3.8-flash / Claude 3.5 Sonnet multimodal handwriting reasoning</li>
                <li>• <strong>Speech:</strong> Indic Whisper + Bhashini noise-robust speech recognition</li>
                <li>• <strong>Reasoning:</strong> Sub-prompt dynamic pedagogical lesson formulation</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                <Smartphone className="h-4 w-4" />
                <span>Edge & Client</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5">
                <li>• <strong>Client:</strong> React 18 PWA with Tailwind CSS & Motion</li>
                <li>• <strong>Offline Store:</strong> IndexedDB & SQLite for zero-network execution</li>
                <li>• <strong>Privacy:</strong> On-device biometric scrubbing before cloud sync</li>
              </ul>
            </div>

            <div className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Globe className="h-4 w-4" />
                <span>Cloud & Queue</span>
              </div>
              <ul className="text-xs text-zinc-300 space-y-1.5">
                <li>• <strong>API Layer:</strong> Node.js / FastAPI containerized microservices</li>
                <li>• <strong>Asynchronous Queues:</strong> Redis & BullMQ for deferred slate processing</li>
                <li>• <strong>Dissemination:</strong> BEO daily WhatsApp digest via Twilio/Meta API</li>
              </ul>
            </div>
          </div>
        )}

        {/* Standard Key Points Breakdown for All Slides */}
        <div className="my-6 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            मुख्य स्तंभ व विवरण (Key Strategic Points):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentSlide.keyPoints.map((pt, i) => (
              <div
                key={`pt-${i}`}
                className="rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3.5 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white text-xs">{pt.label}</span>
                </div>
                <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                  {pt.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-zinc-800 gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>संबद्ध लाइव मॉड्यूल:</span>
            {currentSlide.slideNumber === 2 && (
              <button
                onClick={() => onJumpToTab?.('snap')}
                className="text-amber-400 hover:underline font-bold"
              >
                स्लेट दृष्टि जाँच खोलें ➔
              </button>
            )}
            {currentSlide.slideNumber === 3 && (
              <button
                onClick={() => onJumpToTab?.('heatmap')}
                className="text-emerald-400 hover:underline font-bold"
              >
                निपुण हीटमैप खोलें ➔
              </button>
            )}
            {currentSlide.slideNumber === 5 && (
              <button
                onClick={() => onJumpToTab?.('journey')}
                className="text-blue-400 hover:underline font-bold"
              >
                दैनिक 4-चरणीय यात्रा खोलें ➔
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="text-zinc-400 hover:text-white disabled:opacity-30"
            >
              ← पिछली स्लाइड
            </button>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === SLIDE_DECK_CONTENT.length - 1}
              className="text-amber-400 font-bold hover:text-amber-300 disabled:opacity-30"
            >
              अगली स्लाइड →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
