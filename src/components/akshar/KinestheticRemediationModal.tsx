import React, { useState } from 'react';
import { X, Play, RotateCcw, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface KinestheticRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  drillType: 'letter_split' | 'latin_mirror' | 'bead_frame';
  studentName?: string;
}

export const KinestheticRemediationModal: React.FC<KinestheticRemediationModalProps> = ({
  isOpen,
  onClose,
  drillType: initialDrill,
  studentName = 'छात्र',
}) => {
  const [activeDrill, setActiveDrill] = useState<'letter_split' | 'latin_mirror' | 'bead_frame'>(initialDrill);
  
  // State for letter split trace (Devanagari 'व' vs 'ब')
  const [traceStep, setTraceStep] = useState<number>(0);
  
  // State for Latin 'b' vs 'd' orientation
  const [latinSelected, setLatinSelected] = useState<'b' | 'd' | null>(null);

  // State for Bead Frame (Abacus / गिनाती माला)
  // Example calculation: 27 + 15 = 42
  const [tensBeads, setTensBeads] = useState<number>(2); // 2 tens
  const [unitBeads, setUnitBeads] = useState<number>(7); // 7 units
  const [addedTens, setAddedTens] = useState<number>(1); // +1 ten
  const [addedUnits, setAddedUnits] = useState<number>(5); // +5 units
  const [isBundled, setIsBundled] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-700 p-4 sm:p-6 shadow-2xl text-zinc-100 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                1-मिनट शारीरिक व दृश्य निवारण अभ्यास (Kinesthetic Micro-Drill)
              </h3>
              <p className="text-xs text-zinc-400">
                लक्षित छात्र: <span className="text-amber-400 font-semibold">{studentName}</span> • बहुभाषी कक्षा हस्तक्षेप
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drill Mode Tabs */}
        <div className="flex flex-wrap gap-2 my-4">
          <button
            onClick={() => { setActiveDrill('letter_split'); setTraceStep(0); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              activeDrill === 'letter_split'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            १. 'व' और 'ब' पेट-काट रेखांकन
          </button>
          <button
            onClick={() => setActiveDrill('latin_mirror')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              activeDrill === 'latin_mirror'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            २. 'b' vs 'd' दर्पण विभेद
          </button>
          <button
            onClick={() => setActiveDrill('bead_frame')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              activeDrill === 'bead_frame'
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            ३. गिनाती माला (10-बंडल हासिल जोड़)
          </button>
        </div>

        {/* Drill 1: Devanagari 'व' vs 'ब' kinesthetic stroke */}
        {activeDrill === 'letter_split' && (
          <div className="space-y-4 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  ध्वनि व हस्त-कौशल दिशा-निर्देश (Stroke Directionality)
                </span>
                <h4 className="text-sm font-bold text-white">
                  भोजपुरी प्रभाव: 'वजन' को 'बजन' बोलने पर स्लेट पर 'व' का पेट काटने से रोकें
                </h4>
                <p className="text-xs text-zinc-400 max-w-md">
                  अंगुली को रेत की थाली (Sand-tray) या स्लेट पर चलाएं। 'व' में पेट पूरा गोल रहता है, जबकि 'ब' में बीच से तिरछी रेखा कटती है।
                </p>
              </div>

              {/* Interactive Visual Trace Display */}
              <div className="relative flex h-36 w-36 items-center justify-center rounded-2xl bg-zinc-900 border-2 border-dashed border-amber-500/50 shadow-inner select-none">
                <span className="font-serif text-7xl font-bold text-white transition-all">
                  {traceStep === 0 ? 'व' : traceStep === 1 ? 'व' : 'ब'}
                </span>
                {traceStep === 1 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-10 w-1 bg-amber-400 rotate-45 animate-pulse rounded-full" />
                  </div>
                )}
                <div className="absolute bottom-1 right-2 text-[10px] text-zinc-400 font-mono">
                  {traceStep === 0 ? 'चरण १: व' : traceStep === 1 ? 'चरण २: कट रेखा' : 'चरण ३: पूर्ण ब'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTraceStep((prev) => (prev + 1) % 3)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3 py-1.5 font-bold transition"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>अगला चरण दिखाएं ({traceStep + 1}/3)</span>
                </button>
                <button
                  onClick={() => setTraceStep(0)}
                  className="flex items-center gap-1 text-zinc-400 hover:text-white px-2 py-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>पुनः शुरू</span>
                </button>
              </div>

              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-emerald-400 text-[11px] font-medium">
                भौतिक युक्ति: छात्र से हवा में बड़ी अंगुली से 3 बार ट्रेस करवाएं
              </div>
            </div>
          </div>
        )}

        {/* Drill 2: Latin 'b' vs 'd' inversion & mirroring */}
        {activeDrill === 'latin_mirror' && (
          <div className="space-y-4 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                स्थानिक भ्रम व दर्पण निवारण (Spatial Orientation Drill)
              </span>
              <h4 className="text-sm font-bold text-white">
                "Bat before Ball" (b) बनाम "Doughnut before Stick" (d)
              </h4>
              <p className="text-xs text-zinc-400">
                बच्चे अक्सर 'd' को 'b' के रूप में उलट देते हैं। दोनों अक्षरों को पहचान कर सही टोकन पर टैप करें:
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setLatinSelected('b')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition ${
                  latinSelected === 'b'
                    ? 'bg-blue-500/20 border-blue-400 text-white shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span className="text-5xl font-mono font-bold mb-2">b</span>
                <span className="text-xs font-bold text-blue-400">बल्ला पहले, फिर गेंद</span>
                <span className="text-[11px] text-zinc-400">Straight line (bat) down, then loop (ball) right</span>
              </button>

              <button
                onClick={() => setLatinSelected('d')}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border transition ${
                  latinSelected === 'd'
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <span className="text-5xl font-mono font-bold mb-2">d</span>
                <span className="text-xs font-bold text-emerald-400">डोनट पहले, फिर छड़ी</span>
                <span className="text-[11px] text-zinc-400">Round circle (doughnut) left, then line down</span>
              </button>
            </div>

            {latinSelected && (
              <div className="flex items-center gap-2 rounded-lg bg-zinc-900 border border-zinc-700 p-2.5 text-xs text-zinc-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  बहुत अच्छे! छात्र को अपने दोनों हाथों से 'b' और 'd' का संकेत (Thumbs up shape) बनाकर छाती से लगाकर सिखाएं।
                </span>
              </div>
            )}
          </div>
        )}

        {/* Drill 3: Visual Bead Frame (गिनाती माला) for Place-Value carryover */}
        {activeDrill === 'bead_frame' && (
          <div className="space-y-4 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                स्थानीय मान व हासिल जोड़ (Place-Value Regrouping)
              </span>
              <h4 className="text-sm font-bold text-white">
                समस्या: २७ + १५ = ? (गलत उत्तर: ३१२ के स्थान पर सही ४२ समझना)
              </h4>
              <p className="text-xs text-zinc-400">
                इकाई (Units) में ७ + ५ = १२ मनके हो गए। जब १० मनके पूरे होते हैं, तो उन्हें १ दहाई (Tens Rod) में बदल दिया जाता है।
              </p>
            </div>

            {/* Visual Abacus / Bead-frame */}
            <div className="space-y-3 rounded-xl bg-zinc-900 border border-zinc-800 p-4">
              <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-zinc-800">
                <span className="text-amber-400">दहाई (Tens = 10s)</span>
                <span className="text-blue-400">इकाई (Units = 1s)</span>
              </div>

              {/* Tens Rod */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>दहाई रॉड ({isBundled ? tensBeads + addedTens + 1 : tensBeads + addedTens} दहाई = {(isBundled ? tensBeads + addedTens + 1 : tensBeads + addedTens) * 10})</span>
                  {isBundled && <span className="text-emerald-400 font-bold">+1 हासिल दहाई शामिल!</span>}
                </div>
                <div className="flex items-center gap-1.5 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                  {Array.from({ length: isBundled ? 4 : 3 }).map((_, i) => (
                    <div
                      key={`ten-${i}`}
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        i === 3 ? 'bg-emerald-500 text-zinc-950 ring-2 ring-emerald-300 animate-bounce' : 'bg-amber-500 text-zinc-950'
                      }`}
                    >
                      १०
                    </div>
                  ))}
                  <span className="text-xs text-zinc-400 ml-2">= {isBundled ? '४०' : '३०'}</span>
                </div>
              </div>

              {/* Units Rod */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>इकाई रॉड ({isBundled ? '२ मनके बाकी' : '१२ मनके (१० + २)'})</span>
                  {!isBundled ? (
                    <span className="text-red-400 font-bold">१० से ज्यादा हैं! बंडल बनाएं</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">२ बची हुई इकाई</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                  {Array.from({ length: isBundled ? 2 : 12 }).map((_, i) => (
                    <div
                      key={`unit-${i}`}
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        !isBundled && i < 10
                          ? 'bg-red-500/80 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      १
                    </div>
                  ))}
                  <span className="text-xs text-zinc-400 ml-2">
                    = {isBundled ? '२' : '१२'}
                  </span>
                </div>
              </div>

              {/* Regrouping Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setIsBundled(!isBundled)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition border ${
                    !isBundled
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 border-emerald-400'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {!isBundled ? (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>१० इकाई मनकों को १ दहाई में बंडल करें (Carry 1)</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>पुनः अलग करें (Reset Regroup)</span>
                    </>
                  )}
                </button>

                <div className="text-sm font-extrabold text-amber-400">
                  अंतिम जोड़: {isBundled ? '४२' : '३ दहाई १२ इकाई'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
          <span>शारीरिक सामग्री: कंकड़, माचिस की तीलियाँ, रेत-थाली</span>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-1.5 font-semibold transition"
          >
            बंद करें (Done)
          </button>
        </div>
      </div>
    </div>
  );
};
