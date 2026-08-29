import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Search,
  BookOpen,
  Calculator,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Pin,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { FORMULA_DATABASE } from '../../data/formulas';
import { FormulaEntry } from '../../types';

interface QuickFormulaOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  activeChapterId?: string;
  activeChapterTitle?: string;
}

export const QuickFormulaOverlay: React.FC<QuickFormulaOverlayProps> = ({
  isOpen,
  onClose,
  activeChapterId,
  activeChapterTitle,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedFormula, setSelectedFormula] = useState<FormulaEntry | null>(
    FORMULA_DATABASE[0] || null
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  
  // Interactive Calculator State
  const [calcInputA, setCalcInputA] = useState<number>(220); // e.g., Voltage
  const [calcInputB, setCalcInputB] = useState<number>(44); // e.g., Resistance

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return FORMULA_DATABASE.filter((f) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.plainText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        f.chapterName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'all' || f.subjectName.toLowerCase() === selectedSubject.toLowerCase();

      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  // Keep selected formula updated
  useEffect(() => {
    if (activeChapterId && !selectedFormula) {
      const match = FORMULA_DATABASE.find(
        (f) => f.chapterId === activeChapterId || f.chapterName.toLowerCase().includes((activeChapterTitle || '').toLowerCase())
      );
      if (match) setSelectedFormula(match);
    }
  }, [activeChapterId, activeChapterTitle, selectedFormula]);

  if (!isOpen) return null;

  const handleCopy = (formula: FormulaEntry) => {
    navigator.clipboard.writeText(`${formula.title}: ${formula.plainText} (${formula.latex})`);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const togglePin = (id: string) => {
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const calculateQuickValue = () => {
    if (!selectedFormula) return null;
    if (selectedFormula.id === 'form_ohms_law') {
      const current = calcInputB > 0 ? (calcInputA / calcInputB).toFixed(2) : '0';
      const power = (calcInputA * (calcInputA / calcInputB)).toFixed(1);
      return {
        label1: 'Current (I = V / R)',
        val1: `${current} Amperes (A)`,
        label2: 'Power Dissipated (P = V² / R)',
        val2: `${power} Watts (W)`,
      };
    }
    if (selectedFormula.id === 'form_lens_power' || selectedFormula.id === 'form_mirror_magnification') {
      const f = calcInputA;
      const power = f !== 0 ? (100 / f).toFixed(2) : '0';
      return {
        label1: 'Lens Power P (with f in cm)',
        val1: `${power} Dioptres (D)`,
        label2: 'Nature',
        val2: f > 0 ? 'Convex (Converging)' : 'Concave (Diverging)',
      };
    }
    if (selectedFormula.id === 'form_ph_scale') {
      const hPlus = Math.pow(10, -Math.min(Math.max(calcInputA, 0), 14));
      return {
        label1: '[H⁺] Hydronium Concentration',
        val1: `${hPlus.toExponential(2)} mol/L`,
        label2: 'Nature of Solution',
        val2: calcInputA < 7 ? 'Acidic Solution' : calcInputA === 7 ? 'Neutral' : 'Alkaline / Basic',
      };
    }
    return null;
  };

  const calcResult = calculateQuickValue();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-5xl h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-100">
                  Global Quick Formula & Derivation Cheat-Sheet
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  NCERT & JEE / NEET
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Instant high-yield formula reference, variable units, and interactive calculators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Close Cheat Sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Subject Filter Bar */}
        <div className="p-3.5 bg-zinc-900/50 border-b border-zinc-800 flex flex-col sm:flex-row gap-2.5 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search formulas, variables, concepts..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Subject Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'Physics', 'Mathematics', 'Chemistry', 'System Architecture'].map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  selectedSubject.toLowerCase() === sub.toLowerCase()
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {sub === 'all' ? '⚡ All Subjects' : sub}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: 2 Columns (List on left, Rich detail on right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Column: Formulas List (5 cols) */}
          <div className="md:col-span-5 border-r border-zinc-800 overflow-y-auto p-3 space-y-2 bg-zinc-950/60">
            {filteredFormulas.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No formulas match your search query. Try searching for "Ohm", "Lens", "Roots", "AP", or "pH".
              </div>
            ) : (
              filteredFormulas.map((f) => {
                const isSelected = selectedFormula?.id === f.id;
                const isPinned = pinnedIds.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFormula(f)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-zinc-900 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-zinc-950/80 border-zinc-800/80 hover:bg-zinc-900/60 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-amber-400">
                          {f.subjectName} • {f.chapterName}
                        </span>
                        <h4 className="text-xs font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                          {f.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {f.boardPyqFrequency && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-500/10 text-red-300 border border-red-500/20">
                            {f.boardPyqFrequency} PYQ
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(f.id);
                          }}
                          className={`p-1 rounded text-zinc-500 hover:text-amber-400 ${
                            isPinned ? 'text-amber-400' : ''
                          }`}
                          title="Pin formula"
                        >
                          <Pin className="w-3 h-3 fill-current" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 p-2 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-[11px] text-amber-200/90 truncate">
                      {f.plainText}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Deep Formula Breakdown & Interactive Playground (7 cols) */}
          <div className="md:col-span-7 overflow-y-auto p-4 sm:p-6 space-y-5 bg-zinc-950">
            {selectedFormula ? (
              <>
                {/* Title & Actions */}
                <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {selectedFormula.subjectName}
                      </span>
                      <span className="text-xs text-zinc-400">{selectedFormula.chapterName}</span>
                    </div>
                    <h2 className="text-lg font-black text-zinc-100">{selectedFormula.title}</h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(selectedFormula)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:border-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      {copiedId === selectedFormula.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Big Formula Display Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 border border-amber-500/30 text-center space-y-2 shadow-xl">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    Mathematical Statement
                  </div>
                  <div className="text-base sm:text-xl font-bold font-mono text-amber-300 py-1">
                    {selectedFormula.latex}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    {selectedFormula.plainText}
                  </div>
                </div>

                {/* Explanation */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Conceptual Explanation
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800">
                    {selectedFormula.explanation}
                  </p>
                </div>

                {/* Variables & SI Units Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 font-bold">
                    Variables & Physical Units
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedFormula.variables.map((v, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {v.symbol}
                          </span>
                          <span className="text-zinc-200 font-medium">{v.meaning}</span>
                        </div>
                        {v.unit && (
                          <span className="text-[11px] font-mono text-zinc-400">{v.unit}</span>
                        )}
                        {v.typicalValue && (
                          <span className="text-[11px] font-mono text-emerald-400">
                            {v.typicalValue}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Applications & Common Traps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Practical Applications */}
                  <div className="p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-1.5">
                    <h5 className="text-[11px] font-bold font-mono text-emerald-400 uppercase flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Exam Applications</span>
                    </h5>
                    <ul className="space-y-1 text-xs text-zinc-300">
                      {selectedFormula.applications.map((app, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0">•</span>
                          <span>{app}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Board Calculation Traps */}
                  {selectedFormula.commonMistakes && (
                    <div className="p-3.5 bg-red-950/20 border border-red-500/30 rounded-xl space-y-1.5">
                      <h5 className="text-[11px] font-bold font-mono text-red-400 uppercase flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Common Calculation Traps</span>
                      </h5>
                      <ul className="space-y-1 text-xs text-red-200/90">
                        {selectedFormula.commonMistakes.map((mistake, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-400 shrink-0">•</span>
                            <span>{mistake}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Interactive Instant Formula Value Calculator */}
                {calcResult && (
                  <div className="p-4 bg-zinc-900 border border-amber-500/30 rounded-2xl space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-amber-400" />
                        <h4 className="text-xs font-bold text-zinc-100">
                          Live Interactive Value Calculator
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">Test with your custom values</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                          Primary Variable (e.g. Voltage V / Focal Length f / pH)
                        </label>
                        <input
                          type="number"
                          value={calcInputA}
                          onChange={(e) => setCalcInputA(parseFloat(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                          Secondary Variable (e.g. Resistance R in Ω)
                        </label>
                        <input
                          type="number"
                          value={calcInputB}
                          onChange={(e) => setCalcInputB(parseFloat(e.target.value) || 0)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-100 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-zinc-400 text-[10px] font-mono uppercase block">
                          {calcResult.label1}:
                        </span>
                        <span className="text-amber-400 font-mono font-bold text-sm">
                          {calcResult.val1}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 text-[10px] font-mono uppercase block">
                          {calcResult.label2}:
                        </span>
                        <span className="text-emerald-400 font-mono font-bold text-sm">
                          {calcResult.val2}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs">
                Select a formula from the left panel to inspect its derivation and variable units.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
